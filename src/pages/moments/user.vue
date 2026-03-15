<template>
  <view class="container">
    <view class="header-nav" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-content">
        <view class="back-btn" @click="goBack">
          <text class="back-icon">❮</text>
        </view>
        <text class="nav-title">{{ title }}</text>
        <view class="placeholder-btn"></view>
      </view>
    </view>

    <view class="feed-host">
      <MomentsFeed 
        v-if="profileUserId"
        :profileUserId="profileUserId" 
        :filterUserId="profileUserId"
        :showCamera="shouldShowCamera"
      />
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { currentUser, chatList } from '../../mock/data.js';
import { onLoad } from '@dcloudio/uni-app';
import MomentsFeed from '../../components/MomentsFeed.vue';

const statusBarHeight = ref(20);
const profileUserId = ref('');

onLoad((options) => {
  if (options.userId) {
    profileUserId.value = options.userId;
  }
});

onMounted(() => {
  try {
    const windowInfo = uni.getWindowInfo();
    statusBarHeight.value = windowInfo.statusBarHeight || 20;
  } catch (e) {
    const systemInfo = uni.getSystemInfoSync();
    statusBarHeight.value = systemInfo.statusBarHeight || 20;
  }
});

const shouldShowCamera = computed(() => profileUserId.value === currentUser.id);

const title = computed(() => {
  if (profileUserId.value === currentUser.id) return '我的朋友圈';
  const user = chatList.find(c => c.targetId === profileUserId.value);
  return user ? `${user.name}的朋友圈` : '朋友圈';
});

const goBack = () => {
  uni.navigateBack();
};
</script>

<style scoped>
.container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  overflow: hidden;
}

.feed-host {
  flex: 1;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.header-nav {
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  border-bottom: 0.5px solid rgba(0,0,0,0.05);
}

.nav-content {
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
}

.nav-title {
  font-size: 18px;
  font-weight: 700;
  color: #1a1a1a;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.back-btn, .placeholder-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-icon {
  font-size: 20px;
  color: #1a1a1a;
}
</style>
