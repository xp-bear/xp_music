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
        <img src="../assets/avatar.png" alt="" />&nbsp; <span> {{ token.name }}</span
        >&nbsp;
        <el-button type="danger" size="small" @click="exit">退出</el-button>
      </div>
    </div>
    <!-- 轮播图 -->
    <el-carousel :interval="5000" arrow="always" trigger="click" height="370">
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
    <!-- 分页 -->
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
  </div>
</template>

<script>
import { MessageBox } from "element-ui";
export default {
  name: "Home",
  data() {
    return {
      banners: [], //轮播图
      ipt: "", //搜索关键字
      playlists: [], //热门歌单
      limitPlaylists: [], //限制歌单分页
      currentPage: 1, //页码
      isUser: false, //用户登录状态
      token: {},
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
      // console.log(this.currentPage);
    },
    // 下一页
    nextP() {
      this.currentPage += 1;
      this.limitPlaylists = this.playlists.slice(12 * (this.currentPage - 1), 12 * this.currentPage);
      // console.log("下一页", this.currentPage);
    },
    // 上一页
    prevP() {
      this.currentPage -= 1;
      this.limitPlaylists = this.playlists.slice(12 * (this.currentPage - 1), 12 * this.currentPage);
      // console.log("上一页", this.currentPage);
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
  },
  mounted() {
    // token 判断
    this.isToken();

    // 返回请求的关键字
    if (this.$route.query.val) {
      this.ipt = this.$route.query.val;
    }

    // 请求轮播图数据
    this.$http.get(`http://123.207.32.32:9001/banner`).then((bdata) => {
      this.banners = bdata.data.banners;
      // console.log(this.banners);
    });
    // 请求热门歌单数据
    this.$http.get(`http://123.207.32.32:9001/top/playlist/highquality`).then((hdata) => {
      this.playlists = hdata.data.playlists;
      this.limitPlaylists = this.playlists.slice(0, 12);
    });
  },
  updated() {},
  filters: {
    numFilter(val) {
      if (val > 10000) {
        return (val / 10000).toFixed(2) + "万";
      }
    },
  },
};
</script>

<style lang="less" scoped>
.Index {
  margin: 0 auto;
  .active {
    background: #409eff;
  }
  // 分页
  .el-pagination {
    text-align: center;
    cursor: pointer;
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
    height: 370px;
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
    margin: 10px auto;
  }
  // 歌单
  .hot {
    width: 1010px;
    margin: 0 auto;
    display: flex;
    flex-wrap: wrap;
    .h-item {
      position: relative;
      width: 160px;
      height: 160px;
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
}
</style>
