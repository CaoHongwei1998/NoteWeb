<template>
  <div class="login_container">
    <div class="login_box">
      <div class="wellcome">
        <h1>欢迎登录</h1>
      </div>
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="0px" class="login_form">
        <!--用户名-->
        <el-form-item prop="userid">
          <el-input v-model="loginForm.userid" prefix-icon="el-icon-user-solid"  placeholder="请输入学号/工号" clearable></el-input>
        </el-form-item>
        <!--密码-->
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" prefix-icon="el-icon-lock" type="password" placeholder="请输入密码" clearable show-password></el-input>
        </el-form-item>
        <!--按钮-->
        <el-form-item class="btns">
          <el-button type="primary" @click="register">注册</el-button>
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loginForm: {
        userid: '1001',
        password: '123'
      },
      loginFormRules: { // 表单验证规则
        userid: [
          { required: true, message: '请输入帐号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    register(){
      this.$router.push('/register')
    },
    login () {
      // 登录验证
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) {
          return
        }
        /*const { data: res } = await this.$http.post('login', this.loginForm)
        this.$message.success('登录成功')*/
        await this.$http.post('login',this.loginForm)
        .then( res =>{
          //保存id信息
          if (res.data.student_id){
            console.log(res.data.student_id)
            window.sessionStorage.setItem("id",res.data.student_id)
            this.$router.push("/home")
          }
          if (res.data.teacher_id){
            console.log(res.data.teacher_id)
            window.sessionStorage.setItem("id",res.data.teacher_id)
            this.$router.push("/homet")
          }

          this.$message.success('登录成功')

        })
        .catch(err =>{
          this.$message.error('登录失败')
        })

      })
    },
    // 点击重置按钮
    resetLoginForm () {
      this.$refs.loginFormRef.resetFields()
    }
  }
}
</script>

<style  long="less" scoped>
.login_container{
  background-color: #2b4b6b;
  height: 100%;
}

.login_box{
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
}
.wellcome{
  position: absolute;
  left: 50%;
  transform: translate(-50%,0%);
}
.login_form{
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}

.btns{
  display: flex;
  justify-content: flex-end;
}
</style>
