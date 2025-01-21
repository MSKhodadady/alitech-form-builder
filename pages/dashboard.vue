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
        loading || formListPages.length == 0
          ? 'flex justify-center  items-center'
          : 'flex flex-col items-stretch gap-16 justify-between',
      ]"
    >
      <template v-if="loading"> لطفا منتظر بمانید. </template>

      <div v-else-if="formListPages.length == 0">
        هیچ فرمی تا به حال ساخته نشده است.

        <NuxtLink class="ms-5 text-blue-700" :href="pageRoutes.newForm"
          >ایجاد فرم</NuxtLink
        >
      </div>

      <template v-else>
        <div class="grid grid-cols-3 gap-3">
          <FormBuilderCard
            v-for="i in currentPageData"
            :key="i.form_id"
            :name="i.form_title"
            :created="secondsToPerDateStr(i.created_at)"
            :link="i.form_title"
            :form-id="i.form_id"
          />
        </div>

        <div
          v-if="totalPages > 1"
          class="flex items-center justify-center gap-8"
        >
          <FormIconButton
            icon-name="hugeicons:arrow-right-01"
            :class="defaultBorder"
            @click="movePage(page - 1)"
          />
          <form @submit.prevent="movePage(pageField)">
            <FormTextInput
              container-class="w-10"
              type="text"
              class="text-center"
              v-model="pageField"
              @focusout="movePage(pageField)"
            />
          </form>
          <span>از</span>
          <span>{{ enNumberToPer(totalPages) }}</span>
          <FormIconButton
            icon-name="hugeicons:arrow-left-01"
            :class="defaultBorder"
            @click="movePage(page + 1)"
          />
        </div>
      </template>
    </Section>
  </LayoutDefault>
</template>

<script setup lang="ts">
import { authApiList } from "~/api/authApiList";
import type { FormsResp } from "~/types/response/Forms";
import type { Form } from "~/types/serverData/Forms";

useHead({
  title: "داشبورد",
});
definePageMeta({
  requiredAuth: true,
});

const formsData = ref<FormsResp | null>(null);
const page = ref(1);
//: page text field for paginator
const pageField = ref(page.value);

const { handleAuthFetch, loading } = useHandleAuthFetch(true);

onMounted(async () => {
  const res = await handleAuthFetch(() => authApiList.getAllForms());

  if (res) {
    formsData.value = res.data;
  }
});

const totalPages = computed(() =>
  Math.ceil((formsData.value?.totla_quantity ?? 0) / FORMS_PAGE_COUNT)
);

const formListPages = computed(() => {
  //: data didn't fetch yet
  if (formsData.value == null) return [];
  /**
   * we have a forms list, a put data in it one by one,
   * if the forms filled, create a new page with page number.
   */
  const dataPaginated = formsData.value.data.reduce<{
    lastPage: number;
    forms: Form[];
    output: { page: number; forms: Form[] }[];
  }>(
    (acc, i) => {
      const { lastPage, forms, output } = acc;
      const newForms = [...forms, i];

      //: forms filled
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

  /**
   * If the forms didn't fill in last new page, we must create new page for it.
   */
  const createLastPage =
    dataPaginated.forms.length > 0
      ? [
          ...dataPaginated.output,
          { page: dataPaginated.lastPage, forms: dataPaginated.forms },
        ]
      : dataPaginated.output;

  return createLastPage;
});

const currentPageData = computed(
  () => formListPages.value.find((i) => i.page == page.value)?.forms ?? []
);

function movePage(np: number) {
  if (np <= totalPages.value && np > 0) {
    page.value = np;
    pageField.value = np;
  } else {
    pageField.value = page.value;
  }
}
</script>
