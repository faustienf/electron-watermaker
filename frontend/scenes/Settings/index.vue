<template>
    <v-card>
        <toolbar/>
        <v-row>
            <v-col xs12 sm8 offset-sm2 md6 offset-md3>
                <v-card-row>
                    <v-card-title>
                        Логотип
                        <v-btn icon class="pink--text" @click.native="chooseAsset('logo')">
                            <v-icon>file_upload</v-icon>
                        </v-btn>
                    </v-card-title>
                </v-card-row>
                <v-card-text class="bg-grid" @click="chooseAsset('logo')">
                    <img class="watermark" :src="logoPath">
                </v-card-text>
            </v-col>
        </v-row>
        <v-row>
            <v-col xs12 sm8 offset-sm2 md6 offset-md3>
                <v-card-row>
                    <v-card-title>
                        Водяной знак
                        <v-btn icon class="pink--text" @click.native="chooseAsset('watermark')">
                            <v-icon>file_upload</v-icon>
                        </v-btn>
                    </v-card-title>
                </v-card-row>
                <v-card-text class="bg-grid" @click="chooseAsset('watermark')">
                    <img class="watermark" :src="watermarkPath">
                </v-card-text>
            </v-col>
        </v-row>
    </v-card>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Toolbar from './toolbar.vue'

export default {
    name: 'settings',
    components: {
        Toolbar
    },
    computed: {
        ...mapGetters([
            'logoPath',
            'watermarkPath'
        ]),
    },
    methods: {
        chooseAsset(type) {
            this.$root.$emit('asset:import', type)
        }
    }
}

</script>
