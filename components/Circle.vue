<template>
  <div class="circle" :style="circleStyle"></div>
</template>

<script setup lang="ts">
import { defineProps, computed } from 'vue';

const props = defineProps<{
  x: number;
  y: number;
  radius: number;
}>();

const circleStyle = computed(() => ({
  top: `${props.y}px`,
  left: `${props.x}px`,
  width: `${props.radius * 2}px`,
  height: `${props.radius * 2}px`,
}));
</script>

<style scoped>
.circle {
  position: absolute;
  border: 4px solid red;
  border-radius: 50%;
  transform: translate(-50%, -50%);
}
</style>