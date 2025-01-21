import type { FormBuilderSection } from "../entities/FormBuilderSection";

/**
 * This is like FormBuilder, with two difference.
 * 1- `form_type` has null for un-selected state.
 * 2- added a key to sections, because there is no unique data about each section, but
 *  we need unique data for `v-for`'s key. so we have `formItemKeyCounter` for having next key value.
 *  note: array index can't be used because list items are moving up and down in list, and
 *    that will make problem if we use index.
 */
export type FormBuilderModel = {
  form_title: string;
  description: string;
  form_type: null | string;
  sections: (FormBuilderSection & { key: number })[];
  formItemKeyCounter: number;
};
