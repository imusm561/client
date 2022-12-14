export default [
  {
    path: '/form/:uuid',
    name: 'pubForm',
    component: () => import('@/views/public/form'),
    meta: {
      title: 'Pub Form',
      layout: 'blank',
    },
  },
];
