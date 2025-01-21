<template>
  <div class="h-screen w-full flex items-center justify-center">
    <form
      class="bg-white rounded-xl max-w-sm w-full py-10 px-8 shadow-md font-bold"
      @submit.prevent="onSubmit"
    >
      <h1 class="text-2xl text-[#300030]">خوش آمدید</h1>

      <p class="text-slate-400 mt-4 mb-6">
        برای ورود، ایمیل و رمز عبور خود را وارد کنید.
      </p>

      <FormTextInput
        type="text"
        label="ایمیل"
        container-class="mb-1"
        v-model="email"
        :err-text="emailErr"
      >
        <Icon name="hugeicons:mail-02" class="w-6 h-6 m-2" />

        <template #err
          ><p class="mt-1 text-red-600 text-xs h-6">{{ emailErr }}</p></template
        >
      </FormTextInput>

      <FormTextInput
        type="password"
        label="رمز عبور"
        container-class="mb-1"
        v-model="password"
        dir="ltr"
        class="text-right"
        :err-text="passwordErr"
      >
        <Icon name="hugeicons:square-lock-02" class="w-6 h-6 m-2" />

        <template #err
          ><p class="mt-1 text-red-600 text-xs h-9">
            {{ passwordErr }}
          </p></template
        >
      </FormTextInput>

      <FormActionButton type="submit" class="w-full h-12 text-center">
        ورود
      </FormActionButton>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { apiList } from "~/utils/api/authApiList";
import { emailRegex, passwordRegex } from "~/utils/layout/validation";

useHead({
  title: "ورود",
});
definePageMeta({
  isLogin: true,
});

const email = ref("");
const password = ref("");
const emailErr = ref("");
const passwordErr = ref("");

const { showAlert } = useAlertStore();

async function onSubmit() {
  emailErr.value = "";
  passwordErr.value = "";

  const requiredText = "لازم است.";

  //: fill err texts
  if (email.value == "") emailErr.value = requiredText;
  else if (!emailRegex.test(email.value)) emailErr.value = "صحیح نیست.";

  if (password.value == "") passwordErr.value = requiredText;
  else if (!passwordRegex.test(password.value))
    passwordErr.value =
      "پسورد باید حداقل ۸ کاراکتر شامل حروف کوچک و بزرگ، عدد و نماد باشد.";

  //: if we have err text, we have err, so return
  if (emailErr.value != "" || passwordErr.value != "") {
    return;
  }

  const res = await apiList.signInUp(email.value, password.value);

  if (res == "success") {
    showAlert("شما با موفقیت وارد شدید.", "success");
    navigateTo(pageRoutes.dashboard);
  } else if (res == "password-err") {
    showAlert("رمز یا ایمیل وارد شده اشتباه است.", "danger");
  } else if (res == "server-err") {
    showAlert("خطای سرور", "warn");
  }
}

//: if one of email or password changed, clear errors.
watch([email, password], () => {
  emailErr.value = "";
  passwordErr.value = "";
});
</script>
