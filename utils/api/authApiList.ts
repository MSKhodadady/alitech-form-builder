import type { Form } from "~/types/entities/Form";
import type { FromBuilder } from "~/types/entities/FormBuilder";
import type { FormsResp } from "~/types/response/Forms";
import { getAuthFetchQueue } from "./internal/AuthFetchQueue";
import signInUp from "./internal/signInUp";

export const apiList = {
  /**
   * Wrap this functions in `useHandleAuthFetch` when using them.
   *
   * For adding new apis to list, just call `getAuthFetchQueue().fetcher<T>`,
   * where `T` is the data returned by that api in default shap of data. If omitted, data is `any`.
   */
  auth: {
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
  },

  async signInUp(email: string, password: string) {
    return signInUp(email, password);
  },
};
