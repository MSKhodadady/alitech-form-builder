<template>
  <Section
    class="max-w-2xl m-auto !p-10 my-10 flex flex-col items-center gap-5 mx-3"
  >
    <h1 class="text-center text-3xl">خوش آمدید.</h1>
    <NuxtLink
      :href="pageRoutes.dashboard"
      class="rounded-xl border border-blue-500 italic p-2 -skew-x-[10deg]"
    >
      <BouncingBtn> رفتن به فرم ساز </BouncingBtn>
    </NuxtLink>
  </Section>
</template>

<script setup lang="ts">
useHead({
  title: "خانه",
});
const {
  public: { serverAddress },
} = useRuntimeConfig();
</script>
