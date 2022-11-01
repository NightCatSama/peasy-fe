import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import { onMounted, onUnmounted, ref } from 'vue'

export const usePreviewURL = (url: string) => {
  const userStore = useUserStore()
  const { accessToken } = storeToRefs(userStore)
  let previewURL = ref('')

  onMounted(async () => {
    var xhr = new XMLHttpRequest()
    // 需要在请求头中设置 Authorization，否则自己为公开的模板也无法预览
    xhr.open('GET', url)
    xhr.onreadystatechange = handler
    xhr.responseType = 'blob'
    xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken.value)
    xhr.send()

    function handler(this: XMLHttpRequest) {
      if (this.readyState === this.DONE) {
        if (this.status === 200) {
          previewURL.value = URL.createObjectURL(this.response)
        } else {
          console.error('Error')
        }
      }
    }
  })

  onUnmounted(() => {
    if (previewURL.value) {
      URL.revokeObjectURL(previewURL.value)
    }
  })

  return {
    previewURL,
  }
}
