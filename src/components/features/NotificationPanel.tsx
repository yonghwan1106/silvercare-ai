'use client';

import React from 'react';
import { X, AlertTriangle, Info, Clock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNotificationStore } from '@/stores/notificationStore';
import { cn, formatTime } from '@/lib/utils';

interface NotificationPanelProps {
  className?: string;
}

export function NotificationPanel({ className }: NotificationPanelProps) {
  const { notifications, markAsRead, dismissNotification } = useNotificationStore();

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'emergency':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
      case 'reminder':
        return <Clock className="h-5 w-5 text-purple-500" />;
      default:
        return <Info className="h-5 w-5 text-gray-500" />;
    }
  };

  const getNotificationStyle = (type: string) => {
    switch (type) {
      case 'emergency':
        return 'border-l-red-500 bg-red-50';
      case 'warning':
        return 'border-l-yellow-500 bg-yellow-50';
      case 'info':
        return 'border-l-blue-500 bg-blue-50';
      case 'reminder':
        return 'border-l-purple-500 bg-purple-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  if (notifications.length === 0) {
    return (
      <div className={cn('space-y-4', className)}>
        <div className="text-center py-8">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <p className="text-gray-500">새로운 알림이 없습니다</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('space-y-3', className)}>
      {notifications.slice(0, 10).map((notification) => (
        <Card
          key={notification.id}
          className={cn(
            'border-l-4 transition-all duration-200 hover:shadow-md',
            getNotificationStyle(notification.type),
            !notification.read && 'ring-2 ring-blue-100'
          )}
        >
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-1">
                {getNotificationIcon(notification.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className={cn(
                      'text-sm font-medium',
                      !notification.read && 'font-semibold'
                    )}>
                      {notification.title}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      {formatTime(notification.timestamp)}
                    </p>
                  </div>

                  <div className="flex items-center space-x-1 ml-2">
                    {!notification.read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => markAsRead(notification.id)}
                        title="읽음으로 표시"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                    )}

                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => dismissNotification(notification.id)}
                      title="알림 삭제"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {notification.actionRequired && (
                  <div className="mt-3 flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={() => {
                        // Handle action
                        markAsRead(notification.id);
                      }}
                    >
                      조치하기
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {notifications.length > 10 && (
        <div className="text-center py-2">
          <p className="text-sm text-gray-500">
            + {notifications.length - 10}개의 알림이 더 있습니다
          </p>
        </div>
      )}
    </div>
  );
}