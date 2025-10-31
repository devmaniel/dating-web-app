export const API_ENDPOINTS = {
  AUTH: {
    SIGN_UP: '/auth/sign-up',
    SIGN_IN: '/auth/sign-in',
    PROFILE_COMPLETION: '/auth/profile-completion',
    LOGOUT: '/auth/logout',
  },
  PROFILE: {
    COMPLETE: '/profile/complete',
  },
  MATCH: {
    PROFILES: '/match/profiles',
  },
  LIKES: {
    SEND: '/likes/send',
    RECEIVED: '/likes/received',
    SENT: '/likes/sent',
    UPDATE: '/likes',
  },
  NOTIFICATIONS: {
    GET: '/notifications',
    UNREAD_COUNT: '/notifications/unread-count',
    STATS: '/notifications/stats',
    MARK_READ: '/notifications',
    MARK_ALL_READ: '/notifications/mark-all-read',
  },
} as const;