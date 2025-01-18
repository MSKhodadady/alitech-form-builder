<template>
  <div :class="containerClass">
    <p class="mb-1" v-if="label">{{ label }}</p>
    <div
      :class="[
        'rounded-xl border-gray-200 border-2 p-1 flex items-center',
        disabled ? 'bg-gray-200' : '',
      ]"
    >
      <textarea
        class="w-full h-full outline-none disabled:bg-gray-200"
        v-bind="$attrs"
        v-model="model"
        :disabled="disabled"
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
  label?: string;
  containerClass?: string;
  type?: InputTypeHTMLAttribute;
  disabled?: boolean;
}>();

const model = defineModel<string>();

const revealedPassword = ref(false);
</script>
