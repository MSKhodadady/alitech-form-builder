export type ResponseShapeSuccess<Data> = {
  ok: true;
  status: number;
  data: Data;
};

export type ResponseShapeError<Err> = {
  ok: false;
  status: number;
  error: Err;
};
