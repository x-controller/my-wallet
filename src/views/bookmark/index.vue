<template>
    <div>
        <div v-if="state.groups">
            <div v-for="(group,index) in state.groups" :key="index">
                <el-tooltip placement="right" effect="light">
                    <template #content>
                        <div v-if="group.bookmarks" style="height: 200px;overflow: auto">
                            <div v-for="(bookmark,key) in group.bookmarks" :key="key">
                                <el-button @click="onClick(bookmark)">{{bookmark.title}}</el-button>
                            </div>
                        </div>
                    </template>
                    <el-button>{{group.name}}</el-button>
                </el-tooltip>
            </div>
        </div>
    </div>
</template>

<script setup>
    import {reactive, onMounted} from "vue"
    import {useRouter} from "vue-router"

    const router = useRouter()

    const state = reactive({
        groups: null
    })

    onMounted(() => {
        state.groups = [
            {
                "name": "我的书签", bookmarks: [
                    {title: "百度", url: "http://baidu.com"},
                    {title: "百度", url: "http://baidu.com"},
                    {title: "百度", url: "http://baidu.com"},
                    {title: "百度", url: "http://baidu.com"},
                    {title: "百度", url: "http://baidu.com"},
                    {title: "百度", url: "http://baidu.com"},
                    {title: "百度", url: "http://baidu.com"},
                    {title: "百度", url: "http://baidu.com"},
                    {title: "百度", url: "http://baidu.com"},
                    {title: "百度", url: "http://baidu.com"},
                ]
            },
            {
                "name": "我的书签", bookmarks: [
                    {title: "腾讯腾讯腾讯腾讯腾讯腾讯腾讯腾讯腾讯腾讯腾讯腾讯腾讯腾讯", url: "http://baidu.com"},
                    {title: "腾讯", url: "http://baidu.com"},
                    {title: "腾讯", url: "http://baidu.com"},
                    {title: "腾讯", url: "http://baidu.com"},
                    {title: "腾讯", url: "http://baidu.com"},
                    {title: "腾讯", url: "http://baidu.com"},
                    {title: "百度", url: "http://baidu.com"},
                    {title: "百度", url: "http://baidu.com"},
                    {title: "百度", url: "http://baidu.com"},
                    {title: "百度", url: "http://baidu.com"},
                ]
            }
        ]
    })

    const onClick = (bookmark) => {
        alert(bookmark.url)
    }
</script>

<style scoped>


</style>