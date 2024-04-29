<template>
  <div class="space-y-8">
    <div v-if="!gameStarted" class="text-center">
      <button @click="startGame" class="px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded shadow">
        Start Game
      </button>
    </div>
    <div v-else class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      <div v-for="(input, key) in inputs" :key="key" class="flex flex-col items-center">
        <label :for="key" class="mb-2 font-semibold">{{ key }}</label>
        <input v-model="inputs[key]" :id="key" :placeholder="`Enter a ${key}`"
               class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
               autocomplete="off"/>
      </div>
      <button @click="checkEntries" class="col-span-full md:col-span-2 lg:col-span-4 px-6 py-2 bg-green-500 hover:bg-green-600 rounded shadow">
        Check Entries
      </button>
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
  Food: ''  // Added Food category
});
const gameStarted = ref(false);

function startGame() {
  gameStarted.value = true;
  for (const key in inputs) {
    inputs[key] = ''; // Clear previous entries
  }
}

function checkEntries() {
  // You can implement logic here to validate or store entries, etc.
}
</script>

<style scoped>
</style>
