<template>
  <div>
    <button @click="toggleMode">{{ modeText }}</button>
    <div class="image-wrapper">
      <ImageContainer />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useGameStore } from '~/stores/gameStore';
import ImageContainer from '~/components/ImageContainer.vue';

const gameStore = useGameStore();

const modeText = computed(() => {
  return gameStore.mode === 'saving' ? 'Switch to Playing Mode' : 'Switch to Saving Mode';
});

const toggleMode = () => {
  gameStore.toggleMode();
};

onMounted(() => {
  gameStore.loadGame(); // Load the game data on initial load
});
</script>

<style scoped>
.image-wrapper {
  position: relative;
}
</style>