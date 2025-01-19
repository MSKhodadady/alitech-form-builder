import type { FromBuilder } from "~/types/FormBuilder";
import { authFetch } from "./authFetch";

/**
 * Wrap this functions in `useHandleAuthFetch` when using them.
 */
export const authApiList = {
  getAllForms() {
    return authFetch({
      url: "/main/main/forms",
      method: "GET",
    });
  },

  createForm(body: FromBuilder) {
    return authFetch({
      url: "/main/main/form",
      method: "POST",
      body,
    });
  },
};
