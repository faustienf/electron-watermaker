<template>
    <v-toolbar class="indigo">
        <v-toolbar-side-icon></v-toolbar-side-icon>
        <v-toolbar-title>My files</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn @click.native="handleClick" class="pink" primary dark>
            выбрать файл
            <v-icon right>cloud_upload</v-icon>
        </v-btn>
    </v-toolbar>
</template>


<script>
import uuid from 'uuid/v4';
import { mapActions } from 'vuex';
import { ipcRenderer, remote } from 'electron';


export default {
    name: 'toolbar',
    methods: {
        ...mapActions({
            addFile: 'ADD_FILE'
        }),
        handleClick(e) {
            remote.dialog.showOpenDialog((fileNames) => {
                if (fileNames && fileNames.length) {
                    fileNames.map(path => {

                        const file = {
                            id: uuid(),
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