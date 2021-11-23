<template>
  <div class="Login">
    <!-- 遮罩层 -->
    <div class="mask" id="animation"></div>
    <el-card id="animation">
      <h2 class="Gradual" style="text-align: center">登录--熊仔音乐</h2>
      <el-form :hide-required-asterisk="true" :status-icon="true" :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item :show-message="false" label="您的QQ邮箱" prop="email">
          <el-input v-model="ruleForm.email" @input="tipEmail"> </el-input>
          <div class="tipEmail" v-show="isshowEmail" @click="selectEmail">{{ ruleForm.email + "@qq.com" }}</div>
        </el-form-item>

        <el-form-item :show-message="false" label="您的密码" prop="pass">
          <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
          <el-button type="info"><router-link to="/register" style="color: #fff">没有账号,去注册</router-link></el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    let validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(this.$message.error({ message: "请输入密码!", duration: 1000, showClose: true }));
      } else if (value.length < 6 || value.length > 18) {
        callback(this.$message.error({ message: "密码的长度应该在6-18位之间!", duration: 1000, showClose: true }));
      } else {
        if (this.ruleForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        return callback();
      }
    };

    let Email = (rule, value, callback) => {
      let reg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (!value) {
        callback(this.$message.error({ message: "邮箱不可以为空!", duration: 1000, showClose: true }));
      } else if (reg.test(value) == false) {
        // return callback(this.$message.error({ message: "请输入正确的邮箱地址!", duration: 1000, showClose: true }));
      } else {
        return callback();
      }
    };

    return {
      ruleForm: {
        pass: "",
        email: "",
      },
      rules: {
        pass: [{ validator: validatePass, trigger: "blur" }],
        email: [{ validator: Email, trigger: "blur" }],
      },
      isDisabled: false, //是否禁用
      isshowEmail: false, //邮箱后缀提示
    };
  },

  methods: {
    //   登录
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        //   登录成功
        if (valid) {
          this.$http
            .post("/signin/match", {
              data: this.ruleForm.email,
              pwd: this.ruleForm.pass,
            })
            .then((res) => {
              if (res.data.code == 200) {
                this.$message({ message: res.data.msg, showClose: true, type: "success", duration: 1000 });
                //   本地存储
                localStorage.setItem("user", JSON.stringify(res.data.back));
                this.$router.push({ path: "/" });
              } else {
                this.$message({ message: res.data.msg, showClose: true, type: "error", duration: 1000 });
              }
            });
        } else {
          // console.log("error submit!!");
          return false;
        }
      });
    },
    // 邮箱后缀提示
    tipEmail() {
      if (this.ruleForm.email.length > 0) {
        this.isshowEmail = true;
        if (this.ruleForm.email.indexOf("@") !== -1) {
          this.isshowEmail = false;
        }
      } else {
        this.isshowEmail = false;
      }
    },
    // 选择邮箱
    selectEmail() {
      if (this.ruleForm.email.indexOf("@") == -1) {
        this.ruleForm.email = this.ruleForm.email + "@qq.com";
      }
      this.isshowEmail = false;
    },
  },
};
</script>

<style lang="less" scoped>
.Login {
  width: 700px;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
  margin-top: 100px;
  .mask {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    // filter: blur(5px);
    background-image: url("../assets/top.gif");
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    animation: bgmove 2s infinite linear;
  }
  .el-card {
    background-color: transparent;
    margin-top: 100px;
    margin: 20px;
    background-color: rgba(255, 255, 255, 0.7);
    h2 {
      margin-bottom: 20px;
    }
    .el-form {
      font-size: 20px;
      /deep/.emailcheckd .el-form-item__content {
        width: 84%;
        display: flex;
      }
      /deep/.el-form-item__label {
        font-weight: 700;
      }
      .tipEmail {
        background-color: #fff;
        border-radius: 5px;
        padding: 0 15px;
        cursor: pointer;
        &:hover {
          background-color: rgba(255, 255, 255, 0.7);
          transition: all 0.5s;
        }
      }
    }
  }
}

// 背景动画
@-webkit-keyframes bgmove {
  0% {
    background-position: 0% 0%;
  }
  100% {
    background-position: 0% 100%;
  }
}

// 弹起动画
#animation {
  -webkit-animation: bounceIn 1s 0.2s ease both;
  -moz-animation: bounceIn 1s 0.2s ease both;
}
@-webkit-keyframes bounceIn {
  0% {
    opacity: 0;
    -webkit-transform: scale(0.3);
  }
  50% {
    opacity: 1;
    -webkit-transform: scale(1.05);
  }
  70% {
    -webkit-transform: scale(0.9);
  }
  100% {
    -webkit-transform: scale(1);
  }
}
@-moz-keyframes bounceIn {
  0% {
    opacity: 0;
    -moz-transform: scale(0.3);
  }
  50% {
    opacity: 1;
    -moz-transform: scale(1.05);
  }
  70% {
    -moz-transform: scale(0.9);
  }
  100% {
    -moz-transform: scale(1);
  }
}
</style>
