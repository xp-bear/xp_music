<!-- 搜索页面 多选框是QQ音源选项 list列表展示 -->
<template>
  <div class="List">
    <transition name="el-fade-in">
      <el-card v-show="show" class="box-card transition-box">
        <el-table :data="songs" stripe style="width: 100%">
          <el-table-column type="index" label="#" width="80"> </el-table-column>
          <el-table-column width="50">
            <template slot-scope="scope">
              <img :src="scope.row.picUrl" class="image" @click="bigImg(scope.row.picUrl, scope.row.song_title)" />
            </template>
          </el-table-column>
          <el-table-column label="标题" width="200">
            <template slot-scope="scope">
              <div class="at-singer">{{ scope.row.song_title }}</div>
            </template>
          </el-table-column>
          <el-table-column label="时长" width="130">
            <template slot-scope="scope">
              <div>{{ scope.row.duration }}</div>
            </template>
          </el-table-column>
          <el-table-column label="歌手" width="180">
            <template slot-scope="scope">
              <div class="at-singer">{{ scope.row.song_singer }}</div>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <div>
                <!-- <el-tooltip effect="dark" content="播放歌曲" placement="top"> -->
                <i class="el-icon-video-play" @click="vplay(scope.row.song_title, scope.row.picUrl, scope.row.url, scope.row.lyric, scope.row.duration, scope.row.song_singer, scope.row.n)"></i>
                <!-- </el-tooltip> -->

                <!-- <el-tooltip effect="dark" content="下载歌曲" placement="top"> -->
                <i class="el-icon-download" @click="vdown(scope.row.url, scope.row.song_title)"></i>
                <!-- </el-tooltip> -->
              </div>
            </template>
          </el-table-column>
        </el-table>
        <!-- 加载更多 -->
        <el-button type="primary" @click="toLoading" class="loading"> 加载更多 </el-button>
      </el-card>
    </transition>
    <!-- 播放歌曲与歌词对话框 -->
    <el-dialog :visible.sync="dialogTableVisible" :title="title" :fullscreen="true" :destroy-on-close="true" :before-close="onBeforeClose">
      <div class="lan">
        <OtherPlayMusic :musicUrl="musicUrl" :misicImg="misicImg" :playsongs="songs" :mid="mid" @newChange="newChange" @updateUrl="updateUrl" />
        <Lyric :mid="mid" :lyrics="lyrics" />
      </div>
    </el-dialog>

    <!-- 查看图片大图对话框  -->
    <el-dialog :visible.sync="bigImgFlag" :title="title" width="800px">
      <img :src="misicImg" class="demo" alt="" style="width: 100%" />
      <el-button type="primary" @click="downImg">下载图片</el-button>
    </el-dialog>

    <!-- 播放视频对话框 -->
    <el-dialog :visible.sync="toMVFlag" :title="title" width="800px" :destroy-on-close="true" :before-close="onBeforeClose" @close="closedDailog">
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
import OtherPlayMusic from "@/components/OtherPlayMusic.vue";
import Lyric from "@/components/Lyric.vue";
import { MUSIC_API } from "@/config/index.js";
import Comment from "@/components/Comment.vue";
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
      toCommentFlag: false, //歌曲评论对话框
      comments: [],
    };
  },
  props: ["show", "songs"],

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

  methods: {
    updateUrl(value) {
      this.$message.closeAll();
      console.log(value);
      this.musicUrl = value;
    },
    // 关闭对话框之前
    onBeforeClose(done) {
      // console.log("我关闭之前的回调函数");
      this.musicUrl = "";
      let video = document.querySelector(".vjs-tech");
      if (video) {
        video.pause();
      }

      this.$message.closeAll();
      done();
    },
    // 关闭对话框之后
    closedDailog() {
      this.$message.closeAll();
    },
    // 播放歌曲
    vplay(name, picUrl, src, lyric, duration, singername, n) {
      console.log("播放音乐 qq  ", n);

      // 把 05:17转化成 毫秒数
      var timeParts = duration.split(":");
      var minutes = parseInt(timeParts[0], 10);
      var seconds = parseInt(timeParts[1], 10);
      // 将小时和分钟转换为毫秒
      var minutesSenconds = minutes * 60 * 1000 + seconds * 1000;

      this.dialogTableVisible = true;
      this.musicUrl = src;
      this.misicImg = picUrl;
      this.title = name;

      this.mid = name;
      // 去除歌词中\n为空的情况
      let lyricArr = lyric.split("\\n");
      let newLyricArr = lyricArr.filter((item) => item.trim() !== "");
      let newLyric = newLyricArr.join("\n");
      this.lyrics = newLyric || "[00:00.00]木有歌词哦";
      // this.lyrics = lyric || "[00:00.00]木有歌词哦";
      // console.log(this.lyrics);
      // 单个图片的url链接
      this.simgUrl = picUrl;

      // 判断该歌曲有没有资源
      if (this.musicUrl == "") {
        // return this.$mb.alert("当前歌曲暂无资源!", "注意", { confirmButtonText: "确定" });
        // this.musicUrl = "pause";
        setTimeout(() => {
          return this.$message({ message: "当前歌曲暂无资源!", type: "error", showClose: true, duration: 0 });
        }, 300);
      } else {
        this.$message.closeAll();
      }

      // 提交数据到vuex
      let obj = {
        musicUrl: this.musicUrl,
        musicImg: this.misicImg,
        name: name,
        mid: this.mid,
        simgUrl: this.simgUrl,
        lyrics: this.lyrics,
        singerName: singername,
        duration: minutesSenconds,
        id: name,
        song_id: 1, // 歌曲 ID
      };
      // console.log("提交到vuex的数据:", obj);

      this.$store.commit("getSong", obj);
    },
    // --------------------
    // 下载文件三部曲
    async downloadFileProcess(fileUrl, fileName) {
      let blob = await this.getBlob(fileUrl);
      this.saveFile(blob, fileName);
    },
    getBlob(fileUrl) {
      let that = this;
      return new Promise((resolve) => {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", fileUrl, true);
        //监听进度事件
        xhr.addEventListener(
          "progress",
          function (evt) {
            if (evt.lengthComputable) {
              let percentComplete = evt.loaded / evt.total;
              // percentage是当前下载进度，可根据自己的需求自行处理
              let percentage = percentComplete * 100;
              // console.log(percentage);
              that.download_process = parseFloat(percentage.toFixed(2));
            }
          },
          false
        );
        xhr.responseType = "blob";
        xhr.onload = () => {
          if (xhr.status === 200) {
            resolve(xhr.response);
          }
        };
        xhr.send();
      });
    },
    saveFile(blob, fileName) {
      // ie的下载
      if (window.navigator.msSaveOrOpenBlob) {
        navigator.msSaveBlob(blob, filename);
      } else {
        // 非ie的下载
        const link = document.createElement("a");
        link.classList.add("download_link");
        const body = document.querySelector("body");

        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;

        // fix Firefox
        link.style.display = "none";
        body.appendChild(link);

        link.click();
        body.removeChild(link);

        window.URL.revokeObjectURL(link.href);
      }
    },
    // 根据a标签下载
    downloadMusic(url, fileName) {
      const link = document.createElement("a");
      link.href = url;
      link.target = "_blank";
      link.download = fileName;
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },

    // 下载歌曲
    async vdown(url, name) {
      console.log("下载音乐", name, url);
      this.musicUrl = url;
      // 节流控制
      if (this.clicktag == 0) {
        this.clicktag = 1;

        try {
          // 创建下载链接
          const link = document.createElement("a");
          link.href = this.musicUrl;
          link.target = "_blank";

          // 设置下载属性（文件名）
          link.download = `${name}.mp3`;

          // 触发点击事件开始下载
          document.body.appendChild(link);
          link.click();

          // 清理DOM
          document.body.removeChild(link);

          console.log(`歌曲 ${name} 开始下载`);
        } catch (error) {
          console.error("下载失败:", error);
          this.$mb.alert("歌曲下载失败，请重试！", "错误", { confirmButtonText: "确定" });
        }

        // 3秒后重置节流标记
        setTimeout(() => {
          this.clicktag = 0;
        }, 3000);
      } else {
        this.$mb.alert("当前歌曲正在下载中,请勿重复点击!", "注意", { confirmButtonText: "确定" });
      }
    },

    fake_click(obj) {
      var ev = document.createEvent("MouseEvents");
      ev.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
      obj.dispatchEvent(ev);
    },

    export_raw(name, data) {
      var urlObject = window.URL || window.webkitURL || window;
      var export_blob = new Blob([data]);
      var save_link = document.createElementNS("http://www.w3.org/1999/xhtml", "a");
      save_link.href = urlObject.createObjectURL(export_blob);
      save_link.download = name;
      this.fake_click(save_link);
    },

    // 方式2：给一个图片地址，用canvas转base64进行下载，可以前端指定下载名
    downloadImg2(url, name, suffix) {
      const image = new Image();
      image.src = url;
      image.crossOrigin = "anonymous";
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      image.onload = function () {
        canvas.width = image.width;
        canvas.height = image.height;
        context.drawImage(image, 0, 0, image.width, image.height);
        const base64 = canvas.toDataURL("image/jpeg");
        const a = document.createElement("a");
        a.href = base64;
        a.download = name + "." + suffix;
        const mouseEvent = new MouseEvent("click");
        a.dispatchEvent(mouseEvent);
      };
      image.onerror = function () {
        console.log("图片加载失败");
      };
    },

    // 根据url下载
    downRow(data, name, suffix) {
      let ajax = new XMLHttpRequest();
      ajax.open("GET", data, true);
      ajax.responseType = "blob";
      ajax.withCredentials = true; //如果跨域
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
    newChange(name, picUrl, src, lyric, duration, singername) {
      this.vplay(name, picUrl, src, lyric, duration, singername);
    },
    // 加载更多
    toLoading() {
      // 触发父组件的事件
      this.$emit("toLoading");
    },
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
      this.misicImg = imgSrc.split("?")[0];
      this.bigImgFlag = true;
      // console.log(this.misicImg);
    },
    // 下载图片
    downImg() {
      // this.downRow(this.misicImg, this.title, "png");
      // this.downloadImg2(this.misicImg, this.title, "png");
      this.downloadMusic(this.misicImg, this.title);
    },
    // 下载mv
    downMV() {
      this.downRow(this.mvUrl, this.title, "mp4");
    },
    // 跳转到歌手页面
    toSingerPage(singerName) {
      this.$router.push({ path: "/singer", query: { singerName: singerName } });
    },
    //歌曲评论
    async songComment(id) {
      this.toCommentFlag = true;
      // console.log(id); //拿到歌曲id
      // 发起请求拿到歌曲评论
      let res = await this.$http.get(`${MUSIC_API}comment/hot?id=${id}&type=0`);
      this.comments = res.data.hotComments;
    },
  },
  components: {
    OtherPlayMusic,
    Lyric,
    Comment,
  },
};
</script>

<style lang="less" scoped>
.List {
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
  .songComment {
    /deep/.el-dialog__body {
      padding: 10px 0 0;
    }
  }
}
</style>
