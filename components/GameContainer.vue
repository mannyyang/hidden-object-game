<template>
  <div class="game-container">
    <div class="controls-top">
      <UButton @click="toggleMode">{{ modeText }}</UButton>
    </div>
    <div class="image-wrapper">
      <ImageContainer />
    </div>
    <div class="controls-bottom">
      <UButton @click="prevGame" :disabled="offset === total - 1">Previous</UButton>
      <UButton @click="nextGame" :disabled="offset === 0">Next</UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useGameStore } from '~/stores/gameStore';
import ImageContainer from '~/components/ImageContainer.vue';

const gameStore = useGameStore();
const { offset, total } = storeToRefs(gameStore);

const modeText = computed(() => {
  return gameStore.mode === 'saving' ? 'Switch to Playing Mode' : 'Switch to Saving Mode';
});

const toggleMode = () => {
  gameStore.toggleMode();
};

const nextGame = () => {
  gameStore.nextGame();
};

const prevGame = () => {
  gameStore.prevGame();
};

onMounted(() => {
  gameStore.loadGame(); // Load the game data on initial load
});
</script>

<style scoped>
.game-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.controls-top {
  margin-bottom: 20px;
}

.image-wrapper {
  position: relative;
  margin-bottom: 20px;
}

.controls-bottom {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.controls-bottom button:first-child {
  margin-right: auto;
}

.controls-bottom button:last-child {
  margin-left: auto;
}
</style>