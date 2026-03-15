<template>
  <view class="container">
    <view class="header" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="header-content">
        <view class="back-btn" @click="goBack">
          <text class="back-icon">❮</text>
        </view>
        <text class="title">{{ targetName }}</text>
        <view class="more-btn"><text class="more-icon">⋯</text></view>
      </view>
    </view>
    
    <view class="chat-main" style="flex: 1; display: flex; flex-direction: column; overflow: hidden;">
      <view class="chat-body">
        <scroll-view 
          class="chat-scroll" 
          scroll-y 
          :scroll-top="scrollTop"
          :scroll-into-view="lastMessageId"
          :scroll-with-animation="true"
          @scroll="onScroll"
        >
        <view class="time-divider" v-if="messages.length > 0">
          <text class="time-text">今天 22:30</text>
        </view>
        
        <view 
          class="message-item" 
          v-for="(msg, index) in messages" 
          :key="msg.id"
          :id="'msg_' + msg.id"
          :class="{'is-me': msg.senderId === currentUser.id, 'new-message': msg.isNew}"
        >
          <image 
            class="avatar" 
            :src="msg.senderId === currentUser.id ? currentUser.avatar : targetAvatar" 
            mode="aspectFill" 
            @click="goToProfile(msg.senderId)"
          />
          <view class="bubble" :class="{'media-bubble': msg.type === 'image' || msg.type === 'video'}">
            <image v-if="msg.type === 'image'" :src="msg.mediaPath" mode="aspectFill" class="msg-image" @click="previewImage(msg.mediaPath)" />
            <video v-else-if="msg.type === 'video'" :src="msg.mediaPath" class="msg-video" />
            <text v-else class="msg-text">{{ msg.text }}</text>
          </view>
        </view>
        
        <view id="scroll-bottom"></view>
      </scroll-view>
      
      </view>
      
      <view class="input-area-container" :class="{'panel-open': showEmoji || showMore}" :style="{ paddingBottom: (keyboardHeight > 0 || showEmoji || showMore ? 0 : safeAreaBottom) + 'px' }">
        <!-- Media Preview Bar -->
        <view class="media-preview-bar" v-if="stagedMedia.length > 0">
          <scroll-view class="preview-scroll" scroll-x>
            <view class="preview-list">
              <view class="preview-item" v-for="(item, index) in stagedMedia" :key="index">
                <image v-if="item.type === 'image'" :src="item.path" mode="aspectFill" class="preview-thumb" />
                <view v-else-if="item.type === 'video'" class="preview-thumb video-thumb">
                  <video :src="item.path" :controls="false" class="preview-video" />
                  <view class="play-icon-overlay"></view>
                </view>
                <view class="remove-preview" @click="removeStagedMedia(index)">✕</view>
              </view>
            </view>
          </scroll-view>
        </view>

        <view class="input-area">
          <view class="extra-btn" @click="toggleMore">
            <view class="icon-plus"></view>
          </view>
          <view class="input-wrapper">
            <input 
              class="chat-input" 
              v-model="inputText" 
              placeholder="输入消息..." 
              placeholder-style="color: #b0a8a0;"
              confirm-type="send"
              :adjust-position="false"
              cursor-spacing="8"
              :focus="inputFocused"
              :confirm-hold="true"
              :hold-keyboard="true"
              @focus="onInputFocus"
              @blur="onInputBlur"
              @confirm="sendMessage"
            />
            <view class="emoji-btn" @click="toggleEmoji" :class="{'active-btn': showEmoji}">
              <view class="icon-smile"></view>
            </view>
          </view>
          <view class="send-btn" @click="sendMessage" :class="{'can-send': inputText.trim().length > 0 || stagedMedia.length > 0}">
            <text class="send-icon">↑</text>
          </view>
        </view>
  
        <!-- Emoji Panel -->
        <view class="panel-box emoji-panel" v-if="showEmoji">
          <scroll-view class="panel-scroll" scroll-y>
            <view class="emoji-grid">
              <view class="emoji-item" v-for="e in ['😊', '😂', '🔥', '👍', '❤️', '🌙', '⭐', '☀️', '🥺', '😎', '🙌', '✨']" :key="e" @click="addEmoji(e)">
                <text class="emoji-text">{{ e }}</text>
              </view>
            </view>
          </scroll-view>
        </view>
  
        <!-- More Actions Panel -->
        <view class="panel-box more-panel" v-if="showMore">
          <view class="action-grid">
            <view class="action-item" v-for="a in actions" :key="a.name" @click="handleAction(a.name)">
              <view class="action-icon-box">
                <view :class="['custom-icon', a.iconClass]"></view>
              </view>
              <text class="action-name">{{ a.name }}</text>
            </view>
          </view>
        </view>
      </view>
      
      <!-- Dynamic Bottom Spacer -->
      <view 
        class="bottom-spacer" 
        :class="{'no-transition': keyboardHeight > 0}"
        :style="{ height: bottomOffset + 'px' }"
      ></view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { currentUser, mockGetChatHistory, chatList, markAsRead } from '../../mock/data.js';
