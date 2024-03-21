import { createWebHistory, createRouter } from 'vue-router';
import jwt from 'jsonwebtoken';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { getListPath, clearUserData } from '@utils';
import i18n from '@utils/i18n';
import { socket } from '@utils/socket';
import store from '@store';
const { BASE_URL } = process.env;

NProgress.configure({ showSpinner: false });

// Routes
import _public from './routes/public';
import _home from './routes/home';
import _helper from './routes/navbar/helper';
import _user from './routes/navbar/user';
import _app from './routes/app';
import _data from './routes/data';

const routes = [
  {
    path: '/',
    redirect: { name: 'home' },
  },
  ..._public,
  ..._home,
  ..._helper,
  ..._user,
  ..._app,
  ..._data,
  {
    path: '/:chapters*',
    redirect: { name: 'notFound' },
  },
];

const router = createRouter({
  history: createWebHistory(BASE_URL),
  routes,
  mode: 'history',
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0, left: 0 };
    }
  },
});

router.beforeEach((to, from, next) => {
  sessionStorage.removeItem(`${BASE_URL.replace(/\//g, '_')}pubtk`);
  sessionStorage.removeItem(`${BASE_URL.replace(/\//g, '_')}pubun`);
  NProgress.start();
  let interval;
  interval = setInterval(() => {
    if (socket) {
      clearInterval(interval);
      const modelEl = document.getElementsByClassName('modal show')?.[0];
      if (modelEl) {
        modelEl.classList.remove('show');
        const modelBackdropEl = document.getElementsByClassName('modal-backdrop show')?.[0];
        if (modelBackdropEl) modelBackdropEl.parentNode.removeChild(modelBackdropEl);
      }
      const token = jwt.decode(localStorage.getItem(`${BASE_URL.replace(/\//g, '_')}accessToken`));
      if (token && token.exp > Math.round(new Date().getTime() / 1000)) {
        let interval;
        interval = setInterval(() => {
          if (store.state.user.data.id) {
            clearInterval(interval);
            if (['login'].includes(to.name)) {
              next({ name: 'home' });
            } else {
              if (
                ['list', 'view', 'edit'].includes(to.name) &&
                (store.state.user.forms.some(
                  (form) => Number(form.pid) === Number(to.params?.tid),
                ) ||
                  !store.state.user.forms.find(
                    (form) => Number(form.id) === Number(to.params?.tid),
                  ))
              ) {
                next({ name: 'notFound' });
              } else if (
                (['list', 'view', 'edit'].includes(to.name) &&
                  !store.state.user.data.permissions?.[Number(to.params?.tid)]?.checked) ||
                (['edit'].includes(to.name) &&
                  Number(to.params?.rid) === 0 &&
                  !store.state.user.data.permissions?.[Number(to.params?.tid)]?.create) ||
                (['edit'].includes(to.name) &&
                  Number(to.params?.rid) !== 0 &&
                  !store.state.user.data.permissions?.[Number(to.params?.tid)]?.edit) ||
                (to?.meta?.auth &&
                  !(
                    store.state.user.data.tags.includes('ALL') ||
                    to.meta.auth.every((tag) => store.state.user.data.tags.includes(tag))
                  ))
              ) {
                next({ name: 'permissionDenied' });
              }
              next();
            }
          }
        }, 100);
      } else {
        if (to?.meta?.auth) {
          // Clean user information
          clearUserData();
          // Redirect to login page
          next({ name: 'login', query: { redirect: to.path } });
        }
        next();
      }
    }
  }, 100);
});

router.afterEach((to) => {
  document.body.removeAttribute('style');
  const path = getListPath(to.path);
  const page = store.state.user.forms.find((item) => item.route && item.route.path == path);
  let interval;
  interval = setInterval(() => {
    if (store.state.sys.name) {
      clearInterval(interval);
      if (page) {
        document.title = i18n.global.t(page.title) + ' - ' + store.state.sys.name;
      } else {
        document.title = to?.meta?.title
          ? i18n.global.t(to.meta.title) + ' - ' + store.state.sys.name
          : store.state.sys.name;
      }
      NProgress.done();
    }
  }, 100);
});

export default router;
