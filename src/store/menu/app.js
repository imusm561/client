const app = [
  {
    id: 'app',
    pid: 0,
    title: 'layout.menu.app',
    header: true,
  },
  {
    id: 'calendar',
    pid: 0,
    title: 'layout.menu.app.calendar',
    icon: 'mdi-calendar',
    badge: {
      text: null,
      variant: 'primary',
    },
    route: {
      path: '/app/calendar',
    },
  },
  {
    id: 'chat',
    pid: 0,
    title: 'layout.menu.app.chat',
    icon: 'mdi-chat',
    badge: {
      text: null,
      variant: 'danger',
    },
    route: {
      path: '/app/chat',
    },
  },
  {
    id: 'mail',
    pid: 0,
    title: 'layout.menu.app.mail',
    icon: 'mdi-mailbox',
    badge: {
      text: null,
      variant: 'success',
    },
    route: {
      path: '/app/mail',
    },
  },
  {
    id: 'task',
    pid: 0,
    title: 'layout.menu.app.task',
    icon: 'mdi-checkbox-multiple-marked',
    badge: {
      text: null,
      variant: 'secondary',
    },
    route: {
      path: '/app/task',
    },
  },
];

module.exports = app;
