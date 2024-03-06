import {computed, defineComponent, onMounted, ref, toRefs} from 'vue'
import dayjs from 'dayjs'

import '@/assets/scss/dinert-time-player.scss'

import type {ResultType, ConfigType} from '@/components/time-player/types'

// 时间转换为宽度计算
const getWidth = (startTime, endTime, currentTempTime) => {

    const startEndDiffer
      = dayjs(endTime).valueOf() - dayjs(startTime).valueOf()
    let currentEndDiffer
      = dayjs(endTime).valueOf() - dayjs(currentTempTime).valueOf()
    currentEndDiffer = startEndDiffer - currentEndDiffer
    const percentDiffer = (currentEndDiffer / startEndDiffer) * 100
    return percentDiffer
}


const getConfig = (event, startTime, endTime) => {
    const el = event.currentTarget
    const x = event.layerX + 1
    const width = el.offsetWidth
    let percent = x / width
    const startEndDiffer
      = dayjs(endTime).valueOf() - dayjs(startTime).valueOf()
    const time = dayjs(startTime).valueOf() + dayjs(startEndDiffer * percent).valueOf()
    percent = percent * 100

    const result: ConfigType = {
        timestamp: dayjs(time).startOf('hours').valueOf(),
        time: dayjs(time).startOf('hours').format('YYYY-MM-DD HH:mm:ss'),
        percent,
        width: x,
    }
    return result
}

