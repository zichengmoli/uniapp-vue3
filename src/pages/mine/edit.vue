<template>
  <view class="container">
    <view class="header" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="header-content">
        <view class="back-btn" @click="goBack">
          <view class="icon-back"></view>
        </view>
        <text class="title">编辑个人信息</text>
        <view class="save-btn" @click="handleSave">保存</view>
      </view>
    </view>

    <view class="form-container">
      <view class="form-group">
        <text class="label">性别</text>
        <view class="picker-trigger" @click="handleGenderSelect">
          <text class="picker-text">{{ formData.gender || '请选择' }}</text>
          <text class="arrow">❯</text>
        </view>
      </view>

      <view class="form-group">
        <text class="label">地区</text>
        <input 
          class="input" 
          v-model="formData.location" 
          placeholder="请输入地区" 
          maxlength="20"
        />
      </view>
      
      <view class="form-group">
        <text class="label">个签</text>
        <textarea 
          class="textarea" 
          v-model="formData.signature" 
          placeholder="介绍一下自己..." 
          maxlength="50"
          auto-height
        />
      </view>
    </view>

    <view class="hint-text">
      完善这些信息，让朋友们更了解你
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const statusBarHeight = ref(20);
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
    title: '保存成功',
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
/* ... previous styles ... */
.container {
  min-height: 100vh;
  background-color: #f7f8fa;
}

.header {
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(30px);
  position: sticky;
  top: 0;
  z-index: 100;
  padding: 0 20px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
}

.title {
  font-size: 17px;
  font-weight: 700;
  color: #121212;
}

.back-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: -10px;
}

.icon-back {
  width: 12px;
  height: 12px;
  border-left: 2px solid #121212;
  border-bottom: 2px solid #121212;
  transform: rotate(45deg);
}

.save-btn {
  font-size: 15px;
  font-weight: 600;
  color: #007aff;
  padding: 8px 4px;
}

.form-container {
  margin-top: 12px;
  background-color: #ffffff;
}

.form-group {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 0.5px solid rgba(0, 0, 0, 0.05);
}

.form-group:last-child {
  border-bottom: none;
}

.label {
  width: 70px;
  font-size: 16px;
  color: #121212;
  font-weight: 500;
}

.input {
  flex: 1;
  font-size: 16px;
  color: #121212;
}

.picker-trigger {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.picker-text {
  font-size: 16px;
  color: #121212;
}

.arrow {
  font-size: 12px;
  color: #ccc;
}

.textarea {
  flex: 1;
  font-size: 16px;
  color: #121212;
  min-height: 24px;
}

.hint-text {
  padding: 12px 20px;
  font-size: 13px;
  color: #999;
}
</style>
