import { defineStore } from "pinia";
import { ref } from "vue";
import { Game, HiddenObject } from "~/types/Game";

export const useGameStore = defineStore("game", {
  state: () => ({
    game: ref<Game>({
      hidden_objects: [],
      id: 0,
      status: "",
      date_created: "",
      date_updated: "",
      image_width: 0,
      image_url: "",
      image_height: 0,
    }),
    mode: ref<"playing" | "saving">("playing"),
    score: ref(0),
    totalHiddenObjects: ref(0),
    foundCircles: ref<HiddenObject[]>([]),
    offset: ref(0),
    total: ref(0),
  }),
  actions: {
    async loadGame(offset = 0) {
      try {
        const response = await fetch(
          `/api/fetch-game?offset=${offset}&limit=1`
        );
        const data = await response.json();
        if (data.success) {
          this.game = data.games[0];
          this.total = data.total;

          // Default hidden_objects to an empty array if it's not present
          this.game.hidden_objects = this.game.hidden_objects || [];

          this.offset = offset;
          this.updateHiddenObjectsVisibility();
        } else {
          console.error(data.error);
        }
      } catch (error) {
        console.error("Failed to load game:", error);
      }
    },
    toggleMode() {
      if (this.mode === "saving") {
        this.mode = "playing";
        // Clear found circles when switching to playing mode
        this.foundCircles = [];
      } else {
        this.mode = "saving";
      }
      this.updateHiddenObjectsVisibility();
    },
    nextGame() {
      if (this.offset > 0) {
        this.loadGame(--this.offset);
      }
    },
    prevGame() {
      this.loadGame(++this.offset);
    },
    async saveGame(game: Game) {
      try {
        await fetch("/api/hidden-object-game", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(game),
        });
      } catch (error) {
        console.error("Failed to save game:", error);
      }
    },
    addCircle(circle: HiddenObject) {
      if (this.game) {
        this.game.hidden_objects.push(circle);
        // Save the updated game object
        this.saveGame(this.game);
      }
    },
    handleImageClick({ offsetX, offsetY }) {
      if (this.mode === "saving") {
        const newCircle = {
          x: offsetX,
          y: offsetY,
          radius: 40, // Example radius
          found: true,
        };
        this.addCircle(newCircle);
      } else {
        this.checkCircle(offsetX, offsetY);
      }
    },
    checkCircle(x: number, y: number) {
      if (this.game && this.game.hidden_objects) {
        for (const circle of this.game.hidden_objects) {
          const dx = x - circle.x;
          const dy = y - circle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance <= circle.radius) {
            circle.found = true;
            this.foundCircles.push(circle);
            this.score++;
            break;
          }
        }
      }
    },
    updateHiddenObjectsVisibility() {
      if (this.game) {
        const hiddenObjects = this.game.hidden_objects || [];
        hiddenObjects.forEach((obj) => {
          obj.found = this.mode === "saving" || obj.found;
        });
      }
    },
  },
});
