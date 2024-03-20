<template>
  <div>
    <button
      id="showEditAccountModalBtn"
      class="d-none"
      data-bs-toggle="modal"
      data-bs-target="#editAccountModal"
    />
    <div
      class="modal fade"
      id="editAccountModal"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      data-bs-focus="false"
    >
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header p-2 bg-light">
            <h5 class="modal-title">
              {{
                account.id
                  ? $t('layout.navbar.helper.weixin.EditAccountModal.title.update')
                  : $t('layout.navbar.helper.weixin.EditAccountModal.title.create')
              }}
            </h5>
            <button
              type="button"
              class="btn-close"
              id="hideEditAccountModalBtn"
              data-bs-dismiss="modal"
            ></button>
          </div>
          <Form v-slot="{ errors }" @submit="handleSubmitAccount" :key="account.key">
            <div class="modal-body p-0">
              <div data-simplebar class="p-3" style="max-height: 80vh; overflow-x: hidden">
                <div class="row g-3">
                  <template v-if="account.service_type === '3rdPartyPlatform'">
                    <div class="col-md-5">
                      <label class="form-label">
                        {{ $t('layout.navbar.helper.weixin.EditAccountModal.form.serviceType') }}
                      </label>
                      <VueSelect
                        v-model="account.service_type"
                        :placeholder="
                          $t('layout.navbar.helper.weixin.EditAccountModal.form.serviceType')
                        "
                        :reduce="(item) => item.value"
                        label="text"
                        :options="serviceTypeOptions"
                        :clearable="false"
                      >
                        <template v-slot:no-options="{ search, searching }">
                          <template v-if="searching">
                            <span v-html="$t('components.vs.search', { search })"></span>
                          </template>
                          <em v-else style="opacity: 0.5">
                            {{ $t('components.vs.searchOption') }}
                          </em>
                        </template>
                      </VueSelect>
                    </div>
                    <div class="col-md-7">
                      <label class="form-label">
                        {{ $t('layout.navbar.helper.weixin.EditAccountModal.form.title') }}
                      </label>
                      <Field
                        name="title"
                        v-model="account.title"
                        type="text"
                        :placeholder="$t('layout.navbar.helper.weixin.EditAccountModal.form.title')"
                        :class="['form-control', errors.title && 'is-invalid']"
                        rules="required"
                      />
                      <span class="invalid-feedback">{{ errors.title }}</span>
                    </div>
                  </template>
                  <template v-else>
                    <div class="col-md-4">
                      <label class="form-label">
                        {{ $t('layout.navbar.helper.weixin.EditAccountModal.form.serviceType') }}
                      </label>
                      <VueSelect
                        v-model="account.service_type"
                        :placeholder="
                          $t('layout.navbar.helper.weixin.EditAccountModal.form.serviceType')
                        "
                        :reduce="(item) => item.value"
                        label="text"
                        :options="serviceTypeOptions"
                        :clearable="false"
                      >
                        <template v-slot:no-options="{ search, searching }">
                          <template v-if="searching">
                            <span v-html="$t('components.vs.search', { search })"></span>
                          </template>
                          <em v-else style="opacity: 0.5">
                            {{ $t('components.vs.searchOption') }}
                          </em>
                        </template>
                      </VueSelect>
                    </div>
                    <div class="col-md-4">
                      <label class="form-label">
                        {{ $t('layout.navbar.helper.weixin.EditAccountModal.form.title') }}
                      </label>
                      <Field
                        name="title"
                        v-model="account.title"
                        type="text"
                        :placeholder="$t('layout.navbar.helper.weixin.EditAccountModal.form.title')"
                        :class="['form-control', errors.title && 'is-invalid']"
                        rules="required"
                      />
                      <span class="invalid-feedback">{{ errors.title }}</span>
                    </div>

                    <div class="col-md-4">
                      <label class="form-label">
                        {{
                          $t('layout.navbar.helper.weixin.EditAccountModal.form.3rdPartyPlatform')
                        }}
                      </label>
                      <VueSelect
                        v-model="account.platform"
                        :placeholder="
                          $t('layout.navbar.helper.weixin.EditAccountModal.form.3rdPartyPlatform')
                        "
                        :reduce="(item) => item.app_id"
                        label="title"
                        :options="
                          accounts.filter((account) => account.service_type === '3rdPartyPlatform')
                        "
                        :clearable="true"
                      >
                        <template v-slot:no-options="{ search, searching }">
                          <template v-if="searching">
                            <span v-html="$t('components.vs.search', { search })"></span>
                          </template>
                          <em v-else style="opacity: 0.5">
                            {{ $t('components.vs.searchOption') }}
                          </em>
                        </template>
                      </VueSelect>
                    </div>
                  </template>

                  <template v-if="account.platform">
                    <div class="col-md-6">
                      <label class="form-label">
                        {{ $t('layout.navbar.helper.weixin.EditAccountModal.form.soid') }}
                      </label>
                      <Field
                        name="soid"
                        v-model="account.soid"
                        type="text"
                        :placeholder="$t('layout.navbar.helper.weixin.EditAccountModal.form.soid')"
                        :class="['form-control', errors.soid && 'is-invalid']"
                        :disabled="account.service_type === '3rdPartyPlatform'"
                        :rules="account.service_type === '3rdPartyPlatform' ? '' : 'required'"
                      />
                      <span class="invalid-feedback">{{ errors.soid }}</span>
                    </div>
                    <div class="col-md-6">
                      <label class="form-label">
                        {{ $t('layout.navbar.helper.weixin.EditAccountModal.form.appId') }}
                      </label>
                      <Field
                        name="app_id"
                        v-model="account.app_id"
                        type="text"
                        :placeholder="$t('layout.navbar.helper.weixin.EditAccountModal.form.appId')"
                        :class="['form-control', errors.app_id && 'is-invalid']"
                        rules="required"
                      />
                      <span class="invalid-feedback">{{ errors.app_id }}</span>
                    </div>
                    <div class="col-md-6" v-if="['serviceAccount'].includes(account.service_type)">
                      <label class="form-label">
                        {{ $t('layout.navbar.helper.weixin.EditAccountModal.form.mchId') }}
                      </label>
                      <Field
                        name="mch_id"
                        v-model="account.mch_id"
                        type="text"
                        :placeholder="$t('layout.navbar.helper.weixin.EditAccountModal.form.mchId')"
                        :class="['form-control', errors.mch_id && 'is-invalid']"
                        rules=""
                      />
                      <span class="invalid-feedback">{{ errors.mch_id }}</span>
                    </div>
                    <div class="col-md-6" v-if="['serviceAccount'].includes(account.service_type)">
                      <label class="form-label">
                        {{ $t('layout.navbar.helper.weixin.EditAccountModal.form.apiKey') }}
                      </label>
                      <Field
                        name="api_key"
                        v-model="account.api_key"
                        type="text"
                        :placeholder="
                          $t('layout.navbar.helper.weixin.EditAccountModal.form.apiKey')
                        "
                        :class="['form-control', errors.api_key && 'is-invalid']"
                        rules=""
                      />
                      <span class="invalid-feedback">{{ errors.api_key }}</span>
                    </div>
                  </template>

                  <template v-else>
                    <div class="col-md-5">
                      <label class="form-label">
                        {{ $t('layout.navbar.helper.weixin.EditAccountModal.form.soid') }}
                      </label>
                      <Field
                        name="soid"
                        v-model="account.soid"
                        type="text"
                        :placeholder="$t('layout.navbar.helper.weixin.EditAccountModal.form.soid')"
                        :class="['form-control', errors.soid && 'is-invalid']"
                        :disabled="account.service_type === '3rdPartyPlatform'"
                        :rules="account.service_type === '3rdPartyPlatform' ? '' : 'required'"
                      />
                      <span class="invalid-feedback">{{ errors.soid }}</span>
                    </div>
                    <div class="col-md-7">
                      <label class="form-label">
                        {{ $t('layout.navbar.helper.weixin.EditAccountModal.form.email') }}
                      </label>
                      <Field
                        name="email"
                        v-model="account.email"
                        type="text"
                        :placeholder="$t('layout.navbar.helper.weixin.EditAccountModal.form.email')"
                        :class="['form-control', errors.email && 'is-invalid']"
                        rules="required|email"
                      />
                      <span class="invalid-feedback">{{ errors.email }}</span>
                    </div>
                    <div
                      class="col-md-5"
                      v-if="
                        ['serviceAccount', 'subscriptionAccount', '3rdPartyPlatform'].includes(
                          account.service_type,
                        )
                      "
                    >
                      <label class="form-label">
                        {{ $t('layout.navbar.helper.weixin.EditAccountModal.form.token') }}
                      </label>
                      <Field
                        name="token"
                        v-model="account.token"
                        type="text"
                        :placeholder="$t('layout.navbar.helper.weixin.EditAccountModal.form.token')"
                        :class="['form-control', errors.token && 'is-invalid']"
                        rules="required"
                      />
                      <span class="invalid-feedback">{{ errors.token }}</span>
                    </div>
                    <div
                      class="col-md-7"
                      v-if="
                        ['serviceAccount', 'subscriptionAccount', '3rdPartyPlatform'].includes(
                          account.service_type,
                        )
                      "
                    >
                      <label class="form-label">
                        {{ $t('layout.navbar.helper.weixin.EditAccountModal.form.encodingAESKey') }}
                      </label>
                      <Field
                        name="encoding_aes_key"
                        v-model="account.encoding_aes_key"
                        type="text"
                        :placeholder="
                          $t('layout.navbar.helper.weixin.EditAccountModal.form.encodingAESKey')
                        "
                        :class="['form-control', errors.encoding_aes_key && 'is-invalid']"
                        :rules="account.service_type === '3rdPartyPlatform' ? 'required' : ''"
                      />
                      <span class="invalid-feedback">{{ errors.encoding_aes_key }}</span>
                    </div>
                    <div class="col-md-5">
                      <label class="form-label">
                        {{ $t('layout.navbar.helper.weixin.EditAccountModal.form.appId') }}
                      </label>
                      <Field
                        name="app_id"
                        v-model="account.app_id"
                        type="text"
                        :placeholder="$t('layout.navbar.helper.weixin.EditAccountModal.form.appId')"
                        :class="['form-control', errors.app_id && 'is-invalid']"
                        rules="required"
                      />
                      <span class="invalid-feedback">{{ errors.app_id }}</span>
                    </div>
                    <div class="col-md-7">
                      <label class="form-label">
                        {{ $t('layout.navbar.helper.weixin.EditAccountModal.form.appSecret') }}
                      </label>
                      <Field
                        name="app_secret"
                        v-model="account.app_secret"
                        type="text"
                        :placeholder="
                          $t('layout.navbar.helper.weixin.EditAccountModal.form.appSecret')
                        "
                        :class="['form-control', errors.app_secret && 'is-invalid']"
                        rules="required"
                      />
                      <span class="invalid-feedback">{{ errors.app_secret }}</span>
                    </div>
                    <div class="col-md-5" v-if="['serviceAccount'].includes(account.service_type)">
                      <label class="form-label">
                        {{ $t('layout.navbar.helper.weixin.EditAccountModal.form.mchId') }}
                      </label>
                      <Field
                        name="mch_id"
                        v-model="account.mch_id"
                        type="text"
                        :placeholder="$t('layout.navbar.helper.weixin.EditAccountModal.form.mchId')"
                        :class="['form-control', errors.mch_id && 'is-invalid']"
                        rules=""
                      />
                      <span class="invalid-feedback">{{ errors.mch_id }}</span>
                    </div>
                    <div class="col-md-7" v-if="['serviceAccount'].includes(account.service_type)">
                      <label class="form-label">
                        {{ $t('layout.navbar.helper.weixin.EditAccountModal.form.apiKey') }}
                      </label>
                      <Field
                        name="api_key"
                        v-model="account.api_key"
                        type="text"
                        :placeholder="
                          $t('layout.navbar.helper.weixin.EditAccountModal.form.apiKey')
                        "
                        :class="['form-control', errors.api_key && 'is-invalid']"
                        rules=""
                      />
                      <span class="invalid-feedback">{{ errors.api_key }}</span>
                    </div>
                  </template>
                  <div class="col-12">
                    <label class="form-label">
                      {{ $t('layout.navbar.helper.weixin.EditAccountModal.form.tags') }}
                    </label>
                    <VueSelect
                      v-model="account.tags"
                      multiple
                      :close-on-select="false"
                      taggable
                      push-tags
                      :placeholder="$t('layout.navbar.helper.weixin.EditAccountModal.form.tags')"
                    >
                      <template v-slot:no-options="{ search, searching }">
                        <template v-if="searching">
                          <span v-html="$t('components.vs.search', { search })"></span>
                        </template>
                        <em v-else style="opacity: 0.5">{{ $t('components.vs.generateTag') }}</em>
                      </template>
                    </VueSelect>
                  </div>
                  <div class="col-12">
                    <label class="form-label">
                      {{ $t('layout.navbar.helper.weixin.EditAccountModal.form.config') }}
                    </label>
                    <MonacoEditor
                      v-model="account.config"
                      :class="{ 'is-invalid': errors.config || syntax_error }"
                      @error="($event) => (syntax_error = $event)"
                      language="json"
                    />
                    <Field
                      name="config"
                      v-model="account.config"
                      rules=""
                      class="d-none"
                      :class="{ 'is-invalid': errors.config || syntax_error }"
                    />
                    <span class="invalid-feedback">{{ errors.config || syntax_error }}</span>
                  </div>
                  <div class="col-12">
                    <label class="form-label">
                      {{ $t('layout.navbar.helper.weixin.EditAccountModal.form.description') }}
                    </label>
                    <CKEditor
                      v-model="account.description"
                      id="ck_job_description"
                      :error="{ id: 'ck_job_description', error: errors.description }"
                      :class="errors.description && 'is-invalid'"
                    />
                    <Field
                      name="description"
                      v-model="account.description"
                      rules=""
                      class="d-none"
                    />
                    <span class="invalid-feedback">{{ errors.description }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer p-3 pt-1 pb-1">
              <button
                type="submit"
                class="btn btn-sm btn-success"
                :disabled="Object.keys(errors).length || syntax_error"
              >
                <i class="mdi mdi-content-save-outline"></i>
                {{
                  account.id
                    ? $t('layout.navbar.helper.weixin.EditAccountModal.form.footer.save')
                    : $t('layout.navbar.helper.weixin.EditAccountModal.form.footer.create')
                }}
              </button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref, watch } from 'vue';
