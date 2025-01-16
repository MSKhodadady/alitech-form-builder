// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },

  runtimeConfig: {
    public: {
      serverAddress: "https://interview.cetri.ir",
    },
  },
  tailwindcss: { config: {}, editorSupport: { autocompleteUtil: true } },

  modules: ["@nuxtjs/tailwindcss", "@nuxt/fonts", "@nuxt/icon"],
});