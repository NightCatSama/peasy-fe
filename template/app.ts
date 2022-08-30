
import type { IPage, PageNode } from '../src/config'
import { Text, Block, Image, Icon, Media } from '@/components/libs'

// Debug
// import { createApp } from 'vue'

// Build
import type { createApp as VueCreateApp } from 'vue'
const createApp = (window as any)?.Vue?.createApp as typeof VueCreateApp

if (!createApp) {
  throw new Error('vue is not installed')
}

const getTemplate = (pageNode: PageNode[]) => {
  let template = ''
  pageNode.forEach((item) => {
    template += getHtml(item);
  });
  return template
}

const getHtml = (obj: PageNode, parent?: PageNode): string => {
  return `
<${obj.component}
  :direction='${parent?.name ? `getProps("${parent.name}")?.layout?.direction` : '""'}'
  :tags='${
    JSON.stringify(obj.tags) || '[]'
  }'
  componentName="${obj.name}"
  :children='${obj.component === 'Text' && obj.children ? `getChild("${obj.name}")` : 'undefined'}'
  v-bind='getProps("${obj.name}")'
>
${(obj.children || []).map((child) => getHtml(child, obj)).join('')}
</${obj.component}>
`;
};

const data: IPage = (window as any).data || []

const isMobile = () => document.body.clientWidth < 768

let app
if (data) {
  app = createApp({
    template: getTemplate(data.pageData),
    data() {
      return {
        isMobile: isMobile(),
        data: data.pageData,
        font: data.font,
        setting: data.setting,
        colorVars: data.colorVars
      }
    },
    computed: {
      nameMap(): { [name: string]: PageNode } {
        const nameMap: { [name: string]: PageNode } = {};
        const dfs = (nodes: PageNode[]) => {
          nodes.forEach((item) => {
            nameMap[item.name] = item;
            if (item.children) dfs(item.children);
          });
        };
        dfs(this.data);
        return nameMap;
      },
      getProps() {
        return (name: string) => {
          const node = this.nameMap[name] as PageNode
          const linkNode = node.propLink ? this.nameMap[node.propLink] : null
          const config = node?.config || {}
          return {
            ...linkNode?.config?.props,
            ...config?.props,
            ...(this.isMobile && linkNode?.config?.mobile ? linkNode.config.mobile : {}),
            ...(this.isMobile && config?.mobile ? config.mobile : {}),
          }
        }
      },
      getChild() {
        return (name: string) => {
          const node = this.nameMap[name] as PageNode
          console.log(name, node.children, node?.config?.props?.basic?.isSonText)
          return node?.children || []
        }
      }
    },
    created() {
      window.onresize = () => this.isMobile = isMobile()
    },
    provide: {
      editContext: {
        isEditMode: false,
        displayMode: '',
      },
    },
    components: {
      Text,
      Block,
      Image,
      Icon,
      Media,
    }
  })
} else {
  app = createApp({
    template: '<div>Data Error</div>',
  })
}

app.mount('#app')