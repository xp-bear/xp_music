import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    cur: 0, //当前秒数
    total: 0, //总时间
    iptValue: "", //搜索关键字
    likeSongs: [], //收藏的歌曲列表
  },
  mutations: {
    insertCur(state, value) {
      state.cur = value;
    },
    getMusic(state, obj) {
      state.cur = obj.cur;
      state.total = obj.total;
      // console.log("vuex  state值 ", obj.cur, obj.total);
    },
    getValue(state, value) {
      state.iptValue = value;
    },
    getSong(state, obj) {
      if (localStorage.getItem("likeSongs")) {
        state.likeSongs = JSON.parse(localStorage.getItem("likeSongs"));
      }
      state.likeSongs.push(obj); //保存数据到vuex

      // 数组对象去重
      for (var i = 0; i < state.likeSongs.length - 1; i++) {
        for (var j = i + 1; j < state.likeSongs.length; j++) {
          if (state.likeSongs[i].id == state.likeSongs[j].id) {
            state.likeSongs.splice(j, 1);
            //因为数组长度减小1，所以直接 j++ 会漏掉一个元素，所以要 j--
            j--;
          }
        }
      }
      // console.log("vuex的值", state.likeSongs);
      localStorage.setItem("likeSongs", JSON.stringify(state.likeSongs)); //保存到本地
    },
  },
  actions: {},
  modules: {},
});
