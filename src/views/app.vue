<template>
    <div class="main">
        <el-container>
            <el-header style="padding: 0">
                <div style="margin: 5px 0">
                    <el-button size="small" @click="router.push({name:'index'})">home</el-button>
                    <el-button size="small" @click="router.push({name:'bookmark-index'})">书签</el-button>
                </div>
            </el-header>
            <el-container>
                <el-aside>
                    <my-aside></my-aside>
                </el-aside>
                <el-container>
                    <el-main>
                        <my-main></my-main>

                    </el-main>
                    <el-footer>
                        <my-footer></my-footer>
                    </el-footer>
                </el-container>
            </el-container>
        </el-container>
    </div>
    <router-view v-slot="{ Component }">
        <component :is="Component"/>
    </router-view>
</template>

<script setup>
    import {onMounted, reactive} from 'vue'
    import {useRouter} from 'vue-router'
    import {useStore} from 'vuex'
    import helper from "../util/helper"
    import MyAside from "./components/my-aside"
    import MyFooter from "./components/my-footer"
    import MyMain from "./components/my-main"

    const router = useRouter()

    const store = useStore()


    const state = reactive({})


    onMounted(async () => {
        const wallets = await helper.getStoreValue("wallets","wallets")
        store.commit("setWallets", wallets)
        // syncBalanceAll(wallets).then()
        setInterval(() => {
            // syncBalanceAll().then()
        }, 60 * 1000)
    })

    const syncBalanceAll = async () => {
        const wallets = await helper.getStoreValue("wallets","wallets")
        for (const key in wallets) {
            await syncBalance(wallets[key])
        }
    }

    const syncBalance = async (wallet) => {
        const balance = await helper.syncBalance(wallet)
        store.commit("setWalletAttr", {name: wallet.name, attr: "balance", value: balance})
    }
</script>

<style>

</style>
