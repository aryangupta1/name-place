<template>
  <div class="w-full max-w-lg mx-auto px-4">
    <div v-if="!gameStarted" class="text-center">
      <button
        @click="startGame"
        class="px-8 py-3 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg transition duration-150 ease-in-out"
      >
        Start Game
      </button>
    </div>
    <div v-if="gameStarted">
      <div class="text-center">
        <button
          @click="copyLink"
          class="px-6 py-3 bg-green-500 hover:bg-green-700 text-white font-bold rounded-lg shadow-lg transition duration-150 ease-in-out"
        >
          Share Game Link
        </button>
      </div>
      <div class="p-4 text-center">
        <h2 class="text-xl font-bold text-white">
          Current Letter: {{ currentLetter || 'Not set' }}
        </h2>
        <div class="flex justify-center mt-4">
          <button
            @click="generateLetter"
            class="px-6 py-3 bg-purple-500 hover:bg-purple-700 text-white font-bold rounded-lg shadow-lg transition duration-150 ease-in-out"
          >
            Generate New Letter
          </button>
        </div>
      </div>
      <div class="flex flex-col space-y-4">
        <div
          v-for="(value, key) in currentEntries"
          :key="key"
          class="bg-gray-800 rounded-lg"
        >
          <input
            v-model="currentEntries[key]"
            :id="key"
            :placeholder="`Enter ${key}`"
            class="w-full px-4 py-3 rounded-lg"
            :disabled="stop"
            autocomplete="off"
          />
        </div>
      </div>
      <br />
      <div class="flex flex-col items-center">
        <!-- Conditionally render the Stop button if the game link has been shared -->
        <button
          v-if="shared"
          @click="stopEntries"
          class="px-6 py-3 bg-red-500 hover:bg-red-700 text-white font-bold rounded-lg shadow-lg transition duration-150 ease-in-out"
        >
          Stop
        </button>
      </div>
      <br />
      <div class="flex justify-between">
        <button
          @click="saveEntries"
          class="px-6 py-3 bg-green-500 hover:bg-green-700 text-white font-bold rounded-lg shadow-lg transition duration-150 ease-in-out"
        >
          Save
        </button>
        <button
          @click="finishGame"
          class="px-6 py-3 bg-red-500 hover:bg-red-700 text-white font-bold rounded-lg shadow-lg transition duration-150 ease-in-out"
        >
          Finish Game
        </button>
      </div>
      <br />
    </div>
    <Scorecard v-if="!gameStarted && gameFinished" />
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, computed } from 'vue'
import {
  getDatabase,
  ref as dbRef,
  onValue,
  set,
  update,
} from 'firebase/database'
import Scorecard from './Scorecard.vue'

const db = getDatabase()
let sessionId = ref(
  new URLSearchParams(window.location.search).get('session') ||
    Date.now().toString(36) + Math.random().toString(36).substring(2)
)
const baseLink =
  window.location.hostname === 'localhost'
    ? 'http://localhost:8080'
    : 'https://name-place.vercel.app'
const shareableLink = computed(() => `${baseLink}/?session=${sessionId.value}`)
const gameStateRef = dbRef(db, `gameState/${sessionId.value}`)

const gameStarted = ref(false)
const gameFinished = ref(false)
const currentLetter = ref('')
const shared = ref(false)
const stop = ref(false)
const currentEntries = reactive({
  Name: '',
  Place: '',
  Animal: '',
  Thing: '',
  Food: '',
})
const allEntries = ref([])

onMounted(() => {
  if (!new URLSearchParams(window.location.search).get('session')) {
    window.history.pushState(
      {},
      '',
      `${window.location.pathname}?session=${sessionId.value}`
    )
  }
  onValue(gameStateRef, (snapshot) => {
    const data = snapshot.val()
    if (data) {
      currentLetter.value = data.currentLetter
      shared.value = data.shared
      stop.value = data.stop
    }
  })
})

function generateLetter() {
  const possibleLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
  const randomLetter =
    possibleLetters[Math.floor(Math.random() * possibleLetters.length)]
  update(gameStateRef, { currentLetter: randomLetter, stop: false })
}

function startGame() {
  gameStarted.value = true
  gameFinished.value = false
  resetEntries()
}

function saveEntries() {
  if (Object.values(currentEntries).some((value) => value.trim() !== '')) {
    allEntries.value.push({ ...currentEntries })
    sessionStorage.setItem('gameData', JSON.stringify(allEntries.value))
    update(gameStateRef, { entries: allEntries.value })
    resetEntries()
  } else {
    alert('Cannot save as all fields are empty.')
  }
}

function finishGame() {
  gameStarted.value = false
  gameFinished.value = true
}

function copyLink() {
  navigator.clipboard
    .writeText(shareableLink.value)
    .then(() => {
      alert('Game link copied to clipboard!')
      update(gameStateRef, { shared: true })
    })
    .catch((err) => console.error('Error copying link: ', err))
}

function stopEntries() {
  update(gameStateRef, { stop: true })
}

function resetEntries() {
  for (const key in currentEntries) {
    currentEntries[key] = ''
  }
}
</script>

<style scoped>
input[type='text'] {
  text-align: center;
}
</style>
