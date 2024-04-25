import { createApp } from 'vue';
import App from '@/App.vue';
const app = createApp(App);

import router from '@router';
import store from '@store';

import 'simplebar';
// import 'simplebar/dist/simplebar.css'

import 'bootstrap/dist/js/bootstrap.js';
import '@/assets/scss/index.scss';

import i18n from '@utils/i18n';

import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';

import Maska from 'maska';

import VueViewer from 'v-viewer';
import 'viewerjs/dist/viewer.css';

import VueApexCharts from 'vue3-apexcharts';

import { Form, Field } from 'vee-validate';
import '@utils/vee-validate';

import VueSelect from 'vue-select';
import OpenIndicator from '@components/VueSelect/openIndicator.vue';
import Deselect from '@components/VueSelect/deselect.vue';
VueSelect.props.components.default = () => ({
  OpenIndicator,
  Deselect,
});

app
  .use(router)
  .use(store)
  .use(i18n)
  .use(Toast, {
    closeOnClick: false,
    closeButton: false,
    icon: false,
    timeout: 5000,
    transition: 'Vue-Toastification__fade',
    hideProgressBar: true,
    shareAppContext: true,
  })
  .use(Maska)
  .use(VueViewer)
  .use(VueApexCharts)
  .component('Form', Form)
  .component('Field', Field)
  .component('VueSelect', VueSelect)
  .mount('#app');
