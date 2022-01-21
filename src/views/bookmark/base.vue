<template>
    <div>
        <router-view></router-view>
    </div>
</template>

<script setup>
    import {reactive} from "vue"
    import {useRouter} from "vue-router"

    const router=useRouter()

    const state = reactive({

    })
</script>

<style scoped>


</style>