<template>
  <transition name="fade">
    <div
      v-if="modelValue"
      class="fixed inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center z-50"
    >
      <!-- Loading spinner -->
      <div
        class="w-16 h-16 rounded-full border-4 border-white border-t-transparent animate-spin mb-6"
      ></div>

      <h2 class="text-2xl font-bold mb-2">
        {{ title || "Processing..." }}
      </h2>

 
      <p
        v-if="message"
        class="text-white/60 text-sm max-w-md text-center leading-relaxed"
      >
        {{ message }}
      </p>
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
  transition: opacity .25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
