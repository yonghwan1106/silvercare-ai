import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(date: Date): string {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return '--:--';
  }

  return new Intl.DateTimeFormat('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(date);
}

export function formatDate(date: Date): string {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return '날짜 정보 없음';
  }

  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  }).format(date);
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function getHealthStatusColor(value: number, type: 'heartRate' | 'temperature' | 'steps'): string {
  switch (type) {
    case 'heartRate':
      if (value < 60 || value > 100) return 'text-red-500';
      if (value < 70 || value > 90) return 'text-yellow-500';
      return 'text-green-500';

    case 'temperature':
      if (value < 36.0 || value > 37.5) return 'text-red-500';
      if (value < 36.2 || value > 37.2) return 'text-yellow-500';
      return 'text-green-500';

    case 'steps':
      if (value < 2000) return 'text-red-500';
      if (value < 5000) return 'text-yellow-500';
      return 'text-green-500';

    default:
      return 'text-gray-500';
  }
}

export function getSentimentColor(sentiment: 'positive' | 'neutral' | 'concerned'): string {
  switch (sentiment) {
    case 'positive':
      return 'text-green-500';
    case 'concerned':
      return 'text-red-500';
    case 'neutral':
    default:
      return 'text-blue-500';
  }
}

export function generateMockHealthMetrics() {
  return {
    heartRate: Math.floor(Math.random() * 40) + 60, // 60-100
    bloodPressure: `${Math.floor(Math.random() * 40) + 110}/${Math.floor(Math.random() * 20) + 70}`,
    temperature: Math.round((Math.random() * 1.5 + 36.0) * 10) / 10, // 36.0-37.5
    steps: Math.floor(Math.random() * 10000) + 1000,
    sleepHours: Math.round((Math.random() * 3 + 6) * 10) / 10, // 6-9 hours
    medicationTaken: Math.random() > 0.3, // 70% chance of taking medication
    timestamp: new Date(),
  };
}

export function debounce<T extends (...args: never[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}