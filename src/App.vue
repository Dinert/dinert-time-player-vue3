
<script setup lang="ts">
import {ref, onMounted} from 'vue'
import {DinertTimePlayer} from './components/index'
const timePlayerRef = ref<InstanceType<typeof DinertTimePlayer>>()

onMounted(() => {
})

const animateAfter = (config: any) => {
    console.log(config, 'animateAfter')
}
</script>
<template>
    <div class="app">
        <dinert-time-player ref="timePlayerRef" @animate-after="animateAfter"/>
        <div class="button">
            <button type="button" @click="timePlayerRef?.startPlay()">开始播放</button>
            <button type="button" @click="timePlayerRef?.stopPlay()">停止播放</button>
        </div>
    </div>
</template>
<style lang="scss" scoped>

.app {
    margin-top: 80px;
}

.button {
    margin: 20px auto;
    text-align: center;

    button {
        margin-left: 20px;
    }
}
</style>
