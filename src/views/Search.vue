<template>
  <div class="home">
    <!-- 搜索框 -->
    <div class="box">
      <!-- @change="searchInput" -->
      <el-input placeholder="搜你想听的歌曲!" v-model="input" clearable :autofocus="true" @change="searchInput"> </el-input>
      <el-select v-model="value" placeholder="请选择" @change="changeOrigin">
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
      options: [
        {
          value: "A",
          label: "网易云",
        },
        // {
        //   value: "C",
        //   label: "网易云",
        // },
        // {
        //   value: "Q",
        //   label: "QQ",
        // },
        {
          value: "B",
          label: "VIP解析",
        },
      ],
      value: "B",
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
        // 发起请求 // 加载图标
        let loadingInstance = Loading.service({ lock: true, text: "疯狂加载中...", background: "rgba(0, 0, 0, 0.7)" });

        let res = await this.$http.get(`https://dataiqs.com/api/kgmusic/?msg=${this.input}&type=mv&count=20`);

        this.songs = res.data.data;
        let array = []; //缓冲数组
        // 给songs添加一个src
        this.songs.forEach(async (item, index) => {
          let imgData = await this.$http.get(`https://dataiqs.com/api/kgmusic/?msg=${this.input}&type=mv&count=20&n=${index}`);
          item.src = imgData.data.data.mv_url;
          item.picUrl = imgData.data.data.cover_url;
          item.lyric = "[00:00.00]木有歌词哦";
          if (item.src) {
            array.push(item);
          }
        });
        this.songs = array;
        // 等待数据加载
        // setTimeout(() => {
        // 关闭加载图标
        loadingInstance.close();
        // console.log(this.songs);
        // }, 2000);

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
        // --------------------------------------
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