export default defineComponent({
    name: 'dinert-time-player',
    props: {
        modelValue: {
            type: Date,
            default: () => (new Date(dayjs().subtract(1, 'day').startOf('hour').valueOf()))
        },
        startTime: {
            // 开始时间
            type: Date,
            default: () => {
                return new Date(dayjs().subtract(2, 'day').startOf('day').valueOf())
            },
        },
        endTime: {
            // 结束时间
            type: Date,
            default: () => {
                return new Date(dayjs().add(2, 'day').startOf('day').valueOf())
            },
        },
        currentTime: {
            // 时间轴当前时间
            type: Date,
            default: () => {
                return new Date(dayjs().subtract(1, 'day').startOf('hour').valueOf())
            },
        },
        // 时间轴停止的时间
        stopTime: {
            type: Date,
            default: () => {
                return new Date(dayjs().add(2, 'day').startOf('day').valueOf())
            },
        },
        // 底部时间格式化
        formatFooter: {
            type: String,
            default: 'YYYY年MM月DD日',
        },
        // tooltip时间格式化
        formatTooltip: {
            type: String,
            default: 'YYYY年MM月DD日 HH时',
        },
        // 24小时时间的间隔
        interval: {
            type: Number,
            default: 3,
        },
        delay: {
            // 播放时间间隔
            type: Number,
            default: 2000,
        },
    },
    emits: ['animate-before', 'animate-after', 'update:modelValue'],
    setup(props, {emit}) {
        const {currentTime, formatTooltip, startTime, endTime, interval, formatFooter, stopTime, delay} = toRefs(props)

        const barRef = ref<HTMLElement | null>(null)
        const tooltipRef = ref<HTMLElement | null>(null)
        const tempTooltipRef = ref<HTMLElement | null>(null)

        const isTempTooltip = ref(false) // 是否显示暂时的tooltip
        const isPlay = ref(false) // 是否在播放
        const config = ref<ConfigType>({})
        const timeTimeout = ref<any>(null)
        const currentTempTime = ref<Date>(currentTime.value) // 当前时间
        const hoverTime = ref(currentTime.value) // 时间移动过去的tooltip
        const timeClickFlag = ref(false) // 是否是鼠标点击触发

        const items = computed(() => {
            const result: ResultType[] = []
            const hours = 3600 * 1000
            const daysTimestamp = hours * 24
            let time = dayjs(startTime.value).valueOf()
            const items = dayjs(endTime.value).diff(dayjs(startTime.value), 'days')
            const width = 100 / items + '%'
            const left = 100 / (24 / interval.value)
            for (let i = 0; i < items; i++) {
                const tempArr: any = []
                let count = 0
                for (let j = 1; j < 24; j++) {
                    if (j % interval.value === 0) {
                        count++
                        tempArr.push({
                            text: j,
                            left: left * count + '%',
                            id: Math.random(),
                        })
                    }
                }
                result.push({
                    hours: tempArr,
                    time: dayjs(time).format(formatFooter.value),
                    width,
                })
                time += daysTimestamp
            }
            return result
        })

        const formatTooltipText = computed(() => {
            return dayjs(currentTempTime.value).format(formatTooltip.value)
        })

        const formatTempTooltipText = computed(() => {
            return dayjs(hoverTime.value).format(formatTooltip.value)
        })

        //  自动播放
        const autoMove = (width, event) => {
            // 自动播放
            !event && isPlay.value && (currentTempTime.value = dayjs(currentTempTime.value).add(1, 'hours').toDate())
            let percent = width || getWidth(startTime.value, endTime.value, currentTempTime.value)

            // 判断超出距离设置为100
            if (percent > 100) {
                percent = 100
            }

            barRef.value && (barRef.value.style.width = percent + '%')
            tooltipRef.value && (tooltipRef.value.style.left = percent + '%')

            if (!event) {

                config.value = {
                    percent,
                    time: dayjs(currentTempTime.value).startOf('hours').format('YYYY-MM-DD HH:mm:ss'),
                    width: barRef.value?.offsetWidth,
                    timestamp: dayjs(currentTempTime.value).startOf('hours').valueOf()
                }
            }


            // 判断结束时间是否大于当前时间，如果大于就停止播放
            if (dayjs(stopTime.value).startOf('hours').valueOf() <= dayjs(currentTempTime.value).valueOf()) {
                isPlay.value = false
            }
            if (isPlay.value) {


                timeTimeout.value && clearTimeout(timeTimeout.value)
                timeTimeout.value = setTimeout(() => {
                    autoMove(undefined, undefined)
                }, delay.value)
            } else {
                timeTimeout.value && clearTimeout(timeTimeout.value)
            }
        }


        const timeClick = event => {
            timeClickFlag.value = true
            config.value = getConfig(event, startTime.value, endTime.value)

            // 判断结束时间是否大于当前时间，如果大于就停止播放
            if (dayjs(stopTime.value).startOf('hours').valueOf() <= dayjs(config.value.time).valueOf()) {
                return
            }

            currentTempTime.value = dayjs(config.value.time).toDate()

            autoMove(config.value.percent, event)
            emit('animate-before', config.value)
        }

        // 动画执行完的回调
        const animateAfter = () => {
            barRef.value && barRef.value.addEventListener('transitionend', () => {
                if (!timeClickFlag.value) {
                    emit('animate-after', config.value)
                } else {
                    timeClickFlag.value = false
                }
            })
        }


        const timeMouseEnter = event => {
            const config = getConfig(event, startTime.value, endTime.value)
            tempTooltipRef.value && (tempTooltipRef.value.style.left = config.percent + '%')
            hoverTime.value = dayjs(config.time).toDate()
            isTempTooltip.value = true
        }

        const timeMouseLeave = () => {
            isTempTooltip.value = false
        }

        // 播放
        const timePlay = () => {
        // 判断结束时间是否大于当前时间，如果大于就停止播放
            if (dayjs(stopTime.value).startOf('hours').valueOf() <= dayjs(currentTempTime.value).valueOf()) {
                return
            }

            isPlay.value = !isPlay.value
            if (isPlay.value) {
                timeTimeout.value && clearTimeout(timeTimeout.value)
                timeTimeout.value = setTimeout(autoMove, delay.value)
            } else {
                clearTimeout(timeTimeout.value)
            }
        }

        // 开始播放
        const startPlay = () => {
            isPlay.value = true
            timeTimeout.value && clearTimeout(timeTimeout.value)
            timeTimeout.value = setTimeout(autoMove, delay.value)
        }

        const stopPlay = () => {
            isPlay.value = false
            timeTimeout.value && clearTimeout(timeTimeout.value)
        }

        const timeNowFn = () => {
            currentTempTime.value = dayjs(currentTime.value).toDate()
            autoMove(undefined, undefined)
        }

        onMounted(() => {
            animateAfter()
            const width = getWidth(startTime.value, endTime.value, currentTempTime.value)
            autoMove(width, undefined)
        })


        return {
            barRef,
            tooltipRef,
            tempTooltipRef,

            isPlay,
            formatTempTooltipText,
            formatTooltipText,
            isTempTooltip,
            items,

            timeNowFn,
            timePlay,
            timeClick,
            timeMouseEnter,
            timeMouseLeave,

            startPlay,
            stopPlay
        }
    },
    render() {
        return (
            <div class="dinert-time-player">
                <div class="dinert-time-player-left">
                    <div class="dinert-time-player-left-top"></div>
                    <div class="dinert-time-player-left-bottom" onClick={this.timePlay}>
                        <span class={['dinert-time-player-left-bottom-start', this.isPlay ? 'stop' : '']} ></span>
                    </div>
                </div>
                <div class="dinert-time-player-center">
                    <div class="dinert-time-player-center-top">
                        <div class="dinert-time-player-center-top-bar" ref={'barRef'}></div>
                        <div class="dinert-time-player-center-top-tooltip" ref={'tooltipRef'}>
                            {this.formatTooltipText}
                        </div>
                        <div
                            class="dinert-time-player-center-top-tooltipTemp"
                            ref={ 'tempTooltipRef'}
                            v-show={this.isTempTooltip}
                        >
                            {this.formatTempTooltipText}
                        </div>
                        <ul class="dinert-time-player-center-top-ul"
                            onClick={this.timeClick}
                            onMousemove={event => this.timeMouseEnter(event)}
                            onMouseleave={this.timeMouseLeave}
                        >
                            {
                                this.items.map((item: any) => {
                                    return <li style={{width: item.width}}
                                        data-time={item.time}
                                        key={item.time}></li>
                                })
                            }
                        </ul>
                    </div>

                    <div class="dinert-time-player-center-center">
                        <ul class="dinert-time-player-center-center-ul">
                            {
                                this.items.map((item: any) => {
                                    return (
                                        <li class="dinert-time-player-center-center-ul-li" style={{width: item.width}}
                                            data-time={item.time}
                                            key={item.time}>
                                            {
                                                item.hours.map(item => {
                                                    return <span key={item.id} style={{left: item.left}}>{item.text}</span>
                                                })
                                            }
                                        </li>
                                    )
                                })

                            }
                        </ul>
                    </div>

                    <div class="dinert-time-player-center-bottom">
                        <ul class="dinert-time-player-center-bottom-ul">
                            {
                                this.items.map((item: any) => {
                                    return (
                                        <li class="dinert-time-player-center-bottom-ul-li"
                                            style={{width: item.width}}
                                            data-time={item.time}
                                            key={item.time}>
                                            {item.time}
                                        </li>
                                    )
                                })

                            }
                        </ul>
                    </div>
                </div>
                <div class="dinert-time-player-right">
                    <span class="dinert-time-player-right-now" onClick={this.timeNowFn}>回到当前</span>
                </div>
            </div>
        )
    }
})
