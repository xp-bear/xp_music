<template>
  <div class="Login">
    <!-- 遮罩层 -->
    <div class="mask" id="animation"></div>
    <el-card id="animation">
      <h2 style="text-align: center">密码找回</h2>
      <el-form :status-icon="true" :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item :show-message="false" label="您的邮箱" prop="email" class="emailcheckd">
          <div class="zoom">
            <el-input v-model="ruleForm.email" @input="tipEmail"></el-input>
            <el-button type="warning" @click="toSendMessage" :disabled="isDisabled">{{ istext || "发送验证码" }}</el-button>
          </div>

          <div class="tipEmail" v-show="isshowEmail" @click="selectEmail">{{ ruleForm.email + "@qq.com" }}</div>
        </el-form-item>

        <el-form-item :show-message="false" label="邮箱验证码" prop="checkEmail">
          <el-input v-model="ruleForm.checkEmail"></el-input>
        </el-form-item>
        <el-form-item :show-message="false" label="新密码" prop="pass">
          <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item :show-message="false" label="验证新密码" prop="checkPass">
          <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">确认找回密码</el-button>
          <el-button type="warning"><router-link to="/login" style="color: #fff">已有账号,去登录</router-link></el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "ForGet",
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
        email: "",
        checkEmail: "",
      },
      rules: {
        pass: [{ validator: validatePass, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }],
        email: [{ validator: Email, trigger: "change" }],
        checkEmail: [{ validator: checkEmail, trigger: "blur" }],
      },
      isDisabled: true, //是否禁用
      istext: "", //验证码文字倒计时
      verification: "", //验证码
      isshowEmail: false, //邮箱后缀提示
    };
  },
  methods: {
    //   注册按钮
    submitForm(formName) {
      // 先验证验证码
      // console.log("表单验证码", this.ruleForm.checkEmail);
      // console.log("服务器验证码", this.verification);
      if (this.ruleForm.checkEmail.toLowerCase() !== this.verification.toLowerCase()) {
        return this.$message({ message: "验证码不正确", showClose: true, type: "error" });
      }

      // 在验证邮箱是都已经注册
      this.$http.post("/signup/judge", { type: "email", data: this.ruleForm.email }).then((res) => {
        // console.log(res.data);
        if (res.data.result == 0) {
          return this.$message({ message: "该邮箱没有注册,请先注册!", showClose: true, type: "error" });
        } else {
          // 剩下在验证表单
          this.$refs[formName].validate((valid) => {
            if (valid) {
              //布尔值
              this.$http
                .post("/user/passwordupdate", {
                  email: this.ruleForm.email,
                  data: this.ruleForm.pass,
                })
                .then((res) => {
                  // console.log(res.data);
                  if (res.data.code == 200) {
                    this.$message({ message: res.data.msg, showClose: true, type: "success" });
                    //注册成功跳转登录页面
                    this.$router.push({ path: "/login" });
                  } else {
                    this.$message({ message: res.data.msg, showClose: true, type: "error" });
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
          let str = res.data.info_code;
          let result = str.split(".");
          result.pop();
          let code = "";
          result.forEach((item) => {
            code += String.fromCharCode(item);
          });
          this.verification = code; //保存验证码,对验证码进行解密
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
  margin-top: 70px;

  .mask {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    // filter: blur(2px);
    background-image: url("../assets/bg1.gif");
    background-repeat: no-repeat;
    background-position: center;

    // background: linear-gradient(to right, #4e54c8, #8f94fb);
    opacity: 0.6;
    border-radius: 10px;
    background-size: cover;
  }
  .el-card {
    background-color: transparent;
    margin-top: 100px;
    background-color: rgba(255, 255, 255, 0.7);
    margin: 20px;
    h2 {
      margin-bottom: 20px;
      color: transparent;
      font-size: 40px;
      font-weight: bold;
      background: linear-gradient(45deg, rgba(0, 173, 181, 1) 0%, rgba(0, 173, 181, 0.4) 100%);
      -webkit-background-clip: text;
    }
    .el-form {
      font-size: 20px;
      /deep/.emailcheckd .el-form-item__content {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        flex-direction: column;
        .zoom {
          display: flex;
          width: 100%;
        }
        &:nth-child(2) {
          width: 83%;
        }
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
