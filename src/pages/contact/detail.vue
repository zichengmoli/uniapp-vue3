<template>
  <view class="container">
    <view class="header" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="header-content">
        <view class="back-btn" @click="goBack">
          <view class="icon-back-thin"></view>
        </view>
        <view class="more-btn">
          <view class="icon-dots-horiz-dark"></view>
        </view>
      </view>
    </view>
    
    <ProfileHeader :data="contact" mode="contact" />
    
    <view class="action-board">
      <view class="action-btn" @click="goToChat">
        <view class="action-icon bg-blue">
          <view class="icon-msg-bubble"></view>
        </view>
        <text class="action-text">发消息</text>
      </view>
      <view class="action-btn" @click="showToast('语音')">
        <view class="action-icon bg-green">
          <view class="icon-video-cam"></view>
        </view>
        <text class="action-text">音视频</text>
      </view>
      <view class="action-btn" @click="showToast('更多')">
        <view class="action-icon bg-orange">
          <view class="icon-dots-horiz"></view>
        </view>
        <text class="action-text">更多</text>
      </view>
    </view>
    
    <view class="info-list">
      <view class="info-item" hover-class="item-hover">
        <text class="info-label">朋友圈</text>
        <view class="info-content">
          <view class="moment-placeholder"></view>
          <view class="moment-placeholder"></view>
          <view class="moment-placeholder"></view>
        </view>
        <text class="arrow">❯</text>
      </view>
      <view class="info-item border-none" hover-class="item-hover" @click="showMoreInfo">
        <text class="info-label">更多信息</text>
        <view class="info-content"></view>
        <text class="arrow">❯</text>
      </view>
    </view>

    <!-- Exquisite Info Popup -->
    <view class="info-popup-mask" v-if="showingMoreInfo" @click="showingMoreInfo = false" @touchmove.stop.prevent>
      <view class="info-popup-content" @click.stop>
        <view class="popup-header">
          <text class="popup-title">更多信息</text>
          <view class="close-icon" @click="showingMoreInfo = false">✕</view>
        </view>
        <view class="popup-list">
          <view class="popup-item">
            <text class="popup-label">性别</text>
            <text class="popup-value">{{ contact.moreInfo?.gender || '保密' }}</text>
          </view>
          <view class="popup-item">
            <text class="popup-label">地区</text>
            <text class="popup-value">{{ contact.moreInfo?.region || '保密' }}</text>
          </view>
          <view class="popup-item border-none">
            <text class="popup-label">来源</text>
            <text class="popup-value">{{ contact.moreInfo?.source || '未知' }}</text>
          </view>
        </view>
      </view>
    </view>
    
    <view class="btn-group">
      <button class="primary-btn" @click="goToChat">发送消息</button>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { contactsList } from '../../mock/data.js';
import ProfileHeader from '../../components/ProfileHeader.vue';

const contact = ref({});
const statusBarHeight = ref(20);
const showingMoreInfo = ref(false);

onLoad((options) => {
  if (options.id) {
    // Find contact in mock data
    for (const group of contactsList) {
      const found = group.data.find(c => c.id === options.id);
      if (found) {
        contact.value = found;
        break;
      }
    }
  }
});

onMounted(() => {
  const systemInfo = uni.getSystemInfoSync();
  statusBarHeight.value = systemInfo.statusBarHeight || 20;
});

const goBack = () => {
  uni.navigateBack();
};

const goToChat = () => {
  if (contact.value.id) {
    uni.navigateTo({
      url: `/pages/chat/detail?id=${contact.value.id}&name=${encodeURIComponent(contact.value.name)}`
    });
  }
};

const showMoreInfo = () => {
  showingMoreInfo.value = true;
};

const showToast = (feature) => {
  uni.showToast({ title: `${feature} arriving soon`, icon: 'none' });
};
</script>

<style scoped>
.container {
  min-height: 100vh;
  background-color: #f0f2f5;
}

.header {
  background-color: transparent;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  height: 44px;
}

