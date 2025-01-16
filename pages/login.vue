<template>
  <div class="h-screen w-full flex items-center justify-center">
    <form
      class="bg-white rounded-xl max-w-sm w-full py-10 px-8 shadow-lg font-bold"
      @submit.prevent="onSubmit"
    >
      <h1 class="text-2xl text-[#300030]">خوش آمدید</h1>

      <p class="text-slate-400 mt-4 mb-6">
        برای ورود، ایمیل و رمز عبور خود را وارد کنید.
      </p>

      <TextInput
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
      </TextInput>

      <TextInput
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
      </TextInput>

      <button
        type="submit"
        class="w-full h-12 text-center bg-[#3e3e3e] text-white rounded-xl"
      >
        ورود
      </button>
    </form>
  </div>
</template>

<script lang="ts" setup>
const email = ref("");
const password = ref("");
const emailErr = ref("");
const passwordErr = ref("");

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[~`!@#$%^&*()_\-+=:;"'?/\\]).{8,}$/;
const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
const requiredText = "لازم است.";

function onSubmit() {
  emailErr.value = "";
  passwordErr.value = "";

  if (email.value == "") emailErr.value = requiredText;
  else if (!emailRegex.test(email.value)) emailErr.value = "صحیح نیست.";

  if (password.value == "") passwordErr.value = requiredText;
  else if (!passwordRegex.test(password.value))
    passwordErr.value =
      "پسورد باید حداقل ۸ کاراکتر شامل حروف کوچک و بزرگ، عدد و نماد باشد.";

  if (emailErr.value != "" || passwordErr.value != "") {
    return;
  }

  alert("success");
}

watch([email, password], () => {
  emailErr.value = "";
  passwordErr.value = "";
});
</script>
