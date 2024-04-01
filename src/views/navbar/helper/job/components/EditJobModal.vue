<template>
  <div>
    <button
      id="showEditJobModalBtn"
      class="d-none"
      data-bs-toggle="modal"
      data-bs-target="#editJobModal"
    />
    <div
      class="modal fade"
      id="editJobModal"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      data-bs-focus="false"
    >
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header p-2 bg-light">
            <h5 class="modal-title">
              {{
                job.id
                  ? $t('layout.navbar.helper.job.EditJobModal.title.update')
                  : $t('layout.navbar.helper.job.EditJobModal.title.create')
              }}
            </h5>
            <button
              type="button"
              class="btn-close"
              id="hideEditJobModalBtn"
              data-bs-dismiss="modal"
            ></button>
          </div>
          <Form v-slot="{ errors }" @submit="handleSubmitJob" :key="job.key">
            <div class="modal-body p-0">
              <div data-simplebar class="p-3" style="max-height: 80vh; overflow-x: hidden">
                <div class="row g-3">
                  <div class="col-md-4">
                    <label class="form-label">
                      {{ $t('layout.navbar.helper.job.EditJobModal.form.title') }}
                    </label>
                    <Field
                      name="title"
                      v-model="job.title"
                      type="text"
                      :placeholder="$t('layout.navbar.helper.job.EditJobModal.form.title')"
                      :class="['form-control', errors.title && 'is-invalid']"
                      rules="required"
                    />
                    <span class="invalid-feedback">{{ errors.title }}</span>
                  </div>
                  <div class="col-md-4">
                    <label class="form-label">
                      {{ $t('layout.navbar.helper.job.EditJobModal.form.status') }}
                    </label>
                    <VueSelect
                      v-model="job.status"
                      :placeholder="$t('layout.navbar.helper.job.EditJobModal.form.status')"
                      :reduce="(item) => item.value"
                      label="text"
                      :options="[
                        {
                          text: $t('layout.navbar.helper.job.EditJobModal.form.status.enable'),
                          value: 1,
                        },
                        {
                          text: $t('layout.navbar.helper.job.EditJobModal.form.status.disabled'),
                          value: 0,
                        },
                      ]"
                      :clearable="false"
                    >
                      <template v-slot:no-options="{ search, searching }">
                        <template v-if="searching">
                          <span v-html="$t('components.vs.search', { search })"></span>
                        </template>
                        <em v-else style="opacity: 0.5">{{ $t('components.vs.searchOption') }}</em>
                      </template>
                    </VueSelect>
                  </div>
                  <div class="col-md-4">
                    <label
                      class="form-label cursor-pointer text-primary text-decoration-underline"
                      :title="expression.interval.join('\n')"
                    >
                      {{ $t('layout.navbar.helper.job.EditJobModal.form.rule') }}
                    </label>
                    <Field
                      name="rule"
                      :class="['form-control', (errors.rule || expression.error) && 'is-invalid']"
                      :placeholder="$t('layout.navbar.helper.job.EditJobModal.form.rule')"
                      v-model="job.rule"
                      rules="required"
                    />
                    <span class="invalid-feedback">{{ errors.rule || expression.error }}</span>
                  </div>
                  <div class="col-12">
                    <label class="form-label">
                      {{ $t('layout.navbar.helper.job.EditJobModal.form.description') }}
                    </label>
                    <CKEditor
                      v-model="job.description"
                      id="ck_job_description"
                      :error="{ id: 'ck_job_description', error: errors.description }"
                      :class="errors.description && 'is-invalid'"
                    />
                    <Field
                      name="description"
                      v-model="job.description"
                      rules="required"
                      class="d-none"
                    />
                    <span class="invalid-feedback">{{ errors.description }}</span>
                  </div>
                  <div class="col-12">
                    <label class="form-label">
                      {{ $t('layout.navbar.helper.job.EditJobModal.form.duration') }}
                    </label>
                    <FlatPickr
                      v-model="job.duration"
                      @change="handleChangeDuration"
                      :class="['form-control', errors.duration && 'is-invalid']"
                      :placeholder="$t('layout.navbar.helper.job.EditJobModal.form.duration')"
                      :config="{ mode: 'range', dateFormat: 'Y-m-d H:i:S' }"
                    ></FlatPickr>
                    <Field name="duration" v-model="job.duration" rules="required" class="d-none" />
                    <span class="invalid-feedback">{{ errors.duration }}</span>
                  </div>
                  <div class="col-12">
                    <label class="form-label">
                      {{ $t('layout.navbar.helper.job.EditJobModal.form.tags') }}
                    </label>
                    <VueSelect
                      v-model="job.tags"
                      multiple
                      :close-on-select="false"
                      taggable
                      push-tags
                      :placeholder="$t('layout.navbar.helper.job.EditJobModal.form.tags')"
                      :class="errors.tags && 'is-invalid'"
                    >
                      <template v-slot:no-options="{ search, searching }">
                        <template v-if="searching">
                          <span v-html="$t('components.vs.search', { search })"></span>
                        </template>
                        <em v-else style="opacity: 0.5">{{ $t('components.vs.generateTag') }}</em>
                      </template>
                    </VueSelect>
                    <Field name="tags" v-model="job.tags" class="d-none" />
                    <span class="invalid-feedback">{{ errors.tags }}</span>
                  </div>
                  <div class="col-12">
                    <label class="form-label">
                      {{ $t('layout.navbar.helper.job.EditJobModal.form.config') }}
                    </label>
                    <MonacoEditor
                      v-model="job.config"
                      :class="{ 'is-invalid': errors.config || syntax_error }"
                      @error="($event) => (syntax_error = $event)"
                      language="json"
                    />
                    <Field
                      name="config"
                      v-model="job.config"
                      rules="required"
                      class="d-none"
                      :class="{ 'is-invalid': errors.config || syntax_error }"
                    />
                    <span class="invalid-feedback">{{ errors.config || syntax_error }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer p-3 pt-1 pb-1">
              <button
                type="submit"
                class="btn btn-sm btn-success"
                :disabled="Object.keys(errors).length || syntax_error || expression.error"
              >
                <i class="mdi mdi-content-save-outline"></i>
                {{
                  job.id
                    ? $t('layout.navbar.helper.job.EditJobModal.form.footer.save')
                    : $t('layout.navbar.helper.job.EditJobModal.form.footer.create')
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
import { ref, reactive, watch } from 'vue';
import parser from 'cron-parser';
import { useToast } from 'vue-toastification';
import ToastificationContent from '@components/ToastificationContent';
import moment from '@utils/moment';
import CKEditor from '@components/CKEditor';
import MonacoEditor from '@components/MonacoEditor';
import FlatPickr from '@components/FlatPickr';
import { createJob, updateJob } from '@api/job';

// eslint-disable-next-line
const props = defineProps({
  currentJob: {
    type: Object,
    default: () => {
      return {};
    },
  },
});

// eslint-disable-next-line
const emits = defineEmits(['submit']);

const toast = useToast();

const job = ref({});
const syntax_error = ref(null);
const expression = reactive({
  interval: [],
  error: null,
});

watch(
  () => props.currentJob,
  (val) => {
    job.value = JSON.parse(JSON.stringify(val));
  },
  { immediate: true, deep: true },
);

watch(
  () => job.value,
  (val) => {
    if (val) {
      Object.assign(expression, { interval: [], error: null });
      try {
        let interval = parser.parseExpression(val.rule, {
          currentDate:
            moment(val.start).valueOf() > moment.valueOf()
              ? moment(val.start).toDate()
              : moment().toDate(),
          endDate: moment(val.end).toDate(),
          tz: 'Asia/Shanghai',
        });
        for (let i = 0; i < 10; i++) {
          expression.interval.push(
            moment(new Date(interval.next().toString())).format('YYYY-MM-DD HH:mm:ss'),
          );
        }
        expression.error = null;
      } catch (error) {
        expression.error = error.message;
      }
    }
  },
  { immediate: true, deep: true },
);

const handleChangeDuration = (e) => {
  if (e.target.value) {
    if (e.target.value.split(' ').length === 5) {
      job.value.start = `${e.target.value.split(' ')[0]} ${e.target.value.split(' ')[1]}`;
      job.value.end = `${e.target.value.split(' ')[3]} ${e.target.value.split(' ')[4]}`;
    } else {
      job.value.start = job.value.end = e.target.value;
    }
  }
};

const handleSubmitJob = () => {
  if (job.value.id) {
    updateJob(job.value).then(({ code, msg }) => {
      if (code === 200) {
        emits('submit');
        document.getElementById('hideEditJobModalBtn').click();
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
    createJob(job.value).then(({ code, msg }) => {
      if (code === 200) {
        emits('submit');
        document.getElementById('hideEditJobModalBtn').click();
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
