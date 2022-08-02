import { GroupType } from '@/config'

export const groupIconMap = {
  layout: 'layout',
  size: 'size',
  spacing: 'spacing',
  border: 'border',
  font: 'font',
  background: 'background',
  container: 'container',
  basic: 'basic',
  position: 'absolute',
  event: 'event',
  animation: 'animation',
  effect: 'effect',
} as any

export const groupTitleMap: { [key in GroupType]: string } = {
  layout: 'Layout',
  size: 'Size',
  spacing: 'Spacing',
  border: 'Border',
  font: 'Font',
  background: 'Background',
  container: 'Container',
  basic: 'Basic',
  position: 'Position',
  event: 'Event',
  animation: 'Animation',
  effect: 'Effect',
  custom: 'Custom',
}

export const defaultGroupIcon = 'basic'
