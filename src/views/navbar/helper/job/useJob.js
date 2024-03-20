import i18n from '@utils/i18n';
import moment from '@utils/moment';
export default function useJob() {
  const resolveJobStatus = (job) => {
    if (job.status === 0)
      return {
        text: i18n.global.t('layout.navbar.helper.job.status.disabled'),
        value: 'disabled',
        card: 'bg-soft-danger',
        badge: 'bg-danger',
      };
    else if (moment(job.start).valueOf() > moment().valueOf())
      return {
        text: i18n.global.t('layout.navbar.helper.job.status.tobestarted'),
        value: 'tobestarted',
        card: 'bg-soft-info',
        badge: 'bg-info',
      };
    else if (moment().valueOf() > moment(job.end).valueOf())
      return {
        text: i18n.global.t('layout.navbar.helper.job.status.expired'),
        value: 'expired',
        card: 'bg-soft-success',
        badge: 'bg-success',
      };
    else
      return {
        text: i18n.global.t('layout.navbar.helper.job.status.inprogress'),
        value: 'inprogress',
        card: 'bg-soft-light',
        badge: 'bg-primary',
      };
  };

  const statusOptions = [
    { text: i18n.global.t('layout.navbar.helper.job.status.disabled'), value: 'disabled' },
    { text: i18n.global.t('layout.navbar.helper.job.status.tobestarted'), value: 'tobestarted' },
    { text: i18n.global.t('layout.navbar.helper.job.status.expired'), value: 'expired' },
    { text: i18n.global.t('layout.navbar.helper.job.status.inprogress'), value: 'inprogress' },
  ];

  return {
    resolveJobStatus,
    statusOptions,
  };
}
