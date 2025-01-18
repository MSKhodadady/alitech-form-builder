import type { FormBuilderType } from "~/types/FormBuilderSection";
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

  createForm(body: FormBuilderType) {
    return authFetch({
      url: "/main/main/form",
      method: "POST",
      body,
    });
  },
};
