import axios from 'axios';
import { LoginDataType, RegisterDataType } from '@/interfaces';

const instance = axios.create({
  baseURL: '../api/auth/',
  headers: {
    'Content-Type': 'application/json',
  },
});

instance.interceptors.response.use(
  (response) => {
    console.log('res ::', response);
    return response.data ? response.data : response;
  },
  (error) => {
    const { message } = error.response?.data;

    return message ? Promise.reject(message) : Promise.reject(error);
  }
);

class AuthService {
  login = (data: LoginDataType) => {
    return instance.post('login', data);
  };

  register = (data: RegisterDataType) => {
    return instance.post('register', data);
  };
}

export default new AuthService();