.back-btn, .more-btn {
  width: 44px;
  height: 44px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.icon-back-thin {
  width: 12px;
  height: 12px;
  border-left: 2px solid #1a1a1a;
  border-bottom: 2px solid #1a1a1a;
  transform: rotate(45deg);
  margin-left: 4px;
}

.icon-dots-horiz-dark {
  width: 4px;
  height: 4px;
  background-color: #1a1a1a;
  border-radius: 50%;
  box-shadow: -8px 0 0 #1a1a1a, 8px 0 0 #1a1a1a;
}

/* ProfileHeader is now a component, styles moved there */

.action-board {
  display: flex;
  justify-content: space-evenly;
  padding: 24px 0;
  margin: 20px;
  background-color: #ffffff;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.02);
  animation: slideUpFade 0.4s ease backwards;
}

.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.action-icon {
  width: 48px;
  height: 48px;
  border-radius: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 8px;
  transition: transform 0.2s, background-color 0.2s;
}

.action-icon:active {
  transform: scale(0.92);
}

.bg-blue { background-color: #e6f0ff; color: #4a90e2; }
.bg-green { background-color: #e6ffe6; color: #34c759; }
.bg-orange { background-color: #fff0e6; color: #ff9500; }

/* CSS Icons for Action Board */
.icon-msg-bubble {
  width: 18px;
  height: 14px;
  border: 2px solid currentColor;
  border-radius: 4px;
  position: relative;
}
.icon-msg-bubble::after {
  content: '';
  position: absolute;
  top: 100%; left: 4px;
  width: 4px; height: 4px;
  background-color: inherit;
  border-right: 2px solid currentColor;
  border-bottom: 2px solid currentColor;
  transform: rotate(45deg) translateY(-2px) translateX(-2px);
}

.icon-video-cam {
  width: 16px;
  height: 12px;
  background-color: currentColor;
  border-radius: 2px;
  position: relative;
}
.icon-video-cam::after {
  content: '';
  position: absolute;
  right: -6px; top: 1px;
  width: 0; height: 0;
  border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;
  border-left: 6px solid currentColor;
}

.icon-dots-horiz {
  width: 4px;
  height: 4px;
  background-color: currentColor;
  border-radius: 50%;
  box-shadow: -8px 0 0 currentColor, 8px 0 0 currentColor;
}

.action-text {
  font-size: 13px;
  font-weight: 600;
  color: #1a1a1a;
}

.info-list {
  margin: 0 20px 24px;
  background-color: #ffffff;
  border-radius: 20px;
  padding: 0 20px;
  animation: slideUpFade 0.4s ease 0.1s backwards;
}

.info-item {
  display: flex;
  align-items: center;
  padding: 20px 0;
  border-bottom: 1px solid rgba(0,0,0,0.03);
}

.border-none {
  border-bottom: none;
}

.info-label {
  width: 80px;
  font-size: 16px;
  color: #1a1a1a;
  font-weight: 500;
}

.info-content {
  flex: 1;
  display: flex;
  gap: 8px;
}

.moment-placeholder {
  width: 44px;
  height: 44px;
  background-color: #f0f1f5;
  border-radius: 8px;
}

.arrow {
  color: #ccc;
  font-size: 12px;
  margin-left: 8px;
}

.btn-group {
  padding: 0 20px 40px;
  animation: slideUpFade 0.4s ease 0.2s backwards;
}

.primary-btn {
  background-color: #1a1a1a;
  color: #ffffff;
  font-size: 16px;
  font-weight: 600;
  height: 56px;
  line-height: 56px;
  border-radius: 28px;
  border: none;
}

.primary-btn::after {
  border: none;
}

@keyframes slideUpFade {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Modal Popup Styling */
.info-popup-mask {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 1000;
  display: flex;
  align-items: flex-end;
  animation: fadeIn 0.3s ease;
}

.info-popup-content {
  width: 100%;
  background-color: #ffffff;
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  padding: 24px;
  animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.popup-title {
  font-size: 18px;
  font-weight: 700;
  color: #1a1a1a;
}

.close-icon {
  font-size: 20px;
  color: #ccc;
  padding: 4px;
}

.popup-list {
  background-color: #f8f9fa;
  border-radius: 16px;
  overflow: hidden;
}

.popup-item {
  display: flex;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.03);
}

.popup-label {
  font-size: 15px;
  color: #666;
}

.popup-value {
  font-size: 15px;
  color: #1a1a1a;
  font-weight: 500;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}
</style>
