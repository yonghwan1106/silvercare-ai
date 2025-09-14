import { UserProfile } from '@/types';

export const DEMO_USER_PROFILE: UserProfile = {
  id: 'demo-user-001',
  name: '김영희',
  age: 73,
  medicalConditions: ['고혈압', '당뇨병', '관절염'],
  emergencyContacts: [
    {
      name: '김철수',
      phone: '010-1234-5678',
      relationship: '아들',
      isPrimary: true,
    },
    {
      name: '박미영',
      phone: '010-9876-5432',
      relationship: '딸',
      isPrimary: false,
    },
    {
      name: '동네의원',
      phone: '02-123-4567',
      relationship: '의료진',
      isPrimary: false,
    },
  ],
  preferences: {
    fontSize: 'large',
    notifications: true,
    voiceEnabled: true,
    theme: 'light',
  },
};

export const SAMPLE_HEALTH_TIPS = [
  {
    category: '운동',
    title: '규칙적인 산책의 중요성',
    content: '하루 30분 이상의 가벼운 산책은 심혈관 건강에 도움이 됩니다. 무리하지 마시고 천천히 걸어보세요.',
    icon: '🚶‍♀️',
  },
  {
    category: '영양',
    title: '충분한 수분 섭취',
    content: '하루 6-8잔의 물을 마시는 것이 좋습니다. 탈수는 어지러움과 피로감을 유발할 수 있습니다.',
    icon: '💧',
  },
  {
    category: '복약',
    title: '정시 복약 관리',
    content: '처방받은 약은 정해진 시간에 복용하는 것이 중요합니다. 알람을 설정해 두시면 도움이 됩니다.',
    icon: '💊',
  },
  {
    category: '수면',
    title: '규칙적인 수면 패턴',
    content: '매일 같은 시간에 잠자리에 들고 일어나는 것이 좋습니다. 7-8시간의 충분한 수면이 필요합니다.',
    icon: '😴',
  },
];

export const QUICK_ACTIONS = [
  {
    id: 'emergency-call',
    title: '응급 연락',
    description: '응급상황 시 가족 또는 병원에 즉시 연락',
    icon: '🚨',
    color: 'bg-red-500',
    action: 'emergency',
  },
  {
    id: 'family-call',
    title: '가족과 통화',
    description: '자녀에게 안부 전화하기',
    icon: '📞',
    color: 'bg-blue-500',
    action: 'call',
  },
  {
    id: 'medication-reminder',
    title: '복약 확인',
    description: '오늘의 복약 일정 확인하기',
    icon: '💊',
    color: 'bg-green-500',
    action: 'medication',
  },
  {
    id: 'health-report',
    title: '건강 리포트',
    description: '주간 건강 상태 리포트 보기',
    icon: '📊',
    color: 'bg-purple-500',
    action: 'report',
  },
];

export const GREETING_MESSAGES = [
  '좋은 아침입니다! 오늘도 건강한 하루 되세요.',
  '안녕하세요! 오늘 컨디션은 어떠신가요?',
  '어르신, 오늘도 활기찬 하루 보내고 계신가요?',
  '안녕하세요! 무엇을 도와드릴까요?',
  '좋은 하루입니다! 건강은 잘 챙기고 계신가요?',
];

export const CONVERSATION_STARTERS = [
  '오늘 기분이 어떠세요?',
  '최근 건강은 어떠신가요?',
  '오늘 드신 식사는 어떠셨나요?',
  '잠은 잘 주무셨나요?',
  '운동은 하고 계신가요?',
  '약은 잘 챙겨 드시고 계신가요?',
];