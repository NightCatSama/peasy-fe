import { $t } from './i18n'

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
  code: 'code',
} as any

export const groupTitleMap: { [key in string]: string } = {
  common: '',
  layout: $t('layout'),
  size: $t('size'),
  spacing: $t('spacing'),
  border: $t('border'),
  font: $t('font'),
  background: $t('background'),
  container: $t('container'),
  basic: $t('basic'),
  position: $t('position'),
  event: $t('event'),
  animation: $t('animation'),
  effect: $t('effect'),
  custom: $t('custom'),
  code: $t('code'),
}

export const defaultGroupIcon = 'basic'
