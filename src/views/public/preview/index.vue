<template>
  <div class="align-items-center d-flex justify-content-center m-0 p-0 w-100" :style="{ height }">
    <img v-if="file.category === 'image'" :src="file.url" class="mh-100 mw-100" />
    <audio v-if="file.category === 'audio'" :src="file.url" controls class="mh-100 mw-100" />
    <video v-if="file.category === 'video'" :src="file.url" controls class="mh-100 mw-100" />
    <embed
      v-if="file.category === 'document' || file.category === 'office'"
      :src="file.url"
      class="h-100 w-100"
    />
    <h1 v-if="file.category === 'unknown'" class="display-6 mb-0">
      {{ $t('public.preview.downloading') }}
    </h1>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import store from '@store';
import { getFileInfo } from '@api/file';

const route = useRoute();
const file = ref({});
const height = document.documentElement.clientHeight + 'px';
const { BASE_URL } = process.env;

onMounted(() => {
  getFileInfo(route.params).then(({ code, data }) => {
    if (code === 200) {
      document.title = data?.name ? data.name + ' - ' + store.state.sys.name : store.state.sys.name;
      file.value.url = `${BASE_URL}cor/file/load/${route.params.uuid}?raw=1`;
      if (data.token) {
        file.value.url += `&token=${data.token}`;
        delete data.token;
      }
      file.value = { ...file.value, ...data };
      if (file.value.category === 'office') {
        file.value.url = `${
          store.state.sys.cfg.officeViewer || '//view.officeapps.live.com/op/view.aspx?src='
        }${encodeURIComponent(`${location.origin}${file.value.url}`)}`;
      }
      if (file.value.category === 'unknown') {
        let downloadElement = document.createElement('a');
        downloadElement.href = file.value.url;
        downloadElement.download = file.value.name;
        document.body.appendChild(downloadElement);
        downloadElement.click();
        document.body.removeChild(downloadElement);
        window.close();
      }
    }
  });
});
</script>
