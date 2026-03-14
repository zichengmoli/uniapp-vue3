<template>
  <view 
    class="avatar-wrapper" 
    :class="[size, shape]" 
    @click="$emit('click')"
    :style="customStyle"
  >
    <image 
      class="avatar-img" 
      :src="src" 
      mode="aspectFill" 
      @error="onImageError"
    />
    <view class="online-indicator" v-if="showStatus && online"></view>
  </view>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  src: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: 'medium' // small, medium, large, x-large
  },
  shape: {
    type: String,
    default: 'square' // square, round
  },
  online: {
    type: Boolean,
    default: false
  },
  showStatus: {
    type: Boolean,
    default: false
  },
  customStyle: {
    type: Object,
    default: () => ({})
  }
});

defineEmits(['click']);

const onImageError = (e) => {
  // Handle fallback or placeholder logic here if needed
};
</script>

<style scoped>
.avatar-wrapper {
  position: relative;
  display: inline-block;
  flex-shrink: 0;
  background-color: #f0f1f5;
  transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  transform: translateZ(0);
  will-change: transform;
}

.avatar-wrapper:active {
  transform: scale(0.95);
}

.avatar-img {
  width: 100%;
  height: 100%;
  display: block;
}

/* Shapes */
.square {
  border-radius: 12px;
}
.square .avatar-img {
  border-radius: 12px;
}

.round {
  border-radius: 50%;
}
.round .avatar-img {
  border-radius: 50%;
}

/* Sizes */
.small {
  width: 32px;
  height: 32px;
}

.medium {
  width: 44px;
  height: 44px;
}

.large {
  width: 56px;
  height: 56px;
}

.x-large {
  width: 100px;
  height: 100px;
  border-radius: 32px;
}
.x-large .avatar-img {
  border-radius: 32px;
}

/* Status Indicator */
.online-indicator {
  position: absolute;
  bottom: 0px;
  right: 0px;
  width: 12px;
  height: 12px;
  background-color: #34c759;
  border: 2px solid #ffffff;
  border-radius: 50%;
  z-index: 2;
}

.small .online-indicator {
  width: 10px;
  height: 10px;
}
</style>
