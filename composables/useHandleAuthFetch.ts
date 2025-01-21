import { NotLoggedInError } from "~/api/AuthFetchQueue";
import type {
  ResponseOk,
  ResponseTyped,
} from "~/types/serverData/ResponseShape";

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
