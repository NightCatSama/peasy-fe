<script setup lang="ts">
import Btn from './widgets/Btn.vue';
import Avatar from './widgets/Avatar.vue';
</script>

<template>
  <div class="header">
    <div class="left"></div>
    <div class="center">
      <div class="size">Device: 1366×768</div>
    </div>
    <div class="right">
      <Btn @click="$emit('download')" text="Download"></Btn>
      <Avatar :size="36" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.header {
  width: 100%;
  height: $header-height;
  flex-shrink: 0;
  background-color: $panel-header;
  padding: 10px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;

  .left {
    flex: 1;
  }

  .right {
    display: flex;
    flex-shrink: 0;
  }

  .center {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  .size {
    height: 36px;
    padding: 0 24px;
    border-radius: $radius;
    display: flex;
    align-items: center;
    background-color: $panel-light;
  }

  .avatar {
    margin-left: 20px;
  }
}
</style>
