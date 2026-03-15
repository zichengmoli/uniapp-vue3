// mock/data.js
import { reactive } from 'vue';

// 1. Current User Definition
export const currentUser = {
  id: 'u_1001',
  username: 'admin',
  nickname: '管理员',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
  signature: '大道至简，行稳致远。',
  bgImage: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80',
  location: '中国，上海',
  gender: '男',
  level: 'svip'
};

// 2. Raw Users Source (The Single Source of Truth)
const ALL_USERS = [
  { id: 'u_2001', name: '林晓涵', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80', bgImage: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=800&q=80', bio: '生活不止眼前的苟且。', location: '杭州', gender: '女', level: 'vip', letter: 'L' },
  { id: 'u_2003', name: '陈浩', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80', bgImage: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80', bio: '代码就是诗歌。', location: '深圳', gender: '男', level: 'vip', letter: 'C' },
  { id: 'u_2004', name: '苏雅', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80', bgImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80', bio: '设计驱动增长。', location: '北京', gender: '女', level: 'svip', letter: 'S' },
  { id: 'u_2008', name: '大卫', avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=150&q=80', bgImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80', bio: '让细节更有意义。', location: '上海', gender: '男', level: 'vip', letter: 'D' },
  { id: 'u_2009', name: '丁霞', avatar: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&w=150&q=80', bgImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=800&q=80', bio: '快乐工作，认真生活。', location: '成都', gender: '女', level: 'user', letter: 'D' },
  { id: 'u_2010', name: '周杰伦', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80', bgImage: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80', bio: '哎哟不错哦。', location: '台北', gender: '男', level: 'svip', letter: 'Z' },
  { id: 'u_2011', name: '陈奕迅', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80', bgImage: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80', bio: '不如不见。', location: '香港', gender: '男', level: 'vip', letter: 'C' },
  { id: 'u_2012', name: '林俊杰', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80', bgImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80', bio: '江南雨。', location: '新加坡', gender: '男', level: 'vip', letter: 'L' },
  { id: 'u_2013', name: '邓紫棋', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80', bgImage: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=800&q=80', bio: '泡沫。', location: '香港', gender: '女', level: 'vip', letter: 'D' },
  { id: 'u_2014', name: '张靓颖', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=150&q=80', bgImage: 'https://images.unsplash.com/photo-1504257432389-52343af06ae3?auto=format&fit=crop&w=800&q=80', bio: '画心。', location: '成都', gender: '女', level: 'vip', letter: 'Z' },
  { id: 'u_2015', name: '李宗盛', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80', bgImage: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=800&q=80', bio: '真心英雄。', location: '台北', gender: '男', level: 'user', letter: 'L' },
  { id: 'u_2016', name: '张学友', avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=150&q=80', bgImage: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=800&q=80', bio: '歌神。', location: '香港', gender: '男', level: 'svip', letter: 'Z' },
  { id: 'u_2017', name: '刘德华', avatar: 'https://images.unsplash.com/photo-1504257432389-52343af06ae3?auto=format&fit=crop&w=150&q=80', bgImage: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&w=800&q=80', bio: '笨小孩。', location: '香港', gender: '男', level: 'svip', letter: 'L' },
  { id: 'u_2018', name: '王菲', avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=150&q=80', bgImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80', bio: '红豆。', location: '北京', gender: '女', level: 'svip', letter: 'W' },
  { id: 'u_2019', name: '那英', avatar: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=150&q=80', bgImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80', bio: '征服。', location: '沈阳', gender: '女', level: 'vip', letter: 'N' },
  { id: 'u_2020', name: '孙燕姿', avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=150&q=80', bgImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=800&q=80', bio: '遇见。', location: '新加坡', gender: '女', level: 'vip', letter: 'S' }
];

// 3. Message Data Factory
export const messagesData = {};
ALL_USERS.forEach(user => {
  messagesData[user.id] = [
    { id: `m_${user.id}_1`, senderId: user.id, text: `嗨，很高兴认识你！我是${user.name}。`, time: '昨天', type: 'text' },
    { id: `m_${user.id}_2`, senderId: currentUser.id, text: `你好呀，握个手 🤝`, time: '昨天', type: 'text' },
    { id: `m_${user.id}_3`, senderId: user.id, text: user.bio || '最近在忙什么？', time: '今天', type: 'text' }
  ];
});

// Special Official Account
messagesData['o_system'] = [
  { id: 'm_os_1', senderId: 'o_system', text: '欢迎关注！实时同步开启。', time: '10月12日', type: 'text' }
];

// 4. Derived Chat List
export const chatList = reactive([
  { id: 'c_group', type: 'group', targetId: 'g_office', name: '核心智囊团', avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=150&q=80', lastMessage: '设计稿已确认', timestamp: '下午 2:00', unread: 2, online: false, isGroup: true },
  { id: 'c_system', type: 'official', targetId: 'o_system', name: '系统通知', avatar: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=150&q=80', lastMessage: '实时同步开启', timestamp: '10月12日', unread: 0, online: true, isOfficial: true },
  
  ...ALL_USERS.map((user, index) => ({
    id: `c_u_${index}`,
    type: 'user',
    targetId: user.id,
    name: user.name,
    avatar: user.avatar,
    bgImage: user.bgImage,
    lastMessage: user.bio.length > 20 ? user.bio.substring(0, 18) + '...' : user.bio,
    timestamp: index < 3 ? '10:45' : '昨天',
    unread: index === 0 ? 1 : 0,
    online: index % 2 === 0
  }))
]);

// 5. Derived Contacts List
export const contactsList = (() => {
  const groups = {};
  ALL_USERS.forEach(user => {
    const letter = user.letter || '#';
    if (!groups[letter]) groups[letter] = [];
    groups[letter].push({
      ...user,
      moreInfo: { gender: user.gender, region: user.location, source: '通过搜索添加' }
    });
  });
  
  return Object.keys(groups).sort().map(letter => ({
    letter,
    data: groups[letter].sort((a, b) => a.name.localeCompare(b.name))
  }));
})();

// Helpers & Mock API
export const markAsRead = (targetId) => {
  const chat = chatList.find(c => c.targetId === targetId);
  if (chat) chat.unread = 0;
};

export const mockGetChatHistory = (targetId) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(messagesData[targetId] || []), 400);
  });
};

