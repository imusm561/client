import axios from '@utils/axios';
import { generateApiQuery } from '@utils';

export const getSearchResult = (params) => {
  return axios.get('/cor/com/search/result' + generateApiQuery(params));
};
