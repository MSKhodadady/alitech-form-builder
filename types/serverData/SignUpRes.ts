import type { ResponseShapeError, ResponseShapeSuccess } from "./ResponseShape";

export type SignUpRes = ResponseShapeSuccess<{
  access: string;
  refresh: string;
}>;

export type SignUpResErr = ResponseShapeError<{
  detail: "IncorrectPassword" | string;
}>;
