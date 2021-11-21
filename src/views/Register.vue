<template>
  <div class="Login">
    <!-- 遮罩层 -->
    <div class="mask" id="animation"></div>
    <el-card id="animation">
      <h2 class="Gradual" style="text-align: center">欢迎注册--熊仔音乐</h2>
      <el-form :status-icon="true" :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item :show-message="false" label="您的昵称" prop="nickname">
          <el-input v-model="ruleForm.nickname"></el-input>
        </el-form-item>

        <el-form-item :show-message="false" label="您的邮箱" prop="email" class="emailcheckd">
          <el-input v-model="ruleForm.email"></el-input>
          <el-button type="warning" @click="toSendMessage" :disabled="isDisabled">{{ istext || "发送验证码" }}</el-button>
        </el-form-item>
        <el-form-item :show-message="false" label="邮箱验证码" prop="checkEmail">
          <el-input v-model="ruleForm.checkEmail"></el-input>
        </el-form-item>
        <el-form-item :show-message="false" label="密码" prop="pass">
          <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item :show-message="false" label="确认密码" prop="checkPass">
          <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">注册用户</el-button>
          <el-button type="info"><router-link to="/login" style="color: #fff">已有账号,去登录</router-link></el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Register",
  data() {
    let checkNickname = (rule, value, callback) => {
      if (!value) {
        callback(this.$message.error({ message: "昵称不可以为空!", duration: 1000, showClose: true }));
      } else {
        return callback();
      }
    };
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
    let validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(this.$message.error({ message: "请再次输入密码!", duration: 1000, showClose: true }));
      } else if (value !== this.ruleForm.pass) {
        callback(this.$message.error({ message: "两次输入密码不一致!", duration: 1000, showClose: true }));
      } else {
        return callback();
      }
    };
    let Email = (rule, value, callback) => {
      let reg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (!value) {
        // callback(this.$message.error({ message: "邮箱不可以为空!", duration: 1000, showClose: true }));
      } else if (reg.test(value) == false) {
        // return callback(this.$message.error({ message: "请输入正确的邮箱地址!", duration: 1000, showClose: true }));
      } else {
        this.isDisabled = false;
        return callback();
      }
    };
    let checkEmail = (rule, value, callback) => {
      if (!value) {
        callback(this.$message.error({ message: "请输入邮箱验证码", duration: 1000, showClose: true }));
        return;
      } else {
        return callback();
      }
    };
    return {
      ruleForm: {
        pass: "",
        checkPass: "",
        nickname: "",
        email: "",
        checkEmail: "",
      },
      rules: {
        pass: [{ validator: validatePass, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }],
        nickname: [{ validator: checkNickname, trigger: "blur" }],
        email: [{ validator: Email, trigger: "change" }],
        checkEmail: [{ validator: checkEmail, trigger: "blur" }],
      },
      isDisabled: true, //是否禁用
      istext: "", //验证码文字倒计时
      verification: "", //验证码
    };
  },
  methods: {
    //   注册按钮
    submitForm(formName) {
      // 先验证验证码
      console.log("表单验证码", this.ruleForm.checkEmail);
      console.log("服务器验证码", this.verification);
      if (this.ruleForm.checkEmail.toLowerCase() !== this.verification.toLowerCase()) {
        return this.$message({ message: "验证码不正确", showClose: true, type: "error" });
      }

      // 在验证邮箱是都已经注册
      this.$http.post("/signup/judge", { type: "email", data: this.ruleForm.email }).then((res) => {
        console.log(res.data);
        if (res.data.result != 0) {
          return this.$message({ message: "该邮箱已经被注册过!", showClose: true, type: "error" });
        } else {
          // 剩下在验证表单
          this.$refs[formName].validate((valid) => {
            if (valid) {
              //布尔值
              this.$http
                .post("/signup/add", {
                  name: this.ruleForm.nickname,
                  email: this.ruleForm.email,
                  pwd: this.ruleForm.pass,
                })
                .then((res) => {
                  console.log(res.data);
                  this.$message({ message: res.data.msg, showClose: true, type: "success" });
                  if (res.data.code == 200) {
                    //注册成功跳转登录页面
                    this.$router.push({ path: "/login" });
                  }
                });
            } else {
              this.$message.error({ message: "表单信息不完整!", duration: 1000, showClose: true });
              return false;
            }
          });
        }
      });
    },
    // 验证码
    toSendMessage() {
      // 发送请求
      this.$http
        .post("/email", {
          email: this.ruleForm.email,
        })
        .then((res) => {
          console.log(res.data);
          this.verification = res.data.info_code; //保存验证码

          this.$message({ message: res.data.msg, showClose: true, type: "success" });
        });

      // 验证码倒计时
      let conunt = 60; //倒计时的时间

      let timer = setInterval(() => {
        conunt--;
        // console.log(conunt);
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
  -webkit-animation: bounce 1s 0.2s ease both;
  -moz-animation: bounce 1s 0.2s ease both;
}
@-webkit-keyframes bounce {
  0%,
  20%,
  50%,
  80%,
  100% {
    -webkit-transform: translateY(0);
  }
  40% {
    -webkit-transform: translateY(-30px);
  }
  60% {
    -webkit-transform: translateY(-15px);
  }
}
@-moz-keyframes bounce {
  0%,
  20%,
  50%,
  80%,
  100% {
    -moz-transform: translateY(0);
  }
  40% {
    -moz-transform: translateY(-30px);
  }
  60% {
    -moz-transform: translateY(-15px);
  }
}
</style>
