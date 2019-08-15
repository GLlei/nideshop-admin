<template>
    <div class="add-btn" @click="handleAdd">
        <i class="el-icon-plus"></i>
    </div>
</template>

<script>
export default {
    name: "AddBtn",
    data() {
        return {};
    },
    methods: {
        handleAdd: function() {
            this.$emit('handleAdd');            
        }
    }
};
</script>

<style scoped>

.add-btn {
    position: fixed;
    z-index: 999;
    right: 30px;
    bottom: 30px;
    width: 56px;
    height: 56px;
    line-height: 56px;
    padding-top: 5px;
    text-align: center;
    color: #fff;
    background-color: #5a87ff;
    border-radius: 100%;
    cursor: pointer;
}
.add-btn i {
    font-size: 28px;
    font-weight: 600;
}
</style>
