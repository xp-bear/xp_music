<template>
  <div class="List">
    <transition name="el-fade-in">
      <el-card v-show="show" class="box-card transition-box">
        <el-table :data="songs" stripe style="width: 100%; margin-bottom: 10px">
          <el-table-column type="index" label="#" width="80"> </el-table-column>
          <el-table-column width="50">
            <template slot-scope="scope">
              <img :src="scope.row.musicImg" class="image" @click="bigImg(scope.row.musicImg, scope.row.name)" />
            </template>
          </el-table-column>
          <el-table-column label="标题" width="200">
            <template slot-scope="scope">
              <div @click="songComment(scope.row.id)" class="at-singer">{{ scope.row.name }}</div>
            </template>
          </el-table-column>

          <el-table-column label="时长" width="130">
            <template slot-scope="scope">
              <div>{{ scope.row.duration ? scope.row.duration : 0 | famter }}</div>
            </template>
          </el-table-column>
          <el-table-column label="歌手" width="180">
            <template slot-scope="scope">
              <div @click="toSingerPage(scope.row.singerName)" class="at-singer">{{ scope.row.singerName }}</div>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <div>
                <!-- <el-tooltip effect="dark" content="播放歌曲" placement="top"> -->
                <i class="el-icon-video-play" @click="vplay(scope.row.id, scope.row.musicImg, scope.row.name, scope.row.musicUrl, scope.row.lyrics)"></i>
                <!-- </el-tooltip> -->

                <!-- <el-tooltip effect="dark" content="下载歌曲" placement="top"> -->
                <i class="el-icon-download" @click="vdown(scope.row.id, scope.row.name, scope.row.musicUrl)"></i>
                <!-- </el-tooltip> -->

                <!-- <el-tooltip effect="dark" content="播放MV" placement="top"> -->
                <i class="el-icon-video-camera-solid" title="播放MV" @click="toMV(scope.row.mid, scope.row.name)"></i>
                <!-- </el-tooltip> -->
                <!-- <el-tooltip effect="dark" content="删除该条记录" placement="top"> -->
                <i class="el-icon-delete" title="删除该条记录" @click="toDelete(scope.row.id)"></i>
                <!-- </el-tooltip> -->
              </div>
            </template>
          </el-table-column>
        </el-table>
        <!-- 加载更多 -->
        <!-- <el-button type="primary" @click="toLoading" class="loading"> 加载更多 </el-button> -->
      </el-card>
    </transition>
    <!-- 播放歌曲与歌词对话框 -->
    <el-dialog :visible.sync="dialogTableVisible" :title="title" :fullscreen="true" :destroy-on-close="true" :before-close="onBeforeClose">
      <div class="lan">
        <PlayMusic :musicUrl="musicUrl" :misicImg="misicImg" :playsongs="songs" :mid="mid" @newChange="newChange" />
        <Lyric :mid="mid" :lyrics="lyrics" />
      </div>
    </el-dialog>

    <!-- 查看图片大图对话框  -->
    <el-dialog :visible.sync="bigImgFlag" :title="title" width="800px">
      <img :src="misicImg" alt="" class="demo" style="width: 100%" />
      <el-button type="primary" @click="downImg">下载图片</el-button>
    </el-dialog>

    <!-- 播放视频对话框 -->
    <el-dialog :visible.sync="toMVFlag" :title="title" width="800px" :destroy-on-close="true" :before-close="onBeforeClose">
      <div class="demo">
        <video-player class="video-player vjs-custom-skin" ref="videoPlayer" :playsinline="true" :options="playerOptions"> </video-player>
      </div>
      <el-button type="primary" @click="downMV">下载MV</el-button>
    </el-dialog>
    <!-- 歌曲评论对话框  -->
    <el-dialog :visible.sync="toCommentFlag" width="800px" :destroy-on-close="true" class="songComment">
      <Comment :comments="comments"> </Comment>
    </el-dialog>
  </div>
</template>

