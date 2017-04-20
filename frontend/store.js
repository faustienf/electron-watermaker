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
                    let currentFile = files[index]
                    files[index] = {
                        ...currentFile,
                        ...newFile,
                    }
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
            addFile({ commit }, file) {
                commit('ADD_FILE', file)
            },
            updateHash({ commit}) {
                commit('UPDATE_HASH', hash())
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