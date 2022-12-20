import { createWebHistory, createRouter } from 'vue-router';
import { checkUserData, getListPath } from '@utils';
import jwt from 'jsonwebtoken';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
NProgress.configure({ showSpinner: false });
import i18n from '@utils/i18n';

import store from '@store';

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
  history: createWebHistory(),
  routes,
  mode: 'history',
  // scrollBehavior(to, from, savedPosition) {
  //   if (savedPosition) {
  //     return savedPosition;
  //   } else {
  //     return { top: 0, left: 0 };
  //   }
  // },
});

router.beforeEach(async (to, from, next) => {
  NProgress.start();
  const token = jwt.decode(localStorage.getItem('accessToken'));
  if (token && token.exp > Math.round(new Date() / 1000)) {
    await checkUserData();
    if (['login'].includes(to.name)) {
      next({ name: 'home' });
    } else {
      if (
        (['list', 'view', 'edit'].includes(to.name) && !(store.state.user.data.tags.includes('ALL') || store.state.user.data.permissions?.[Number(to.params?.tid)]?.checked)) ||
        (['edit'].includes(to.name) && Number(to.params?.rid) === 0 && !(store.state.user.data.tags.includes('ALL') || store.state.user.data.permissions?.[Number(to.params?.tid)]?.create)) ||
        (['edit'].includes(to.name) && Number(to.params?.rid) !== 0 && !(store.state.user.data.tags.includes('ALL') || store.state.user.data.permissions?.[Number(to.params?.tid)]?.modify)) ||
        (to?.meta?.auth && !(store.state.user.data.tags.includes('ALL') || to?.meta?.auth.every((tag) => store.state.user.data.tags.includes(tag))))
      ) {
        next({ name: 'permissionDenied' });
      }
      next();
    }
  } else {
    if (to?.meta?.auth) {
      // Redirect to login page
      next({ name: 'login', query: { redirect: to.path } });
    }
    next();
  }
});

router.afterEach((to) => {
  const path = getListPath(to.path);
  const page = store.state.user.forms.find((item) => item.route && item.route.path == path);
  const interval = setInterval(() => {
    if (store.state.sys.name) {
      clearInterval(interval);
      if (page) {
        document.title = i18n.global.t(page.title) + ' - ' + store.state.sys.name;
      } else {
        document.title = to?.meta?.title ? i18n.global.t(to.meta.title) + ' - ' + store.state.sys.name : store.state.sys.name;
      }
      NProgress.done();
    }
  }, 100);
});

export default router;