<script>
import PlayMusic from "@/components/PlayMusic.vue";
import Lyric from "@/components/Lyric.vue";
import Comment from "@/components/Comment.vue";
import { MUSIC_API } from "@/config/index.js";
export default {
  data() {
    return {
      dialogTableVisible: false,
      bigImgFlag: false,
      toMVFlag: false,
      musicUrl: "", //音乐url
      misicImg: "", //音乐图片url
      title: "", //音乐标题
      mid: 1, //音乐id
      moreSongs: [], //新的音乐,
      clicktag: 0, //节流的使用
      lyrics: "", //歌词
      mvId: 1, //mv 的id
      mvUrl: "", //mv 的url地址
      simgUrl: "", //传递的图片url
      toCommentFlag: false,
      comments: [],
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
    };
  },

  // 歌曲时间过滤器 4分3秒
  filters: {
    famter(val) {
      if (val <= 0) {
        return "暂无记录";
      } else {
        let minute = Math.floor(parseInt(val) / 1000 / 60);
        let second = Math.floor((parseInt(val) / 1000) % 60);
        second = second < 10 ? "0" + second : second;

        return minute + "分" + second + "秒";
      }
    },
  },
  props: ["show", "songs"],

  methods: {
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
    // 播放歌曲
    async vplay(id, src, name, musicUrl, lyrics) {
      this.dialogTableVisible = true;
      if (typeof id == "number") {
        // 发起请求拿到歌曲id
        // let res = await this.$http.get(`${MUSIC_API}song/url?id=${id}`);
        // this.musicUrl = res.data.data[0].url;

        let res = await this.$http.get(`https://api.cenguigui.cn/api/netease/music_v1.php?id=${id}&type=json&level=standard`);
        if (res.data.data.url == "获取歌曲地址失败，可能是会员到期了") {
          let res = await this.$http.get(`${MUSIC_API}song/url?id=${id}`);
          this.musicUrl = res.data.data[0].url;
        } else {
          this.musicUrl = res.data.data.url;
        }

        // 发起请求拿到歌曲歌词
        let lycdata = await this.$http.get(`${MUSIC_API}lyric?id=${id}`);
        // console.log(lycdata.data.lrc.lyric);
        this.misicImg = src;
        this.title = name;
        this.mid = id;
        this.lyrics = lycdata.data.lrc.lyric;
        // 单个图片的url链接
        this.simgUrl = src;
      } else {
        this.musicUrl = musicUrl;
        this.misicImg = src;
        this.title = name;
        this.mid = id;
        this.lyrics = lyrics;
        // 单个图片的url链接
        this.simgUrl = src;
      }

      // 提交数据到vuex
      // let obj = {
      //   musicUrl: this.musicUrl,
      //   misicImg: this.misicImg,
      //   title: this.title,
      //   mid: this.mid,
      //   simgUrl: this.simgUrl,
      //   lyrics: this.lyrics,
      // };
      // this.$store.commit("getSong", obj);
    },
    // 下载歌曲
    async vdown(id, name, musicUrl) {
      // console.log("下载音乐", name, musicUrl);
      let url = null;
      if (typeof id == "number") {
        // let res = await this.$http.get(`${MUSIC_API}song/url?id=${id}`);
        // url = res.data.data[0].url;

        let url = null;
        let res = await this.$http.get(`https://api.cenguigui.cn/api/netease/music_v1.php?id=${id}&type=json&level=standard`);
        if (res.data.data.url == "获取歌曲地址失败，可能是会员到期了") {
          let res = await this.$http.get(`${MUSIC_API}song/url?id=${id}`);
          url = res.data.data[0].url;
        } else {
          url = res.data.data.url;
        }
      } else {
        url = musicUrl;
        this.downRow(url, name, "mp3");
        return this.$message({ message: "歌曲已经在下载中,请等待!", type: "success", showClose: true, duration: 1000 });
        // return this.$message({ message: "请搜索该歌曲进行下载!", type: "warning", showClose: true, duration: 1000 });
      }

      // 节流的使用
      if (this.clicktag == 0) {
        this.clicktag = 1;
        this.downRow(url, name, "mp3");
        setTimeout(() => {
          this.clicktag = 0;
        }, 3000);
      } else {
        this.$mb.alert("当前歌曲正在下载中,请勿重复点击!", "注意", { confirmButtonText: "确定" });
      }
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
    // 子传父 回来的数据
    newChange(id, src, name, musicUrl, lyrics) {
      this.vplay(id, src, name, musicUrl, lyrics);
    },
    // // 加载更多
    // toLoading() {
    //   // 触发父组件的事件
    //   this.$emit("toLoading");
    // },
    // 播放MV
    async toMV(id, name) {
      this.toMVFlag = true;
      this.title = name;
      this.mid = id;
      //发起请求 拿到mvId
      // console.log(name);
      // let res = await this.$http.get(`https://api.imjad.cn/cloudmusic/?type=search&search_type=1004&s=${name}`);
      // console.log(res.data.result.mvs[0].id);
      // this.mvId = res.data.result.mvs[0].id;
      this.mvId = id;

      let mdata = await this.$http.get(`${MUSIC_API}mv/url?id=${this.mvId}`);
      // console.log(mdata.data);
      this.mvUrl = mdata.data.data.url; //高画质
      // console.log(this.mvUrl);
      if (this.mvUrl == null) {
        this.toMVFlag = false;
        // this.$mb.alert("当前歌曲没有mv", "注意", { confirmButtonText: "确定" });
        this.$message({ message: "当前歌曲没有mv!", type: "warning", duration: 1000 });
        return;
      }
      this.playerOptions.sources[0].src = mdata.data.data.url;

      // this.$mb.alert("播放MV正在开发中,请耐心等待!", "注意", { confirmButtonText: "确定" });
    },
    // 图片查看大图
    bigImg(imgSrc, name) {
      this.title = name;
      this.misicImg = imgSrc;
      this.bigImgFlag = true;
    },
    // 下载图片
    downImg() {
      this.downRow(this.misicImg, this.title, "png");
    },
    // 下载mv
    downMV() {
      this.downRow(this.mvUrl, this.title, "mp4");
    },
    // 跳转到歌手页面
    toSingerPage(singerName) {
      this.$router.push({ path: "/singer", query: { singerName: singerName } });
    },
    //删除该条历史记录
    toDelete(id) {
      this.songs.forEach((item, index) => {
        if (item.id == id) {
          this.songs.splice(index, 1);
        }
      });
      // 本地存储
      localStorage.setItem("likeSongs", JSON.stringify(this.songs));
    },
    //歌曲评论
    async songComment(id) {
      this.toCommentFlag = true;
      console.log(id); //拿到歌曲id
      // 发起请求拿到歌曲评论
      let res = await this.$http.get(`${MUSIC_API}comment/hot?id=${id}&type=0`);
      this.comments = res.data.hotComments;
    },
  },
  components: {
    PlayMusic,
    Lyric,
    Comment,
  },
};
</script>

<style lang="less" scoped>
.List {
  /deep/.el-dialog__body {
    padding: 0;
  }
  .at-singer {
    cursor: pointer !important;
  }
  .at-singer:hover {
    transition: all 0.3s;
    color: #409eff;
  }
  .demo {
    margin-bottom: 10px;
  }
  //歌词字体大小
  /deep/.el-dialog__body {
    font-size: 16px;
  }
  .lan {
    display: flex !important;
  }
  /deep/.el-dialog__body {
    text-align: right;
  }
  /deep/.el-dialog__headerbtn {
    font-size: 35px;
    top: 10px;
  }
  width: 800px;
  margin: 10px auto 0;
  i {
    font-size: 22px;
    margin-right: 10px;
    color: #606266;
    transition: all 0.5s;
    &:hover {
      color: #5cb6ff;
    }
  }
  .loading {
    width: 100%;
  }
  .el-card {
    width: 100%;
  }
  .image {
    height: 40px;
  }
  .text {
    font-size: 14px;
  }

  .item {
    height: 70px;
    // background-color: pink;
    // margin-bottom: 18px;
  }
}
</style>
