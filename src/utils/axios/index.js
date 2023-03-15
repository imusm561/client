import axios from 'axios';
import store from '@store';
import router from '@router';
import { clearUserData } from '@utils';
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

const instance = axios.create({
  baseURL: process.env.BASE_URL,
  timeout: 3 * 60 * 1000,
  headers: {
    'X-Custom-Header': 'foobar',
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

instance.interceptors.request.use(
  (config) => {
    config.params = config.params || {};
    if (store.state.sys.cfg.origin !== '/' && config.method.toLowerCase() === 'get') {
      config.params.t = new Date().getTime();
    }
    config.headers = config.headers || {};
    config.headers.lang = store.state.sys.lang;

    let access_token = localStorage.getItem('accessToken');
    if (access_token) config.headers.Authorization = `Bearer ${access_token}`;

    let public_token = sessionStorage.getItem('publicToken');
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
          await clearUserData();
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
