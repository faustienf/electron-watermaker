<template>
    <v-list-item>
        <v-list-tile>
            <v-list-tile-avatar>
                <v-icon class="lime white--text">videocam</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
                <v-list-tile-title>{{ file.name }}</v-list-tile-title>
                <v-list-tile-sub-title>{{ file.path }}</v-list-tile-sub-title>
            </v-list-tile-content>
            <v-list-tile-action>
                <v-btn v-if="file.isHaveWatermark" @click.native="exportFile()" icon ripple>
                    <v-icon class="pink--text text--lighten-1">file_download</v-icon>
                </v-btn>
                <v-chip v-if="!file.isHaveWatermark" class="indigo white--text">
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
