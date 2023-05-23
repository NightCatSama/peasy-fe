<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

<script setup lang="ts">
import { useAttrs } from 'vue'
import { IProps, useProps } from '../hooks/common'
import { ElCalendar } from 'element-plus'
import 'element-plus/es/components/calendar/style/css'

interface IData {
}

const { elem, style, props } = useProps(useAttrs() as unknown as IProps<'Test'>)

const data: IData = props.data

const date = $ref(new Date())
</script>

<template>
  <div
    class="element-calendar"
    :style="style"
    v-bind="{
      ...props.inheritAttrs,
    }"
  >
    <el-calendar
      v-model="date"
    >
    </el-calendar>
  </div>
</template>

<style lang="scss">
.element-calendar {
}
</style>
