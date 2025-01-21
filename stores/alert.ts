import { defineStore } from "pinia";
import type { AlertTypes } from "~/types/components/AlertTypes";

export const useAlertStore = defineStore("alert", {
  state: () => ({
    show: false,
    message: "",
    type: undefined as undefined | AlertTypes,

    defaultTimeout: 2000,
  }),

  actions: {
    showAlert(message: string, type?: AlertTypes, timeout?: number) {
      this.message = message;
      this.type = type;

      this.show = true;

      setTimeout(() => {
        this.show = false;
      }, timeout ?? this.defaultTimeout);
    },

    setDefaultTimeout(timeout: number) {
      this.defaultTimeout = timeout;
    },
  },
});
