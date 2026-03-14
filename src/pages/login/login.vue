<template>
  <view class="container" @touchmove.stop.prevent>
    <!-- Light Monochrome 3D Background Elements -->
    <view class="bg-elements">
      <view class="sphere s1"></view>
      <view class="sphere s2"></view>
      <view class="sphere s3"></view>
      
      <!-- Irregular Particles Layer -->
      <view class="particles-container">
        <view 
          v-for="i in 80" 
          :key="i" 
          class="particle" 
          :style="particleStyles[i-1]"
        ></view>
      </view>
    </view>

    <!-- Glass Morphism Card -->
    <view class="glass-card" :class="{ 'is-flip': !isLogin }">
      <view class="card-inner">
        <!-- Login Form Side -->
        <view class="form-side login-side">
          <view class="header-section">
            <text class="title">Hi, 欢迎回来</text>
            <text class="subtitle">请输入您的账号信息以继续</text>
          </view>
          
          <view class="input-group">
            <view class="glass-input" :class="{'has-error': errors.username, 'focused': focusField === 'username'}">
              <text class="label" :class="{ 'active': form.username || focusField === 'username' }">用户名</text>
              <input class="input" type="text" v-model="form.username" @input="clearError('username')" @focus="focusField = 'username'" @blur="focusField = ''" />
            </view>
            <text class="error-msg" v-if="errors.username">{{ errors.username }}</text>
            
            <view class="glass-input" :class="{'has-error': errors.password, 'focused': focusField === 'password'}">
              <text class="label" :class="{ 'active': form.password || focusField === 'password' }">密码</text>
              <input class="input" password v-model="form.password" @input="clearError('password')" @focus="focusField = 'password'" @blur="focusField = ''" />
            </view>
            <text class="error-msg" v-if="errors.password">{{ errors.password }}</text>
          </view>
          
          <text class="global-error" v-if="errors.global">{{ errors.global }}</text>
          
          <view class="button-section">
            <button class="glass-btn primary" @click="handleSubmit" :loading="loading">
              <text class="btn-text">登录</text>
            </button>
            
            <view class="footer-action">
              <text class="hint">没有账号？</text>
              <text class="link" @click="toggleMode">立即注册</text>
            </view>
          </view>
        </view>

        <!-- Register Form Side -->
        <view class="form-side register-side">
          <view class="header-section">
            <text class="title">新用户注册</text>
            <text class="subtitle">填写信息开启您的社交之旅</text>
          </view>
          
          <view class="input-group">
            <view class="glass-input" :class="{'has-error': errors.username, 'focused': focusField === 'reg_username'}">
              <text class="label" :class="{ 'active': form.username || focusField === 'reg_username' }">设置用户名</text>
              <input class="input" type="text" v-model="form.username" @input="clearError('username')" @focus="focusField = 'reg_username'" @blur="focusField = ''" />
            </view>
            
            <view class="glass-input" :class="{'has-error': errors.password, 'focused': focusField === 'reg_password'}">
              <text class="label" :class="{ 'active': form.password || focusField === 'reg_password' }">登录密码</text>
              <input class="input" password v-model="form.password" @input="clearError('password')" @focus="focusField = 'reg_password'" @blur="focusField = ''" />
            </view>
            
            <view class="glass-input" :class="{'has-error': errors.confirmPassword, 'focused': focusField === 'reg_confirm'}">
              <text class="label" :class="{ 'active': form.confirmPassword || focusField === 'reg_confirm' }">确认密码</text>
              <input class="input" password v-model="form.confirmPassword" @input="clearError('confirmPassword')" @focus="focusField = 'reg_confirm'" @blur="focusField = ''" />
            </view>
          </view>
          
          <text class="global-success" v-if="successMsg">{{ successMsg }}</text>
          <text class="global-error" v-if="errors.global">{{ errors.global }}</text>
          
          <view class="button-section">
            <button class="glass-btn primary" @click="handleSubmit" :loading="loading">
              <text class="btn-text">确认注册</text>
            </button>
            
            <view class="footer-action">
              <text class="hint">已有账号？</text>
              <text class="link" @click="toggleMode">返回登录</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { mockLogin } from '../../mock/data.js';

const isLogin = ref(true);
const focusField = ref('');
const form = ref({ username: '', password: '', confirmPassword: '' });
const errors = ref({ username: '', password: '', confirmPassword: '', global: '' });
const successMsg = ref('');
const loading = ref(false);

const showPassword = ref(false); // Can be kept or removed depending on requirements, but cleaning up toggle logic
const showConfirmPassword = ref(false);

