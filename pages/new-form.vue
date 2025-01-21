<template>
  <LayoutDefault>
    <template #header>
      <div class="mb-6">
        <span class="text-2xl font-bold drop-shadow-md">ساخت فرم</span>
      </div>
    </template>

    <FormBuilder
      v-model="formBuilderState"
      :loading="loading"
      :form-id="null"
      @submit="submitForm"
    />
  </LayoutDefault>
</template>

<script setup lang="ts">
import { authApiList } from "~/api/authApiList";
import type { FormBuilderModel } from "~/types/FormBuilder";

useHead({
  title: "ساخت فرم",
});
definePageMeta({
  requiredAuth: true,
});

//: init state for FormBuilder model
const formBuilderState = reactive<FormBuilderModel>({
  form_title: "",
  description: "",
  form_type: null,
  sections: [],
  formItemKeyCounter: 0,
});

const { loading, handleAuthFetch, showAlert } = useHandleAuthFetch();

async function submitForm() {
  const { form_type } = formBuilderState;

  //: for certainty
  if (form_type != "public" && form_type != "private") return;

  const res = await handleAuthFetch(() =>
    authApiList.createForm({
      ...formBuilderState,
      form_type,
    })
  );

  if (res != undefined) {
    showAlert("فرم با موفقیت ساخته شد.", "success");
    navigateTo(pageRoutes.dashboard);
  }
}
</script>
