<template>
    <v-card>
        <toolbar/>
        <v-list two-line subheader>
            <v-subheader inset>Файлы</v-subheader>
            <File v-for="(file, index) in files" :key="index" :file="file"/>
        </v-list>
    </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import Toolbar from './toolbar.vue';
import File from './file.vue';

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
    }
}

</script>
