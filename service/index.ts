import axios from 'axios';
import { ParamsForGetApi } from '../interfaces';
class ApiHandle {
  get(url: string, params?: ParamsForGetApi) {
    let response;
    let paramKeys: string[] = [];
    if (params) {
      Object.keys(params).map((key) => {
        paramKeys.push(key + '=' + params[key as keyof ParamsForGetApi]);
        return paramKeys;
      });

      const queryString = paramKeys && paramKeys.length ? paramKeys.join('&') : '';
      console.log('queryString ::', queryString);
      response = axios.get(`${url}?${queryString}`);
    } else {
      response = axios.get(`${url}`);
    }
    response = axios.get(url);
    return response;
  }
  create(url: string, data: any) {
    return axios.post(url, data);
  }
  update(url: string, data: any) {
    return axios.put(url, data);
  }
  delete(url: string, config: any) {
    return axios.delete(url, { ...config });
  }
}

export default new ApiHandle();
