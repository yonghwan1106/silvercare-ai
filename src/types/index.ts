// Health Metrics Types
export interface HealthMetrics {
  heartRate: number;          // 심박수 (60-100)
  bloodPressure: string;      // 혈압 "120/80"
  temperature: number;        // 체온 (36.0-37.5)
  steps: number;             // 걸음수
  sleepHours: number;        // 수면시간
  medicationTaken: boolean;  // 복약 여부
  timestamp: Date;           // 측정 시간
}

// User and Profile Types
export interface UserProfile {
  id: string;
  name: string;
  age: number;
  medicalConditions?: string[];
  emergencyContacts?: EmergencyContact[];
  preferences?: UserPreferences;
}

export interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
  isPrimary?: boolean;
}

export interface UserPreferences {
  fontSize: 'small' | 'medium' | 'large';
  notifications: boolean;
  voiceEnabled: boolean;
  theme: 'light' | 'dark' | 'auto';
}

// Chat and Communication Types
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sentiment?: 'positive' | 'neutral' | 'concerned';
}

export interface Conversation {
  id: string;
  userId: string;
  messages: Message[];
  startedAt: Date;
  lastActivity: Date;
}

// Notification Types
export interface Notification {
  id: string;
  type: 'info' | 'warning' | 'emergency' | 'reminder';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionRequired: boolean;
  metadata?: {
    elderName?: string;
    location?: string;
    healthMetrics?: HealthMetrics;
    severity?: 'low' | 'medium' | 'high' | 'critical';
  };
}

// Emergency and Alert Types
export interface EmergencyAlert {
  id: string;
  type: 'medical' | 'fall' | 'noResponse' | 'panic' | 'medication';
  severity: 'low' | 'medium' | 'high' | 'critical';
  userId: string;
  message: string;
  location?: string;
  healthData?: HealthMetrics;
  timestamp: Date;
  resolved: boolean;
  responseTime?: number;
}

export interface EmergencyResponse {
  alertId: string;
  responderType: 'family' | 'medical' | 'emergency' | 'neighbor';
  responderName: string;
  responseTime: number;
  action: string;
  notes?: string;
}

// Activity and Monitoring Types
export interface ActivityPattern {
  type: 'sleep' | 'meal' | 'medication' | 'exercise' | 'social';
  timestamp: Date;
  duration?: number; // in minutes
  quality?: 'poor' | 'fair' | 'good' | 'excellent';
  notes?: string;
}

export interface DailyReport {
  date: string;
  userId: string;
  healthMetrics: HealthMetrics[];
  activities: ActivityPattern[];
  conversations: number;
  alerts: EmergencyAlert[];
  overallStatus: 'good' | 'concerning' | 'critical';
  aiSummary: string;
}

// Family Dashboard Types
export interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email?: string;
  notificationPreferences: {
    emergency: boolean;
    daily: boolean;
    weekly: boolean;
  };
}

export interface FamilyDashboard {
  elderId: string;
  elderName: string;
  currentStatus: 'online' | 'offline' | 'emergency';
  lastActivity: Date;
  todaysMetrics: HealthMetrics;
  recentAlerts: Notification[];
  weeklyTrend: {
    date: string;
    overallScore: number;
  }[];
}

// Component Props Types
export interface ChatInterfaceProps {
  userId: string;
  userProfile: UserProfile;
  onNewMessage?: (message: Message) => void;
}

export interface HealthMetricsCardProps {
  metrics: HealthMetrics;
  trend?: 'up' | 'down' | 'stable';
  showDetails?: boolean;
}

export interface NotificationPanelProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onDismiss: (id: string) => void;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ChatApiResponse {
  response: string;
  sentiment: 'positive' | 'neutral' | 'concerned';
  actionRequired: boolean;
  suggestedActions?: string[];
}

// Store Types (for Zustand)
export interface ChatStore {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  sendMessage: (content: string, userProfile: UserProfile) => Promise<void>;
  clearMessages: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export interface HealthStore {
  currentMetrics: HealthMetrics | null;
  history: HealthMetrics[];
  isSimulating: boolean;
  startSimulation: () => void;
  stopSimulation: () => void;
  addMetrics: (metrics: HealthMetrics) => void;
  updateMetrics: (updates: Partial<HealthMetrics>) => void;
}

export interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  markAsRead: (id: string) => void;
  dismissNotification: (id: string) => void;
  clearAll: () => void;
}