<template>
  <q-btn
    flat
    dense
    icon="img:https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Garry%27s_Mod_logo.svg/1024px-Garry%27s_Mod_logo.svg.png"
    @click="updateGmodPath"
  >
    <q-tooltip>{{ gmodPath }}</q-tooltip>
  </q-btn>
</template>

<script>
import { useQuasar } from "quasar";
import { defineComponent } from "vue";
import { languageProvider } from "../providers/language_provider";

export default defineComponent({
  name: "GmodChooser",
  data() {
    return {
      gmodPath: "",
      $q: useQuasar(),
    };
  },
  methods: {
    async updateGmodPath() {
      let choosenPath = await window.myAPI.openDirectoryDialog();
      if (!choosenPath) {
        //console.log("Aucun dossier choisi");
      } else if (choosenPath == "Wrong directory") {
        //console.log("Dossier pas Gmod");
        this.$q.notify({
          message: languageProvider.getPhrase("gchooser.wrongdirectory"),
          color: "red",
        });
      } else {
        this.$q.notify({
          message: languageProvider.getPhrase("gchooser.correctdirectory"),
          color: "green",
        });
        localStorage.setItem("gPath", choosenPath);
        this.gmodPath = choosenPath;
      }
    },
  },
  mounted() {
    let gStoredPath = localStorage.getItem("gPath");
    this.gmodPath =
      gStoredPath == null
        ? languageProvider.getPhrase("gchooser.choosedirectory")
        : gStoredPath;
    window.myAPI.updateGMODPath(this.gmodPath);
  },
});
</script>

<style lang="scss" scoped></style>
