<template>
  <div class="lyric test-5">
    <div class="scrollbar" v-html="musicwords"></div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";
import $ from "jquery";
export default {
  data() {
    return {
      timer: null,
    };
  },
  props: ["lyrics", "mid"],
  methods: {},
  computed: {
    ...mapState(["cur", "total"]),

    musicwords() {
      if (!this.lyrics) {
        return "";
      }
      let lrcArr = this.lyrics.split("["); //去除[
      let html = ""; //定义一个空变量保存文本
      for (let i = 0; i < lrcArr.length; i++) {
        let arr = lrcArr[i].split("]");

        let allTime = arr[0].split("."); //分钟+秒 2.03 格式
        let time = allTime[0].split(":"); //抽取分钟
        let timer = time[0] * 60 + time[1] * 1; //换算成总秒数
        let text = arr[1]; //歌词部分

        if (text) {
          html += "<p id=" + timer + " style='padding:5px 0;' >" + text + "</p>";
        }
        if (i == lrcArr.length - 1) {
          html += "<p id='666' style='padding:5px 0;' ></p>";
        }
      }

      return html;
    },
  },
  mounted() {
    this.timer = setInterval(() => {
      let p = document.querySelectorAll(".lyric p");
      let parent = document.querySelector(".lyric"); //父元素滚动
      let counter = 0; //初始化滚动条位置
      // 歌曲开始,滚动条置顶
      if (Math.round(this.cur) == 0) {
        parent.scrollTop = 0;
      }

      for (let i = 0; i < p.length; i++) {
        p[i].style.color = "black";
        p[i].style.fontSize = "16px";
        // console.log("***", Math.round(this.cur), p[i].id);

        if (this.cur > p[i].id) {
          if (i > 1) {
            p[0].style.color = "black";
            p[0].style.fontSize = "16px";
            p[i - 1].style.color = "black";
            p[i - 1].style.fontSize = "16px";
          }
          p[i].style.color = "red";
          p[i].style.fontSize = "20px";
          p[i].style.transition = "all 0.5s";

          counter++;
        } else if (Math.round(this.cur) == p[i].id && Math.round(this.cur) != 0) {
          // console.log("当前", this.cur, p[i].id, counter);

          if (counter >= 8) {
            $(".lyric").animate({ scrollTop: parent.scrollTop + 31 + "px" }, 300);
          }
          parent.style.transition = "all 0.5s";
          this.$store.commit("insertCur", Math.round(this.cur) + 1000);
        }
      }
    }, 100);
  },
  destroyed() {
    // console.log("歌词组件被销毁了");
    clearInterval(this.timer);
  },
};
</script>

<style lang="less" scoped>
.lyric {
  width: 50%;
  height: 520px;
  position: relative;
  top: 0;
  left: 0%;
  // background-color: pink;
  text-align: center;
  overflow-y: scroll;
}
</style>
