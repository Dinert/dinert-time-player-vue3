<template>
    <div class="home">
        <dinert-time-player :current-time="currentTime"
            @animate-before="animateBefore"
            @animate-after="animateAfter"
        />
    </div>
</template>

<script>

export default {
    name: 'Home',
    components: {
    },
    mounted() {

    },
    data() {
        return {
            currentTime: new Date()
        }
    },
    methods: {
        animateBefore(config) {
            console.log(config, 'animateBefore')
        },
        animateAfter(config) {
            console.log(config, 'animateAfter')
        }
    }
}
</script>

<style lang="scss" scoped>

.home {
    margin-top: 80px;
}
</style>
