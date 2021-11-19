<template>
  <div id="app">
    <!-- <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div> -->

    <router-view />

    <!-- 公告 -->
    <el-dialog title="重要公告" :visible.sync="dialogVisible" width="800px">
      <div class="main">
        <div>
          "本音乐小站完全开源,持续更新!"<br />
          "项目地址:https://github.com/xp-coding/xp_music"<br />
          "如果您有任何问题,请联系该邮箱: <span style="color: red">1693889638@qq.com</span>"
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
    <!-- 回到顶部 -->
    <el-backtop :bottom="250" :right="85">
      <div
        style="
           {
            height: 100%;
            width: 100%;
            background-color: #f2f5f6;
            box-shadow: 0 0 6px rgba(0, 0, 0, 0.12);
            text-align: center;
            line-height: 40px;
            color: #1989fa;
          }
        "
      >
        <i class="el-icon-top"></i>
      </div>
    </el-backtop>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialogVisible: false,
    };
  },
  mounted() {
    // 加载看板娘
    setTimeout(() => {
      window.L2Dwidget.init({
        pluginRootPath: "live2dw/",
        pluginJsPath: "lib/",
        pluginModelPath: "live2d-widget-model-z16/assets/",
        tagMode: false,
        debug: false,
        model: { jsonPath: "../live2dw/live2d-widget-model-shizuku/assets/shizuku.model.json" },
        display: { position: "right", width: 200, height: 300 },
        mobile: { show: true },
        log: false,
      });
    }, 500);

    // 公告弹框提示
    // setTimeout(() => {
    //   this.dialogVisible = true;
    // }, 1000);
  },
  methods: {},
};
</script>

<style lang="less">
// 文本省略样式
.eclipsis {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

// 初始字体
#app {
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
}

// 公告样式
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
  // font-style: italic;
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
</style>
