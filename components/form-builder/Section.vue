<template>
  <AppSection>
    <div class="flex justify-between w-full">
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

        <FormIconButton
          icon-name="hugeicons:delete-01"
          type="button"
          @click="$emit('delete')"
        />
        <FormIconButton
          icon-name="hugeicons:copy-01"
          type="button"
          @click="$emit('copy')"
        />

        <div class="flex rounded-xl overflow-clip">
          <FormIconButton
            type="button"
            icon-name="hugeicons:arrow-up-02"
            :disabled="position == 'first' || position == 'just'"
            @click="$emit('move-up')"
          />
          <FormIconButton
            type="button"
            icon-name="hugeicons:arrow-down-02"
            :disabled="position == 'last' || position == 'just'"
            @click="$emit('move-down')"
          />
        </div>
      </div>
    </div>

    <div class="w-full py-4">
      <template v-if="model.type == 'text'">
        <FormTextInput
          disabled
          placeholder="پاسخ شما"
          container-class="w-[18rem]"
        />
      </template>
      <template v-if="model.type == 'textarea'">
        <FormTextAreaInput
          disabled
          placeholder="پاسخ شما"
          container-class="w-full"
          :rows="4"
        />
      </template>
      <template v-if="model.type == 'radio'">
        <FormBuilderPropertyList
          bullet-type="radio"
          v-model="model.properties"
        />
      </template>
      <template v-if="model.type == 'checkbox'">
        <FormBuilderPropertyList
          bullet-type="checkbox"
          v-model="model.properties"
        />
      </template>
      <template v-if="model.type == 'dropdown'">
        <FormBuilderPropertyList
          bullet-type="number"
          v-model="model.properties"
        />
      </template>
      <template v-if="model.type == 'file'">
        <AppSection
          class="w-full h-full flex flex-col gap-2 items-center justify-center py-10"
        >
          <BouncingBtn class="border rounded-xl py-1 px-3 shadow" type="button"
            >افزودن فایل</BouncingBtn
          >
          <p>فرمت های قابل قبول: JPG, PNG, PDF</p>
        </AppSection>
      </template>
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
  position?: "first" | "last" | "just";
}>();
defineEmits(["move-up", "move-down", "delete", "copy"]);
const model = defineModel<FormBuilderSectionType>({ required: true });
</script>
