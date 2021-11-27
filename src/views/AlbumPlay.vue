<template>
  <div class="AlbumPlay">
    <!-- 返回 -->
    <div class="back" @click="toBack">
      <i class="el-icon-back"></i>
    </div>
    <!-- 专辑歌曲列表 -->
    <ArtList :songs="albums" :show="true" class="top" />
    <!-- 评论  -->
    <Comment :comments="comments" />
  </div>
</template>

<script>
import ArtList from "@/components/ArtList";
import Comment from "@/components/Comment";
export default {
  name: "Album",
  data() {
    return {
      albums: [], //专辑歌曲
      comments: [], //歌曲评论
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
    // console.log(this.albums);

    let cres = await this.$http.get(`http://123.207.32.32:9001/comment/album?id=${this.$route.query.aid}`);
    this.comments = cres.data.comments;
    console.log(this.comments);
  },
  components: {
    ArtList,
    Comment,
  },
};
</script>

<style lang="less" scoped>
.AlbumPlay {
  .top {
    position: relative;
  }
  .back {
    position: absolute;
    top: 10px;
    left: 20.5%;
    width: 40px;
    height: 40px;
    text-align: center;
    line-height: 40px;
    border: 1px solid #ccc;
  }
}
</style>
