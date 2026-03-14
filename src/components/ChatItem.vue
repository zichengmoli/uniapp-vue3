<template>
  <view 
    class="chat-item" 
    hover-class="item-hover"
    @click="$emit('click', data)"
  >
    <CommonAvatar 
      :src="data.avatar" 
      :online="data.online" 
      :showStatus="true"
      size="medium"
    />
    
    <view class="chat-content">
      <view class="chat-header">
        <text class="name">{{ data.name }}</text>
        <text class="time">{{ data.timestamp }}</text>
      </view>
      <view class="chat-footer">
        <text class="message" :class="{'unread-text': data.unread > 0}">
          {{ data.lastMessage }}
        </text>
        <CommonBadge 
          v-if="data.unread > 0"
          type="count" 
          :value="data.unread" 
          preset="danger"
        />
      </view>
    </view>
  </view>
</template>

<script setup>
import CommonAvatar from './CommonAvatar.vue';
import CommonBadge from './CommonBadge.vue';

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
});

defineEmits(['click']);
</script>

<style scoped>
.chat-item {
  display: flex;
  align-items: center;
  padding: 14px 20px;
  background-color: #ffffff;
  transition: background-color 0.2s;
  position: relative;
  transform: translateZ(0);
  will-change: transform, opacity;
}

.item-hover {
  background-color: #f8f9fb;
}

.chat-content {
  flex: 1;
  margin-left: 14px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.name {
  font-size: 16px;
  font-weight: 700;
  color: #1a1a1a;
  letter-spacing: -0.2px;
}

.time {
  font-size: 11px;
  color: #aaaaaa;
  font-weight: 500;
}

.chat-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.message {
  font-size: 13px;
  color: #8e8e93;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-right: 12px;
  font-weight: 400;
}

.unread-text {
  color: #1a1a1a;
  font-weight: 500;
}
</style>
