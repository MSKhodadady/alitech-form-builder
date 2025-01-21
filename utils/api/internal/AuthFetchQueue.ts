import type { ResponseTyped } from "~/types/response/ResponseShape";
import { apiErrLog, errLog } from "~/utils/error/errLog";
import { NotLoggedInError } from "~/utils/error/NotLoggedInError";

export type FetchOptions = {
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  queries?: { [k: string]: string };
  body?: any;
};

type QueueItem = {
  fetchOptions: FetchOptions;
  fetchResolve: (resp: Response) => void;
  fetchReject: (reason: any) => void;
};

/**
 * This is class is just a queue for fetch actions,
 * for doing fetch actions in order and if some fetch faced 403,
 * automatically fetches new access token once for that fetch and fetches coming after that.
 *
 * Only one queue must be used, so use this class with `Singleton` pattern.
 */
class AuthFetchQueue {
  #queue: QueueItem[] = [];
  #isProcessing = false;
  #serverAddress: string;
  #accessToken: string | null = null;
  #logEnabled = false;

  /**
   * @param logEnabled If you want to log this class actions.
   */
  constructor(logEnabled = false) {
    const {
      public: { serverAddress },
    } = useRuntimeConfig();
    this.#serverAddress = serverAddress;

    if (import.meta.client) {
      this.#accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
    }

    this.#logEnabled = logEnabled;

    console.log(`AuthFetchQueue initiated!`);
  }

  /**
   * Call it after login, to set `access token` for this class.
   * This is just for easier access to `access` token, so we don't have to get from `localStorage` every time.
   * @note There is no problem with page refresh, because in `constructor` function, we read `access token` from `localStorage`.
   */
  setAccessToken(accessToken: string) {
    this.#accessToken = accessToken;
  }

  /**
   * Call this function for fetching, and just `await` for result.
   * This function puts the request in queue, and queue processes the req and resolves the result.
   */
  fetcher<Data = any, Err = any>(
    fetchOptions: FetchOptions
  ): Promise<ResponseTyped<Data, Err>> {
    if (this.#accessToken == null) throw new NotLoggedInError();

    return new Promise((fetchResolve: (t: Response) => void, fetchReject) => {
      this.#queue.push({ fetchOptions, fetchResolve, fetchReject });

      this.#log(`added to queue - ${fetchOptions.method}:${fetchOptions.url}`);
      //: Start the process queue if not started.
      this.#processQueue();
    });
  }

  #log(str: string) {
    if (this.#logEnabled) {
      console.info(`[auth-queue] - ${str}`);
    }
  }

  /**
   * Picks fetch request one by one and resolves them.
   */
  async #fetchQueueResolver() {
    if (this.#isProcessing || this.#queue.length === 0) {
      return;
    }

    this.#isProcessing = true;
    this.#log(`start resolving queue`);

    while (this.#queue.length > 0) {
      const P = this.#queue.shift()!;
      await this.#fetchResolver(P);
    }

    this.#isProcessing = false;
    this.#log(`stop resolving queue`);
  }

  /**
   * Resolver function for every fetch req.
   * If the fetch encountered 403, it fetches access token also.
   */
  async #fetchResolver(P: QueueItem) {
    const serverAddress = this.#serverAddress;
    const accessToken = this.#accessToken;
    const {
      fetchOptions: { url, method, body, queries },
      fetchResolve,
      fetchReject,
    } = P;

    this.#log(`start resolving fetch ${method}:${url}`);

    if (accessToken == null) {
      fetchReject(new NotLoggedInError());
      return;
    }

    const endUrl = `${serverAddress}${url}`;

    try {
      const res = await fetch(
        `${endUrl}?${Object.entries(queries ?? {})
          .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
          .join("&")}`,
        {
          method,
          body: body ? JSON.stringify(body) : undefined,
          headers: {
            ...(body != undefined
              ? { "Content-Type": "application/json" }
              : {}),
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      //: me must fetch access token
      if (res.status == 403) {
        const newAccessToken = await this.#refreshToken();

        //: refresh token expired
        if (newAccessToken == "not-logged-in") {
          fetchReject(new NotLoggedInError());
          this.#clearQueue();
          return;
        }

        if (newAccessToken == "error") {
          fetchReject(new Error("error fetching access token"));
          return;
        }

        this.#accessToken = newAccessToken.access;

        await this.#fetchResolver(P);
      } else {
        fetchResolve(res);
        this.#log(`end resolving fetch ${method}:${url}`);
      }
    } catch (error) {
      fetchReject(error);
    }
  }

  /**
   * Start the process queue if not started.
   */
  #processQueue() {
    if (!this.#isProcessing) {
      this.#fetchQueueResolver();
    }
  }

  /**
   * fetches the access token
   * @returns access token
   */
  async #refreshToken(): Promise<
    "error" | "not-logged-in" | { access: string }
  > {
    const serverAddress = this.#serverAddress;

    console.info(` --- fetching new access token ...`);

    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    const url = `${serverAddress}/main/main/refresh?token=${refreshToken}`;

    try {
      const res = await fetch(url, { method: "POST" });

      if (res.ok) {
        console.info(` --- access token fetched!`);
        const {
          data: { access },
        } = await res.json();
        return { access };
      } else if (res.status == 403) {
        console.warn(` --- fetch access token failed -- need login`);
        return "not-logged-in";
      } else {
        apiErrLog(`AuthFetchQueue-refreshToken`, res.status, await res.text());

        return "error";
      }
    } catch (error) {
      errLog(`AuthFetchQueue-refreshToken`, error);
      return "error";
    }
  }

  /**
   * Clear the queue if access token is expired.
   */
  #clearQueue() {
    this.#queue.map((i) => i.fetchReject(new NotLoggedInError()));
    this.#queue = [];
  }
}

/**
 * This variable, is for using AuthFetchQueue in singleton way.
 */
let __global__authFetchQueue: undefined | AuthFetchQueue = undefined;

/**
 * Calling this function is not necessary but is better.
 * Also you can set `authFetchLog` to true if you want to enable log.
 */
export function initAuthFetchQueue(authFetchLog: boolean = false) {
  if (__global__authFetchQueue == undefined) {
    __global__authFetchQueue = new AuthFetchQueue(authFetchLog);
  }
  return __global__authFetchQueue;
}

/**
 * Call this function to get AuthFetchQueue singleton.
 */
export function getAuthFetchQueue() {
  return initAuthFetchQueue();
}
