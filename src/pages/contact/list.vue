<template>
  <view class="container">
    <HeaderBar 
      title="联系人" 
      v-model:searchText="searchText" 
      placeholder="搜索联系人"
    />
    
    <scroll-view class="contact-scroll" scroll-y>
      <view class="quick-actions">
        <view class="action-row" @click="goToNewFriends">
          <view class="action-icon new-friend-icon">
            <view class="icon-user-single"></view>
          </view>
          <text class="action-label">新的朋友</text>
          <view class="action-right">
            <view class="action-badge" v-if="true">2</view>
            <text class="action-arrow">❯</text>
          </view>
        </view>
        <view class="action-row">
          <view class="action-icon group-icon">
            <view class="icon-user-group"></view>
          </view>
          <text class="action-label">群聊</text>
          <text class="action-arrow">❯</text>
        </view>
      </view>

      <view 
        v-for="(group, gIndex) in filteredContacts" 
        :key="group.letter" 
        class="contact-section"
        :style="{ animationDelay: gIndex < 5 ? (gIndex * 0.08) + 's' : '0s' }"
      >
        <text class="section-title">{{ group.letter }}</text>
        <ContactItem 
          v-for="(contact, cIndex) in group.data" 
          :key="contact.id" 
          :data="contact"
          @click="goToDetail(contact)"
        />
      </view>

      <view class="contact-count">
        <text class="count-text">{{ totalContacts }}位联系人</text>
      </view>

      <!-- Bottom padding for tab bar -->
      <view class="bottom-safe-area"></view>
    </scroll-view>



    <CustomTabBar activePath="/pages/contact/list" />
  </view>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { contactsList } from '../../mock/data.js';
import CustomTabBar from '../../components/CustomTabBar.vue';
import HeaderBar from '../../components/HeaderBar.vue';
import ContactItem from '../../components/ContactItem.vue';

const contacts = ref([]);
const totalContacts = ref(0);
const searchText = ref('');

const filteredContacts = computed(() => {
  if (!searchText.value.trim()) return contacts.value;
  const keyword = searchText.value.trim().toLowerCase();
  
  return contacts.value.map(group => ({
    ...group,
    data: group.data.filter(contact => contact.name.toLowerCase().includes(keyword))
  })).filter(group => group.data.length > 0);
});

onMounted(() => {
  uni.hideTabBar();
  
  // chatList is reactive, directly reference it
  setTimeout(() => {
    contacts.value = [...contactsList];
    totalContacts.value = contactsList.reduce((sum, group) => sum + group.data.length, 0);
  }, 200);
});

const goToDetail = (contact) => {
  uni.navigateTo({
    url: `/pages/contact/detail?id=${contact.id}`
  });
};

const goToNewFriends = () => {
  uni.showToast({ title: '新的朋友功能即将推出', icon: 'none' });
};
</script>

<style scoped>
/* Page Styles */
.container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: #ffffff;
}

.contact-scroll {
  flex: 1;
  width: 100%;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
}

.contact-scroll::-webkit-scrollbar {
  display: none !important;
  width: 0 !important;
  height: 0 !important;
}

.quick-actions {
  padding: 8px 24px 0;
}

.action-row {
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.04);
}

.action-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 14px;
}

.new-friend-icon {
  background-color: #ff9f0a; /* Premium Orange */
}

.group-icon {
  background-color: #30d158; /* Premium Green */
}

/* CSS Icons for Contacts */
.icon-user-single {
  width: 14px;
  height: 14px;
  position: relative;
}
.icon-user-single::before {
  content: '';
  position: absolute;
  top: 0; left: 3px; width: 8px; height: 8px;
  background-color: #ffffff;
  border-radius: 50%;
}
.icon-user-single::after {
  content: '';
  position: absolute;
  bottom: 0; left: 0; width: 14px; height: 5px;
  background-color: #ffffff;
  border-radius: 7px 7px 0 0;
}

.icon-user-group {
  width: 18px;
  height: 14px;
  position: relative;
}
.icon-user-group::before {
  content: '';
  position: absolute;
  top: 0; left: 2px; width: 7px; height: 7px;
  background-color: #ffffff;
  border-radius: 50%;
  box-shadow: 7px 0 0 #ffffff;
}
.icon-user-group::after {
  content: '';
  position: absolute;
  bottom: 0; left: 0; width: 11px; height: 5px;
  background-color: #ffffff;
  border-radius: 6px 6px 0 0;
  box-shadow: 7px 0 0 rgba(255,255,255,0.8);
}

.action-label {
  flex: 1;
  font-size: 15px;
  font-weight: 500;
  color: #1a1a1a;
}

.action-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.action-badge {
  background-color: #ff3b30;
  color: #ffffff;
  font-size: 11px;
  font-weight: 700;
  padding: 1px 6px;
  border-radius: 8px;
  min-width: 16px;
  text-align: center;
}

.action-arrow {
  font-size: 12px;
  color: #c7c7cc;
}

.contact-section {
  padding: 0 24px;
  animation: slideUpFade 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.section-title {
  font-size: 13px;
  font-weight: 600;
  color: #999999;
  margin: 16px 0 4px;
  display: block;
}

/* ContactItem is now a component, styles moved there */

.contact-count {
  text-align: center;
  padding: 20px 0 8px;
}

.count-text {
  font-size: 13px;
  color: #999;
}

.bottom-safe-area {
  height: 100px;
  width: 100%;
}

@keyframes slideUpFade {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
