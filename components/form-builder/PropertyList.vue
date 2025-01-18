<template>
  <p
    v-for="(p, index) in model"
    :key="index"
    class="flex items-center gap-2 h-8"
  >
    <BulletNode :bullet-type="bulletType" :index="index" />
    {{ p }}
    <!-- delete -->
    <FormIconButton
      icon-name="hugeicons:cancel-01"
      class="bg-gray-300 rounded-full"
      small
      @click="removeProperty(index)"
    />
  </p>
  <form @submit.prevent="addProperty" class="flex items-center gap-2 h-8">
    <BulletNode :bullet-type="bulletType" />
    <input
      type="text"
      class="w-full h-full outline-none"
      placeholder="افزودن گزینه جدید …"
      v-model="newProperty"
    />
  </form>
</template>

<script setup lang="ts">
defineProps<{
  bulletType: "radio" | "checkbox" | "number";
}>();
const model = defineModel<string[]>({ required: true });

const newProperty = ref("");

const BulletNode = defineComponent<{ index?: number; bulletType: string }>(
  (props) => {
    return () =>
      props.bulletType == "radio"
        ? h("span", {
            class: "w-3 h-3 border rounded-full border-black",
          })
        : props.bulletType == "checkbox"
        ? h("div", {
            class: "w-3 h-3 border rounded border-black",
          })
        : props.bulletType == "number"
        ? h(
            "div",
            {},
            `${
              props.index != undefined
                ? (props.index + 1).toLocaleString("fa-IR")
                : "  "
            } -`
          )
        : h("span", {
            class: "w-3 h-3 border rounded-full border-black",
          });
  },
  {
    props: ["index", "bulletType"],
  }
);

function addProperty() {
  model.value = [...(model.value ?? []), newProperty.value];
  newProperty.value = "";
}
function removeProperty(index: number) {
  (model.value ?? []).splice(index, 1);
}
</script>
