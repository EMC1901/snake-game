import { defineConfig } from 'vite'

export default defineConfig({
  base: '/snake-game/',  // 这里要匹配你的仓库名称
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
}) 