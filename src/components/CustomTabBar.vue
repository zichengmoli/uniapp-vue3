<template>
  <view class="tab-bar">
    <view 
      class="tab-item" 
      v-for="(item, index) in tabs" 
      :key="index"
      @click="switchTab(item.path)"
    >
      <view class="icon-container" :class="{ 'active': activePath === item.path }">
        <view class="icon-indicator" v-if="activePath === item.path"></view>
        <text class="tab-icon" :class="{ 'active-text': activePath === item.path }">{{ item.iconText }}</text>
      </view>
      <text class="tab-label" :class="{ 'active-label': activePath === item.path }">{{ item.text }}</text>
    </view>
  </view>
</template>

<script setup>
const props = defineProps({
  activePath: String
});

const tabs = [
  { text: '消息', path: '/pages/index/index', iconText: 'M' },
  { text: '联系人', path: '/pages/contact/list', iconText: 'C' },
  { text: '个人', path: '/pages/mine/mine', iconText: 'P' }
];

const switchTab = (path) => {
  if (props.activePath !== path) {
    uni.switchTab({ url: path });
  }
};
</script>

<style scoped>
.tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 64px; /* Slimmer */
  background-color: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(40px);
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
  border-top: 1px solid rgba(0, 0, 0, 0.04);
  z-index: 999;
}

.tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  padding: 4px 0;
  transition: opacity 0.2s ease;
}

.tab-item:active {
  opacity: 0.7;
}

.icon-container {
  position: relative;
  width: 32px;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: transform 0.4s cubic-bezier(0.2, 1, 0.3, 1);
}

.icon-container.active {
  transform: translateY(-2px) scale(1.05);
}

.icon-indicator {
  position: absolute;
  width: 26px;
  height: 26px;
  background-color: #1a1a1a;
  border-radius: 9px;
  z-index: -1;
  animation: springIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.tab-icon {
  font-size: 13px;
  font-weight: 900;
  color: #c5c5c5;
  transition: color 0.3s ease;
}

.tab-icon.active-text {
  color: #ffffff;
}

.tab-label {
  font-size: 9px; /* Smaller */
  font-weight: 700;
  color: #c5c5c5;
  margin-top: 2px;
  transition: color 0.3s ease, font-weight 0.3s ease, transform 0.3s ease;
  letter-spacing: 0.2px;
}

.tab-label.active-label {
  color: #1a1a1a;
  font-weight: 800;
}

@keyframes springIn {
  0% { transform: scale(0.4); opacity: 0; }
  70% { transform: scale(1.1); }
  100% { transform: scale(1); opacity: 1; }
}
</style>
