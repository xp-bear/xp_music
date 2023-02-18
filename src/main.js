// 测试提交
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import axios from "axios";
import jquery from "jquery";
Vue.prototype.$ = jquery;
//公用css
import "./style.css";

// 视频插件
import VideoPlayer from "vue-video-player";
import "vue-video-player/src/custom-theme.css";
import "video.js/dist/video-js.css";
Vue.use(VideoPlayer);

//根url路径
axios.defaults.baseURL = "http://150.158.21.251:5000";
//配置超时时间
// axios.defaults.timeout = 5000;

// //请求拦截器
// axios.interceptors.request.use(
//   function (config) {
//     return config;
//   },
//   function (error) {
//     console.log("22", error);

//     return Promise.reject(error);
//   }
// );

// // 响应拦截器
// axios.interceptors.response.use(
//   function (response) {
//     return response;
//   },
//   function (error) {
//     console.log("22", error);

//     return Promise.reject(error);
//   }
// );

Vue.prototype.$http = axios;

Vue.config.productionTip = false;
// css样式还是需要全部引入
import "element-ui/lib/theme-chalk/index.css";
import {
  Autocomplete,
  FormItem,
  Form,
  Pagination,
  Button,
  Input,
  Card,
  Table,
  TableColumn,
  Dialog,
  MessageBox,
  Carousel,
  CarouselItem,
  Tooltip,
  Backtop,
  Slider,
  Tabs,
  TabPane,
  Message,
} from "element-ui";

Vue.prototype.$mb = MessageBox;

Vue.prototype.$message = Message;

Vue.use(Button);
Vue.use(Input);
Vue.use(Card);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Dialog);
Vue.use(Tooltip);
Vue.use(Backtop);
Vue.use(Slider);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Carousel);
Vue.use(CarouselItem);
Vue.use(Pagination);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Autocomplete);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
