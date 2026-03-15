<template>
  <view class="post-item">
    <image class="post-avatar" :src="post.avatar" mode="aspectFill" @click="$emit('profile', post.userId)" />
    <view class="post-main">
      <text class="post-nickname" @click="$emit('profile', post.userId)">{{ post.nickname }}</text>
      <text class="post-content">{{ post.content }}</text>
      
      <!-- Image Grid -->
      <view class="image-grid" v-if="post.images && post.images.length > 0" :class="{
        'grid-1': post.images.length === 1,
        'grid-2': post.images.length === 2,
        'grid-multi': post.images.length > 2
      }">
        <image 
          v-for="(img, idx) in post.images" 
          :key="idx" 
          :src="img" 
          mode="aspectFill" 
          class="grid-image"
          :class="{
            'single-image': post.images.length === 1,
            'double-image': post.images.length === 2,
            'multi-image': post.images.length > 2
          }"
          @click="previewImage(img, post.images)"
        />
      </view>

      <!-- Location Display -->
      <view class="post-location" v-if="post.location">
        <text class="location-text">{{ post.location }}</text>
      </view>

      <view class="post-footer">
        <view class="footer-left">
          <text class="post-time">{{ post.time }}</text>
          <text class="visibility-tag" v-if="post.visibility && post.visibility !== '公开'">{{ post.visibility }}</text>
        </view>
        <view class="interaction-btn" @click="$emit('interact', post.id)">
          <view class="dot"></view>
          <view class="dot"></view>
        </view>
      </view>

      <!-- Likes and Comments -->
      <view class="likes-comments" v-if="post.likes.length > 0 || post.comments.length > 0">
        <view class="likes-list" v-if="post.likes.length > 0">
          <text class="like-icon">❤️</text>
          <text class="like-names">{{ post.likes.map(id => getUserName(id)).join(', ') }}</text>
        </view>
        <view class="comments-list" v-if="post.comments.length > 0">
          <view class="comment-item" v-for="(comment, cidx) in post.comments" :key="cidx">
            <text class="comment-user">{{ comment.nickname }}: </text>
            <text class="comment-text">{{ comment.content }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { currentUser, chatList } from '../mock/data.js';

const props = defineProps({
  post: {
    type: Object,
    required: true
  }
});

defineEmits(['profile', 'interact']);

const getUserName = (userId) => {
  if (userId === currentUser.id) return currentUser.nickname;
  const user = chatList.find(c => c.targetId === userId);
  return user ? user.name : '用户';
};

const previewImage = (current, urls) => {
  uni.previewImage({
    current,
    urls
  });
};
</script>

<style scoped>
.post-item {
  display: flex;
  padding: 16px 0;
  border-bottom: 0.5px solid rgba(0,0,0,0.05);
}

.post-avatar {
  width: 42px;
  height: 42px;
  border-radius: 8px;
  margin-right: 12px;
  background-color: #f3f4f6;
}

.post-main {
  flex: 1;
}

.post-nickname {
  font-size: 15px;
  font-weight: 700;
  color: #576b95;
  margin-bottom: 6px;
  display: block;
}

.post-content {
  font-size: 15px;
  color: #1a1a1a;
  line-height: 1.6;
  margin-bottom: 8px;
  display: block;
  word-break: break-all;
}

.image-grid {
  display: grid;
  gap: 4px;
  margin-bottom: 8px;
}

.grid-image {
  background-color: #f3f4f6;
  border-radius: 4px;
}

.single-image {
  width: 200px;
  max-height: 260px;
}

.double-image {
  width: 120px;
  height: 120px;
}

.multi-image {
  width: 80px;
  height: 80px;
}

.image-grid.grid-2 {
  grid-template-columns: repeat(2, 120px);
}

.image-grid.grid-multi {
  grid-template-columns: repeat(3, 80px);
}

.post-location {
  margin-bottom: 8px;
}

.location-text {
  font-size: 12px;
  color: #576b95;
}

.post-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 4px;
}

.footer-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.post-time {
  font-size: 12px;
  color: #999999;
}

.visibility-tag {
  font-size: 10px;
  color: #999999;
  background-color: #f3f4f6;
  padding: 2px 6px;
  border-radius: 4px;
}

.interaction-btn {
  width: 32px;
  height: 18px;
  background-color: #f7f7f7;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  transition: background-color 0.2s;
}

.interaction-btn:active {
  background-color: #ededed;
}

.interaction-btn .dot {
  width: 4px;
  height: 4px;
  background-color: #576b95;
  border-radius: 50%;
}

.likes-comments {
  margin-top: 10px;
  background-color: #f7f7f7;
  border-radius: 4px;
  padding: 8px;
  position: relative;
}
.likes-comments::before {
  content: '';
  position: absolute;
  top: -10px;
  left: 20px;
  border: 6px solid transparent;
  border-bottom-color: #f7f7f7;
}

.likes-list {
  display: flex;
  align-items: center;
  padding-bottom: 4px;
  border-bottom: 0.5px solid rgba(0,0,0,0.05);
  margin-bottom: 4px;
}

.likes-list:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.like-icon {
  font-size: 12px;
  margin-right: 6px;
}

.like-names {
  font-size: 13px;
  color: #576b95;
  font-weight: 500;
}

.comment-item {
  font-size: 13px;
  line-height: 1.6;
  margin-bottom: 2px;
}

.comment-user {
  font-weight: 600;
  color: #576b95;
}

.comment-text {
  color: #1a1a1a;
}
</style>
