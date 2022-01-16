<template>
    <div>
        <el-tabs
                v-model="state.tabNow"
                type="border-card"
                closable
                @tab-remove="onRemoveTab"
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
    import {reactive,onMounted,watch,computed} from "vue"
    import { useStore } from "vuex"

    const store = useStore()

    watch(()=>store.state.mainTabs,(newMainTabs)=>{
        console.log(newMainTabs)
    })

    let tabIndex = -1
    const state = reactive({
        tabNow: store.state.mainTabNow,
        tabs: computed(()=> store.state.mainTabs)
    })

    onMounted(()=>{
        onInsertTab()
    })

    const onInsertTab = () => {
        tabIndex += 1
        store.commit('insertMainTab',{
            title: 'Tab ',
            key: tabIndex,
            content: 'Tab content',
        })
    }

    const onRemoveTab = (index) => {
        state.tabs.splice(index, 1)
    }
</script>

<style scoped>

</style>