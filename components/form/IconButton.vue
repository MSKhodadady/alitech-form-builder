<template>
  <BouncingBtn
    :class="[
      ' flex items-center justify-center ',
      small ? 'p-1 w-5 h-5' : 'p-2 h-9 w-9',
      disabled ? 'bg-gray-200' : '',
    ]"
    :disabled="disabled"
  >
    <template v-if="iconName">
      <Icon :name="iconName" class="h-full w-full" />
    </template>

    <template v-else>
      <slot></slot>
    </template>
  </BouncingBtn>
</template>

<script setup lang="ts">
defineProps<{
  iconName?: string;
  disabled?: boolean;
  small?: boolean;
}>();
</script>
