<template>
  <div :class="containerClass">
    <p class="mb-1">{{ label }}</p>
    <div class="rounded-xl border-gray-200 border-2 p-1 flex items-center">
      <slot></slot>
      <input
        class="w-full h-full outline-none"
        :type="
          type != 'password' ? type : revealedPassword ? 'text' : 'password'
        "
        v-model="model"
        v-bind="$attrs"
      />

      <template v-if="type == 'password'"
        ><div class="w-6 h-6" @click="revealedPassword = !revealedPassword">
          <template v-if="revealedPassword">
            <Icon name="hugeicons:view-off" class="w-6 h-6" />
          </template>
          <template v-else
            ><Icon name="hugeicons:view" class="w-6 h-6"
          /></template></div
      ></template>
    </div>
    <slot name="err"></slot>
  </div>
</template>

<script lang="ts" setup>
import type { InputTypeHTMLAttribute } from "vue";

defineOptions({
  inheritAttrs: false,
});

defineProps<{
  label: string;
  containerClass?: string;
  type?: InputTypeHTMLAttribute;
}>();

const model = defineModel();

const revealedPassword = ref(false);
</script>
