<template>
  <div class="min-h-screen text-white flex flex-col items-center py-12">
    <header class="text-center mb-2">
      <h1
        class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600"
      >
        Name Place
      </h1>
    </header>
    <GameBoard />
  </div>
</template>

<script setup>
import GameBoard from './components/GameBoard.vue'
</script>

<style scoped></style>
