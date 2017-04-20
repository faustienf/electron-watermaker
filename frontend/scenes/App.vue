<template>
    <div>
        <router-view/>
        <v-snackbar 
            :timeout="timeout"
            :bottom="true"
            v-model="snackbar">
            Сохранено
            <v-btn flat class="pink--text" @click.native="snackbar = false">ЗАКРЫТЬ</v-btn>
        </v-snackbar>
    </div>
</template>

<script>
import { basename, dirname, extname, join } from 'path'
import { fileIs } from 'core/fs'
import { ipcRenderer, remote } from 'electron'
import { FileModel } from 'models/FileModel'
import { mapActions } from 'vuex'


export default {
    name: 'app',
    data() {
        return {
            timeout: 2000,
            snackbar: false
        }
    },
    created() {
        this.$root.$on('file:export', this.fileExport)
        this.$root.$on('file:import', this.fileImport)
        this.$root.$on('asset:import', this.assetImport)

        ipcRenderer.on('file:error', this.handleError)
        ipcRenderer.on('file:exported', this.handleFileExport)
        ipcRenderer.on('file:finish', this.handleFileFinish)
        ipcRenderer.on('file:progress', this.handleFileProgress)

        ipcRenderer.on('assets:saved', this.handleAssetExport)
    },
    destroyed() {
        this.$root.$off('file:export', this.export)
        this.$root.$off('file:import', this.fileImport)
        this.$root.$off('asset:import', this.assetImport)

        ipcRenderer.removeListener('file:error', this.handleError)
        ipcRenderer.removeListener('file:exported',  this.handleFileExport)
        ipcRenderer.removeListener('file:finish', this.handleFileFinish)
        ipcRenderer.removeListener('file:progress', this.handleFileProgress)

        ipcRenderer.removeListener('assets:saved', this.handleAssetExport)
    },
    methods: {
        ...mapActions([
            'addFile',
            'updateFile',
            'updateHash'
        ]),
        handleFileExport(e) {
            this.snackbar = true;
        },
        handleFileProgress(e, file) {
            this.updateFile(file)
        },
        handleError(e, err) {
            console.log(err);
            if (err) throw new Error(err);
        },
        handleAssetExport(e) {
            this.updateHash()
        },
        assetImport(type) {
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

                    ipcRenderer.send('assets:save', file)
                }
            })
        },
        fileExport(file) {
            remote.dialog.showSaveDialog({
                title: 'Сохранить',
                defaultPath: join(
                    dirname(file.path), 
                    file.name.replace(extname(file.name),'') + '_watermarked' + extname(file.output)
                )
            }, input => {
                if (!input) return;

                ipcRenderer.send('file:export', {
                    input,
                    output: file.output
                })
            })
        },
        fileImport() {
            remote.dialog.showOpenDialog((fileNames) => {
                if (fileNames && fileNames.length) {
                    fileNames.map(path => {
                        const file = new FileModel(path)
                        this.addFile(file)

                        if (file.type === 'video') {
                            ipcRenderer.send('video:save', file)
                        }
                    })
                }
            })
        },
        handleFileFinish(e, {err, res}) {
            console.log(err);
            if (err) throw new Error(err);

            this.updateFile(res)
        }
    }
}

</script>
