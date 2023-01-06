export default [
  // User
  {
    path: '/user/profile',
    name: 'profile',
    meta: { title: 'layout.navbar.user.dropdown.profile', auth: [] },
    component: () => import('@/views/navbar/user/profile'),
  },
  {
    path: '/user/setting',
    name: 'setting',
    meta: { title: 'layout.navbar.user.dropdown.setting', auth: [] },
    component: () => import('@/views/navbar/user/setting'),
  },
];
