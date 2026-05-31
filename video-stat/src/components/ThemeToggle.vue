<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { gsap } from 'gsap'
import { useTheme } from '../composables/useTheme.js'

const { theme, toggleTheme } = useTheme()
const btnRef = ref(null)
const animating = ref(false)
let ctx

onMounted(() => {
  if (!btnRef.value) return
  ctx = gsap.context(() => {
    gsap.set('.toggle-btn', { autoAlpha: 1 })
    // 确保当前活跃图标可见
    const activeIcon = theme.value === 'light' ? '.sun-icon' : '.moon-icon'
    gsap.set(activeIcon, { rotate: 0, scale: 1, opacity: 1 })
  }, btnRef.value)
})

onUnmounted(() => { ctx?.revert() })

function handleToggle() {
  if (animating.value) return
  animating.value = true

  const oldIcon = theme.value === 'light' ? '.sun-icon' : '.moon-icon'
  const newIcon = theme.value === 'light' ? '.moon-icon' : '.sun-icon'

  ctx?.revert()
  ctx = gsap.context(() => {
    const tl = gsap.timeline({
      onComplete: () => { animating.value = false }
    })

    // 1. 当前图标旋转缩小淡出（scale 到 0.3 而非 0，保留可见）
    tl.to(oldIcon, {
      rotate: 100,
      scale: 0.3,
      opacity: 0,
      duration: 0.22,
      ease: 'power2.in'
    })

    // 2. 预设新图标初始状态（此时它还被 v-show 隐藏）
    tl.set(newIcon, {
      rotate: -100,
      scale: 0.3,
      opacity: 0
    })

    // 3. 切换主题（v-show 交换，新图标以预设状态出现）
    tl.call(toggleTheme)

    // 4. 新图标旋转弹入
    tl.to(newIcon, {
      rotate: 0,
      scale: 1,
      opacity: 1,
      duration: 0.28,
      ease: 'power3.out'
    })

    // 5. 按钮按压反馈（与以上动画同步进行）
    tl.to('.toggle-btn', {
      scale: 0.9,
      duration: 0.12,
      yoyo: true,
      repeat: 1,
      ease: 'power2.out'
    }, 0)
  }, btnRef.value)
}
</script>

<template>
  <div class="toggle-wrap" ref="btnRef">
    <button
      class="toggle-btn"
      @click="handleToggle"
      :title="theme === 'light' ? '切换暗夜模式' : '切换白日模式'"
    >
      <div class="icon-stack">
        <!-- 太阳图标 — 白日模式显示 -->
        <svg
          v-show="theme === 'light'"
          class="toggle-icon sun-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
        <!-- 月亮图标 — 暗夜模式显示 -->
        <svg
          v-show="theme === 'dark'"
          class="toggle-icon moon-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      </div>
    </button>
  </div>
</template>

<style scoped>
.toggle-wrap {
  display: inline-flex;
  align-items: center;
}

.toggle-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid var(--hairline);
  background: var(--surface-1);
  cursor: pointer;
  transition:
    border-color var(--duration) var(--ease-out),
    box-shadow var(--duration) var(--ease-out),
    color var(--duration) var(--ease-out);
  opacity: 0;
}

.toggle-btn:hover {
  border-color: var(--accent);
  box-shadow: var(--shadow-glow);
}

.toggle-btn:active { transform: scale(0.94); }

/* 图标堆叠容器 */
.icon-stack {
  position: relative;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 两个图标绝对定位叠在一起 */
.toggle-icon {
  position: absolute;
  top: 0;
  left: 0;
  width: 18px;
  height: 18px;
  display: block;
}

/* 太阳暖橙 — 白日不变 */
.sun-icon { color: #f59e0b; }

/* 月亮跟随暗夜主题 accent */
.moon-icon { color: var(--accent); }
</style>