const userDatabase = [{ username: 'admin', password: '123456', profile: currentUser }];

// Moments Data
export const momentsData = reactive([
  {
    id: 'm_test_1',
    userId: 'u_2004',
    nickname: '苏雅',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80',
    content: '分享今天的心情。☀️',
    images: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'],
    time: '1小时前',
    timestamp: Date.now() - 3600000,
    likes: [],
    comments: [],
    location: '上海',
    visibility: '公开'
  },
  {
    id: 'm_test_2',
    userId: 'u_2004',
    nickname: '苏雅',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80',
    content: '最近的设计灵感来自这里。🖌️',
    images: [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80'
    ],
    time: '2小时前',
    timestamp: Date.now() - 7200000,
    likes: [],
    comments: [],
    location: '深圳',
    visibility: '公开'
  },
  {
    id: 'm2',
    userId: 'u_2001',
    nickname: '林晓涵',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    content: '分享一组好看的风景照。✨',
    images: [
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=800&q=80'
    ],
    time: '4小时前',
    timestamp: Date.now() - 14400000,
    likes: ['u_1001'],
    comments: [],
    location: '杭州',
    visibility: '公开'
  },
  {
    id: 'm1',
    userId: 'u_1001',
    nickname: '管理员',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    content: '今天天气不错，适合写代码。🚀',
    images: ['https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80'],
    time: '2小时前',
    timestamp: Date.now() - 7200000 + 1000, // Slightly newer than test_2
    likes: ['u_2001', 'u_2003'],
    comments: [
      { userId: 'u_2001', nickname: '林晓涵', content: '确实，太阳很暖和。' }
    ],
    location: '杭州',
    visibility: '公开'
  },
  {
    id: 'm3_1',
    userId: 'u_1001',
    nickname: '管理员',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    content: '今天学到了一个新的 Vue 指令，感觉效率提升了不少！💻',
    images: [],
    time: '昨天',
    timestamp: Date.now() - 86400000,
    likes: ['u_2004'],
    comments: [],
    location: '杭州·西湖',
    visibility: '公开'
  },
  {
    id: 'm3_2',
    userId: 'u_2003',
    nickname: '陈浩',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    content: '加班到深夜，看到凌晨四点的深圳。🌃',
    images: [],
    time: '昨天',
    timestamp: Date.now() - 86400000 - 1000,
    likes: ['u_1001', 'u_2001'],
    comments: [],
    location: '深圳',
    visibility: '公开'
  },
  {
    id: 'm3_3',
    userId: 'u_2008',
    nickname: '大卫',
    avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=150&q=80',
    content: '有时候，停下来是为了更好的出发。',
    images: [],
    time: '2天前',
    timestamp: Date.now() - 172800000,
    likes: [],
    comments: [],
    location: '',
    visibility: '私密'
  },
  {
    id: 'm3_4',
    userId: 'u_2010',
    nickname: '周杰伦',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80',
    content: '哎哟不错哦。准备新歌中。🎤',
    images: [],
    time: '3天前',
    timestamp: Date.now() - 259200000,
    likes: ['u_1001', 'u_2011', 'u_2013'],
    comments: [],
    location: '台北',
    visibility: '公开'
  },
  {
    id: 'm3_5',
    userId: 'u_2013',
    nickname: '邓紫棋',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
    content: '全宇宙最美的星空就在你眼里。⭐️',
    images: [],
    time: '4天前',
    timestamp: Date.now() - 345600000,
    likes: ['u_1001'],
    comments: [],
    location: '香港',
    visibility: '部分可见'
  },
  {
    id: 'm3',
    userId: 'u_2004',
    nickname: '苏雅',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80',
    content: '最近读的一本书，受益匪浅。📚',
    images: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'],
    time: '昨天',
    timestamp: Date.now() - 86400000 + 5000,
    likes: [],
    comments: [],
    location: '上海·图书馆',
    visibility: '公开'
  }
]);

