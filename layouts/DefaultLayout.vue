<template>
  <div class="py-10 max-w-4xl m-auto h-[90vh]">
    <slot name="header"></slot>
    <div class="rounded-xl p-3 w-full h-full overflow-clip">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
defineSlots<{ header: any; default: any }>();
</script>
