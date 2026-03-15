<template>
  <view class="container">
    <ProfileHeader :data="user" mode="mine">
      <template #action>
        <view class="edit-btn" @click="goToEdit">编辑</view>
      </template>
    </ProfileHeader>
    
    <!-- Menu List -->
    <view class="menu-list">
      <view 
        v-for="(group, gIndex) in menuGroups" 
        :key="gIndex"
        class="menu-group"
        :style="{ animationDelay: (0.1 + gIndex * 0.1) + 's' }"
      >
        <view 
          class="menu-item" 
          v-for="(item, iIndex) in group" 
          :key="item.text"
          :class="{'border-none': iIndex === group.length - 1}"
          hover-class="menu-hover"
          @click="handleMenuClick(item)"
        >
          <view class="menu-icon" :class="item.colorClass">
            <view :class="item.iconClass"></view>
          </view>
          <text class="menu-text">{{ item.text }}</text>
          <text class="arrow">❯</text>
        </view>
      </view>
    </view>

    <!-- Refined White Card Password Modal (Atomic Fix for Mini Program) -->
    <view v-if="showPwdModal" class="modal-fixed-container" @touchmove.stop.prevent="noop">
      <!-- 1. The dedicated background layer -->
      <view class="modal-backdrop" @tap.stop="showPwdModal = false"></view>
      
      <!-- 2. The centered content layer (pointer-events: none lets clicks pass to backdrop unless caught by children) -->
      <view class="white-card-modal-wrapper" @tap.stop="noop">
        <!-- 3. The actual card (pointer-events: auto catches clicks) -->
        <view class="white-card-modal" @tap.stop="noop">
          <view class="modal-header" @tap.stop="noop">
            <text class="modal-title">身份验证</text>
            <text class="modal-subtitle">为了您的账号安全，请验证并设置新密码</text>
          </view>
          
          <view class="modal-body" @tap.stop="noop">
            <view class="refined-input-item">
              <text class="input-label">当前密码</text>
              <input 
                class="refined-input" 
                password 
                placeholder="请输入当前密码" 
                placeholder-class="p-style"
                v-model="passwordData.old"
                @tap.stop="noop"
              />
            </view>
            <view class="refined-input-item">
              <text class="input-label">新密码</text>
              <input 
                class="refined-input" 
                password 
                placeholder="请输入新密码" 
                placeholder-class="p-style"
                v-model="passwordData.new"
                @tap.stop="noop"
              />
            </view>
            <view class="refined-input-item no-border">
              <text class="input-label">确认密码</text>
              <input 
                class="refined-input" 
                password 
                placeholder="请再次输入新密码" 
                placeholder-class="p-style"
                v-model="passwordData.confirm"
                @tap.stop="noop"
              />
            </view>
          </view>
          
          <view class="modal-footer" @tap.stop="noop">
            <view class="action-btn cancel" @tap.stop="showPwdModal = false">放弃</view>
            <view class="action-btn confirm" @tap.stop="updatePassword">立即更新</view>
          </view>
        </view>
      </view>
    </view>

    <view class="bottom-safe-area"></view>
    <CustomTabBar activePath="/pages/mine/mine" />
  </view>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import { currentUser } from '../../mock/data.js';
import CustomTabBar from '../../components/CustomTabBar.vue';
import ProfileHeader from '../../components/ProfileHeader.vue';

const noop = () => {};

const user = ref({});
const showPwdModal = ref(false);
const passwordData = reactive({
  old: '',
  new: '',
  confirm: ''
});

const menuGroups = [
  [
    { text: '收藏', iconClass: 'icon-collect', colorClass: 'bg-blue' },
    { text: '修改密码', iconClass: 'icon-password', colorClass: 'bg-black', action: 'password' },
    { text: '朋友圈', iconClass: 'icon-moments', colorClass: 'bg-purple', action: 'moments' }
  ],
  [
    { text: '设置', iconClass: 'icon-settings', colorClass: 'bg-gray' },
    { text: '退出登录', iconClass: 'icon-logout', colorClass: 'bg-red', action: 'logout' }
  ]
];

