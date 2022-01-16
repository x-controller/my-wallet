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
                {{ item.content }}
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script setup>
    import {reactive, onMounted, watch, computed} from "vue"
    import {useStore} from "vuex"

    const store = useStore()

    watch(() => store.state.mainTabs, (newMainTabs) => {
        console.log(newMainTabs.length)
    })

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
        onInsertTab()
    })

    const onClockTab = () => {
        onInsertTab()
    }

    const onInsertTab = () => {
        store.commit('insertMainTab', {
            title:  new Date().getTime()+"",
            name: new Date().getTime()+"",
            content:  new Date().getTime()+"",
        })
    }

    const onRemoveTab = (name) => {
        store.commit("removeMainTab", name)
    }
</script>

<style scoped>

</style>