<template>
    <el-row :gutter="20">
        <el-col :offset="4" :span="16">
            <div class="video-wrap">
                <video id="preview-v" muted="muted" autoplay="autoplay"></video>
            </div>
        </el-col>
    </el-row>
    <el-row :gutter="20" :justify="center" :align="middle">
        <el-col :span="10" :offset="7">
            <a
                href="javascript:;"
                @click="share(shareUrl)"
                class="el-button el-button--primary">
                <el-input v-model="input" :value="shareUrl" disabled="disabled"/>
            </a>
        </el-col>
    </el-row>
    <el-row :gutter="20" :justify="center" :align="middle">
        <el-col :span="4" :offset="10">
            <a href="javascript:;" @click="goHome()" class="el-button el-button--primary">Go to Home</a>
        </el-col>
    </el-row>
</template>

<script>
    const urlPrefix = "http://42.192.18.81:8082/ws-recver.html?socketid="
    import msg from '@/assets/libs/msg'
    import constants from '@/assets/libs/constant.js'

    export default {
        name: 'CaptureView',
        methods: {
            goHome() {
                msg.resetPeer()
                this
                    .$router
                    .push('/')
            },
            share() {
              window.electronAPI.copy(this.shareUrl)
                ElNotification(
                    {title: '立即分享', message: '远程投屏url复制成功，请分享并粘贴到浏览器打开', type: 'success'}
                )
            }
        },
        mounted() {
            window
                .electronAPI
                .capture(
                    this.$route.params.screen,
                    document.getElementById('preview-v'),
                    () => {
                        let pc = new RTCPeerConnection({
                            iceServers: [
                                {
                                    urls: constants.stun
                                }
                            ]
                        });
                        (async () => {
                            let socket = await msg.connect(constants.ws)
                            this.shareUrl = urlPrefix + socket
                                .id
                                msg
                                .listen(data => {
                                    switch (data.action) {
                                        case "pair":
                                            (async () => {
                                                let offer = await pc.createOffer()
                                                pc.setLocalDescription(offer)
                                                msg.send("offer", {offer: offer})
                                            })();
                                            break
                                        case "answer":
                                            pc.setRemoteDescription(data.answer)
                                            break
                                        default:
                                            break
                                    }
                                })

                            pc.oniceconnectionstatechange = () => {
                                if (pc.iceConnectionState == 'connected') {
                                    // window     .electronAPI     .setTitle("sharing...")
                                }
                                if (pc.iceConnectionState == 'disconnected') {
                                    // window     .electronAPI     .setTitle("disconnected")
                                    msg.resetPeer()
                                    // window     .electronAPI     .setTitle("capturing...")
                                }
                            }

                            pc.onicecandidate = e => {
                                if (e.candidate) {
                                    msg.send("candidate", {candidate: e.candidate})
                                }
                            }

                            pc.onnegotiationneeded = async () => {
                                let offer = await pc.createOffer()
                                pc.setLocalDescription(offer)
                                msg.send("offer", {offer: offer})
                            }

                            let orgiStream = document
                                .querySelector("#preview-v")
                                .srcObject
                                orgiStream
                                .getTracks()
                                .forEach(track => pc.addTrack(track, orgiStream))
                        })()
                    }
                )
        },
        data() {
            return {screen: null, shareUrl: null}
        }
    }
</script>

<style>
    .video-wrap video {
        width: 100%;
        border-radius: var(--el-border-radius-round);
        box-shadow: var(--el-box-shadow-dark);
    }
</style>