# 自适应时间轴播放器

## 前言
- 这是一个从0到1实现的时间轴播放器，除了时间格式化用了第三库dayjs以外，其它的都是使用纯源生的js实现的
## 效果
![image](/src/assets/gif/time-player.gif)

### 预览地址
[https://dinert.github.io/dinert-time-player-vue3/](https://dinert.github.io/dinert-time-player-vue3/)

## 技术栈
<a href="https://github.com/vuejs/vue/tree/v3.3.4">
  <img src="https://img.shields.io/badge/vue-3.3.4-brightgreen" alt="vue">
</a>
<a href="https://dayjs.gitee.io/zh-CN/">
  <img src="https://img.shields.io/badge/dayjs-1.11.3-brightgreen" alt="vue">
</a>

## 如何安装
* 如果你使用npm
```shell
npm i @dienrt/time-player --save
```
* 或者使用yarn
```shell
yarn add @dinert/time-player
```

## 引入
```js
// main.ts
import { createApp } from 'vue'
import App from './App.vue'
import DinerTimePlayer from '@dinert/time-player'
import '@dinert/time-player/style'

const app = createApp(App)
app.use(DinerTimePlayer)
app.mount('#app')

```
### 按需导入
```js
import {DinertTimePlayer} from '@dinert/time-player'
import '@dinert/time-player/style'

  <dinert-time-player></dinert-time-player>
  export default {
    components: {
      DinertTimePlayer
    }
  }

```
## 使用
```html

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

```

## 属性
| 参数          | 说明              | 类型   | 可选值 | 默认值              |
| ------------- | ----------------- | ------ | ------ | ------------------- |
| startTime     | 开始时间          | Date   | 一     | 当前时间的前两天    |
| endTime       | 结束时间          | Date   | 一     | 当前时间的后两天    |
| currentTime   | 当前时间          | Date   | 一     | new Date()          |
| stopTime      | 时间轴停止的时间  | Date   | 一     | new Date()          |
| formatFooter  | 底部时间格式化    | String | 一     | YYYY年MM月DD日      |
| formatTooltip | tooltip时间格式化 | String | 一     | YYYY年MM月DD日 HH时 |
| interval      | 24小时时间的间隔  | Number | 一     | 3                   |
| delay         | 播放时间的间隔    | Number | 一     | 2000                |
## 方法
| 参数      | 说明                                       | 类型     |
| --------- | ------------------------------------------ | -------- |
| startPlay | 开始播放，请求数据完成，开始播放           | Function |
| stopPlay  | 停止播放，后台请求数据的时间就可以停止播放 | Function |


## 事件
| 参数           | 说明                       | 参数   | 类型     |
| -------------- | -------------------------- | ------ | -------- |
| animate-before | 当点击时间轴触发           | [看下表](./README.md#参数名称) | Function |
| animate-after  | 当点击时间轴动画完成后触发 | [看下表](./README.md#参数名称) | Function |

## 参数名称
| 名称      | 说明                           | 类型   |
| --------- | ------------------------------ | ------ |
| time      | 当前时间                       | String |
| width     | 宽度                           | number |
| percent   | 当前时间所占整体时间条的百分比 | number |
| timestamp | 当前时间的时间戳               | number |



