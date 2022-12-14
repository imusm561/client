export default [
  // App
  {
    path: '/app/calendar',
    name: 'calendar',
    meta: { title: 'layout.menu.app.calendar', auth: [] },
    component: () => import('@/views/app/calendar'),
  },
  {
    path: '/app/chat',
    name: 'chat',
    meta: { title: 'layout.menu.app.chat', auth: [] },
    component: () => import('@/views/app/chat'),
  },
  {
    path: '/app/mail',
    name: 'mail',
    meta: { title: 'layout.menu.app.mail', auth: [] },
    component: () => import('@/views/app/mail'),
  },
  {
    path: '/app/task',
    name: 'task',
    meta: { title: 'layout.menu.app.task', auth: [] },
    component: () => import('@/views/app/task'),
  },
];
