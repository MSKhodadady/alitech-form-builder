<template>
  <BouncingBtn
    :class="[
      'rounded-xl',
      white ? `${defaultBorder} text-black` : ' text-white',
      disabled ? 'bg-gray-400' : white ? 'bg-white' : 'bg-[#3e3e3e]',
    ]"
    :disabled="disabled"
  >
    <slot></slot>
  </BouncingBtn>
</template>

<script setup lang="ts">
defineProps<{
  disabled?: boolean;
  white?: boolean;
}>();
</script>
