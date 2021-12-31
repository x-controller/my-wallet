import {ipcMain} from "electron"

const Store = require('electron-store')

ipcMain.handle('getStoreValue', (event, name, key) => {
    const store = new Store({name, encryptionKey: "my-wallet"})
    return store.get(key)
})

ipcMain.handle('setStoreValue', (event, name, key, value) => {
    const store = new Store({name, encryptionKey: "my-wallet"})
    return store.set(key, value)
})

ipcMain.handle('delStoreValue', (event, name, key) => {
    const store = new Store({name, encryptionKey: "my-wallet"})
    return store.delete(key)
})

ipcMain.handle('hasStoreValue', (event, name, key) => {
    const store = new Store({name, encryptionKey: "my-wallet"})
    return store.has(key)
})