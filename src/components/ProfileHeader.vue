<template>
  <view class="profile-header" :class="[mode]">
    <!-- Background banner for 'mine' mode -->
    <view class="header-banner" v-if="mode === 'mine'">
      <image class="bg-img" :src="data.bgImage || defaultBg" mode="aspectFill" />
      <view class="overlay"></view>
    </view>
    
    <view class="profile-card" :class="{ 'card-offset': mode === 'mine' }">
      <view class="user-main">
        <CommonAvatar 
          :src="data.avatar" 
          :size="mode === 'mine' ? 'large' : 'x-large'"
          :custom-style="avatarStyle"
          @click="$emit('avatar-click')"
        />
        
        <view class="user-info">
          <view class="name-row">
            <text class="name">{{ data.nickname || data.name }}</text>
            <CommonBadge 
              v-if="data.level === 'vip' || data.level === 'svip'"
              type="text"
              :value="data.level"
              :preset="data.level"
            />
          </view>
          
          <view class="info-row" v-if="mode === 'mine'">
            <text class="info-item-text">{{ data.gender || '保密' }}</text>
            <text class="info-dot">·</text>
            <text class="info-item-text">{{ data.location || '未知' }}</text>
          </view>
          
          <text v-if="mode === 'contact' && data.bio" class="bio">{{ data.bio }}</text>
          <text class="id-text">账号: {{ data.username || data.id }}</text>
        </view>
        
        <view class="action-slot">
          <slot name="action"></slot>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue';
import CommonAvatar from './CommonAvatar.vue';
import CommonBadge from './CommonBadge.vue';

const props = defineProps({
  data: {
    type: Object,
    required: true
  },
  mode: {
    type: String,
    default: 'mine' // mine, contact
  }
});

defineEmits(['avatar-click']);

const defaultBg = 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=400&q=80';

const avatarStyle = computed(() => {
  if (props.mode === 'mine') {
    return {
      border: '3px solid #ffffff',
      marginTop: '-28px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.05)'
    };
  }
  return {};
});
</script>

<style scoped>
.profile-header {
  width: 100%;
}

.header-banner {
  position: relative;
  height: 240px;
}

.bg-img {
  width: 100%;
  height: 100%;
}

.overlay {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.5));
}

.profile-card {
  background-color: #ffffff;
  padding: 16px;
  position: relative;
  z-index: 10;
  animation: slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
  /* Hardware acceleration & Layer isolation */
  will-change: transform, opacity;
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

.mine .profile-card {
  margin: -40px 16px 16px;
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.05);
}

.contact .profile-card {
  padding: 100px 24px 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-bottom-left-radius: 32px;
  border-bottom-right-radius: 32px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.03);
  text-align: center;
}

.user-main {
  display: flex;
  align-items: center;
  width: 100%;
}

.contact .user-main {
  flex-direction: column;
}

.user-info {
  flex: 1;
  margin-left: 16px;
  display: flex;
  flex-direction: column;
}

.contact .user-info {
  margin-left: 0;
  margin-top: 20px;
  align-items: center;
}

.name-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.name {
  font-size: 16px;
  font-weight: 800;
  color: #121212;
}

.contact .name {
  font-size: 26px;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 4px;
}

.info-item-text {
  font-size: 11px;
  color: #8e8e93;
}

.info-dot {
  font-size: 11px;
  color: #c7c7cc;
}

.bio {
  font-size: 15px;
  color: #666;
  margin-top: 8px;
}

.id-text {
  font-size: 10px;
  color: #c7c7cc;
  margin-top: 2px;
}

.contact .id-text {
  font-size: 13px;
  margin-top: 8px;
}

.action-slot {
  margin-left: auto;
}

@keyframes slideUpFade {
  from { opacity: 0; transform: translate3d(0, 30px, 0); }
  to { opacity: 1; transform: translate3d(0, 0, 0); }
}
</style>
