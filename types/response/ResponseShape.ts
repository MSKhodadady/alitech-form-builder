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
        json: () => Promise<ResponseOk<Data>>;
      }
    | {
        ok: false;
        json: () => Promise<ResponseNOk<Err>>;
      }
  );

export type ResponseOk<Data> = {
  ok: true;
  status: number;
  data: Data;
};

export type ResponseNOk<Err> = {
  ok: false;
  status: number;
  error: Err;
};
