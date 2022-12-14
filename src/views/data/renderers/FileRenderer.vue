<template>
  <span v-if="params.value && params.value.length">
    <div class="mt-1">
      <div class="avatar-group">
        <span v-for="(file, index) in params.value" :key="index" class="avatar-group-item cursor-pointer">
          <div :title="file.name">
            <img
              v-if="file.category == 'image'"
              :src="`/cor/file/load/${file.uuid}`"
              class="avatar-xs cursor-pointer mb-3"
              @click="
                handleClickImage(() => {
                  let images = params.value.filter((file) => file.category == 'image');
                  $viewerApi({
                    options: {
                      focus: false,
                      movable: false,
                      initialViewIndex: images.findIndex((image) => image.uuid == file.uuid),
                    },
                    images: images.map((image) => {
                      return `/cor/file/load/${image.uuid}`;
                    }),
                  });
                })
              "
              @dblclick="handleDbclickFile(file)"
            />
            <i v-else class="file-icon" :class="$fileIcons.getClassWithColor(file.name)" @dblclick="handleDbclickFile(file)" />
          </div>
        </span>
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