onShow(() => {
  uni.hideTabBar();
  const storedUser = uni.getStorageSync('user');
  user.value = storedUser || currentUser;
});

const goToEdit = () => {
  uni.navigateTo({ url: '/pages/mine/edit' });
};

const handleMenuClick = (item) => {
  if (item.action === 'logout') {
    handleLogout();
  } else if (item.action === 'password') {
    passwordData.old = '';
    passwordData.new = '';
    passwordData.confirm = '';
    showPwdModal.value = true;
  } else if (item.action === 'moments') {
    uni.navigateTo({ url: `/pages/moments/user?userId=${currentUser.id}` });
  } else {
    uni.showToast({ title: item.text + ' 功能即将推出', icon: 'none' });
  }
};

const updatePassword = () => {
  const { old, new: newPwd, confirm } = passwordData;
  
  // 1. Basic empty check
  if (!old || !newPwd || !confirm) {
    uni.showToast({ title: '请完整填写密码信息', icon: 'none' });
    return;
  }
  
  // 2. Mock Old Password Verification (Default: 123456)
  if (old !== '123456') {
    uni.showToast({ title: '当前密码验证失败', icon: 'none' });
    return;
  }
  
  // 3. New Password Rules
  if (newPwd.length < 6) {
    uni.showToast({ title: '新密码至少需要6位', icon: 'none' });
    return;
  }
  
  // 4. Consistency Check
  if (newPwd !== confirm) {
    uni.showToast({ title: '两次新密码输入不一致', icon: 'none' });
    return;
  }
  
  // 5. Success Flow
  uni.showLoading({ title: '系统安全处理中...', mask: true });
  setTimeout(() => {
    uni.hideLoading();
    uni.showToast({ 
      title: '账户密码已重置', 
      icon: 'success',
      duration: 2000 
    });
    showPwdModal.value = false;
    // Reset fields for security
    passwordData.old = '';
    passwordData.new = '';
    passwordData.confirm = '';
  }, 1200);
};

const handleLogout = () => {
  uni.showModal({
    title: '退出登录',
    content: '退出后将返回登录界面，确定吗？',
    confirmText: '确定',
    cancelText: '取消',
    confirmColor: '#000000',
    success: (res) => {
      if (res.confirm) {
        uni.removeStorageSync('user');
        uni.removeStorageSync('token');
        uni.reLaunch({ url: '/pages/login/login' });
      }
    }
  });
};
</script>

<style scoped>
.container {
  min-height: 100vh;
  background-color: #f7f8fa;
  padding-bottom: 40px;
}

.menu-list {
  padding: 0 20px;
}

.menu-group {
  background-color: #ffffff;
  border-radius: 20px;
  margin-bottom: 20px;
  overflow: hidden;
  box-shadow: 0 4px 12rpx rgba(0,0,0,0.02);
  animation: slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #f9f9f9;
  transition: background-color 0.2s;
}

.menu-hover {
  background-color: #fafafa;
}

.border-none {
  border-bottom: none;
}

.menu-icon {
  width: 32px;
  height: 32px;
  border-radius: 9px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 14px;
}

.menu-text {
  flex: 1;
  font-size: 16px;
  color: #333;
  font-weight: 500;
}

.arrow {
  color: #ddd;
  font-size: 12px;
}

