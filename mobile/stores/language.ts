import { defineStore } from "pinia";

export const useLanguageStore = defineStore("imageD", {
  state: () => ({
    languageWeb: null,
  }),
  actions: {
    updateLanguage(data) {
      this.languageWeb = data;
    },
  },
});
