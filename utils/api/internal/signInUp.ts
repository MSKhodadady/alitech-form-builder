import type { SignUpResponse } from "~/types/response/SignUpRes";
import { decodeJWT } from "~/utils/data/decodeJWT";
import { apiErrLog, errLog } from "~/utils/error/errLog";
import { getAuthFetchQueue } from "./AuthFetchQueue";

export default async function signInUp(
  email: string,
  password: string
): Promise<"success" | "password-err" | "server-err"> {
  const {
    public: { serverAddress },
  } = useRuntimeConfig();

  const url = `${serverAddress}/main/main/signup`;
  const body = JSON.stringify({
    email,
    password,
  });

  try {
    const res: SignUpResponse = await fetch(url, {
      method: "POST",
      body,
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      const {
        data: { access, refresh },
      } = await res.json();

      //: extract expire time from jwt.
      const refreshTokenData = decodeJWT(refresh);
      const exp = Number(refreshTokenData.body.exp);

      //: save refresh token in cookie
      const refreshCookie = useCookie(REFRESH_TOKEN_KEY, {
        expires: !Number.isNaN(exp) ? new Date(exp * 1000) : undefined,
      });
      refreshCookie.value = refresh;

      //: we must save refresh token in `localStorage`,
      //: because of server api problem.
      localStorage.setItem(REFRESH_TOKEN_KEY, refresh);

      //: save refresh token both in localStorage and AuthFetchQueue for ease of use.
      localStorage.setItem(ACCESS_TOKEN_KEY, access);
      getAuthFetchQueue().setAccessToken(access);

      return "success";
    } else {
      const body = await res.json();
      if (body.error.detail == "IncorrectPassword") {
        return "password-err";
      } else {
        apiErrLog("api-signInUp", res.status, await res.text());
        return "server-err";
      }
    }
  } catch (error) {
    errLog("api-signInUp", error);

    return "server-err";
  }
}
