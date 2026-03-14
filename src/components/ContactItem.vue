<template>
  <view 
    class="contact-item" 
    hover-class="item-hover"
    @click="$emit('click', data)"
  >
    <CommonAvatar 
      :src="data.avatar" 
      size="medium"
    />
    <view class="contact-info">
      <text class="name">{{ data.name }}</text>
      <text v-if="data.bio" class="bio">{{ data.bio }}</text>
    </view>
    <CommonBadge 
      v-if="data.level === 'vip' || data.level === 'svip'"
      type="text"
      :value="data.level"
      :preset="data.level"
    />
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
.contact-item {
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 0.5px solid rgba(0, 0, 0, 0.05);
  transition: background-color 0.2s;
  transform: translateZ(0);
}

.contact-item:last-child {
  border-bottom: none;
}

.item-hover {
  background-color: transparent; /* Usually handled by parent padding/container */
}

.contact-info {
  flex: 1;
  margin-left: 14px;
  display: flex;
  flex-direction: column;
}

.name {
  font-size: 15px;
  font-weight: 600;
  color: #1a1a1a;
}

.bio {
  font-size: 12px;
  color: #999;
  margin-top: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
