export default [
  {
    path: '/form/:uuid',
    name: 'pubForm',
    component: () => import('@/views/public/form'),
    meta: {
      layout: 'blank',
    },
  },
];