import { uniChooseMedia, onKeyboardHeightChange } from '@/utils/platform.js';

const targetId = ref('');
const targetName = ref('Chat');
const targetAvatar = ref('');
const messages = ref([]);
const inputText = ref('');
const statusBarHeight = ref(20);
const scrollTop = ref(0);
const lastMessageId = ref('');
const showEmoji = ref(false);
const showMore = ref(false);
const cursorPosition = ref(0);
const safeAreaBottom = ref(0);
const inputFocused = ref(false);
const keyboardHeight = ref(0);
const panelHeight = 260; // From CSS
const stagedMedia = ref([]);

const bottomOffset = computed(() => keyboardHeight.value);

const actions = [
  { name: '照片', iconClass: 'icon-photo' },
  { name: '拍摄', iconClass: 'icon-camera' },
  { name: '红包', iconClass: 'icon-redpacket' },
  { name: '文件', iconClass: 'icon-file' }
];

const toggleEmoji = () => {
  showEmoji.value = !showEmoji.value;
  showMore.value = false;
  if (showEmoji.value) {
    uni.hideKeyboard();
    scrollToBottom(200);
  }
};

const toggleMore = () => {
  showMore.value = !showMore.value;
  showEmoji.value = false;
  if (showMore.value) {
    uni.hideKeyboard();
    scrollToBottom(200);
  }
};

const hidePanels = () => {
  showEmoji.value = false;
  showMore.value = false;
};

const onInputFocus = (e) => {
  hidePanels();
  inputFocused.value = true;
  scrollToBottom(50);
};

const onInputBlur = (e) => {
  inputFocused.value = false;
  saveCursorPosition(e);
};

const saveCursorPosition = (e) => {
  cursorPosition.value = e.detail.cursor || 0;
};

const addEmoji = (e) => {
  const currentText = inputText.value;
  const pos = cursorPosition.value;
  inputText.value = currentText.slice(0, pos) + e + currentText.slice(pos);
  cursorPosition.value = pos + e.length;
};

const handleAction = (name) => {
  if (name === '照片') {
    uniChooseMedia({
      count: 9 - stagedMedia.value.length,
      mediaType: ['image', 'video'],
      sourceType: ['album'],
      success: (res) => {
        const files = res.tempFiles || res.tempFilePaths.map(path => ({ tempFilePath: path, fileType: 'image' }));
        files.forEach(file => {
          stageMedia(file.tempFilePath, file.fileType || 'image');
        });
        // hidePanels(); // Keep panel open for better UX when adding multiple batches
      }
    });
  } else if (name === '拍摄') {
    uniChooseMedia({
      count: 1,
      mediaType: ['image', 'video'],
      sourceType: ['camera'],
      success: (res) => {
        const files = res.tempFiles || res.tempFilePaths.map(path => ({ tempFilePath: path, fileType: 'image' }));
        files.forEach(file => {
          stageMedia(file.tempFilePath, file.fileType || 'image');
        });
        // hidePanels(); // Keep panel open
      }
    });
  } else {
    uni.showToast({ title: '发送' + name + '功能即将推出', icon: 'none' });
  }
};

