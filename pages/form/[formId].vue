<template>
  {{ initForm }}
</template>

<script setup lang="ts">
import { authApiList } from "~/api/authApiList";
import type { Form } from "~/types/serverData/Forms";
import type { ResponseShapeSuccess } from "~/types/serverData/ResponseShape";

definePageMeta({
  validate(route) {
    const { formId } = route.params;
    return formId != undefined || !Array.isArray(formId);
  },
});

const route = useRoute();
const { formId } = route.params as { formId: string };

const initForm = ref<Form | null>(null);
const newForm = ref<Form | null>(null);

const { handleAuthFetch, loading } = useHandleAuthFetch();

onMounted(async () => {
  const f = await handleAuthFetch<ResponseShapeSuccess<Form>>(() =>
    authApiList.getForm(formId)
  );

  if (f == undefined) {
    navigateTo(pageRoutes.dashboard);
    return;
  }

  initForm.value = f.data;
  newForm.value = f.data;
});
</script>
