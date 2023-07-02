<template>
    <div class="login_bg">
      <div class="from_bg">
        <p class="title">
            周界预警监测系统
        </p>
        <p class="line"></p>
        <el-form :model="ruleForm"
                 status-icon
                 :rules="rules"
                 ref="ruleForm"
                 label-width="0.8rem"
                 class="demo-ruleForm">
  
          <el-form-item label="用户名"
                        prop="name">
            <el-input v-model.number="ruleForm.name"
                      placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item label="密码"
                        prop="pass">
            <el-input type="password"
                      v-model="ruleForm.pass"
                      placeholder="请输入密码"
                      autocomplete="off"></el-input>
          </el-form-item>
          <el-button type="primary"
                     @click="submitForm('ruleForm')">登录</el-button>
        </el-form>
      </div>
    </div>
  </template>
  
  <script>
  import { login } from '@/api/login'
  import { getToken, setToken } from '@/utils/token-util'
  
  export default {
    data() {
      var validateName = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入用户名'))
        } else {
          callback()
        }
      }
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'))
        } else {
          callback()
        }
      }
      return {
        ruleForm: {
          name: '',
          pass: '',
        },
        rules: {
          name: [{ validator: validateName, trigger: 'blur' }],
          pass: [{ validator: validatePass, trigger: 'blur' }],
        },
      }
    },
    created() {},
    mounted() {},
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$router.push({ path: '/' })
return
            let data = {
              account: this.ruleForm.name,
              password: this.ruleForm.pass,
            }
            login(data)
              .then((res) => {
                if (res.code == '00000') {
                  this.$message.success('成功')
                  setToken(res.data.token, true)
                  setTimeout(() => {
                    this.$router.push({ path: '/' })
                  }, 1000)
                } else {
                  this.$message.error(res.message)
                }
              })
              .catch((err) => {
                // console.log(err)
                //   this.$message.error(err)
              })
          } else {
            // console.log('error submit!!')
            return false
          }
        })
      },
    },
  }
  </script>
  
  <style scoped lang="less">
  .login_bg {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: url(~@/assets/img/login_bg.jpeg) no-repeat;
    background-size: cover;
  
    .from_bg {
      width: 6.97rem;
      height: 6.1rem;
      background: url(~@/assets/img/from_bg.png) no-repeat;
      background-size: cover;
      display: flex;
      flex-direction: column;
      align-items: center;
      // transform: translate(-50%, -50%);
      .title {
        background: linear-gradient(
          180deg,
          rgba(12, 171, 241, 1) 0%,
          rgba(255, 255, 255, 1) 67.82083511352539%
        );
        font-size: 0.52rem;
        font-family: JingDongLangZhengTi;
        font-weight: bold;
        color: transparent;
        -webkit-background-clip: text;
        margin-top: 0.8rem;
      }
      .line {
        width: 5.8rem;
        border: 1px solid;
        margin-top: 0.21rem;
        border-image: linear-gradient(
            270deg,
            rgba(0, 128, 255, 0) 0%,
            rgba(0, 212, 255, 1) 51.5625%,
            rgba(0, 128, 255, 0) 100%
          )
          2 2;
        box-sizing: border-box;
      }
      .demo-ruleForm {
        background: transparent;
        width: 3.44rem;
        margin-top: 0.89rem;
        position: relative;
  
        /deep/ .el-form-item {
          background: rgba(255, 255, 255, 1);
          border-radius: 0.04rem;
          height: 0.48rem;
          .el-form-item__label {
            height: 0.48rem;
            line-height: 0.48rem;
            font-size: 0.13rem;
            font-family: JDLangZhengTi;
            font-weight: normal;
            color: rgba(51, 51, 51, 1);
            text-align-last: justify;
            text-align: justify;
            padding: 0 0.16rem;
          }
          .el-form-item__content {
            display: flex;
            .el-input {
              flex: 1;
            }
          }
          .el-input__inner {
            border: none !important;
            height: 0.48rem;
          }
        }
        .el-button {
          width: 100%;
          height: 0.45rem;
          background: rgba(0, 178, 255, 1);
          border-radius: 0.04rem;
          position: absolute;
          top: 1.69rem;
        }
      }
    }
  }
  </style>