import JSONEditorType from 'jsoneditor'
import type { JSONEditorOptions } from 'jsoneditor'

let JSONEditor: (JSONEditorType | null) = null

export const getJSONEditor = async() => {
  if (JSONEditor) return JSONEditor
  JSONEditor = (await import('jsoneditor') as any).default
}

export const createJSONEditor = async(querySelector: string) => {
  await getJSONEditor()
  if (!JSONEditor) {
    console.error('jsoneditor load failed')
    return
  }
  const elem = document.querySelector(querySelector) as HTMLDivElement
  if (!elem) return
  return new (JSONEditor as any)(elem, {
    mode: 'text',
    mainMenuBar: false,
    navigationBar: false,
    statusBar: false,
  } as JSONEditorOptions)
}
