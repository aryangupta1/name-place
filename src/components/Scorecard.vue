<template>
  <div class="bg-gray-800 text-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto mt-8">
    <div v-if="!showFinalScore">
      <h2 class="text-2xl font-bold text-center mb-6">Game Results</h2>
      <div v-if="results.length" class="space-y-6">
        <div v-for="(result, index) in results" :key="index" class="bg-gray-700 p-4 rounded-lg">
          <h3 class="text-lg font-semibold text-purple-300 mb-2">Round {{ index + 1 }}</h3>
          <ul class="list-none space-y-2">
            <li v-for="(value, key) in result.entries" :key="key" class="flex items-center justify-between">
              <label class="flex items-center">
                <input type="checkbox" v-model="value.checked" class="form-checkbox h-5 w-5 text-purple-500">
                <span class="ml-2">{{ key }}: {{ value.value }}</span>
              </label>
            </li>
          </ul>
        </div>
        <div class="text-center mt-4">
          <p class="text-xl">Total Score: {{ totalScore }}</p>
        </div>
        <button @click="completeReview" class="w-full px-6 py-2 mt-4 bg-blue-500 hover:bg-blue-600 rounded shadow">
          Complete
        </button>
      </div>
      <div v-else class="text-center text-gray-400">
        <p>No results to display.</p>
      </div>
    </div>
    <div v-else class="text-center">
      <h2 class="text-2xl font-bold mb-4">Final Score: {{ totalScore }}</h2>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';

const results = ref([]);
const showFinalScore = ref(false);

onMounted(() => {
  loadResults();
});

function loadResults() {
  const savedData = sessionStorage.getItem('gameData');
  if (savedData) {
    const loadedResults = JSON.parse(savedData);
    loadedResults.forEach(result => {
      const newEntries = {};
      for (const key in result) {
        newEntries[key] = { value: result[key], checked: false };
      }
      result.entries = newEntries;
    });
    results.value = loadedResults;
  }
}

const totalScore = computed(() => {
  let score = 0;
  results.value.forEach(result => {
    for (const key in result.entries) {
      if (result.entries[key].checked) score += 1;
    }
  });
  return score;
});

function completeReview() {
  showFinalScore.value = true;
}
</script>

<style scoped>
.form-checkbox {
  border-radius: 0.375rem; /* Tailwind default for rounded-md */
  background-color: transparent;
  border-color: #9ca3af; /* Gray-400 */
}
</style>
