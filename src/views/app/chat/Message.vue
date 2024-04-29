<template>
  <div
    v-if="item.type === 'text'"
    class="mb-0 ctext-content"
    v-html="decryptData(item.message).replace(/\n/g, '<br />')"
  ></div>
  <div v-else-if="item.type === 'file'">
    <div v-if="JSON.parse(decryptData(item.message)).category === 'image'">
      <img
        v-if="JSON.parse(decryptData(item.message))?.uuid"
        class="cursor-pointer"
        :src="`${BASE_URL}cor/file/load/${JSON.parse(decryptData(item.message)).uuid}`"
        :alt="JSON.parse(decryptData(item.message)).name"
        :title="JSON.parse(decryptData(item.message)).name"
        style="max-width: 200px; max-height: 200px"
        :style="{
          width: loaded[item.id] ? 'auto' : '150px',
          height: loaded[item.id] ? 'auto' : '200px',
        }"
        @load="loaded[item.id] = true"
        @click="handleViewImage"
        @dblclick="handlePreviewFile(JSON.parse(decryptData(item.message)))"
        loading="lazy"
      />
      <img
        v-else
        :src="require('@/assets/images/gif/loading.gif')"
        :title="JSON.parse(decryptData(item.message)).name"
        style="width: 200px; height: 200px; padding: 82px"
      />
    </div>
    <div
      v-else
      @dblclick="handlePreviewFile(JSON.parse(decryptData(item.message)))"
      class="d-flex align-items-center cursor-pointer"
    >
      <div class="me-2">
        <i
          class="file-icon"
          :class="FileIcons.getClassWithColor(JSON.parse(decryptData(item.message)).name)"
        />
      </div>
      <div
        class="flex-grow-1 overflow-hidden"
        style="width: 160px; line-height: 100%"
        :style="item.sender != $store.state.user.data.username && 'text-align: right'"
      >
        <div
          class="fs-14 text-dark text-truncate"
          :title="JSON.parse(decryptData(item.message)).name"
        >
          {{ JSON.parse(decryptData(item.message)).name }}
        </div>
        <div class="fs-10 mt-1 text-muted">
          {{ size2Str(JSON.parse(decryptData(item.message)).size) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { decryptData, size2Str } from '@utils';

// eslint-disable-next-line
// eslint-disable-next-line
defineProps({
  item: {
    type: Object,
    required: true,
  },
});

// eslint-disable-next-line
const emits = defineEmits(['view-image']);

const { FileIcons } = window;
const { BASE_URL } = process.env;
const router = useRouter();

const loaded = reactive({});

let timer = null;
const handleViewImage = () => {
  clearTimeout(timer);
  timer = setTimeout(() => {
    emits('view-image');
  }, 100);
};

const handlePreviewFile = (file) => {
  clearTimeout(timer);
  const route = router.resolve({ name: 'preview', params: { uuid: file.uuid } });
  window.open(route.href, '_blank');
};
</script>
