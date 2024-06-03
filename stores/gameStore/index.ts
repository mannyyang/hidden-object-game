import { defineStore } from "pinia";
import { ref } from "vue";
import { Game, HiddenObject } from "~/types/Game";

export const games = ref<Game[]>([]);
export const currentGameIndex = ref(0);
export const mode = ref<"playing" | "saving">("playing");
export const score = ref(0);
export const totalHiddenObjects = ref(0);
export const foundCircles = ref<HiddenObject[]>([]);

export const useGameStore = defineStore("game", {
  state: () => ({
    games,
    currentGameIndex,
    mode,
    score,
    totalHiddenObjects,
    foundCircles,
  }),
  actions: {
    async loadGame(page = 1, limit = 10) {
      try {
        const response = await fetch(
          `/api/fetch-game?page=${page}&limit=${limit}`
        );
        const data = await response.json();
        if (data.success) {
          this.games = data.games;
        } else {
          console.error(data.error);
        }
      } catch (error) {
        console.error("Failed to load games:", error);
      }
    },
    toggleMode() {
      this.mode = this.mode === "playing" ? "saving" : "playing";
      this.updateHiddenObjectsVisibility();
    },
    nextGame() {
      if (this.currentGameIndex < this.games.length - 1) {
        this.currentGameIndex++;
      } else {
        this.currentGameIndex = 0; // Loop back to the first game
      }
      this.updateHiddenObjectsVisibility();
    },
    prevGame() {
      if (this.currentGameIndex > 0) {
        this.currentGameIndex--;
      } else {
        this.currentGameIndex = this.games.length - 1; // Loop back to the last game
      }
      this.updateHiddenObjectsVisibility();
    },
    async saveGame(game: Game) {
      try {
        await fetch('/api/hidden-object-game', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(game),
        });
      } catch (error) {
        console.error('Failed to save game:', error);
      }
    },
    addCircle(circle: HiddenObject) {
      if (this.games[this.currentGameIndex]) {
        this.games[this.currentGameIndex].hidden_objects.push(circle);
        // Save the updated game object
        this.saveGame(this.games[this.currentGameIndex]);
      }
    },
    handleImageClick({ offsetX, offsetY }) {
      if (this.mode === 'saving') {
        const newCircle = {
          x: offsetX,
          y: offsetY,
          radius: 20, // Example radius
          found: true
        };
        this.addCircle(newCircle);
      } else {
        this.checkCircle(offsetX, offsetY);
      }
    },
    checkCircle(x: number, y: number) {
      if (this.games[this.currentGameIndex]) {
        for (const circle of this.games[this.currentGameIndex].hidden_objects) {
          const dx = x - circle.x;
          const dy = y - circle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance <= circle.radius) {
            circle.found = true;
            this.foundCircles.push(circle);
            this.score++;
            this.saveGame(this.games[this.currentGameIndex]); // Save game state after finding a circle
            break;
          }
        }
      }
    },
    updateHiddenObjectsVisibility() {
      if (this.games[this.currentGameIndex]) {
        const hiddenObjects = this.games[this.currentGameIndex].hidden_objects;
        hiddenObjects.forEach((obj) => {
          obj.found = this.mode === 'saving' || obj.found;
        });
      }
    },
  },
});