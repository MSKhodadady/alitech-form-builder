<template>
  <p
    v-for="(p, index) in model"
    :key="index"
    class="flex items-center gap-2 h-8"
  >
    <BulletNode :type="type" />
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
    <BulletNode :type="type" />
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
  type: "radio" | "checkbox" | "number";
}>();
const model = defineModel<string[]>({ required: true });

const newProperty = ref("");

const BulletNode = defineComponent<{ index?: number; type: string }>(
  (props) => {
    return () => {
      switch (props.type) {
        case "radio":
          return h("span", {
            class: "w-3 h-3 border rounded-full border-black",
          });

        default:
          return h("span", {
            class: "w-3 h-3 border rounded-full border-black",
          });
      }
    };
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