const togglePassword = () => showPassword.value = !showPassword.value;
const toggleConfirmPassword = () => showConfirmPassword.value = !showConfirmPassword.value;

const particleStyles = ref([]);

const generateParticleStyles = () => {
  const styles = [];
  const colors = [
    'rgba(0, 0, 0, 0.45)',       // Charcoal
    'rgba(180, 180, 180, 0.55)',  // Silver
    'rgba(255, 255, 255, 0.7)',   // Pearl White
    'rgba(173, 216, 230, 0.4)',   // Sky Blue tint
    'rgba(200, 200, 200, 0.5)',   // Mist
    'rgba(147, 112, 219, 0.15)',  // Subtle Lavender
    'rgba(240, 230, 140, 0.12)',  // Hint of Gold
    'rgba(152, 251, 152, 0.12)'   // Hint of Mint
  ];

  for (let i = 0; i < 80; i++) {
    const size = Math.random() * 6 + 2; // Slightly larger
    const opacity = Math.random() * 0.4 + 0.3; // Much more visible
    const duration = Math.random() * 15 + 20;
    const delay = Math.random() * -25;
    const top = Math.random() * 100;
    const left = Math.random() * 100;
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    styles.push({
      width: `${size}px`,
      height: `${size}px`,
      top: `${top}%`,
      left: `${left}%`,
      opacity: opacity,
      backgroundColor: color,
      animationDuration: `${duration}s`,
      animationDelay: `${delay}s`
    });
  }
  particleStyles.value = styles;
};

onMounted(() => {
  generateParticleStyles();
});

const clearError = (field) => {
  errors.value[field] = '';
  errors.value.global = '';
  successMsg.value = '';
};

const toggleMode = () => {
  isLogin.value = !isLogin.value;
  setTimeout(() => {
    form.value = { username: '', password: '', confirmPassword: '' };
    errors.value = { username: '', password: '', confirmPassword: '', global: '' };
    successMsg.value = '';
    focusField.value = '';
  }, 300);
};

const validate = () => {
  let isValid = true;
  errors.value = { username: '', password: '', confirmPassword: '', global: '' };
  successMsg.value = '';

  if (!form.value.username.trim()) {
    errors.value.username = '账号不能为空';
    isValid = false;
  }
  
  if (!form.value.password || form.value.password.length < 6) {
    errors.value.password = '密码需至少6位';
    isValid = false;
  }
  
  if (!isLogin.value && form.value.password !== form.value.confirmPassword) {
    errors.value.confirmPassword = '密码确认不匹配';
    isValid = false;
  }
  
  return isValid;
};

