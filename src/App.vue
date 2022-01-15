<template>
  <div id="app">
    <!-- 路由占位符 -->
    <router-view />

    <!-- 公告 -->
    <el-dialog title="重要公告" :visible.sync="dialogVisible" width="800px">
      <div class="main">
        <div>
          "本小破站完全开源,持续更新中!"<br />
          "github地址: "<a href="https://github.com/xp-coding/xp_music" target="_blank" style="font-weight: 700; color: red; text-decoration: underline">https://github.com/xp-coding/xp_music</a>
          <br />

          "gitee地址: "<a href="https://gitee.com/xp-bear" target="_blank" style="font-weight: 700; color: red; text-decoration: underline">https://gitee.com/xp-bear</a>
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
  created() {
    // setTimeout(() => {
    //   window.L2Dwidget.init({
    //     pluginRootPath: "live2dw/",
    //     pluginJsPath: "lib/",
    //     pluginModelPath: "live2d-widget-model-haru_2/assets/",
    //     tagMode: false,
    //     debug: false,
    //     model: { jsonPath: "../live2dw/live2d-widget-model-haru_2/assets/haru02.model.json" },
    //     display: { position: "left", width: 150, height: 300 },
    //     mobile: { show: true },
    //     log: false,
    //   });
    // }, 1000);
  },
  mounted() {
    // 加载看板娘
    setTimeout(() => {
      window.L2Dwidget.init({
        pluginRootPath: "live2dw/",
        pluginJsPath: "lib/",

        pluginModelPath: "live2d-widget-model-shizuku/assets/",
        tagMode: false,
        debug: false,
        model: { jsonPath: "../live2dw/live2d-widget-model-shizuku/assets/shizuku.model.json" },
        display: { position: "right", width: 200, height: 300 },
        mobile: { show: true },
        log: false,
      });
    }, 500);

    // 公告弹框提示
    setTimeout(() => {
      this.dialogVisible = true;
    }, 1000);
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
</style>