const stageMedia = (path, type) => {
  stagedMedia.value.push({ path, type });
  scrollToBottom(50);
};

const removeStagedMedia = (index) => {
  stagedMedia.value.splice(index, 1);
};

const sendMediaMessage = (path, type) => {
  const newMsg = {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
    senderId: currentUser.id,
    text: type === 'video' ? '[视频]' : '[图片]',
    mediaPath: path,
    time: '现在',
    type: type,
    isNew: true
  };
  messages.value.push(newMsg);
  scrollToBottom();
};

onLoad((options) => {
  if (options.id) {
    targetId.value = options.id;
    targetName.value = decodeURIComponent(options.name || 'Chat');
    const chatInfo = chatList.find(c => c.targetId === targetId.value);
    if (chatInfo) {
      targetAvatar.value = chatInfo.avatar;
    }
    markAsRead(targetId.value);
  }
});

onMounted(async () => {
  const systemInfo = uni.getSystemInfoSync();
  statusBarHeight.value = systemInfo.statusBarHeight || 20;
  safeAreaBottom.value = systemInfo.safeAreaInsets ? systemInfo.safeAreaInsets.bottom : 0;

  onKeyboardHeightChange((height) => {
    keyboardHeight.value = height;
    if (height > 0) {
      scrollToBottom(50); // Small delay to sync with keyboard move
    }
  });

  if (targetId.value) {
    messages.value = await mockGetChatHistory(targetId.value);
    scrollToBottom(100);
  }
});

const goToProfile = (userId) => {
  if (userId === currentUser.id) {
    uni.switchTab({
      url: '/pages/mine/mine'
    });
  } else {
    uni.navigateTo({
      url: `/pages/contact/detail?id=${userId}`
    });
  }
};

const goBack = () => {
  uni.navigateBack();
};

const onScroll = (e) => {
  // handled automatically
};

const scrollToBottom = async (delay = 0) => {
  lastMessageId.value = '';
  await nextTick();
  if (delay > 0) {
    await new Promise(resolve => setTimeout(resolve, delay));
  }
  if (messages.value.length > 0) {
    lastMessageId.value = 'scroll-bottom';
  }
};

const sendMessage = async () => {
  const text = inputText.value.trim();
  const media = [...stagedMedia.value];
  
  if (!text && media.length === 0) return;

  // If there's media, we send them first (or as combined if logic allows)
  // For now, let's mimick common chat 앱 behavior: separate media then text
  for (const item of media) {
    sendMediaMessage(item.path, item.type);
  }

  if (text) {
    const newMsg = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      text: text,
      time: 'Now',
      type: 'text',
      isNew: true
    };
    messages.value.push(newMsg);
  }

  inputText.value = '';
  stagedMedia.value = [];
  cursorPosition.value = 0;
  scrollToBottom();
  
  inputFocused.value = true;
};

const previewImage = (url) => {
  uni.previewImage({
    urls: [url]
  });
};
</script>

<style scoped>
.container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-sizing: border-box;
  background-color: #ffffff;
}

.header {
  background-color: #ffffff;
  position: relative;
  z-index: 100;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 12px;
  height: 40px; /* Slimmer */
}

.back-btn, .more-btn {
  width: 44px;
  height: 44px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.back-icon, .more-icon {
  font-size: 20px;
  color: #1a1a1a;
}

.title {
  font-size: 16px;
  font-weight: 700;
  color: #2b2a29;
}

.chat-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
}

.chat-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden; /* Back to hidden for internal scroll */
  background-color: #ffffff;
}

.chat-scroll {
  flex: 1;
  padding: 16px 0;
  overflow-y: scroll;
}

/* Hide Scrollbar */
.chat-scroll::-webkit-scrollbar,
.preview-scroll::-webkit-scrollbar,
.panel-scroll::-webkit-scrollbar {
  display: none !important;
  width: 0 !important;
  height: 0 !important;
}

