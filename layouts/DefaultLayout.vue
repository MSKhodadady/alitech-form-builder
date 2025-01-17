<template>
  <div class="py-10 max-w-4xl m-auto">
    <slot name="header"></slot>
    <div class="rounded-xl w-full h-full">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
defineSlots<{ header: any; default: any }>();
</script>
