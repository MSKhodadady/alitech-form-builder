<template>
  <LayoutDefault>
    <template #header>
      <div class="mb-6">
        <span class="text-2xl font-bold drop-shadow-md"> ویرایش فرم </span>
      </div>
    </template>
    <template #default>
      <template v-if="newForm">
        <FormBuilder
          v-model="newForm"
          :form-id="formId"
          :submit-disabled="notChanged"
          :loading="loading"
          @submit="onSubmit"
          @delete="onDelete"
        />
      </template>
      <template v-else>
        <Section class="w-full !border-none"> لطفا صبر کنید. </Section>
      </template>
    </template>
  </LayoutDefault>
</template>

<script setup lang="ts">
import { authApiList } from "~/api/authApiList";
import type { EditFormBuilderModel, FromBuilder } from "~/types/FormBuilder";
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
const newForm = ref<EditFormBuilderModel | null>(null);

const { handleAuthFetch, loading, showAlert } = useHandleAuthFetch();

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

async function onSubmit() {
  if (newForm.value == null || notChanged.value) return;

  const { formItemKeyCounter, sections, ...other } = newForm.value;
  const body: FromBuilder = {
    ...other,
    sections: sections.map(({ key, ...other }) => other),
  };

  const res = await handleAuthFetch<ResponseShapeSuccess>(() =>
    authApiList.updateForm(formId, body)
  );

  if (res && res.ok) {
    showAlert("تغییرات با موفقیت ذخیره شدند.", "success");
    navigateTo(pageRoutes.dashboard);
  }
}

async function onDelete() {
  const res = await handleAuthFetch<ResponseShapeSuccess>(() =>
    authApiList.deleteForm(formId)
  );

  if (res && res.ok) {
    showAlert("فرم با موفقیت حذف شد.", "success");
    navigateTo(pageRoutes.dashboard);
  }
}
</script>
