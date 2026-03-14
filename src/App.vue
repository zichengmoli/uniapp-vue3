<script>
export default {
  onLaunch: function () {
    console.log('App Launch')
  },
  onShow: function () {
    console.log('App Show')
  },
  onHide: function () {
    console.log('App Hide')
  },
}
</script>

<style>
/* 每个页面公共css */

/* Absolute Scrollbar Hiding Global */
::-webkit-scrollbar {
  display: none !important;
  width: 0 !important;
  height: 0 !important;
  background: transparent !important;
}

html, body, #app, .uni-app {
  overflow: hidden !important; 
  height: 100% !important;
}

/* Ensure smooth scrolling on iOS and modern browsers */
scroll-view {
  -webkit-overflow-scrolling: touch;
}
</style>
