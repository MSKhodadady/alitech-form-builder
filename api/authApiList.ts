import type { FromBuilder } from "~/types/FormBuilder";
import type { FormsResp } from "~/types/response/Forms";
import type { Form } from "~/types/serverData/Forms";
import { getAuthFetchQueue } from "./AuthFetchQueue";

/**
 * Wrap this functions in `useHandleAuthFetch` when using them.
 */
export const authApiList = {
  getAllForms() {
    return getAuthFetchQueue().fetcher<FormsResp>({
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
    return getAuthFetchQueue().fetcher<Form>({
      url: "/main/main/form",
      method: "GET",
      queries: { form_id },
    });
  },

  updateForm(form_id: string, body: FromBuilder) {
    return getAuthFetchQueue().fetcher({
      url: "/main/main/form",
      method: "PUT",
      queries: { form_id },
      body,
    });
  },

  deleteForm(form_id: string) {
    return getAuthFetchQueue().fetcher({
      url: "/main/main/form",
      method: "DELETE",
      queries: { form_id },
    });
  },
};
