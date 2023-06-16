<template>
  <div class="Index">
    <!-- 顶栏 -->
    <div class="top">
      <div class="logo">
        <img src="../assets/logo3.png" alt="" />
      </div>
      <!-- 搜索框 -->
      <div class="search_input">
        <input type="text" placeholder="搜索你想听的歌" v-model="ipt" @keyup.enter="toSearchPage" />
        <div class="searh_btn" @click="toSearchPage"><i class="el-icon-search"></i></div>
      </div>

      <div class="user" v-if="isUser == false">
        <el-button type="primary" size="small" @click="loginIN">登录</el-button>
        <el-button type="info" size="small" @click="register">注册</el-button>
      </div>
      <div class="user" v-else>
        <img src="../assets/avatar.png" alt="" />&nbsp; <span @click="toUser"> {{ token.name }}</span
        >&nbsp;
        <el-button type="danger" size="small" @click="exit">退出</el-button>
      </div>
    </div>
    <!-- 轮播图 -->
    <el-carousel :interval="5000" type="card" arrow="always" trigger="click" height="200px">
      <el-carousel-item v-for="item in banners" :key="item.imageUrl">
        <img :src="item.imageUrl" alt="" />
      </el-carousel-item>
    </el-carousel>

    <!-- 热门歌单横幅 -->
    <p class="hot-top-title"><img src="../assets/selectlist.jpg" alt="" /></p>
    <!-- 热门歌单 -->
    <keep-alive>
      <div class="hot">
        <div class="h-item" v-for="item in limitPlaylists" :key="item.id" @click="toPlaylistPage(item.id)">
          <img :src="item.coverImgUrl" alt="" />
          <div class="h-title">
            <i class="el-icon-headset"></i><span>{{ item.playCount | numFilter }}</span>
          </div>
          <div class="h-desc">
            <span class="eclipse">{{ item.name }}</span>
            <span class="eclipse">{{ item.creator.nickname }}</span>
          </div>
          <!-- 播放按钮-遮罩层 -->
          <div class="mask-play">
            <i class="el-icon-video-play"></i>
          </div>
        </div>
      </div>
    </keep-alive>
    <!-- 歌单分页 -->
    <el-pagination
      :current-page="this.currentPage"
      :background="true"
      layout="prev, slot, next,total"
      :page-size="12"
      :total="this.playlists.length"
      @next-click="nextP"
      @prev-click="prevP"
      :hide-on-single-page="true"
      ref="pagination"
    >
      <span @click="psize(1)" :class="this.currentPage == 1 ? 'active' : ''">1</span>
      <span @click="psize(2)" :class="this.currentPage == 2 ? 'active' : ''">2</span>
      <span @click="psize(3)" :class="this.currentPage == 3 ? 'active' : ''">3</span>
      <span @click="psize(4)" :class="this.currentPage == 4 ? 'active' : ''">4</span>
      <span @click="psize(5)" :class="this.currentPage == 5 ? 'active' : ''">5</span>
    </el-pagination>

    <!-- 最新mv横幅 -->
    <p class="hot-top-title"><img src="../assets/albumlist.jpg" alt="" /></p>
    <keep-alive>
      <div class="hot">
        <div class="h-item" v-for="item in limitMvList" :key="item.id" @click="toMV(item.id, item.name)">
          <img :src="item.cover" alt="" />
          <div class="h-title">
            <i class="el-icon-headset"></i><span>{{ item.playCount | numFilter }}</span>
          </div>
          <div class="h-desc">
            <span class="eclipse">{{ item.name }} - {{ item.artistName }}</span>
          </div>
          <!-- 播放按钮-遮罩层 -->
          <div class="mask-play">
            <i class="el-icon-video-play"></i>
          </div>
        </div>
      </div>
    </keep-alive>
    <!-- MV分页 -->
    <el-pagination
      :current-page="this.mvCurPage"
      :background="true"
      layout="prev, slot, next,total"
      :page-size="12"
      :total="this.mvList.length"
      @next-click="MvnextP"
      @prev-click="MvprevP"
      :hide-on-single-page="true"
      ref="pagination"
    >
      <span @click="msize(1)" :class="this.mvCurPage == 1 ? 'active' : ''">1</span>
      <span @click="msize(2)" :class="this.mvCurPage == 2 ? 'active' : ''">2</span>
      <span @click="msize(3)" :class="this.mvCurPage == 3 ? 'active' : ''">3</span>
    </el-pagination>

    <!-- 排行榜横幅 -->
    <p class="hot-top-title"><img src="../assets/hotlist.jpg" alt="" /></p>
    <!-- 排行榜 -->
    <el-tabs v-model="activeName" class="test-5" type="border-card" @tab-click="handleClick">
      <el-tab-pane label="飙升榜" name="first">
        <keep-alive>
          <HomeArtList :songs="topPlaySongs" :show="true" />
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane label="新歌榜" name="second">
        <keep-alive>
          <HomeArtList :songs="topPlaySongs" :show="true" />
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane label="原创榜" name="third">
        <keep-alive>
          <HomeArtList :songs="topPlaySongs" :show="true" />
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane label="热歌榜" name="fourth">
        <keep-alive>
          <HomeArtList :songs="topPlaySongs" :show="true" />
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane label="黑胶VIP爱听榜" name="fifth">
        <keep-alive>
          <HomeArtList :songs="topPlaySongs" :show="true" />
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane label="云音乐说唱榜" name="sixth">
        <keep-alive>
          <HomeArtList :songs="topPlaySongs" :show="true" />
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane label="云音乐说唱榜" name="seventh">
        <keep-alive>
          <HomeArtList :songs="topPlaySongs" :show="true" />
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane label="云音乐电音榜" name="eighth">
        <keep-alive>
          <HomeArtList :songs="topPlaySongs" :show="true" />
        </keep-alive>
      </el-tab-pane>
    </el-tabs>

    <!-- 播放视频对话框 -->
    <el-dialog :visible.sync="toMVFlag" :title="title" width="800px" :destroy-on-close="true" :before-close="onBeforeClose">
      <div class="demo" style="margin-bottom: 10px">
        <video-player class="video-player vjs-custom-skin" ref="videoPlayer" :playsinline="true" :options="playerOptions"> </video-player>
      </div>
      <el-button type="primary" @click="downMV">下载MV</el-button>
    </el-dialog>
  </div>
