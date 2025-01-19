export type FormBuilderSection = {
  title: string;
  type: string;
  required: boolean;
  properties: string[];
};

export type FormBuilderSectionType =
  | "text"
  | "textarea"
  | "radio"
  | "checkbox"
  | "dropdown"
  | "file";
