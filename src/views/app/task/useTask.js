import moment from '@utils/moment';

export default function useTask() {
  const resolveTaskVariant = (task) => {
    if (task.status === 'completed') return 'bg-soft-success';
    if (moment(task.due_date).valueOf() < moment().valueOf()) return 'bg-soft-danger';
    else if (moment(task.due_date).valueOf() - moment().valueOf() < 24 * 60 * 60 * 1000)
      return 'bg-soft-warning';
    else return null;
  };

  return {
    resolveTaskVariant,
  };
}
