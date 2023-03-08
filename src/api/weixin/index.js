import axios from '@utils/axios';
import { generateApiQuery } from '@utils';

export const getQRCode = (params) => {
  const soid = params.soid;
  delete params.soid;
  return axios.get(`/cor/weixin/${soid}/qrcode` + generateApiQuery(params));
};
