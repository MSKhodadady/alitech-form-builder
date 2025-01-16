import type { AlertTypes } from "~/types/AlertTypes";

export function useAlert() {
  const alertProps = reactive({
    show: false,
    type: undefined as AlertTypes | undefined,
    message: "",
  });

  function showAlert(msg: string, alertType?: AlertTypes, timeout = 2000) {
    alertProps.message = msg;
    alertProps.type = alertType;
    alertProps.show = true;

    setTimeout(() => {
      alertProps.show = false;
    }, timeout);
  }

  return {
    // alertProps: { show: show.value, type: type.value, message: message.value },
    alertProps,
    showAlert,
  };
}
