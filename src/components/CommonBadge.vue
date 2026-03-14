<template>
  <view 
    v-if="show"
    class="badge-wrapper" 
    :class="[type, preset]"
    :style="customStyle"
  >
    <text v-if="type === 'count'" class="badge-text">{{ formattedCount }}</text>
    <text v-else-if="type === 'text'" class="badge-text">{{ value }}</text>
  </view>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  type: {
    type: String,
    default: 'count' // count, dot, text
  },
  value: {
    type: [Number, String],
    default: 0
  },
  preset: {
    type: String,
    default: 'danger' // danger, primary, vip, svip, success
  },
  max: {
    type: Number,
    default: 99
  },
  customStyle: {
    type: Object,
    default: () => ({})
  }
});

const show = computed(() => {
  if (props.type === 'count') return Number(props.value) > 0;
  if (props.type === 'text') return !!props.value;
  return true; // dot always shows
});

const formattedCount = computed(() => {
  if (props.type !== 'count') return '';
  const num = Number(props.value);
  return num > props.max ? `${props.max}+` : num;
});
</script>

<style scoped>
.badge-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}

.badge-text {
  color: #ffffff;
  line-height: 1;
  text-align: center;
}

/* Types */
.count {
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: 9px;
  font-size: 11px;
  font-weight: 700;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.text {
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
}

/* Presets */
.danger {
  background-color: #ff3b30;
}

.primary {
  background-color: #007aff;
}

.success {
  background-color: #34c759;
}

.vip {
  background-color: #fff9e6;
  border: 0.5px solid rgba(255, 149, 0, 0.2);
}
.vip .badge-text {
  color: #ff9500;
}

.svip {
  background-color: #fff0f0;
  border: 0.5px solid rgba(255, 59, 48, 0.2);
}
.svip .badge-text {
  color: #ff3b30;
}
</style>
