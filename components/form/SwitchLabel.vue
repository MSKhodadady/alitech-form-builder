<template>
  <div
    class="flex py-1 px-3 gap-2 rounded-lg border-gray-200 border shadow justify-between items-center"
  >
    <FormSwitch v-model="model" />

    <div class="text-sm">{{ label }}</div>
  </div>
</template>

<script setup lang="ts">
const model = defineModel<boolean>();

defineProps<{
  label: string;
}>();
</script>
