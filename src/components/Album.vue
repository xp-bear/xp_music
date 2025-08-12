<template>
  <div class="Album">
    <div class="a-list" v-for="item in albums" :key="item.id">
      <div class="a-item" @click="toAlbumDetail(item.id)">
        <img :src="item.picUrl" alt="" />
      </div>
      <div class="a-title">
        <span class="eclipsis">{{ item.name }}</span>
        <span>{{ item.publishTime | famter }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: ["albums"],
  filters: {
    famter(val) {
      let time = new Date(val);
      let years = time.getFullYear();
      let months = time.getMonth();
      let days = time.getDay();
      return `${years}.${months}.${days}`;
    },
  },
  methods: {
    toAlbumDetail(aid) {
      // console.log(aid);
      // this.$mb.alert("音乐专辑正在开发中,请耐心等待!", { confirmButtonText: "确定" });
      this.$router.push({ path: "/album", query: { aid: aid } });
    },
  },
};
</script>

<style lang="less" scoped>
.Album {
  display: flex;
  flex-wrap: wrap;

  .a-list {
    background-color: #fff;
    margin-bottom: 20px;
    width: 20%;
    .a-item {
      width: 145px;
      height: 125px;
      background-color: pink;
      background: url("../assets/coverall.png") no-repeat 71% 62%;
      img {
        width: 120px;
        height: 120px;
      }
    }
    .a-title {
      display: flex;
      flex-direction: column;
      width: 145px;
      span {
        &:nth-child(2) {
          font-size: 12px;
          color: #666;
        }
      }
    }
  }
}
</style>
