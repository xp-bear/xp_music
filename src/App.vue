<template>
  <div id="app">
    <!-- 路由占位符 -->
    <router-view />

    <!-- 公告 -->
    <el-dialog title="重要公告" :visible.sync="dialogVisible" width="800px">
      <div class="main">
        <div>
          "本音乐网站完全开源,持续更新中!"<br />
          "github地址: "<a href="https://github.com/xp-coding/xp_music" target="_blank" style="font-weight: 700; color: red; text-decoration: underline">https://github.com/xp-coding/xp_music</a>
          <br />
          "赞助作者: "<a href="http://cdn.xxoutman.cn/pay.png" target="_blank" style="font-weight: 700; color: red; text-decoration: underline">打赏作者一瓶快阔水!</a>
          <br />
          "如果您有任何问题,请联系该邮箱: <span style="color: #000; font-weight: 700">1693889638@qq.com</span>"
          <footer>
            ——
            <cite>想走过亚洲的熊</cite>
          </footer>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 回到顶部  250 85-->
    <el-backtop :bottom="265" :right="80">
      <div style="height: 100%; width: 100%; background-color: #f2f5f6; box-shadow: 0 0 6px rgba(0, 0, 0, 0.12); text-align: center; line-height: 40px; color: #1989fa">
        <i class="el-icon-top"></i>
      </div>
    </el-backtop>

    <!-- 友情链接 -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialogVisible: false,
      dateDay: "", //当前今天日期
    };
  },
  created() {
    // 另外一个看板娘
    setTimeout(() => {
      window.L2Dwidget.init({
        pluginRootPath: "live2dw/",
        pluginJsPath: "lib/",
        pluginModelPath: "live2d-widget-model-haru_2/assets/",
        tagMode: false,
        debug: false,
        model: { jsonPath: "../live2dw/live2d-widget-model-haru_2/assets/haru02.model.json" },
        display: { position: "right", width: 200, height: 400 },
        mobile: { show: true },
        log: false,
      });
    }, 500);
  },
  mounted() {
    // 加载看板娘
    // setTimeout(() => {
    //   window.L2Dwidget.init({
    //     pluginRootPath: "live2dw/",
    //     pluginJsPath: "lib/",

    //     pluginModelPath: "live2d-widget-model-shizuku/assets/",
    //     tagMode: false,
    //     debug: false,
    //     model: { jsonPath: "../live2dw/live2d-widget-model-shizuku/assets/shizuku.model.json" },
    //     display: { position: "right", width: 200, height: 300 },
    //     mobile: { show: true },
    //     log: false,
    //   });
    // }, 500);

    // 公告弹框提示
    // 获取今天当前日期
    // 创建一个 Date 对象
    var currentDate = new Date();
    // 获取年份
    var year = currentDate.getFullYear();
    // 获取月份（注意：月份是从 0 开始计数的，所以要加 1）
    var month = currentDate.getMonth() + 1;
    // 获取日期
    var date = currentDate.getDate();
    this.dateDay = year + "-" + month + "-" + date; //2024-4-18

    // 通过键获取存储的值
    var tomorrowValue = localStorage.getItem("tomorrow");

    if (tomorrowValue !== null) {
      if (this.dateDay >= tomorrowValue) {
        this.dialogVisible = true;
        // 通过键删除存储的值
        // ------------获取明天的日期
        // 创建一个 Date 对象表示今天的日期
        var today = new Date(this.dateDay);
        // 增加一天的毫秒数
        var oneDayMilliseconds = 24 * 60 * 60 * 1000;
        // 计算明天的日期（使用 getTime() 方法获取毫秒数，再加上一天的毫秒数）
        var tomorrow = new Date(today.getTime() + oneDayMilliseconds);
        // 获取明天的年份
        var tomorrowYear = tomorrow.getFullYear();
        // 获取明天的月份（注意：月份是从 0 开始计数的，所以要加 1）
        var tomorrowMonth = tomorrow.getMonth() + 1;
        // 获取明天的日期
        var tomorrowDate = tomorrow.getDate();
        // 设置一个时间日期
        localStorage.setItem("tomorrow", tomorrowYear + "-" + tomorrowMonth + "-" + tomorrowDate);
      } else {
        this.dialogVisible = false;
      }
    } else {
      this.dialogVisible = true;
      // ------------获取明天的日期
      // 创建一个 Date 对象表示今天的日期
      var today = new Date();
      // 增加一天的毫秒数
      var oneDayMilliseconds = 24 * 60 * 60 * 1000;
      // 计算明天的日期（使用 getTime() 方法获取毫秒数，再加上一天的毫秒数）
      var tomorrow = new Date(today.getTime() + oneDayMilliseconds);
      // 获取明天的年份
      var tomorrowYear = tomorrow.getFullYear();
      // 获取明天的月份（注意：月份是从 0 开始计数的，所以要加 1）
      var tomorrowMonth = tomorrow.getMonth() + 1;
      // 获取明天的日期
      var tomorrowDate = tomorrow.getDate();
      // 设置一个时间日期
      localStorage.setItem("tomorrow", tomorrowYear + "-" + tomorrowMonth + "-" + tomorrowDate);
    }
  },
  methods: {},
};
</script>

<style lang="less" scoped>
/* 公告样式 */
.main {
  width: 90%;
  margin: auto;
  padding: 19px 29px;
  border-radius: 0.3em;
  text-shadow: 0 1px 1px hsla(0, 0%, 100%, 0.3);
  box-shadow: 0 0 0 1px hsla(0, 0%, 100%, 0.3) inset, 0 0.3em 1em rgba(0, 0, 0, 0.12);
  font: 150%/1.6 Baskerville, Palatino, serif;
}
.main,
.main > div::before {
  background: url("./assets/top.gif") no-repeat center;
  background-size: cover;
}
.main > div::before {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: -1;
  filter: blur(10px);
  margin: -30px;
}
.main > div {
  color: #000;
  padding: 30px;
  hyphens: auto;
  background: hsla(0, 0%, 100%, 0.5);
  overflow: hidden;
  position: relative;
}
.main > div cite {
  font-style: normal;
}
.main footer {
  text-align: right;
  font-weight: 700;
}

@font-face {
  font-family: xp;
  src: url("http://cdn.xxoutman.cn/two.ttf");
}
@font-face {
  font-family: consolas;
  src: url("http://cdn.xxoutman.cn/one.ttf");
}
</style>
