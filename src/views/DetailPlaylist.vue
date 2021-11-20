<template>
  <div class="Playlist">
    <!-- 顶栏 -->
    <div class="top">
      <!-- 返回 -->
      <div class="back" @click="toBack">
        <i class="el-icon-back"></i>
      </div>
      <div><img :src="plistimgUrl" alt="" @click="bigImg" /></div>
      <div class="t-title">
        <span class="t-hot-tit">{{ playlistTitle }}</span>
        <span><i class="el-icon-user-solid user"></i> {{ creator }}</span>
        <span>标签：{{ tags.join(" ") }}</span>
        <span>播放量：{{ playCount | numFilter }}</span>
        <span>收藏量：{{ subscribedCount | numFilter }}</span>
        <span>
          <el-button type="primary"><i class="el-icon-video-play"></i> 播放全部</el-button>
          <el-button type="warning"><i class="el-icon-chat-dot-square"></i> 评论</el-button>
          <el-button type="danger" icon="el-icon-star-off"> 收藏</el-button>
        </span>
      </div>
    </div>
    <!-- <p class="desc test-5">描述：{{ description }}</p> -->
    <!-- 列表 -->
    <ArtList :songs="playlistSongs" :show="true" />

    <!-- 查看图片大图对话框  -->
    <el-dialog :visible.sync="bigImgFlag" :title="playlistTitle" width="800px">
      <img :src="plistimgUrl" alt="" style="width: 100%" />
      <el-button type="primary" @click="downImg">下载图片</el-button>
    </el-dialog>
  </div>
</template>

<script>
import ArtList from "@/components/ArtList";
export default {
  name: "Playlist",
  data() {
    return {
      playlistSongs: [], //歌单里面歌曲
      plistimgUrl: "", //图片url
      playlistTitle: "", //标题
      playCount: 0, //播放次数
      subscribedCount: 0, //收藏次数
      tags: [], //标签
      creator: "", //歌单创建者
      description: "", //歌单描述
      bigImgFlag: false,
    };
  },
  methods: {
    // 返回
    toBack() {
      // console.log(this.$store.state.iptValue);
      this.$router.push({ path: "/", query: { val: this.$store.state.iptValue } });
    },
    // 下载图片
    downImg() {
      this.downRow(this.plistimgUrl, this.playlistTitle, "png");
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
    bigImg() {
      this.bigImgFlag = true;
    },
  },
  mounted() {
    // 根据歌单id发起请求
    this.$http.get(`http://123.207.32.32:9001/playlist/detail?id=${this.$route.query.pid}`).then((res) => {
      this.playlistSongs = res.data.playlist.tracks;
      this.plistimgUrl = res.data.playlist.coverImgUrl;
      this.playlistTitle = res.data.playlist.name;
      this.playCount = res.data.playlist.playCount;
      this.subscribedCount = res.data.playlist.subscribedCount;
      this.tags = res.data.playlist.tags;
      this.creator = res.data.playlist.creator.nickname;
      this.description = res.data.playlist.description;
      console.log(res.data.playlist.tracks);
    });
  },
  components: {
    ArtList,
  },
  filters: {
    numFilter(val) {
      if (val > 10000) {
        return (val / 10000).toFixed(2) + "万";
      } else {
        return "暂无数据";
      }
    },
  },
};
</script>

<style lang="less" scoped>
.Playlist {
  /deep/.el-dialog__body {
    text-align: right;
  }
  .top {
    width: 800px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    position: relative;

    .back {
      position: absolute;
      top: 0;
      left: -50px;
      width: 40px;
      height: 40px;
      text-align: center;
      line-height: 40px;
      border: 1px solid #ccc;
    }
    img {
      width: 250px;
      height: 250px;
    }
    .t-title {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      margin-left: 40px;
      .t-hot-tit {
        font-size: 31px;
      }
      .user {
        color: #9d9d9d;
        font-size: 16px;
      }
    }
  }
  .desc {
    width: 800px;
    margin: 0 auto;
    padding: 10px;
    height: 200px;
    overflow-y: scroll;
  }
}
</style>
