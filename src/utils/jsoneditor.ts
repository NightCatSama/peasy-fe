let JSONEditor = null

export const getJSONEditor = async() => {
  if (JSONEditor) return JSONEditor
  JSONEditor = (await import('jsoneditor')).default
}

export const createJSONEditor = async(querySelector: string) => {
  await getJSONEditor()
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
