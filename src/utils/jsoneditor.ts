import JSONEditor from 'jsoneditor'

export const createJSONEditor = async(querySelector: string) => {
  if (!JSONEditor) {
    console.error('jsoneditor load failed')
    return
  }
  const elem = document.querySelector(querySelector) as HTMLDivElement
  if (!elem) return
  return new JSONEditor(elem, {
    mode: 'text',
    mainMenuBar: false,
    navigationBar: false,
    statusBar: false,
  })
}
