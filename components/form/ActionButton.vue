<template>
  <BouncingBtn
    :class="[
      ' text-white rounded-xl',
      disabled ? 'bg-gray-400' : 'bg-[#3e3e3e]',
    ]"
    :disabled="disabled"
  >
    <slot></slot>
  </BouncingBtn>
</template>

<script setup lang="ts">
defineProps<{
  disabled?: boolean;
}>();
</script>
