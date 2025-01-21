<template>
  <div dir="rtl" class="bg-app-back min-h-screen h-fit overflow-auto app-font">
    <NuxtRouteAnnouncer />
    <NuxtPage />
    <Alert />
  </div>
</template>

<script setup lang="ts">
import { initAuthFetchQueue } from "./utils/api/internal/AuthFetchQueue";

useHead({
  titleTemplate: (t) => `${t} - آلیاتک`,
});

initAuthFetchQueue();
</script>

<style>
.app-font {
  font-family: "Vazirmatn", sans-serif;
}
</style>
