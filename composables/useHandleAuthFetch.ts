import type { ResponseOk, ResponseTyped } from "~/types/response/ResponseShape";
import { apiErrLog, errLog } from "~/utils/error/errLog";
import { NotLoggedInError } from "~/utils/error/NotLoggedInError";

/**
 * This composable is used for handling auth api calls. It handles things like redirecting when not logged in or showing server error.
 * Use this hook in conjunction with `apiList.auth`.
 * @param loadingInit useful for pages that fetch data onMount, to show loading page coming up
 * @returns `handleAuthFetch` give the fetch as a function to it to do the things.
 * @returns `loading` for showing loading in place you want while fetching.
 * @returns `showAlert` help for you not to `useAlertStore` twice.
 */
export function useHandleAuthFetch(loadingInit = false) {
  const loading = ref(loadingInit);
  const { showAlert } = useAlertStore();

  async function handleAuthFetch<T>(
    fetchFun: () => Promise<ResponseTyped<T, any>>
  ): Promise<ResponseOk<T> | undefined> {
    loading.value = true;
    let fetchRes: undefined | ResponseOk<T> = undefined;

    try {
      const res = await fetchFun();

      if (res.ok) {
        fetchRes = await res.json();
      } else {
        showAlert("خطای سرور", "warn");
        apiErrLog(
          `useHandleAuthFetch - ${fetchFun}`,
          res.status,
          await res.text()
        );
      }
    } catch (error) {
      if (error instanceof NotLoggedInError) {
        showAlert("باید دوباره وارد شوید.", "warn");
        navigateTo(pageRoutes.login);
      } else {
        errLog(`useHandleAuthFetch - ${fetchFun}`, error);
      }
    }

    loading.value = false;
    return fetchRes;
  }

  return {
    handleAuthFetch,
    showAlert,
    loading,
  };
}
