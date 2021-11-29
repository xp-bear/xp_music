<template>
  <div class="User">
    <!-- 返回 -->
    <div class="back" @click="toBack">
      <i class="el-icon-back"></i>
    </div>
    <!-- 用户信息顶部 -->
    <div class="u-header">
      <div class="u-left">
        <img src="../assets/avatar.png" alt="" />
      </div>
      <div class="u-right">
        <div class="name">
          <h3>{{ userInfo.name }}</h3>
          <!-- 性别展示 -->
          <!-- <i class="el-icon-male"></i> -->
          <i class="el-icon-female" style="color: #cc5476"></i>
          <el-button size="small" type="warning" class="poepleOne" @click="editUser">编辑个人资料</el-button>
        </div>
        <div class="dynamic">
          <span><strong>0</strong> <i>动态</i></span>
          <span><strong>3</strong><i>关注</i></span>
          <span><strong>2</strong><i>粉丝</i></span>
        </div>
        <div class="location">所在地区：湖北省-武汉市</div>
        <div class="network">社交网络: 熊仔音乐,社交网络!</div>
      </div>
    </div>
    <!-- 用户听歌排行 -->
    <div class="u-topList">
      <div class="u-title">
        <span>听歌排行</span>
        <span>累积听歌{{ songs.length }}首</span>
      </div>
      <!-- 歌单列表 -->
      <UserList :songs="songs" :show="true" />
    </div>
  </div>
</template>

<script>
import UserList from "@/components/UserList";
export default {
  name: "User",
  data() {
    return {
      userInfo: {},
      songs: [], //播放历史的歌曲
    };
  },
  mounted() {
    this.userInfo = JSON.parse(localStorage.getItem("user"));
    // 拿到播放过的歌曲
    this.songs = JSON.parse(localStorage.getItem("likeSongs"));
  },
  methods: {
    // 返回
    toBack() {
      this.$router.go(-1);
    },
    // 编辑用户信息
    editUser() {
      this.$mb.alert("编辑用户信息正在开发中!", "注意", { confirmButtonText: "确定" });
    },
  },
  components: {
    UserList,
  },
};
</script>

<style lang="less" scoped>
.User {
  width: 980px;
  margin: 0 auto;
  padding: 40px;
  background-color: #fff;
  box-shadow: 0 0 3px #ccc;
  position: relative;
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
  .u-header {
    display: flex;
    justify-content: space-between;
    .u-left {
      border: 1px solid #ccc;
      padding: 3px;
      img {
        width: 180px;
        height: 180px;
      }
    }
    .u-right {
      width: 670px;
      color: #666;
      font-size: 14px;
      .name {
        display: flex;
        align-items: center;
        h3 {
          font-size: 22px;
          font-weight: normal;
          color: #000;
        }
        i {
          font-size: 26px;
          color: #53baeb;
          font-weight: 700;
          margin-left: 10px;
        }
        .poepleOne {
          margin-left: auto;
        }
      }
      .dynamic {
        display: flex;
        margin-top: 10px;
        span {
          width: 66px;
          margin-right: 40px;
          display: flex;
          flex-direction: column;
          font-size: 12px;
          strong {
            font-size: 26px;
          }
        }
      }
      .location {
        line-height: 1.16e;
        margin: 10px 0;
      }
    }
  }
  .u-topList {
    width: 900px;
    // background-color: pink;
    margin-top: 40px;
    .u-title {
      border-bottom: 2px solid #c20c0c;
      span {
        color: #666;
        &:nth-child(1) {
          font-size: 24px;
        }
        &:nth-child(2) {
          font-size: 12px;
          margin-left: 10px;
        }
      }
    }
    .List {
      width: 900px;
    }
  }
}
</style>
