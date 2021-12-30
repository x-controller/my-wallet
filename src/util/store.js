import {ipcMain} from "electron"

const Store = require('electron-store')


ipcMain.handle('getStoreValue', (event, name, key) => {
    const store = new Store({name,encryptionKey:"love"})
    return store.get(key)
})

ipcMain.handle('setStoreValue', (event, name, key, value) => {
    const store = new Store({name,encryptionKey:"love"})
    return store.set(key, value)
})