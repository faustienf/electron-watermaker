import { ipcRenderer, remote } from 'electron'
import { basename, dirname, extname, join } from 'path'
import { fileIs } from 'core/fs'
import { hash } from 'core/hash'
import uuid from 'uuid/v4'

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
            exportFile({ commit }, file) {
                remote.dialog.showSaveDialog({
                    title: 'Сохранить',
                    defaultPath: join(
                        dirname(file.path), 
                        file.name.replace(extname(file.name),'') + '_watermarked' + extname(file.output)
                    )
                }, input => {
                    if (input) {
                        ipcRenderer.send('file:export', {
                            input,
                            output: file.output
                        })
                    }
                })
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
                                type: fileIs('video', path) ? 'video' : 'image'
                            }

                            commit('ADD_FILE', file)
                            if (file.type === 'video') {
                                ipcRenderer.send('video:save', file)
                            }
                        })
                    }
                })
            },
            createImage({ commit }, file) {
                ipcRenderer.send('image:save', file)
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