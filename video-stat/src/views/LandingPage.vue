<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'

const emit = defineEmits(['enter'])
const pageRef = ref(null)
const entering = ref(false)
let ctx

onMounted(() => {
  if (!pageRef.value) return
  ctx = gsap.context(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    tl.from('.geo-line', { scaleX: 0, transformOrigin: 'center', duration: 1.0, stagger: 0.12, ease: 'power4.inOut' })
    tl.from('.brand-title', { y: 48, autoAlpha: 0, duration: 0.8, ease: 'power3.out' }, '-=0.4')
    tl.from('.landing-subtitle', { y: 20, autoAlpha: 0, duration: 0.6 }, '-=0.3')
    tl.from('.landing-desc', { y: 16, autoAlpha: 0, duration: 0.5 }, '-=0.2')
    tl.from('.enter-btn-wrap', { y: 12, autoAlpha: 0, duration: 0.5 }, '-=0.1')
    tl.from('.bottom-line', { scaleX: 0, transformOrigin: 'center', duration: 0.7, ease: 'power3.inOut' }, '-=0.1')
  }, pageRef.value)
})

onUnmounted(() => { ctx?.revert() })

function handleEnter() {
  if (entering.value) return
  entering.value = true
  ctx?.revert()
  ctx = gsap.context(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.in' }, onComplete: () => emit('enter') })
    tl.to('.geo-line', { scaleX: 0, duration: 0.4, stagger: 0.04 }, 0)
    tl.to('.brand-title, .landing-subtitle, .landing-desc, .enter-btn-wrap, .bottom-line', { y: -24, autoAlpha: 0, duration: 0.45, stagger: 0.02 }, 0)
    tl.to('.landing-inner', { scale: 0.98, autoAlpha: 0, duration: 0.5 }, 0)
  }, pageRef.value)
}
</script>

<template>
  <div class="landing-page" ref="pageRef" @click="handleEnter">
    <div class="landing-bg"></div>
    <div class="landing-inner">
      <div class="geo-decoration">
        <span class="geo-line g1"></span>
        <span class="geo-line g2"></span>
        <span class="geo-line g3"></span>
      </div>
      <h1 class="brand-title">短视频趋势分析</h1>
      <p class="landing-subtitle">Video Trend Analytics</p>
      <p class="landing-desc">B站热门视频排行榜 · 智能分类 · 数据导出</p>
      <div class="enter-btn-wrap">
        <button class="enter-btn" :disabled="entering">
          <span>进入平台</span>
          <span class="enter-arrow">→</span>
        </button>
      </div>
      <div class="bottom-line"></div>
    </div>
  </div>
</template>

<style scoped>
.landing-page {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--canvas);
  z-index: 100;
  overflow: hidden;
  cursor: pointer;
  user-select: none;
}

.landing-bg {
  position: absolute;
  top: -40%;
  left: -20%;
  width: 140%;
  height: 180%;
  background:
    radial-gradient(ellipse 50% 40% at 30% 35%, var(--landing-glow-1) 0%, transparent 60%),
    radial-gradient(ellipse 40% 35% at 70% 60%, var(--landing-glow-2) 0%, transparent 55%);
  pointer-events: none;
}

.landing-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  z-index: 1;
  pointer-events: none;
}

/* ── 几何线 ── */
.geo-decoration { display: flex; gap: 8px; margin-bottom: 48px; }
.geo-line { display: block; height: 1px; background: var(--hairline-strong); }
.g1 { width: 24px; } .g2 { width: 40px; } .g3 { width: 16px; }

/* ── 标题 ── */
.brand-title {
  margin: 0;
  font-family: var(--font-display);
  font-size: 44px;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: var(--ink);
  line-height: 1.2;
}
.landing-subtitle {
  margin: 16px 0 0;
  font-family: var(--font-display);
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ink-subtle);
}
.landing-desc {
  margin: 28px 0 0;
  font-size: 15px;
  color: var(--ink-tertiary);
  font-weight: 400;
}

/* ── 按钮 ── */
.enter-btn-wrap { margin-top: 48px; pointer-events: auto; }
.enter-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 11px 32px;
  background: var(--accent);
  color: #fff;
  border: none;
  border-radius: var(--radius-pill);
  font-family: var(--font-body);
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: transform var(--duration-fast) var(--ease-out), background var(--duration) var(--ease-out), box-shadow var(--duration) var(--ease-out);
}
.enter-btn:hover { background: var(--accent-hover); box-shadow: var(--shadow-glow); }
.enter-btn:active { transform: scale(0.97); }
.enter-btn:disabled { opacity: 0.5; cursor: default; transform: none; }
.enter-arrow { transition: transform var(--duration) var(--ease-out); }
.enter-btn:hover .enter-arrow { transform: translateX(3px); }

.bottom-line { margin-top: 72px; width: 48px; height: 1px; background: var(--hairline); }
</style>
