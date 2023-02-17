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
          <span><strong>66</strong> <i>动态</i></span>
          <span><strong>32</strong><i>关注</i></span>
          <span><strong>2395</strong><i>粉丝</i></span>
        </div>
        <div class="location">所在地区: {{ province }}-{{ city }}--{{ district }}</div>
        <div class="network">社交网络: 熊仔是一种在线音乐服务,它还提供音乐下载、在线收听、在线播放等功能!</div>
        <div class="location">个性签名: 生活不止眼前的苟且，还有诗和远方!</div>
      </div>
    </div>
    <!-- 用户听歌排行 -->
    <div class="u-topList">
      <div class="u-title">
        <span>听歌排行</span>
        <span>累积听歌{{ songs.length }}首</span>
        <el-button type="danger" size="mini" class="clear-music" @click="clearMusic">清空全部歌曲</el-button>
      </div>
      <!-- 歌单列表 -->
      <UserList :songs="songs" :show="true" />
    </div>

    <!-- 修改信息对话框 -->
    <el-dialog title="用户信息修改" :visible.sync="dialogVisible" width="600px">
      <form class="userInfo">
        <div><span style="width: 100px">用户名</span> <el-input v-model="name"></el-input></div>
        <div><span style="width: 100px">性别</span> <el-input v-model="sex"></el-input></div>
        <div><span style="width: 100px">图像</span> <el-input v-model="picture"></el-input></div>
        <div><span style="width: 100px">个性签名</span> <el-input v-model="sign"></el-input></div>
        <el-button type="primary" style="display: block; margin-left: auto; margin-top: 10px" @click="currentUpdate">提交修改</el-button>
      </form>
    </el-dialog>
  </div>
</template>

<script>
import { MessageBox } from "element-ui";
import UserList from "@/components/UserList";

export default {
  name: "User",
  data() {
    return {
      userInfo: {},
      songs: [], //播放历史的歌曲
      dialogVisible: false,
      name: "", //用户名
      sign: "", //签名
      picture: "", //头像
      sex: "", //性别
      province: "", //省
      city: "", //市
      district: "", //区
    };
  },
  mounted() {
    this.getHistoryMusic();
    // 获取当前城市
    this.getCurrentCity();
  },

  methods: {
    // 利用百度地图API,获取用户定位
    getCurrentCity() {
      //根据用户IP 返回城市级别的定位结果
      let native = new BMap.LocalCity();
      native.get((res) => {
        // console.log(res);
        let gc = new BMap.Geocoder();
        let pointAdd = new BMap.Point(res.center.lng, res.center.lat);
        gc.getLocation(pointAdd, (rs) => {
          // 百度地图解析城市名
          // console.log(rs);
          this.province = rs.addressComponents.province;
          this.city = rs.addressComponents.city;
          this.district = rs.addressComponents.district;
        });
      });
    },
    //获取历史歌曲
    getHistoryMusic() {
      this.userInfo = JSON.parse(localStorage.getItem("user"));
      // 拿到播放过的歌曲
      this.songs = JSON.parse(localStorage.getItem("likeSongs")) || [];
    },
    // 返回
    toBack() {
      this.$router.go(-1);
    },
    // 编辑用户信息
    editUser() {
      let user = JSON.parse(localStorage.getItem("user"));
      this.dialogVisible = true;
      // console.log(user);
      this.name = user.name;
      // this.$mb.alert("编辑用户信息正在开发中!", "注意", { confirmButtonText: "确定" });
    },
    // 确认修改用户信息
    currentUpdate() {
      this.$mb.alert("用户信息修改正在开发中!", "注意", { confirmButtonText: "确定" });
    },
    // 清空所有歌曲
    clearMusic() {
      MessageBox.confirm("此操作将清空您的听歌历史, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$message({ type: "success", message: "删除成功!", showClose: true });
          localStorage.removeItem("likeSongs");
          this.getHistoryMusic();
        })
        .catch(() => {
          this.$message({ type: "info", message: "已取消删除", showClose: true });
        });
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
      .clear-music {
        float: right;
      }
    }
    .List {
      width: 900px;
    }
  }
  /deep/.el-dialog__body {
    padding-top: 0;
  }
  .userInfo {
    div {
      display: flex;
      align-items: center;
      height: 40px;
      margin: 10px 0px;

      span {
        height: 40px;
        line-height: 40px;
      }
    }
  }
}
</style>
