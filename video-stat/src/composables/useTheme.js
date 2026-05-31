import { ref, watchEffect } from 'vue'

// 单例：全局主题状态
const theme = ref(localStorage.getItem('vstat-theme') || 'light')
let initialized = false

export function useTheme() {
  function setTheme(t) {
    theme.value = t
    localStorage.setItem('vstat-theme', t)
  }

  function toggleTheme() {
    setTheme(theme.value === 'light' ? 'dark' : 'light')
  }

  // 确保只初始化一次 DOM 属性同步
  if (!initialized) {
    initialized = true
    watchEffect(() => {
      document.documentElement.setAttribute('data-theme', theme.value)
    })
  }

  return { theme, setTheme, toggleTheme }
}
