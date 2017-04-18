<template>
    <div>
        <video-file v-if="fileIs('video', file.path)" :file="file"/>
        <image-file v-if="fileIs('image', file.path)" :file="file"/>
    </div>
</template>

<script>
import VideoFile from './videoFile.vue'
import ImageFile from './imageFile.vue'
import { fileIs } from 'core/fs';

export default {
    name: 'file',
    props: ['file'],
    components: {
        VideoFile,
        ImageFile
    },
    methods: {
        fileIs
    }
}

</script>
