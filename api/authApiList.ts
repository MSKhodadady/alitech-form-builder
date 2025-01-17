import { authFetch } from "./authFetch";

export const authApiList = {
  getAllForms() {
    return authFetch({
      url: "/main/main/forms",
      method: "GET",
    });
  },
};
