<template>
  <div dir="rtl" class="bg-[#f9eff0] min-h-screen h-fit overflow-auto app-font">
    <NuxtRouteAnnouncer />
    <NuxtPage />
    <Alert />
  </div>
</template>

<script setup lang="ts">
useHead({
  titleTemplate: (t) => `${t} - آلیاتک`,
});
</script>

<style>
.app-font {
  font-family: "Vazirmatn", sans-serif;
}
</style>
