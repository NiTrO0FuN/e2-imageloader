<template>
  <div v-if="!allowed" class="bg-secondary column flex-center">
    <q-icon
      size="10em"
      name="img:https://mystickermania.com/cdn/stickers/memes/polite-cat-meme-512x512.png"
    />
    <div
      class="row wrap justify-center items-center q-mt-lg"
      style="max-width: 70vw"
    >
      <span style="color: white; text-align: center">{{
        languageProvider.getPhrase("uploader.choosedirectory1")
      }}</span>
      <q-icon
        size="2em"
        class="q-mx-sm"
        name="img:https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Garry%27s_Mod_logo.svg/1024px-Garry%27s_Mod_logo.svg.png"
      />
      <span style="color: white">{{
        languageProvider.getPhrase("uploader.choosedirectory2")
      }}</span>
    </div>
  </div>
  <div v-else-if="transforming" class="bg-secondary column flex-center">
    <q-circular-progress
      show-value
      font-size="10px"
      class="q-ma-md"
      :value="progress"
      size="80px"
      :thickness="0.25"
      color="teal"
      track-color="grey-3"
    >
      <q-avatar size="60px">
        <img src="https://cdn.quasar.dev/logo-v2/svg/logo.svg" />
      </q-avatar>
    </q-circular-progress>
  </div>
  <div
    v-else
    class="bg-secondary column flex-center"
    :style="{ height: '100%', border: active ? '5px dashed' : '' }"
    @drop.prevent="onDrop"
    @dragenter.prevent="setActive"
    @dragover.prevent="setActive"
    @dragleave.prevent="setInactive"
  >
    <q-icon name="file_download" size="7em" color="white" />
    <div style="color: white">
      {{ languageProvider.getPhrase("uploader.drop_an_image") }}
    </div>
  </div>
</template>

<script>
import { languageProvider } from "src/providers/language_provider";

export default {
  name: "ImageUpload",
  data() {
    return {
      allowed: false,
      languageProvider,
      active: false,
      allowedFormats: {
        "image/jpeg": true,
        "image/png": true,
      },
      transforming: false,
      progress: 0,
    };
  },
  methods: {
    updateProgress(data, file_nbr) {
      this.progress += data / file_nbr;
      if (this.progress >= 99) {
        this.transforming = false;
        this.progress = 0;
        return;
      }
      window.myAPI.transformImageFeedbackHandler((e, data) => {
        this.updateProgress(data, file_nbr);
      });
    },
    onDrop(e) {
      let file_nbr = e.dataTransfer.files.length;
      window.myAPI.transformImageFeedbackHandler((e, data) => {
        this.updateProgress(data, file_nbr);
      });
      for (const file of e.dataTransfer.files) {
        if (this.allowedFormats[file.type]) {
          this.transforming = true;
          window.myAPI.transformImage(file);
        }
      }
      this.setInactive();
    },
    setActive(e) {
      this.active = true;
    },
    setInactive(e) {
      this.active = false;
    },
  },
  computed: {
    language() {
      return languageProvider.language;
    },
  },
  watch: {
    language(newValue, oldValue) {
      this.$forceUpdate();
    },
  },
  mounted() {
    window.myAPI.isGMODPathValidFeedbackHandler((e, valid) => {
      this.allowed = valid;
    });
    window.myAPI.isGMODPathValid();
  },
};
</script>

<style lang="scss" scoped></style>
