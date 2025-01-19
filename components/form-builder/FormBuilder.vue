<template>
  <LayoutDefault>
    <template #header>
      <div class="mb-6">
        <span class="text-2xl font-bold drop-shadow-md">
          <template v-if="editMode()"> ویرایش فرم </template>

          <template v-else> ساخت فرم </template>
        </span>
      </div>

      <div
        class="w-full bg-white rounded-xl flex gap-3 justify-end p-3 mb-3 shadow"
      >
        <FormActionButton
          class="p-3 flex items-center"
          white
          :disabled="loading"
          @click="$emit('delete')"
        >
          <Icon name="hugeicons:delete-01" size="20" class="me-2" />
          <span>حذف فرم</span>
        </FormActionButton>
        <FormActionButton
          class="p-3 flex items-center"
          @click="submitForm"
          :disabled="loading || submitDisabled"
        >
          <Icon name="hugeicons:tick-01" size="20" class="me-2" />

          <span>ذخیره فرم</span>
        </FormActionButton>
      </div>
    </template>

    <div class="flex flex-col items-stretch w-full gap-2">
      <Section v-if="showErrs && checkErrors.length > 0">
        <h1 class="text-2xl">خطا ها</h1>
        <ul class="text-red-500 list-disc ps-5">
          <li v-for="i in checkErrors">{{ i }}</li>
        </ul>
      </Section>

      <!-- title form -->
      <Section class="flex items-stretch gap-3">
        <div class="w-[18rem] space-y-3">
          <FormTextInput
            label="نام فرم"
            placeholder="یک عنوان برای این فرم"
            v-model="model.form_title"
          />

          <FormTextAreaInput
            label="توضیحات فرم"
            rows="5"
            v-model="model.description"
          />
        </div>

        <div class="w-[14rem]">
          <FormDropdown
            label="دسته بندی"
            class="w-full"
            :items="categoryItems"
            v-model="model.form_type"
            :disabled="editMode()"
          />
        </div>
      </Section>

      <Section v-if="model.form_type == 'public'">
        <div class="grid grid-cols-2 grid-rows-2 gap-2 w-2/3">
          <FormTextInput label="نام خانوادگی" disabled placeholder="پاسخ شما" />
          <FormTextInput label="نام" disabled placeholder="پاسخ شما" />
          <FormTextInput label="ایمیل" disabled placeholder="پاسخ شما" />
        </div>
      </Section>

      <FormBuilderSection
        v-for="(i, index) in model.sections"
        v-model="model.sections[index]"
        :position="
          index == 0
            ? model.sections.length == 1
              ? 'just'
              : 'first'
            : index == model.sections.length - 1
            ? 'last'
            : undefined
        "
        :key="i.key"
        @delete="formItemAction.delete(index)"
        @copy="formItemAction.copy(index)"
        @move-up="formItemAction.up(index)"
        @move-down="formItemAction.down(index)"
      />

      <BouncingBtn
        type="button"
        class="bg-white shadow-lg rounded-xl flex items-center justify-center font-bold p-3"
        @click="formItemAction.new"
      >
        + پرسش جدید
      </BouncingBtn>
    </div>
  </LayoutDefault>
</template>

<script setup lang="ts">
import type { FormBuilderModel } from "~/types/FormBuilder";

const categoryItems = [
  { text: "عمومی", id: "public" },
  { text: "خصوصی", id: "private" },
];

useHead({
  title: "ساخت فرم",
});
const model = defineModel<FormBuilderModel>({ required: true });
const props = defineProps<{
  formId: null | string; // if not null => edit mode
  loading?: boolean;
  submitDisabled?: boolean;
}>();
const emit = defineEmits(["submit", "delete"]);
const editMode = () => props.formId != null;
const showErrs = ref(false);

//: init model values for sure
onMounted(() => {
  const { description, formItemKeyCounter, form_title, form_type, sections } =
    model.value;

  model.value = {
    description: description ?? "",
    formItemKeyCounter: formItemKeyCounter ?? 0,
    form_title: form_title ?? "",
    form_type: form_type ?? "private",
    sections: sections ?? [],
  };
});

const formItemAction = {
  new() {
    model.value.sections.push({
      title: "",
      properties: [],
      required: false,
      type: "text",
      key: model.value.formItemKeyCounter + 1,
    });

    model.value.formItemKeyCounter++;
  },
  up(index: number) {
    model.value.sections = [
      ...model.value.sections.slice(0, index - 1),
      { ...model.value.sections[index] },
      { ...model.value.sections[index - 1] },
      ...model.value.sections.slice(index + 1),
    ];
  },
  down(index: number) {
    model.value.sections = [
      ...model.value.sections.slice(0, index),
      { ...model.value.sections[index + 1] },
      { ...model.value.sections[index] },
      ...model.value.sections.slice(index + 2),
    ];
  },
  delete(index: number) {
    model.value.sections.splice(index, 1);
  },
  copy(index: number) {
    const k = model.value.sections[index];
    model.value.sections.splice(index + 1, 0, {
      ...k,
      key: model.value.formItemKeyCounter,
    });

    model.value.formItemKeyCounter++;
  },
};

const checkErrors = computed(() =>
  [
    model.value.form_title ? undefined : "عنوان پرسش نامه خالی است.",
    model.value.form_type == "public" || model.value.form_type == "private"
      ? undefined
      : "دسته بندی انتخاب نشده است.",

    model.value.sections.length == 0
      ? "هیچ پرسشی برای پرسشنامه انتخاب نشده است."
      : undefined,

    ...model.value.sections
      .map((i, index) => {
        const num = Number(index + 1).toLocaleString("fa-ir");
        const errs = [
          !i.title ? `پرسش ${num} - عنوان پرسش وارد نشده است.` : undefined,
          i.type == null
            ? `پرسش ${num} - دسته بندی انتخاب نشده است.`
            : undefined,
          (i.type == "radio" || i.type == "checkbox" || i.type == "dropdown") &&
          i.properties.length == 0
            ? `پرسش ${num} - گزینه ها انتخاب نشده است.`
            : undefined,
        ];

        return errs.filter((i) => i != undefined);
      })
      .flat(),
  ].filter((i) => i != undefined)
);

function submitForm() {
  if (checkErrors.value.length > 0) {
    showErrs.value = true;
    return;
  }

  emit("submit");
}
</script>
