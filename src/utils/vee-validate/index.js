import { configure, defineRule } from 'vee-validate';
import store from '@store';

configure({
  validateOnBlur: true,
  validateOnChange: true,
  validateOnInput: true,
  validateOnModelUpdate: true,
});

import { isEmpty } from '@utils/index';

defineRule('required', (value) => {
  if (isEmpty(value)) return 'vee.validate.required';
  else if (Array.isArray(value)) return value.length !== 0 || 'vee.validate.required';
  else if (typeof value === 'boolean') return value || 'vee.validate.required';
  else return value.toString().length ? true : 'vee.validate.required';
});

defineRule('between', (value, [min, max]) => {
  if (isEmpty(value)) {
    return true;
  }
  return (
    (Number(min) <= Number(value) && Number(max) >= Number(value)) ||
    `vee.validate.between|${JSON.stringify({ min, max })}`
  );
});

defineRule('confirmed', (value, [target]) => {
  if (isEmpty(value)) {
    return true;
  }
  return value === target || 'vee.validate.confirmed';
});

defineRule('gt', (value, [target]) => {
  if (isEmpty(value)) {
    return true;
  }
  return value > target || `vee.validate.gt|${JSON.stringify({ target })}`;
});

defineRule('integer', (value) => {
  if (isEmpty(value)) {
    return true;
  }
  const regExp = /^[0-9]*$/;
  return regExp.test(String(value)) || 'vee.validate.integer';
});

defineRule('length', (value, length) => {
  if (isEmpty(value)) {
    return true;
  }
  return value.length === length || `vee.validate.length|${JSON.stringify({ length })}`;
});

defineRule('users', (value, [target]) => {
  if (isEmpty(value)) {
    return true;
  }
  const users = target.split(';');
  return (
    users.every((user) => value.includes(user)) ||
    `vee.validate.include|${JSON.stringify({
      target: store.state.org.users
        .filter((user) => users.includes(user.username))
        .map((user) => {
          return user.fullname;
        })
        .join(', '),
    })}`
  );
});

defineRule('include', (value, [target]) => {
  if (isEmpty(value)) {
    return true;
  }
  return value.includes(target.trim()) || `vee.validate.include|${JSON.stringify({ target })}`;
});

defineRule('exclude', (value, [target]) => {
  if (isEmpty(value)) {
    return true;
  }
  return !value.includes(target.trim()) || `vee.validate.exclude|${JSON.stringify({ target })}`;
});

defineRule('in', (value, [target]) => {
  target = target.replace(/0x2C/g, ',');
  if (isEmpty(value)) {
    return true;
  }
  return target.split(',').includes(value) || `vee.validate.in|${JSON.stringify({ target })}`;
});

defineRule('notin', (value, [target]) => {
  target = target.replace(/0x2C/g, ',');
  if (isEmpty(value)) {
    return true;
  }
  return !target.split(',').includes(value) || `vee.validate.notin|${JSON.stringify({ target })}`;
});

defineRule('username', (value) => {
  if (isEmpty(value)) {
    return true;
  }
  const regExp = /^[a-z0-9_-]{4,20}$/;
  return regExp.test(String(value)) || 'vee.validate.username';
});

defineRule('fullname', (value) => {
  if (isEmpty(value)) {
    return true;
  }
  const regExp = /^[ A-Za-z\u4e00-\u9fa5]{2,20}$/;
  return regExp.test(String(value)) || 'vee.validate.fullname';
});

defineRule('email', (value) => {
  if (isEmpty(value)) {
    return true;
  }
  const regExp = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
  return regExp.test(String(value)) || 'vee.validate.email';
});

defineRule('phone', (value) => {
  if (isEmpty(value)) {
    return true;
  }
  const regExp = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
  return regExp.test(String(value)) || 'vee.validate.phone';
});

defineRule('password', (value) => {
  if (isEmpty(value)) {
    return true;
  }
  const regExp = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%&*()?,.]).{8,}$/;
  return regExp.test(String(value)) || 'vee.validate.password';
});
