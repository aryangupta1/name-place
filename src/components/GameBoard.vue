<template>
  <div class="w-full max-w-lg mx-auto px-4 space-y-8">
    <div v-if="!gameStarted" class="text-center">
<<<<<<< Updated upstream
      <button @click="startGame" class="px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded shadow">
        Start Game
      </button>
    </div>
    <div v-if="gameStarted" class="space-y-6">
      <div class="flex justify-between items-center">
        <h2 class="text-lg font-bold">Letter: {{ currentLetter }}</h2>
        <button @click="generateLetter" class="px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded shadow">
          New Letter
        </button>
      </div>
      <div class="flex flex-col space-y-4">
        <div v-for="(value, key) in currentEntries" :key="key">
          <input v-model="currentEntries[key]" :id="key" :placeholder="`Enter ${key}`"
                 class="w-full px-4 py-3 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                 autocomplete="off"/>
        </div>
      </div>
      <div class="flex justify-between">
        <button @click="saveEntries" class="px-6 py-2 bg-green-500 hover:bg-green-600 rounded shadow">
          Save
        </button>
        <button @click="finishGame" class="px-6 py-2 bg-red-500 hover:bg-red-600 rounded shadow">
=======
      <button @click="startGame" class="px-8 py-3 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg transition duration-150 ease-in-out">
        Start Game
      </button>
    </div>
    <div v-if="gameStarted" class="space-y-8">
      <div class="bg-gray-900 p-4 rounded-lg shadow-md">
        <h2 class="text-xl font-bold text-white">Letter: {{ currentLetter }}</h2>
        <div class="flex items-center justify-between mt-4">
          <button @click="generateLetter" class="px-4 py-2 bg-purple-500 hover:bg-purple-700 text-white font-bold rounded-lg shadow-lg transition duration-150 ease-in-out">
            New Letter
          </button>
          <div class="flex-1 ml-4">
            <input type="text" readonly :value="shareableLink" class="w-full bg-gray-800 text-gray-300 p-2 rounded-lg border border-gray-700 text-center">
          </div>
          <button @click="copyLink" class="ml-4 px-4 py-2 bg-green-500 hover:bg-green-700 text-white font-bold rounded-lg shadow-lg transition duration-150 ease-in-out">
            Copy Link
          </button>
        </div>
      </div>
      <div class="flex flex-col space-y-4">
        <div v-for="(value, key) in currentEntries" :key="key" class="bg-gray-800 p-4 rounded-lg">
          <input v-model="currentEntries[key]" :id="key" :placeholder="`Enter ${key}`" class="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500" autocomplete="off" />
        </div>
      </div>
      <div class="flex justify-between">
        <button @click="saveEntries" class="px-6 py-3 bg-green-500 hover:bg-green-700 text-white font-bold rounded-lg shadow-lg transition duration-150 ease-in-out">
          Save
        </button>
        <button @click="finishGame" class="px-6 py-3 bg-red-500 hover:bg-red-700 text-white font-bold rounded-lg shadow-lg transition duration-150 ease-in-out">
>>>>>>> Stashed changes
          Finish Game
        </button>
      </div>
    </div>
    <Scorecard v-if="!gameStarted && gameFinished"/>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, computed } from "vue";
import { getDatabase, ref as dbRef, onValue, set } from "firebase/database";
import Scorecard from "./Scorecard.vue";

const db = getDatabase();

const currentLetter = ref(''); // Make sure this is reactive
let sessionId = ref(new URLSearchParams(window.location.search).get("session") || Date.now().toString(36) + Math.random().toString(36).substring(2));
const baseLink = window.location.hostname === "localhost" ? "http://localhost:8080" : "https://name-place.vercel.app";
const shareableLink = computed(() => `${baseLink}/?session=${sessionId.value}`);
const letterRef = dbRef(db, `gameState/${sessionId.value}/currentLetter`);

onMounted(() => {
  if (!new URLSearchParams(window.location.search).get("session")) {
    window.history.pushState({}, '', `${window.location.pathname}?session=${sessionId.value}`);
  }
  onValue(letterRef, (snapshot) => {
    const data = snapshot.val();
    currentLetter.value = data || 'A'; // Set a default letter if none is found
  });
});

function generateLetter() {
  const possibleLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const randomLetter = possibleLetters[Math.floor(Math.random() * possibleLetters.length)];
  set(letterRef, randomLetter);
}

const gameStarted = ref(false);
const gameFinished = ref(false);
const usedLetters = ref([]);
const currentLetter = ref('');
const currentEntries = reactive({ Name: '', Place: '', Animal: '', Thing: '', Food: '' });
const allEntries = ref([]);

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

function startGame() {
  gameStarted.value = true;
  gameFinished.value = false;
  generateLetter();
  resetEntries();
  clearEntries();
}

function saveEntries() {
  allEntries.value.push({ ...currentEntries });
  sessionStorage.setItem('gameData', JSON.stringify(allEntries.value));
  resetEntries();
}

function finishGame() {
  gameStarted.value = false;
  gameFinished.value = true;
}

function copyLink() {
  navigator.clipboard.writeText(shareableLink.value)
    .then(() => alert("Link copied to clipboard!"))
    .catch(err => console.error("Error copying link: ", err));
}

function resetEntries() {
  for (const key in currentEntries) {
    currentEntries[key] = '';
  }
}

function generateLetter() {
  if (usedLetters.value.length === alphabet.length) {
    usedLetters.value = []; // Reset if all letters have been used
  }

  let possibleLetters = alphabet.filter(letter => !usedLetters.value.includes(letter));
  let randomLetter = possibleLetters[Math.floor(Math.random() * possibleLetters.length)];
  usedLetters.value.push(randomLetter);
  currentLetter.value = randomLetter;
}
</script>

<style scoped>
</style>
