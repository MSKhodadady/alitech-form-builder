<template>
  <BouncingBtn
    :class="[
      'rounded-xl',
      white ? `${defaultBorder} text-black` : ' text-white',
      disabled ? 'bg-gray-400' : white ? 'bg-white' : 'bg-primary',
    ]"
    :disabled="disabled"
  >
    <slot></slot>
  </BouncingBtn>
</template>

<script setup lang="ts">
import { defaultBorder } from "~/utils/layout/style";

defineProps<{
  disabled?: boolean;
  white?: boolean;
}>();
</script>
