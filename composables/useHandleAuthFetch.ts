import { NotLoggedInError } from "~/api/authFetch";

export function useHandleAuthFetch() {
  const loading = ref(false);
  const { showAlert } = useAlertStore();

  async function handleAuthFetch<T>(
    fetchFun: () => Promise<Response>
  ): Promise<T | undefined> {
    loading.value = true;
    let fetchRes: undefined | T = undefined;

    try {
      const res = await fetchFun();

      if (res.ok) {
        fetchRes = (await res.json()) as T;
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
