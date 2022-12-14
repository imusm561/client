export default [
  {
    path: '/permission-denied',
    name: 'permissionDenied',
    component: () => import('@/views/public/exception/403'),
    meta: {
      title: 'Permission Denied',
      layout: 'blank',
    },
  },
  {
    path: '/not-found',
    name: 'notFound',
    component: () => import('@/views/public/exception/404'),
    meta: {
      title: 'Page Not Found',
      layout: 'blank',
    },
  },
  {
    path: '/server-error',
    name: 'serverError',
    component: () => import('@/views/public/exception/500'),
    meta: {
      title: 'Internal Server Error',
      layout: 'blank',
    },
  },
];
