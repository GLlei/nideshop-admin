<template>
  <div class="app-container">
    <el-table :data="list" v-loading.body="listLoading" element-loading-text="Loading" border fit highlight-current-row stripe >
      <el-table-column align="center" label='ID' width="95">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column label="图标" width="100" align="center">
        <template slot-scope="scope">
          <!-- {{scope.row.title}} -->
          <img  @click="touchImg(scope.row.icon_url)" style="width: 50px;height: 50px;cursor: pointer;" :src="scope.row.icon_url" alt="">
        </template>
      </el-table-column>
      <el-table-column label="分类名称"  align="center">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="跳转链接"  align="center">
        <template slot-scope="scope">
          <span>{{scope.row.url}}</span>
        </template>
      </el-table-column>      
    </el-table>    
    <!-- 分页信息 -->
    <el-pagination
        class="m-t-20"
        background
        layout="prev, pager, next"
        @current-change="onPageChange"
        :total="listTotal">
    </el-pagination>
    <!-- 图片放大 -->
    <el-dialog
          title="图标"
          :visible.sync="centerDialogVisible"
          width="40%"
          center>
          <img  style="width:100%;" :src="openImagPath" alt="">          
    </el-dialog>
  </div>
</template>

<script>
import { getChannelList, checkAttestation } from '@/api/table'
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
        getChannelList({page: this.page}).then(res => {        
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
