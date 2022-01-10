<template>
    <div class="main">
        <el-button @click="router.push({name:'index'})">home</el-button>
        <router-view v-slot="{ Component }">
            <component :is="Component"/>
        </router-view>
    </div>
</template>

<script setup>
    import {onMounted, reactive} from 'vue'
    import {useRouter} from 'vue-router'
    import {useStore} from 'vuex'
    import helper from "../util/helper";
    const router = useRouter()

    const store = useStore()


    const state = reactive({
    })


    onMounted(async () => {
        // await setProvider()
    })

    const setProvider = async () => {
        const providers = await helper.allProvider()
        for (const chainId in providers) {
            store.commit("setProvider", {chainId, provider: providers[chainId]})
        }
    }
</script>

<style>

</style>
