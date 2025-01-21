<template>
  <div
    dir="rtl"
    class="bg-[#f9eff0] min-h-screen app-font flex flex-col gap-8 justify-center items-center !p-10 w-full"
  >
    <h1 v-if="error?.statusCode == 404" class="text-3xl">
      صفحه مورد نظر یافت نشد.
    </h1>
    <div v-else>
      <p>خطای برنامه</p>
      <p>کد: {{ error?.statusCode }}</p>
    </div>
    <!-- <FormActionButton @click="handleError">رفتن به خانه</FormActionButton> -->
    <NuxtLink :to="pageRoutes.home">
      <FormActionButton @click="handleError" class="py-2 px-4"
        >رفتن به خانه</FormActionButton
      >
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import type { NuxtError } from "#app";

const props = defineProps({
  error: Object as () => NuxtError,
});

const handleError = () => clearError({ redirect: "/" });
</script>

<style>
.app-font {
  font-family: "Vazirmatn", sans-serif;
}
</style>
