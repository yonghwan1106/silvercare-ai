'use client';

import React from 'react';
import { Phone, AlertTriangle, Pill, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNotificationStore, createNotification } from '@/stores/notificationStore';

interface QuickActionsProps {
  className?: string;
}

export function QuickActions({ className }: QuickActionsProps) {
  const { addNotification } = useNotificationStore();

  const handleEmergencyCall = () => {
    addNotification(createNotification.emergency(
      '응급 상황 알림',
      '가족과 의료진에게 응급 연락이 발송되었습니다.',
      {
        elderName: '김영희',
        severity: 'critical',
      }
    ));

    // 실제 구현 시에는 여기서 실제 전화 걸기 API를 호출
    if (window.confirm('응급상황입니다. 가족에게 연락하시겠습니까?')) {
      // 전화 걸기 시뮬레이션
      addNotification(createNotification.info(
        '연락 완료',
        '가족에게 연락이 전송되었습니다.'
      ));
    }
  };

  const handleFamilyCall = () => {
    // 가족과 통화 기능
    const contacts = ['김철수 (아들): 010-1234-5678', '박미영 (딸): 010-9876-5432'];
    const selectedContact = contacts[Math.floor(Math.random() * contacts.length)];

    addNotification(createNotification.info(
      '통화 연결',
      `${selectedContact}와 연결을 시도합니다.`
    ));

    // 통화 시뮬레이션
    setTimeout(() => {
      addNotification(createNotification.info(
        '통화 성공',
        '가족과 안전하게 연결되었습니다.'
      ));
    }, 2000);
  };

  const handleMedicationCheck = () => {
    // 복약 확인 기능
    const medications = [
      { name: '고혈압약', taken: Math.random() > 0.5, time: '08:00' },
      { name: '당뇨약', taken: Math.random() > 0.5, time: '12:00' },
      { name: '관절염약', taken: Math.random() > 0.5, time: '20:00' },
    ];

    const pendingMeds = medications.filter(med => !med.taken);

    if (pendingMeds.length > 0) {
      addNotification(createNotification.reminder(
        '복약 알림',
        `${pendingMeds.length}개의 약을 복용해야 합니다: ${pendingMeds.map(m => m.name).join(', ')}`
      ));
    } else {
      addNotification(createNotification.info(
        '복약 완료',
        '오늘의 모든 약을 정시에 복용하셨습니다. 👍'
      ));
    }
  };

  const handleHealthReport = () => {
    // 건강 리포트 생성
    const reportData = {
      period: '지난 7일',
      averageHeartRate: Math.floor(Math.random() * 20) + 70,
      averageSteps: Math.floor(Math.random() * 3000) + 5000,
      sleepQuality: Math.random() > 0.5 ? '양호' : '개선 필요',
      medicationCompliance: Math.floor(Math.random() * 20) + 80,
    };

    addNotification(createNotification.info(
      '건강 리포트 생성',
      `${reportData.period} 건강 리포트가 준비되었습니다.`
    ));

    // 리포트 상세 정보
    setTimeout(() => {
      addNotification(createNotification.info(
        '리포트 상세',
        `평균 심박수: ${reportData.averageHeartRate}bpm, 평균 걸음수: ${reportData.averageSteps}걸음, 복약률: ${reportData.medicationCompliance}%`
      ));
    }, 1500);
  };

  const quickActions = [
    {
      id: 'emergency-call',
      title: '응급 연락',
      description: '응급상황 시 가족 또는 병원에 즉시 연락',
      icon: <AlertTriangle className="h-6 w-6" />,
      color: 'bg-red-500 hover:bg-red-600',
      action: handleEmergencyCall,
    },
    {
      id: 'family-call',
      title: '가족과 통화',
      description: '자녀에게 안부 전화하기',
      icon: <Phone className="h-6 w-6" />,
      color: 'bg-blue-500 hover:bg-blue-600',
      action: handleFamilyCall,
    },
    {
      id: 'medication-reminder',
      title: '복약 확인',
      description: '오늘의 복약 일정 확인하기',
      icon: <Pill className="h-6 w-6" />,
      color: 'bg-green-500 hover:bg-green-600',
      action: handleMedicationCheck,
    },
    {
      id: 'health-report',
      title: '건강 리포트',
      description: '주간 건강 상태 리포트 보기',
      icon: <BarChart3 className="h-6 w-6" />,
      color: 'bg-purple-500 hover:bg-purple-600',
      action: handleHealthReport,
    },
  ];

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg flex items-center space-x-2">
          <span>⚡</span>
          <span>빠른 실행</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action) => (
            <Button
              key={action.id}
              variant="outline"
              size="lg"
              className={`h-20 flex-col space-y-2 ${action.color} text-white border-none transition-all duration-200 transform hover:scale-105 active:scale-95`}
              onClick={action.action}
            >
              {action.icon}
              <span className="text-sm font-medium text-center leading-tight">
                {action.title}
              </span>
            </Button>
          ))}
        </div>

        <div className="mt-4 text-xs text-gray-500 text-center">
          버튼을 클릭하여 각 기능을 실행할 수 있습니다
        </div>
      </CardContent>
    </Card>
  );
}