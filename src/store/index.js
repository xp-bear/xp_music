import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    cur: 0, //当前秒数
    total: 0, //总时间
    iptValue: "", //搜索关键字
  },
  mutations: {
    getMusic(state, obj) {
      state.cur = obj.cur;
      state.total = obj.total;
      // console.log("vuex  state值 ", obj.cur, obj.total);
    },
    getValue(state, value) {
      state.iptValue = value;
    },
  },
  actions: {},
  modules: {},
});
