<template>
    <div class="viodeBox">
        <video-player ref="videoPlayer" :options="videoOptions" class="vjs-custom-skin videoPlayer"
            :playsinline="true"></video-player>
    </div>
</template>

<script>
import 'video.js/dist/video-js.css'
import { videoPlayer } from 'vue-video-player'
import 'videojs-flash'
import SWF_URL from 'videojs-swf/dist/video-js.swf'
export default {
    name: 'Video',
    props: {
        infor: {
            videoOptions: Object
        }
    },
    components: {
        videoPlayer
    },
    data() {
        return {
            videoOptions: {
                live: true,
                autoplay: true,
                fluid: true,
                notSupportedMessage: '暂时无法播放',
                controlBar: {
                    timeDivider: true,
                    durationDisplay: true,
                    remainingTimeDisplay: false,
                    fullscreenToggle: true // 全屏按钮
                },
                techOrder: ['flash'],
                flash: {
                    hls: { withCredentials: false },
                    swf: SWF_URL // 引入静态文件swf
                },
                sources: [{ // 流配置，数组形式，会根据兼容顺序自动切换
                    type: 'rtmp/mp4', // 视频格式
                    src: '' // 视频路径
                }]
            }
        }
    },
    mounted() {
    },
    watch: {

    },
    methods: {

    },
    computed: {

    }
}

</script>

<style lang="less" scoped>
.viodeBox {
    // height: 3rem;
    display: flex;
    align-items: center;
    justify-content: center;
    .videoPlayer {
  width: 100%;
  height: 100%;
}
}
</style>