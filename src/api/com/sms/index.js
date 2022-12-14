import axios from '@utils/axios';

export const sendVerificationCode = (data) => {
  return axios.post('/cor/com/sms/send', data);
};

export const verifyVerificationCode = (data) => {
  return axios.post('/cor/com/sms/verify', data);
};
