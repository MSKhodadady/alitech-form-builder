let __globalTokenRefresher: undefined | Promise<string> = undefined;

/**
 * Fetches some url with access token, if the access token is expired, it automatically
 * fetches new access using refresh token, then runs the fetch again.
 * You must use this function in `authApiList`, and handle its result with `useHandleAuthFetch`.
 * @throws `[NotLoggedInError]` if the refresh token is expired.
 * @param accessTokenNew this is just used internally after fetching new access token.
 * @returns
 */
export async function authFetch(
  P: {
    url: string;
    method: "GET" | "POST";
    queries?: { [k: string]: string };
    body?: any;
  },
  accessTokenNew: string | undefined = undefined
) {
  const {
    public: { serverAddress },
  } = useRuntimeConfig();

  const { url, method, body, queries } = P;

  const accessToken = accessTokenNew
    ? accessTokenNew
    : localStorage.getItem(ACCESS_TOKEN_KEY);

  const endUrl = `${serverAddress}${url}`;

  const res = await fetch(
    `${endUrl}?${Object.entries(queries ?? {})
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
      .join("&")}`,
    {
      method,
      body: body ? JSON.stringify(body) : undefined,
      headers: {
        ...(method == "POST" ? { "Content-Type": "application/json" } : {}),
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (res.status == 403) {
    if (__globalTokenRefresher == undefined) {
      __globalTokenRefresher = refreshToken(serverAddress);
    }

    const newAccessToken = await __globalTokenRefresher;
    localStorage.setItem(ACCESS_TOKEN_KEY, newAccessToken);
    __globalTokenRefresher = undefined;

    return await authFetch(P, newAccessToken);
  } else return res;
}

async function refreshToken(serverAddress: string) {
  console.info(` --- fetching new access token ...`);

  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

  const url = `${serverAddress}/main/main/refresh?token=${refreshToken}`;

  const res = await fetch(url, { method: "POST" });

  if (res.ok) {
    console.info(` --- access token fetched!`);
    return (await res.json()).data.access;
  } else if (res.status == 403) {
    throw new NotLoggedInError();
  } else {
    throw new Error(
      `refresh-token-err, status=${res.status}, text=${await res.text()}`
    );
  }
}

export class NotLoggedInError extends Error {
  constructor() {
    super();

    this.name = "NotLoggedInError";
  }
}
