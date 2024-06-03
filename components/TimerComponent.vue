<template>
  <div class="timer">{{ time }}s</div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const time = ref<number>(0);
let interval: number;

onMounted(() => {
  // interval = window.setInterval(() => {
  //   time.value += 1;
  // }, 1000);
});

onUnmounted(() => {
  clearInterval(interval);
});
</script>

<style scoped>
.timer {
  font-size: 24px;
  margin-top: 10px;
}
</style>