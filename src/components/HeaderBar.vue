<template>
  <view class="header-bar-wrapper">
    <view class="header" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="header-content" v-if="!showSearch">
        <text class="title">{{ title }}</text>
        <view class="header-actions">
          <view class="icon-btn search-btn" @click="openSearch">
            <view class="icon-search-glass"></view>
          </view>
          <view class="icon-btn add-btn" @click="toggleActionMenu">
            <view class="icon-plus-thin"></view>
          </view>
        </view>
      </view>

      <view class="search-header" v-else :style="{ paddingRight: capsuleWidth + 'px' }">
        <view class="search-input-wrapper">
          <view class="icon-search-glass-mini"></view>
          <input 
            class="search-input"
            v-model="internalSearchText"
            :placeholder="placeholder"
            placeholder-style="color: #999;"
            :focus="showSearch"
            @input="onInput"
          />
          <view class="search-clear" v-if="internalSearchText" @click="clearSearch">
            <text class="clear-icon">×</text>
          </view>
        </view>
        <text class="search-cancel" @click="closeSearch">取消</text>
      </view>
    </view>

    <!-- Global Header Action Popover -->
    <view class="action-popover-mask" v-if="showActionMenu" @click="showActionMenu = false" @touchmove.stop.prevent></view>
    <view class="action-popover" v-if="showActionMenu" :style="{ top: (statusBarHeight + 54) + 'px' }">
      <view class="popover-arrow"></view>
      <view class="popover-content">
        <view class="popover-item" hover-class="popover-item-hover" @click="handleAction('group')">
          <view class="popover-icon icon-group-chat"></view>
          <text class="popover-text">发起群聊</text>
        </view>
        <view class="popover-item border-none" hover-class="popover-item-hover" @click="handleAction('add')">
          <view class="popover-icon icon-add-contact"></view>
          <text class="popover-text">添加联系人</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';

const props = defineProps({
  title: {
    type: String,
    default: '消息'
  },
  searchText: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: '搜索'
  }
});

const emit = defineEmits(['update:searchText', 'action']);

const statusBarHeight = ref(20);
const showSearch = ref(false);
const showActionMenu = ref(false);
const capsuleWidth = ref(16);
const internalSearchText = ref(props.searchText);

watch(() => props.searchText, (newVal) => {
  internalSearchText.value = newVal;
});

const openSearch = () => {
  showSearch.value = true;
};

const closeSearch = () => {
  showSearch.value = false;
  internalSearchText.value = '';
  emit('update:searchText', '');
};

const onInput = (e) => {
  emit('update:searchText', internalSearchText.value);
};

const clearSearch = () => {
  internalSearchText.value = '';
  emit('update:searchText', '');
};

const toggleActionMenu = () => {
  showActionMenu.value = !showActionMenu.value;
};

const handleAction = (type) => {
  showActionMenu.value = false;
  emit('action', type);
  const labels = { 'group': '发起群聊', 'add': '添加联系人' };
  uni.showToast({ title: `${labels[type]} 功能即将推出`, icon: 'none' });
};

onMounted(() => {
  const systemInfo = uni.getSystemInfoSync();
  statusBarHeight.value = systemInfo.statusBarHeight || 20;

  // #ifdef MP-WEIXIN
  try {
    const menuRect = uni.getMenuButtonBoundingClientRect();
    if (menuRect) {
      const screenWidth = systemInfo.screenWidth || 375;
      capsuleWidth.value = screenWidth - menuRect.left + 8;
    }
  } catch (e) {}
  // #endif
});
</script>

<style scoped>
.header-bar-wrapper {
  width: 100%;
}

.header {
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(30px);
  position: sticky;
  top: 0;
  z-index: 100;
  padding: 0 20px;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  width: 100%;
  box-sizing: border-box;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 72px;
}

.title {
  font-size: 28px;
  font-weight: 800;
  color: #121212;
  letter-spacing: -0.5px;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.icon-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #f5f6f8;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: transform 0.2s, background-color 0.2s;
}

.icon-btn:active {
  transform: scale(0.92);
  background-color: #ededf2;
}

