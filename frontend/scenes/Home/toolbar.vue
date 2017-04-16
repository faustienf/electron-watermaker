<template>
    <v-toolbar class="light-blue">
        <v-toolbar-side-icon></v-toolbar-side-icon>
        <v-toolbar-title>My files</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn @click.native="handleClick" class="pink" primary dark>
            выбрать файл
            <v-icon right>cloud_upload</v-icon>
        </v-btn>
        <v-btn @click.native="$router.push('/settings')" icon>
            <v-icon>settings</v-icon>
        </v-btn>
    </v-toolbar>
</template>


<script>
import uuid from 'uuid/v4'
import { mapActions } from 'vuex'
import { ipcRenderer, remote } from 'electron'
import { basename } from 'path'

export default {
    name: 'toolbar',
    methods: {
        ...mapActions([
            'addFile'
        ]),
        handleClick(e) {
            this.addFile();
            return;
            remote.dialog.showOpenDialog((fileNames) => {
                if (fileNames && fileNames.length) {
                    fileNames.map(path => {

                        const file = {
                            id: uuid(),
                            name: basename(path),
                            path,
                            type: 'video'
                        }

                        this.addFile(file);

                        ipcRenderer.send('queue:add', file)
                    })
                }
            })
        }
    }
}

</script>