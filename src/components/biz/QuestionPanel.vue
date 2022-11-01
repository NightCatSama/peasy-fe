<script setup lang="ts">
import Icon from '../widgets/Icon.vue'
const covertText = (str: string) => {
  str = str.replace(/「.*?」/g, (str) => `「<strong>${str.slice(1, -1)}</strong>」`)
  str = str.replace(/\[.*?\]/g, (str) => `[<strong>${str.slice(1, -1)}</strong>]`)
  return str
}
</script>

<template>
  <div :class="['question-panel']">
    <div class="question-panel-title">
      <Icon name="question-circle" :size="16"></Icon>
      <span>{{ $t('question') }}</span>
    </div>
    <div class="question-item">
      <div class="question-item-question" v-html="covertText($t('question1'))"></div>
      <div class="question-item-answer" v-html="covertText($t('answer1'))"></div>
    </div>
    <div class="question-item">
      <div class="question-item-question" v-html="covertText($t('question2'))"></div>
      <div class="question-item-answer" v-html="covertText($t('answer2'))"></div>
    </div>
    <div class="question-item">
      <div class="question-item-question" v-html="covertText($t('question3'))"></div>
      <div class="question-item-answer" v-html="covertText($t('answer3'))"></div>
    </div>
    <div class="question-item">
      <div class="question-item-question" v-html="covertText($t('question4'))"></div>
      <div class="question-item-answer" v-html="covertText($t('answer4'))"></div>
    </div>
  </div>
</template>

<style lang="scss">
.question-panel {
  width: $question-panel-width;
  max-height: 80vh;
  overflow-y: auto;
  border-radius: $normal-radius;
  z-index: $global-setting-panel-zIndex;
  box-shadow: $shadow;
  background: $panel-sidebar-gradient;
  padding: 16px;
  display: flex;
  flex-direction: column;

  &-title {
    color: $white;
    font-size: 16px;
    padding-bottom: 16px;
    display: flex;
    align-items: center;
  }

  .question-item {
    font-size: 14px;
    line-height: 18px;

    &:not(:last-child) {
      margin-bottom: 18px;
    }

    &-question {
      color: $yellow;
      font-weight: bold;
      margin-bottom: 4px;
    }

    &-answer {
      color: darken($color, 10%);
      font-size: 12px;
      word-wrap: normal;
      white-space: normal;

      li {
        list-style: none;
        margin: 8px 0 2px 0;
        color: $color;
        color: lighten($yellow, 24%);
      }

      strong {
        color: $white;
      }

      a {
        color: $blue;
      }
    }
  }
}
</style>
