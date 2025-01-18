<template>
  <AppSection>
    <div class="flex justify-between">
      <!--  -->
      <div class="flex gap-2">
        <FormTextInput placeholder="عنوان پرسش" v-model="model.title" />
        <FormDropdown
          :items="questionTypes"
          v-model="model.type"
          class="w-40"
        />
      </div>
      <!--  -->
      <div class="flex gap-1 items-center">
        <FormSwitch v-model="model.required" />

        <FormIconButton icon-name="hugeicons:delete-01" />
        <FormIconButton icon-name="hugeicons:copy-01" />

        <div class="flex rounded-xl overflow-clip">
          <FormIconButton
            icon-name="hugeicons:arrow-up-02"
            :disabled="position == 'first'"
          />
          <FormIconButton
            icon-name="hugeicons:arrow-down-02"
            :disabled="position == 'last'"
          />
        </div>
      </div>
    </div>
  </AppSection>
</template>

<script setup lang="ts">
import { Section as AppSection } from "#components";
import type { FormBuilderSectionType } from "~/types/FormBuilderSection";

const questionTypes = [
  { text: "پاسخ کوتاه", id: "text" },
  { text: "پاسخ بلند", id: "textarea" },
  { text: "تک پاسخی", id: "radio" },
  { text: "چندین پاسخی", id: "checkbox" },
  { text: "لیست انتخابی", id: "dropdown" },
  { text: "بارگذاری پیوست", id: "file" },
];

defineProps<{
  position?: "first" | "last";
}>();

const model = defineModel<FormBuilderSectionType>({ required: true });
</script>