</template>

<script>
import { MessageBox } from "element-ui";
import HomeArtList from "@/components/HomeArtList";
import { MUSIC_API } from "@/config/index.js";
export default {
  name: "Home",
  data() {
    return {
      banners: [], //轮播图
      ipt: "", //搜索关键字
      playlists: [], //热门歌单
      limitPlaylists: [], //限制歌单分页
      currentPage: 1, //页码
      limitMvList: [], //限制mv分页
      mvCurPage: 1, //页码
      isUser: false, //用户登录状态
      token: {}, //保存token状态
      activeName: "first",
      topList: [], //排行榜数据
      topPlaySongs: [], //排行榜歌曲
      mvList: [], //mv数据
      toMVFlag: false,
      playerOptions: {
        //播放速度
        playbackRates: [0.5, 1.0, 1.5, 2.0],
        //如果true,浏览器准备好时开始回放。
        autoplay: false,
        // 默认情况下将会消除任何音频。
        muted: false,
        // 导致视频一结束就重新开始。
        loop: false,
        // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        preload: "auto",
        language: "zh-CN",
        // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        aspectRatio: "16:9",
        // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        fluid: true,
        sources: [
          {
            type: "video/mp4", //类型
            src: "", //url地址
          },
        ],
        //你的封面地址
        poster: "",
        //允许覆盖Video.js无法播放媒体源时显示的默认信息。
        notSupportedMessage: "该视频暂无资源!",
        controlBar: {
          timeDivider: true, // 当前时间和持续时间的分隔符
          durationDisplay: true, // 显示持续时间
          remainingTimeDisplay: false, // 是否显示剩余时间功能
          fullscreenToggle: true, //全屏按钮
        },
      }, //视频播放配置
      title: "", //mv标题
    };
  },
  methods: {
    // 跳转搜索页面
    toSearchPage() {
      if (this.ipt !== "") {
        this.$router.push({ name: "Search", params: { ipt: this.ipt } });
      }
    },
    // 点击登录按钮
    loginIN() {
      // this.$mb.alert("登录功能正在开发中", "注意", { confirmButtonText: "确定" });
      this.$router.push({ path: "/login" });
    },
    // 注册功能按钮
    register() {
      // this.$mb.alert("注册功能正在开发中", "注意", { confirmButtonText: "确定" });
      this.$router.push({ path: "/register" });
    },
    // 跳转歌单页面
    toPlaylistPage(pid) {
      this.$router.push({ path: "/playlist", query: { pid: pid } });
    },
    // 分页按钮切换
    psize(val) {
      this.currentPage = val;
      this.limitPlaylists = this.playlists.slice(12 * (val - 1), 12 * val);
    },
    msize(val) {
      this.mvCurPage = val;
      this.limitMvList = this.mvList.slice(12 * (val - 1), 12 * val);
      // console.log(this.currentPage);
    },
    // 下一页
    nextP() {
      this.currentPage += 1;
      this.limitPlaylists = this.playlists.slice(12 * (this.currentPage - 1), 12 * this.currentPage);
    },
    MvnextP() {
      this.mvCurPage += 1;
      this.limitMvList = this.mvList.slice(12 * (this.mvCurPage - 1), 12 * this.mvCurPage);
      // console.log("下一页", this.mvCurPage);
    },
    // 上一页
    prevP() {
      this.currentPage -= 1;
      this.limitPlaylists = this.playlists.slice(12 * (this.currentPage - 1), 12 * this.currentPage);
    },
    MvprevP() {
      this.mvCurPage -= 1;
      this.limitMvList = this.mvList.slice(12 * (this.mvCurPage - 1), 12 * this.mvCurPage);
      // console.log("上一页", this.mvCurPage);
    },
    // 退出登录
    exit() {
      MessageBox.confirm("此操作将退出用户登录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "成功退出登录!",
          });

          localStorage.clear();
          this.isToken();
        })
        .catch(() => {});
      // this.$message({ message: "退出登录成功!", type: "success", showClose: true, duration: 1000 });
    },
    // 判断token
    isToken() {
      // 根据token判断是否登录
      let token = JSON.parse(localStorage.getItem("user")) || "";
      this.token = token;
      // console.log(this.token);
      if (token) {
        this.isUser = true;
      } else {
        this.isUser = false;
      }
    },
    // tab栏切换
    handleClick(tab, event) {
      // console.log(this.topList[tab.index].id);
      // 点击请求排行数据
      this.$http.get(`${MUSIC_API}playlist/detail?id=${this.topList[tab.index].id}`).then((res) => {
        this.topPlaySongs = res.data.playlist.tracks.slice(0, 20);
      });
    },
    // 播放MV
    async toMV(id, title) {
      this.title = title;
      this.toMVFlag = true;
      let mdata = await this.$http.get(`${MUSIC_API}mv/url?id=${id}`);
      this.mvUrl = mdata.data.data.url; //高画质
      if (this.mvUrl == null) {
        this.toMVFlag = false;
        this.$message({ message: "当前歌曲没有mv!", type: "warning", duration: 1000 });
        return;
      }
      this.playerOptions.sources[0].src = mdata.data.data.url;
    },
    // 下载mv
    downMV() {
      this.downRow(this.mvUrl, this.title, "mp4");
      this.$message({ message: "正在下载该MV,请勿重复点击!", type: "success", duration: 1000, showClose: true });
    },
    // 根据url下载
    downRow(data, name, suffix) {
      let ajax = new XMLHttpRequest();
      ajax.open("GET", data, true);
      ajax.responseType = "blob";
      // ajx.withCredentials = true; //如果跨域
      ajax.onload = function (oEvent) {
        let content = ajax.response;
        let a = document.createElement("a");
        a.download = name + "." + suffix; //文件名
        a.style.display = "none";
        let blob = new Blob([content]);
        a.href = URL.createObjectURL(blob);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      };
      ajax.send();
    },
    // 关闭对话框之前
    onBeforeClose(done) {
      // console.log("我关闭之前的回调函数");
      this.musicUrl = "";
      let video = document.querySelector(".vjs-tech");
      if (video) {
        video.pause();
      }

      done();
    },
    // 调转到用户
    toUser() {
      this.$router.push({ path: "/user" });
    },
  },
  mounted() {
    // token 判断
    this.isToken();
    // 返回请求的关键字
    if (this.$route.query.val) {
      this.ipt = this.$route.query.val;
    }
    // 请求轮播图数据
    this.$http.get(`${MUSIC_API}banner`).then((bdata) => {
      this.banners = bdata.data.banners;
      // console.log(this.banners);
    });
    // 请求热门歌单数据
    this.$http.get(`${MUSIC_API}top/playlist/highquality`).then((hdata) => {
      this.playlists = hdata.data.playlists;
      this.limitPlaylists = this.playlists.slice(0, 12);
    });

    // 请求排行榜数据
    this.$http.get(`${MUSIC_API}toplist/detail`).then((pdata) => {
      this.topList = pdata.data.list.slice(0, 8);
      // console.log(this.topList);
      // 请求第一页数据
      this.$http.get(`${MUSIC_API}playlist/detail?id=${this.topList[0].id}`).then((res) => {
        this.topPlaySongs = res.data.playlist.tracks.slice(0, 20);
      });
    });

    // 请求最新MV数据
    this.$http.get(`${MUSIC_API}mv/first`).then((mres) => {
      this.mvList = mres.data.data;
      this.limitMvList = this.mvList.slice(0, 12);
    });
  },

  filters: {
    numFilter(val) {
      if (val > 10000) {
        return (val / 10000).toFixed(2) + "万";
      }
    },
  },
  components: {
    HomeArtList,
  },
};
</script>

