export default {
  // 通用
  common: {
    appName: '趣吧 Quba',
    search: '搜索',
    searchPlaceholder: '搜索兴趣圈、帖子...',
    loading: '加载中...',
    loadMore: '加载更多',
    noResults: '暂无结果',
    noData: '暂无数据',
    cancel: '取消',
    confirm: '确认',
    save: '保存',
    delete: '删除',
    edit: '编辑',
    share: '分享',
    back: '返回',
    submit: '提交',
    logout: '退出登录',
    logoutConfirm: '确定要退出登录吗？',
    logoutSuccess: '已退出登录',
    operationSuccess: '操作成功',
    operationFailed: '操作失败',
    unknownError: '未知错误',
    featureInDevelopment: '功能开发中...'
  },

  // 时间相关
  time: {
    justNow: '刚刚',
    minutesAgo: '{minutes} 分钟前',
    hoursAgo: '{hours} 小时前',
    daysAgo: '{days} 天前',
    monthsAgo: '{months} 个月前',
    yearsAgo: '{years} 年前',
    createdAt: '创建时间',
    updatedAt: '更新时间'
  },

  // 帖子相关
  post: {
    post: '帖子',
    createPost: '创建帖子',
    createPostSuccess: '创建成功',
    createPostFailed: '创建失败',
    title: '标题',
    titlePlaceholder: '请输入帖子标题',
    content: '正文',
    contentPlaceholder: '请输入帖子正文内容（支持 Markdown 格式）',
    summary: '摘要',
    summaryPlaceholder: '请输入摘要，用于检索和关键词匹配',
    belongToCircle: '所属圈子',
    selectCircle: '搜索并选择圈子',
    detail: '帖子详情',
    status: {
      normal: '正常',
      draft: '草稿',
      reviewing: '审核中',
      rejected: '驳回',
      blocked: '屏蔽'
    },
    badges: {
      pinned: '置顶',
      essence: '精华',
      locked: '锁定'
    },
    stats: {
      views: '浏览',
      comments: '评论',
      likes: '点赞',
      favorites: '收藏'
    },
    actions: {
      like: '点赞',
      liked: '已赞',
      favorite: '收藏',
      share: '分享',
      comment: '评论'
    },
    noPosts: '暂无帖子',
    noPostResults: '暂无帖子结果',
    searching: '搜索中...',
    postNotFound: '帖子不存在'
  },

  // 圈子相关
  circle: {
    circle: '兴趣圈',
    interestCircle: '兴趣圈',
    circles: '兴趣圈',
    myCircles: '我的圈子',
    joinCircle: '加入圈子',
    leaveCircle: '退出圈子',
    joined: '已加入',
    createCircle: '创建圈子',
    createCircleSuccess: '创建成功',
    joinSuccess: '加入成功',
    joinFailed: '加入失败',
    leaveSuccess: '已退出圈子',
    leaveFailed: '退出失败',
    disturb: '免打扰',
    disturbOn: '免打扰已开启',
    disturbOff: '免打扰',
    disturbEnabled: '已开启免打扰',
    disturbDisabled: '已关闭免打扰',
    createPost: '发帖',
    members: '成员',
    posts: '帖子',
    description: '简介',
    noCircles: '暂无圈子',
    noCircleResults: '暂无圈子结果',
    moreOptions: '更多选项',
    report: '举报'
  },

  // 用户相关
  user: {
    user: '用户',
    username: '用户名',
    avatar: '头像',
    profile: '个人资料',
    editProfile: '编辑资料',
    myPosts: '我的帖子',
    myFavorites: '我的收藏',
    browseHistory: '浏览历史',
    myGroups: '兴趣圈',
    userInfo: '用户信息',
    basicInfo: '基本信息',
    email: '邮箱',
    phone: '手机号',
    gender: '性别',
    birthday: '生日',
    role: '角色',
    status: '状态',
    notSet: '未设置',
    notBound: '未绑定',
    normal: '正常',
    disabled: '禁用',
    userSearchInDevelopment: '用户搜索功能开发中...',
    anonymous: '匿名用户'
  },

  // 导航和菜单
  nav: {
    home: '主页',
    recommend: '推荐',
    following: '关注',
    hot: '热门',
    discover: '发现',
    create: '创建',
    messages: '消息',
    notifications: '通知',
    settings: '设置',
    profile: '个人中心',
    searchResults: '搜索结果',
    keyword: '关键词'
  },

  // 登录页
  login: {
    tagline: '连接多元兴趣，发现无限可能',
    googleLogin: '使用 Google 账号继续',
    githubLogin: '使用 GitHub 继续',
    loginAgreement: '登录即代表您同意',
    userAgreement: '《用户协议》',
    privacyPolicy: '《隐私政策》',
    and: '与'
  },

  // 表单验证
  validation: {
    required: '此项为必填项',
    invalidEmail: '请输入有效的邮箱地址',
    invalidPhone: '请输入有效的手机号',
    minLength: '最少需要 {min} 个字符',
    maxLength: '最多允许 {max} 个字符',
    tooShort: '内容太短',
    tooLong: '内容太长'
  },

  // 消息提示
  messages: {
    loginRequired: '请先登录',
    pleaseLoginFirst: '请先登录',
    operationFailed: '操作失败：{error}',
    getDetailFailed: '获取详情失败：{error}',
    deleteSuccess: '删除成功',
    deleteFailed: '删除失败：{error}',
    updateSuccess: '更新成功',
    updateFailed: '更新失败：{error}',
    copySuccess: '复制成功',
    copyFailed: '复制失败',
    likeFeaturePending: '点赞功能待实现',
    favoriteFeaturePending: '收藏功能待实现'
  }
}
