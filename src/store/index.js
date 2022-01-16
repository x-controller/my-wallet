import {createStore} from 'vuex'

export const store = createStore({
    state() {
        return {
            wallets: {},
            mainTabs: [],
            mainTabNow: "0",
        }
    },
    mutations: {
        setWalletAttr(state, {name, attr, value}) {
            state.wallets[name][attr] = value
        },
        setWallets(state, wallets) {
            state.wallets = wallets
        },
        setState(state, {name, value}) {
            state[name] = value
        },
        // 添加标签页
        insertMainTab(state, {title, name, content, closeable}) {
            const tabs = state.mainTabs
            let exist = false
            for (let i = 0; i < tabs.length; i++) {
                if (tabs[i].name === name) {
                    state.mainTabNow = name
                    exist = true
                }
            }
            if (!exist) {
                tabs.push({title, name, content, closeable})
                state.mainTabs = tabs
                state.mainTabNow = name
            }
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