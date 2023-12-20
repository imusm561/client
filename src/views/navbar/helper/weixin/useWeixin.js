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
    // {
    //   text: i18n.global.t('layout.navbar.helper.weixin.serviceType.wechatWork'),
    //   value: 'wechatWork',
    // },
  ];

  const msgTypeOptions = [
    {
      text: i18n.global.t('layout.navbar.helper.weixin.detail.strategies.msgType.text'),
      value: 'text',
      for: ['serviceAccount', 'subscriptionAccount'],
    },
    {
      text: i18n.global.t('layout.navbar.helper.weixin.detail.strategies.msgType.image'),
      value: 'image',
      for: ['serviceAccount', 'subscriptionAccount'],
    },
    {
      text: i18n.global.t('layout.navbar.helper.weixin.detail.strategies.msgType.voice'),
      value: 'voice',
      for: ['serviceAccount', 'subscriptionAccount'],
    },
    {
      text: i18n.global.t('layout.navbar.helper.weixin.detail.strategies.msgType.video'),
      value: 'video',
      for: ['serviceAccount', 'subscriptionAccount'],
    },
    {
      text: i18n.global.t('layout.navbar.helper.weixin.detail.strategies.msgType.shortvideo'),
      value: 'shortvideo',
      for: ['serviceAccount', 'subscriptionAccount'],
    },
    {
      text: i18n.global.t('layout.navbar.helper.weixin.detail.strategies.msgType.location'),
      value: 'location',
      for: ['serviceAccount', 'subscriptionAccount'],
    },
    {
      text: i18n.global.t('layout.navbar.helper.weixin.detail.strategies.msgType.link'),
      value: 'link',
      for: ['serviceAccount', 'subscriptionAccount'],
    },
    {
      text: i18n.global.t('layout.navbar.helper.weixin.detail.strategies.msgType.subscribe'),
      value: 'subscribe',
      for: ['serviceAccount', 'subscriptionAccount'],
    },
    {
      text: i18n.global.t('layout.navbar.helper.weixin.detail.strategies.msgType.unsubscribe'),
      value: 'unsubscribe',
      for: ['serviceAccount', 'subscriptionAccount'],
    },
    {
      text: i18n.global.t('layout.navbar.helper.weixin.detail.strategies.msgType.LOCATION'),
      value: 'LOCATION',
      for: ['serviceAccount', 'subscriptionAccount'],
    },
    {
      text: i18n.global.t('layout.navbar.helper.weixin.detail.strategies.msgType.CLICK'),
      value: 'CLICK',
      for: ['serviceAccount', 'subscriptionAccount'],
    },
    {
      text: i18n.global.t('layout.navbar.helper.weixin.detail.strategies.msgType.SCAN'),
      value: 'SCAN',
      for: ['serviceAccount', 'subscriptionAccount', 'miniProgram'],
    },
  ];

  const replyTypeOptions = [
    {
      text: i18n.global.t('layout.navbar.helper.weixin.detail.strategies.replyType.text'),
      value: 'text',
      for: ['serviceAccount', 'subscriptionAccount', 'miniProgram'],
    },
    {
      text: i18n.global.t('layout.navbar.helper.weixin.detail.strategies.replyType.image'),
      value: 'image',
      for: ['serviceAccount', 'subscriptionAccount'],
    },
    {
      text: i18n.global.t('layout.navbar.helper.weixin.detail.strategies.replyType.voice'),
      value: 'voice',
      for: ['serviceAccount', 'subscriptionAccount'],
    },
    {
      text: i18n.global.t('layout.navbar.helper.weixin.detail.strategies.replyType.video'),
      value: 'video',
      for: ['serviceAccount', 'subscriptionAccount'],
    },
    {
      text: i18n.global.t('layout.navbar.helper.weixin.detail.strategies.replyType.music'),
      value: 'music',
      for: ['serviceAccount', 'subscriptionAccount'],
    },
    {
      text: i18n.global.t('layout.navbar.helper.weixin.detail.strategies.replyType.news'),
      value: 'news',
      for: ['serviceAccount', 'subscriptionAccount'],
    },
    {
      text: i18n.global.t('layout.navbar.helper.weixin.detail.strategies.replyType.script'),
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
