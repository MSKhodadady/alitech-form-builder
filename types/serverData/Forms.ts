import type { FormBuilderSection } from "../FormBuilderSection";
import type { ResponseShapeSuccess } from "./ResponseShape";

export type FormsResp = ResponseShapeSuccess<{
  totla_quantity: number;
  data: Form[];
}>;

export type Forms = {
  totla_quantity: number;
  data: Form[];
};

export type Form = {
  form_id: string;
  form_type: "public" | "private";
  form_title: string;
  description: string;
  sections: FormBuilderSection[];
  created_at: number; // seconds
};
