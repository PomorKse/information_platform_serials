// Конфиг axios для аутентификации пользователя
import axios from 'axios';
import { showAlert } from '../utilities/showAlert';

export const API_URL = 'http://127.0.0.1:8000/api';
// export const API_URL = 'https://reqres.in/api';

const authAxios = axios.create({
  baseURL: API_URL,
  // withCredentials: true,
  headers: {
    'Content-type': 'application/json',
  },
});

authAxios.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
  return config;
});

// Интерцептор показывает ошибки во всплывающем окне
authAxios.interceptors.response.use(
  (response) => {
    //console.log(response);
    if (response.status >= 200 && response.status < 300) {
      return response;
    }
  },
  (error) => {
    const { response, request } = error;
    if (response) {
      console.log(response);
      if (response.status >= 400 && response.status < 500) {
        const message =
          response.data?.error || response.data?.message || error.toString();
        showAlert(message, 'error');
      }
    } else if (request) {
      showAlert('Ошибка запроса. Попробуйте снова.', 'error');
    }
    return Promise.reject(error);
  }
);

export default authAxios;
