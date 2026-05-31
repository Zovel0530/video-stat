<script setup>
import { onMounted, onUnmounted, ref, nextTick } from 'vue'
import { gsap } from 'gsap'
import { useTheme } from '../composables/useTheme.js'

const { theme, toggleTheme } = useTheme()
const btnRef = ref(null)
const sunRef = ref(null)
const moonRef = ref(null)
const animating = ref(false)
let ctx

onMounted(() => {
  if (!btnRef.value) return
  ctx = gsap.context(() => {
    // 按钮入场
    gsap.set('.toggle-btn', { autoAlpha: 1 })
    // 根据当前主题设置初始图标状态（两个图标始终在 DOM 中）
    if (theme.value === 'light') {
      gsap.set('.sun-icon', { rotate: 0, scale: 1, opacity: 1 })
      gsap.set('.moon-icon', { rotate: 0, scale: 0, opacity: 0 })
    } else {
      gsap.set('.sun-icon', { rotate: 0, scale: 0, opacity: 0 })
      gsap.set('.moon-icon', { rotate: 0, scale: 1, opacity: 1 })
    }
  }, btnRef.value)
})

onUnmounted(() => { ctx?.revert() })

async function handleToggle() {
  if (animating.value) return
  animating.value = true

  const isToDark = theme.value === 'light' // 即将切换到暗夜模式
  const oldIcon = isToDark ? '.sun-icon' : '.moon-icon'
  const newIcon = isToDark ? '.moon-icon' : '.sun-icon'

  // 先让旧图标离场
  await gsap.to(oldIcon, {
    rotate: isToDark ? 120 : -120,
    scale: 0.25,
    opacity: 0,
    duration: 0.2,
    ease: 'power2.in'
  }).then()

  // 切换主题（theme 改变，但图标不受 v-if 影响，始终在 DOM）
  toggleTheme()

  // 确保新图标从预设状态开始
  gsap.set(newIcon, {
    rotate: isToDark ? -120 : 120,
    scale: 0.25,
    opacity: 0
  })

  // 新图标弹入
  await gsap.to(newIcon, {
    rotate: 0,
    scale: 1,
    opacity: 1,
    duration: 0.28,
    ease: 'power3.out'
  }).then()

  animating.value = false
}

// 按钮按压反馈独立处理
function handleClick() {
  if (animating.value) return
  gsap.to('.toggle-btn', {
    scale: 0.88,
    duration: 0.1,
    yoyo: true,
    repeat: 1,
    ease: 'power2.out'
  })
  handleToggle()
}
</script>

<template>
  <div class="toggle-wrap" ref="btnRef">
    <button
      class="toggle-btn"
      @click="handleClick"
      :title="theme === 'light' ? '切换暗夜模式' : '切换白日模式'"
    >
      <div class="icon-stack">
        <!-- 太阳图标 — 始终渲染 -->
        <svg
          ref="sunRef"
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
        <!-- 月亮图标 — 始终渲染 -->
        <svg
          ref="moonRef"
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
    box-shadow var(--duration) var(--ease-out);
  opacity: 0;
  /* 确保自身不可被选中 */
  user-select: none;
  -webkit-user-select: none;
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
  pointer-events: none;
}

/* 两个图标绝对定位叠在一起，始终在 DOM */
.toggle-icon {
  position: absolute;
  top: 0;
  left: 0;
  width: 18px;
  height: 18px;
  display: block;
  /* 确保 SVG 不可被选中 */
  user-select: none;
  -webkit-user-select: none;
  pointer-events: none;
}

/* 太阳暖橙 — 白日 */
.sun-icon { color: #f59e0b; }

/* 月亮跟随暗夜主题 accent */
.moon-icon { color: var(--accent); }
</style>
