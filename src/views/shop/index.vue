<template>
    <div class="app-container">
        <el-table :data="list" v-loading.body="listLoading" element-loading-text="Loading" border fit highlight-current-row stripe >
            <el-table-column align="center" label='店铺编号' width="95">
                <template slot-scope="scope">
                {{scope.row.id}}
                </template>
            </el-table-column>
            <el-table-column label="店铺logo">
                <template slot-scope="scope">
                <!-- {{scope.row.title}} -->
                <img  @click="touchImg(scope.row.logo_url)" style="width: 50px;height: 50px;cursor: pointer;" :src="scope.row.logo_url" alt="">
                </template>
            </el-table-column>
            <el-table-column label="店铺名称">
                <template slot-scope="scope">
                {{scope.row.shop_name}}
                </template>
            </el-table-column>
            <el-table-column label="店主姓名">
                <template slot-scope="scope">
                {{scope.row.shop_keeper}}
                </template>
            </el-table-column>        
            <el-table-column label="店铺描述" width="110" align="center">
                <template slot-scope="scope">
                <span>{{scope.row.shop_desc}}</span>
                </template>
            </el-table-column>
            <el-table-column label="联系电话" width="110" align="center">
                <template slot-scope="scope">
                {{scope.row.telephone}}
                </template>
            </el-table-column>
            <el-table-column label="运费" width="110" align="center">
                <template slot-scope="scope">
                {{scope.row.freight}}元
                </template>
            </el-table-column>
            <el-table-column class-name="status-col" label="是否为自营" width="110" align="center">
                <template slot-scope="scope">
                <el-tag :type="scope.row.is_self | statusFilter">{{scope.row.is_self}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column align="center" prop="created_at" label="创建时间" width="200">
                <template slot-scope="scope">
                <i class="el-icon-time"></i>
                <span>{{scope.row.create_time*1000|formatDate}}</span>
                </template>
            </el-table-column>   
            <el-table-column label="操作" width="180" align="center">        
                <template slot-scope="scope">
                <el-button size="small" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
                <el-button size="small" v-if="scope.row.is_on_sale===1" type="danger" @click="handleSale(scope.row.id, 2)">下架</el-button>
                <el-button size="small" v-if="scope.row.is_on_sale===2" type="success" @click="handleSale(scope.row.id, 1)">上架</el-button>
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
        
        <add-btn @handleAdd="handleAdd"></add-btn>
                
        <el-dialog title="添加店铺" :visible.sync="addDialogVisible">
            <el-form :model="form">
                <el-form-item label="店铺名称" :label-width="formLabelWidth">
                    <el-input v-model="form.shop_name" autocomplete="off"></el-input>
                </el-form-item>                             
                <el-form-item label="店主姓名" :label-width="formLabelWidth">
                    <el-input  v-model="form.shop_keeper" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item type="number" label="联系电话" :label-width="formLabelWidth">
                    <el-input v-model="form.telephone" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="运费" :label-width="formLabelWidth">
                    <el-input type="number" v-model="form.freight" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="账户" :label-width="formLabelWidth">
                    <el-input type="number" v-model="form.username" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="密码" :label-width="formLabelWidth">
                    <el-input type="number" v-model="form.password" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="活动区域" :label-width="formLabelWidth">
                    <el-select v-model="form.category_id" placeholder="请选择商品分类">
                        <el-option v-for="category in categoryList" :key="category.id" :label="category.name" :value="category.id"></el-option>                        
                    </el-select>
                </el-form-item>

                <el-form-item label="店铺logo" :label-width="formLabelWidth">
                    <el-upload
                        class="upload-demo"
                        action="http://127.0.0.1:8360/admin/upload/brandPic"
                        name="brand_pic"
                        :headers="uploadHeaders"
                        :on-preview="handleImgPreview"
                        :before-upload="beforeUpload"
                        :on-remove="handleImgRemove"
                        :on-success="handleUploadSuccess"
                        :file-list="fileList2"      
                        :limit="1"          
                        list-type="picture">
                        <el-button size="small" type="primary">上传图片</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                    </el-upload>   
                </el-form-item>

                                             
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleAddConfirm">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog
            title="商品图片"
            :visible.sync="centerDialogVisible"
            width="40%"            
            center>
            <img  style="width:100%;" :src="openImagPath" alt="">          
        </el-dialog>
    </div>
</template>

<script>
import { getShopList,addGoods,removeGoods,upadteGoods, updateGoodsSale } from '@/api/table'
import { getQiniuToken } from '@/api/login'
import addBtn from '@/components/add-btn'
import * as qiniu from 'qiniu-js'

export default {
    data() {
        return {
            centerDialogVisible: false,
            openImagPath:'',
            list: null,
            listLoading: true,
            addDialogVisible: false,
            formLabelWidth: '100px',
            fileList2: [{name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}],
            form: {
                shop_name: '',
                shop_keeper: '',
                shop_desc: '',
                telephone: '',          
                freight: 0, 
                logo_url:'',       
                username:'',
                password:''            
            },
            categoryList:[{
                id: 1005000,
                name: '萌宠小屋'
            },{
                id: 1005001,
                name: '有机农产品'
            },{
                id: 1019000,
                name: '养生小馆'
            }],
            isEdit: false,
            listTotal: 0,
            page: 1
        }
    },
    computed: {
        token() {            
            return this.$store.getters.token;
        },
        uploadHeaders() {
            return {
               'x-nideshop-token': this.token
            }
        }
    },
    filters: {
        statusFilter(status){
        const statusMap = {
            1: 'success',        
            0: 'danger'
        }
        return statusMap[status]
        }
    },
    components:{addBtn},
    created(){
        this.fetchData()
    },
    mounted() {

        // this.initUpload();
    },
    methods: {
        onPageChange(page) {
            this.page = page;
            this.fetchData()
        },
        initItemInfo(data) {
            this.form.shop_name = data.shop_name || '';
            this.form.shop_keeper = data.shop_keeper || '';
            this.form.telephone = data.telephone || '';
            this.form.shop_desc = data.shop_desc || '';
            this.form.freight = data.freight || 0;
            this.form.is_self = data.is_self || 0;
            this.form.logo_url = data.logo_url || '';
            this.form.username = data.username || '';
            this.form.password = data.password || '';
            this.fileList2 = []
            if ( this.form.list_pic_url ) {
                this.fileList2 = [{name:'',url:this.form.list_pic_url}];
            }
        },
        touchImg(imgPath) {
            this.openImagPath = imgPath;
            this.centerDialogVisible = true;
        },
        handleUploadSuccess(response, file, fileList) {
            
            if ( response.errno === 0 ) {                
                this.form.list_pic_url = 'http://www.tianguokeji.com/'+response.data.key;
                this.form.primary_pic_url = 'http://www.tianguokeji.com/'+response.data.key;
                
            }
        },
        beforeUpload(response, file, fileList) {
            
            // qiniu.upload(file, '11', 'ZUTQTDYRtkO7C3LPyZvnDCbDVpRlPfBqHQRhXGdX:3dA_ttKezj-iFhdnWN9oKTbL96g=:eyJzY29wZSI6Im15LXd4bWFpbCIsImRlYWRsaW5lIjoxNTQ1NzM2NDc3fQ==',  {},  {}).then(function(){
            //     debugger
            // })
        },                  
        handleImgRemove(file, fileList) {
            console.log(file, fileList);
        },
        handleImgPreview(file) {
            console.log(file);
        },
        handleAddConfirm() {
            if (!this.form.name ) {
                this.$message.error('请输入商品名称');
                return
            }
            if (!this.form.goods_number ) {
                this.$message.error('请输入商品数量');
                return
            }
            if (!this.form.retail_price ) {
                this.$message.error('请输入商品价格');
                return
            }
            if (!this.form.goods_brief ) {
                this.$message.error('请输入商品描述');
                return
            }
            if (!this.form.category_id ) {
                this.$message.error('请选择商品分类');
                return
            }
            if (!this.form.list_pic_url ) {
                this.$message.error('请上传商品图片');
                return
            }

            if( this.isEdit ) {
                upadteGoods(this.form).then(response => {
                    this.addDialogVisible = false; 
                    this.$message({
                        type: 'success',
                        message: '操作成功!'
                    }); 
                    this.fetchData();
                })
            } else {
                addGoods(this.form).then(response => {
                    this.addDialogVisible = false;
                    this.$message({
                        type: 'success',
                        message: '操作成功!'
                    }); 
                    this.fetchData();
                })
            }           
        },
        handleRemove(id) {
            removeGoods({id:id}).then(response => {
                debugger
            })
        },
        handleSale(id, sale) {
            updateGoodsSale({id:id, is_on_sale:sale}).then(response => {
                this.$message({
                    type: 'success',
                    message: '操作成功!'
                }); 
                this.fetchData();
            })
        },
        handleAdd() {
            this.isEdit = false;
            this.initItemInfo({});
            this.addDialogVisible = true;                
        },
        handleEdit(info) {
            this.isEdit = true;
            this.initItemInfo(info);
            this.addDialogVisible = true;               
        },
        fetchData() {
            this.listLoading = true
            getShopList({page: this.page}).then(response => {
                this.list = response.data.data;
                this.listTotal = response.data.count;
                
                this.listLoading = false
            })
        }
    }
}
</script>

