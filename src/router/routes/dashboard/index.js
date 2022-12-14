export default [
  // Dashboard
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/views/dashboard'),
    meta: { title: 'dashboard', auth: [] },
  },
];
