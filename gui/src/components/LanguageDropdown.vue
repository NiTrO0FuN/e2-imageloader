<template>
  <div class="q-px-sm">
    <q-btn-dropdown color="primary" :label="languageProvider.language">
      <q-list class="bg-secondary">
        <q-item
          v-for="lang in languageProvider.getAvailableLanguages()"
          :key="lang"
          clickable
          v-close-popup
          @click="changeLanguage(lang)"
        >
          <q-item-section>
            <q-item-label style="color: white">{{
              lang.toUpperCase()
            }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>
  </div>
</template>

<script>
import { languageProvider } from "src/providers/language_provider";
export default {
  name: "LanguageDropdown",
  data() {
    return {
      languageProvider,
    };
  },
  methods: {
    changeLanguage(lang) {
      languageProvider.language = lang;
      languageProvider.saveLang();
    },
  },
};
</script>

<style lang="scss" scoped></style>
