<template>
  <span v-if="params.value && params.value.length">
    <div class="avatar-group">
      <div
        v-for="(file, index) in params.value"
        :key="index"
        class="avatar-group-item"
        :title="file.name"
      >
        <img
          v-if="file.category == 'image'"
          :src="`${BASE_URL}cor/file/load/${file.uuid}`"
          class="bg-light avatar-xs rounded cursor-pointer overflow-hidden"
          style="box-shadow: 0px 3px 5px 0px rgba(30, 32, 37, 0.3)"
          @click="
            handleClickImage(() => {
              const images = params.value.filter((file) => file.category == 'image');
              $viewerApi({
                options: {
                  focus: false,
                  movable: false,
                  initialViewIndex: images.findIndex((image) => image.uuid == file.uuid),
                },
                images: images.map((image) => {
                  return `${BASE_URL}cor/file/load/${image.uuid}`;
                }),
              });
            })
          "
          @dblclick="handleDbclickFile(file)"
          loading="lazy"
        />
        <i
          v-else
          class="bg-light avatar-xs rounded cursor-pointer overflow-hidden file-icon"
          style="box-shadow: 0px 3px 5px 0px rgba(30, 32, 37, 0.3)"
          :class="$fileIcons.getClassWithColor(file.name)"
          @dblclick="handleDbclickFile(file)"
        />
      </div>
    </div>
  </span>
  <span v-else></span>
</template>

<script>
import { defineComponent } from 'vue';
import router from '@/router';
export default defineComponent({
  setup() {
    let timer = null;
    const handleClickImage = (cb) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        cb && cb();
      }, 200);
    };
    const handleDbclickFile = (file) => {
      clearTimeout(timer);
      const { href } = router.resolve({ name: 'preview', params: { uuid: file.uuid } });
      window.open(href, '_blank');
    };
    return {
      handleClickImage,
      handleDbclickFile,
    };
  },
});
</script>
