import type { FormBuilderSection } from "./FormBuilderSection";

export type FromBuilder = {
  form_type: "public" | "private";
  form_title: string;
  description: string;
  sections: FormBuilderSection[];
};
