<template>
  <Menu as="div" class="relative">
    <MenuButton :class="[menuButtonClass, 'w-full']" :disabled="disabled">
      <p class="mb-1 text-start" v-if="label">{{ label }}</p>
      <div
        :class="[
          'rounded-xl border-gray-200 border-2 p-1 flex items-center justify-between',
          disabled ? 'bg-gray-200' : '',
        ]"
      >
        <span>{{
          items.find((i) => i.id == model)?.text ?? "انتخاب کنید"
        }}</span>
        <Icon name="hugeicons:arrow-down-01" />
      </div>
    </MenuButton>

    <transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <MenuItems
        :class="[
          menuItemContainerClass,
          'absolute z-50 right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-xl bg-white shadow-lg ring-1 ring-black/5 focus:outline-none',
        ]"
      >
        <div class="px-1 py-1">
          <MenuItem
            v-for="item in items"
            v-slot="{ active }"
            :key="item.id"
            @click="model = item.id"
          >
            <button
              :class="[
                'group flex w-full items-center rounded-xl px-2 py-2 text-sm text-black',
                active ? 'bg-gray-200' : '',
              ]"
            >
              {{ item.text }}
            </button>
          </MenuItem>
        </div>
      </MenuItems>
    </transition>
  </Menu>
</template>

<script setup lang="ts">
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";

const model = defineModel<null | string>();

defineProps<{
  menuButtonClass?: string;
  menuItemContainerClass?: string;
  items: { text: string; id: string }[];
  label?: string;
  disabled?: boolean;
}>();
</script>
