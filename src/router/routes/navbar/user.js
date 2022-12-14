export default [
  // User
  {
    path: '/user/profile',
    name: 'profile',
    meta: { title: 'Profile', auth: [] },
    component: () => import('@/views/navbar/user/profile'),
  },
  {
    path: '/user/setting',
    name: 'setting',
    meta: { title: 'Setting', auth: [] },
    component: () => import('@/views/navbar/user/setting'),
  },
];
