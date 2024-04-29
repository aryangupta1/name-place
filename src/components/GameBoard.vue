<template>
  <div class="w-full max-w-screen-xl mx-auto px-4 space-y-8">
    <div v-if="!gameStarted" class="text-center">
      <button @click="startGame" class="px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded shadow">
        Start Game
      </button>
    </div>
    <div v-else class="space-y-4">
      <div class="flex justify-between items-center">
        <h2 class="text-lg font-bold">Current Letter: {{ currentLetter }}</h2>
        <br>
        <button @click="generateLetter" class="px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded shadow">
          Generate Letter
        </button>
      </div>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div v-for="(input, key) in inputs" :key="key" class="flex flex-col items-center">
          <label :for="key" class="mb-2 font-semibold">{{ key }}</label>
          <input v-model="inputs[key]" :id="key" :placeholder="`Enter a ${key}`"
                 class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                 autocomplete="off"/>
        </div>
        <button @click="checkEntries" class="col-span-full sm:col-span-2 lg:col-span-5 px-6 py-2 bg-green-500 hover:bg-green-600 rounded shadow">
          Check Entries
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';

const inputs = reactive({
  Name: '',
  Place: '',
  Animal: '',
  Thing: '',
  Food: ''
});
const gameStarted = ref(false);
const usedLetters = ref([]);
const currentLetter = ref('');

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

function startGame() {
  gameStarted.value = true;
  generateLetter();
  for (const key in inputs) {
    inputs[key] = ''; // Clear previous entries
  }
}

function checkEntries() {
  // Add logic to handle the validation of entries
  gameStarted.value = false;  // Optionally reset game state here or after displaying results
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
