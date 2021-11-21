<template>
  <div class="Login">
    <!-- 遮罩层 -->
    <div class="mask" id="animation"></div>
    <el-card id="animation">
      <h2 class="Gradual" style="text-align: center">登录--熊仔音乐</h2>
      <el-form :status-icon="true" :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item :show-message="false" label="您的邮箱" prop="email">
          <el-input v-model="ruleForm.email"></el-input>
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
        return callback(this.$message.error({ message: "请输入正确的邮箱地址!", duration: 1000, showClose: true }));
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
      istext: "",
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
              //   本地存储
              localStorage.setItem("user", JSON.stringify(res.data.back));
              this.$message({ message: res.data.msg, showClose: true, type: "success" });
              if (res.data.code == 200) {
                this.$router.push({ path: "/" });
              }
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 验证码
    toSendMessage() {
      let conunt = 60; //倒计时的时间

      let timer = setInterval(() => {
        conunt--;
        console.log(conunt);
        this.isDisabled = true;
        this.istext = "倒计时 " + conunt + " 秒";
        if (conunt <= 0) {
          clearInterval(timer);
          this.isDisabled = false;
          this.istext = "发送验证码";
        }
      }, 1000);
    },
  },
};
</script>

<style lang="less" scoped>
.Login {
  width: 700px;
  margin: 0 auto;
  position: relative;
  .mask {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    filter: blur(5px);
    background-size: cover;
  }
  .el-card {
    background-color: transparent;
    margin-top: 100px;
    h2 {
      margin-bottom: 20px;
    }
    .el-form {
      font-size: 20px;
      /deep/.emailcheckd .el-form-item__content {
        width: 84%;
        display: flex;
      }
    }
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
