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

const formBuilderState = reactive<FormBuilderModel>({
  form_title: "",
  description: "",
  form_type: null,
  sections: [],
  formItemKeyCounter: 0,
});

const { loading, handleAuthFetch, showAlert } = useHandleAuthFetch();

function submitForm() {
  const { form_type } = formBuilderState;
  if (form_type != "public" && form_type != "private") return;

  const res = handleAuthFetch(() =>
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
