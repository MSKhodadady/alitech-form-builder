import type { FormBuilderSection } from "../FormBuilderSection";

export type Form = {
  form_id: string;
  form_type: "public" | "private";
  form_title: string;
  description: string;
  sections: FormBuilderSection[];
  created_at: number; // seconds
};
