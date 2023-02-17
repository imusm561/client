<template>
  <div>
    <button
      id="showDeleteJobModalBtn"
      class="d-none"
      data-bs-toggle="modal"
      data-bs-target="#deleteJobModal"
    />
    <div class="modal fade" id="deleteJobModal" data-bs-backdrop="static" data-bs-keyboard="false">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              id="btn-close"
            ></button>
          </div>
          <div class="modal-body">
            <div class="mt-2 text-center">
              <div class="fs-15 mx-4 mx-sm-5">
                <h4>
                  {{ $t('layout.navbar.helper.job.DeleteJobModal.title', { name: job.title }) }}
                </h4>
                <p class="text-muted mx-4 mb-0">
                  {{ $t('layout.navbar.helper.job.DeleteJobModal.confirm') }}
                </p>
              </div>
            </div>
            <div class="d-flex gap-2 justify-content-center mt-4 mb-2">
              <button
                type="button"
                class="btn w-sm btn-light"
                id="hideDeleteJobModalBtn"
                data-bs-dismiss="modal"
              >
                {{ $t('layout.navbar.helper.job.DeleteJobModal.cancel') }}
              </button>
              <button type="button" class="btn w-sm btn-danger" @click="handleDelJob">
                {{ $t('layout.navbar.helper.job.DeleteJobModal.confirmed') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue';
import { updateJob } from '@api/job';
import { useToast } from 'vue-toastification';
import ToastificationContent from '@components/ToastificationContent';

export default {
  props: {
    currentJob: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  setup(props, { emit }) {
    const toast = useToast();

    const job = ref({});

    watch(
      () => props.currentJob,
      (val) => {
        job.value = JSON.parse(JSON.stringify(val));
      },
      { immediate: true, deep: true },
    );

    const handleDelJob = () => {
      updateJob({
        id: job.value.id,
        data_state: 'deleted',
      }).then(({ code, msg }) => {
        if (code === 200) {
          emit('confirm');
          document.getElementById('hideDeleteJobModalBtn').click();
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
    };

    return {
      job,
      handleDelJob,
    };
  },
};
</script>
