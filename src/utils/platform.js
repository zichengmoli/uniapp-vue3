/**
 * 全局统一的平台兼容方法库
 * 用于屏蔽不同平台（H5、小程序、App等）之间的 API 差异
 */

/**
 * 安全的监听键盘高度变化
 * @param {Function} callback - 键盘高度改变时的回调函数，接收键盘高度作为参数
 */
export const onKeyboardHeightChange = (callback) => {
  // #ifndef H5
  // 小程序/APP 等平台，直接调用原生 API
  if (typeof uni.onKeyboardHeightChange === 'function') {
    uni.onKeyboardHeightChange((res) => {
      if (typeof callback === 'function') {
        callback(res.height);
      }
    });
  }
  // #endif

  // #ifdef H5
  // H5 平台通过监听窗口尺寸或者 visualViewport 变化来模拟推断键盘高度
  if (typeof window !== 'undefined') {
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
    
    // 如果支持 visualViewport 特性，优先使用
    if (window.visualViewport) {
      const initialHeight = window.innerHeight;
      window.visualViewport.addEventListener('resize', (e) => {
        // H5中，键盘弹出通常会导致可视区域缩小
        const currentHeight = e.target.height;
        let heightDiff = initialHeight - currentHeight;
        if (heightDiff > 50) {
          callback(heightDiff);
        } else {
          callback(0);
        }
      });
    } else {
      // 降级使用 resize 事件
      const initialHeight = window.innerHeight;
      window.addEventListener('resize', () => {
        const currentHeight = window.innerHeight;
        let heightDiff = initialHeight - currentHeight;
        // 如果高度差大于 50px，通常认为是键盘弹起
        if (heightDiff > 50) {
          callback(heightDiff);
        } else {
          callback(0);
        }
      });
    }
  }
  // #endif
};

/**
 * 跨端统一的媒体选择方法 (兼容 uni.chooseMedia 和 uni.chooseImage)
 * @param {Object} options - 配置对象，支持 count, mediaType, sourceType, success 等
 */
export const uniChooseMedia = (options = {}) => {
  // #ifndef H5
  if (uni.chooseMedia) {
    uni.chooseMedia(options);
    return;
  }
  // #endif

  // H5 平台或者不支持 chooseMedia 的基础库降级方案
  // 注意 H5 环境下的 chooseImage 成功回调只有 tempFilePaths 和 tempFiles (File 对象)
  // 为了与 chooseMedia 保持结果结构一致，我们在业务调用方进行了 file 结构的统一包装 
  // 此处映射部分参数
  const fallbackOptions = {
    ...options,
    // 如果只需要视频，可以使用 chooseVideo，但如果混合则降级为选图 (因为 H5 chooseImage 不支持视频类型过滤)
  };
  
  if (options.mediaType && options.mediaType.includes('video') && !options.mediaType.includes('image')) {
    uni.chooseVideo(fallbackOptions);
  } else {
    uni.chooseImage(fallbackOptions);
  }
};
