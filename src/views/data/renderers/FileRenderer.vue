<template>
  <span v-if="params.value && params.value.length">
    <div class="avatar-group" :style="{ 'margin-top': theme === 'alpine' ? '' : '-1px' }">
      <div
        v-for="(file, index) in params.value"
        :key="index"
        class="avatar-group-item"
        :title="file.name"
      >
        <img
          v-if="file.category === 'image'"
          :src="`${BASE_URL}cor/file/load/${file.uuid}`"
          class="bg-light rounded cursor-pointer overflow-hidden"
          style="box-shadow: 0px 3px 5px 0px rgba(30, 32, 37, 0.3)"
          :style="{
            height: theme === 'alpine' ? '2rem' : '1.3rem',
            width: theme === 'alpine' ? '2rem' : '1.3rem',
          }"
          @click="
            handleClickImage(() => {
              const images = params.value.filter((file) => file.category === 'image');
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
          class="bg-light rounded cursor-pointer overflow-hidden file-icon"
          :class="$fileIcons.getClassWithColor(file.name)"
          style="box-shadow: 0px 3px 5px 0px rgba(30, 32, 37, 0.3)"
          :style="{
            height: theme === 'alpine' ? '2rem' : '1.3rem',
            width: theme === 'alpine' ? '2rem' : '1.3rem',
          }"
          @dblclick="handleDbclickFile(file)"
        />
      </div>
    </div>
  </span>
</template>

<script>
import { defineComponent, computed } from 'vue';
import router from '@/router';
export default defineComponent({
  setup(props) {
    const theme = computed(() => {
      return props.params.api.getTheme();
    });

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
      theme,
      handleClickImage,
      handleDbclickFile,
    };
  },
});
</script>
