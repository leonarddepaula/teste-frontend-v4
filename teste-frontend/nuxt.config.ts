// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },

  alias: {
    css: "<srcDir>/assets",
  },
  modules: [
    "@nuxt/ui",
    "@nuxtjs/leaflet",
    "@nuxtjs/leaflet",
    "@pinia/nuxt",
    "pinia-plugin-persistedstate/nuxt",
    "@nuxt/image",
  ],
  css: ["~/assets/css/tailwind.css"],
  pinia: {
    storesDirs: ["./stores/**"],
  },
});