<script setup lang="ts">
import DefaultLayout from "~/layouts/DefaultLayout.vue";
</script>

<template>
  <DefaultLayout>
    <template #header>
      <div class="mb-6">
        <span class="text-2xl font-bold drop-shadow-md">فرم ها</span>
      </div>

      <div class="w-full bg-white rounded-xl flex justify-end p-3">
        <FormActionButton class="p-3 flex items-center">
          <Icon name="hugeicons:tick-01" size="20" class="me-2" />

          <span>ذخیره فرم</span>
        </FormActionButton>
      </div>
    </template>

    <div class="flex flex-col items-stretch">
      <!-- title form -->
      <div class="bg-white rounded-xl flex items-stretch p-3">
        <div class="w-[18rem]">
          <FormTextInput label="نام فرم" placeholder="یک عنوان برای این فرم" />
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>
