export const copyToClipboard = async (text: string) => {
  const data = [new ClipboardItem({ 'text/plain': new Blob([text], { type: 'text/plain' }) })]
  await navigator.clipboard.write(data)
}

export const getClipboardText = async () => {
  return await navigator.clipboard.readText()
}
