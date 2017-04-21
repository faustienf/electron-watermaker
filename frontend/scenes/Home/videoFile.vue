<template>
    <v-list-item>
        <v-list-tile>
            <v-list-tile-avatar>
                <v-icon class="cyan white--text">videocam</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
                <v-list-tile-title>{{ file.name }}</v-list-tile-title>
                <v-list-tile-sub-title>{{ file.path }}</v-list-tile-sub-title>
            </v-list-tile-content>
            <v-list-tile-action v-if="file.isHaveWatermark">
                <v-btn @click.native="exportFile()" icon ripple>
                    <v-icon class="pink--text text--lighten-1">file_download</v-icon>
                </v-btn>
            </v-list-tile-action>
            <v-list-tile-action v-if="!file.isHaveWatermark">
                <v-chip class="white indigo--text">
                    {{ file.size }}
                </v-chip>
            </v-list-tile-action>
        </v-list-tile>
    </v-list-item>
</template>

<script>
import { mapActions } from 'vuex';

export default {
    name: 'video-file',
    props: ['file'],
    methods: {
        exportFile() {
            this.$root.$emit('file:export', this.file)
        },
    }
}

</script>
