<template>
    <div class="aside-box">
        <el-button size="small" style="margin: 0 5px" @click="showCreate">添加钱包</el-button>
        <el-card v-for="(value,name,index) in state.wallets" :key="index" :body-style="{padding:'2px'}" shadow="hover"
                 style="margin: 5px">
            <el-tag size="small">{{name}}</el-tag>
            <el-tag size="small">{{value.address}}</el-tag>
            <el-button size="small" @click="onCheckWallet(value)">查看</el-button>
            <el-button size="small" @click="onDelWallet(name)" type="danger">删除</el-button>

        </el-card>
    </div>

    <el-dialog v-model="state.show.create">
        <WalletImport></WalletImport>
    </el-dialog>
</template>

<script setup>
    import {useStore} from "vuex"
    import {reactive, onMounted, computed} from "vue"

    const store = useStore()
    import helper from "../../util/helper"
    import WalletImport from './wallet-import.vue'


    const state = reactive({
        wallets: computed(() => store.state.wallets),
        show:{create:false}
    })

    const onCheckWallet=(wallet)=>{
        helper.emitter.emit("check-wallet",wallet)
    }

    const onDelWallet = (name)=>{
        helper.delStoreValue("wallets",`wallets.${name}`)
        store.commit("removeWallet",{name})
    }

    const showCreate = () => {
        state.show.create = true
    }

    onMounted(() => {
    })
</script>

<style scoped>
    .aside-box {
        background: #dadada;
        padding: 10px 0;
        border-radius: 5px;
    }

    .el-tag {
        margin: 2px;
    }
</style>