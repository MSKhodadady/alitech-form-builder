/**
 * This type is the total shape of data received from server.
 * @warn It may change in future.
 */
export type ResponseTyped<Data = any, Err = any> = Omit<
  Response,
  "json" | "ok"
> &
  (
    | {
        ok: true;
        json: () => Promise<{
          ok: true;
          status: number;
          data: Data;
        }>;
      }
    | {
        ok: false;
        json: () => Promise<{
          ok: false;
          status: number;
          error: Err;
        }>;
      }
  );

export type ResponseShape<Data = any, Err = any> =
  | {
      ok: true;
      status: number;
      data: Data;
    }
  | {
      ok: false;
      status: number;
      error: Err;
    };

export type ResponseShapeSuccess<Data = any> = {
  ok: true;
  status: number;
  data: Data;
};

export type ResponseShapeError<Err = any> = {
  ok: false;
  status: number;
  error: Err;
};
