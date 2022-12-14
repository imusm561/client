import axios from '@utils/axios';
import { generateApiQuery } from '@utils';

export const getSysInfo = () => {
  return axios.get('/cor/sys/info');
};

export const getSysUrl = () => {
  return axios.get('/cor/sys/url');
};

export const getSysLog = (params) => {
  return axios.get('/cor/sys/log' + generateApiQuery(params));
};
