import { defineConfig } from 'vite'
import path from 'path'
import vue from '@vitejs/plugin-vue'
import { viteSingleFile } from 'vite-plugin-singlefile'

const libDir = path.resolve(__dirname, 'src/components/libs')

export default defineConfig({
  plugins: [vue({
    reactivityTransform: true
  }), viteSingleFile()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  build: {
    polyfillModulePreload: false,
    cssCodeSplit: true,
    outDir: 'template-dist',
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue',
        },
      },
    },
    lib: {
      entry: path.resolve(__dirname, libDir, 'index.ts'),
      formats: ['es'],
      name: 'Lib',
      fileName: 'lib'
    }
  }
})
