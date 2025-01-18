<template>
  <DefaultLayout>
    <template #header>
      <div class="mb-6">
        <span class="text-2xl font-bold drop-shadow-md">فرم ها</span>
      </div>

      <div class="w-full bg-white rounded-xl flex justify-end p-3 mb-3 shadow">
        <FormActionButton class="p-3 flex items-center">
          <Icon name="hugeicons:tick-01" size="20" class="me-2" />

          <span>ذخیره فرم</span>
        </FormActionButton>
      </div>
    </template>

    <div class="flex flex-col items-stretch w-full gap-2">
      <!-- title form -->
      <Section class="flex items-stretch gap-3">
        <div class="w-[18rem] space-y-3">
          <FormTextInput label="نام فرم" placeholder="یک عنوان برای این فرم" />

          <FormTextAreaInput label="توضیحات فرم" rows="5" />
        </div>

        <div class="w-[14rem]">
          <FormDropdown
            label="دسته بندی"
            class="w-full"
            :items="categoryItems"
            v-model="chosenCategoryId"
          />
        </div>
      </Section>

      <Section v-if="chosenCategoryId == 'public'">
        <div class="grid grid-cols-2 grid-rows-2 gap-2 w-2/3">
          <FormTextInput label="نام خانوادگی" disabled placeholder="پاسخ شما" />
          <FormTextInput label="نام" disabled placeholder="پاسخ شما" />
          <FormTextInput label="ایمیل" disabled placeholder="پاسخ شما" />
        </div>
      </Section>

      <FormBuilderSection
        v-for="(i, index) in formItems"
        v-model="formItems[index]"
        :position="
          index == 0
            ? 'first'
            : index == formItems.length - 1
            ? 'last'
            : undefined
        "
        :key="i.key"
        @delete="formItemDelete(index)"
        @copy="formItemCopy(index)"
        @move-up="formItemUp(index)"
        @move-down="formItemDown(index)"
      />

      <BouncingBtn
        type="button"
        class="bg-white shadow-lg rounded-xl flex items-center justify-center font-bold p-3"
        @click="addNewFormItem"
      >
        + پرسش جدید
      </BouncingBtn>
    </div>
  </DefaultLayout>
</template>

<script setup lang="ts">
import DefaultLayout from "~/layouts/DefaultLayout.vue";
import type { FormBuilderSectionType } from "~/types/FormBuilderSection";

const categoryItems = [
  { text: "عمومی", id: "public" },
  { text: "خصوصی", id: "private" },
];

const chosenCategoryId = ref(null as null | string);

const formItems = ref<(FormBuilderSectionType & { key: number })[]>([]);
const formItemKeyCounter = ref(0);

function addNewFormItem() {
  formItems.value.push({
    title: "",
    properties: [],
    required: false,
    type: null,
    key: formItemKeyCounter.value,
  });

  formItemKeyCounter.value++;
}
function formItemUp(index: number) {
  formItems.value = [
    ...formItems.value.slice(0, index - 1),
    { ...formItems.value[index] },
    { ...formItems.value[index - 1] },
    ...formItems.value.slice(index + 1),
  ];
}
function formItemDown(index: number) {
  formItems.value = [
    ...formItems.value.slice(0, index),
    { ...formItems.value[index + 1] },
    { ...formItems.value[index] },
    ...formItems.value.slice(index + 2),
  ];
}
function formItemDelete(index: number) {
  formItems.value.splice(index, 1);
}
function formItemCopy(index: number) {
  const k = formItems.value[index];
  formItems.value.splice(index + 1, 0, { ...k, key: formItemKeyCounter.value });

  formItemKeyCounter.value++;
}
</script>
