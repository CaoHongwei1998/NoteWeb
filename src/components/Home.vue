<template>
  <div class="home_container">
    <!--<el-button type="info" @click="logout">退出</el-button>-->
    <el-card class="box-card">
      <div slot="header" class="syshead">
        <span>请假管理系统</span>
        <el-button @click="logout" class="logout" type="danger" icon="el-icon-switch-button" size="small">退出</el-button>
      </div>

      <!--老师 ： 准许驳回请假 驳回理由
      学生：新增假条 撤销假条 修改假条-->
      <div>
        <el-table :data="notelist" style="width: 100%">
          <el-table-column prop="student_name" label="请假人" width="100"></el-table-column>

          <el-table-column label="发起时间" width="250">
            <template slot-scope="scope">
              <el-date-picker v-model="notelist[scope.$index].note_time" type="date" readonly>
              </el-date-picker>
            </template>
          </el-table-column>

          <el-table-column label="请假时间" width="400">
            <template slot-scope="scope">
              <el-date-picker v-model="notetimes[scope.$index]" type="daterange" range-separator="至" readonly>
              </el-date-picker>
            </template>
          </el-table-column>

          <el-table-column prop="approve_status" label="审批状态" width="100">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" content="通过" placement="top" v-if="notelist[scope.$index].approve_status=='1'">
                <el-button type="success" icon="el-icon-check" circle></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="审批中" placement="top"  v-if="notelist[scope.$index].approve_status=='0'">
                <el-button type="primary" icon="el-icon-refresh" circle></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="驳回" placement="top"   v-if="notelist[scope.$index].approve_status=='2'">
                <el-button type="danger" icon="el-icon-close" circle></el-button>
              </el-tooltip>
            </template>
          </el-table-column>

          <el-table-column label="审批时间" width="250" >
            <template slot-scope="scope">
              <el-date-picker v-model="notelist[scope.$index].approve_time" type="date" readonly>
              </el-date-picker>
            </template>
          </el-table-column>

          <el-table-column  label="操作" width="180">
            <template slot-scope="scope">
              <!--<el-button type="primary" icon="el-icon-edit" ></el-button>-->
              <el-button type="danger" icon="el-icon-delete" @click="delNoteById(scope.row.note_id)"></el-button>
            </template>
          </el-table-column>
        </el-table>

        <!--新增假条-->
        <div>
          <el-button type="primary" icon="el-icon-plus" class="addnote" @click="addDialogVisible =true" >新增假条</el-button>
        </div>

      </div>
      <!--新增假条-->
      </el-card>
      <el-dialog title="新增假条" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
        <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="100px" class="add_form">
          <!--开始时间 结束时间 原因 -->
          <el-form-item prop="addnotetimes" label="请假时间">
            <el-date-picker v-model="addForm.addnotetimes" type="daterange" range-separator="至" >
            </el-date-picker>
          </el-form-item>
          <el-form-item prop="addreason" label="请假原因">
            <el-input type="textarea" placeholder="请输入请假原因" v-model="addForm.addreason" maxlength="100" show-word-limit autosize>
            </el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="add-dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addNote">确 定</el-button>
        </span>
      </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      //假条信息
      notelist:[],
      //请假时间
      notetimes:[],
      //添加对话框隐藏
      addDialogVisible:false,
      //添加表单
      addForm:{
        //添加的 请假区段
        addnotetimes:[],
        //添加的 请假原因
        addreason:''
      },
      //老师登录 隐藏删除 新增

      //添加规则
      addFormRules:{
        addnotetimes:[
          { required: true, message: '请输入请假时段', trigger: 'blur' }
        ],
        addreason:[
          { required: true, message: '请输入请假原因', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getNoteList()
  },
  methods:{
    //退出
    logout(){
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    //获取所有假条
    async getNoteList(){
      await this.$http.post('notelist',window.sessionStorage.getItem('id'), {headers: {'Content-Type': 'application/json;charset=UTF-8'}})
        .then( res =>{
          this.notelist=res.data
          for(const i in this.notelist){
            this.notelist[i].note_time=new Date(this.notelist[i].note_time)
            this.notelist[i].note_start=new Date(this.notelist[i].note_start)
            this.notelist[i].note_end=new Date(this.notelist[i].note_end)
            this.notetimes[i]=[this.notelist[i].note_start,this.notelist[i].note_end]
            if(this.notelist[i].approve_time){
              this.notelist[i].approve_time=new Date(this.notelist[i].approve_time)
            }else {
              this.notelist[i].approve_time=null
            }
          }
          this.$message.success('获取假条成功')
        })
        .catch(err =>{
          this.$message.error('获取假条失败')
        })
    },
    //添加假条
    addNote(){
      //预验证
      this.$refs.addFormRef.validate(async valid =>{
        //有未填项
        if (!valid) return

        var note ={
          student_id : window.sessionStorage.getItem('id'),
          note_time: new Date(),
          note_start: this.addForm.addnotetimes[0],
          note_end: this.addForm.addnotetimes[1],
          note_reason: this.addForm.addreason,
          approve_status: 0
        }

        //添加用户
        await this.$http.post('addnote',note,{headers: {'Content-Type': 'application/json;charset=UTF-8'}})
          .then( res =>{
            this.$message.success('新增假条成功')
            //隐藏对话框
            this.addDialogVisible = false
            //刷新数据
            this.getNoteList()
          })
          .catch(err =>{
            this.$message.error('新增假条失败')
          })

      })
    },
    //添加用户关闭 清空内容
    addDialogClosed(){
      this.$refs.addFormRef.resetFields()
    },
    //删除假条
    async delNoteById (note_id) {

      const confirmResult = await this.$confirm('此操作将永久删除该假条, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err =>err)
      //确认 返回 confirm
      //取消返回cancel
      if (confirmResult!=='confirm'){
        return this.$message.info('已取消删除')
      }

      this.$http.delete('del/'+note_id)
        .then( res =>{
        this.$message.success('删除成功！')
        //刷新数据
        this.getNoteList()
        })
        .catch(err =>{
          this.$message.error('删除失败')
        })

    }
  },


};
</script>

<style  long="less" scoped>
  .home_container{
    background-color: #2b4b6b;
    height: 100%;
  }

.el-card{
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
}
  .syshead{

  }
  .logout{
    float: right;
    margin-: 50px;

  }
  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }


  .box-card {
    width: 85%;
  }
  .addnote{
    margin-top: 10px;
    margin-bottom: 10px;
    float: right;
  }
</style>
