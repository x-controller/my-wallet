import {ethers} from "ethers"

const createWallet = () => {
    return ethers.Wallet.createRandom()
}

export default {
    createWallet
}