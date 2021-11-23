<template>
  <div class="playMusic">
    <div class="bg"><img :src="misicImg" alt="" /></div>
    <div class="playContent">
      <img :class="this.isPlay ? 'move' : 'remove'" src="../assets/needle-ab.png" alt="" />
      <img :class="this.isPlay && 'mover'" src="../assets/bg.png" alt="" />
      <img :class="this.isPlay && 'mover'" :src="misicImg" alt="" />
    </div>

    <!-- 播放条 -->
    <div class="bt-list">
      <i class="el-icon-d-arrow-left" @click="micChange(-1)"></i>
      <i :class="this.isPlay ? 'el-icon-video-pause' : 'el-icon-video-play'" @click="toPlay"></i>

      <i class="el-icon-d-arrow-right" @click="micChange(+1)"></i>
      <!-- 歌曲进度条 -->
      <div id="progressBar" @click="speed">
        <div id="pgIcon" ref="speedprocess">
          <img src="../assets/rocket.png" />
        </div>
      </div>
    </div>
    <div class="block">
      <el-slider v-model="volume" vertical height="200px" @input="justVolume"></el-slider>
    </div>
    <audio :src="musicUrl" :autoplay="isPlay && 'autoplay'" ref="audio"></audio>
  </div>
</template>
<script>
import { Message } from "element-ui";

export default {
  data() {
    return {
      isPlay: true,
      newId: 0, //新歌曲id
      newUrl: "",
      newNmae: "",
      cur: 0,
      total: 0,
      timer: null,
      speeds: 0, //歌曲进度
      volume: 50,
      copymusicUrl: "true", //歌曲url copy
    };
  },

  mounted() {
    // 自动切换下一首 开启一个定时器
    this.timer = setInterval(() => {
      this.cur = this.$refs.audio.currentTime; //当前播放时间
      this.total = this.$refs.audio.duration; //总时间
      // console.log("歌曲播放时间", this.cur.toFixed(0), this.total.toFixed(0));

      // 歌曲进度条
      let speeding = (this.cur.toFixed(0) / this.total.toFixed(0)) * 100;
      this.speeds = speeding.toFixed(0);
      // console.log("进度", this.speeds);
      this.$refs.speedprocess.style.width = this.speeds + "%";
      let obj = {
        cur: this.cur,
        total: this.total,
      };
      this.$store.commit("getMusic", obj);

      // 判断该歌曲有没有资源
      this.copymusicUrl = this.musicUrl;
      if (this.copymusicUrl == null) {
        // this.$mb.alert("当前歌曲暂无资源!", "注意", { confirmButtonText: "确定" });
        this.copymusicUrl = "pause";
        this.musicUrl = "pause";
        return this.$message({ message: "当前歌曲暂无资源!", type: "error", showClose: true });
      }
    }, 500);
  },

  props: ["musicUrl", "misicImg", "playsongs", "mid"],
  methods: {
    // 调整音乐声音大小
    justVolume() {
      // console.log(this.volume);
      this.$refs.audio.volume = this.volume / 100;
    },
    //播放按钮
    toPlay() {
      if (this.isPlay) {
        this.$refs.audio.pause();
      } else {
        this.$refs.audio.play();
      }
      this.isPlay = !this.isPlay;
    },
    // 上下首歌曲切换
    micChange(counter) {
      // 手动上下音乐切换
      let num = this.playsongs.findIndex((item) => {
        return item.id == this.mid;
      });
      // console.log(counter);
      // console.log("当前索引位置: ", num);
      if (num == 0 && counter == -1) {
        this.$mb.alert("当前已经是第一首歌", "注意", { confirmButtonText: "确定" });
        return;
      }
      if (num == this.playsongs.length - 1 && counter == 1) {
        this.$mb.alert("当前已经是最后一首歌", "注意", { confirmButtonText: "确定" });
        return;
      }
      this.newId = this.playsongs[num + counter].id;

      //判断某个字段是否在对象里面
      if (this.playsongs[num + counter].hasOwnProperty("artists")) {
        this.newUrl = this.playsongs[num + counter].artists[0].picUrl;
      } else {
        this.newUrl = this.playsongs[num + counter].al.picUrl;
      }

      this.newNmae = this.playsongs[num + counter].name;

      // console.log("新id", this.newId);
      this.$emit("newChange", this.newId, this.newUrl, this.newNmae);
    },
    // 进度条
    speed(e) {
      let totalW = document.querySelector("#progressBar");
      // console.log("偏移位置:", e.offsetX);
      // console.log("总宽度: ", totalW.offsetWidth);
      this.speeds = ((e.offsetX / totalW.offsetWidth) * 100).toFixed(0);

      // console.log("点击后", this.speeds);
      this.$refs.speedprocess.style.width = this.speeds + "%";
      this.cur = +((this.speeds * this.total) / 100).toFixed(0);
      this.$refs.audio.currentTime = this.cur;
      let obj = {
        cur: this.cur,
        total: this.total,
      };
      this.$store.commit("getMusic", obj);
    },
  },
  watch: {
    // 自动切换下一首歌曲
    cur(newVal, oldVal) {
      if (newVal.toFixed(0) == this.total.toFixed(0)) {
        // console.log("我进来了");
        this.micChange(1);
      }
    },
  },
  destroyed() {
    clearInterval(this.timer);
  },
};
</script>

