<template>
  <div dir="rtl" class="bg-[#f9eff0] min-h-screen h-fit overflow-auto app-font">
    <NuxtRouteAnnouncer />
    <NuxtPage />
    <Alert />
  </div>
</template>

<script setup lang="ts">
import { initAuthFetchQueue } from "./api/AuthFetchQueue";

useHead({
  titleTemplate: (t) => `${t} - آلیاتک`,
});

initAuthFetchQueue(true);
</script>

<style>
.app-font {
  font-family: "Vazirmatn", sans-serif;
}
</style>
