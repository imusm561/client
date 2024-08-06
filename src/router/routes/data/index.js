export default [
  {
    path: '/data/list/:tid',
    name: 'list',
    component: () => import('@/views/data/list'),
    meta: {
      auth: [],
    },
  },
  {
    path: '/data/view/:tid/:rid',
    name: 'view',
    component: () => import('@/views/data/view'),
    meta: {
      auth: [],
    },
  },
  {
    path: '/data/edit/:tid/:rid',
    name: 'edit',
    component: () => import('@/views/data/edit'),
    meta: {
      auth: [],
    },
  },
  {
    path: '/data/iframe/:code',
    name: 'iframe',
    component: () => import('@/views/data/iframe'),
    meta: {
      auth: [],
    },
  },
];