<style lang="less" scoped>
.playMusic {
  width: 50%;
  height: 100%;
  position: relative;
  top: 0;
  left: 0;
  // transform: translateX(-50%);
  display: inline-block;

  .block {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 0;
  }
  .bg {
    position: absolute;
    width: 100%;
    height: 100%;
    img {
      width: 100%;
      height: 100%;
      filter: blur(5px);
    }
  }
  .playContent {
    display: flex;
    height: 100%;
    flex-direction: column;
    align-items: center;
    background-size: cover;

    & img:nth-child(1) {
      z-index: 3;
      width: 100px;
      transform: rotate(-25deg);
      transform-origin: 0% 0%;
      margin-bottom: -30px;
    }
    & img:nth-child(2) {
      position: relative;
      z-index: 2;
      width: 300px;
      margin-top: -0.7rem;
    }
    & img:nth-child(3) {
      position: absolute;
      top: 175px;
      width: 200px;
      height: 200px;
      border-radius: 50%;
    }
  }
  .bt-list {
    position: relative;
    width: 100%;
    height: 80px;
    line-height: 80px;
    text-align: center;
    // background-color: rgba(0, 0, 0, 0.6);
    background: linear-gradient(to right, #606c8860, #3f4c6b60, #2193b060, #2193b060, #3f4c6b60, #606c8860);
    background-size: 200%;
    font-size: 50px;
    z-index: 4;
    border-bottom-right-radius: 5px;
    border-bottom-left-radius: 5px;
    margin-top: 10px;
    &:hover {
      animation: streamer 10s linear infinite;
    }
    i {
      margin: 0 30px;
      color: #f47245;

      &:hover {
        color: #429fff;
        transition: all 0.3s;
      }
    }
    #progressBar {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 10px;
      border-radius: 5px;
      background-size: 100% 10px;
      background-color: rgba(255, 255, 255, 0.2);
      &:hover #pgIcon {
        animation: streamer 2s linear infinite;
      }
      #pgIcon {
        position: relative;
        width: 0%; //进度条
        height: 10px;
        border-radius: 5px;
        top: 0;
        left: 0;
        background-image: linear-gradient(
          90deg,
          rgb(255, 167, 69),
          rgb(254, 134, 159),
          rgb(239, 122, 200),
          rgb(160, 131, 237),
          rgb(67, 174, 255),
          rgb(160, 131, 237),
          rgb(239, 122, 200),
          rgb(254, 134, 159),
          rgb(255, 167, 69)
        );
        background-size: 200%;

        img {
          position: absolute;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          top: 0;
          left: 98%;
          transform: translateY(-25%);
        }
      }
    }
  }

  @keyframes streamer {
    0% {
      background-position: 0%;
    }

    100% {
      background-position: 200%;
    }
  }

  @keyframes move {
    0% {
      transform: rotate(-25deg);
      transform-origin: 0% 0%;
    }
    100% {
      transform: rotate(0deg);
      transform-origin: 0% 0%;
    }
  }
  .move {
    animation: move 1.5s linear forwards;
  }
  @keyframes remove {
    0% {
      transform: rotate(0deg);
      transform-origin: 0% 0%;
    }
    100% {
      transform: rotate(-25deg);
      transform-origin: 0% 0%;
    }
  }
  .remove {
    animation: remove 1.5s linear forwards;
  }

  @keyframes mover {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  .mover {
    animation: mover 4s infinite linear;
  }
}
</style>
