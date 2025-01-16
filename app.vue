<template>
  <div dir="rtl" class="bg-[#f9eff0] min-h-screen app-font">
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <Alert />
  </div>
</template>

<style>
.app-font {
  font-family: "Vazirmatn", sans-serif;
}
</style>
