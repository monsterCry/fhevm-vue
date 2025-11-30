<template>
  <transition name="fade">
    <div
      v-if="modelValue"
      class="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center px-4"
    >
      <div
        class="w-full max-w-md rounded-2xl bg-[#1f1f22] border border-red-500/30 shadow-xl p-6 text-center"
      >
        <div class="text-red-400 text-4xl mb-3">⚠️</div>

        <h2 class="text-xl font-bold mb-2 text-red-400">
          {{ title || "Error" }}
        </h2>

        <p class="text-white/70 text-sm leading-relaxed whitespace-pre-line">
          {{ message }}
        </p>

        <p v-if="footer" class="text-xs text-white/40 mt-3">
          {{ footer }}
        </p>

        <button
          @click="$emit('update:modelValue', false)"
          class="mt-6 w-full py-2 rounded-xl bg-red-500/70 hover:bg-red-500 transition font-semibold shadow"
        >
          Close
        </button>
      </div>
    </div>
  </transition>
</template>

<script setup>
defineProps({
  modelValue: Boolean,
  title: String,
  message: String,
  footer: String,
});

defineEmits(["update:modelValue"]);
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
