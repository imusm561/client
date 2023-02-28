import { ref } from 'vue';
import i18n from '@utils/i18n';

export default function useTask() {
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
      condition: new Function('progress', 'return progress <= 0'),
    },
    {
      title: i18n.global.t('app.task.status.inprogress'),
      value: 'inprogress',
      variant: 'primary',
      condition: new Function('progress', 'return progress > 0 && progress < 100'),
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

  return {
    status,
  };
}
