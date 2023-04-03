<template>
  <div class="row no-wrap" style="height: 100%">
    <ImageUpload class="col-grow" />
    <ImageShower class="col-3" />
  </div>
</template>

<script>
import { defineComponent } from "vue";
import ImageUpload from "src/components/ImageUpload.vue";
import ImageShower from "src/components/ImageShower.vue";

export default defineComponent({
  name: "IndexPage",
  components: {
    ImageUpload,
    ImageShower,
  },
});
</script>
