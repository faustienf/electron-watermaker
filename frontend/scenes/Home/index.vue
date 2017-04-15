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
import { mapActions } from 'vuex';
import { ipcRenderer } from 'electron';
import Toolbar from './toolbar.vue';
import File from './file.vue';

export default {
  name: 'home',
  components: {
      File,
      Toolbar
  },
  computed: {
    files() {
      return this.$store.state.files;
    }
  },
  created() {
    ipcRenderer.on('file:finish', (e, {err, res}) => {
        console.log(err);
        if (err) throw new Error(err);

        this.updateFile(res)
    })
    ipcRenderer.on('file:error', (e, err) => {
        console.log(err);
        if (err) throw new Error(err);
    })
  },
  methods: {
    ...mapActions({
        updateFile: 'UPDATE_FILE'
    })
  }
}

</script>
