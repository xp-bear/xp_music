<template>
  <div class="Comment">
    <el-card>
      <h2 style="border-bottom: 1px solid #ccc">精彩评论</h2>
      <div class="commentItem" v-for="item in comments">
        <div class="left"><img :src="item.user.avatarUrl" alt="" /></div>
        <div class="right">
          <span>{{ item.user.nickname }}</span>
          <span>{{ item.timeStr }}</span>
          <p>{{ item.content }}</p>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: ["comments"],
};
</script>

<style lang="less" scoped>
.Comment {
  width: 800px;
  margin: 5px auto 0;
  text-align: left;
  .commentItem {
    display: flex;
    justify-content: space-between;
    padding: 10px 0;
    // border-bottom: 1px solid #ccc;
    .left {
      width: 38px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      img {
        width: 38px;
        height: 38px;
        border-radius: 50%;
      }
    }
    .right {
      display: flex;
      flex-direction: column;
      width: 100%;
      padding-left: 20px;
      span {
        color: #999;
        font-size: 14px;
        line-height: 1.16e;
      }
    }
  }
}
</style>
