<template>
  <div class="w-full max-w-lg mx-auto px-4 space-y-8">
    <div v-if="!gameStarted" class="text-center">
      <button @click="startGame" class="px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded shadow">
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
        <button @click="finishGame" class="px-6 py-2 bg-red-500 hover:bg-red-600 rounded shadow">
          Finish Game
        </button>
      </div>
    </div>
    <Scorecard v-if="!gameStarted && gameFinished" />
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import Scorecard from './Scorecard.vue';

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
    currentEntries[key] = "";
  }
}
</script>

<style scoped>
input[type="text"] {
  text-align: center;
}
</style>
