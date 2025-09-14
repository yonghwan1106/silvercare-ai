'use client';

import React, { useState, useEffect } from 'react';
import { Heart, Phone, Settings, Menu, Bell, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChatInterface } from '@/components/features/ChatInterface';
import { HealthMetrics } from '@/components/features/HealthMetrics';
import { QuickActions } from '@/components/features/QuickActions';
import { NotificationPanel } from '@/components/features/NotificationPanel';
import { DebugTools } from '@/components/ui/debug-tools';
import { DEMO_USER_PROFILE, GREETING_MESSAGES } from '@/data/mockData';
import { useNotificationStore } from '@/stores/notificationStore';
import { useHealthStore } from '@/stores/healthStore';
import { formatDate, cn } from '@/lib/utils';

export default function Home() {
  const [currentView, setCurrentView] = useState<'chat' | 'health' | 'settings' | 'notifications'>('chat');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [greetingMessage, setGreetingMessage] = useState('');

  const { unreadCount } = useNotificationStore();
  const { startSimulation } = useHealthStore();

  useEffect(() => {
    // Set random greeting message
    const randomGreeting = GREETING_MESSAGES[Math.floor(Math.random() * GREETING_MESSAGES.length)];
    setGreetingMessage(randomGreeting);

    // Auto-start health monitoring
    startSimulation();
  }, [startSimulation]);


  const getCurrentTime = () => {
    const now = new Date();
    return new Intl.DateTimeFormat('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(now);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 elderly-friendly">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Title */}
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden"
              >
                <Menu className="h-6 w-6" />
              </Button>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h1 className="text-xl font-bold text-gray-900">실버케어 AI</h1>
                    <span className="px-2 py-1 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-medium rounded-full shadow-sm">
                      AI 라이프 아이디어 챌린지
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 hidden sm:block">스마트 돌봄 서비스</p>
                </div>
              </div>
            </div>

            {/* User Info and Actions */}
            <div className="flex items-center space-x-4">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-gray-900">{DEMO_USER_PROFILE.name}님</p>
                <p className="text-xs text-gray-600">{getCurrentTime()}</p>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className={cn("relative", currentView === 'notifications' && 'bg-gray-100')}
                onClick={() => setCurrentView('notifications')}
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCurrentView('settings')}
                className={currentView === 'settings' ? 'bg-gray-100' : ''}
              >
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
          {/* Sidebar Navigation */}
          <div className={`lg:col-span-3 ${sidebarOpen ? 'block' : 'hidden lg:block'}`}>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-lg">메뉴</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant={currentView === 'chat' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => {
                    setCurrentView('chat');
                    setSidebarOpen(false);
                  }}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  AI 대화
                </Button>
                <Button
                  variant={currentView === 'health' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => {
                    setCurrentView('health');
                    setSidebarOpen(false);
                  }}
                >
                  <Heart className="h-4 w-4 mr-2" />
                  건강 관리
                </Button>
                <Button
                  variant={currentView === 'notifications' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => {
                    setCurrentView('notifications');
                    setSidebarOpen(false);
                  }}
                >
                  <Bell className="h-4 w-4 mr-2" />
                  알림
                  {unreadCount > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </Button>
                <Button
                  variant={currentView === 'settings' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => {
                    setCurrentView('settings');
                    setSidebarOpen(false);
                  }}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  설정
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <QuickActions className="mt-6" />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9">
            {/* Welcome Message */}
            <Card className="mb-4 sm:mb-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white border-none">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-2">
                      {greetingMessage}
                    </h2>
                    <p className="text-blue-100 text-sm sm:text-base">
                      오늘은 {formatDate(new Date())}입니다.
                    </p>
                  </div>
                  <div className="hidden sm:block ml-4">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-full flex items-center justify-center">
                      <Heart className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Content Based on Current View */}
            {currentView === 'chat' && (
              <Card className="h-[70vh] min-h-[500px] max-h-[800px]">
                <ChatInterface userProfile={DEMO_USER_PROFILE} />
              </Card>
            )}

            {currentView === 'health' && (
              <HealthMetrics />
            )}

            {currentView === 'notifications' && (
              <Card>
                <CardHeader>
                  <CardTitle>알림</CardTitle>
                </CardHeader>
                <CardContent>
                  <NotificationPanel />
                </CardContent>
              </Card>
            )}

            {currentView === 'settings' && (
              <Card>
                <CardHeader>
                  <CardTitle>설정</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium text-lg mb-4">사용자 정보</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700">이름</label>
                          <p className="mt-1 text-gray-900">{DEMO_USER_PROFILE.name}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">나이</label>
                          <p className="mt-1 text-gray-900">{DEMO_USER_PROFILE.age}세</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium text-lg mb-4">건강 상태</h3>
                      <div className="flex flex-wrap gap-2">
                        {DEMO_USER_PROFILE.medicalConditions?.map((condition, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                          >
                            {condition}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium text-lg mb-4">응급연락처</h3>
                      <div className="space-y-3">
                        {DEMO_USER_PROFILE.emergencyContacts?.map((contact, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-medium">{contact.name}</p>
                              <p className="text-sm text-gray-600">{contact.relationship}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-gray-700">{contact.phone}</span>
                              <Button variant="outline" size="sm">
                                <Phone className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Debug Tools */}
                    <DebugTools />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}