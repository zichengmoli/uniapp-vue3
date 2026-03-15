<template>
  <view class="container">
    <view class="header-nav" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-content">
        <view class="placeholder-btn"></view>
        <text class="nav-title">朋友圈</text>
        <view class="camera-btn" @click="goToPost">
          <view class="icon-camera-dark"></view>
        </view>
      </view>
    </view>

    <view class="feed-host">
      <MomentsFeed 
        :profileUserId="profileUserId" 
        :filterUserId="filterUserId"
        :showCamera="shouldShowCamera"
      />
    </view>

    <CustomTabBar v-if="!isSpecificUser" activePath="/pages/moments/index" />
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { currentUser } from '../../mock/data.js';
import MomentsFeed from '../../components/MomentsFeed.vue';
import CustomTabBar from '../../components/CustomTabBar.vue';

const statusBarHeight = ref(20);

onMounted(() => {
  try {
    const windowInfo = uni.getWindowInfo();
    statusBarHeight.value = windowInfo.statusBarHeight || 20;
  } catch (e) {
    // Fallback for older versions or other platforms
    const systemInfo = uni.getSystemInfoSync();
    statusBarHeight.value = systemInfo.statusBarHeight || 20;
  }
});

const isSpecificUser = computed(() => false); // Always false for the main discovery page
const profileUserId = computed(() => currentUser.id);
const filterUserId = computed(() => '');
const shouldShowCamera = computed(() => true);

const goBack = () => {
  uni.navigateBack({ 
    fail: () => {
      uni.switchTab({ url: '/pages/index/index' });
    }
  });
};

const goToPost = () => {
  uni.navigateTo({ url: '/pages/moments/post' });
};
</script>

<style scoped>
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

.placeholder-btn, .camera-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-camera-dark {
  width: 20px;
  height: 16px;
  border: 1.8px solid #1a1a1a;
  border-radius: 4px;
  position: relative;
}
.icon-camera-dark::before {
  content: '';
  position: absolute;
  top: -4px;
  left: 5px;
  width: 6px;
  height: 2px;
  background: white;
  border: 1.8px solid #1a1a1a;
  border-bottom: none;
  border-radius: 2px 2px 0 0;
}
.icon-camera-dark::after {
  content: '';
  position: absolute;
  top: 3px;
  left: 4px;
  width: 8px;
  height: 8px;
  border: 1.8px solid #1a1a1a;
  border-radius: 50%;
}
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
</style>
