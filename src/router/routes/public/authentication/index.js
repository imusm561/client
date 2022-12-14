export default [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/public/authentication/Login.vue'),
    meta: {
      title: 'Login',
      layout: 'blank',
    },
  },
  {
    path: '/forgot-password',
    name: 'forgotPassword',
    component: () => import('@/views/public/authentication/ForgotPassword.vue'),
    meta: {
      title: 'Forgot Password',
      layout: 'blank',
    },
  },
];
