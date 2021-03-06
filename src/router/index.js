import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import { MessageBox } from "element-ui";

Vue.prototype.$mb = MessageBox;
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/search",
    name: "Search",
    component: () => import(/* webpackChunkName: "Search" */ "../views/Search.vue"),
  },
  {
    path: "/playlist",
    name: "Playlist",
    component: () => import(/* webpackChunkName: "DetailPlaylist" */ "../views/DetailPlaylist.vue"),
  },
  {
    path: "/singer",
    name: "Singer",
    component: () => import(/* webpackChunkName: "Singer" */ "../views/Singer.vue"),
  },
  {
    path: "/login",
    name: "Login",
    component: () => import(/* webpackChunkName: "Login" */ "../views/Login.vue"),
  },
  {
    path: "/forget",
    name: "ForGet",
    component: () => import(/* webpackChunkName: "ForGet" */ "../views/ForGet.vue"),
  },
  {
    path: "/register",
    name: "Register",
    component: () => import(/* webpackChunkName: "Register" */ "../views/Register.vue"),
  },
  {
    path: "/album",
    name: "Album",
    component: () => import(/* webpackChunkName: "AlbumPlay" */ "../views/AlbumPlay.vue"),
  },
  {
    path: "/user",
    name: "User",
    component: () => import(/* webpackChunkName: "User" */ "../views/User.vue"),
  },
];

const router = new VueRouter({
  mode: "hash",
  base: process.env.BASE_URL,
  routes,
});

// 解决路由守卫重定向跳转问题
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject);
  return originalPush.call(this, location).catch((err) => err);
};

// 路由守卫
router.beforeEach((to, from, next) => {
  // 此处进行鉴权操作
  let token;
  if (JSON.parse(localStorage.getItem("user")) && JSON.parse(localStorage.getItem("user")) != undefined) {
    token = JSON.parse(localStorage.getItem("user")).tokens;
  } else {
    token = "";
  }

  if (!token) {
    if (to.path === "/login") {
      next(); // 系统根路由
    } else if (to.path === "/") {
      next();
    } else if (to.path === "/register") {
      next();
    } else if (to.path === "/forget") {
      next();
    } else {
      Vue.prototype.$mb.alert("请先登录!", "注意", {
        confirmButtonText: "确定",
        callback: () => {
          next("/login");
        },
      });
    }
  } else {
    next();
  }
});

export default router;
