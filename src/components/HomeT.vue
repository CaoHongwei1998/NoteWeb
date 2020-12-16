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
              <el-button type="primary" icon="el-icon-edit" class="updatenote" @click="updateDialog(scope.row.note_id)" ></el-button>
            </template>
          </el-table-column>
        </el-table>


      </div>
      </el-card>
    <!--修改假条-->
      <el-dialog title="审批假条" :visible.sync="updateDialogVisible" width="50%" >
        <el-form ref="updateFormRef" :model="updateForm"label-width="100px" class="update_form">
          <!--请假人 发起时间 请假时间 原因 *审批 *审批原因 -->
          <el-form-item label="请假人">
            <el-input v-model="updateForm.student_name" disabled></el-input>
          </el-form-item>
          <el-form-item  label="发起时间">
            <el-date-picker v-model="updateForm.note_time" type="date" disabled>
            </el-date-picker>
          </el-form-item>
          <el-form-item  label="请假时间">
            <el-date-picker v-model="updateForm.updatenotetimes" type="daterange" range-separator="至" disabled>
            </el-date-picker>
          </el-form-item>
          <el-form-item  label="请假原因">
            <el-input type="textarea"  v-model="updateForm.note_reason" maxlength="100" show-word-limit autosize disabled>
            </el-input>
          </el-form-item>
          <el-form-item  label="审批">
            <el-select v-model="updateForm.approve_status" placeholder="请选择">
              <el-option label="审批中" value="0" disabled></el-option>
              <el-option label="通过" value="1"></el-option>
              <el-option label="驳回" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item  label="审批原因">
            <el-input type="textarea"  v-model="updateForm.approve_reason" maxlength="100" show-word-limit autosize >
            </el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="add-dialog-footer">
          <el-button @click="updateDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="updateFormInfo">确 定</el-button>
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
      //修改对话框隐藏
      updateDialogVisible:false,
      //修改表单-------------------------
      updateForm:{
        updatenotetimes:[]
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
      await this.$http.post('notelistt',window.sessionStorage.getItem('id'), {headers: {'Content-Type': 'application/json;charset=UTF-8'}})
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
    //修改假条
    updateDialog(note_id){
      this.updateDialogVisible =true
      //查询
      this.$http.get('select/'+note_id)
        .then( res =>{
          this.updateForm = res.data
          this.updateForm.updatenotetimes=[this.updateForm.note_start,this.updateForm.note_end]
          this.updateForm.approve_status=this.updateForm.approve_status+""
          this.$message.success('获取该假条成功！')
        })
        .catch(err =>{
          this.$message.error('获取该假条失败')
        })
    },


    //修改 提交
    updateFormInfo(){

      var note ={
        note_id : this.updateForm.note_id,
        approver_id : window.sessionStorage.getItem('id'),
        approve_status : this.updateForm.approve_status,
        approve_time : new Date(),
        approve_reason :this.updateForm.approve_reason
      }
      this.$http.put('update/'+note.note_id,note)
        .then(res =>{
          this.$message.success('修改成功')
          this.updateDialogVisible=false
          this.getNoteList()
        }).catch(err =>{
        this.$message.error('修改失败')
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
