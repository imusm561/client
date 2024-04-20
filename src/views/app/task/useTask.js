import dayjs from '@utils/dayjs';

export default function useTask() {
  const resolveTaskVariant = (task) => {
    if (task.status === 'completed') return 'bg-soft-success';
    if (dayjs(task.due_date).valueOf() < dayjs().valueOf()) return 'bg-soft-danger';
    else if (dayjs(task.due_date).valueOf() - dayjs().valueOf() < 24 * 60 * 60 * 1000)
      return 'bg-soft-warning';
    else return null;
  };

  return {
    resolveTaskVariant,
  };
}
