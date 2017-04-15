export function createStore(state = {}) {
    return {
        state: {
            files: [],
            ...state
        },
        mutations: {
            addFile(state, file) {
                state.files.push(file)
            },
            updateFile(state, newFile) {
                const index = state.files.findIndex(f => f.id === newFile.id);
                if (index !== -1) {
                    const files = state.files.concat([]);
                    files[index] = newFile
                    console.log(files);
                    state.files = files;
                }
            }
        },
        actions: {
            UPDATE_FILE({ commit }, file) {
                commit('updateFile', file)
            },
            ADD_FILE({ commit }, file) {

                if (!file.path) {
                    throw new Error('file not exists');
                }

                const isHaveWatermark = false;

                commit('addFile', {...file, isHaveWatermark})
            }
        }
    }
}