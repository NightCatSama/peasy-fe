import { defineConfig } from 'vite'
import path from 'path'
import vue from '@vitejs/plugin-vue'
import { viteSingleFile } from 'vite-plugin-singlefile'

import { getFontStylesheet, getColorVarStylesheet } from './src/components/libs/hooks/stylesheet'

const test = JSON.parse(`{"pageData":[{"type":"section","name":"Section","component":"Block","tags":[],"config":{"props":{"common":{"hide":false},"size":{"width":"","height":"100%","minWidth":"","minHeight":"50px","maxHeight":"none","maxWidth":""},"layout":{"direction":"row","justify":"center","align":"center","wrap":"nowrap","reverse":false},"spacing":{"margin":[0,0,0,0],"padding":[0,0,0,0]},"border":{"borderWidth":["0px","0px","0px","0px"],"borderStyle":["solid","solid","solid","solid"],"borderColor":["$primary","$primary","$primary","$primary"],"borderRadius":"0px"},"container":{"overflow":"visible","boxShadow":"","opacity":1,"cursor":"inherit","filter":""},"background":{"backgroundType":"none","backgroundColor":"#FFFFFF","backgroundImage":"","backgroundSize":"auto","backgroundPosition":"center","backgroundRepeat":"no-repeat","backgroundGradientAngle":180,"backgroundGradient":[],"backgroundAttachment":"scroll","backgroundClip":"border-box"},"position":{"position":"static","left":"0px","right":"auto","top":"0px","bottom":"auto","zIndex":0},"event":{"type":"tap","action":"link","stopPropagation":true,"link":"","openNewTab":true,"execFunction":"","scrollTarget":""},"effect":{"effectList":[]},"animation":{"animationList":[]}}},"children":[{"name":"Text","tags":["Text"],"type":"component","config":{"props":{"font":{"color":"$primary","fontSize":"3rem","fontStyle":"normal","textAlign":"left","fontFamily":"","fontWeight":"normal","lineHeight":"126%","textShadow":"","textDecoration":"none"},"basic":{"text":"Title {{1}} Text ABASCNww dwqASLCNASCASKCNALSKCNASKCNKSCNLS KCwqd dwqqwqN KCNK ASC","whiteSpace":"pre-line"},"event":{"link":"","type":"tap","action":"link","openNewTab":true,"execFunction":"","stopPropagation":true},"border":{"borderColor":"#000","borderStyle":["solid","solid","solid","solid"],"borderWidth":["0px","0px","0px","0px"],"borderRadius":"0px"},"common":{"hide":false},"effect":{"effectList":[]},"spacing":{"margin":[50,50,50,50],"padding":[0,0,0,0]},"position":{"top":"0px","left":"0px","right":"auto","bottom":"auto","zIndex":0,"position":"static"},"animation":{"animationList":[]},"container":{"cursor":"inherit","opacity":1,"overflow":"visible","boxShadow":""},"background":{"backgroundSize":"auto","backgroundType":"none","backgroundColor":"#FFFFFF","backgroundImage":"","backgroundRepeat":"no-repeat","backgroundGradient":[],"backgroundPosition":"center","backgroundAttachment":"scroll","backgroundGradientAngle":180}}},"isModule":false,"component":"Text","moduleConfig":[],"materialId":"531bc9cb-f898-496b-827d-a3947314d06c","children":[{"name":"Text-1","tags":["Text"],"type":"component","config":{"props":{"basic":{"text":"AAsssssss","whiteSpace":"pre-line","isSonText":true},"spacing":{"margin":[0,0,0,0],"padding":[0,0,0,0]},"font":{"color":"#FF2323","fontSize":"3rem","fontStyle":"normal","textAlign":"left","fontFamily":"","fontWeight":"normal","lineHeight":"126%","textShadow":"","textDecoration":"none"}}},"isModule":false,"component":"Text","moduleConfig":[],"materialId":"531bc9cb-f898-496b-827d-a3947314d06c","children":[],"propLink":"Text"}]}]}],"colorVars":[{"name":"$primary","color":"#3e7ce8"}],"font":{"fontFamily":"'Lato', -apple-system, PingFang SC, \\"Helvetica Neue\\", sans-serif","customFontFace":["https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,400;0,700;0,900;1,400;1,700;1,900&display=swap"],"fontSize":20,"mediaFontSize":{}},"setting":{"client":"both","title":"Page Title","favicon":"","description":""}}`)
const testData = `<script>window.data = ${JSON.stringify(test)}</script>`

const htmlPlugin = () => {
  return {
    name: 'html-transform',
    transformIndexHtml: (file) => {
      if (process.env.NODE_ENV === 'development') {
        file = file.replace(/<!--app-data-->/g, testData)
        file = file.replace(/<!--app-favicon-->/g, `<link rel="icon" href="${test.setting?.favicon}" />`)
        file = file.replace(/<!--app-title-->/g, test.setting?.title)
        file = file.replace(/<!--app-meta-->/g, test.setting?.description ? `<meta name="description" content="${test.setting.description}" />` : '')
        file = file.replace(/<!--app-style-->/g, `
          <style>${getColorVarStylesheet(test.colorVars)}</style>
          <style>${getFontStylesheet(test.font, 'html')}</style>
        `.trim())
      }
      return file
    },
    enforce: 'post' as 'pre' | 'post'
  };
};

export default defineConfig({
  root: path.resolve(__dirname, 'template'),
  define: {
    __VUE_PROD_DEVTOOLS__: true
  },
  base: './',
  plugins: [
    vue({
      reactivityTransform: true,
    }),
    viteSingleFile(),
    htmlPlugin(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      vue: 'vue/dist/vue.esm-bundler.js',
    },
  },
  build: {
    cssCodeSplit: false,
    assetsInlineLimit: 100000000,
    outDir: path.resolve(__dirname, 'template-dist'),
    rollupOptions: {
      external: ['vue'],
      output: {
        name: 'template.html',
        format: 'umd',
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import '@/styles/_global.scss';`
      },
    }
  },
  server: {
    port: 5173
  }
})
