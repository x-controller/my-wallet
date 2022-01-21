import {ethers} from "ethers"
import {ipcRenderer} from "electron";
import mitt from "mitt";

const providers = {}

const emitter = mitt()

const createWallet = () => {
    return ethers.Wallet.createRandom()
}

// 钱包名已经存在
const walletNameExist = async (name) => {
    return await ipcInvoke("hasStoreValue", "my-wallet/wallets", `wallets.${name}`)
}

// 私钥钱包导入
const importPrivateKey = async (privateKey, name, password, chainId) => {
    const wallet = new ethers.Wallet(privateKey)
    const encryptStr = await wallet.encrypt(password)
    name = name + `[${chainId}]`
    const newWallet = {
        "name": name,
        "encrypt": encryptStr,
        "address": wallet.address,
        "chainId": chainId
    }
    await setStoreValue("wallets", `wallets.${name}`, newWallet)
    return newWallet
}

const getStoreValue = async (name, key, defaultValue = null) => {
    const value = await ipcInvoke("getStoreValue", `my-wallet/${name}`, key)
    if (value) return value
    if (defaultValue) await setStoreValue(name, key, defaultValue)
    return defaultValue
}

const setStoreValue = async (name, key, value) => {
    return await ipcInvoke('setStoreValue', `my-wallet/${name}`, key, value)
}

const delStoreValue = async (name, key) => {
    return await ipcInvoke("delStoreValue", `my-wallet/${name}`, key)
}

const ipcInvoke = async (channel, ...args) => {
    return await ipcRenderer.invoke(channel, ...args)
}

// 取指定钱包
const getWallet = async (name) => {
    return await ipcInvoke("getStoreValue", "my-wallet/wallets", `wallets.${name}`)
}


// 设置钱包支持链的provider
const setProviders = async () => {
    let rpc = await ipcInvoke("getStoreValue", "my-wallet/chains", "chains")
    rpc = rpc || {
        "20181205": "https://hz.rpc.qkiscan.cn",
        "128": "https://http-mainnet.hecochain.com",
        "56": "https://bsc-dataseed1.binance.org"
    }
    for (const chainId in rpc) {
        const provider = await getProvider(rpc[chainId])
        setProviderEvent(provider, chainId)

        providers[chainId] = provider
    }
    return providers
}


// 设置节点事件
const setProviderEvent = (provider, chainId) => {
    provider.on("block", (blockNumber) => {
        console.log(chainId, blockNumber.toString())
        setStoreValue("common", `block-number-${chainId}`, blockNumber.toString()).then()
    })
}

// 确保节点被连接
const getProvider = async (url) => {
    let isRun = true
    let provider = null
    while (isRun) {
        try {
            provider = new ethers.providers.JsonRpcProvider(url)
            isRun = false
        } catch (e) {
            console.log(e.message)
        }
    }
    return provider
}

// 取钱包资产
const getWalletAssets = async (walletName) => {
    const assets = await ipcInvoke("getStoreValue", "my-wallet/assets", `${walletName}`)
    const data = []
    for (const address in assets) {
        data.push(assets[address])
    }
    return data
}

const getRunRpcUrl = (chainId) => {
    const rpc = {
        "20181205": "https://hz.rpc.qkiscan.cn",
        "128": "https://http-mainnet.hecochain.com",
        "56": "https://bsc-dataseed1.binance.org"
    }
    return rpc[chainId]
}

const setWalletAsset = async (walletName, asset) => {
    return await ipcRenderer.invoke('setStoreValue', "my-wallet/assets", `${walletName}.${asset.address}`, asset)
}

const saveWatchWallet = async (address, name, chainId) => {
    return await ipcRenderer.invoke('setStoreValue', "my-wallet/watches", `watches.${address}-${chainId}`, {
        address, name, chainId
    })
}

const getWatchWallets = async () => {
    return await ipcRenderer.invoke('getStoreValue', "my-wallet/watches", `watches`)
}

const getChainProvider = (chainId) => {
    if (!providers[chainId]) {
        const rpc = getRunRpcUrl(chainId)
        providers[chainId] = new ethers.providers.JsonRpcProvider(rpc)
    }
    return providers[chainId]
}

const syncBalance = async (wallet) => {
    const provider = getChainProvider(wallet.chainId)
    const balance = await provider.getBalance(wallet.address)
    wallet.balance = ethers.utils.formatEther(balance)
    setStoreValue("wallets", `wallets.${wallet.name}.balance`, balance).then()
    return wallet.balance
}

const syncChainTransfer = async (chainId) => {
    const provider = getChainProvider(chainId)
    const fromBlock = await getStoreValue("common", `transfer-sync-block-${chainId}`, 0)
    const toBlock = fromBlock + 5000
    const logs = await provider.getLogs({
        fromBlock,
        toBlock,
        topics: [
            ethers.utils.id("Transfer(address,address,uint256)"),
            null,
            null,
        ]
    })
    for (let i = 0; i < logs.length; i++) {
        const token = logs[i].address
        const amount = logs[i].data
        const from = logs[i].topics[1]
        const to = logs[i].topics[2]
        const blockNumber = logs[i].blockNumber
        const transactionIndex = logs[i].transactionIndex
        saveChainToken(chainId, token)
        saveChainTransfer(token, from, to, amount, blockNumber, transactionIndex)
    }
    await setStoreValue("common", `transfer-sync-block-${chainId}`, toBlock)
}

const saveChainToken = (chainId, token) => {

}

const saveChainTransfer = (token, from, to, amount, blockNumber, transactionIndex) => {

}

// 按数字升序排序
// https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
const arrSortNumber = (arr) => {
    arr.sort((a, b) => a - b)
    return arr
}

const arrSortAttr = (arr, attr) => {
    arr.sort((a, b) => a[attr] - b[attr])
    return arr
}

export default {
    getStoreValue,
    delStoreValue,
    setStoreValue,
    syncBalance,
    getWatchWallets,
    saveWatchWallet,
    createWallet,
    importPrivateKey,
    walletNameExist,
    setProviders,
    getWallet,
    getWalletAssets,
    getRunRpcUrl,
    setWalletAsset,
    emitter
}