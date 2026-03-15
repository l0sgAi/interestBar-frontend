export default {
  // 通用
  common: {
    appName: 'Quba',
    search: 'Search',
    searchPlaceholder: 'Search circles, posts...',
    loading: 'Loading...',
    loadMore: 'Load More',
    noResults: 'No results',
    noData: 'No data',
    cancel: 'Cancel',
    confirm: 'Confirm',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    share: 'Share',
    back: 'Back',
    submit: 'Submit',
    logout: 'Logout',
    logoutConfirm: 'Are you sure you want to logout?',
    logoutSuccess: 'Logged out successfully',
    operationSuccess: 'Operation successful',
    operationFailed: 'Operation failed',
    unknownError: 'Unknown error',
    featureInDevelopment: 'Feature in development...'
  },

  // 时间相关
  time: {
    justNow: 'Just now',
    minutesAgo: '{minutes}m ago',
    hoursAgo: '{hours}h ago',
    daysAgo: '{days}d ago',
    monthsAgo: '{months}mo ago',
    yearsAgo: '{years}y ago',
    createdAt: 'Created',
    updatedAt: 'Updated'
  },

  // 帖子相关
  post: {
    post: 'Post',
    createPost: 'Create Post',
    createPostSuccess: 'Created successfully',
    createPostFailed: 'Creation failed',
    title: 'Title',
    titlePlaceholder: 'Enter post title',
    content: 'Content',
    contentPlaceholder: 'Enter post content (Markdown supported)',
    summary: 'Summary',
    summaryPlaceholder: 'Enter summary for search and keyword matching',
    belongToCircle: 'Circle',
    selectCircle: 'Search and select a circle',
    detail: 'Post Detail',
    status: {
      normal: 'Normal',
      draft: 'Draft',
      reviewing: 'Reviewing',
      rejected: 'Rejected',
      blocked: 'Blocked'
    },
    badges: {
      pinned: 'Pinned',
      essence: 'Essence',
      locked: 'Locked'
    },
    stats: {
      views: 'Views',
      comments: 'Comments',
      likes: 'Likes',
      favorites: 'Favorites'
    },
    actions: {
      like: 'Like',
      liked: 'Liked',
      favorite: 'Favorite',
      share: 'Share',
      comment: 'Comment'
    },
    noPosts: 'No posts yet',
    noPostResults: 'No post results',
    searching: 'Searching...',
    postNotFound: 'Post not found'
  },

  // 圈子相关
  circle: {
    circle: 'Circle',
    interestCircle: 'Interest Circle',
    circles: 'Circles',
    myCircles: 'My Circles',
    joinCircle: 'Join Circle',
    leaveCircle: 'Leave Circle',
    joined: 'Joined',
    createCircle: 'Create Circle',
    createCircleSuccess: 'Created successfully',
    joinSuccess: 'Joined successfully',
    joinFailed: 'Failed to join',
    leaveSuccess: 'Left circle',
    leaveFailed: 'Failed to leave',
    disturb: 'Mute',
    disturbOn: 'Mute On',
    disturbOff: 'Mute',
    disturbEnabled: 'Mute enabled',
    disturbDisabled: 'Mute disabled',
    createPost: 'Post',
    members: 'Members',
    posts: 'Posts',
    description: 'Description',
    noCircles: 'No circles yet',
    noCircleResults: 'No circle results',
    moreOptions: 'More',
    report: 'Report'
  },

  // 用户相关
  user: {
    user: 'User',
    username: 'Username',
    avatar: 'Avatar',
    profile: 'Profile',
    editProfile: 'Edit Profile',
    myPosts: 'My Posts',
    myFavorites: 'My Favorites',
    browseHistory: 'History',
    myGroups: 'Circles',
    userInfo: 'User Info',
    basicInfo: 'Basic Info',
    email: 'Email',
    phone: 'Phone',
    gender: 'Gender',
    birthday: 'Birthday',
    role: 'Role',
    status: 'Status',
    notSet: 'Not set',
    notBound: 'Not bound',
    normal: 'Normal',
    disabled: 'Disabled',
    userSearchInDevelopment: 'User search in development...',
    anonymous: 'Anonymous'
  },

  // 导航和菜单
  nav: {
    home: 'Home',
    recommend: 'Recommend',
    following: 'Following',
    hot: 'Hot',
    discover: 'Discover',
    create: 'Create',
    messages: 'Messages',
    notifications: 'Notifications',
    settings: 'Settings',
    profile: 'Profile',
    searchResults: 'Search Results',
    keyword: 'Keyword'
  },

  // 登录页
  login: {
    tagline: 'Connect interests, discover possibilities',
    googleLogin: 'Continue with Google',
    githubLogin: 'Continue with GitHub',
    loginAgreement: 'By logging in, you agree to our',
    userAgreement: 'User Agreement',
    privacyPolicy: 'Privacy Policy',
    and: 'and'
  },

  // 表单验证
  validation: {
    required: 'This field is required',
    invalidEmail: 'Please enter a valid email',
    invalidPhone: 'Please enter a valid phone number',
    minLength: 'Minimum {min} characters required',
    maxLength: 'Maximum {max} characters allowed',
    tooShort: 'Content too short',
    tooLong: 'Content too long'
  },

  // 消息提示
  messages: {
    loginRequired: 'Please login first',
    pleaseLoginFirst: 'Please login first',
    operationFailed: 'Operation failed: {error}',
    getDetailFailed: 'Failed to get details: {error}',
    deleteSuccess: 'Deleted successfully',
    deleteFailed: 'Delete failed: {error}',
    updateSuccess: 'Updated successfully',
    updateFailed: 'Update failed: {error}',
    copySuccess: 'Copied successfully',
    copyFailed: 'Copy failed',
    likeFeaturePending: 'Like feature pending',
    favoriteFeaturePending: 'Favorite feature pending'
  }
}
