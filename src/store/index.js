import {createStore} from 'vuex'

export const store = createStore({
    strict: process.env.NODE_ENV !== 'production',
    state() {
        return {
            mainTabs: [],
            mainTabNow: "0",
        }
    },
    mutations: {
        // 保存钱包
        saveWallet(state, payload) {

        },
        setState(state, {name, value}) {
            state[name] = value
        },
        // 添加标签页
        insertMainTab(state, {title, name, content, closeable}) {
            const tabs = state.mainTabs
            tabs.push({title, name, content, closeable})
            state.mainTabs = tabs
        },
        removeMainTab(state, name) {
            if (state.mainTabNow === name) {
                for (let i = 0; i < state.mainTabs.length; i++) {
                    if (state.mainTabs[i].name === name) {
                        const next = state.mainTabs[i + 1] || state.mainTabs[i - 1]
                        if (next) state.mainTabNow = next.name
                    }
                }
            }
            state.mainTabs = state.mainTabs.filter((tab) => tab.name !== name)
        }
    }
})