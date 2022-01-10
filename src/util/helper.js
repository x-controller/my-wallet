import {ethers} from "ethers"
import {ipcRenderer} from "electron";

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

const ipcInvoke = async (channel, ...args) => {
    return await ipcRenderer.invoke(channel, ...args)
}


const getWallets = async () => {
    return await ipcInvoke("getStoreValue", "my-wallet/wallets", "wallets")
}

const getWallet = async (name) => {
    return await ipcInvoke("getStoreValue", "my-wallet/wallets", `wallets.${name}`)
}

const deleteWallet = async (name) => {
    return await ipcInvoke("delStoreValue", "my-wallet/wallets", `wallets.${name}`)
}

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

export default {
    createWallet,
    importPrivateKey,
    walletNameExist,
    getWallets,
    deleteWallet,
    allProvider,
    getWallet,
    getWalletAssets,
    getRunRpcUrl,
    setWalletAsset
}