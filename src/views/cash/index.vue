<template>
  <div class="app-container">
    <el-table :data="list" v-loading.body="listLoading" element-loading-text="Loading" border fit highlight-current-row stripe >
      <el-table-column align="center" label='ID' width="95">
        <template slot-scope="scope">
          {{scope.row.id}}
        </template>
      </el-table-column>
      <el-table-column label="申请人">
        <template slot-scope="scope">
          {{scope.row.name}}
        </template>
      </el-table-column>
      <el-table-column label="提现金额" width="110" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.amount}}</span>
        </template>
      </el-table-column>
      <el-table-column label="提现编号" width="250" align="center">
        <template slot-scope="scope">
          {{scope.row.partner_trade_no}}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="提现状态" width="110" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">
            <span v-if="scope.row.status == 0">待提现</span>
            <span v-else-if="scope.row.status == 1">已拒绝</span>
            <span v-else-if="scope.row.status == 2">已提现</span> 
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="提现时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span>{{scope.row.createTime}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" align="center">        
        <template slot-scope="scope">
          <el-button size="small" v-if="scope.row.status =='0'||scope.row.status =='1'" type="primary" @click="touchAgree(scope.row)">提现</el-button>
          <el-button size="small" v-if="scope.row.status =='0'||scope.row.status =='1'" type="danger" @click="touchDisagree(scope.row)">拒绝</el-button>
        </template>
      </el-table-column>

    </el-table>
  </div>
</template>

<script>
import { getCashList, checkCash } from '@/api/table'

export default {
  data() {
    return {
      list: null,
      listLoading: true
    }
  },
  filters: {
    statusFilter(status){
      const statusMap = {
        2: 'success',        
        1: 'danger'
      }
      return statusMap[status]
    }
  },
  created(){
    this.fetchData()
  },
  methods: {
    fetchData() {
        this.listLoading = true
        getCashList(this.listQuery).then(response => {
            this.list = response.data.data;
            this.listLoading = false
        })
    },
    touchAgree(row) {
        this.$confirm('是否确认已经提现！', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            
            let params = {
                id: row.id,
                sid: row.lawyer_id,
                status: 2
            }
            checkCash(params).then(response => {
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
        this.$prompt('请输入拒绝提现理由', '提示', {
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
                id: row.id,
                sid: row.lawyer_id,
                status: 1
            }
            checkCash(params).then(response => {
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
}
</script>
