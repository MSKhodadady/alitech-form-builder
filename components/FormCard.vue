<template>
  <div :class="[' p-2 w-full flex flex-col gap-8', defaultBorder]">
    <div class="rounded-xl bg-gray-300 flex justify-center items-center py-12">
      <span class="text-2xl font-bold drop-shadow-lg">{{ name }}</span>
    </div>

    <p class="text-gray-400">{{ created }}</p>

    <NuxtLink>
      <BouncingBtn
        :class="[
          'w-full  py-1 flex justify-center items-center gap-2',
          defaultBorder,
        ]"
      >
        <Icon name="hugeicons:view" class="h-5 w-5" />
        مشاهده فرم
      </BouncingBtn>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  name: string;
  created: string;
  link: string;
}>();
</script>
