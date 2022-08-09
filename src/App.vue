<script setup lang="ts">
import Page from './pages/Configure.vue'
import Redirect from './pages/Redirect.vue'

const path = $computed(() => location.pathname)
</script>

<template>
  <Suspense>
    <Redirect v-if="path.startsWith('/no-code/redirect')" />
    <Page v-else />
  </Suspense>
</template>

<style lang="scss">
@import '@/styles/draggable.scss';
@import '@/styles/page.scss';
@import '@/styles/animation.scss';
@import '@/styles/tooltip.scss';
@import '@/styles/moveable.scss';

#app {
  font-family: $font-family;
}
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
</style>
