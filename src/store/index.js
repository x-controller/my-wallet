import {createStore} from 'vuex'

export const store = createStore({
    state() {
        return {
            allProvider: {},
            mainTabs:[],
            mainTabNow:0
        }
    },
    mutations: {
        setState(state, {name, value}) {
            state[name] = value
        },
        setProvider(state, {chainId, provider}) {
            const allProvider = state.allProvider
            allProvider[chainId] = provider
            state.allProvider = allProvider
        },
        insertMainTab (state,{title,content,key}){
            state.mainTabs.push({title,content,key})
        }
    }
})