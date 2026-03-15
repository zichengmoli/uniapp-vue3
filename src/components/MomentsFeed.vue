<template>
  <view class="scroll-wrapper">
    <scroll-view 
      class="moments-scroll" 
      scroll-y 
      @scroll="onScroll"
      :scroll-with-animation="true"
      :enable-back-to-top="true"
      :refresher-enabled="true"
      :refresher-triggered="isRefreshing"
      @refresherrefresh="onRefresh"
      @scrolltolower="onLoadMore"
      :lower-threshold="150"
      refresher-background="#f8f9fb"
      :refresher-threshold="80"
      refresher-default-style="none"
    >
      <!-- Custom refresher UI -->
      <view slot="refresher" class="custom-refresher">
        <LoadingDots :pulsing="isRefreshing" />
        <text class="refresher-text">{{ isRefreshing ? '正在探索' : '下拉发现' }}</text>
      </view>

      <!-- Cover Section -->
      <view class="cover-section">
        <image class="cover-image" :src="profileUser.bgImage || defaultBg" mode="aspectFill" />
        <view class="user-info">
          <text class="user-nickname">{{ profileUser.nickname || profileUser.name }}</text>
          <image class="user-avatar" :src="profileUser.avatar" mode="aspectFill" @click="handleAvatarClick" />
        </view>
      </view>

      <!-- Posts List -->
      <view class="posts-list">
        <view v-if="displayMoments.length === 0" class="empty-moments">
          <text class="empty-text">暂无动态</text>
        </view>
        <MomentItem 
          v-for="post in displayMoments" 
          :key="post.id" 
          :post="post"
          @profile="goToProfile"
          @interact="toggleInteraction"
        />
      </view>

      <!-- Load More Loading Indicator -->
      <view class="load-more-status" v-if="displayMoments.length > 0">
        <template v-if="isLoadingMore">
          <LoadingDots :pulsing="true" size="small" />
          <text class="load-text">探索中</text>
        </template>
        <view v-else-if="!hasMore" class="end-divider">
          <view class="line"></view>
          <view class="dot"></view>
          <text class="end-text">MOMENTS</text>
          <view class="dot"></view>
          <view class="line"></view>
        </view>
      </view>

      <view class="bottom-safe-area"></view>
    </scroll-view>
    
    <!-- Camera Button (optional) -->
    <view v-if="showCamera" class="camera-fab" @click="goToPost">
      <view class="icon-camera-white"></view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { currentUser, momentsData, chatList } from '../mock/data.js';
import MomentItem from './MomentItem.vue';
import LoadingDots from './LoadingDots.vue';

const props = defineProps({
  profileUserId: {
    type: String,
    required: true
  },
  filterUserId: {
    type: String,
    default: ''
  },
  showCamera: {
    type: Boolean,
    default: false
  }
});

const defaultBg = 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80';

const isRefreshing = ref(false);
const isLoadingMore = ref(false);
const hasMore = ref(true);
const currentPage = ref(1);
const pageSize = 5;
const displayMoments = ref([]);

const profileUser = computed(() => {
  if (props.profileUserId === currentUser.id) return currentUser;
  const found = chatList.find(c => c.targetId === props.profileUserId);
  if (found) {
    return {
      id: found.targetId,
      name: found.name,
      nickname: found.name,
      avatar: found.avatar,
      bgImage: found.bgImage || defaultBg
    };
  }
  return { id: props.profileUserId, name: '用户', avatar: '', bgImage: defaultBg };
});

const filteredMoments = computed(() => {
  let base = [];
  if (!props.filterUserId) {
    base = [...momentsData];
  } else {
    base = momentsData.filter(m => m.userId === props.filterUserId);
  }
  // Sort by timestamp descending, fallback to id for stability
  return base.sort((a, b) => {
    const timeDiff = (b.timestamp || 0) - (a.timestamp || 0);
    if (timeDiff !== 0) return timeDiff;
    return b.id > a.id ? 1 : -1;
  });
});

onMounted(() => {
  loadData(true);
  uni.$on('refresh-moments', onRefresh);
});

onUnmounted(() => {
  uni.$off('refresh-moments', onRefresh);
});

