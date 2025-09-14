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
    // 즉시 응급 상황 알림 생성
    addNotification(createNotification.emergency(
      '🚨 응급 상황 발생',
      '응급상황이 감지되었습니다. 즉시 대응 중입니다.',
      {
        elderName: '김영희',
        severity: 'critical',
        location: '서울시 강남구 자택',
        timestamp: new Date().toISOString()
      }
    ));

    // 연락 확인 다이얼로그
    const shouldCall = window.confirm('🚨 응급상황이 발생했습니다!\n\n가족 및 응급서비스에 즉시 연락하시겠습니까?\n\n- 119 응급실\n- 가족 연락처\n- 담당 의료진');

    if (shouldCall) {
      // 단계별 연락 시뮬레이션
      addNotification(createNotification.warning(
        '📞 119 신고 접수',
        '119에 신고가 접수되었습니다. 구급차가 출동 중입니다.'
      ));

      setTimeout(() => {
        addNotification(createNotification.info(
          '👨‍👩‍👧‍👦 가족 연락 완료',
          '김철수(아들), 박미영(딸)에게 응급상황이 전달되었습니다.'
        ));
      }, 2000);

      setTimeout(() => {
        addNotification(createNotification.info(
          '🏥 병원 연락 완료',
          '담당 의료진에게 상황이 전달되어 응급실에서 대기 중입니다.'
        ));
      }, 4000);

      setTimeout(() => {
        addNotification(createNotification.info(
          '✅ 응급 대응 완료',
          '모든 응급 연락이 완료되었습니다. 구급차 도착 예정시간: 약 5분'
        ));
      }, 6000);
    }
  };

  const handleFamilyCall = () => {
    const contacts = [
      { name: '김철수', relation: '아들', phone: '010-1234-5678' },
      { name: '박미영', relation: '딸', phone: '010-9876-5432' },
      { name: '이순자', relation: '며느리', phone: '010-5555-1234' }
    ];

    // 연락할 가족 선택 다이얼로그
    const contactList = contacts.map((c, i) => `${i + 1}. ${c.name}(${c.relation}) - ${c.phone}`).join('\n');
    const choice = window.prompt(`📞 누구에게 전화를 걸까요?\n\n${contactList}\n\n번호를 입력하세요 (1-${contacts.length}):`);

    if (choice && choice >= '1' && choice <= contacts.length.toString()) {
      const selectedContact = contacts[parseInt(choice) - 1];

      // 통화 연결 시뮬레이션
      addNotification(createNotification.info(
        '📞 전화 연결 중',
        `${selectedContact.name}(${selectedContact.relation})님에게 전화를 걸고 있습니다...`
      ));

      // 연결음 시뮬레이션
      setTimeout(() => {
        addNotification(createNotification.info(
          '🔔 연결음',
          '따르릉~ 따르릉~ 연결 중입니다...'
        ));
      }, 1500);

      // 통화 연결 성공
      setTimeout(() => {
        addNotification(createNotification.info(
          '✅ 통화 연결 완료',
          `${selectedContact.name}님과 통화가 연결되었습니다. "안녕하세요, 어르신! 오늘 기분은 어떠세요?"`
        ));
      }, 3000);

      // 통화 종료
      setTimeout(() => {
        addNotification(createNotification.info(
          '📱 통화 종료',
          `${selectedContact.name}님과의 즐거운 통화가 종료되었습니다. 통화시간: 5분 30초`
        ));
      }, 8000);
    } else if (choice !== null) {
      addNotification(createNotification.warning(
        '❌ 잘못된 선택',
        '올바른 번호를 선택해주세요.'
      ));
    }
  };

  const handleMedicationCheck = () => {
    const currentTime = new Date();
    const currentHour = currentTime.getHours();

    // 현재 시간에 따른 복약 상태 시뮬레이션
    const medications = [
      {
        name: '고혈압약 (암로디핀)',
        taken: currentHour >= 8,
        time: '08:00',
        dosage: '5mg',
        sideEffects: '어지러움 주의'
      },
      {
        name: '당뇨약 (메트포르민)',
        taken: currentHour >= 12,
        time: '12:00',
        dosage: '500mg',
        sideEffects: '식사 후 복용'
      },
      {
        name: '관절염약 (이부프로펜)',
        taken: currentHour >= 20,
        time: '20:00',
        dosage: '200mg',
        sideEffects: '위장 보호제와 함께'
      },
    ];

    addNotification(createNotification.info(
      '💊 복약 상태 확인 중',
      '오늘의 복약 일정을 확인하고 있습니다...'
    ));

    setTimeout(() => {
      const takenMeds = medications.filter(med => med.taken);
      const pendingMeds = medications.filter(med => !med.taken);

      if (pendingMeds.length > 0) {
        // 복용하지 않은 약이 있는 경우
        const medList = pendingMeds.map(m => `• ${m.name} (${m.time}, ${m.dosage})`).join('\n');

        addNotification(createNotification.reminder(
          '⏰ 복약 알림',
          `${pendingMeds.length}개의 약을 복용해야 합니다:\n${medList}`
        ));

        // 복약 확인 다이얼로그
        const shouldTakeMed = window.confirm(`💊 복용해야 할 약이 있습니다!\n\n${medList}\n\n지금 복용하시겠습니까?`);

        if (shouldTakeMed) {
          addNotification(createNotification.info(
            '✅ 복약 완료',
            `${pendingMeds[0].name}을 복용하셨습니다. 다음 복용 시간을 잊지 마세요!`
          ));

          setTimeout(() => {
            addNotification(createNotification.info(
              '📋 복약 기록 저장',
              '복약 기록이 건강 일지에 자동으로 저장되었습니다.'
            ));
          }, 2000);
        }
      } else {
        // 모든 약을 복용한 경우
        addNotification(createNotification.info(
          '🎉 복약 완료',
          `오늘의 모든 약을 정시에 복용하셨습니다!\n복용 완료: ${takenMeds.length}개`
        ));
      }

      // 복약 통계 표시
      setTimeout(() => {
        const compliance = Math.round((takenMeds.length / medications.length) * 100);
        addNotification(createNotification.info(
          '📊 이번 주 복약률',
          `복약 준수율: ${compliance}% (평균보다 ${compliance > 85 ? '우수' : '개선 필요'})`
        ));
      }, 4000);
    }, 2000);
  };

  const handleHealthReport = () => {
    // 실시간 건강 데이터 수집
    addNotification(createNotification.info(
      '📊 건강 리포트 생성 중',
      '최근 7일간의 건강 데이터를 분석하고 있습니다...'
    ));

    setTimeout(() => {
      const reportData = {
        period: '지난 7일',
        averageHeartRate: Math.floor(Math.random() * 15) + 72,
        averageSteps: Math.floor(Math.random() * 2000) + 6000,
        sleepQuality: Math.random() > 0.6 ? '양호' : '개선 필요',
        medicationCompliance: Math.floor(Math.random() * 15) + 85,
        bloodPressure: `${120 + Math.floor(Math.random() * 20)}/${75 + Math.floor(Math.random() * 15)}`,
        weight: 65 + Math.floor(Math.random() * 5),
        mood: ['좋음', '보통', '피곤'][Math.floor(Math.random() * 3)]
      };

      // 종합 건강 상태 평가
      const healthScore = Math.round(
        (reportData.averageHeartRate <= 85 ? 25 : 15) +
        (reportData.averageSteps >= 6000 ? 25 : 15) +
        (reportData.sleepQuality === '양호' ? 25 : 15) +
        (reportData.medicationCompliance >= 90 ? 25 : 15)
      );

      addNotification(createNotification.info(
        '📈 주간 건강 리포트',
        `종합 건강점수: ${healthScore}/100점 (${healthScore >= 80 ? '우수' : healthScore >= 60 ? '양호' : '주의'})`
      ));

      // 상세 리포트 표시
      setTimeout(() => {
        addNotification(createNotification.info(
          '❤️ 심혈관 건강',
          `평균 심박수: ${reportData.averageHeartRate}bpm, 혈압: ${reportData.bloodPressure}mmHg (${reportData.averageHeartRate <= 85 ? '정상' : '주의'})`
        ));
      }, 2000);

      setTimeout(() => {
        addNotification(createNotification.info(
          '🚶‍♂️ 활동량 분석',
          `일평균 걸음수: ${reportData.averageSteps.toLocaleString()}걸음 (목표 8,000걸음의 ${Math.round(reportData.averageSteps/80)}%)`
        ));
      }, 4000);

      setTimeout(() => {
        addNotification(createNotification.info(
          '😴 수면 & 복약',
          `수면 질: ${reportData.sleepQuality}, 복약률: ${reportData.medicationCompliance}%, 기분: ${reportData.mood}`
        ));
      }, 6000);

      // 건강 개선 제안
      setTimeout(() => {
        const suggestions = [];
        if (reportData.averageSteps < 8000) suggestions.push('일일 산책 시간 늘리기');
        if (reportData.sleepQuality === '개선 필요') suggestions.push('규칙적인 수면 습관');
        if (reportData.medicationCompliance < 90) suggestions.push('복약 알림 설정');

        if (suggestions.length > 0) {
          addNotification(createNotification.reminder(
            '💡 건강 개선 제안',
            `이번 주 개선 포인트:\n• ${suggestions.join('\n• ')}`
          ));
        } else {
          addNotification(createNotification.info(
            '🎉 훌륭한 건강 관리',
            '모든 건강 지표가 우수합니다! 현재 생활 패턴을 유지하세요.'
          ));
        }
      }, 8000);

      // PDF 리포트 생성 시뮬레이션
      setTimeout(() => {
        addNotification(createNotification.info(
          '📄 리포트 저장 완료',
          '상세 건강 리포트가 PDF로 저장되었습니다. 가족과 의료진에게 공유 가능합니다.'
        ));
      }, 10000);
    }, 3000);
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
          <div className="w-6 h-6 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs">⚡</span>
          </div>
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