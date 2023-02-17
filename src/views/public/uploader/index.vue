<template>
  <div class="p-2">
    <div class="card">
      <div class="card-header align-items-center d-flex">
        <h4 class="card-title mb-0 flex-grow-1">{{ $t('public.uploader.code') }}</h4>
        <div class="flex-shrink-0">{{ options.code }}</div>
      </div>
      <div class="card-body">
        <div class="alert alert-danger alert-borderless mb-xl-0" role="alert">
          <strong>{{ $t('public.uploader.tips') }}:</strong>
          {{ $t('public.uploader.tips.content') }}
        </div>
        <Uploader
          v-model="files"
          :placeholder="options.placeholder"
          :prefix="options.prefix"
          :accept="options.accept"
          :multiple="options.multiple"
          :qrable="false"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref, watch } from 'vue';
import { useRouter } from '@utils';
import { initUploader, change } from '@api/file';
import { useToast } from 'vue-toastification';
import ToastificationContent from '@components/ToastificationContent';
import Uploader from '@components/Uploader';
export default {
  components: {
    Uploader,
  },
  setup() {
    const toast = useToast();
    const { route } = useRouter();

    const files = ref([]);
    const options = ref({});

    onMounted(() => {
      initUploader({
        options: route.value.params.options,
      }).then(({ code, msg, data }) => {
        if (code === 200) {
          options.value = data;
        } else {
          toast({
            component: ToastificationContent,
            props: {
              variant: 'danger',
              icon: 'mdi-alert',
              text: msg,
            },
          });
        }
      });
    });

    watch(
      () => files.value,
      (newList, oldList) => {
        newList = newList || [];
        oldList = oldList || [];
        const data = {};
        if (newList.length !== oldList.length) {
          if (newList.length > oldList.length) {
            data.files = newList.filter((oldItem) =>
              oldList.every((newItem) => newItem.id != oldItem.id),
            );
            data.type = 'add';
          } else {
            data.files = oldList.filter((oldItem) =>
              newList.every((newItem) => newItem.id != oldItem.id),
            );
            data.type = 'del';
          }
          data.files.forEach((file) => {
            change({
              username: options.value.username,
              code: options.value.code,
              file,
              type: data.type,
            }).then(({ code, msg }) => {
              if (code !== 200) {
                toast({
                  component: ToastificationContent,
                  props: {
                    variant: 'danger',
                    icon: 'mdi-alert',
                    text: msg,
                  },
                });
              }
            });
          });
        }
      },
      { immediate: true, deep: true },
    );

    return {
      files,
      options,
    };
  },
};
</script>
