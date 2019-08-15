<template>
  <div class="app-container">
    <el-table :data="list" v-loading.body="listLoading" element-loading-text="Loading" border fit highlight-current-row stripe >
      <el-table-column align="center" label='ID' width="95">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户头像" width="110" align="center">
        <template slot-scope="scope">
          <!-- {{scope.row.title}} -->
          <img  @click="touchImg(scope.row.attestation)" style="width: 50px;height: 50px;cursor: pointer;" :src="scope.row.avatar" alt="">
        </template>
      </el-table-column>
      <el-table-column label="昵称" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.nickname}}</span>
        </template>
      </el-table-column>
      <el-table-column label="性别" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.gender==1">男</span>
          <span v-else>女</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="认证状态" width="110" align="center">
        <template slot-scope="scope">          
          <el-tag :type="scope.row.status | statusFilter">{{scope.row.statusDesc}}</el-tag>
        </template>
      </el-table-column> -->
      <!-- <el-table-column class-name="status-col" label="Status" width="110" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{scope.row.status}}</el-tag>
        </template>
      </el-table-column> -->
      <el-table-column align="center" prop="created_at" label="最后登录时间" >
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span>{{scope.row.register_time*1000|formatDate}}</span>
        </template>
      </el-table-column>

      <!-- <el-table-column label="操作" width="180" align="center">        
        <template slot-scope="scope">
          <el-button size="small" v-if="scope.row.status =='0'||scope.row.status =='1'" type="primary" @click="touchAgree(scope.row.lawyerId)">通过</el-button>
          <el-button size="small" v-if="scope.row.status =='0'||scope.row.status =='1'" type="danger" @click="touchDisagree(scope.row.lawyerId)">拒绝</el-button>
        </template>
      </el-table-column> -->
    </el-table>    
    <el-pagination
        class="m-t-20"
        background
        layout="prev, pager, next"
        @current-change="onPageChange"
        :total="listTotal">
    </el-pagination>

    <el-dialog
          title="用户头像"
          :visible.sync="centerDialogVisible"
          width="40%"
          center>
          <img  style="width:100%;" :src="openImagPath" alt="">          
    </el-dialog>
  </div>
</template>

<script>
import { getList, checkAttestation } from '@/api/table'
import axios from 'axios'
export default {
  data() {
    return {
      list: null,
      listLoading: true,
      centerDialogVisible: false,
      openImagPath:'',
      page: 1,
      listTotal: 0
    }
  },
  filters: {
    statusFilter(status){
      const statusMap = {
        2: 'success',        
        3: 'danger'
      }
      return statusMap[status]
    }
  },
  created(){
    this.fetchData()
  },
  methods: {
      onPageChange(page) {
            this.page = page;
            this.fetchData()
        },
    touchImg(imgPath) {
      this.openImagPath = imgPath;
      this.centerDialogVisible = true;
    },
    fetchData() {
      this.listLoading = true
      getList(this.listQuery).then(res => {
        
        this.list = res.data.data;
        this.listTotal = res.data.count;
        this.listLoading = false

      })
    },
    touchAgree(lawyerId) {
            this.$confirm('是否确认认证通过！', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              
              let params = {
                sid: lawyerId,
                status: 2
              }
              checkAttestation(params).then(response => {
                this.fetchData()
                this.$message({
                  type: 'success',
                  message: '操作成功!'
                });
              })

              // axios.post('http://tianguokeji.com/admin/info/check-attestation',params)
              // .then(function(res){
              //   console.log(res);
              // })
              // .catch(function(err){
              //   console.log(err);
              // });
              

            }).catch(() => {                      
            });
    },
    touchDisagree(lawyerId) {
              this.$prompt('请输入拒绝理由', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputPlaceholder: '请输入您的拒绝理由',
                inputPattern: /\S/,
                // inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
                inputErrorMessage: '请输入您的拒绝理由'
              }).then(({ value }) => {
                // this.$message({
                //   type: 'success',
                //   message: '你的邮箱是: ' + value
                // });
                let params = {
                  sid: lawyerId,
                  status: 3
                }
                checkAttestation(params).then(response => {
                  this.fetchData()
                  this.$message({
                    type: 'success',
                    message: '操作成功!'
                  });
                })

              }).catch(() => {
                  
              });
    }

  }
};
</script>
