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
