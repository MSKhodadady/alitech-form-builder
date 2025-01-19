import type { FormBuilderSection } from "./FormBuilderSection";

export type FromBuilder = {
  form_type: "public" | "private";
  form_title: string;
  description: string;
  sections: FormBuilderSection[];
};

export type FormBuilderModel = {
  form_title: string;
  description: string;
  form_type: null | string;
  sections: (FormBuilderSection & { key: number })[];
  /**
   * used for settings keys for `v-for`, when adding new item
   */
  formItemKeyCounter: number;
};

export type EditFormBuilderModel = Omit<FormBuilderModel, "form_type"> & {
  form_type: "public" | "private";
};
