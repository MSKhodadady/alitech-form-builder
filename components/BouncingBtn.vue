<template>
  <button :class="[disabled ? '' : 'active:scale-90 transition-all']">
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
defineProps<{
  disabled?: boolean;
}>();
</script>