import { useToast } from 'vue-toastification';
import ToastificationContent from '@components/ToastificationContent';
import CKEditor from '@components/CKEditor';
import MonacoEditor from '@components/MonacoEditor';
import { createAccount, updateAccount } from '@api/weixin';
import useWeixin from '../useWeixin';

const props = defineProps({
  data: {
    type: Object,
    default: () => {
      return {};
    },
  },
  accounts: {
    type: Array,
    default: () => {
      return [];
    },
  },
});

const emit = defineEmits(['submit']);

const toast = useToast();
const account = ref({});
const syntax_error = ref(null);
const { serviceTypeOptions } = useWeixin();

watch(
  () => props.data,
  (val) => {
    account.value = JSON.parse(JSON.stringify(val));
  },
  { immediate: true, deep: true },
);

watch(
  () => account.value.service_type,
  (val) => {
    account.value.soid = val === '3rdPartyPlatform' ? null : props.data.soid;
    account.value.platform = val === '3rdPartyPlatform' ? null : props.data.platform;
  },
  { immediate: true, deep: true },
);

const handleSubmitAccount = () => {
  if (account.value.id) {
    updateAccount(account.value).then(({ code, msg }) => {
      if (code === 200) {
        emit('submit');
        document.getElementById('hideEditAccountModalBtn').click();
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
  } else {
    createAccount(account.value).then(({ code, msg }) => {
      if (code === 200) {
        emit('submit');
        document.getElementById('hideEditAccountModalBtn').click();
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
  }
};
</script>
