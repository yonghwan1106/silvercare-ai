'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function DebugTools() {
  const clearAllData = () => {
    if (typeof window !== 'undefined') {
      // Clear localStorage
      localStorage.clear();

      // Clear sessionStorage
      sessionStorage.clear();

      // Reload the page to reinitialize stores
      window.location.reload();
    }
  };

  const clearChatData = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('silvercare-chat-store');
      window.location.reload();
    }
  };

  const clearHealthData = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('silvercare-health-store');
      window.location.reload();
    }
  };

  const clearNotificationData = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('silvercare-notification-store');
      window.location.reload();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg text-orange-600">🛠️ 개발 도구</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={clearChatData}
            className="text-xs"
          >
            채팅 데이터 초기화
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={clearHealthData}
            className="text-xs"
          >
            건강 데이터 초기화
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={clearNotificationData}
            className="text-xs"
          >
            알림 데이터 초기화
          </Button>

          <Button
            variant="destructive"
            size="sm"
            onClick={clearAllData}
            className="text-xs"
          >
            모든 데이터 초기화
          </Button>
        </div>

        <div className="text-xs text-gray-500 mt-2">
          💡 Date 에러가 발생하면 "모든 데이터 초기화"를 눌러보세요.
        </div>
      </CardContent>
    </Card>
  );
}