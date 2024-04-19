import axios from 'axios';
import { useToast } from 'vue-toastification';
import ToastificationContent from '@components/ToastificationContent';
import { clearUserData } from '@utils';
import { socket } from '@utils/socket';
import i18n from '@utils/i18n';
import router from '@router';
import store from '@store';

const { BASE_URL } = process.env;
// const HTTP_STATUS_CODE = {
//   400: '400 Bad Request',
//   401: '401 Unauthorized',
//   403: '403 Forbidden',
//   404: '404 Not Found',
//   408: '408 Request Timeout',
//   413: '413 Payload Too Large',
//   414: '414 Request-URI Too Long',
//   431: '431 Request Header Fields Too Large',
//   500: '500 Internal Server Error',
//   502: '502 Bad Gateway',
//   503: '503 Service Unavailable',
//   504: '504 Gateway Timeout',
// };

const CancelToken = axios.CancelToken;
const toast = useToast();

const instance = axios.create({
  baseURL: BASE_URL,
  timeout: 3 * 60 * 1000,
  headers: {
    // 'X-Custom-Header': 'foobar',
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

instance.interceptors.request.use(
  (config) => {
    config.params = config.params || {};

    if (socket._disconnected) {
      toast.clear();
      toast({
        component: ToastificationContent,
        props: {
          variant: 'danger',
          icon: 'mdi-lan-disconnect',
          title: i18n.global.t('socket.disconnect.toast.title'),
          text: i18n.global.t('socket.disconnect.toast.text'),
        },
      });
      // throw new Error(i18n.global.t('socket.disconnect.toast.title'));
      const source = CancelToken.source();
      source.cancel(i18n.global.t('socket.disconnect.toast.title'));
      config.cancelToken = source.token;
    }

    if (store.state.sys.cfg.origin !== '/' && config.method.toLowerCase() === 'get') {
      config.params.t = new Date().getTime();
    }
    config.headers = config.headers || {};
    config.headers.lang = store.state.sys.lang;

    let access_token = localStorage.getItem(`${BASE_URL.replace(/\//g, '_')}accessToken`);
    if (access_token) config.headers.Authorization = `Bearer ${access_token}`;

    let public_token = sessionStorage.getItem(`${BASE_URL.replace(/\//g, '_')}pubtk`);
    if (public_token) config.headers.Authorization = `Bearer ${public_token}`;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

instance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    if (error.response) {
      const { status, data } = error.response;
      if (status === 401) {
        if (router.currentRoute.value.name != 'pubForm') {
          // Clean user information
          clearUserData();
        }
        // Redirect to login page
        router.replace({ name: 'login', query: { redirect: router.currentRoute.value.path } });
      } else if (status === 403) {
        router.replace({ name: 'permissionDenied' });
      } else if (status === 404) {
        router.replace({
          name: 'notFound',
          params: {
            msg: data.msg,
          },
        });
      } else {
        router.replace({
          name: 'serverError',
          params: {
            request_id: data.request_id,
            msg: data.msg,
          },
        });
      }
    }
    return Promise.reject(error);
  },
);

export default instance;
