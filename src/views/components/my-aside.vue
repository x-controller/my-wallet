<template>
    <div style="" class="aside-box">
        <el-card v-for="(wallet,index) in state.wallets" :key="index" :body-style="{padding:'2px'}" shadow="hover"
                 style="margin: 5px">
            <el-tag size="small">{{wallet.name}}</el-tag>
            <el-tag size="small">{{wallet.address}}</el-tag>
        </el-card>
    </div>
</template>

<script setup>
    import {reactive, onMounted} from "vue";
    import helper from "../../util/helper";

    const state = reactive({
        wallets: [],
    })

    const fetchWallets = async () => {
        state.wallets = await helper.getWallets()
    }
    onMounted(() => {
        fetchWallets()
    })
</script>

<style scoped>
    .aside-box {
        background: #dadada;
        padding: 10px 0;
        border-radius: 5px;
    }
    .el-tag{
        margin: 2px;
    }
</style>