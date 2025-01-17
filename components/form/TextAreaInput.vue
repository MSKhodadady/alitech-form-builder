<template>
  <div :class="containerClass">
    <p class="mb-1">{{ label }}</p>
    <div class="rounded-xl border-gray-200 border-2 p-1 flex items-center">
      <textarea
        class="w-full h-full outline-none"
        v-bind="$attrs"
        v-model="model"
      />
    </div>
    <slot name="err"></slot>
  </div>
</template>

<script lang="ts" setup>
import type { InputTypeHTMLAttribute } from "vue";

defineOptions({
  inheritAttrs: false,
});

defineProps<{
  label: string;
  containerClass?: string;
  type?: InputTypeHTMLAttribute;
}>();

const model = defineModel<string>();

const revealedPassword = ref(false);
</script>
