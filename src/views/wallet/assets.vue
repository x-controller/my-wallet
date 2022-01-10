<template>
    <div class="main">
        <el-card>
            <template #header>
                <el-tag>备注名称：{{state.wallet.name}}</el-tag>
                <el-tag>钱包地址：{{state.wallet.address}}</el-tag>
                <el-tag>上次更新：{{state.lastUpdateAt}}</el-tag>
            </template>
            <el-table empty-text="暂无数据" :data="state.assets" border size="mini"
                      style="margin: 10px 0;border-radius: 4px">
                <el-table-column prop="symbol" label="代币名称"/>
                <el-table-column prop="address" label="代币地址"/>
                <el-table-column prop="balance" label="资产余额"/>
            </el-table>
        </el-card>


    </div>
</template>

<script setup>
    import {ethers} from 'ethers'
    import _ from "lodash"
    import {onMounted, reactive, watch} from 'vue'
    import {useRouter, useRoute} from "vue-router"
    import {useStore} from "vuex"
    import helper from "../../util/helper"

    const router = useRouter()
    const route = useRoute()
    const store = useStore()

    watch(() => route.path, () => {
        clearInterval(state.syncIndex)
    })

    const state = reactive({
        walletName: route.query.walletName,
        wallet: {},
        assets: [],
        lastUpdateAt: new Date().toLocaleString(),
        syncIndex: 0
    })


    onMounted(async () => {
        state.wallet = await helper.getWallet(state.walletName)
        state.assets = await helper.getWalletAssets(state.walletName) || []
        await syncWalletAssets()
    })

    const syncWalletAssets = async () => {
        const provider = new ethers.providers.JsonRpcProvider(helper.getRunRpcUrl(state.wallet.chainId))
        let toBlock = await provider.getBlockNumber()
        const abi = [
            "function balanceOf(address owner) view returns (uint256)",
            "function decimals() view returns (uint8)",
            "function symbol() view returns (string)",
        ]
        state.syncIndex = setInterval(async () => {
            let fromBlock = toBlock - 5000
            const logs = await provider.getLogs({
                fromBlock,
                toBlock,
                topics: [
                    ethers.utils.id("Transfer(address,address,uint256)"),
                    null,
                    ethers.utils.hexZeroPad(state.wallet.address, 32)
                ]
            })
            state.lastUpdateAt = new Date().toLocaleString()
            for (let i = 0; i < logs.length; i++) {
                const log = logs[i]
                const address = log.address
                const erc20 = new ethers.Contract(address, abi, provider)
                let balance = await erc20.balanceOf(state.wallet.address)
                const symbol = await erc20.symbol()
                const decimals = await erc20.decimals()
                balance = ethers.utils.formatUnits(balance, decimals)
                const asset = {balance, symbol, decimals, address}
                await helper.setWalletAsset(state.walletName, asset)
                updateOrInsertAsset(asset)
            }
            toBlock -= 5000
        }, 5000)
    }

    const updateOrInsertAsset = (asset) => {
        let exist = false
        for (let i = 0; i < state.assets.length; i++) {
            if (state.assets[i].address === asset.address) {
                state.assets[i] = _.assignIn(state.assets[i], asset)
                exist = true
            }
        }
        if (!exist) {
            state.assets.push(asset)
        }
    }

</script>

<style>
    .el-tag {
        margin: 0 2px;
    }
</style>
