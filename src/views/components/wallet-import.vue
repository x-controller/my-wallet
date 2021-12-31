<template>
    <div class="main">
        <el-form ref="form" :model="state.import">
            <el-form-item label="钱包私钥">
                <el-input v-model="state.import.privateKey" type="password"></el-input>
            </el-form-item>
            <el-form-item label="打开密码">
                <el-input v-model="state.import.password" type="password"></el-input>
            </el-form-item>
            <el-form-item label="备注名称">
                <el-input v-model="state.import.name"></el-input>
            </el-form-item>
            <el-form-item label="选择主链">
                <el-checkbox-group v-model="state.chains">
                    <el-checkbox label="币安"/>
                    <el-checkbox label="火币"/>
                    <el-checkbox label="夸克"/>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onImport" :loading="state.isLoading">导入</el-button>
            </el-form-item>
        </el-form>

    </div>
</template>

<script setup>
    import {reactive, defineEmits} from "vue"
    import helper from "../../util/helper"
    import {ElNotification} from 'element-plus'

    const emits = defineEmits(['onSuccess'])

    const state = reactive({
        import: {},
        isLoading: false,
        chains: []
    })

    const onImport = async () => {


        state.isLoading = true
        const name = state.import.name
        const exist = await helper.walletNameExist(name)
        if (exist) {
            ElNotification({
                title: "导入失败",
                message: "备注钱包名已经存在",
                type: 'error',
            })
        } else {
            const chainIds = {
                "火币": "128",
                "币安": "56",
                "夸克": "20181205"
            }
            let newWallets = []
            for (let i = 0; i < state.chains.length; i++) {
                const chainId = chainIds[state.chains[i]]
                const newWallet = await helper.importPrivateKey(state.import.privateKey, name, state.import.password, chainId)
                newWallets.push(newWallet)
            }
            ElNotification({
                title: "导入成功",
                type: 'success',
            })
            emits("onSuccess", newWallets)
        }
        state.isLoading = false
    }

</script>

<style scoped>
</style>
