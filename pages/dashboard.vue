<script setup lang="ts">
import { authApiList } from "~/api/authApiList";
import { NotLoggedInError } from "~/api/authFetch";

import DefaultLayout from "~/layouts/DefaultLayout.vue";
import type { Forms, FormsRes } from "~/types/Forms";

const formList = ref<Forms>([]);
const loading = ref(true);
const { showAlert } = useAlertStore();

async function fetchList() {
  loading.value = true;

  try {
    const res = await authApiList.getAllForms();

    if (res.ok) {
      const body: FormsRes = await res.json();

      formList.value = body.data.data;
    }
  } catch (error) {
    if (error instanceof NotLoggedInError) {
      showAlert("باید دوباره وارد شوید.", "warn");

      navigateTo(pageRoutes.login);
    }
  }

  loading.value = false;
}

onMounted(fetchList);
</script>

<template>
  <DefaultLayout>
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

      <template v-else> </template>
    </Section>
  </DefaultLayout>
</template>
