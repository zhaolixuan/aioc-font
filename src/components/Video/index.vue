<template>
    <div class="viodeBox">
        <video muted autoplay :controls="false" style="object-fit: fill;" width="100%" height="100%" :id="id"
            class="video"></video>
    </div>
</template>

<script>
import flv from 'flv.js'
export default {
    name: 'Video',
    props: {
        videoInfo: Object,
        id: String
    },

    data() {
        return {
            flvUrl: '',
            player: null
        }
    },
    mounted() {

    },
    watch: {
        videoInfo: {
            deep: true,
            handler(newValue) {
                if (newValue.flvUrl) {
                    this.flvUrl = newValue.flvUrl
                    this.createdPlay(this.flvUrl)
                }

            }
        }
    },
    methods: {
        // 检测浏览器是否支持 flv.js
        createdPlay(url) {
            var videoElement = document.getElementById(this.id)
            if (!videoElement) {
                if (this.player !== null) {
                    this.player.pause();
                    this.player.unload();
                    this.player.detachMediaElement();
                }
            }
            if (flv.isSupported()) {
                if (!this.player) {
                    this.player = flv.createPlayer({
                        type: 'flv', // 媒体类型，默认是 flv,
                        url: url, // 流地址
                    })
                } else {
                    this.player.pause()
                    this.player.unload()
                    this.player.detachMediaElement()
                    this.player.destroy()
                    this.player = null
                    this.player = flv.createPlayer({
                        type: 'flv', // 媒体类型，默认是 flv,
                        url: url, // 流地址
                    })
                }

            }
            this.player.attachMediaElement(videoElement)
            this.player.load()
        }
    },
    destroyVideos() {
        if (!this.player) return
        this.player.pause()
        this.player.unload()
        this.player.detachMediaElement()
        this.player.destroy()
        this.player = null
    }

}

</script>

<style lang="less" scoped>
.viodeBox {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    .video {
        // background: #eee;
    }

    .videoPlayer {
        width: 100%;
        height: 100%;
    }
}
</style>