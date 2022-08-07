import { defineConfig } from 'vite'
import path from 'path'
import vue from '@vitejs/plugin-vue'
import { viteSingleFile } from 'vite-plugin-singlefile'

import { getFontStylesheet, getColorVarStylesheet } from './src/components/libs/hooks/stylesheet'

const test = {"pageData":[{"type":"section","name":"Section","component":"Block","tags":[],"config":{"props":{"common":{"hide":false},"size":{"width":"","height":"100%","minWidth":"","minHeight":"50px","maxHeight":"none","maxWidth":""},"layout":{"direction":"column","justify":"center","align":"center"},"spacing":{"margin":[0,0,0,0],"padding":[0,0,0,0]},"border":{"borderWidth":["0px","0px","0px","0px"],"borderStyle":["solid","solid","solid","solid"],"borderColor":["#000","#000","#000","#000"],"borderRadius":"0px"},"container":{"overflow":"visible","boxShadow":"","opacity":1,"cursor":"inherit"},"background":{"backgroundType":"none","backgroundColor":"#FFFFFF","backgroundImage":"","backgroundSize":"auto","backgroundPosition":"center","backgroundRepeat":"no-repeat","backgroundGradientAngle":180,"backgroundGradient":[],"backgroundAttachment":"scroll"},"position":{"position":"static","left":"0px","right":"auto","top":"0px","bottom":"auto","zIndex":0},"event":{"type":"tap","action":"link","stopPropagation":true,"link":"","openNewTab":true,"execFunction":""},"effect":{"effectList":[]},"animation":{"animationList":[]}},"mobile":{"common":{"hide":false},"size":{"width":"","height":"100%","minWidth":"","minHeight":"50px","maxHeight":"none","maxWidth":""},"layout":{"direction":"row","justify":"center","align":"center"},"spacing":{"margin":[0,0,0,0],"padding":[0,0,0,0]},"border":{"borderWidth":["0px","0px","0px","0px"],"borderStyle":["solid","solid","solid","solid"],"borderColor":["#000","#000","#000","#000"],"borderRadius":"0px"},"container":{"overflow":"visible","boxShadow":"","opacity":1,"cursor":"inherit"},"background":{"backgroundType":"color","backgroundColor":"skyblue","backgroundImage":"","backgroundSize":"auto","backgroundPosition":"center","backgroundRepeat":"no-repeat","backgroundGradientAngle":180,"backgroundGradient":[],"backgroundAttachment":"scroll"},"position":{"position":"static","left":"0px","right":"auto","top":"0px","bottom":"auto","zIndex":0},"event":{"type":"tap","action":"link","stopPropagation":true,"link":"","openNewTab":true,"execFunction":""},"effect":{"effectList":[]},"animation":{"animationList":[]}}},"children":[{"type":"component","name":"section-Block","component":"Block","tags":[],"isModule":true,"moduleConfig":[{"title":"Text","icon":"font","defaultCollapsed":true,"data":[{"type":"text","label":"文本","props":{},"sourceValue":"children[1].config.props.basic.text","targetValue":"children[1].config.props.basic.text"},{"type":"color","label":"颜色","props":{},"sourceValue":"children[1].config.props.font.color","targetValue":["children[1].config.props.font.color","children[0].config.props.basic.color"]},{"type":"fontSize","label":"文字大小","props":{},"sourceValue":"children[1].config.props.font.fontSize","targetValue":["children[1].config.props.font.fontSize","children[0].config.props.basic.size"]},{"type":"opacity","label":"透明度","props":{},"sourceValue":"config.props.container.opacity","targetValue":"config.props.container.opacity"}]},{"title":"Image","icon":"image","defaultCollapsed":false,"data":[{"type":"tip","label":"","props":{"type":"warning","message":"可以直接输入图片地址，或点击 Upload 上传图片。"}},{"type":"image","label":"背景图片","props":{},"sourceValue":"config.props.background.backgroundImage","targetValue":"config.props.background.backgroundImage"},{"type":"backgroundSize","label":"","props":{},"sourceValue":"config.props.background.backgroundSize","targetValue":"config.props.background.backgroundSize"}]}],"config":{"props":{"common":{"hide":false},"size":{"width":"80%","height":"auto","minWidth":"50px","minHeight":"50px","maxHeight":"none","maxWidth":"none"},"layout":{"direction":"row","justify":"center","align":"center"},"spacing":{"margin":[0,0,0,0],"padding":[0,0,0,0]},"border":{"borderWidth":["0px","0px","0px","0px"],"borderStyle":["solid","solid","solid","solid"],"borderColor":["#000","#000","#000","#000"],"borderRadius":"0px"},"container":{"overflow":"visible","boxShadow":"","opacity":1,"cursor":"inherit"},"background":{"backgroundType":"image","backgroundColor":"#FFFFFF","backgroundImage":"https://avatars.githubusercontent.com/u/13888962?v=4","backgroundSize":"auto","backgroundPosition":"center","backgroundRepeat":"no-repeat","backgroundGradientAngle":180,"backgroundGradient":[],"backgroundAttachment":"scroll"},"position":{"position":"static","left":"0px","right":"auto","top":"0px","bottom":"auto","zIndex":0},"event":{"type":"tap","action":"link","stopPropagation":true,"link":"","openNewTab":true,"execFunction":""},"effect":{"effectList":[]},"animation":{"animationList":[]}}},"children":[{"type":"component","name":"Icon","component":"Icon","tags":["Icon"],"config":{"props":{"common":{"hide":false},"basic":{"name":"apple","size":"2vw","color":"$primary","prefixClass":"fa-","extraClass":"","styleLink":"//netdna.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"},"spacing":{"margin":[0,0,0,0],"padding":[0,0,0,0]},"border":{"borderWidth":["0px","0px","0px","0px"],"borderStyle":["solid","solid","solid","solid"],"borderColor":["#000","#000","#000","#000"],"borderRadius":"0px"},"event":{"type":"tap","action":"link","stopPropagation":true,"link":"","openNewTab":true,"execFunction":""},"effect":{"effectList":[]}}}},{"type":"component","name":"Text","component":"Text","tags":["Text"],"config":{"props":{"common":{"hide":false},"basic":{"text":"Title Text"},"font":{"fontSize":"30px","lineHeight":"126%","color":"$primary","fontWeight":"normal","fontStyle":"normal","textDecoration":"none","textAlign":"left","textShadow":"","fontFamily":""},"spacing":{"margin":[50,50,50,50],"padding":[0,0,0,0]},"border":{"borderWidth":["0px","0px","0px","0px"],"borderStyle":["solid","solid","solid","solid"],"borderColor":["#000","#000","#000","#000"],"borderRadius":"0px"},"background":{"backgroundType":"none","backgroundColor":"#FFFFFF","backgroundImage":"","backgroundSize":"auto","backgroundPosition":"center","backgroundRepeat":"no-repeat","backgroundGradientAngle":180,"backgroundGradient":[],"backgroundAttachment":"scroll"},"container":{"overflow":"visible","boxShadow":"","opacity":1,"cursor":"inherit"},"position":{"position":"static","left":"0px","right":"auto","top":"0px","bottom":"auto","zIndex":0},"event":{"type":"tap","action":"link","stopPropagation":true,"link":"","openNewTab":true,"execFunction":""},"effect":{"effectList":[]},"animation":{"animationList":[]}}}},{"type":"component","name":"Image","component":"Image","tags":["Image"],"config":{"props":{"common":{"hide":false},"basic":{"src":"","objectFit":"fill"},"size":{"width":"auto","height":"auto","minWidth":"100px","minHeight":"100px","maxHeight":"none","maxWidth":"none"},"spacing":{"margin":[0,0,0,0],"padding":[0,0,0,0]},"border":{"borderWidth":["0px","0px","0px","0px"],"borderStyle":["solid","solid","solid","solid"],"borderColor":["#000","#000","#000","#000"],"borderRadius":"0px"},"container":{"overflow":"visible","boxShadow":"","opacity":1,"cursor":"inherit"},"position":{"position":"static","left":"0px","right":"auto","top":"0px","bottom":"auto","zIndex":0},"event":{"type":"tap","action":"link","stopPropagation":true,"link":"","openNewTab":true,"execFunction":""},"effect":{"effectList":[]},"animation":{"animationList":[]}}}}]}]}],"colorVars":[{"name":"$primary","color":"#00a8ff"},{"name":"$error","color":"red"}],"font":{"fontFamily":"'ZCOOL XiaoWei', PingFang SC, sans-serif","customFontFace":["https://fonts.googleapis.com/css2?family=ZCOOL+XiaoWei&display=swap"],"fontSize":{"980":"12px","1920":"16px","2560":"20px"}},"setting":{"client":"both","title":"Your Page Title","favicon":"","description":""}}
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
          <style>${getFontStylesheet(test.font, 'body')}</style>
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
  }
})
