import { generateApiQuery } from '@utils';
import axios from '@utils/axios';

export const getLogs = (params) => {
  return axios.get('/cor/com/log/list' + generateApiQuery(params));
};
