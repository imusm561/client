import i18n from '@utils/i18n';
export default function useWeixin() {
  const serviceTypeOptions = [
    {
      text: i18n.global.t('layout.navbar.helper.weixin.serviceType.serviceAccount'),
      value: 'serviceAccount',
    },
    {
      text: i18n.global.t('layout.navbar.helper.weixin.serviceType.subscriptionAccount'),
      value: 'subscriptionAccount',
    },
    {
      text: i18n.global.t('layout.navbar.helper.weixin.serviceType.miniProgram'),
      value: 'miniProgram',
    },
    {
      text: i18n.global.t('layout.navbar.helper.weixin.serviceType.wechatWork'),
      value: 'wechatWork',
    },
  ];

  const msgTypeOptions = [
    {
      text: i18n.global.t('layout.navbar.helper.weixin.detail.scripts.msgType.text'),
      value: 'text',
      for: ['serviceAccount', 'subscriptionAccount'],
    },
    {
      text: i18n.global.t('layout.navbar.helper.weixin.detail.scripts.msgType.image'),
      value: 'image',
      for: ['serviceAccount', 'subscriptionAccount'],
    },
    {
      text: i18n.global.t('layout.navbar.helper.weixin.detail.scripts.msgType.voice'),
      value: 'voice',
      for: ['serviceAccount', 'subscriptionAccount'],
    },
    {
      text: i18n.global.t('layout.navbar.helper.weixin.detail.scripts.msgType.video'),
      value: 'video',
      for: ['serviceAccount', 'subscriptionAccount'],
    },
    {
      text: i18n.global.t('layout.navbar.helper.weixin.detail.scripts.msgType.shortvideo'),
      value: 'shortvideo',
      for: ['serviceAccount', 'subscriptionAccount'],
    },
    {
      text: i18n.global.t('layout.navbar.helper.weixin.detail.scripts.msgType.location'),
      value: 'location',
      for: ['serviceAccount', 'subscriptionAccount'],
    },
    {
      text: i18n.global.t('layout.navbar.helper.weixin.detail.scripts.msgType.link'),
      value: 'link',
      for: ['serviceAccount', 'subscriptionAccount'],
    },
    {
      text: i18n.global.t('layout.navbar.helper.weixin.detail.scripts.msgType.subscribe'),
      value: 'subscribe',
      for: ['serviceAccount', 'subscriptionAccount'],
    },
    {
      text: i18n.global.t('layout.navbar.helper.weixin.detail.scripts.msgType.scan'),
      value: 'scan',
      for: ['serviceAccount', 'subscriptionAccount'],
    },
    {
      text: i18n.global.t('layout.navbar.helper.weixin.detail.scripts.msgType.unsubscribe'),
      value: 'unsubscribe',
      for: ['serviceAccount', 'subscriptionAccount'],
    },
    {
      text: i18n.global.t('layout.navbar.helper.weixin.detail.scripts.msgType.LOCATION'),
      value: 'LOCATION',
      for: ['serviceAccount', 'subscriptionAccount'],
    },
    {
      text: i18n.global.t('layout.navbar.helper.weixin.detail.scripts.msgType.CLICK'),
      value: 'CLICK',
      for: ['serviceAccount', 'subscriptionAccount'],
    },
    {
      text: i18n.global.t('layout.navbar.helper.weixin.detail.scripts.msgType.SCAN'),
      value: 'SCAN',
      for: ['miniProgram'],
    },
  ];

  const replyTypeOptions = [
    {
      text: i18n.global.t('layout.navbar.helper.weixin.detail.scripts.replyType.text'),
      value: 'text',
      for: ['serviceAccount', 'subscriptionAccount'],
    },
    {
      text: i18n.global.t('layout.navbar.helper.weixin.detail.scripts.replyType.image'),
      value: 'image',
      for: ['serviceAccount', 'subscriptionAccount'],
    },
    {
      text: i18n.global.t('layout.navbar.helper.weixin.detail.scripts.replyType.voice'),
      value: 'voice',
      for: ['serviceAccount', 'subscriptionAccount'],
    },
    {
      text: i18n.global.t('layout.navbar.helper.weixin.detail.scripts.replyType.video'),
      value: 'video',
      for: ['serviceAccount', 'subscriptionAccount'],
    },
    {
      text: i18n.global.t('layout.navbar.helper.weixin.detail.scripts.replyType.music'),
      value: 'music',
      for: ['serviceAccount', 'subscriptionAccount'],
    },
    {
      text: i18n.global.t('layout.navbar.helper.weixin.detail.scripts.replyType.news'),
      value: 'news',
      for: ['serviceAccount', 'subscriptionAccount'],
    },
    {
      text: i18n.global.t('layout.navbar.helper.weixin.detail.scripts.replyType.script'),
      value: 'script',
      for: ['serviceAccount', 'subscriptionAccount', 'miniProgram'],
    },
  ];

  return {
    serviceTypeOptions,
    msgTypeOptions,
    replyTypeOptions,
  };
}
