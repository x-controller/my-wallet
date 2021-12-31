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
    const newWallet = {
        "name": name,
        "encrypt": encryptStr,
        "address": wallet.address,
        "chainId": chainId
    }
    await ipcRenderer.invoke('setStoreValue', "my-wallet/wallets", `wallets.${name}`, JSON.stringify(newWallet))
    return newWallet
}

const ipcInvoke = async (channel, ...args) => {
    return await ipcRenderer.invoke(channel, ...args)
}


const getWallets = async () => {
    return await ipcInvoke("getStoreValue", "my-wallet/wallets", "wallets")
}

const deleteWallet = async (name) => {
    return await ipcInvoke("delStoreValue", "my-wallet/wallets", `wallets.${name}`)
}

const allProvider = async () => {
    let rpc = await ipcInvoke("getStoreValue", "my-wallet/chains", "chains")
    rpc = rpc || {
        "20181205": "https://sg.node.quarkblockchain.org",
        "128": "https://http-mainnet.hecochain.com",
        "56": "https://bsc-dataseed1.binance.org"
    }
    const providers = {}
    for (const chainId in rpc) {
        const provider = new ethers.providers.JsonRpcProvider(rpc[chainId])
        console.log(
            chainId,
            await provider.getBlockNumber()
        )
        providers[chainId] = provider
    }
    return providers
}

export default {
    createWallet,
    importPrivateKey,
    walletNameExist,
    getWallets,
    deleteWallet,
    allProvider
}