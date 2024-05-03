<template>
  <div class="w-full max-w-md mx-auto px-4 space-y-6">
    <div v-if="!gameStarted" class="text-center">
      <button @click="startGame" class="px-6 py-3 bg-blue-500 hover:bg-blue-700 rounded-lg shadow-lg text-white font-bold">
        Start Game
      </button>
    </div>
    <div v-if="gameStarted" class="space-y-6">
      <div class="flex justify-between items-center">
        <h2 class="text-lg font-bold">Letter: {{ currentLetter }}</h2>
        <button @click="generateLetter" class="px-4 py-2 bg-purple-500 hover:bg-purple-700 rounded-lg shadow-lg text-white font-bold">
          New Letter
        </button>
        <input type="text" readonly :value="shareableLink" class="bg-gray-200 text-gray-800 rounded-lg p-2 text-center">
        <button @click="copyLink" class="px-4 py-2 bg-green-500 hover:bg-green-700 rounded-lg shadow-lg text-white font-bold">
          Copy Link
        </button>
      </div>
      <div class="flex flex-col space-y-4">
        <div v-for="(value, key) in currentEntries" :key="key">
          <input v-model="currentEntries[key]" :id="key" :placeholder="`Enter ${key}`" class="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" autocomplete="off" />
        </div>
      </div>
      <div class="flex justify-between">
        <button @click="saveEntries" class="px-6 py-3 bg-green-500 hover:bg-green-700 rounded-lg shadow-lg text-white font-bold">
          Save
        </button>
        <button @click="finishGame" class="px-6 py-3 bg-red-500 hover:bg-red-700 rounded-lg shadow-lg text-white font-bold">
          Finish Game
        </button>
      </div>
    </div>
    <Scorecard v-if="!gameStarted && gameFinished" />
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, computed } from "vue";
import { getDatabase, ref as dbRef, onValue, set } from "firebase/database";
import Scorecard from "./Scorecard.vue";

const db = getDatabase();

let sessionId = ref(new URLSearchParams(window.location.search).get('session') || Date.now().toString(36) + Math.random().toString(36).substring(2));
const baseLink = window.location.hostname === 'localhost' ? 'http://localhost:8080' : 'https://name-place.vercel.app';

const shareableLink = computed(() => `${baseLink}/?session=${sessionId.value}`);

const letterRef = dbRef(db, `gameState/${sessionId.value}/currentLetter`);

onMounted(() => {
  if (!new URLSearchParams(window.location.search).get('session')) {
    window.history.pushState({}, '', `${window.location.pathname}?session=${sessionId.value}`);
  }
  onValue(letterRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      currentLetter.value = data;
    }
  });
});

function generateLetter() {
  const possibleLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const randomLetter = possibleLetters[Math.floor(Math.random() * possibleLetters.length)];
  set(letterRef, randomLetter);
}

const gameStarted = ref(false);
const gameFinished = ref(false);
const currentEntries = reactive({ Name: "", Place: "", Animal: "", Thing: "", Food: "" });
const allEntries = ref([]);

function startGame() {
  gameStarted.value = true;
  gameFinished.value = false;
  generateLetter();
  resetEntries();
}

function saveEntries() {
  allEntries.value.push({ ...currentEntries });
  sessionStorage.setItem("gameData", JSON.stringify(allEntries.value));
  resetEntries();
  generateLetter();
}

function finishGame() {
  gameStarted.value = false;
  gameFinished.value = true;
}

function copyLink() {
  navigator.clipboard.writeText(shareableLink.value)
    .then(() => alert('Link copied to clipboard!'))
    .catch(err => console.error('Error copying link: ', err));
}

function resetEntries() {
  for (const key in currentEntries) {
    currentEntries[key] = "";
  }
}
</script>

<style scoped>
input[type="text"] {
  text-align: center;
}
</style>
