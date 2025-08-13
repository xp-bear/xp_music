<template>
  <div class="home">
    <!-- 搜索框 -->
    <div class="box">
      <!-- @change="searchInput" -->
      <el-input placeholder="搜你想听的歌曲!" v-model="input" clearable :autofocus="true" @change="searchInput"> </el-input>
      <el-select v-model="value" placeholder="请选择" @change="changeOrigin" :disabled="selectChangeOrigin">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
      </el-select>
      <el-button type="primary" icon="el-icon-search" @click.trim="searchInput" style="margin-left: 5px">搜索</el-button>
      <!-- 返回按钮 -->
      <div class="back" @click="toBack">
        <i class="el-icon-back"></i>
      </div>
    </div>

    <!-- 卡片列表 -->
    <List v-if="value == 'A'" :show="show" :songs="songs" @toLoading="toLoading" />
    <OtherApiList v-else :show="show" :songs="songs"></OtherApiList>
  </div>
</template>

<script>
import { Loading } from "element-ui";

import List from "@/components/List.vue";
import OtherApiList from "@/components/OtherApiList.vue";
import { MUSIC_API } from "@/config/index.js";
export default {
  name: "Search",
  data() {
    return {
      input: "",
      show: false,
      songs: [],
      timer: null,
      selectChangeOrigin: false, // 是否切换了请求源 状态
      options: [
        {
          value: "A",
          label: "网易云",
        },
        {
          value: "B",
          label: "QQ音源",
        },
        // {
        //   value: "C",
        //   label: "网易云",
        // },
        // {
        //   value: "Q",
        //   label: "QQ",
        // },
        // {
        //   value: "B",
        //   label: "VIP解析",
        // },
      ],
      value: "A",
    };
  },

  mounted() {
    // 测试接口
    this.$message.closeAll();
    // 传入搜索关键字
    if (this.$route.params.ipt) {
      this.input = this.$route.params.ipt;
      this.searchInput();
    }

    if (this.$route.query.val) {
      this.input = this.$route.query.val;
      this.searchInput();
    }
  },
  methods: {
    // 从歌词中提取最后一个时间标签，计算歌曲总时长
    getDurationFromLyric(lyric) {
      if (!lyric) return 0; // 如果没有歌词，返回0

      // 匹配所有时间标签，如 [03:38.19]
      const timeTags = lyric.match(/\[\d+:\d+\.\d+\]/g);
      if (!timeTags || timeTags.length === 0) return 0;

      // 取最后一个时间标签
      const lastTimeTag = timeTags[timeTags.length - 1];

      // 提取分钟、秒数（如 "03:38.19" → ["03", "38", "19"]）
      const [minutes, seconds] = lastTimeTag
        .replace(/[\[\]]/g, "") // 去掉方括号
        .split(":")
        .map((part) => parseFloat(part));

      // 计算总秒数（分钟*60 + 秒）
      const durationInSeconds = minutes * 60 + seconds;

      // 返回格式化字符串（如 "3:38"）
      const formattedMinutes = Math.floor(durationInSeconds / 60);
      const formattedSeconds = Math.floor(durationInSeconds % 60)
        .toString()
        .padStart(2, "0");

      return `${formattedMinutes}:${formattedSeconds}`;
    },
    // 切换请求源
    changeOrigin() {
      this.songs = [];
      this.searchInput();
      // dayinb
      // console.log("当前标签:", this.value);
    },
    // 加载更多
    toLoading() {
      let loadingInstance = Loading.service({ lock: true, text: "疯狂加载中...", background: "rgba(0, 0, 0, 0.7)" });
      this.$http.get(`${MUSIC_API}search?keywords=${this.input}&limit=30&offset=30`).then((res) => {
        // 给新情求的数据添加一个picurl
        res.data.result.songs.forEach((item) => {
          this.$http.get(`${MUSIC_API}song/detail?ids=${item.id}`).then((imgData) => {
            item.artists[0].picUrl = imgData.data.songs[0].al.picUrl;
          });
        });

        this.songs = [...this.songs, ...res.data.result.songs];
        // console.log("新请求的数据", res.data.result.songs);
      });
      loadingInstance.close();
    },

    async searchInput() {
      this.songs = [];
      if (this.input.length > 0) {
        this.show = true;
      } else {
        this.show = false;
        return;
      }
      // console.log(this.value);
      // 1.网易云数据
      if (this.value == "A") {
        // 发起请求 // 加载图标
        let loadingInstance = Loading.service({ lock: true, text: "疯狂加载中...", background: "rgba(0, 0, 0, 0.7)" });

        let res = await this.$http.get(`${MUSIC_API}search?keywords=${this.input}`);
        this.songs = res.data.result.songs;

        // 给songs添加一个picurl
        this.songs.forEach(async (item) => {
          let imgData = await this.$http.get(`${MUSIC_API}song/detail?ids=${item.id}`);
          item.artists[0].picUrl = imgData.data.songs[0].al.picUrl;
        });

        // console.log(this.songs);
        // 关闭加载图标
        loadingInstance.close();

        // 网络请求超时处理 5 秒
        this.timer = setTimeout(() => {
          this.$mb.alert("网络请求超时,请重试!", { confirmButtonText: "确定" });
          loadingInstance.close();
          return;
        }, 5000);
        // 请求到数据之后,清除定时器
        if (res) {
          clearTimeout(this.timer);
        }
        // ----------------------------------------
      } else if (this.value == "B") {
        // 发起请求，显示 Loading
        let loadingInstance = Loading.service({
          lock: true,
          text: "疯狂加载中...",
          background: "rgba(0, 0, 0, 0.7)",
        });

        try {
          this.selectChangeOrigin = true; // 禁止切换请求源
          // 1. 第一次请求：获取歌曲列表
          let res = await this.$http.get(`https://www.hhlqilongzhu.cn/api/dg_QQmusicflac.php?msg=${this.input}&type=json`);

          // 2. 遍历每首歌，获取详细信息（url、lyrics等）
          let songsWithDetails = [];
          for (const song of res.data.data) {
            try {
              // 对每首歌单独请求，获取详细信息
              let detailRes = await this.$http.get(`https://www.hhlqilongzhu.cn/api/dg_QQmusicflac.php?msg=${this.input}&type=json&n=${song.n}`);
              // console.log(`歌曲 ${song.song_title} 的详细信息:`, detailRes.data.data);

              // 合并数据（保留原信息，并添加 url、lyrics 等）
              songsWithDetails.push({
                ...song, // 保留原来的 song_title, song_singer 等
                url: detailRes.data.data.music_url, // 歌曲播放地址
                lyric: detailRes.data.data.lyric || "[00:00.00]VIP解析，暂无歌词！", // 歌词（如果没有则默认）
                picUrl: detailRes.data.data.cover, // 封面图（如果有）
                singer: detailRes.data.data.song_singer,
                duration: this.getDurationFromLyric(detailRes.data.data.lyric), // 计算歌曲总时长
              });
              // 3. 更新到 Vue 的 data 里
              this.songs = songsWithDetails;
              // console.log("获取到的歌曲列表:", this.songs);
              loadingInstance.close();
            } catch (error) {
              console.error(`获取歌曲 ${song.song_title} 详情失败:`, error);
            }
          }

          // 请求完成
          this.selectChangeOrigin = false; // 恢复切换请求源
        } catch (error) {
          console.error("请求失败:", error);
          this.$mb.alert("请求失败，请检查网络或重试！", { confirmButtonText: "确定" });
        } finally {
          // 无论成功或失败，都关闭 Loading
          loadingInstance.close();
        }
      } else if (this.value == "C") {
        // 发起请求 // 加载图标
        let loadingInstance = Loading.service({ lock: true, text: "疯狂加载中...", background: "rgba(0, 0, 0, 0.7)" });

        let res = await this.$http.get(`http://150.158.21.251:3500/search?platform=${this.value}&keyword=${this.input}&type=music&offset=0&limit=20`);
        this.songs = res.data;

        // console.log(this.Bsongs);
        // 给songs添加一个picurl
        this.songs.forEach(async (item) => {
          let imgData = await this.$http.get(`http://150.158.21.251:3500/play?mid=${item.mid}&type=music`);
          item.picUrl = imgData.data.img;
          item.src = imgData.data.src;
          item.lyric = imgData.data.lrc;
        });
        // 等待数据加载
        // setTimeout(() => {
        // 关闭加载图标
        loadingInstance.close();
        // }, 1200);

        // 网络请求超时处理 5 秒
        this.timer = setTimeout(() => {
          this.$mb.alert("网络请求超时,请重试!", { confirmButtonText: "确定" });
          loadingInstance.close();
          return;
        }, 5000);
        // 请求到数据之后,清除定时器
        if (res) {
          clearTimeout(this.timer);
        }
        // -----------------------------
      } else if (this.value == "Q") {
        // 发起请求 // 加载图标
        let loadingInstance = Loading.service({ lock: true, text: "疯狂加载中...", background: "rgba(0, 0, 0, 0.7)" });

        let res = await this.$http.get(`http://150.158.21.251:3500/search?platform=${this.value}&keyword=${this.input}&type=music&offset=0&limit=20`);
        this.songs = res.data;

        // console.log(this.Bsongs);
        // 给songs添加一个picurl
        this.songs.forEach(async (item) => {
          let imgData = await this.$http.get(`http://150.158.21.251:3500/play?mid=${item.mid}&type=music`);
          item.picUrl = imgData.data.img;
          item.src = imgData.data.src;
          item.lyric = imgData.data.lrc;
        });
        // 等待数据加载
        // setTimeout(() => {
        //   this.songs = this.songs;
        //   // console.log(this.songs);
        //   // 关闭加载图标
        // }, 1200);
        loadingInstance.close();
        // 网络请求超时处理 5 秒
        this.timer = setTimeout(() => {
          this.$mb.alert("网络请求超时,请重试!", { confirmButtonText: "确定" });
          loadingInstance.close();
          return;
        }, 5000);
        // 请求到数据之后,清除定时器
        if (res) {
          clearTimeout(this.timer);
        }
      }
      // vuex的使用方式
      this.$store.commit("getValue", this.input);
    },
    // 返回
    toBack() {
      this.$router.push({ path: "/" });
    },
  },

  watch: {
    input(newVal, oldVal) {
      if (newVal.length == 0) {
        this.show = false;
      }
    },
  },
  // 加载组件
  components: {
    List,
    OtherApiList,
  },
};
</script>

<style lang="less" scoped>
.home {
  position: relative;
  margin-top: 10px;

  .box {
    width: 800px;
    margin: 0 auto;
    display: flex;
    position: relative;
    .el-input {
      margin-right: 5px;
      font-size: 16px;
    }
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
  }
}
</style>
