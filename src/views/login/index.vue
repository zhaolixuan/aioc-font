<template>
  <div class="login">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form">
      <p class="title" style="font-size: .3rem;">{{ sysName }}</p>
      <el-form-item prop="username">
        <el-input v-model="loginForm.username" type="text" auto-complete="off" placeholder="账号">
          <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon" />
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input v-model="loginForm.password" type="password" auto-complete="off" placeholder="密码"
          @keyup.enter.native="handleLogin">
          <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" />
        </el-input>
      </el-form-item>
    
      <el-checkbox v-model="loginForm.rememberMe" style="margin:0px 0px 25px 0px;">记住密码</el-checkbox>
      <el-form-item style="width:100%;">
        <el-button :loading="loading" size="medium" type="primary" style="width:100%;"
          @click.native.prevent="handleLogin">
          <span v-if="!loading">登 录</span>
          <span v-else>登 录 中...</span>
        </el-button>
        <div style="float: right;" v-if="register">
          <router-link class="link-type" :to="'/register'">立即注册</router-link>
        </div>
      </el-form-item>
    </el-form>
    <!--  底部  -->
    <div class="el-login-footer">
      <span>Copyright © 2018-2023 mounttai All Rights Reserved.</span>
    </div>
  </div>
</template>

<script>
import { getCodeImg,login,clogin } from "@/api/login";
import Cookies from "js-cookie";
import { encrypt, decrypt } from '@/utils/jsencrypt'
import { setToken } from '@/utils/auth'
import api from "@/api/api";

export default {
  name: "Login",
  data() {
    return {
      codeUrl: "",
      loginForm: {
        username: "",
        password: "",
        rememberMe: false,
        uuid: "",
        url: "ws://127.0.0.1:8080/websocket/message",
        message: "",
        text_content: "",
        ws: null,
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", message: "请输入您的账号" }
        ],
        password: [
          { required: true, trigger: "blur", message: "请输入您的密码" }
        ],
      },
      loading: false,
      // 验证码开关
      captchaEnabled: true,
      // 注册开关
      register: false,
      redirect: undefined,
      sysName:''

    };
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  created() {
    this.getSysName()
    // this.getCode();
    this.getCookie();
  },
  methods: {
    getSysName() {
      api.getSysName().then(res => {
        this.sysName = res.msg
      })
    },
    getCode() {
      getCodeImg().then(res => {
        this.captchaEnabled = res.captchaEnabled === undefined ? true : res.captchaEnabled;
        if (this.captchaEnabled) {
          this.codeUrl = "data:image/gif;base64," + res.img;
          this.loginForm.uuid = res.uuid;
        }
      });
    },
    getCookie() {
      const rememberMe = Cookies.get('rememberMe')
      this.loginForm.rememberMe=  rememberMe === undefined ? false : Boolean(rememberMe)
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          if (this.loginForm.rememberMe) {
            Cookies.set('rememberMe', this.loginForm.rememberMe, { expires: 30 });
          } else {
            Cookies.remove('rememberMe');
          }
          let {username, password} = this.loginForm
          clogin(username, password).then(res => {
            setToken(res.token)
            this.$router.push({ path: this.redirect || "/" })
          }).catch(error => {
            this.loading = false;
            if (this.captchaEnabled) {
              // this.getCode();
            }
          })

        }
      });
    },
    // join() {
    //   const wsuri = this.url;
    //   this.ws = new WebSocket(wsuri);
    //   const self = this;
    //   this.ws.onopen = function (event) {
    //     self.text_content = self.text_content + "已经打开连接!" + "\n";
    //   };
    //   this.ws.onmessage = function (event) {
    //     self.text_content = event.data + "\n";
    //   };
    //   this.ws.onclose = function (event) {
    //     self.text_content = self.text_content + "已经关闭连接!" + "\n";
    //   };
    // },
    // exit() {
    //   if (this.ws) {
    //     this.ws.close();
    //     this.ws = null;
    //   }
    // },
    // send() {
    //   if (this.ws) {
    //     this.ws.send(this.message);
    //   } else {
    //     alert("未连接到服务器");
    //   }
    // },
  }
};
</script>

<style scoped lang="less">
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-image: url("~@/assets/image/login-background.jpg");
  background-size: cover;
}

.title {
  margin: 0px auto 30px auto;
  text-align: center;
  color: #707070;
}

.login-form {
  border-radius: 6px;
  background: #ffffff;
  width: 400px;
  padding: 25px 25px 5px 25px;
  display: flex;
  flex-direction: column;
  .el-input {
    height: 38px;

    input {
      height: 38px;
    }
  }

  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 2px;
  }
}

.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}

.login-code {
  width: 33%;
  height: 38px;
  float: right;

  img {
    cursor: pointer;
    vertical-align: middle;
  }
}

.el-login-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #fff;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}

.login-code-img {
  height: 38px;
}
</style>
