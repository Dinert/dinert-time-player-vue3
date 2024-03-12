
<script setup lang="ts">
import {ref} from 'vue'
import {DinertTimePlayer} from './components/index'
const timePlayerRef = ref<InstanceType<typeof DinertTimePlayer>>()
const timePlayerRef2 = ref<InstanceType<typeof DinertTimePlayer>>()

const animateAfter = (config: any) => {
    console.log(config, 'animateAfter')
}
</script>
<template>
    <div class="app">
        <h1>Vue3时间轴播放器</h1>

        <div>
            <dinert-time-player ref="timePlayerRef" @animate-after="animateAfter"/>
            <div class="button">
                <button type="button" @click="timePlayerRef?.startPlay()">开始播放</button>
                <button type="button" @click="timePlayerRef?.stopPlay()">停止播放</button>
            </div>

        </div>
        <div>
            <dinert-time-player ref="timePlayerRef2" class="light"
                @animate-after="animateAfter"
            />
            <div class="button">
                <button type="button" @click="timePlayerRef2?.startPlay()">开始播放</button>
                <button type="button" @click="timePlayerRef2?.stopPlay()">停止播放</button>
            </div>

        </div>

    </div>
</template>

<style lang="scss" scoped>

.app {
    overflow: hidden;
    height: 100%;
    background-color: #f5f5f5;

    h1 {
        text-align: center;
    }

    & > div {
        margin-top: 120px;
    }
}

.button {
    margin: 20px auto;
    text-align: center;

    button {
        margin-left: 20px;
    }
}
</style>

<style lang="scss">
    html,
    body {
        margin: 0;
        padding: 0;
        height: 100%;
    }
</style>
