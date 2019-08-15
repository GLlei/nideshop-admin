<template>
    <div class="app-container">
        <el-table :data="list" v-loading.body="listLoading" element-loading-text="Loading" border fit highlight-current-row stripe >
        <el-table-column align="center" label='ID' width="95">
            <template slot-scope="scope">
            {{scope.row.id}}
            </template>
        </el-table-column>
        <el-table-column label="订单号">
            <template slot-scope="scope">
            {{scope.row.order_sn}}
            </template>
        </el-table-column>      
        <el-table-column label="收货人" width="110" align="center">
            <template slot-scope="scope">
            {{scope.row.consignee}}
            </template>
        </el-table-column>
        <el-table-column label="收货人电话" width="110" align="center">
            <template slot-scope="scope">
            {{scope.row.mobile}}
            </template>
        </el-table-column>
        <el-table-column label="收货地址" width="110" align="center">
            <template slot-scope="scope">
            {{scope.row.full_region}}
            </template>
        </el-table-column>
        <el-table-column label="付款金额" width="110" align="center">
            <template slot-scope="scope">
            {{scope.row.order_price}}元
            </template>
        </el-table-column>
        <el-table-column class-name="status-col" label="付款状态" width="110" align="center">
            <template slot-scope="scope">
            <el-tag :type="scope.row.order_status_text | statusFilter">{{scope.row.order_status_text}}</el-tag>
            </template>
        </el-table-column>
        <el-table-column align="center" prop="created_at" label="下单时间" width="200">
            <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span>{{scope.row.add_time*1000|formatDate}}</span>
            </template>
        </el-table-column>     
        <el-table-column label="操作" width="120" align="center">        
                <template slot-scope="scope">
                <el-button v-if="scope.row.order_status==2" size="small" type="primary" @click="handleDeliver(scope.row.id)">发货</el-button>            
                </template>
            </el-table-column>  
        </el-table>
        <el-pagination
            class="m-t-20"
            background
            layout="prev, pager, next"
            @current-change="onPageChange"
            :total="listTotal">
        </el-pagination>
    </div>
</template>

<script>
import { getOrderList,doDeliver } from '@/api/table'

export default {
    data() {
        return {
            list: null,
            listLoading: true,
            page: 1,
            listTotal: 0,
        }
    },
    filters: {
        statusFilter(status){
            const statusMap = {
                "已付款": 'success',        
                "待付款": 'danger'
            }
            return statusMap[status]
        }
    },
    created(){
        this.fetchData();
    },
    methods: {
        onPageChange(page) {
            this.page = page;
            this.fetchData()
        },
        fetchData() {
            this.listLoading = true
            getOrderList({page: this.page}).then(res => {

                this.list = res.data.data;
                this.listTotal = res.data.count;
                this.listLoading = false
            })
        },
        handleDeliver(id) {
            doDeliver({id:id}).then( res =>{
                this.$message({
                    type: 'success',
                    message: '操作成功!'
                }); 
                this.fetchData();
            });
        }
    }
}
</script>
