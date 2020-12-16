<template>
  <div class="register_container">
    <div class="register_box">
      <div class="register">
        <h1>请填写注册信息</h1>
      </div>
      <el-form ref="registerFormRef" :model="registerForm" :rules="registerFormRules" label-width="60px" class="register_form">
        <!--姓名 id 密码 班级 -->
        <el-form-item prop="username" label="姓名">
          <el-input v-model="registerForm.username" prefix-icon="el-icon-user-solid" placeholder="请输入姓名" clearable></el-input>
        </el-form-item>
        <!--id -->
        <el-form-item prop="userid" label="帐号">
          <el-input v-model="registerForm.userid" prefix-icon="el-icon-user-solid" placeholder="请输入学号/工号" clearable></el-input>
        </el-form-item>
        <!--密码-->
        <el-form-item prop="password" label="密码">
          <el-input v-model="registerForm.password" prefix-icon="el-icon-lock" type="password" placeholder="请输入密码" clearable show-password></el-input>
        </el-form-item>
        <!-- 班级 -->
        <el-form-item prop="userclass" label="班级" >
          <el-select v-model="registerForm.userclass" placeholder="请选择班级">
            <el-option label="21班" value="21"></el-option>
            <el-option label="22班" value="22"></el-option>
          </el-select>
        </el-form-item>
        <!--按钮-->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">返回登录</el-button>
          <el-button type="primary" @click="register">立即注册</el-button>
          <el-button type="info" @click="resetRegisterForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    //验证账户重复
    var checkSnum = (rule, value, callback) =>{
      this.$http.get("check/"+value)
        .then(res=>{
          //1 表示可用 0已有
          if(res.data=="1"){
            return callback()
          }else {
            return callback(new Error('该账号已存在!'))
          }
        }).catch(err=>{
        this.$message.error('获取帐号失败')
      })


    }
    return {
      registerForm: {
        username: 'zhangsan',
        userid: '1001',
        password: '123',
        userclass: ''
      },
      registerFormRules: { // 表单验证规则
        username: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        userid: [
          { required: true, message: '请输入学号/工号', trigger: 'blur' },
          { min: 4, max: 4, message: '长度错误！', trigger: 'blur'},
          { validator:checkSnum, trigger: 'blur'}
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        userclass: [
          { required: true, message: '请选择班级', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    // 点击返回登录按钮
    login(){
      this.$router.push('/login')
    },

    register () {
      // 注册验证
      this.$refs.registerFormRef.validate(async valid => {
        if (!valid) {
          return
        }
        /*const { data: res } = await this.$http.post('register', this.registerForm)
        this.$message.success('登录成功')*/
        await this.$http.post('register',this.registerForm)
        .then( res =>{
          //保存id信息
          if (res.data.student_id){
            console.log(res.data.student_id)
          }

          this.$message.success('注册成功')
          this.$router.push("/login")
        })
        .catch(err =>{
          this.$message.error('注册失败')
        })

      })
    },
    // 点击重置按钮
    resetRegisterForm () {
      this.$refs.registerFormRef.resetFields()
    }
  }
}
</script>

<style  long="less" scoped>
.register_container{
  background-color: #2b4b6b;
  height: 100%;
}

.register_box{
  width: 450px;
  height: 400px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
}
.register{
  position: absolute;
  left: 50%;
  transform: translate(-50%,0%);
}
.register_form{
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
