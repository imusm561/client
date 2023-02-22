import { configure, defineRule } from 'vee-validate';
import store from '@store';
import i18n from '@utils/i18n';

configure({
  validateOnBlur: true,
  validateOnChange: true,
  validateOnInput: true,
  validateOnModelUpdate: true,
});

import { isEmpty } from '@utils/index';

defineRule('required', (value) => {
  if (isEmpty(value)) return i18n.global.t('vee.validate.required');
  else if (Array.isArray(value))
    return value.length !== 0 || i18n.global.t('vee.validate.required');
  else if (typeof value === 'boolean') return value || i18n.global.t('vee.validate.required');
  else return value.toString().length ? true : i18n.global.t('vee.validate.required');
});

defineRule('between', (value, [min, max]) => {
  if (isEmpty(value)) {
    return true;
  }
  return (
    (Number(min) <= Number(value) && Number(max) >= Number(value)) ||
    i18n.global.t('vee.validate.between', { max, min })
  );
});

defineRule('confirmed', (value, [target]) => {
  if (isEmpty(value)) {
    return true;
  }
  return value === target || i18n.global.t('vee.validate.confirmed');
});

defineRule('gt', (value, [target]) => {
  if (isEmpty(value)) {
    return true;
  }
  return value > target || i18n.global.t('vee.validate.gt', { target });
});

defineRule('integer', (value) => {
  if (isEmpty(value)) {
    return true;
  }
  const regExp = /^[0-9]*$/;
  return regExp.test(String(value)) || i18n.global.t('vee.validate.integer');
});

defineRule('length', (value, length) => {
  if (isEmpty(value)) {
    return true;
  }
  return value.length === length || i18n.global.t('vee.validate.length', { length });
});

defineRule('include', (value, [target]) => {
  if (isEmpty(value)) {
    return true;
  }
  const user = store.state.org.users.find((user) => user.username === target);
  return (
    value.includes(target) ||
    i18n.global.t('vee.validate.include', { target: user ? user.fullname : target })
  );
});

defineRule('exclude', (value, [target]) => {
  if (isEmpty(value)) {
    return true;
  }
  const user = store.state.org.users.find((user) => user.username === target);
  return (
    !value.includes(target.trim()) ||
    i18n.global.t('vee.validate.exclude', { target: user ? user.fullname : target })
  );
});

defineRule('username', (value) => {
  if (isEmpty(value)) {
    return true;
  }
  const regExp = /^[a-z]{4,10}$/;
  return regExp.test(String(value)) || i18n.global.t('vee.validate.username');
});

defineRule('fullname', (value) => {
  if (isEmpty(value)) {
    return true;
  }
  const regExp = /^[a-zA-Z\u4e00-\u9fa50-9]{2,16}$/;
  return regExp.test(String(value)) || i18n.global.t('vee.validate.fullname');
});

defineRule('email', (value) => {
  if (isEmpty(value)) {
    return true;
  }
  const regExp = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
  return regExp.test(String(value)) || i18n.global.t('vee.validate.email');
});

defineRule('phone', (value) => {
  if (isEmpty(value)) {
    return true;
  }
  const regExp = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
  return regExp.test(String(value)) || i18n.global.t('vee.validate.phone');
});

defineRule('password', (value) => {
  if (isEmpty(value)) {
    return true;
  }
  const regExp = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%&*()?,.]).{8,}/;
  return regExp.test(String(value)) || i18n.global.t('vee.validate.password');
});