export const addMoment = (content, images, location = '', visibility = '公开') => {
  const newMoment = {
    id: 'm' + Date.now(),
    userId: currentUser.id,
    nickname: currentUser.nickname,
    avatar: currentUser.avatar,
    content: content,
    images: images || [],
    time: '刚刚',
    timestamp: Date.now(),
    likes: [],
    comments: [],
    location: location,
    visibility: visibility
  };
  momentsData.unshift(newMoment);
  return newMoment;
};

export const mockLogin = (username, password, isLoginAction = true) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (isLoginAction) {
        const found = userDatabase.find(u => u.username === username && u.password === password);
        found ? resolve({ code: 200, user: found.profile, token: 'jwt-' + found.username }) 
              : reject({ code: 400, message: '账号或密码错误' });
      } else {
        const exist = userDatabase.find(u => u.username === username);
        if (exist) return reject({ code: 400, message: '用户名已被占用' });
        const newProfile = { id: 'u_'+Date.now(), username, nickname: '用户_'+username.slice(0,4), avatar: ALL_USERS[0].avatar, signature: '你好', bgImage: ALL_USERS[0].avatar, location: '地球', level: 'user' };
        userDatabase.push({ username, password, profile: newProfile });
        resolve({ code: 200, user: newProfile, token: 'jwt-'+username });
      }
    }, 800);
  });
};
