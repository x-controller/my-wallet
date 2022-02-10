<template>
  <div class="main">
    <el-button size="small" v-for="(menu,index) in state.menus" :key="index" @click="router.push({name:menu.route})">
      {{ menu.title }}
    </el-button>
  </div>
</template>

<script setup>
import {reactive} from "vue"
import {useStore} from "vuex"
import {useRouter} from "vue-router"

const store = useStore()
const router = useRouter()

const state = reactive({
  menus: [
    {title: "纪念日", route: "memory-index"},
    {title: "书签", route: "bookmark-index"},
    {title: "钱包", route: "wallet-index"},
  ]
})

</script>

<style>
</style>
