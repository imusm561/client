import { generateApiQuery } from '@utils';
import axios from '@utils/axios';

export const getSearchResult = (params) => {
  return axios.get('/cor/com/search/result' + generateApiQuery(params));
};
