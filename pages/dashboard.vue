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

    <Section
      :class="[
        'w-full h-max min-h-[70vh] ',
        loading || formList.length == 0
          ? 'flex justify-center  items-center'
          : 'flex flex-col items-stretch gap-16 justify-between',
      ]"
    >
      <template v-if="loading"> لطفا منتظر بمانید. </template>

      <div v-else-if="formList.length == 0">
        هیچ فرمی تا به حال ساخته نشده است.

        <NuxtLink class="ms-5 text-blue-700" :href="pageRoutes.newForm"
          >ایجاد فرم</NuxtLink
        >
      </div>

      <template v-else>
        <div class="grid grid-cols-3 gap-3">
          <FormCard
            v-for="i in currentPageData()"
            :key="i.form_id"
            :name="i.form_title"
            :created="secondsToPerDateStr(i.created_at)"
            :link="i.form_title"
            :form-id="i.form_id"
          />
        </div>

        <div class="flex items-center justify-center gap-8">
          <FormIconButton
            icon-name="hugeicons:arrow-right-01"
            :class="defaultBorder"
            @click="page--"
          />
          <form @submit.prevent="setPage">
            <FormTextInput
              container-class="w-10"
              type="text"
              class="text-center"
              v-model="pageField"
              @focusout="setPage"
            />
          </form>
          <span>از</span>
          <span>{{ enNumberToPer(totalPages) }}</span>
          <FormIconButton
            icon-name="hugeicons:arrow-left-01"
            :class="defaultBorder"
            @click="page++"
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

const formList = ref<{ page: number; forms: Form[] }[]>([]);
const page = ref(1);
const currentPageData = () =>
  formList.value.find((p) => p.page == page.value)?.forms ?? [];
const pageField = ref(page.value);
const { handleAuthFetch, loading } = useHandleAuthFetch(true);
const totalPages = ref(0);

function setPage() {
  if (pageField.value > totalPages.value || pageField.value < 0) {
    pageField.value = page.value;
  } else {
    page.value = pageField.value;
  }
}

async function fetchList() {
  const res = await handleAuthFetch<FormsResp>(() => authApiList.getAllForms());

  if (res) {
    const { data, totla_quantity } = res.data;

    totalPages.value = Math.ceil(totla_quantity / FORMS_PAGE_COUNT);

    const dataPaginated = data.reduce<{
      lastPage: number;
      forms: Form[];
      output: { page: number; forms: Form[] }[];
    }>(
      (acc, i) => {
        const { lastPage, forms, output } = acc;
        const newForms = [...forms, i];

        if (newForms.length == FORMS_PAGE_COUNT) {
          return {
            lastPage: lastPage + 1,
            forms: [] as Form[],
            output: [...output, { page: lastPage, forms: newForms }],
          };
        } else {
          return {
            lastPage: lastPage,
            forms: newForms,
            output,
          };
        }
      },
      { lastPage: 1, forms: [], output: [] }
    );

    formList.value =
      dataPaginated.forms.length > 0
        ? [
            ...dataPaginated.output,
            { page: dataPaginated.lastPage, forms: dataPaginated.forms },
          ]
        : dataPaginated.output;
  }
}

onMounted(fetchList);
</script>
