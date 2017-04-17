<template>
    <v-toolbar class="indigo">
        <v-toolbar-side-icon></v-toolbar-side-icon>
        <v-toolbar-title>My files</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn @click.native="addFile" class="pink" primary dark>
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
        ])
    }
}

</script>