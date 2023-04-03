<template>
  <div class="column no-wrap" style="height: 100vh">
    <q-toolbar class="bg-primary text-white">
      <q-avatar square>
        <img
          src="https://mystickermania.com/cdn/stickers/memes/polite-cat-meme-512x512.png"
        />
      </q-avatar>

      <q-toolbar-title>E2 Image Loader</q-toolbar-title>
      <LanguageDropdown />
      <GmodChooser />
      <q-btn flat round dense icon="whatshot">
        <q-menu class="bg-secondary" anchor="bottom middle" self="top middle">
          <q-item>
            <q-item-section style="color: white">{{
              languageProvider.getPhrase("updates.v0.0")
            }}</q-item-section>
          </q-item>
          <q-item>
            <q-item-section style="color: white">{{
              languageProvider.getPhrase("updates.v0.1")
            }}</q-item-section>
          </q-item>
        </q-menu>
      </q-btn>
    </q-toolbar>

    <div class="col" style="height: 100%">
      <router-view />
    </div>
  </div>
</template>

<script>
import GmodChooser from "src/components/GmodChooser.vue";
import { defineComponent } from "vue";
import { languageProvider } from "src/providers/language_provider";
import LanguageDropdown from "src/components/LanguageDropdown.vue";

export default defineComponent({
  name: "MainLayout",
  data() {
    return {
      languageProvider,
    };
  },
  components: { GmodChooser, LanguageDropdown },
});
</script>
