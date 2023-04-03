<template>
  <div
    class="bg-secondary shadow-15 column items-center no-wrap"
    style="height: 100%; overflow-y: scroll; scrollbar-width: none"
  >
    <div
      v-for="(data, name) in storedData"
      :key="name"
      class="q-my-md"
      :class="Object.keys(storedData).length > 3 ? 'col-grow' : ''"
      spinner-color="blue"
      style="width: 60%; aspect-ratio: 1"
    >
      <q-img
        :src="
          'polite://' +
          localStorage.getItem('gPath') +
          '/garrysmod/data/e2files/e2shared/datafiles/e2imageloader/images/' +
          name +
          data.ext
        "
        :style="data.active ? 'border:solid green' : ''"
        @click="clickOn(name, data)"
      />
      <q-btn
        round
        color="red"
        icon="delete"
        style="position: relative; bottom: 25px; right: 15px"
        @click="deleteImage(name, data)"
      />
    </div>
  </div>
</template>

<script>
import { toRaw } from "vue";
import { useQuasar } from "quasar";
import { languageProvider } from "src/providers/language_provider";

export default {
  name: "ImageShower",
  data() {
    return {
      storedData: {},
      localStorage,
      $q: useQuasar(),
    };
  },
  methods: {
    deleteImage(name, data) {
      if (this.storedData.hasOwnProperty(name)) {
        delete this.storedData[name];
        localStorage.setItem(
          "transformedImages",
          JSON.stringify(this.storedData)
        );
        window.myAPI.deleteSavedImage(name, toRaw(data));
      }
    },
    async clickOn(name, data) {
      if (!this.storedData[name].active) {
        let result = await window.myAPI.chooseActiveImage(name);

        if (result) {
          for (let n in this.storedData) {
            this.storedData[n].active = false;
          }
          this.storedData[name].active = true;
        } else {
          this.$q.notify({
            message: languageProvider.getPhrase("imageshower.error"),
            color: "red",
          });
          this.deleteImage(name, data.ext);
        }
      }

      localStorage.setItem(
        "transformedImages",
        JSON.stringify(this.storedData)
      );
    },
  },
  mounted() {
    //localStorage.removeItem("transformedImages");
    if (localStorage.getItem("transformedImages") == null) {
      localStorage.setItem("transformedImages", JSON.stringify({}));
    }
    this.storedData = JSON.parse(localStorage.getItem("transformedImages"));
    window.myAPI.transformImageDone((e, data) => {
      let storedData = JSON.parse(localStorage.getItem("transformedImages"));
      storedData[data.name] = { active: false, ext: data.ext };
      this.storedData = storedData;
      localStorage.setItem("transformedImages", JSON.stringify(storedData));
    });
  },
};
</script>

<style lang="scss" scoped>
::-webkit-scrollbar {
  width: 0; /* Remove scrollbar space */
  background: transparent; /* Optional: just make scrollbar invisible */
}
</style>
