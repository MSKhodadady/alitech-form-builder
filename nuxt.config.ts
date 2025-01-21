// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },

  runtimeConfig: {
    public: {
      serverAddress: "https://interview.cetri.ir",
    },
  },
  tailwindcss: {
    config: {
      theme: {
        extend: {
          colors: {
            "app-back": "#f9eff0",
            primary: "#3e3e3e",
            secondary: "#da745d",
            header: "#300030",
          },
        },
      },
    },
    editorSupport: { autocompleteUtil: true },
  },

  modules: ["@nuxtjs/tailwindcss", "@nuxt/fonts", "@nuxt/icon", "@pinia/nuxt"],
});
