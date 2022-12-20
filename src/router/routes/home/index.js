export default [
  // Home
  {
    path: '/home',
    name: 'home',
    component: () => import('@/views/home'),
    meta: { title: 'home', auth: [] },
  },
];
