<template>
    <div class="main">
        <el-table :data="state.wallets" border size="mini" style="margin: 10px 0;border-radius: 5px">
            <el-table-column prop="chainId" label="钱包主链"/>
            <el-table-column prop="name" label="备注名称"/>
            <el-table-column prop="address" label="钱包地址"/>
            <el-table-column fixed="right" label="操作">
                <template #default="{$index,row}">
                    <el-popconfirm confirm-button-text="是" cancel-button-text="否" title="确认要删除钱包吗?无法撤销!"
                                   @confirm="onDeleteWallet($index,row)">
                        <template #reference>
                            <el-button type="danger" size="mini">删除</el-button>
                        </template>
                    </el-popconfirm>

                    <el-button size="mini" type="primary" @click="router.push({'name':'wallet-assets',query:{'walletName':row.name}})">资产</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-button @click="showImport" size="small">导入钱包</el-button>

        <el-dialog v-model="state.show.import" title="导入钱包">
            <WalletImport @onSuccess="onImportSuccess"></WalletImport>
        </el-dialog>


        <el-dialog v-model="state.show.walletAssets" center destroy-on-close></el-dialog>
    </div>
</template>

<script setup>
    import {reactive, onMounted} from "vue"
    import helper from "../util/helper"
    import WalletImport from './components/wallet-import.vue'
    import {ElNotification} from 'element-plus'
    import {useStore} from "vuex"
    import {useRouter} from "vue-router"

    const store = useStore()
    const router = useRouter()

    const state = reactive({
        wallets: [],
        show: {import: false, walletAssets: false}
    })

    onMounted(async () => {
        await getWallets()
    })

    const showImport = () => {
        state.show.import = true
    }

    const onImportSuccess = (newWallets) => {
        state.wallets.unshift(...newWallets)
        state.show.import = false
    }

    const onDeleteWallet = async (index, wallet) => {
        await helper.deleteWallet(wallet.name)
        state.wallets.splice(index, 1)
        ElNotification({
            title: "删除完毕",
            type: 'success',
        })
    }

    const getWallets = async () => {
        const wallets = await helper.getWallets()
        const newWallets = []
        for (const name in wallets) {
            newWallets.push(wallets[name])
        }
        state.wallets = newWallets
    }
</script>

<style>
</style>
