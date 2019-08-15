<template>
    <div class="app-wrapper" :class="{hideSidebar:!sidebar.opened}">
        <div class="app-heder">
            
            <span class="header-title">小白商铺管理后台</span>
            <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>
            <el-dropdown class="avatar-container" trigger="click">
                <div class="avatar-wrapper">
                    <img class="user-avatar" src="../../assets/logo.png">
                    <i class="el-icon-caret-bottom"></i>
                </div>
                <el-dropdown-menu class="user-dropdown" slot="dropdown">
                    <router-link class="inlineBlock" to="/">
                    <el-dropdown-item>
                        首页
                    </el-dropdown-item>
                    </router-link>
                    <el-dropdown-item divided>
                    <span @click="logout" style="display:block;">退出账户</span>
                    </el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
        
        <sidebar class="sidebar-container"></sidebar>
        
        <div class="main-container">
            <navbar></navbar>
            <app-main></app-main>
        </div>
    </div>
</template>

<script>
import { Navbar, Sidebar, AppMain } from '@/views/layout/components'
import Hamburger from '@/components/Hamburger'
export default {
    name: 'layout',
    components: {
        Navbar,
        Sidebar,
        AppMain,
        Hamburger
    },
    computed: {
        sidebar() {
            return this.$store.state.app.sidebar
        }
    },
    methods: {   
        toggleSideBar() {
            this.$store.dispatch('ToggleSideBar')
        },
        logout() {
            this.$store.dispatch('LogOut').then(() => {
                location.reload() // 为了重新实例化vue-router对象 避免bug
            })
        }
    }    
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
.app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
    margin-top: 50px;
    .app-heder {
        position: relative;
        box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.1);
        position: fixed;
        text-align: center;
        line-height: 50px;
        top: 0;
        left: 0;
        right: 0;
        z-index: 999;
        height: 50px;
        color: #fff;
        background-color: #17a2b8;
        .header-title {
            display: inline-block;
            font-weight: 500;
            margin-left: 6px;
        }
        .hamburger-container {
            margin-left: 10px;
            line-height: 58px;
            height: 50px;
            float: left;            
            padding: 0 10px;
        }
        .avatar-container {
            height: 50px;
            display: inline-block;
            position: absolute;
            right: 35px;
            .avatar-wrapper {
                cursor: pointer;
                margin-top: 5px;
                position: relative;
                .user-avatar {
                    width: 40px;
                    height: 40px;
                    border-radius: 10px;
                }
                .el-icon-caret-bottom {
                    color: #fff;
                    position: absolute;
                    right: -20px;
                    top: 25px;
                    font-size: 12px;
                }
            }
        }
    }    
}
</style>
