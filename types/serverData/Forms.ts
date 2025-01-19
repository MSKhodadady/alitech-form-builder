export type FormsRes = {
  ok: boolean;
  status: number;
  data: {
    totla_quantity: number;
    data: Forms;
  };
};

export type Forms = any[];
