let __globalTokenRefresher: undefined | Promise<string> = undefined;

export async function authFetch(
  P: {
    url: string;
  } & (
    | { method: "POST"; body?: any }
    | { method: "GET"; body?: { [k: string]: string } }
  ),
  accessTokenNew: string | undefined = undefined
) {
  const {
    public: { serverAddress },
  } = useRuntimeConfig();

  const { url, method, body } = P;

  const accessToken = accessTokenNew
    ? accessTokenNew
    : localStorage.getItem(ACCESS_TOKEN_KEY);

  const endUrl = `${serverAddress}${url}`;

  const res = await fetch(
    method == "GET" && body != undefined
      ? `${endUrl}?${Object.entries(body)
          .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
          .join("&")}`
      : endUrl,
    {
      method,
      body: method == "POST" ? body : undefined,
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
