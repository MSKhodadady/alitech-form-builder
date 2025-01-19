<template>
  <LayoutDefault>
    <template #header>
      <div class="flex justify-between items-center mb-10">
        <span class="text-2xl font-bold drop-shadow-md">فرم ها</span>

        <NuxtLink :href="pageRoutes.newForm">
          <FormActionButton class="flex items-center justify-between p-3">
            + ایجاد فرم
          </FormActionButton>
        </NuxtLink>
      </div>
    </template>

    <Section class="w-full min-h-[70vh]">
      <template v-if="loading"> لطفا منتظر بمانید. </template>

      <div
        v-else-if="formList.length == 0"
        class="h-[70vh] w-full flex justify-center items-center"
      >
        <div>
          هیچ فرمی تا به حال ساخته نشده است.

          <NuxtLink class="ms-5 text-blue-700" :href="pageRoutes.newForm"
            >ایجاد فرم</NuxtLink
          >
        </div>
      </div>

      <template v-else>
        <div class="grid grid-cols-3 gap-3">
          <FormCard
            v-for="i in formList"
            :name="i.form_title"
            :created="secondsToPerDateStr(i.created_at)"
            :link="i.form_title"
            :key="i.form_id"
          />
        </div>
      </template>
    </Section>
  </LayoutDefault>
</template>

<script setup lang="ts">
import { authApiList } from "~/api/authApiList";
import type { Form, FormsResp } from "~/types/serverData/Forms";

useHead({
  title: "داشبورد",
});

const formList = ref<Form[]>([]);
const { handleAuthFetch, loading } = useHandleAuthFetch();

async function fetchList() {
  const res = await handleAuthFetch<FormsResp>(() => authApiList.getAllForms());

  if (res) {
    formList.value = res.data.data;
  }
}

onMounted(fetchList);
</script>
