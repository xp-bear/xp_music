import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

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
    component: () => import(/* webpackChunkName: "about" */ "../views/Search.vue"),
  },
  {
    path: "/playlist",
    name: "Playlist",
    component: () => import(/* webpackChunkName: "about" */ "../views/DetailPlaylist.vue"),
  },

  // {
  //   path: "/",
  //   name: "Home",
  //   component: () => import(/* webpackChunkName: "about" */ "../views/Search.vue"),
  // },

  {
    path: "/singer",
    name: "Singer",
    component: () => import(/* webpackChunkName: "about" */ "../views/Singer.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
