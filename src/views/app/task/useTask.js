import { ref } from 'vue';
import i18n from '@utils/i18n';

export default function useTask() {
  const moment = window.moment;
  const status = ref([
    {
      title: i18n.global.t('app.task.status.todo'),
      value: 'todo',
      variant: 'secondary',
      condition: new Function('progress', 'return progress <= 0'),
    },
    {
      title: i18n.global.t('app.task.status.urgent'),
      value: 'urgent',
      variant: 'warning',
      condition: new Function('progress', 'return progress < 100'),
    },
    {
      title: i18n.global.t('app.task.status.inprogress'),
      value: 'inprogress',
      variant: 'primary',
      condition: new Function('progress', 'return progress >= 0 && progress < 100'),
    },
    {
      title: i18n.global.t('app.task.status.review'),
      value: 'review',
      variant: 'info',
      condition: new Function('progress', 'return progress >= 100'),
    },
    {
      title: i18n.global.t('app.task.status.completed'),
      value: 'completed',
      variant: 'success',
      condition: new Function('progress', 'return progress >= 100'),
    },
  ]);

  const resolveTaskVariant = (task) => {
    if (task.status === 'completed') return 'bg-soft-success';
    if (moment(task.due_date).valueOf() < moment().valueOf()) return 'bg-soft-danger';
    else if (moment(task.due_date).valueOf() - moment().valueOf() < 24 * 60 * 60 * 1000)
      return 'bg-soft-warning';
    else return null;
  };

  return {
    resolveTaskVariant,
    status,
  };
}
