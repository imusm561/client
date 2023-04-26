<template>
  <div>
    <button
      id="showDeleteAccountModalBtn"
      class="d-none"
      data-bs-toggle="modal"
      data-bs-target="#deleteMpModal"
    />
    <div class="modal fade" id="deleteMpModal" data-bs-backdrop="static" data-bs-keyboard="false">
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
                  {{
                    $t('layout.navbar.helper.weixin.DeleteAccountModal.title', {
                      name: account.title,
                    })
                  }}
                </h4>
                <p class="text-muted mx-4 mb-0">
                  {{ $t('layout.navbar.helper.weixin.DeleteAccountModal.confirm') }}
                </p>
              </div>
            </div>
            <div class="d-flex gap-2 justify-content-center mt-4 mb-2">
              <button
                type="button"
                class="btn w-sm btn-light"
                id="hideDeleteAccountModalBtn"
                data-bs-dismiss="modal"
              >
                {{ $t('layout.navbar.helper.weixin.DeleteAccountModal.cancel') }}
              </button>
              <button type="button" class="btn w-sm btn-danger" @click="handleDeleteAccount">
                {{ $t('layout.navbar.helper.weixin.DeleteAccountModal.confirmed') }}
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
import { updateAccount } from '@api/weixin';
import { useToast } from 'vue-toastification';
import ToastificationContent from '@components/ToastificationContent';

export default {
  props: {
    data: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  setup(props, { emit }) {
    const toast = useToast();
    const account = ref({});

    watch(
      () => props.data,
      (val) => {
        account.value = JSON.parse(JSON.stringify(val));
      },
      { immediate: true, deep: true },
    );

    const handleDeleteAccount = () => {
      updateAccount({
        id: account.value.id,
        data_state: 'deleted',
      }).then(({ code, msg }) => {
        if (code === 200) {
          emit('confirm');
          document.getElementById('hideDeleteAccountModalBtn').click();
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
      account,
      handleDeleteAccount,
    };
  },
};
</script>
