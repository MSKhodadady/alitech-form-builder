<template>
  <div
    :class="[
      'p-1 rounded-full flex items-center w-10 transition-all',
      model
        ? 'shadow bg-secondary text-secondary justify-end '
        : 'bg-gray-200 text-gray-200 shadow-inner justify-start',
    ]"
    @click="model = !model"
  >
    <div class="w-4 h-4 bg-white rounded-full flex items-center justify-center">
      <template v-if="model"> <Icon name="hugeicons:tick-02" /> </template>

      <template v-else>
        <Icon name="hugeicons:cancel-01" />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
const model = defineModel<boolean>();
</script>
