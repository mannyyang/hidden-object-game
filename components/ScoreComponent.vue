<template>
  <div class="score">Score: {{ score }}</div>
</template>

<script setup lang="ts">
const props = defineProps<{ score: number }>();
</script>

<style scoped>
.score {
  font-size: 24px;
  margin-top: 10px;
}
</style>