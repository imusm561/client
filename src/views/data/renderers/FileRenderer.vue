<template>
  <span v-if="params.value && params.value.length">
    <div class="avatar-group" style="margin-top: -2px">
      <span
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
            height: ['alpine', 'quartz'].includes(theme) ? '32px' : '20px',
            width: ['alpine', 'quartz'].includes(theme) ? '32px' : '20px',
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
          class="bg-light rounded cursor-pointer overflow-hidden"
          :class="[
            ['alpine', 'quartz'].includes(theme) ? 'file-icon' : 'file-icon file-icon-md',
            FileIcons.getClassWithColor(file.name),
          ]"
          style="box-shadow: 0px 3px 5px 0px rgba(30, 32, 37, 0.3)"
          @dblclick="handleDbclickFile(file)"
        />
      </span>
    </div>
  </span>
  <span v-else></span>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';

// eslint-disable-next-line
const props = defineProps(['params']);

const { FileIcons } = window;
const { BASE_URL } = process.env;
const router = useRouter();

const theme = computed(() => {
  return props.params.api.getTheme();
});

let timer = null;
const handleClickImage = (callback) => {
  clearTimeout(timer);
  timer = setTimeout(() => {
    callback && callback();
  }, 200);
};
const handleDbclickFile = (file) => {
  clearTimeout(timer);
  const { href } = router.resolve({ name: 'preview', params: { uuid: file.uuid } });
  window.open(href, '_blank');
};
</script>
