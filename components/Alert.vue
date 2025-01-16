<template>
  <div
    class="bg-white rounded-xl shadow overflow-clip fixed bottom-0 right-0 m-5 z-[1000]"
    v-show="show"
  >
    <div
      :class="[
        'h-1 w-full ',
        type == 'success'
          ? 'bg-green-800'
          : type == 'warn'
          ? 'bg-yellow-400'
          : type == 'danger'
          ? 'bg-red-500'
          : 'bg-white',
      ]"
    ></div>
    <div class="py-4 px-8">{{ message }}</div>
  </div>
</template>

<script lang="ts" setup>
import type { AlertTypes } from "~/types/AlertTypes";

defineProps<{
  type?: AlertTypes;
  show?: boolean;
  message?: string;
}>();
</script>
