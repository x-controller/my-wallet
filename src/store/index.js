import {createStore} from 'vuex'

export const store = createStore({
    state() {
        return {
            allProvider: {}
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
        }
    }
})