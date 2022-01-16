<template>
    <div>
        <el-tabs
                style="user-select: none"
                v-model="state.tabNow"
                type="border-card"
                closable
                @tab-remove="onRemoveTab"
                @tab-click="onClockTab"
        >
            <el-tab-pane
                    v-for="item in state.tabs"
                    :key="item.key"
                    :label="item.title"
                    :name="item.name"
            >
                <el-card :body-style="{padding:'2px'}" shadow="hover"
                         style="margin: 5px">
                    <el-tag size="small">{{item.content.name}}</el-tag>
                    <el-tag size="small">{{item.content.balance}}</el-tag>
                    <el-tag size="small">{{item.content.address}}</el-tag>
                </el-card>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script setup>
    import {reactive, onMounted, computed} from "vue"
    import {useStore} from "vuex"
    import helper from "../../util/helper"

    const store = useStore()


    const state = reactive({
        tabNow: computed({
            get() {
                return store.state.mainTabNow
            },
            set(value) {
                store.commit("setState", {name: "mainTabNow", value})
            }
        }),
        tabs: computed(() => store.state.mainTabs)
    })

    onMounted(() => {
        helper.emitter.on('check-wallet', wallet => {
            store.commit("insertMainTab", {
                title: wallet.name,
                name: `wallet-${wallet.name}`,
                content: wallet,
                closeable: true
            })
        })
    })

    const onClockTab = () => {
    }

    const onInsertTab = () => {
        store.commit('insertMainTab', {
            title: new Date().getTime() + "",
            name: new Date().getTime() + "",
            content: new Date().getTime() + "",
        })
    }

    const onRemoveTab = (name) => {
        store.commit("removeMainTab", name)
    }
</script>

<style scoped>

</style>