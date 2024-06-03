// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["nuxt-directus", "@pinia/nuxt", "@nuxt/ui"],
  runtimeConfig: {
    databaseUrl: "",
    directusUrl: process.env.DIRECTUS_PUBLIC_URL,
    public: {
      url: "",
      directus: {
        url: process.env.DIRECTUS_PUBLIC_URL,
      },
    },
  },
  pinia: {
    storesDirs: ["./stores/**"],
  },
});