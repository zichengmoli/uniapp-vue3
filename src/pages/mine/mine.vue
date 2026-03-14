<template>
  <view class="container">
    <ProfileHeader :data="user" mode="mine">
      <template #action>
        <view class="edit-btn" @click="goToEdit">编辑</view>
      </template>
    </ProfileHeader>
    
    <!-- Menu List with staggered animation -->
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

    <view class="bottom-safe-area"></view>
    <CustomTabBar activePath="/pages/mine/mine" />
  </view>
</template>

<script setup>
import { ref } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import { currentUser } from '../../mock/data.js';
import CustomTabBar from '../../components/CustomTabBar.vue';
import ProfileHeader from '../../components/ProfileHeader.vue';

const user = ref({});

const menuGroups = [
  [
    { text: '收藏', iconClass: 'icon-collect', colorClass: 'bg-blue' },
    { text: '相册', iconClass: 'icon-album', colorClass: 'bg-orange' },
    { text: '钱包', iconClass: 'icon-wallet', colorClass: 'bg-green' }
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
  uni.navigateTo({
    url: '/pages/mine/edit'
  });
};

const handleMenuClick = (item) => {
  if (item.action === 'logout') {
    handleLogout();
  } else {
    uni.showToast({ title: item.text + ' 功能即将推出', icon: 'none' });
  }
};

const handleLogout = () => {
  uni.showModal({
    title: '退出登录',
    content: '你确定要退出登录吗？',
    confirmText: '确定',
    cancelText: '取消',
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
  background-color: #f0f2f5;
  padding-bottom: 40px;
}

/* ProfileHeader is now a component, styles moved there */


.menu-list {
  padding: 0 20px;
}

.menu-group {
  background-color: #ffffff;
  border-radius: 20px;
  margin-bottom: 20px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.02);
  animation: slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
  /* Hardware acceleration & Layer isolation */
  will-change: transform, opacity;
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 12px 14px; /* Even slimmer */
  border-bottom: 1px solid rgba(0,0,0,0.015);
  transition: background-color 0.2s;
}

.menu-hover {
  background-color: #f9fafb;
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

/* Exquisite CSS Icons for Mine Page */
.icon-collect {
  width: 14px;
  height: 16px;
  border: 1.5px solid #4a90e2;
  border-bottom: none;
  position: relative;
}
.icon-collect::after {
  content: '';
  position: absolute;
  bottom: -4px; left: -1.5px;
  width: 0; height: 0;
  border-left: 7px solid transparent;
  border-right: 7px solid transparent;
  border-bottom: 5px solid #ffffff;
  transform: rotate(180deg);
}

.icon-album {
  width: 16px;
  height: 14px;
  border: 1.5px solid #ff9f43;
  border-radius: 2px;
  position: relative;
}
.icon-album::after {
  content: '';
  position: absolute;
  top: 3px; left: 3px; width: 4px; height: 4px;
  background-color: #ff9f43;
  border-radius: 50%;
}

.icon-wallet {
  width: 16px;
  height: 12px;
  border: 1.5px solid #2ecc71;
  border-radius: 3px;
  position: relative;
}
.icon-wallet::after {
  content: '';
  position: absolute;
  right: 2px; top: 50%; width: 4px; height: 2px;
  background-color: #2ecc71;
  margin-top: -1px;
}

.icon-settings {
  width: 16px;
  height: 16px;
  border: 5px dotted #636e72;
  border-radius: 50%;
  box-sizing: border-box;
}

.icon-logout {
  width: 14px;
  height: 14px;
  border: 1.5px solid #ff7675;
  border-left: none;
  position: relative;
}
.icon-logout::before {
  content: '';
  position: absolute;
  left: -4px; top: 50%; width: 8px; height: 1.5px;
  background-color: #ff7675;
  margin-top: -0.75px;
}
.icon-logout::after {
  content: '';
  position: absolute;
  left: 2px; top: 50%; width: 5px; height: 5px;
  border-top: 1.5px solid #ff7675;
  border-right: 1.5px solid #ff7675;
  transform: rotate(45deg) translateY(-50%);
  margin-top: -2px;
}

.bottom-safe-area {
  height: 120px;
  width: 100%;
}

.bg-blue { background-color: #e6f0ff; }
.bg-orange { background-color: #fff0e6; }
.bg-green { background-color: #e6ffe6; }
.bg-gray { background-color: #f0f0f0; }
.bg-red { background-color: #ffe6e6; }

.menu-text {
  flex: 1;
  font-size: 16px;
  color: #1a1a1a;
  font-weight: 500;
}

.arrow {
  color: #ccc;
  font-size: 12px;
}

@keyframes slideUpFade {
  from {
    opacity: 0;
    transform: translate3d(0, 30px, 0);
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}
</style>
