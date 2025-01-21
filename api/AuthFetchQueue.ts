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

class AuthFetchQueue {
  #queue: QueueItem[] = [];
  #isProcessing = false;
  #serverAddress: string;
  #accessToken: string | null = null;
  #logEnabled = false;

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

  setAccessToken(accessToken: string) {
    this.#accessToken = accessToken;
  }

  fetcher<T>(fetchOptions: FetchOptions) {
    if (this.#accessToken == null) throw new NotLoggedInError();

    return new Promise((fetchResolve: (t: Response) => void, fetchReject) => {
      this.#queue.push({ fetchOptions, fetchResolve, fetchReject });

      this.#log(`added to queue - ${fetchOptions.method}:${fetchOptions.url}`);
      this.#processQueue();
    });
  }

  #log(str: string) {
    if (this.#logEnabled) {
      console.info(`[auth-queue] - ${str}`);
    }
  }

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

      if (res.status == 403) {
        const newAccessToken = await this.#refreshToken();

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

  #processQueue() {
    if (!this.#isProcessing) {
      this.#fetchQueueResolver();
    }
  }

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

  #clearQueue() {
    this.#queue.map((i) => i.fetchReject(new NotLoggedInError()));

    this.#queue = [];
  }
}

export class NotLoggedInError extends Error {
  constructor() {
    super();

    this.name = "NotLoggedInError";
  }
}

let __global__authFetchQueue: undefined | AuthFetchQueue = undefined;

export function initAuthFetchQueue(authFetchLog: boolean = false) {
  if (__global__authFetchQueue == undefined) {
    __global__authFetchQueue = new AuthFetchQueue(authFetchLog);
  }
  return __global__authFetchQueue;
}

export function getAuthFetchQueue() {
  return initAuthFetchQueue();
}
