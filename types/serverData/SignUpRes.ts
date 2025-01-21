import type { ResponseTyped } from "./ResponseShape";

export type SignUpResponse = ResponseTyped<
  {
    access: string;
    refresh: string;
  },
  {
    detail: "IncorrectPassword" | string;
  }
>;
