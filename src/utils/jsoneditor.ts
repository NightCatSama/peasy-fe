import JSONEditor from 'jsoneditor'
import type { JSONEditorOptions } from 'jsoneditor'

export const createJSONEditor = async(querySelector: string) => {
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
