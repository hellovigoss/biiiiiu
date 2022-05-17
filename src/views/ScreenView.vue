<template>
    <el-skeleton v-if="loading" variant="image" animated :rows="10" />
    <el-row :gutter="20">
        <el-col :span="8" v-for="(v, k) in screens" :key="k">
            <div class="grip-wrap">
                <div class="grid-preview">
                    <img class="grid-img" @click="capture(v.id)" :src="v.imgData" />
                </div>
            </div>
        </el-col>
    </el-row>
</template>

<script>
    import router from '../router'
    export default {
        name: 'ScreenView',
        data() {
            return {
                loading: true,
                screens: []
                }
        },
        created() {
            // do get screens
            window.electronAPI.send({
                action: 'get-screens'
                }, (data) => {
                    this.loading = false
                    this.screens = data.data.sources
                })
        },
        methods: {
            capture(sourceId) {
                router.push(`/capture/${sourceId}`)
                // let ele = document.getElementById('video')
                // ele.autoPlay = true
                // ele.mutiple = true
                // window.electronAPI.capture(sourceId, ele)
            }
        }
    }
</script>

<style>
    .grip-wrap {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 300px;
        width: 100%;
    }

    .grid-preview {
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .grid-img {
        display: flex;
        width: 100%;
        border-radius: var(--el-border-radius-base);
        box-shadow: var(--el-box-shadow-lighter);
        background-color: var(--el-color-background-base);
    }
    .grid-img:hover {
        cursor: pointer;
        box-shadow: var(--el-box-shadow-light);
    }
</style>