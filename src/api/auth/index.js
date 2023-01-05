import axios from '@utils/axios';
import { generateApiQuery } from '@utils';

export const getAuthQr = (params) => {
  return axios.get('/cor/auth/qr' + generateApiQuery(params));
};
