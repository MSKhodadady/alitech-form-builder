<template>
  <LayoutDefault>
    <template #header>
      <div class="mb-6">
        <span class="text-2xl font-bold drop-shadow-md">ساخت فرم</span>
      </div>

      <div class="w-full bg-white rounded-xl flex justify-end p-3 mb-3 shadow">
        <FormActionButton
          class="p-3 flex items-center"
          @click="submitForm"
          :disabled="loading"
        >
          <Icon name="hugeicons:tick-01" size="20" class="me-2" />

          <span>ذخیره فرم</span>
        </FormActionButton>
      </div>
    </template>

    <div class="flex flex-col items-stretch w-full gap-2">
      <!-- title form -->
      <Section class="flex items-stretch gap-3">
        <div class="w-[18rem] space-y-3">
          <FormTextInput
            label="نام فرم"
            placeholder="یک عنوان برای این فرم"
            v-model="formBuilderState.form_title"
          />

          <FormTextAreaInput
            label="توضیحات فرم"
            rows="5"
            v-model="formBuilderState.description"
          />
        </div>

        <div class="w-[14rem]">
          <FormDropdown
            label="دسته بندی"
            class="w-full"
            :items="categoryItems"
            v-model="formBuilderState.form_type"
          />
        </div>
      </Section>

      <Section v-if="formBuilderState.form_type == 'public'">
        <div class="grid grid-cols-2 grid-rows-2 gap-2 w-2/3">
          <FormTextInput label="نام خانوادگی" disabled placeholder="پاسخ شما" />
          <FormTextInput label="نام" disabled placeholder="پاسخ شما" />
          <FormTextInput label="ایمیل" disabled placeholder="پاسخ شما" />
        </div>
      </Section>

      <FormBuilderSection
        v-for="(i, index) in formBuilderState.sections"
        v-model="formBuilderState.sections[index]"
        :position="
          index == 0
            ? formBuilderState.sections.length == 1
              ? 'just'
              : 'first'
            : index == formBuilderState.sections.length - 1
            ? 'last'
            : undefined
        "
        :key="i.key"
        @delete="formItemAction.delete(index)"
        @copy="formItemAction.copy(index)"
        @move-up="formItemAction.up(index)"
        @move-down="formItemAction.down(index)"
      />

      <Section v-if="showErrs && checkErrors.length > 0">
        <h1 class="text-2xl">خطا ها</h1>
        <ul class="text-red-500 list-disc ps-5">
          <li v-for="i in checkErrors">{{ i }}</li>
        </ul>
      </Section>

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
import { authApiList } from "~/api/authApiList";
import type { FormBuilderSection } from "~/types/FormBuilderSection";

const categoryItems = [
  { text: "عمومی", id: "public" },
  { text: "خصوصی", id: "private" },
];

const formBuilderState = reactive({
  form_title: "",
  description: "",
  form_type: null as null | string,
  sections: [] as (FormBuilderSection & { key: number })[],
});

const formItemKeyCounter = ref(0);
const showErrs = ref(false);

const { loading, handleAuthFetch, showAlert } = useHandleAuthFetch();

const formItemAction = {
  new() {
    formBuilderState.sections.push({
      title: "",
      properties: [],
      required: false,
      type: "text",
      key: formItemKeyCounter.value,
    });

    formItemKeyCounter.value++;
  },
  up(index: number) {
    formBuilderState.sections = [
      ...formBuilderState.sections.slice(0, index - 1),
      { ...formBuilderState.sections[index] },
      { ...formBuilderState.sections[index - 1] },
      ...formBuilderState.sections.slice(index + 1),
    ];
  },
  down(index: number) {
    formBuilderState.sections = [
      ...formBuilderState.sections.slice(0, index),
      { ...formBuilderState.sections[index + 1] },
      { ...formBuilderState.sections[index] },
      ...formBuilderState.sections.slice(index + 2),
    ];
  },
  delete(index: number) {
    formBuilderState.sections.splice(index, 1);
  },
  copy(index: number) {
    const k = formBuilderState.sections[index];
    formBuilderState.sections.splice(index + 1, 0, {
      ...k,
      key: formItemKeyCounter.value,
    });

    formItemKeyCounter.value++;
  },
};

const checkErrors = computed(() =>
  [
    formBuilderState.form_title ? undefined : "عنوان پرسش نامه خالی است.",
    formBuilderState.form_type == "public" ||
    formBuilderState.form_type == "private"
      ? undefined
      : "دسته بندی انتخاب نشده است.",

    formBuilderState.sections.length == 0
      ? "هیچ پرسشی برای پرسشنامه انتخاب نشده است."
      : undefined,

    ...formBuilderState.sections
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

  const { form_type } = formBuilderState;
  if (form_type != "public" && form_type != "private") return;

  const res = handleAuthFetch(() =>
    authApiList.createForm({
      ...formBuilderState,
      form_type,
    })
  );

  if (res != undefined) {
    showAlert("فرم با موفقیت ساخته شد.", "success");
    navigateTo(pageRoutes.dashboard);
  }
}
</script>
