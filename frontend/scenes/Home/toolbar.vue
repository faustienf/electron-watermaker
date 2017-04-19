<template>
    <v-toolbar class="indigo">
        <v-toolbar-title>WaterMaker</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn @click.native="chooseFile" class="pink" primary dark>
            выбрать файл
            <v-icon right>cloud_upload</v-icon>
        </v-btn>
        <v-btn @click.native="$router.push('/settings')" icon>
            <v-icon>settings</v-icon>
        </v-btn>
    </v-toolbar>
</template>


<script>
export default {
    name: 'toolbar',
    methods: {
        chooseFile() {
            this.$root.$emit('file:import')
        }
    }
}

</script>