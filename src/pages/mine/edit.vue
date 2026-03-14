<template>
  <view class="container">
    <view class="header" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="header-content">
        <view class="back-link" @click="goBack">取消</view>
        <text class="title">编辑资料</text>
        <view class="placeholder"></view>
      </view>
    </view>

    <scroll-view scroll-y class="scroll-body">
      <view class="form-wrapper">
        <!-- Profile Avatar Section -->
        <view class="avatar-section">
          <image :src="userAvatar" class="avatar-preview" mode="aspectFill" />
          <text class="avatar-hint">点击更换头像</text>
        </view>

        <!-- Input Groups - Elegant Refactored Style -->
        <view class="elegant-form">
          <view class="elegant-item">
            <text class="item-label">昵称</text>
            <view class="input-wrap">
              <input 
                class="elegant-input" 
                v-model="formData.nickname" 
                placeholder="填写昵称" 
                placeholder-class="placeholder-style"
              />
            </view>
          </view>

          <view class="elegant-item">
            <text class="item-label">性别</text>
            <view class="input-wrap" @click="handleGenderSelect">
              <text :class="['elegant-val', { 'dim': !formData.gender }]">
                {{ formData.gender || '选择性别' }}
              </text>
              <view class="icon-arrow"></view>
            </view>
          </view>

          <view class="elegant-item">
            <text class="item-label">地区</text>
            <view class="input-wrap">
              <input 
                class="elegant-input" 
                v-model="formData.location" 
                placeholder="设置地区" 
                placeholder-class="placeholder-style"
              />
            </view>
          </view>

          <view class="elegant-item">
            <text class="item-label">个性签名</text>
            <view class="input-wrap area">
              <textarea 
                class="elegant-area" 
                v-model="formData.signature" 
                placeholder="介绍一下自己..." 
                placeholder-class="placeholder-style"
                auto-height
              />
            </view>
          </view>
        </view>

        <!-- Action Section -->
        <view class="action-section">
          <button class="primary-btn" @click="handleSave">更新资料</button>
          <text class="security-hint">资料修改将同步至所有关联服务</text>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const statusBarHeight = ref(20);
const userAvatar = ref('');
const formData = ref({
  nickname: '',
  signature: '',
  gender: '',
  location: ''
});

onMounted(() => {
  const systemInfo = uni.getSystemInfoSync();
  statusBarHeight.value = systemInfo.statusBarHeight || 20;
  
  const user = uni.getStorageSync('user');
  if (user) {
    formData.value.nickname = user.nickname || '';
    formData.value.signature = user.signature || '';
    formData.value.gender = user.gender || '';
    formData.value.location = user.location || '';
    userAvatar.value = user.avatar || '';
  }
});

const goBack = () => {
  uni.navigateBack();
};

const handleGenderSelect = () => {
  const genders = ['男', '女', '保密'];
  uni.showActionSheet({
    itemList: genders,
    success: (res) => {
      formData.value.gender = genders[res.tapIndex];
    }
  });
};

const handleSave = () => {
  if (!formData.value.nickname.trim()) {
    uni.showToast({ title: '昵称不能为空', icon: 'none' });
    return;
  }
  
  const user = uni.getStorageSync('user');
  const updatedUser = {
    ...user,
    nickname: formData.value.nickname.trim(),
    signature: formData.value.signature.trim(),
    gender: formData.value.gender,
    location: formData.value.location.trim()
  };
  
  uni.setStorageSync('user', updatedUser);
  uni.showToast({
    title: '资料已更新',
    icon: 'success',
    duration: 1500,
    success: () => {
      setTimeout(() => {
        uni.navigateBack();
      }, 1500);
    }
  });
};
</script>

<style scoped>
.container {
  min-height: 100vh;
  background-color: #fbfbfb;
  color: #333;
  display: flex;
  flex-direction: column;
}

.header {
  background-color: #fff;
  z-index: 100;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 96rpx;
  padding: 0 40rpx;
}

.back-link {
  font-size: 30rpx;
  color: #888;
  width: 120rpx;
}

.title {
  font-size: 32rpx;
  font-weight: 500;
  letter-spacing: 1rpx;
}

.placeholder {
  width: 120rpx;
}

.scroll-body {
  flex: 1;
}

.form-wrapper {
  padding: 40rpx;
}

.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20rpx 0 60rpx;
}

.avatar-preview {
  width: 144rpx;
  height: 144rpx;
  border-radius: 72rpx;
  background-color: #f0f0f0;
}

.avatar-hint {
  font-size: 24rpx;
  color: #aaa;
  margin-top: 20rpx;
}

/* Elegant Form Styling */
.elegant-form {
  background-color: #fff;
  border-radius: 24rpx;
  padding: 10rpx 30rpx;
  box-shadow: 0 4rpx 24rpx rgba(0,0,0,0.02);
}

.elegant-item {
  padding: 32rpx 0;
  border-bottom: 1rpx solid #f5f5f5;
}

.elegant-item:last-child {
  border-bottom: none;
}

.item-label {
  font-size: 26rpx;
  color: #999;
  margin-bottom: 16rpx;
  display: block;
}

.input-wrap {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.elegant-input, .elegant-val, .elegant-area {
  font-size: 32rpx;
  color: #1a1a1a;
  flex: 1;
}

.elegant-area {
  min-height: 100rpx;
  line-height: 1.5;
}

.dim {
  color: #ccc;
}

.icon-arrow {
  width: 12rpx;
  height: 12rpx;
  border-top: 2rpx solid #ccc;
  border-right: 2rpx solid #ccc;
  transform: rotate(45deg);
  margin-left: 20rpx;
}

.placeholder-style {
  color: #d1d1d1;
}

.action-section {
  margin-top: 80rpx;
  text-align: center;
}

.primary-btn {
  background-color: #1a1a1a;
  color: #fff;
  height: 96rpx;
  line-height: 96rpx;
  border-radius: 48rpx;
  font-size: 30rpx;
  font-weight: 500;
  border: none;
  margin-bottom: 30rpx;
  box-shadow: 0 10rpx 30rpx rgba(0,0,0,0.1);
}

.primary-btn:active {
  background-color: #333;
  transform: scale(0.98);
}

.security-hint {
  font-size: 22rpx;
  color: #ccc;
}
</style>
