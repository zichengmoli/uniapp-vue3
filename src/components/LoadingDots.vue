<template>
  <view :class="['elegant-dots-container', customClass]">
    <view :class="['elegant-dots', { 'pulsing': pulsing }, size]">
      <view 
        class="dot" 
        v-for="i in 3" 
        :key="i" 
        :style="{ animationDelay: `${(i-1)*0.2}s` }"
      ></view>
    </view>
  </view>
</template>

<script setup>
defineProps({
  pulsing: {
    type: Boolean,
    default: false
  },
  size: {
    type: String,
    default: '' // 'small' or empty
  },
  customClass: {
    type: String,
    default: ''
  }
});
</script>

<style scoped>
.elegant-dots-container {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.elegant-dots {
  display: flex;
  gap: 6px;
  align-items: center;
  transform: translateZ(0);
  will-change: transform;
}

.elegant-dots .dot {
  width: 8px;
  height: 3px;
  background-color: #adb5bd;
  border-radius: 2px;
  opacity: 0.3;
}

.elegant-dots.pulsing .dot {
  animation: dot-pulse 1.2s ease-in-out infinite;
}

.elegant-dots.small .dot {
  width: 6px;
  height: 2px;
  gap: 3px;
}

@keyframes dot-pulse {
  0%, 100% { transform: scale(1); opacity: 0.3; }
  50% { transform: scale(1.4); opacity: 0.8; }
}
</style>
