import axios from 'axios';
import { Message } from 'element-ui';

const apiBaseUrl = 'http://127.0.0.1:8888/api/private/v1/';

// 创建 axios 实例
const service = axios.create({
  baseURL: apiBaseUrl,
  timeout: 60000, // 请求超时时间
});

// request 请求拦截器
service.interceptors.request.use(
  (config) => {
    config.headers.Authorization = window.sessionStorage.getItem('token');
    console.log("请求拦截器(成功时)", config);
    return config;
  },
  (error) => {
    console.log("请求拦截器(错误时)", error);
    // return Promise.reject(error);
  }
);

// response 响应拦截器
service.interceptors.response.use(
  (response) => {
    console.log("响应拦截器(成功时)", response);
    if (response.status !== 200) {
      Message({
        type: 'error',
        message: response.data.meta.msg,
        showClose: true,
      });
      return false;
    } else {
      // Message.success(response.data.meta.msg);
      return response.data;
    }
  },
  (error) => {
    if (error.response) {
      Message({
        type: 'error',
        message: '服务器异常，请稍后再试',
        showClose: true,
      });
      return false;
    }
    // return Promise.reject(error);
  }
);

export default service;
