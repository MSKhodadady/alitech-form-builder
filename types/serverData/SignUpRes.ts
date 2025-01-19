export type SignUpRes = {
  ok: true;
  status: 200;
  data: {
    access: string;
    refresh: string;
  };
};

export type SignUpResErr = {
  ok: false;
  status: number;
  error: {
    detail: "IncorrectPassword" | string;
  };
};
