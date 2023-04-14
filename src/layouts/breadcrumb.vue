<template>
  <div class="row d-none d-md-block">
    <div class="col-12">
      <div class="page-title-box d-sm-flex align-items-center justify-content-between">
        <h4 class="mb-sm-0">{{ $t(title) }}</h4>
        <div class="page-title-right">
          <ol class="breadcrumb m-0 justify-content-end">
            <li class="breadcrumb-item text-truncate" style="max-width: 200px">
              <a class="cursor-pointer" @click="$router.push('/')">
                <i class="mdi mdi-home me-1"></i>
                <span :title="$t('layout.breadcrumb.home')">
                  {{ $t('layout.breadcrumb.home') }}
                </span>
              </a>
            </li>
            <li
              class="breadcrumb-item text-truncate"
              style="max-width: 200px"
              v-for="(item, index) in items"
              :key="index"
            >
              <a :class="{ active: index === items.length - 1 }">
                <i v-if="item.icon" :class="`mdi ${item.icon} me-1`"></i>
                <span :title="$t(item.title)">
                  <span
                    v-if="$route.name === 'list'"
                    class="cursor-pointer"
                    @click="$emit('form-info')"
                  >
                    {{ $t(item.title) }}
                  </span>
                  <span v-else>
                    {{ $t(item.title) }}
                  </span>
                </span>
              </a>
            </li>
          </ol>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter, getListPath, getParentsById } from '@utils';
import store from '@store';
export default {
  setup() {
    const title = ref('');
    const items = ref([]);
    const { route } = useRouter();
    const path = getListPath(route.value.path);
    const page = store.state.user.forms.find((item) => item.route && item.route.path == path);
    if (page) {
      title.value = page.title;
      items.value = getParentsById(store.state.user.forms, page.id);
    } else {
      title.value = route.value?.meta?.title || '';
      items.value = route.value?.meta?.items || [];
    }
    return { title, items };
  },
};
</script>
