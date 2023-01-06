export default [
  {
    path: '/uploader/:options',
    name: 'uploader',
    component: () => import('@/views/public/uploader'),
    meta: {
      title: 'public.uploader',
      layout: 'blank',
    },
  },
];
