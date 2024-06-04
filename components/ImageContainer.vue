<template>
  <div class="image-container" :style="{
    width: game?.image_width + 'px',
    height: game?.image_height + 'px'
  }">
    <img 
      :src="`http://localhost:8055/assets/${game?.image}`" 
      :width="game?.image_width" 
      :height="game?.image_height" 
      alt="Hidden Object Game" 
      @click="handleImageClick"
    />
    <div v-for="(obj) in game?.hidden_objects" :key="obj.x + obj.y" :style="{
      left: `${obj.x - obj.radius}px`,
      top: `${obj.y - obj.radius}px`,
      width: `${obj.radius * 2}px`,
      height: `${obj.radius * 2}px`,
      borderRadius: '50%',
      position: 'absolute',
      border: '2px solid red',
      display: obj.found ? 'block' : 'none'
    }"></div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useGameStore } from '@/stores/gameStore';

const gameStore = useGameStore();
const { game } = storeToRefs(gameStore);

const handleImageClick = (event) => {
  const img = event.currentTarget;
  const wrapperRect = img.getBoundingClientRect();
  const offsetX = event.clientX - wrapperRect.left;
  const offsetY = event.clientY - wrapperRect.top;

  gameStore.handleImageClick({ offsetX, offsetY });
};
</script>

<style scoped>
.image-container {
  position: relative;
  display: inline-block;
}

.image-container img {
  display: block;
}

.image-container div {
  pointer-events: none;
  /* Ensure the overlay doesn't interfere with image clicks */
}
</style>