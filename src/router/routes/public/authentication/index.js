export default [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/public/authentication/Login.vue'),
    meta: {
      title: 'public.authentication.login',
      layout: 'blank',
    },
  },
  {
    path: '/forgot-password',
    name: 'forgotPassword',
    component: () => import('@/views/public/authentication/ForgotPassword.vue'),
    meta: {
      title: 'public.authentication.forgotPassword',
      layout: 'blank',
    },
  },
];