/* Ensure smooth scrolling on iOS and modern browsers */
scroll-view {
  -webkit-overflow-scrolling: touch;
}
.time-divider {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.time-text {
  font-size: 12px;
  color: #aaa49e;
  background: rgba(0,0,0,0.03);
  padding: 4px 12px;
  border-radius: 12px;
}

.message-item {
  display: flex;
  margin-bottom: 20px;
  padding: 0 16px;
}

.new-message {
  animation: fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.is-me {
  flex-direction: row-reverse;
}

.avatar {
  width: 34px; /* Slimmer */
  height: 34px;
  border-radius: 10px;
  background-color: #f0f1f5;
}

.message-item:not(.is-me) .bubble {
  margin-left: 12px;
  background-color: #ffffff;
  color: #333333;
  border-radius: 4px 18px 18px 18px;
  box-shadow: 0 4px 12px rgba(120, 110, 100, 0.05);
}

.message-item.is-me .bubble {
  margin-right: 12px;
  background-color: #2b2a29;
  color: #ffffff;
  border-radius: 18px 4px 18px 18px;
  box-shadow: 0 4px 12px rgba(45, 40, 35, 0.1);
}

.bubble {
  max-width: 75%;
  padding: 10px 14px; /* More compact */
  word-wrap: break-word;
}

.msg-text {
  font-size: 15px;
  line-height: 1.5;
}

.media-bubble {
  padding: 0;
  overflow: hidden;
  background-color: transparent !important;
  box-shadow: none !important;
}

.msg-image {
  width: 160px;
  height: 200px;
  border-radius: 12px;
}

.msg-video {
  width: 200px;
  height: 150px;
  border-radius: 12px;
}

#scroll-bottom {
  height: 20px;
}

.input-area-container {
  background-color: #ffffff;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  flex-shrink: 0;
  width: 100%;
  position: relative;
  z-index: 100;
}

.media-preview-bar {
  padding: 12px 12px 8px; 
  background-color: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  border-bottom: 0.5px solid rgba(0, 0, 0, 0.05);
}

.preview-scroll {
  white-space: nowrap;
  width: 100%;
}

.preview-list {
  display: flex;
  gap: 10px;
  padding-bottom: 4px;
}

.preview-item {
  position: relative;
  width: 60px;
  height: 60px;
  flex-shrink: 0;
  margin-right: 12px;
  margin-top: 6px; 
}

.preview-thumb {
  width: 100%;
  height: 100%;
  border-radius: 8px;
  background-color: #f0f1f5;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.video-thumb {
  position: relative;
  overflow: hidden;
}

.preview-video {
  width: 100%;
  height: 100%;
}

.play-icon-overlay {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 24px; height: 24px;
  background-color: rgba(0,0,0,0.3);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.play-icon-overlay::after {
  content: '';
  margin-left: 2px;
  border-left: 8px solid white;
  border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;
}

.remove-preview {
  position: absolute;
  top: -6px; 
  right: -6px;
  width: 16px; 
  height: 16px;
  background-color: rgba(0, 0, 0, 0.4);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 8px;
  border: 1.5px solid white;
  z-index: 10;
  transition: transform 0.2s;
}

.remove-preview:active {
  transform: scale(0.85);
}

.input-area {
  display: flex;
  align-items: center;
  padding: 8px 12px;
}

.input-wrapper {
  flex: 1;
  background-color: rgba(0, 0, 0, 0.04);
  height: 40px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  padding: 0 12px 0 16px;
  margin: 0 8px;
  border: 1px solid rgba(0, 0, 0, 0.02);
}

.chat-input {
  flex: 1;
  font-size: 15px;
  color: #2b2a29;
}

.extra-btn, .emoji-btn {
  width: 32px;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 16px;
  transition: background-color 0.2s;
}

.emoji-btn.active-btn {
  background-color: rgba(0,0,0,0.05);
}

.icon-plus {
  position: relative;
  width: 20px;
  height: 20px;
}
.icon-plus::before, .icon-plus::after {
  content: '';
  position: absolute;
  background-color: #2b2a29;
  border-radius: 1px;
}
.icon-plus::before {
  top: 50%; left: 0; right: 0; height: 1.5px;
  margin-top: -0.75px;
}
.icon-plus::after {
  left: 50%; top: 0; bottom: 0; width: 1.5px;
  margin-left: -0.75px;
}

.icon-smile {
  width: 20px;
  height: 20px;
  border: 1.5px solid #2b2a29;
  border-radius: 50%;
  position: relative;
  opacity: 0.8;
  transition: opacity 0.2s;
}
.icon-smile::before {
  content: '';
  position: absolute;
  top: 5px;
  left: 4.5px;
  width: 1.5px;
  height: 1.5px;
  background: #2b2a29;
  border-radius: 50%;
  box-shadow: 6px 0 0 #2b2a29;
}
.icon-smile::after {
  content: '';
  position: absolute;
  bottom: 4px;
  left: 4.5px;
  width: 7.5px;
  height: 3px;
  border: 1.5px solid #2b2a29;
  border-top: transparent;
  border-radius: 0 0 10px 10px;
}
.emoji-btn:active .icon-smile {
  opacity: 1;
}

.send-btn {
  width: 32px;
  height: 32px;
  border-radius: 16px;
  background-color: #f2f2f2;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 4px;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  opacity: 0.5;
  pointer-events: none; /* disables clicking when empty */
}

.send-btn.can-send {
  background-color: #1a1a1a;
  opacity: 1;
  transform: translateY(-1px);
  box-shadow: 0 4px 10px rgba(26, 26, 26, 0.15);
  pointer-events: auto; /* enables clicking */
}

.send-btn:active {
  transform: scale(0.92);
}

.send-icon {
  color: #ffffff;
  font-size: 16px;
  font-weight: 800;
  margin-top: -1px;
}

.panel-box {
  width: 100%;
  height: 260px;
  flex-shrink: 0;
  background-color: #ffffff;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.bottom-spacer {
  width: 100%;
  transition: height 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.bottom-spacer.no-transition {
  transition: none;
}

.emoji-grid {
  display: flex;
  flex-wrap: wrap;
  padding: 20px 16px;
}

.emoji-item {
  width: 16.66%;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 32px;
  transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.emoji-item:active {
  transform: scale(1.4) translateY(-5px);
}

.action-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  padding: 30px 20px;
  gap: 20px;
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.action-icon-box {
  width: 60px;
  height: 60px;
  border-radius: 18px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 8px;
  background-color: #f3f4f6;
  box-shadow: 0 4px 12px rgba(0,0,0,0.02);
  position: relative;
}

/* Custom CSS Icons */
.custom-icon {
  position: relative;
}

.icon-photo {
  width: 24px;
  height: 20px;
  border: 2px solid #1a1a1a;
  border-radius: 4px;
}
.icon-photo::after {
  content: '';
  position: absolute;
  top: 4px;
  right: 4px;
  width: 5px;
  height: 5px;
  background: #1a1a1a;
  border-radius: 50%;
}

.icon-camera {
  width: 26px;
  height: 18px;
  border: 2px solid #1a1a1a;
  border-radius: 4px;
}
.icon-camera::before {
  content: '';
  position: absolute;
  top: -6px;
  left: 6px;
  width: 10px;
  height: 4px;
  background: #1a1a1a;
  border-radius: 2px;
}
.icon-camera::after {
  content: '';
  position: absolute;
  top: 3px;
  left: 7px;
  width: 8px;
  height: 8px;
  border: 2px solid #1a1a1a;
  border-radius: 50%;
}

.icon-redpacket {
  width: 18px;
  height: 24px;
  border: 2px solid #1a1a1a;
  border-radius: 4px;
  background: #1a1a1a;
}
.icon-redpacket::after {
  content: '¥';
  color: #fff;
  font-size: 14px;
  font-weight: 800;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.icon-file {
  width: 18px;
  height: 24px;
  border: 2px solid #1a1a1a;
  border-radius: 2px;
}
.icon-file::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 8px;
  height: 8px;
  border-left: 2px solid #1a1a1a;
  border-bottom: 2px solid #1a1a1a;
}

.action-name {
  font-size: 12px;
  color: #666;
}

@keyframes slideUp {
  from { transform: translateY(100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes scaleIn {
  from { transform: scale(0.5); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
</style>
