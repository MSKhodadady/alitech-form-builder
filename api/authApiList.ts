import type { FromBuilder } from "~/types/FormBuilder";
import { getAuthFetchQueue } from "./AuthFetchQueue";

/**
 * Wrap this functions in `useHandleAuthFetch` when using them.
 */
export const authApiList = {
  getAllForms() {
    return getAuthFetchQueue().fetcher({
      url: "/main/main/forms",
      method: "GET",
    });
  },

  createForm(body: FromBuilder) {
    return getAuthFetchQueue().fetcher({
      url: "/main/main/form",
      method: "POST",
      body,
    });
  },

  getForm(form_id: string) {
    return getAuthFetchQueue().fetcher({
      url: "/main/main/form",
      method: "GET",
      queries: { form_id },
    });
  },
};
