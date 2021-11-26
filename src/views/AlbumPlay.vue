<template>
  <div class="AlbumPlay">
    <!-- 返回 -->
    <div class="back" @click="toBack">
      <i class="el-icon-back"></i>
    </div>
    <ArtList :songs="albums" :show="true" />
  </div>
</template>

<script>
import ArtList from "@/components/ArtList";
export default {
  name: "Album",
  data() {
    return {
      albums: [],
    };
  },

  methods: {
    // 返回
    toBack() {
      this.$router.go(-1);
    },
  },
  async mounted() {
    let res = await this.$http.get(`http://123.207.32.32:9001/album?id=${this.$route.query.aid}`);
    this.albums = res.data.songs;
    console.log(this.albums);
  },
  components: {
    ArtList,
  },
};
</script>

<style lang="less" scoped>
.AlbumPlay {
  position: relative;
  .back {
    position: absolute;
    top: 0;
    left: 315px;
    width: 40px;
    height: 40px;
    text-align: center;
    line-height: 40px;
    border: 1px solid #ccc;
  }
}
</style>
