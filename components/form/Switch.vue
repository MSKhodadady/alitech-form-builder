<template>
  <div
    class="flex py-1 px-3 gap-2 rounded-lg border-gray-200 border shadow justify-between items-center"
  >
    <div
      :class="[
        'p-1 rounded-full flex items-center w-10 transition-all',
        model
          ? 'shadow bg-[#da745d] text-[#da745d] justify-end '
          : 'bg-gray-200 text-gray-200 shadow-inner justify-start',
      ]"
      @click="model = !model"
    >
      <div
        class="w-4 h-4 bg-white rounded-full flex items-center justify-center"
      >
        <template v-if="model"> <Icon name="hugeicons:tick-02" /> </template>

        <template v-else>
          <Icon name="hugeicons:cancel-01" />
        </template>
      </div>
    </div>

    <div class="text-sm">پاسخ الزامی</div>
  </div>
</template>

<script setup lang="ts">
const model = defineModel<boolean>();
</script>
