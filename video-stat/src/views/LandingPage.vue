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

    // 几何线
    tl.from('.geo-line', {
      scaleX: 0,
      transformOrigin: 'center',
      duration: 1.0,
      stagger: 0.12,
      ease: 'power4.inOut',
    })
    // 标题整体淡入上浮
    tl.from('.brand-title', {
      y: 48,
      autoAlpha: 0,
      duration: 0.8,
      ease: 'power3.out',
    }, '-=0.4')
    // 副标题
    tl.from('.landing-subtitle', {
      y: 20,
      autoAlpha: 0,
      duration: 0.6,
    }, '-=0.3')
    // 描述
    tl.from('.landing-desc', {
      y: 16,
      autoAlpha: 0,
      duration: 0.5,
    }, '-=0.2')
    // CTA
    tl.from('.enter-btn', {
      y: 12,
      autoAlpha: 0,
      duration: 0.5,
    }, '-=0.1')
    // 底部线
    tl.from('.bottom-line', {
      scaleX: 0,
      transformOrigin: 'center',
      duration: 0.7,
      ease: 'power3.inOut',
    }, '-=0.1')
  }, pageRef.value)
})

onUnmounted(() => {
  ctx?.revert()
})

// 点击任意位置进入
function handleEnter() {
  if (entering.value) return
  entering.value = true

  ctx?.revert()
  ctx = gsap.context(() => {
    const tl = gsap.timeline({
      defaults: { ease: 'power3.in' },
      onComplete: () => emit('enter'),
    })
    tl.to('.geo-line', {
      scaleX: 0,
      duration: 0.4,
      stagger: 0.04,
    }, 0)
    tl.to('.brand-title, .landing-subtitle, .landing-desc, .enter-btn, .bottom-line', {
      y: -24,
      autoAlpha: 0,
      duration: 0.45,
      stagger: 0.02,
    }, 0)
    tl.to('.landing-inner', {
      scale: 0.98,
      autoAlpha: 0,
      duration: 0.5,
    }, 0)
  }, pageRef.value)
}
</script>

<template>
  <div class="landing-page" ref="pageRef" @click="handleEnter">
    <!-- 背景微光 -->
    <div class="landing-bg-glow"></div>

    <div class="landing-inner">
      <!-- 几何装饰线 -->
      <div class="geo-decoration">
        <span class="geo-line g1"></span>
        <span class="geo-line g2"></span>
        <span class="geo-line g3"></span>
      </div>

      <!-- 品牌名 -->
      <h1 class="brand-title">短视频趋势分析</h1>

      <p class="landing-subtitle">Video Trend Analytics</p>
      <p class="landing-desc">B站热门视频排行榜 · 智能分类 · 数据导出</p>

      <!-- CTA -->
      <button class="enter-btn" :disabled="entering">
        <span class="enter-text">进入平台</span>
        <span class="enter-arrow">→</span>
      </button>

      <!-- 底部装饰线 -->
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

/* ── 背景微光 ── */
.landing-bg-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 600px;
  height: 600px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(184,149,106,0.04) 0%, transparent 70%);
  pointer-events: none;
}

/* ── 内容区 ── */
.landing-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  z-index: 1;
  pointer-events: none;
}

/* ── 几何装饰线 ── */
.geo-decoration {
  display: flex;
  gap: 8px;
  margin-bottom: 48px;
}
.geo-line {
  display: block;
  height: 1px;
  background: var(--hairline-strong);
}
.g1 { width: 24px; }
.g2 { width: 40px; }
.g3 { width: 16px; }

/* ── 品牌标题 ── */
.brand-title {
  margin: 0;
  font-family: var(--font-display);
  font-size: 42px;
  font-weight: 300;
  letter-spacing: 10px;
  color: var(--ink);
  line-height: 1.3;
}

/* ── 副标题 ── */
.landing-subtitle {
  margin: 20px 0 0;
  font-family: var(--font-display);
  font-size: 13px;
  font-weight: 400;
  letter-spacing: 4px;
  text-transform: uppercase;
  color: var(--ink-subtle);
}

/* ── 描述 ── */
.landing-desc {
  margin: 32px 0 0;
  font-size: 14px;
  color: var(--ink-tertiary);
  font-weight: 400;
  letter-spacing: 1px;
}

/* ── CTA 按钮 ── */
.enter-btn {
  margin-top: 56px;
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 12px 36px;
  background: transparent;
  border: 1px solid var(--hairline-strong);
  border-radius: var(--radius-pill);
  color: var(--ink);
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 400;
  letter-spacing: 2px;
  cursor: pointer;
  transition: all 0.35s var(--ease-out);
  position: relative;
  overflow: hidden;
  pointer-events: auto;
}
.enter-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(255,255,255,0.03);
  opacity: 0;
  transition: opacity 0.35s var(--ease-out);
}
.enter-btn:hover::before {
  opacity: 1;
}
.enter-btn:hover {
  border-color: var(--ink-subtle);
  transform: translateY(-1px);
}
.enter-btn:active {
  transform: translateY(0);
}
.enter-btn:disabled {
  opacity: 0.4;
  cursor: default;
}
.enter-text { position: relative; z-index: 1; }
.enter-arrow {
  position: relative;
  z-index: 1;
  transition: transform 0.3s var(--ease-out);
}
.enter-btn:hover .enter-arrow {
  transform: translateX(3px);
}

/* ── 底部装饰线 ── */
.bottom-line {
  margin-top: 80px;
  width: 60px;
  height: 1px;
  background: var(--hairline);
}
</style>
