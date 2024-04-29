<template>
  <div class="bg-gray-800 text-white p-4 rounded-lg shadow max-w-md mx-auto mt-6">
    <div v-if="!showFinalScore">
      <h2 class="text-2xl font-bold text-center mb-4">Game Results</h2>
      <div v-if="results.length" class="space-y-4">
        <ul class="list-disc list-inside text-sm">
          <li v-for="(result, index) in results" :key="index">
            <strong>Round {{ index + 1 }}:</strong>
            <ul>
              <li v-for="(value, key) in result.entries" :key="key">
                <input type="checkbox" v-model="value.checked">
                {{ key }}: {{ value.value }}
              </li>
            </ul>
          </li>
        </ul>
        <div class="text-center mt-4">
          <p>Total Score: {{ totalScore }}</p>
        </div>
        <button @click="completeReview" class="px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded shadow mx-auto block">
          Complete
        </button>
      </div>
      <div v-else class="text-center text-gray-500">
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
</style>
