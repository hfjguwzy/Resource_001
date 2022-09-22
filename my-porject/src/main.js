import Vue from "vue";
import App from "./App.vue";
import router from "./router";
// 引用vuex-store
import store from "./store";
// 引入全局样式
import "./assets/css/global.css";

// 引用Element Plus模板
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

//画流程图工具
import VueMermaid from "vue-mermaid/src";
Vue.use(VueMermaid);

// 在原型链上封装
// import axios from 'axios';
// axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/' //定义根路径
// Vue.prototype.$http = axios //在原型链上给$http赋值为axios对象
// //为axios添加请求拦截器
// axios.interceptors.request.use(config =>{
//   console.log(config);
//   config.headers.Authorization = window.sessionStorage.getItem('token');
//   return config;//最后必须返回config
// })


Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
