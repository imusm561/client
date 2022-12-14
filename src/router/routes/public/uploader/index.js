export default [
  {
    path: '/uploader/:options',
    name: 'uploader',
    component: () => import('@/views/public/uploader'),
    meta: {
      title: 'Uploader',
      layout: 'blank',
    },
  },
];
