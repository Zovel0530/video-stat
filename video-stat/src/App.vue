<script setup>
import { ref, nextTick, onMounted } from 'vue'
import { gsap } from 'gsap'
import LandingPage from './views/LandingPage.vue'
import Index from './views/Index.vue'

const showMain = ref(false)
const mainRef = ref(null)

// 从前置页进入主页
async function handleEnter() {
  showMain.value = true
  await nextTick()
  // 主页入场
  gsap.from(mainRef.value, {
    autoAlpha: 0,
    y: 20,
    duration: 0.7,
    ease: 'power3.out',
  })
}
</script>

<template>
  <LandingPage v-if="!showMain" @enter="handleEnter" />
  <div v-else ref="mainRef" class="main-wrapper">
    <Index />
  </div>
</template>

<style>
.main-wrapper {
  min-height: 100vh;
}
</style>
