<script setup lang="ts">
import Page from './pages/Configure.vue'
</script>

<template>
  <Page msg="Hello" />
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
