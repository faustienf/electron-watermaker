<template>
  <div>
    <v-card>
        <toolbar/>
        <v-list two-line subheader>
            <v-subheader inset>Files</v-subheader>
            <File v-for="(file, index) in files" :key="index" :file="file"/>
        </v-list>
    </v-card>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { ipcRenderer } from 'electron';
import Toolbar from './toolbar.vue';
import File from './file.vue';

function onFinish(e, {err, res}) {
    console.log(err);
    if (err) throw new Error(err);

    this.updateFile(res)
}

function onError(e, err) {
    console.log(err);
    if (err) throw new Error(err);
}

export default {
    name: 'home',
    components: {
        File,
        Toolbar
    },
    computed: {
        ...mapGetters([
            'files'
        ])
    },
    created() {
        ipcRenderer.on('file:finish', onFinish)
        ipcRenderer.on('file:error', onError)
    },
    destroyed() {
        ipcRenderer.removeListener('file:finish', onFinish)
        ipcRenderer.removeListener('file:error', onError)
    },  
    methods: {
        ...mapActions([
            'updateFile'
        ])
    }
}

</script>
