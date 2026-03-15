<template>
  <view class="container">
    <HeaderBar 
      title="消息" 
      v-model:searchText="searchText" 
      placeholder="搜索聊天"
    />
    
    <scroll-view 
      class="chat-list" 
      scroll-y 
      enable-back-to-top
      :refresher-enabled="true"
      :refresher-triggered="isRefreshing"
      @refresherrefresh="onRefresh"
      @scrolltolower="onLoadMore"
      refresher-background="#f8f9fb"
      :refresher-threshold="80"
      refresher-default-style="none"
    >
      <!-- Custom refresher UI -->
      <view slot="refresher" class="custom-refresher">
        <LoadingDots :pulsing="isRefreshing" />
        <text class="refresher-text">{{ isRefreshing ? '正在同步' : '下拉同步' }}</text>
      </view>
      <ChatItem 
        v-for="(chat, index) in filteredChats" 
        :key="chat.id"
        :data="chat"
        :style="{ animationDelay: index < 10 ? `${index * 0.05}s` : '0s' }"
        @click="goToChat(chat)"
      />
      
      <view class="empty-state" v-if="filteredChats.length === 0 && !isInitialLoading">
        <view class="empty-icon-box">
          <text class="empty-icon-char">{{ showSearch ? '搜' : '空' }}</text>
        </view>
        <text class="empty-text">{{ showSearch ? '无搜索结果' : '暂无消息' }}</text>
        <text class="empty-subtext">{{ showSearch ? '请尝试其他关键词' : '开启一段新的对话吧' }}</text>
      </view>

      <!-- Load More Loading Indicator -->
      <view class="load-more-status" v-if="chats.length > 0">
        <template v-if="isLoadingMore">
          <LoadingDots :pulsing="true" size="small" />
          <text class="load-text">同步中</text>
        </template>
        <view v-else-if="!hasMore" class="end-divider">
          <view class="line"></view>
          <view class="dot"></view>
          <text class="end-text">END</text>
          <view class="dot"></view>
          <view class="line"></view>
        </view>
      </view>
      
      <!-- Bottom padding for tab bar -->
      <view class="bottom-safe-area"></view>
    </scroll-view>



    <CustomTabBar activePath="/pages/index/index" />
  </view>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { chatList } from '../../mock/data.js';
import CustomTabBar from '../../components/CustomTabBar.vue';
import HeaderBar from '../../components/HeaderBar.vue';
import ChatItem from '../../components/ChatItem.vue';
import LoadingDots from '../../components/LoadingDots.vue';

const chats = ref([]);
const showSearch = ref(false);
const searchText = ref('');

const isRefreshing = ref(false);
const isLoadingMore = ref(false);
const isInitialLoading = ref(true);
const hasMore = ref(true);
const currentPage = ref(1);
const pageSize = 8;
const showActionMenu = ref(false);

const filteredChats = computed(() => {
  if (!searchText.value.trim()) return chats.value;
  const keyword = searchText.value.trim().toLowerCase();
  return chats.value.filter(chat => 
    chat.name.toLowerCase().includes(keyword) || 
    chat.lastMessage.toLowerCase().includes(keyword)
  );
});

const openSearch = () => {
  showSearch.value = true;
};

const closeSearch = () => {
  showSearch.value = false;
  searchText.value = '';
};

const toggleActionMenu = () => {
  showActionMenu.value = !showActionMenu.value;
};

const handleAction = (type) => {
  showActionMenu.value = false;
};

onMounted(() => {
  uni.hideTabBar();
  loadData(true);
});

const loadData = async (isRefresh = false) => {
  if (isRefresh) {
    currentPage.value = 1;
    hasMore.value = true;
    if (!isInitialLoading.value) isRefreshing.value = true;
  } else {
    if (isLoadingMore.value || !hasMore.value) return;
    isLoadingMore.value = true;
  }

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));

  const start = (currentPage.value - 1) * pageSize;
  const end = start + pageSize;
  const newData = chatList.slice(start, end);

  if (isRefresh) {
    chats.value = [...newData];
    isRefreshing.value = false;
    isInitialLoading.value = false;
  } else {
    chats.value = [...chats.value, ...newData];
    isLoadingMore.value = false;
  }

  if (chats.value.length >= chatList.length) {
    hasMore.value = false;
  } else {
    currentPage.value++;
  }
};

const onRefresh = () => {
  loadData(true);
};

const onLoadMore = () => {
  loadData(false);
};

const goToChat = (chat) => {
  uni.navigateTo({
    url: `/pages/chat/detail?id=${chat.targetId}&name=${encodeURIComponent(chat.name)}`
  });
};
</script>

<style scoped>
.container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: #f8f9fb;
}

.chat-list {
  flex: 1;
  width: 100%;
  overflow-y: scroll;
}

/* Hide Scrollbar */
.chat-list::-webkit-scrollbar {
  display: none !important;
  width: 0 !important;
  height: 0 !important;
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
  transform: translateZ(0); /* Force GPU */
  will-change: transform;
}

.elegant-dots .dot {
  width: 8px;
  height: 3px;
  background-color: #adb5bd;
  border-radius: 2px; /* Pill shape */
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

@keyframes popoverScale {
  from { transform: scale(0.9) translateY(-10px); opacity: 0; }
  to { transform: scale(1) translateY(0); opacity: 1; }
}

.chat-list {
  padding: 0 24px 20px;
  box-sizing: border-box;
}

:deep(.uni-scroll-view-content) {
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* ChatItem is now a component, styles moved there */
.avatar-container {
  position: relative;
  margin-right: 16px;
  width: 44px; /* Slimmer */
  height: 44px;
  flex-shrink: 0;
}

.avatar {
  width: 100%;
  height: 100%;
  border-radius: 14px;
  background-color: #f0f1f5;
}

.online-indicator {
  position: absolute;
  right: -2px;
  bottom: -2px;
  width: 14px;
  height: 14px;
  background-color: #34c759;
  border: 2.5px solid #ffffff;
  border-radius: 50%; /* Circle */
  z-index: 1;
}

.chat-info {
  flex: 1;
  overflow: hidden;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 6px;
}

.name {
  font-size: 15px; /* Slightly smaller */
  font-weight: 700;
  color: #1a1a1a;
}

.time {
  font-size: 10px;
  color: #adb5bd;
  font-weight: 500;
}

.chat-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh; /* Ensure it takes enough space to center vertically */
}

.empty-icon-box {
  width: 80px;
  height: 80px;
  background-color: #f0f1f5;
  border-radius: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  box-shadow: 0 10px 20px rgba(0,0,0,0.02);
}

.empty-icon-char {
  font-size: 32px;
  font-weight: 800;
  color: #d1d5db;
}

.empty-text {
  font-size: 18px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.empty-subtext {
  font-size: 14px;
  color: #9ca3af;
}
.message {
  font-size: 15px;
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
  margin-right: 16px;
}

.unread-text {
  color: #1a1a1a;
  font-weight: 600;
}

.badge {
  background-color: #ff3b30;
  color: #ffffff;
  font-size: 12px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 10px;
  min-width: 20px;
  text-align: center;
}

.bottom-safe-area {
  height: 80px; /* Reduced to fix too-far-bottom gap while still clearing tab bar */
  width: 100%;
}

.search-header {
  display: flex;
  align-items: center;
  height: 52px;
  padding: 0 16px;
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

.search-icon {
  font-size: 14px;
  color: #999;
  margin-right: 8px;
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

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideUpFade {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
</style>
