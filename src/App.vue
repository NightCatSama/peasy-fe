<script setup lang="ts">
import Page from './pages/Configure.vue'
</script>

<template>
  <Page msg="Hello" />
</template>

<style lang="scss">
@font-face {
  font-family: 'Lato';
  src: url('/fonts/Lato-Regular.ttf') format('truetype');
  font-weight: normal;
}
@font-face {
  font-family: 'Lato';
  src: url('/fonts/Lato-Bold.ttf') format('truetype');
  font-weight: bold;
}
@font-face {
  font-family: 'Lato';
  src: url('/fonts/Lato-Light.ttf') format('truetype');
  font-weight: lighter;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
}
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
</style>
