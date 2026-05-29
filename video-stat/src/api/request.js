import axios from 'axios'

const instance = axios.create({
  baseURL: import.meta.env.DEV ? '/api/bilibili' : '/api',
  timeout: 15000,
})

instance.interceptors.response.use(
  (res) => res.data,
  (err) => {
    const msg = err.response?.data?.message || err.message || '请求失败'
    return Promise.reject(new Error(msg))
  }
)

export default instance