<style lang="less" scoped>
.Index {
  margin: 0 auto;
  .active {
    background: #409eff;
  }
  /deep/.el-dialog__body {
    text-align: right;
  }
  // 分页
  .el-pagination {
    text-align: center;
    cursor: pointer;
  }
  /deep/.el-pagination button,
  .el-pagination span:not([class*="suffix"]) {
    min-width: 27.5px !important;
    border-radius: 3px;
  }
  // 顶栏
  .top {
    display: flex;
    align-items: center;
    width: 1000px;
    height: 60px;
    margin: 0 auto;
    .logo {
      // height: 37px;
      margin-right: auto;
      img {
        height: 50px;
      }
    }
    .search_input {
      display: flex;
      align-items: center;
      text-size-adjust: none;
      user-select: none;
      width: 298px;
      height: 34px;
      box-sizing: border-box;
      border-radius: 3px;
      border: 1px solid #ccc;
      input {
        width: 100%;
        height: 100%;
        padding: 5px 0 5px 10px;
      }
      .searh_btn {
        height: 100%;
        line-height: 34px;
        background-color: #fff;
        padding-right: 10px;
        &:hover {
          color: #1fa0ff;
          transition: all 0.3s;
        }
      }
    }
    .user {
      display: flex;
      align-items: center;
      margin-left: auto;

      img {
        // width: 50px;
        height: 40px;
        border-radius: 50%;
        transform: rotate(0deg);
        transition: all 0.5s;
        &:hover {
          transform: rotate(360deg);
          transition: all 0.5s;
        }
      }
      span {
        font-size: 18px !important;
        font-weight: 700;
        cursor: pointer;
      }
    }
  }
  // 轮播
  /deep/.el-carousel__container {
    height: 200px;
  }

  .el-carousel {
    width: 1000px;
    margin: 0px auto 0;
  }
  .el-carousel__item img {
    width: 100%;
  }
  .hot-top-title {
    width: 1000px;
    margin: 0px auto 10px;
    img {
      transform-origin: 0 50%;
      transform: scale(0.8);
    }
  }
  // 歌单
  .hot {
    width: 1010px;
    margin: 0 auto;
    display: flex;
    flex-wrap: wrap;
    // .hot-top-title {
    //   img {
    //     transform-origin: 0 50%;
    //     transform: scale(0.8);
    //   }
    // }
    .h-item {
      position: relative;
      width: 160px;
      height: 160px;
      border-radius: 5px;
      overflow: hidden;
      color: #fff;
      cursor: pointer;
      margin-bottom: 10px;
      margin-right: 10px;
      &:nth-child(6n) {
        margin-right: 0px;
      }
      img {
        width: 100%;
        height: 100%;
      }
      .h-title {
        position: absolute;
        top: 0;
        right: 0;
        background: linear-gradient(-90deg, rgba(0, 0, 0, 0.5), transparent);
        font-size: 12px;
        padding: 5px 2px;
      }
      .h-desc {
        width: 100%;
        display: flex;
        flex-direction: column;
        position: absolute;
        bottom: 0;
        padding: 5px 2px;
        background: linear-gradient(90deg, rgba(0, 0, 0, 0.5), transparent);
        span {
          &:nth-child(1) {
            font-size: 14px;
          }
          &:nth-child(2) {
            font-size: 14px;
          }
        }
      }
      .mask-play {
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        color: rgba(255, 255, 255, 0.5);
        font-size: 40px;
        opacity: 0;
      }
      &:hover .mask-play {
        opacity: 1;
        transition: all 0.3s;
      }
    }
  }
  // 排行榜
  .el-tabs {
    width: 1000px;
    // height: 600px;
    margin: 0 auto;
    background-color: rgba(255, 255, 255, 0.3);
    // overflow-y: scroll;
    // margin-bottom: 200px;
    border-radius: 5px;
    /deep/.el-tabs__content {
      padding: 0;
    }
    /deep/.el-tabs__content {
      // background: url("../assets/rain.gif") no-repeat;
      // background-size: cover;
    }
    /deep/.el-tabs__item {
      font-size: 16px;
    }
    .Lsit {
      background-color: rgba(255, 255, 255, 0.5);
    }
  }
}
</style>