/* CSS Icons */
.icon-search-glass {
  width: 15px;
  height: 15px;
  border: 2px solid #1a1a1a;
  border-radius: 50%;
  position: relative;
  transform: rotate(-45deg);
  margin-left: -2px;
  margin-top: -2px;
}
.icon-search-glass::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  width: 2px;
  height: 6px;
  background-color: #1a1a1a;
  margin-left: -1px;
}

.icon-plus-thin {
  width: 16px;
  height: 16px;
  position: relative;
}
.icon-plus-thin::before, .icon-plus-thin::after {
  content: '';
  position: absolute;
  background-color: #1a1a1a;
  border-radius: 1px;
}
.icon-plus-thin::before {
  top: 50%; left: 0; width: 100%; height: 2px;
  margin-top: -1px;
}
.icon-plus-thin::after {
  left: 50%; top: 0; height: 100%; width: 2px;
  margin-left: -1px;
}

.search-header {
  display: flex;
  align-items: center;
  height: 72px;
  gap: 12px;
  animation: fadeInDown 0.25s ease both;
}

.search-input-wrapper {
  flex: 1;
  height: 36px;
  background-color: #f0f1f5;
  border-radius: 18px;
  display: flex;
  align-items: center;
  padding: 0 12px;
}

.icon-search-glass-mini {
  width: 12px;
  height: 12px;
  border: 1.5px solid #999;
  border-radius: 50%;
  position: relative;
  transform: rotate(-45deg);
  margin-right: 8px;
  flex-shrink: 0;
}
.icon-search-glass-mini::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  width: 1.5px;
  height: 4px;
  background-color: #999;
  margin-left: -0.75px;
}

.search-input {
  flex: 1;
  font-size: 14px;
  color: #1a1a1a;
}

.search-clear {
  width: 20px;
  height: 20px;
  background-color: #c8c8cc;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 4px;
}

.clear-icon {
  font-size: 14px;
  color: #ffffff;
  font-weight: 700;
  margin-top: -1px;
}

.search-cancel {
  font-size: 15px;
  color: #1a1a1a;
  font-weight: 500;
  white-space: nowrap;
}

/* Action Popover Styles (Global) */
.action-popover-mask {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  z-index: 2000;
  background-color: transparent;
}

.action-popover {
  position: fixed;
  right: 12px;
  width: 160px;
  z-index: 2001;
  animation: popoverScale 0.2s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.popover-arrow {
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-bottom: solid 8px rgba(255, 255, 255, 0.95);
  position: absolute;
  top: -8px;
  right: 14px;
}

.popover-content {
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  overflow: hidden;
  border: 0.5px solid rgba(0, 0, 0, 0.05);
}

.popover-item {
  display: flex;
  align-items: center;
  padding: 14px 16px;
  border-bottom: 0.5px solid rgba(0, 0, 0, 0.05);
}

.popover-item-hover {
  background-color: rgba(0, 0, 0, 0.03);
}

.border-none {
  border-bottom: none;
}

.popover-icon {
  margin-right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.popover-text {
  font-size: 15px;
  color: #1a1a1a;
  font-weight: 500;
}

/* Popover Icons */
.icon-group-chat {
  width: 18px; height: 14px;
  border: 1.5px solid #1a1a1a;
  border-radius: 3px;
  position: relative;
}
.icon-group-chat::after {
  content: '';
  position: absolute;
  width: 6px; height: 6px;
  border-left: 1.5px solid #1a1a1a;
  border-top: 1.5px solid #1a1a1a;
  top: -4px; right: -4px;
}

.icon-add-contact {
  width: 16px; height: 16px;
  border: 1.5px solid #1a1a1a;
  border-radius: 50%;
  position: relative;
}
.icon-add-contact::after {
  content: '+';
  position: absolute;
  font-size: 10px;
  font-weight: 800;
  top: -4px; right: -4px;
  background: white;
  width: 10px; height: 10px;
  display: flex; align-items: center; justify-content: center;
}

@keyframes popoverScale {
  from { transform: scale(0.9) translateY(-10px); opacity: 0; }
  to { transform: scale(1) translateY(0); opacity: 1; }
}

@keyframes fadeInDown {
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