const handleSubmit = async () => {
  if (!validate()) return;

  loading.value = true;
  try {
    const res = await mockLogin(form.value.username, form.value.password, isLogin.value);
    if (res.code === 200) {
      if (!isLogin.value) {
        successMsg.value = '注册成功！正在进入...';
        setTimeout(() => {
          uni.setStorageSync('user', res.user);
          uni.setStorageSync('token', res.token);
          uni.switchTab({ url: '/pages/index/index' });
        }, 800);
      } else {
        uni.setStorageSync('user', res.user);
        uni.setStorageSync('token', res.token);
        uni.switchTab({ url: '/pages/index/index' });
      }
    }
  } catch (err) {
    errors.value.global = err.message || (isLogin.value ? '登录失败' : '注册失败');
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.container {
  height: 100vh;
  background-color: #f8f9fa;
  background-image: radial-gradient(circle at 50% 50%, #ffffff 0%, #f0f2f5 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
  overflow: hidden;
  touch-action: none; /* Block scrolling */
}

/* Light Monochrome 3D Background */
.bg-elements {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  z-index: 1;
}

.sphere {
  position: absolute;
  border-radius: 50%;
  filter: blur(50px);
  will-change: transform;
  transform: translate3d(0, 0, 0);
}

.s1 {
  width: 350px; height: 350px;
  background: radial-gradient(circle, rgba(0,0,0,0.04), transparent);
  top: -120px; right: -80px;
  animation: float 20s infinite linear;
}

.s2 {
  width: 300px; height: 300px;
  background: radial-gradient(circle, rgba(0,0,0,0.03), transparent);
  bottom: 30px; left: -120px;
  animation: float 25s infinite linear reverse;
}

.s3 {
  width: 200px; height: 200px;
  background: radial-gradient(circle, rgba(0,0,0,0.02), transparent);
  top: 30%; left: 15%;
  animation: float 18s infinite ease-in-out;
}

/* Particles Layer */
.particles-container {
  position: absolute;
  width: 100%; height: 100%;
  pointer-events: none;
}

.particle {
  position: absolute;
  border-radius: 50%;
  will-change: transform;
  animation: drift linear infinite;
}

@keyframes drift {
  0% { transform: translate3d(0, 0, 0); }
  25% { transform: translate3d(15px, 20px, 0); }
  50% { transform: translate3d(-10px, 40px, 0); }
  75% { transform: translate3d(-30px, 20px, 0); }
  100% { transform: translate3d(0, 0, 0); }
}

@keyframes float {
  0%, 100% { transform: translate3d(0, 0, 0); }
  33% { transform: translate3d(30px, 50px, 0); }
  66% { transform: translate3d(-20px, 25px, 0); }
}

/* Compact Glass Card - Light Theme */
.glass-card {
  width: 100%;
  max-width: 360px;
  height: 400px; /* Optimized tight fit */
  z-index: 10;
  perspective: 2000px;
  will-change: transform;
  transition: height 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.glass-card.is-flip {
  height: 500px; /* Optimized tight fit for register */
}

.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  transform-style: preserve-3d;
}

.glass-card.is-flip .card-inner {
  transform: rotateY(180deg);
}

.form-side {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  background: rgba(255, 255, 255, 0.65);
  backdrop-filter: blur(25px);
  -webkit-backdrop-filter: blur(25px);
  border-radius: 28px;
  border: 1px solid rgba(255, 255, 255, 0.8);
  padding: 32px; /* Standardize all padding */
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.06);
}

.register-side {
  transform: rotateY(180deg);
}

.header-section {
  margin-bottom: 20px; /* Standardize and reduce */
}

.title {
  font-size: 26px;
  font-weight: 700;
  color: #1a1a1a;
  display: block;
  letter-spacing: -0.5px;
}

.subtitle {
  font-size: 13px;
  color: #8c8c8c;
  margin-top: 6px;
  display: block;
}

/* Light Inputs - Refined Typography */
.input-group {
  margin-bottom: 12px;
}

.glass-input {
  position: relative;
  height: 68px; /* Slightly taller for more elegance */
  background: rgba(0, 0, 0, 0.035); /* Slightly darker for borderless visibility */
  border: none; /* Cancelled border as requested */
  border-radius: 18px;
  margin-bottom: 18px;
  padding: 0 24px; /* More generous horizontal padding */
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  flex-direction: column;
}

.glass-input.focused {
  background: rgba(0, 0, 0, 0.015);
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.04), inset 0 0 0 1px rgba(0,0,0,0.05);
}

.glass-input.has-error {
  border-color: rgba(255, 59, 48, 0.3);
  background: rgba(255, 59, 48, 0.02);
}

.label {
  position: absolute;
  left: 24px;
  top: 50%;
  transform: translateY(-50%);
  color: #8c8c8c;
  font-size: 15px;
  font-weight: 700; /* Bold title */
  pointer-events: none;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.label.active {
  top: 18px; /* High up for hierarchy */
  font-size: 11px;
  color: #1a1a1a;
  transform: translateY(0);
}

.input {
  width: 100%;
  height: 28px;
  margin-top: 32px; /* Precision gap from title */
  background: transparent;
  border: none;
  color: #1a1a1a;
  font-size: 17px;
  font-weight: 700; /* Bold content as requested */
}

.error-msg {
  font-size: 10px;
  color: #ff3b30;
  margin-top: -12px;
  margin-bottom: 12px;
  margin-left: 4px;
  display: block;
}

/* Light Button Section */
.button-section {
  margin-top: auto; /* Push to bottom for consistent border distance */
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.glass-btn {
  width: 100%;
  height: 52px;
  border-radius: 14px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  background-color: #1a1a1a;
}

.btn-text {
  color: #ffffff;
  font-weight: 700;
  font-size: 15px;
}

.glass-btn:active {
  transform: scale(0.97);
  opacity: 0.9;
}

.footer-action {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
}

.hint {
  font-size: 13px;
  color: #8c8c8c;
}

.link {
  font-size: 13px;
  color: #1a1a1a;
  font-weight: 700;
}

.global-error {
  color: #ff3b30;
  font-size: 12px;
  text-align: center;
  margin-bottom: 12px;
  display: block;
}

.global-success {
  color: #2b2b2b;
  font-size: 12px;
  text-align: center;
  margin-bottom: 12px;
  display: block;
}
</style>

