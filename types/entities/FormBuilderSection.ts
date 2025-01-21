export type FormBuilderSection = {
  title: string;
  type: string;
  required: boolean;
  properties: string[];
};

/**
 * just for informing
 */
type FormBuilderSectionType =
  | "text"
  | "textarea"
  | "radio"
  | "checkbox"
  | "dropdown"
  | "file";
