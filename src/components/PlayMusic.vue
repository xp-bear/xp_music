<template>
  <div class="playMusic">
    <!-- 动的旋转的音乐转盘 -->
    <div class="bg"><img :src="misicImg" alt="" /></div>
    <div class="playContent">
      <img :class="this.isPlay ? 'move' : 'remove'" src="../assets/needle-ab.png" alt="" />
      <img ref="moveBg" class="mover" src="../assets/bg.png" alt="" />
      <img ref="moveImg" class="mover" :src="misicImg" alt="" />
    </div>

    <!-- 播放条 按钮 -->
    <div class="bt-list">
      <i class="iconfont icon-xunhuanbofang" @click="isloop" :class="isLoop == true ? '' : 'active'"></i>

      <i class="el-icon-d-arrow-left" @click="micChange(-1)"></i>
      <i :class="this.isPlay ? 'el-icon-video-pause' : 'el-icon-video-play'" @click="toPlay"></i>

      <i class="el-icon-d-arrow-right" @click="micChange(+1)"></i>
      <i class="iconfont icon-danquxunhuan" @click="isloop" :class="isLoop == true ? 'active' : ''"></i>
      <!-- 歌曲进度条 -->
      <div id="progressBar" @click="speed">
        <div id="pgIcon" ref="speedprocess">
          <img src="../assets/rocket.png" />
        </div>
      </div>
      <div class="pro-info">
        <span style="margin-left: 10px">{{ cur | musicTime }}</span> <br />
        <span style="margin-right: 10px">{{ total | musicTime }}</span>
      </div>
    </div>
    <div class="block">
      <el-slider v-model="volume" :show-tooltip="false" vertical height="200px" @input="justVolume"></el-slider>
      <span>{{ volume }}&nbsp;%</span>
    </div>
    <audio :src="musicUrl" :autoplay="isPlay && 'autoplay'" ref="audio" :loop="isLoop"></audio>
  </div>
</template>
<script>
import { Message } from "element-ui";
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";
export default {
  data() {
    return {
      isPlay: true, //是否播放
      newId: 0, //新歌曲id
      newUrl: "",
      newNmae: "",
      cur: 0,
      total: 0,
      timer: null,
      speeds: 0, //歌曲进度
      volume: this.$store.state.volume,
      copymusicUrl: "true", //歌曲url copy
      isLoop: false, //歌曲是否循环
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
        return this.$message({ message: "当前歌曲暂无资源!", type: "error", showClose: true, duration: 0 });
      }
    }, 500);

    // enterKeyup//监听空格事件
    this.enterKeyup();

    //保存volume音量数据
    // console.log("音量: ", this.volume);
    // 先从localstorage中读取数据
    let num = parseInt(localStorage.getItem("sound"));
    if (num) {
      this.$store.commit("updateColume", num);
      this.volume = num;
    }
  },

  props: ["musicUrl", "misicImg", "playsongs", "mid"],
  filters: {
    // 处理时间格式
    musicTime(val) {
      val = Math.floor(val);
      if (val <= 0) {
        return "";
      } else {
        let minute = Math.floor(val / 60);
        let second = Math.floor(val % 60);
        second = second < 10 ? "0" + second : second;
        return minute + "分" + second + "秒";
      }
    },
  },
  methods: {
    // 调整音乐声音大小
    justVolume(value) {
      this.$store.commit("updateColume", value);
      this.$refs.audio.volume = this.volume / 100;
      // 保存数据到localstorage中
      localStorage.setItem("sound", this.volume);
    },
    //播放按钮
    toPlay() {
      if (this.isPlay) {
        this.$refs.audio.pause();
        this.$refs.moveBg.style.animationPlayState = "paused";
        this.$refs.moveImg.style.animationPlayState = "paused";
      } else {
        this.$refs.audio.play();
        this.$refs.moveBg.style.animationPlayState = "running";
        this.$refs.moveImg.style.animationPlayState = "running";
      }
      this.isPlay = !this.isPlay;
    },
    // 上下首歌曲切换
    micChange(counter) {
      this.$message.closeAll()
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
      } else if (this.playsongs[num + counter].hasOwnProperty("al")) {
        this.newUrl = this.playsongs[num + counter].al.picUrl;
      } else {
        this.newUrl = this.playsongs[num + counter].simgUrl;
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
    // 歌曲播放模式
    isloop() {
      this.isLoop = !this.isLoop;
      if (this.isLoop == true) {
        console.log(this.cur, this.total);
        this.$message({ message: "切换为: 单曲循环", type: "warning", duration: 2000 });
      } else {
        this.$message({ message: "切换为: 循环播放", type: "warning", duration: 2000 });
      }
    },
    //销毁空格事件
    enterKeyupDestroyed() {
      document.removeEventListener("keyup", this.enterKey);
    },
    // 监听空格事件
    enterKeyup() {
      document.addEventListener("keyup", this.enterKey);
    },
    enterKey(e) {
      // console.log(e.key);
      if (e.key == " ") {
        this.toPlay();
      } else if (e.key == "ArrowLeft") {
        this.micChange(-1);
      } else if (e.key == "ArrowRight") {
        this.micChange(1);
      } else if (e.key == "ArrowUp") {
        // 增加音量
        this.$store.commit("updateColume", 1);
        this.volume++;
        localStorage.setItem("sound", this.volume);
      } else if (e.key == "ArrowDown") {
        // 减小音量
        if (this.volume > 0) {
          this.volume--;
          this.$store.commit("updateColume", -1);
          localStorage.setItem("sound", this.volume);
        }
      }
    },
  },
  watch: {
    // 自动切换下一首歌曲
    cur(newVal, oldVal) {
      if (this.isLoop == false) {
        if (newVal.toFixed(0) == this.total.toFixed(0)) {
          // console.log("我进来了");
          this.micChange(1);
        }
      }
    },
  },
  destroyed() {
    clearInterval(this.timer);
    // 销毁空格事件
    this.enterKeyupDestroyed();
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
    span {
      display: flex;
      width: 38px;
      justify-content: center;
      position: absolute;
      bottom: -25px;
      right: 0px;
      color: #fff;
      font-family: xp;
      text-align: center;
    }
  }
  .bg {
    position: absolute;
    width: 100%;
    height: 100%;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
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
    z-index: 4;
    border-bottom-right-radius: 5px;
    border-bottom-left-radius: 5px;
    margin-top: 10px;
    &:hover {
      animation: streamer 10s linear infinite;
    }
    i {
      margin: 0 28px;
      color: #f47245;
      font-size: 37px;

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
    .active {
      color: red;
    }
    .pro-info {
      display: flex;
      width: 100%;
      position: absolute;
      top: 0;
      justify-content: space-between;
      align-items: center;
      z-index: -1;
      font-size: 18px;
      font-family: xp;
      color: #fff;
      text-shadow: 0px 0px 1px #ccc;
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
</style>