/* Modal Overlay & White Card */
.modal-fixed-container {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-backdrop {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: rgba(0,0,0,0.5);
  animation: fadeIn 0.3s ease;
  z-index: 1;
}

.white-card-modal-wrapper {
  position: relative;
  z-index: 2;
  width: 85%;
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: none; /* Crucial: clicks only hit the card inside */
}

.white-card-modal {
  width: 100%;
  background-color: #ffffff;
  border-radius: 36rpx;
  padding: 60rpx 48rpx;
  box-shadow: 0 30rpx 80rpx rgba(0,0,0,0.2);
  animation: slideInUp 0.4s cubic-bezier(0.25, 1, 0.5, 1);
  pointer-events: auto; /* Catch events specifically on the card */
}

.modal-header {
  margin-bottom: 50rpx;
}

.modal-title {
  font-size: 40rpx;
  font-weight: 600;
  color: #000;
  display: block;
  margin-bottom: 12rpx;
}

.modal-subtitle {
  font-size: 24rpx;
  color: #999;
}

.modal-body {
  background-color: #fcfcfc;
  border-radius: 24rpx;
  padding: 10rpx 30rpx;
  border: 1rpx solid #f0f0f0;
}

.refined-input-item {
  padding: 24rpx 0;
  border-bottom: 1rpx solid #f2f2f2;
}

.no-border {
  border-bottom: none;
}

.input-label {
  font-size: 20rpx;
  color: #bbb;
  text-transform: uppercase;
  margin-bottom: 8rpx;
  display: block;
}

.refined-input {
  height: 60rpx;
  font-size: 30rpx;
  color: #1a1a1a;
}

.p-style {
  color: #e0e0e0;
}

.modal-footer {
  display: flex;
  margin-top: 50rpx;
  gap: 24rpx;
}

.action-btn {
  flex: 1;
  height: 100rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50rpx;
  font-size: 30rpx;
  font-weight: 500;
}

.action-btn.cancel {
  background-color: #f7f7f7;
  color: #888;
}

.action-btn.confirm {
  background-color: #000000;
  color: #ffffff;
}

/* Icons */
.icon-moments { width: 16px; height: 16px; border: 1.5px solid #a29bfe; border-radius: 4px; position: relative; }
.icon-moments::after { content: ''; position: absolute; left: 4px; top: 4px; width: 6px; height: 6px; border: 1.5px solid #a29bfe; border-radius: 50%; }

.icon-collect { width: 14px; height: 16px; border: 1.5px solid #4a90e2; border-bottom: none; position: relative; }
.icon-collect::after { content: ''; position: absolute; bottom: -4px; left: -1.5px; width: 0; height: 0; border-left: 7px solid transparent; border-right: 7px solid transparent; border-bottom: 5px solid #fff; transform: rotate(180deg); }

.icon-password { width: 14px; height: 16px; border: 1.5px solid #000; border-radius: 7px 7px 2px 2px; position: relative; }
.icon-password::after { content: ''; position: absolute; top: 10px; left: 3px; width: 5px; height: 2px; background: #000; }

.icon-settings { width: 16px; height: 16px; border: 5px dotted #999; border-radius: 50%; box-sizing: border-box; }

.icon-logout { width: 14px; height: 14px; border: 1.5px solid #ff7675; border-left: none; position: relative; }
.icon-logout::before { content: ''; position: absolute; left: -4px; top: 50%; width: 8px; height: 1.5px; background: #ff7675; }
.icon-logout::after { content: ''; position: absolute; left: 2px; top: 50%; width: 5px; height: 5px; border-top: 1.5px solid #ff7675; border-right: 1.5px solid #ff7675; transform: rotate(45deg) translateY(-50%); }

.bg-purple { background-color: #f3f0ff; }
.bg-blue { background-color: #eef5ff; }
.bg-black { background-color: #f2f2f2; }
.bg-green { background-color: #f0fff4; }
.bg-gray { background-color: #f7f7f7; }
.bg-red { background-color: #fff5f5; }

.bottom-safe-area { height: 120px; width: 100%; }

@keyframes slideUpFade { from { opacity: 0; transform: translate3d(0, 30rpx, 0); } to { opacity: 1; transform: translate3d(0, 0, 0); } }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes slideInUp { from { opacity: 0; transform: translateY(100rpx); } to { opacity: 1; transform: translateY(0); } }
</style>
