<template>
  <div class="w-full max-w-md mx-auto px-4 space-y-6">
    <div v-if="!gameStarted" class="text-center">
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
          Finish Game
        </button>
        <button @click="clearEntries" class="px-6 py-2 bg-red-500 hover:bg-red-600 rounded shadow">
          Clear Entries
        </button>
      </div>
    </div>
    <Scorecard v-if="!gameStarted && gameFinished"/>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import Scorecard from './Scorecard.vue';

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
  generateLetter(); // Optionally generate a new letter each time entries are saved
}

function finishGame() {
  gameStarted.value = false;
  gameFinished.value = true;
}

function clearEntries() {
  sessionStorage.removeItem('gameData')
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
