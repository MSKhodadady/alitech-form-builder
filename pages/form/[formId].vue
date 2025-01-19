<template>
  <template v-if="newForm">
    <FormBuilder
      v-model="newForm"
      :form-id="formId"
      :submit-disabled="notChanged"
    />
  </template>
</template>

<script setup lang="ts">
import { authApiList } from "~/api/authApiList";
import type { FormBuilderModel } from "~/types/FormBuilder";
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
const newForm = ref<FormBuilderModel | null>(null);

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

  const { form_title, description, form_type, sections } = f.data;
  newForm.value = {
    form_title,
    description,
    form_type,
    sections: sections.map((i, index) => ({ ...i, key: index })),
    formItemKeyCounter: sections.length,
  };
});

const notChanged = computed(() => {
  if (initForm.value == null || newForm.value == null) {
    return false;
  }

  const {
    form_title: aTitle,
    description: aDesc,
    sections: aSec,
  } = initForm.value;
  const {
    form_title: bTitle,
    description: bDesc,
    sections: bSec,
  } = newForm.value;

  return (
    aTitle == bTitle &&
    aDesc == bDesc &&
    aSec.length == bSec.length &&
    aSec.every((i) =>
      bSec.some(
        (j) =>
          i.title == j.title &&
          i.required == j.required &&
          i.type == j.type &&
          i.properties.every((k) => j.properties.some((l) => k == l))
      )
    )
  );
});

function onSubmit() {}
</script>
