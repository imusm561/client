export default [
  {
    path: '/preview/:uuid',
    name: 'preview',
    component: () => import('@/views/public/preview'),
    meta: {
      title: 'Preview',
      layout: 'blank',
    },
  },
];
