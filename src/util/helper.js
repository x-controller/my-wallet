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
    await ipcRenderer.invoke('setStoreValue', "my-wallet/wallets", `wallets.${name}`, newWallet)
    return newWallet
}

const saveWalletAttr = async (name, attr, value) => {
    await ipcRenderer.invoke('setStoreValue', "my-wallet/wallets", `wallets.${name}.${attr}`, value)
}

const ipcInvoke = async (channel, ...args) => {
    return await ipcRenderer.invoke(channel, ...args)
}

// 取全部钱包
const getWallets = async () => {
    return await ipcInvoke("getStoreValue", "my-wallet/wallets", "wallets")
}

// 取指定钱包
const getWallet = async (name) => {
    return await ipcInvoke("getStoreValue", "my-wallet/wallets", `wallets.${name}`)
}

// 删除钱包
const deleteWallet = async (name) => {
    return await ipcInvoke("delStoreValue", "my-wallet/wallets", `wallets.${name}`)
}

// 设置钱包支持链的provider
const allProvider = async () => {
    let rpc = await ipcInvoke("getStoreValue", "my-wallet/chains", "chains")
    rpc = rpc || {
        "20181205": "https://hz.rpc.qkiscan.cn",
        "128": "https://http-mainnet.hecochain.com",
        "56": "https://bsc-dataseed1.binance.org"
    }
    const providers = {}
    for (const chainId in rpc) {
        const provider = await getProvider(rpc[chainId])
        console.log(
            chainId,
            await provider.getBlockNumber()
        )
        providers[chainId] = provider
    }
    return providers
}

// 确保provider被取到
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
    saveWalletAttr(wallet.name, "balance", wallet.balance).then()
    console.log(wallet.balance)
    return wallet.balance
}

export default {
    syncBalance,
    getWatchWallets,
    saveWatchWallet,
    createWallet,
    importPrivateKey,
    walletNameExist,
    getWallets,
    deleteWallet,
    allProvider,
    getWallet,
    getWalletAssets,
    getRunRpcUrl,
    setWalletAsset,
    emitter
}