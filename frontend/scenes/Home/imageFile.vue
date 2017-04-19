<template>
    <v-list-item>
        <v-list-tile>
            <v-list-tile-avatar>
                <v-icon class="teal white--text">insert_photo</v-icon>
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
                <v-btn @click.native="exportFile()" icon ripple>
                    <v-icon class="pink--text text--lighten-1">file_download</v-icon>
                </v-btn>
            </v-list-tile-action>
        </v-list-tile>
        <div class="hide">
            <canvas ref="canvas"></canvas>
        </div>
    </v-list-item>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { ipcRenderer } from 'electron'

export default {
    name: 'file',
    props: ['file'],
    data() {
        return {
            margin: 50,
            $logo: null,
            $watermark: null,
            $baseImg: null
        }
    },
    mounted() {
        const logoPromise = new Promise((resolve, reject) => {
            const logo = new Image();
            logo.src = this.logoPath;
            logo.onload = () => {
                this.$logo = logo
                resolve()
            }
        })

        const watermarkPromise = new Promise((resolve, reject) => {
            const watermark = new Image();
            watermark.src = this.watermarkPath;
            watermark.onload = () => {
                this.$watermark = watermark
                resolve()
            }
        })

        const baseImgPromise = new Promise((resolve, reject) => {
            const baseImg = new Image();
            baseImg.src = 'file://' + this.file.path
            baseImg.onload = () => {
                this.$baseImg = baseImg
                resolve()
            }
        })

        Promise.all([
            logoPromise, 
            watermarkPromise, 
            baseImgPromise
        ]).then(this.drawWatermarks)
    },
    computed: {
        ...mapGetters([
            'logoPath',
            'watermarkPath'
        ]),
    },
    methods: {
        exportFile() {
            this.$root.$emit('file:export', this.file)
        },
        drawWatermarks() {
            const canvas = this.$refs.canvas;
            this.context = canvas.getContext('2d');     

            canvas.width  = this.$baseImg.width;
            canvas.height = this.$baseImg.height; 
            canvas.style.width  = this.$baseImg.width + 'px';
            canvas.style.height = this.$baseImg.height + 'px';

            this.context.drawImage(this.$baseImg, 0, 0);
            // top-left
            this.context.drawImage(
                this.$watermark, 
                this.margin, 
                this.margin
            );
            // top-right
            this.context.drawImage(
                this.$watermark, 
                canvas.width - this.$watermark.width - this.margin, 
                this.margin
            );
            // bottom-right
            this.context.drawImage(
                this.$watermark,
                this.margin, 
                canvas.height - this.$watermark.height - this.margin
            );
            // left-top-middle
            this.context.drawImage(
                this.$watermark,
                canvas.width / 4 + this.margin, 
                canvas.height / 4 + this.margin
            );
            // left-bottom-middle
            this.context.drawImage(
                this.$watermark,
                canvas.width / 4 + this.margin, 
                canvas.height - canvas.height / 4 - this.$watermark.height - this.margin
            );
            // right-top-middle
            this.context.drawImage(
                this.$watermark,
                canvas.width - canvas.width / 4 - this.$watermark.height - this.margin, 
                canvas.height / 4 + this.margin
            );
            // right-bottom-middle
            this.context.drawImage(
                this.$watermark,
                canvas.width - canvas.width / 4 - this.$watermark.height - this.margin, 
                canvas.height - canvas.height / 4 - this.$watermark.height - this.margin
            );
            // right-bottom-middle
            this.context.drawImage(
                this.$logo,
                canvas.width - this.$logo.width - this.margin, 
                canvas.height - this.$logo.height - this.margin
            );

            const base64 = canvas.toDataURL('image/jpeg', 0.5)

            const file = {
                ...this.file,
                base64 
            }

            ipcRenderer.send('image:save', file)
        }
    }
}

</script>
