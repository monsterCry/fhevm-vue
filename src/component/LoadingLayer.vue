<template>
  <transition name="fade">
    <div
      v-if="visible"
      class="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050910]/90 backdrop-blur-sm"
    >
      <div class="relative w-20 h-20 mb-6">
        <div class="absolute inset-0 animate-spin-slow">
          <svg viewBox="0 0 100 100" class="w-full h-full">
            <defs>
              <linearGradient id="dna-chain" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="#00E5FF" />
                <stop offset="100%" stop-color="#0077FF" />
              </linearGradient>
            </defs>
            <path
              d="M30,10 Q70,50 30,90"
              stroke="url(#dna-chain)"
              stroke-width="4"
              fill="none"
              stroke-linecap="round"
            />
            <path
              d="M70,10 Q30,50 70,90"
              stroke="url(#dna-chain)"
              stroke-width="4"
              fill="none"
              stroke-linecap="round"
            />
          </svg>
        </div>
      </div>

      <div class="text-cyan-300 text-lg font-orbitron tracking-widest text-center">
        Loading…
      </div>

      <div v-if="message" class="mt-2 text-sm text-cyan-500/80 font-light tracking-wide">
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
@keyframes spin-slow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
.animate-spin-slow {
  animation: spin-slow 3.5s linear infinite;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
