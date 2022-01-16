<template>
    <el-tag size="small">{{state.year}}-{{state.month}}-{{state.date}} {{state.hour}}:{{state.minute}}:{{state.second}}
    </el-tag>
</template>

<script setup>
    import {onMounted, reactive} from 'vue'

    const state = reactive({
        year: 0,
        month: 0,
        date: 0,
        hour: 0,
        minute: 0,
        second: 0
    })


    onMounted(() => {
        runTime()
        setInterval(() => {
            runTime()
        }, 1000)
    })

    const runTime = () => {
        const time = new Date()
        const map = [
            {name: "year", func: "getFullYear"},
            {name: "month", func: "getMonth", add: 1},
            {name: "date", func: "getDate"},
            {name: "hour", func: "getHours"},
            {name: "minute", func: "getMinutes"},
            {name: "second", func: "getSeconds"},
        ]

        for (let i = 0; i < map.length; i++) {
            const item = map[i]
            let value = time[item.func]()
            if (item.add) value += item.add
            if (value < 10) value = "0" + value
            state[map[i].name] = value
        }
    }

</script>

<style>

</style>
