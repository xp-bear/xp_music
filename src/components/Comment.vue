<template>
  <div class="Comment">
    <el-card style="box-shadow: 0 0 0 transparent; border: 0; margin-top: -50px">
      <h2 style="border-bottom: 1px solid #ccc">精彩评论</h2>
      <div class="commentItem" v-for="item in comments">
        <!-- <div class="left"><img :src="item.user.avatarUrl" alt="" @click.stop="downImg(item.user.avatarUrl, item.user.nickname)" /></div> -->
        <div class="left"><img :src="item.user.avatarUrl" alt="" /></div>
        <div class="right">
          <span style="font-size: 14px; font-family: xp">{{ item.user.nickname }}&nbsp;&nbsp;&nbsp;&nbsp;{{ item.timeStr }}</span>

          <p style="font-family: consolas">{{ item.content }}</p>
        </div>
      </div>
    </el-card>
    <!-- 查看图片大图对话框  -->
    <el-dialog :visible.sync="userImgFlag" :title="userTitle" :destroy-on-close="true">
      <img :src="userImg" alt="" style="width: 100%" />
      <el-button type="primary" @click="downUserImg" style="margin-top: 10px">下载图片</el-button>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userImgFlag: false,
      userImg: "", //用户图片
      userTitle: "", //用户昵称
    };
  },
  props: ["comments"],
  methods: {
    // 根据url下载
    downRow(data, name, suffix) {
      let ajax = new XMLHttpRequest();
      ajax.open("GET", data, true);
      ajax.responseType = "blob";
      // ajx.withCredentials = true; //如果跨域
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

    downImg(imgUrl, imgTitle) {
      // console.log(imgUrl, imgTitle);
      this.userImgFlag = true;
      this.userImg = imgUrl;
      this.userTitle = imgTitle;
    },
    // 下载图片
    downUserImg() {
      this.downRow(this.userImg, this.userTitle, "jpg");
    },
  },
};
</script>

<style lang="less" scoped>
.Comment {
  width: 800px;
  margin: 0px auto 0;
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
