import axios from 'axios';
import { LoginDataType, RegisterDataType } from '@/interfaces';

const instance = axios.create({
  baseURL: '../api/auth/',
  headers: {
    'Content-Type': 'application/json',
  },
});

class AuthService {
  login = (data: LoginDataType) => {
    return instance.post('login', data);
  };

  register = (data: RegisterDataType) => {
    return instance.post('register', data);
  };
}

export default new AuthService();
