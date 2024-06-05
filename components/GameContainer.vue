<template>
  <div class="game-container">
    <div class="controls-top">
      <!-- <UButton @click="toggleMode">{{ modeText }}</UButton> -->
    </div>
    <div class="description">
      {{ gameDescription }}
    </div>
    <div class="image-wrapper">
      <ImageContainer />
    </div>
    <div class="controls-bottom">
      <UButton @click="prevGame" :disabled="offset === total - 1">Previous</UButton>
      <div class="score">
        {{ foundObjects }} / {{ totalObjects }} Objects Found
      </div>
      <UButton @click="nextGame" :disabled="offset === 0">Next</UButton>
    </div>
    <div class="instructions">
      Click on the hidden objects in the image to find them.
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useGameStore } from '~/stores/gameStore';
import ImageContainer from '~/components/ImageContainer.vue';

const gameStore = useGameStore();
const { offset, total, game } = storeToRefs(gameStore);

const modeText = computed(() => {
  return gameStore.mode === 'saving' ? 'Switch to Playing Mode' : 'Switch to Saving Mode';
});

const foundObjects = computed(() => {
  return game.value?.hidden_objects.filter(obj => obj.found).length || 0;
});

const totalObjects = computed(() => {
  return game.value?.hidden_objects.length || 0;
});

const gameDescription = computed(() => {
  return game.value?.description || '';
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

.description {
  margin-bottom: 20px;
  font-size: 1.2em;
  text-align: center;
}

.image-wrapper {
  position: relative;
  margin-bottom: 20px;
}

.controls-bottom {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 0 20px;
}

.score {
  display: flex;
  align-items: center;
  margin: 0 20px;
}

.controls-bottom button:first-child {
  margin-right: auto;
}

.controls-bottom button:last-child {
  margin-left: auto;
}

.instructions {
  margin-top: 20px;
  font-size: 1em;
  text-align: center;
}
</style>