<template>
    <v-toolbar class="indigo">
        <v-btn @click.native="$router.push('/')" icon>
            <v-icon class="white--text">arrow_back</v-icon>
        </v-btn>
        <v-toolbar-title>Настройки</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn @click.native="$router.push('/')" icon>
            <v-icon>home</v-icon>
        </v-btn>
    </v-toolbar>
</template>


<script>
export default {
    name: 'toolbar'
}

</script>