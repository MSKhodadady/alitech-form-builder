<!-- Alert viewer. Use it once in root component (`app.vue` for example) and show it with `useAlertStore`. -->

<template>
  <div
    class="bg-white rounded-xl shadow-md overflow-clip fixed bottom-0 right-0 m-5 z-[1000]"
    v-show="a.show"
  >
    <div
      :class="[
        'h-1 w-full ',
        a.type == 'success'
          ? 'bg-green-800'
          : a.type == 'warn'
          ? 'bg-yellow-400'
          : a.type == 'danger'
          ? 'bg-red-500'
          : 'bg-white',
      ]"
    ></div>
    <div class="py-4 px-8">{{ a.message }}</div>
  </div>
</template>

<script lang="ts" setup>
const a = useAlertStore();
</script>
