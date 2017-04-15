<template>
  <div>
    <v-list-item>
        <v-list-tile>
            <v-list-tile-avatar>
                <v-icon v-if="file.type == 'video'" class="blue white--text">videocam</v-icon>
                <v-icon v-if="file.type == 'image'" class="teal white--text">insert_photo</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
                <v-list-tile-title>{{ file.name }}</v-list-tile-title>
                <v-list-tile-sub-title>{{ file.path }}</v-list-tile-sub-title>
            </v-list-tile-content>
            <v-list-tile-avatar v-if="!file.isHaveWatermark">
                <v-progress-circular 
                    indeterminate 
                    :size="40" 
                    :width="5"
                    class="primary--text"/>
            </v-list-tile-avatar>
            <v-list-tile-action v-if="file.isHaveWatermark">
                <v-btn @click.native="handleSave" icon ripple>
                    <v-icon class="pink--text text--lighten-1">file_download</v-icon>
                </v-btn>
            </v-list-tile-action>
        </v-list-tile>
    </v-list-item>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import { remote } from 'electron';
import { copy } from 'core/fs';

export default {
  name: 'v-file',
  props: ['file'],
  methods: {
    handleSave() {
        remote.dialog.showSaveDialog({
            title: 'Сохранить',
            defaultPath: this.file.path
        }, filename => {
            if (filename) {
                copy(this.file.output, filename, () => {
                    console.log('COPITED')
                });
            }
        })
    }
  }
}

</script>
