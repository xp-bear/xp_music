<template>
  <div class="home">
    <!-- 搜索框 -->
    <div class="box">
      <el-input placeholder="搜你想听的歌曲!" v-model="input" clearable :autofocus="true" @change="searchInput"> </el-input>
      <el-button type="primary" icon="el-icon-search" @click.trim="searchInput">搜索</el-button>
    </div>

    <!-- 卡片列表 -->
    <List :show="show" :songs="songs" @toLoading="toLoading" />
  </div>
</template>

<script>
import { Loading } from "element-ui";

import List from "@/components/List.vue";
import {MUSIC_API} from '@/config/index.js'
export default {
  name: "Search",
  data() {
    return {
      input: "",
      show: false,
      songs: [],
      timer: null,
    };
  },

  mounted() {
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
      if (this.input.length > 0) {
        this.show = true;
      } else {
        this.show = false;
        return;
      }
      // 发起请求
      // 加载图标
      let loadingInstance = Loading.service({ lock: true, text: "疯狂加载中...", background: "rgba(0, 0, 0, 0.7)" });
      let res = await this.$http.get(`${MUSIC_API}search?keywords=${this.input}`);

      this.songs = res.data.result.songs;

      // 给songs添加一个picurl
      this.songs.forEach(async (item) => {
        let imgData = await this.$http.get(`${MUSIC_API}song/detail?ids=${item.id}`);
        item.artists[0].picUrl = imgData.data.songs[0].al.picUrl;
      });

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

      // vuex的使用方式
      this.$store.commit("getValue", this.input);
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
    .el-input {
      margin-right: 5px;
      font-size: 16px;
    }
  }
}
</style>
