import { createApp, watch } from 'vue';
import App from '@/App.vue';
const app = createApp(App);

app.config.globalProperties.BASE_URL = process.env.BASE_URL;

import router from '@/router';
import store from '@store';

import 'simplebar';
// import 'simplebar/dist/simplebar.css'

import 'bootstrap/dist/js/bootstrap.js';
import '@/assets/scss/index.scss';

import i18n from '@utils/i18n';

import moment from 'moment';
import momentDurationFormatSetup from 'moment-duration-format';
momentDurationFormatSetup(moment);
moment.locale(['en-us', 'zh-cn']);
app.config.globalProperties.$moment = moment;
window.moment = moment;

import io from 'socket.io-client';
import initSocket from '@utils/socket';
watch(
  () => store.state.sys.var.origin,
  (val) => {
    if (val) {
      const socket = io(val, {
        path: `${process.env.BASE_URL}socket.io`,
        transports: ['websocket'],
        secure: true,
      });
      initSocket(socket);
      window.socket = socket;
    }
  },
  { immediate: true, deep: true },
);

import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';

import Maska from 'maska';

app.config.globalProperties.$fileIcons = window.FileIcons;
import uploader from 'vue-simple-uploader';
import 'vue-simple-uploader/dist/style.css';
import VueViewer from 'v-viewer';
import 'viewerjs/dist/viewer.css';

import VueApexCharts from 'vue3-apexcharts';

app.directive('permission', {
  mounted(element, bind) {
    if (!store.state.user.data.tags.includes('ALL')) {
      let required_tags = ['REJECT'];

      if (Array.isArray(bind.value)) {
        required_tags = bind.value;
      } else {
        const route = router.getRoutes().find((route) => route.name === bind.value);
        if (route) required_tags = route.meta?.auth || [];
      }

      if (!required_tags.every((tag) => store.state.user.data.tags.includes(tag))) {
        element.parentNode.removeChild(element);
      }
    }
  },
});

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
  .use(uploader)
  .use(VueViewer)
  .use(VueApexCharts)
  .component('Form', Form)
  .component('Field', Field)
  .component('VueSelect', VueSelect)
  .mount('#app');
