<template>
    <div class="main">
        <el-button>导入钱包</el-button>
        <el-button @click="onCreateWallet">创建钱包</el-button>
        <el-button @click="onWalletList">钱包列表</el-button>

        <div v-if="state.newWallet">{{state.newWallet}}</div>
    </div>
</template>

<script setup>
    import {ipcRenderer} from "electron"
    import {reactive, onMounted} from "vue"
    import helper from "../util/helper"

    const state = reactive({
        name: "my-wallet",
        newWallet: null
    })

    onMounted(async () => {
        const index = 0
        await ipcRenderer.invoke('setStoreValue', "wallets/index",`foo.${index}`, "bar")
        const foo = await ipcRenderer.invoke('getStoreValue', "wallets/index",`foo.${index}`)
        console.log(foo)
    })

    const onCreateWallet = () => {
        state.newWallet = helper.createWallet()
    }

    const onWalletList = () => {

    }
</script>

<style>
</style>
