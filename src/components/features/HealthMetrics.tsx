'use client';

import React from 'react';
import { Heart, Thermometer, Activity, Moon, Pill, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useHealthStore } from '@/stores/healthStore';
import { formatTime, cn } from '@/lib/utils';
import { HealthChart } from './HealthChart';

interface HealthMetricsProps {
  className?: string;
}

export function HealthMetrics({ className }: HealthMetricsProps) {
  const { currentMetrics, isSimulating, startSimulation, stopSimulation } = useHealthStore();

  const renderMetricCard = (
    icon: React.ReactNode,
    title: string,
    value: string | number,
    unit: string,
    status: 'normal' | 'warning' | 'danger',
    trend?: 'up' | 'down' | 'stable'
  ) => {
    const statusColors = {
      normal: 'text-green-600 bg-green-50 border-green-200',
      warning: 'text-yellow-600 bg-yellow-50 border-yellow-200',
      danger: 'text-red-600 bg-red-50 border-red-200',
    };

    const trendIcons = {
      up: <TrendingUp className="h-4 w-4 text-green-500" />,
      down: <TrendingDown className="h-4 w-4 text-red-500" />,
      stable: <Minus className="h-4 w-4 text-gray-400" />,
    };

    return (
      <Card className={cn('transition-all duration-300 hover:shadow-lg', statusColors[status])}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              {icon}
              <h3 className="font-medium text-sm">{title}</h3>
            </div>
            {trend && trendIcons[trend]}
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl font-bold">{value}</span>
            <span className="text-sm text-gray-600">{unit}</span>
          </div>
        </CardContent>
      </Card>
    );
  };

  const getHeartRateStatus = (heartRate: number): 'normal' | 'warning' | 'danger' => {
    if (heartRate < 60 || heartRate > 100) return 'danger';
    if (heartRate < 70 || heartRate > 90) return 'warning';
    return 'normal';
  };

  const getTemperatureStatus = (temp: number): 'normal' | 'warning' | 'danger' => {
    if (temp < 36.0 || temp > 37.5) return 'danger';
    if (temp < 36.2 || temp > 37.2) return 'warning';
    return 'normal';
  };

  const getStepsStatus = (steps: number): 'normal' | 'warning' | 'danger' => {
    if (steps < 2000) return 'danger';
    if (steps < 5000) return 'warning';
    return 'normal';
  };

  const getSleepStatus = (hours: number): 'normal' | 'warning' | 'danger' => {
    if (hours < 6 || hours > 9) return 'warning';
    return 'normal';
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Control Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>건강 지표 모니터링</span>
            <Button
              onClick={isSimulating ? stopSimulation : startSimulation}
              variant={isSimulating ? 'destructive' : 'eldercare'}
              size="sm"
            >
              {isSimulating ? '모니터링 중지' : '모니터링 시작'}
            </Button>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Current Metrics Display */}
      {currentMetrics ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {renderMetricCard(
              <Heart className="h-5 w-5" />,
              '심박수',
              currentMetrics.heartRate,
              'bpm',
              getHeartRateStatus(currentMetrics.heartRate)
            )}

            {renderMetricCard(
              <Thermometer className="h-5 w-5" />,
              '체온',
              currentMetrics.temperature,
              '°C',
              getTemperatureStatus(currentMetrics.temperature)
            )}

            {renderMetricCard(
              <Activity className="h-5 w-5" />,
              '걸음수',
              currentMetrics.steps.toLocaleString(),
              '걸음',
              getStepsStatus(currentMetrics.steps)
            )}

            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium">BP</span>
                  </div>
                  <h3 className="font-medium text-sm">혈압</h3>
                </div>
                <div className="flex items-baseline space-x-1">
                  <span className="text-2xl font-bold">{currentMetrics.bloodPressure}</span>
                  <span className="text-sm text-gray-600">mmHg</span>
                </div>
              </CardContent>
            </Card>

            {renderMetricCard(
              <Moon className="h-5 w-5" />,
              '수면시간',
              currentMetrics.sleepHours,
              '시간',
              getSleepStatus(currentMetrics.sleepHours)
            )}

            <Card className={cn(
              currentMetrics.medicationTaken
                ? 'bg-green-50 border-green-200 text-green-600'
                : 'bg-red-50 border-red-200 text-red-600'
            )}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Pill className="h-5 w-5" />
                  <h3 className="font-medium text-sm">복약 여부</h3>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold">
                    {currentMetrics.medicationTaken ? '✓' : '✗'}
                  </span>
                  <span className="text-sm">
                    {currentMetrics.medicationTaken ? '복용 완료' : '복용 필요'}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Last Updated */}
          <div className="text-center">
            <p className="text-sm text-gray-500">
              마지막 업데이트: {formatTime(currentMetrics.timestamp)}
            </p>
          </div>
        </>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="font-medium text-lg text-gray-900 mb-2">
              건강 지표 대기 중
            </h3>
            <p className="text-gray-600 mb-4">
              모니터링을 시작하면 실시간 건강 지표를 확인할 수 있습니다.
            </p>
            <Button
              onClick={startSimulation}
              variant="eldercare"
              size="lg"
            >
              모니터링 시작하기
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Health Chart */}
      <HealthChart className="mb-6" />

      {/* Health Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">오늘의 건강 팁</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-sm text-gray-700">
                규칙적인 산책은 심혈관 건강에 도움이 됩니다. 하루 30분 이상 걸어보세요.
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-sm text-gray-700">
                충분한 수분 섭취를 잊지 마세요. 하루 6-8잔의 물을 마시는 것이 좋습니다.
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-sm text-gray-700">
                정해진 시간에 복용하는 약이 있다면 알람을 설정해 두세요.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}