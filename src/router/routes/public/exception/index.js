export default [
  {
    path: '/permission-denied',
    name: 'permissionDenied',
    component: () => import('@/views/public/exception/403'),
    meta: {
      title: 'public.exception.403',
      layout: 'blank',
    },
  },
  {
    path: '/not-found',
    name: 'notFound',
    component: () => import('@/views/public/exception/404'),
    meta: {
      title: 'public.exception.404',
      layout: 'blank',
    },
  },
  {
    path: '/server-error',
    name: 'serverError',
    component: () => import('@/views/public/exception/500'),
    meta: {
      title: 'public.exception.500',
      layout: 'blank',
    },
  },
];
