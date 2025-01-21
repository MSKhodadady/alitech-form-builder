<template>
  <LayoutDefault>
    <template #header>
      <div class="mb-6">
        <span class="text-2xl font-bold drop-shadow-md"> ویرایش فرم </span>
      </div>
    </template>
    <template #default>
      <!-- if data loaded -->
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

useHead({
  title: "ویرایش فرم",
});
definePageMeta({
  requiredAuth: true,

  validate(route) {
    const { formId } = route.params;
    return formId != undefined || !Array.isArray(formId);
  },
});

//: read formId
const route = useRoute();
const { formId } = route.params as { formId: string };

//: data fetched from server written into `initForm`.
//: `newForm` is used for mutating data.
//: Then we can compare them to check if data changed and enable save button.
const initForm = ref<Form | null>(null);
const newForm = ref<EditFormBuilderModel | null>(null);

const { handleAuthFetch, loading, showAlert } = useHandleAuthFetch();

onMounted(async () => {
  //: fetch data
  const f = await handleAuthFetch(() => authApiList.getForm(formId));
  if (f == undefined) {
    throw createError({
      statusCode: 404,
      fatal: true,
    });
  }

  initForm.value = f.data;

  //: calculate newForm based on `FormBuilder` model
  const { form_title, description, form_type, sections } = f.data;
  newForm.value = {
    form_title,
    description,
    form_type,
    //: each section must have key for render vue-list.
    //: refer to FormBuilder model to for more info.
    sections: sections.map((i, index) => ({ ...i, key: index })),
    formItemKeyCounter: sections.length,
  };
});

//: checker for data changed.
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
    //: compare sections
    //: length must be equal
    aSec.length == bSec.length &&
    //: every section from A must have some section in B equal to it.
    aSec.every((i) =>
      bSec.some(
        (j) =>
          i.title == j.title &&
          i.required == j.required &&
          i.type == j.type &&
          //: every prop in i must have equal prop in j equal to it.
          i.properties.every((k) => j.properties.some((l) => k == l))
      )
    )
  );
});

async function onSubmit() {
  //: if not changed return
  if (newForm.value == null || notChanged.value) return;

  const { formItemKeyCounter, sections, ...other } = newForm.value;
  const body: FromBuilder = {
    ...other,
    //: remove not needed `key` from sections
    sections: sections.map(({ key, ...other }) => other),
  };

  const res = await handleAuthFetch(() => authApiList.updateForm(formId, body));

  if (res && res.ok) {
    showAlert("تغییرات با موفقیت ذخیره شدند.", "success");
    navigateTo(pageRoutes.dashboard);
  }
}

async function onDelete() {
  const res = await handleAuthFetch(() => authApiList.deleteForm(formId));

  if (res && res.ok) {
    showAlert("فرم با موفقیت حذف شد.", "success");
    navigateTo(pageRoutes.dashboard);
  }
}
</script>
