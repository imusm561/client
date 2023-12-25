export default [
  // Helper
  {
    path: '/helper/org',
    name: 'org',
    meta: { title: 'layout.navbar.helper.org', auth: ['HRD'] },
    component: () => import('@/views/navbar/helper/org'),
  },
  {
    path: '/helper/form',
    name: 'form',
    meta: { title: 'layout.navbar.helper.form', auth: ['DBA', 'OE'] },
    component: () => import('@/views/navbar/helper/form'),
  },
  {
    path: '/helper/job',
    name: 'job',
    meta: { title: 'layout.navbar.helper.job', auth: ['DBA', 'OE'] },
    component: () => import('@/views/navbar/helper/job'),
  },
  {
    path: '/helper/job/:id',
    name: 'jobDetail',
    meta: { title: 'layout.navbar.helper.job.detail', auth: ['DBA', 'OE'] },
    component: () => import('@/views/navbar/helper/job/detail'),
  },
  {
    path: '/helper/code',
    name: 'code',
    meta: { title: 'layout.navbar.helper.code', auth: ['DBA', 'OE'] },
    component: () => import('@/views/navbar/helper/code'),
  },
  {
    path: '/helper/sql',
    name: 'sql',
    meta: { title: 'layout.navbar.helper.sql', auth: ['DBA'] },
    component: () => import('@/views/navbar/helper/sql'),
  },
  {
    path: '/helper/redis',
    name: 'redis',
    meta: { title: 'layout.navbar.helper.redis', auth: ['DBA'] },
    component: () => import('@/views/navbar/helper/redis'),
  },
  {
    path: '/helper/weixin',
    name: 'weixin',
    meta: { title: 'layout.navbar.helper.weixin', auth: ['OE'] },
    component: () => import('@/views/navbar/helper/weixin'),
  },
  {
    path: '/helper/weixin/:id',
    name: 'weixinDetail',
    meta: { title: 'layout.navbar.helper.weixin.detail', auth: ['OE'] },
    component: () => import('@/views/navbar/helper/weixin/detail'),
  },
  {
    path: '/helper/log',
    name: 'log',
    meta: { title: 'layout.navbar.helper.log', auth: ['OE'] },
    component: () => import('@/views/navbar/helper/log'),
  },
];
