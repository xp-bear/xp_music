<template>
  <div class="singer">
    <div class="back" @click="toBack">
      <i class="el-icon-back"></i>
    </div>
    <!-- 歌手视图 -->
    <el-card :body-style="{ padding: '0px' }">
      <div class="img-bg" :style="backgroundDiv">
        <!-- <img :src="sUrl" class="image" /> -->
      </div>
      <div style="padding: 14px; display: flex; justify-content: space-around">
        <span>歌手: {{ this.$route.query.singerName }}</span>
        <span>专辑数量: {{ albumSize }}</span>
      </div>
    </el-card>
    <!-- tab栏切换 -->
    <el-tabs v-model="activeName" @tab-click="getAlbumData">
      <el-tab-pane label="歌手单曲" name="first">
        <!-- 列表视图 -->
        <ArtList :show="show" :songs="hotSongs" />
      </el-tab-pane>
      <el-tab-pane label="所有专辑" name="second">
        <!-- 专辑 -->
        <Album :albums="albums" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import ArtList from "@/components/ArtList.vue";
import Album from "@/components/Album.vue";
export default {
  name: "Singer",
  data() {
    return {
      sUrl: "", //歌手图片
      albumSize: 0, //歌手专辑数量
      sid: 0, //歌手id
      backgroundDiv: {
        backgroundImage: "",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "10% center",
      }, //背景图片样式
      hotSongs: [], //热门歌曲
      show: true,
      activeName: "first", //选中
      albums: [], //专辑数量
    };
  },

  methods: {
    // 返回
    toBack() {
      // console.log(this.$store.state.iptValue);
      this.$router.push({ path: "/", query: { val: this.$store.state.iptValue } });
    },
    // 初始加载的数据
    getData() {
      this.$http.get(`https://netease-cloud-music-api-azure-phi-86.vercel.app/search?keywords=${this.$route.query.singerName}&type=100`).then((res) => {
        this.sid = res.data.result.artists[0].id;
        this.sUrl = res.data.result.artists[0].picUrl;
        this.albumSize = res.data.result.artists[0].albumSize;
        this.backgroundDiv.backgroundImage = `url(${res.data.result.artists[0].picUrl})`;
        // 发起请求,拿到热门歌曲

        this.$http.get(`https://netease-cloud-music-api-azure-phi-86.vercel.app/artist/top/song?id=${this.sid}`).then((sdata) => {
          // console.log(sdata.data);
          this.hotSongs = sdata.data.songs;
          // console.log(this.hotSongs);
        });
      });
    },
    // 音乐专辑
    async getAlbumData() {
      let res = await this.$http.get(`https://netease-cloud-music-api-azure-phi-86.vercel.app/search?keywords=${this.$route.query.singerName}&type=10`);
      this.albums = res.data.result.albums;
      // console.log(this.albums);
    },
  },
  mounted() {
    this.getData();
  },

  components: {
    ArtList,
    Album,
  },
};
</script>
<style lang="less" scoped>
.singer {
  position: relative;
  width: 800px;
  margin: 0 auto;
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
  .el-card {
    .img-bg {
      width: 100%;
      height: 400px;
      img {
        height: 100%;
      }
    }
  }
  .el-tabs {
    width: 800px;
    margin: 0 auto;
    /deep/.List {
      margin: 0;
      .el-card {
        width: auto;
      }
    }
  }
}
.font {
  font-weight: 700;
  font-size: 20px;
  font-family: "黑体";
  color: #898989;
  background: -webkit-linear-gradient(45deg, #39eef6, #f86527, #fcd72d, #5f2cf8, #bed5f5);
  color: transparent;
  /*设置字体颜色透明*/
  background-clip: text;
  /*背景裁剪为文本形式*/
  animation: ran 10s linear infinite;
  /*动态10s展示*/
}
@keyframes ran {
  from {
    backgroud-position: 0 0;
  }
  to {
    background-position: 2000px 0;
  }
}
</style>
