<template>
  <view class="container">
    <view class="header" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="header-content">
        <text class="back-icon" @click="goBack">❮</text>
        <text class="header-title">这一刻的想法</text>
        <view class="header-placeholder"></view>
      </view>
    </view>

    <view class="post-content">
      <textarea 
        class="input-area" 
        v-model="content" 
        placeholder="这一刻的想法..." 
        maxlength="1000"
        auto-focus
      />

      <view class="image-picker">
        <view class="image-item" v-for="(img, index) in images" :key="index">
          <image :src="img" mode="aspectFill" class="picked-image" @click="previewImage(img)" />
          <view class="remove-btn" @click="removeImage(index)">✕</view>
        </view>
        <view class="add-btn" v-if="images.length < 9" @click="chooseImage">
          <view class="plus-icon-box">
            <view class="plus-line h"></view>
            <view class="plus-line v"></view>
          </view>
        </view>
      </view>

      <view class="options-list">
        <view class="option-item" @click="chooseLocation">
          <view class="option-left">
            <view class="vector-icon icon-location"></view>
            <text class="option-text">所在位置</text>
          </view>
          <text class="option-value" v-if="location">{{ location }}</text>
          <text class="arrow">❯</text>
        </view>
        <picker :range="visibilityOptions" @change="onVisibilityChange">
          <view class="option-item">
            <view class="option-left">
              <view class="vector-icon icon-visibility"></view>
              <text class="option-text">谁可以看</text>
            </view>
            <text class="option-value">{{ visibility }}</text>
            <text class="arrow">❯</text>
          </view>
        </picker>
      </view>
    </view>

    <!-- Bottom Right Publish Bubble -->
    <view 
      class="publish-bubble" 
      :class="{ 'active': canSend }" 
      @click="handleSend"
    >
      <text class="publish-text">发表</text>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { addMoment } from '../../mock/data.js';
import { uniChooseMedia } from '@/utils/platform.js';

const statusBarHeight = ref(20);
const content = ref('');
const images = ref([]);
const location = ref('');
const visibility = ref('公开');
const visibilityOptions = ['公开', '私密', '部分可见'];

const canSend = computed(() => content.value.trim().length > 0 || images.value.length > 0);

onMounted(() => {
  const systemInfo = uni.getSystemInfoSync();
  statusBarHeight.value = systemInfo.statusBarHeight || 20;
});

const goBack = () => {
  uni.navigateBack();
};

const chooseImage = () => {
  uniChooseMedia({
    count: 9 - images.value.length,
    mediaType: ['image'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      const paths = res.tempFiles.map(f => f.tempFilePath);
      images.value = [...images.value, ...paths];
    }
  });
};

const removeImage = (index) => {
  images.value.splice(index, 1);
};

const previewImage = (url) => {
  uni.previewImage({
    current: url,
    urls: images.value
  });
};

const chooseLocation = () => {
  const locations = ['杭州·西湖', '上海·外滩', '深圳·南山', '北京·故宫', '成都·太古里'];
  uni.showActionSheet({
    itemList: locations,
    success: (res) => {
      location.value = locations[res.tapIndex];
    }
  });
};

const onVisibilityChange = (e) => {
  visibility.value = visibilityOptions[e.detail.value];
};

const handleSend = () => {
  if (!canSend.value) return;
  
  addMoment(content.value, images.value, location.value, visibility.value);
  
  uni.showToast({
    title: '发表成功',
    icon: 'success',
    duration: 1500,
    success: () => {
      uni.$emit('refresh-moments');
      setTimeout(() => {
        uni.navigateBack();
      }, 1500);
    }
  });
};
</script>

<style scoped>
.container {
  height: 100vh;
  background-color: #ffffff;
}

.header {
  background-color: #ffffff;
}

.header-content {
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}

.back-icon {
  font-size: 20px;
  color: #1a1a1a;
  font-weight: 300;
  width: 44px;
}

.header-title {
  font-size: 16px;
  font-weight: 700;
  color: #1a1a1a;
  flex: 1;
  text-align: center;
}

.header-placeholder {
  width: 44px;
}

.post-content {
  padding: 16px 24px;
}

.input-area {
  width: 100%;
  height: 140px;
  font-size: 17px;
  color: #1a1a1a;
  line-height: 1.6;
  margin-bottom: 24px;
}

.image-picker {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-bottom: 40px;
}

.image-item {
  position: relative;
  aspect-ratio: 1;
}

.picked-image {
  width: 100%;
  height: 100%;
  border-radius: 6px;
  background-color: #f3f4f6;
}

.remove-btn {
  position: absolute;
  top: -5px;
  right: -5px;
  width: 16px;
  height: 16px;
  background-color: rgba(0, 0, 0, 0.4);
  color: #ffffff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 8px;
  z-index: 2;
  border: 1.5px solid #fff;
}

.add-btn {
  aspect-ratio: 1;
  background-color: #f8f9fb;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed #d1d5db;
}

.plus-icon-box {
  width: 24px;
  height: 24px;
  position: relative;
}

.plus-line {
  position: absolute;
  background-color: #999;
  border-radius: 2px;
}

.plus-line.h {
  width: 100%;
  height: 2px;
  top: 11px;
}

.plus-line.v {
  width: 2px;
  height: 100%;
  left: 11px;
}

.options-list {
  border-top: 0.5px solid rgba(0,0,0,0.06);
}

.option-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 0;
  border-bottom: 0.5px solid rgba(0,0,0,0.06);
}

.option-left {
  display: flex;
  align-items: center;
}

.vector-icon {
  width: 18px;
  height: 18px;
  margin-right: 12px;
  position: relative;
}

.icon-location::before {
  content: "";
  position: absolute;
  width: 8px;
  height: 8px;
  border: 2px solid #576b95;
  border-radius: 50%;
  left: 3px;
  top: 2px;
}
.icon-location::after {
  content: "";
  position: absolute;
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 6px solid #576b95;
  left: 4px;
  top: 10px;
}

.icon-visibility::before {
  content: "";
  position: absolute;
  width: 16px;
  height: 10px;
  border: 2px solid #576b95;
  border-radius: 50% 50%;
  left: 0;
  top: 4px;
}
.icon-visibility::after {
  content: "";
  position: absolute;
  width: 4px;
  height: 4px;
  background-color: #576b95;
  border-radius: 50%;
  left: 7px;
  top: 7px;
}

.option-text {
  font-size: 16px;
  color: #1a1a1a;
  font-weight: 500;
}

.option-value {
  font-size: 14px;
  color: #888888;
  margin-left: auto;
  margin-right: 8px;
}

.arrow {
  font-size: 12px;
  color: #cccccc;
}

.publish-bubble {
  position: fixed;
  right: 24px;
  bottom: 40px;
  width: 72px;
  height: 72px;
  background-color: #f5f5f5;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(0,0,0,0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform: scale(0.9);
  opacity: 0.6;
}

.publish-bubble.active {
  background-color: #07c160;
  transform: scale(1);
  opacity: 1;
  box-shadow: 0 12px 32px rgba(7, 193, 96, 0.3);
}

.publish-text {
  font-size: 15px;
  font-weight: 700;
  color: #b2b2b2;
}

.publish-bubble.active .publish-text {
  color: #ffffff;
}
</style>