const loadData = async (isRefresh = false) => {
  // Strict guard: prevent ANY concurrent loading
  if (isRefreshing.value || isLoadingMore.value) return;

  if (isRefresh) {
    currentPage.value = 1;
    hasMore.value = true;
    isRefreshing.value = true;
  } else {
    if (!hasMore.value) return;
    isLoadingMore.value = true;
  }

  try {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Capture the latest filtered data AFTER the delay for freshness
    const allFiltered = filteredMoments.value;
    const start = (currentPage.value - 1) * pageSize;
    const end = start + pageSize;
    const newData = allFiltered.slice(start, end);

    if (isRefresh) {
      displayMoments.value = [...newData];
    } else {
      displayMoments.value = [...displayMoments.value, ...newData];
    }

    // Update pagination state
    if (displayMoments.value.length >= allFiltered.length) {
      hasMore.value = false;
    } else {
      currentPage.value++;
    }
  } catch (err) {
    console.error('Failed to load moments:', err);
    uni.showToast({ title: '加载失败', icon: 'none' });
  } finally {
    // Always reset flags
    isRefreshing.value = false;
    isLoadingMore.value = false;
  }
};

const onRefresh = () => {
  loadData(true);
};

const onLoadMore = () => {
  loadData(false);
};

const handleAvatarClick = () => {
  if (props.profileUserId === currentUser.id) {
    uni.switchTab({ url: '/pages/mine/mine' });
  } else {
    uni.navigateTo({ url: `/pages/contact/detail?id=${props.profileUserId}` });
  }
};

const goToProfile = (userId) => {
  uni.navigateTo({ url: `/pages/contact/detail?id=${userId}` });
};

const goToPost = () => {
  uni.navigateTo({ url: '/pages/moments/post' });
};

const toggleInteraction = (postId) => {
  uni.showToast({ title: '点赞/评论待实现', icon: 'none' });
};

const onScroll = (e) => {
  // Emit scroll event if parent needs it
};
</script>

<style scoped>
.scroll-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  overflow: hidden;
}

.moments-scroll {
  height: 100%;
}

.cover-section {
  position: relative;
  height: 300px;
  margin-bottom: 60px;
}

.cover-image {
  width: 100%;
  height: 100%;
  background-color: #f0f1f5;
}

.user-info {
  position: absolute;
  right: 16px;
  bottom: -24px;
  display: flex;
  align-items: center;
}

.user-nickname {
  color: #ffffff;
  font-size: 18px;
  font-weight: 700;
  margin-right: 12px;
  text-shadow: 0 2px 4px rgba(0,0,0,0.5);
  margin-bottom: 24px;
}

.user-avatar {
  width: 64px;
  height: 64px;
  border-radius: 12px;
  border: 2px solid #ffffff;
  background-color: #f3f4f6;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.posts-list {
  padding: 0 16px;
}

.empty-moments {
  padding: 60px 0;
  text-align: center;
}

.empty-text {
  color: #999;
  font-size: 14px;
}

/* Custom Refresher Styles */
.custom-refresher {
  height: 80px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 12px;
  width: 100%;
}

.refresher-text {
  font-size: 11px;
  color: #adb5bd;
  font-weight: 500;
  letter-spacing: 1px;
}

/* Load More Styles */
.load-more-status {
  padding: 32px 0 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  width: 100%;
}

.load-text {
  font-size: 12px;
  color: #adb5bd;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.end-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: 100%;
  padding: 10px 0;
}

.end-divider .line {
  width: 30px;
  height: 0.5px;
  background-color: #e0e0e0;
}

.end-divider .dot {
  width: 3px;
  height: 3px;
  background-color: #d1d5db;
  border-radius: 50%;
}

.end-divider .end-text {
  font-size: 10px;
  color: #adb5bd;
  font-weight: 600;
  letter-spacing: 2px;
}

.bottom-safe-area {
  height: 120px;
}

.camera-fab {
  position: absolute;
  right: 24px;
  bottom: 100px;
  width: 48px;
  height: 48px;
  background-color: #1a1a1a;
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
  z-index: 100;
  transition: transform 0.2s;
}

.camera-fab:active {
  transform: scale(0.9);
}

.icon-camera-white {
  width: 20px;
  height: 16px;
  border: 1.8px solid #ffffff;
  border-radius: 4px;
  position: relative;
}
.icon-camera-white::before {
  content: '';
  position: absolute;
  top: -5px;
  left: 5px;
  width: 6px;
  height: 3px;
  background: #1a1a1a;
  border: 1.8px solid #ffffff;
  border-bottom: none;
  border-radius: 2px 2px 0 0;
}
.icon-camera-white::after {
  content: '';
  position: absolute;
  top: 3px; left: 4px;
  width: 8px; height: 8px;
  border: 1.8px solid #ffffff;
  border-radius: 50%;
}
</style>
