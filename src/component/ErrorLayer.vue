<template>
  <transition name="fade">
    <div
      v-if="visible"
      class="fixed inset-0 z-[110] flex flex-col items-center justify-center bg-[#060b1a]/95 backdrop-blur-md"
    >
      <button
        @click="$emit('close')"
        class="absolute top-6 right-6 text-cyan-400 hover:text-red-400 transition text-2xl font-light"
      >
        ✕
      </button>

      <div class="relative w-20 h-20 mb-5">
        <svg viewBox="0 0 120 120" class="w-full h-full animate-spin-slow">
          <defs>
            <linearGradient id="dna" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#00E5FF" />
              <stop offset="100%" stop-color="#7D2FFF" />
            </linearGradient>
          </defs>
          <path
            d="M30 20 C80 40, 40 80, 90 100"
            stroke="url(#dna)"
            stroke-width="3"
            fill="none"
          />
          <path
            d="M90 20 C40 40, 80 80, 30 100"
            stroke="url(#dna)"
            stroke-width="3"
            fill="none"
          />
          <circle cx="60" cy="20" r="4" fill="#00E5FF" />
          <circle cx="60" cy="100" r="4" fill="#7D2FFF" />
        </svg>
        <div
          class="absolute inset-0 blur-lg opacity-40 bg-gradient-to-r from-cyan-400 to-indigo-600 rounded-full animate-pulse-glow"
        ></div>
      </div>

      <div class="text-cyan-300 text-xl font-orbitron tracking-widest mb-2">
        Some Error Occured
      </div>

      <div
        class="text-blue-200 text-sm text-center px-6 leading-relaxed max-w-md font-mono"
      >
        {{ message }}
      </div>
    </div>
  </transition>
</template>

<script setup>
defineProps({
  visible: { type: Boolean, default: false },
  message: { type: String, default: '' }
})
</script>

<style scoped>
@keyframes pulse-glow {
  0%, 100% {
    transform: scale(1);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.8;
  }
}
.animate-pulse-glow {
  animation: pulse-glow 2.5s ease-in-out infinite;
}
@keyframes spin-slow {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.animate-spin-slow {
  animation: spin-slow 8s linear infinite;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
