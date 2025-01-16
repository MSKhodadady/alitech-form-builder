<template>
  {{ serverAddress }}
</template>

<script setup lang="ts">
const {
  public: { serverAddress },
} = useRuntimeConfig();
</script>
