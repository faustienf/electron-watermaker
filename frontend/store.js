import { ipcRenderer, remote } from 'electron'
import { basename } from 'path'
import uuid from 'uuid/v4'

function hash() {
    return Math.random().toString(36).substring(6);
}

export function createStore(state = {}) {
    return {
        state: {
            hash: '',
            logo: '',
            watermark: '',
            files: [],
            ...state
        },
        mutations: {
            ADD_FILE(state, file) {
                state.files.push(file)
            },
            UPDATE_FILE(state, newFile) {
                const index = state.files.findIndex(f => f.id === newFile.id);
                if (index !== -1) {
                    const files = state.files.concat([]);
                    files[index] = newFile
                    state.files = files;
                }
            },
            UPDATE_HASH(state, hash) {
                state.hash = hash
            }
        },
        actions: {
            updateFile({ commit }, file) {
                commit('UPDATE_FILE', file)
            },
            addFile({ commit }) {
                remote.dialog.showOpenDialog((fileNames) => {
                    if (fileNames && fileNames.length) {
                        fileNames.map(path => {
                            const file = {
                                id: uuid(),
                                name: basename(path),
                                isHaveWatermark: false,
                                path,
                                type: 'video'
                            }

                            commit('ADD_FILE', file)

                            ipcRenderer.send('queue:add', file)
                        })
                    }
                })
            },
            assetsSave({ commit, state }, type) {
                remote.dialog.showOpenDialog({
                    filters: [
                        {name: 'Images', extensions: ['png']}
                    ]
                },(fileNames) => {
                    if (fileNames && fileNames.length) {
                        const file = {
                            path: fileNames[0],
                            type 
                        }

                        ipcRenderer.once('assets:saved', (e) => {
                            file.path = state[type];
                            commit('UPDATE_HASH', hash())
                        })

                        ipcRenderer.send('assets:save', file)
                    }
                })
            }
        },
        getters: {
            logoPath(state) {
                return `file://${state.logo}?hash=${state.hash}`
            },
            watermarkPath(state) {
                return `file://${state.watermark}?hash=${state.hash}`
            },
            files(state) {
                return state.files
            },
            hash(state) {
                return state.hash
            },
            state(state) {
                return state
            }
        }
    }
}