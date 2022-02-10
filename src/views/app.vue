<template>
  <div class="main">
    <div style="margin: 10px 0">
      <el-button size="small" @click="onHome">home</el-button>
    </div>
    <router-view v-slot="{ Component }">
      <component :is="Component"/>
    </router-view>
  </div>
</template>

<script setup>
import {useRouter, useRoute} from "vue-router"

const route = useRoute()
const router = useRouter()

const onHome = () => {
  if (route.name !== "index") {
    router.push({name: "index"})
  }
}

</script>

<style>
::-webkit-scrollbar {
  display: none;
}
</style>
