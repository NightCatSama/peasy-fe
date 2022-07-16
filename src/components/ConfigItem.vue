<script setup lang="ts">
interface IConfigItemProps {
  configure: ConfigNode
}
const { configure } = defineProps<IConfigItemProps>()
</script>

<template>
  <div>
    <div class="label">{{ configure.label }}</div>
    <!-- <div class="desc" v-if="configure.desc" v-html="configure.desc"></div> -->
    <div>
      <div v-if="configure.type === 'string'">
        <input
          type="text"
          :value="configure.get()"
          @input="(e: any) => configure.set((e.target as HTMLInputElement).value)"
        />
      </div>
      <div v-else-if="configure.type === 'length'">
        <input
          type="text"
          :value="configure.get()"
          @change="(e: any) => configure.set((e.target as HTMLInputElement).value)"
        />
      </div>
      <div v-else-if="configure.type === 'color'">
        <input
          type="color"
          :value="configure.get()"
          @input="(e: any) => configure.set((e.target as HTMLInputElement).value)"
        />
      </div>
      <div v-else-if="configure.type === 'select'">
        <select
          :value="configure.get()"
          @change="(e: any) => configure.set((e.target as HTMLInputElement).value)"
        >
          <option v-for="(label, value) in configure.options" :value="value">{{ label }}</option>
        </select>
      </div>
      <div v-else-if="configure.type === 'textarea'">
        <textarea
          type="text"
          :value="configure.get()"
          @input="(e: any) => configure.set((e.target as HTMLInputElement).value)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
input {
  width: 220px;
}
:global(em) {
  font-weight: bold;
}
</style>
