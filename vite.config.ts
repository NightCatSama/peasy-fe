import { defineConfig, loadEnv } from 'vite'
import * as path from 'path'
import vue from '@vitejs/plugin-vue'
import svgLoader from 'vite-svg-loader'
import { visualizer } from 'rollup-plugin-visualizer'

const packageJSON = require('./package.json')

const htmlPlugin = () => {
  return {
    name: 'html-transform',
    transformIndexHtml(html: string) {
      return html.replace(
        /\/\* app version \*\//,
        packageJSON.version
      )
    }
  }
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: loadEnv(mode, process.cwd(), '').VITE_URL_BASE,
  plugins: [
    vue({
      reactivityTransform: true
    }),
    svgLoader({
      defaultImport: 'component'
    }),
    htmlPlugin(),
    loadEnv(mode, process.cwd(), '').VITE_ANALYZE
      ? visualizer({ emitFile: true })
      : null
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@@': path.resolve(__dirname, './peasy-be/src'),
    },
  },
  build: {
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          'moveable': ['moveable'],
          'html2canvas': ['html2canvas'],
          'lodash': ['lodash'],
          'jsoneditor': ['jsoneditor'],
        }
      }
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import '@/styles/_global.scss';`
      },
    }
  },
  server: {
    port: 3000,
    host: 'localhost'
  }
}))
