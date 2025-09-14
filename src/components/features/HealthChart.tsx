'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface HealthChartProps {
  className?: string;
}

// 모의 데이터 생성
const generateHealthData = () => {
  const data = [];
  const now = new Date();

  for (let i = 6; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    data.push({
      date: date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' }),
      heartRate: Math.floor(Math.random() * 20) + 70,
      steps: Math.floor(Math.random() * 3000) + 4000,
      temperature: Math.round((Math.random() * 1 + 36.2) * 10) / 10,
      sleep: Math.round((Math.random() * 2 + 7) * 10) / 10,
    });
  }

  return data;
};

const healthData = generateHealthData();

export function HealthChart({ className }: HealthChartProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>주간 건강 트렌드</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* 심박수 차트 */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">심박수 (bpm)</h4>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={healthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="date"
                  stroke="#6b7280"
                  fontSize={12}
                />
                <YAxis
                  stroke="#6b7280"
                  fontSize={12}
                  domain={[60, 100]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#f9fafb',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="heartRate"
                  stroke="#ef4444"
                  strokeWidth={3}
                  dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#dc2626' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* 걸음수 차트 */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">일일 걸음수</h4>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={healthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="date"
                  stroke="#6b7280"
                  fontSize={12}
                />
                <YAxis
                  stroke="#6b7280"
                  fontSize={12}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#f9fafb',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="steps"
                  stroke="#22c55e"
                  strokeWidth={3}
                  dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#16a34a' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* 수면 시간 차트 */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">수면 시간 (시간)</h4>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={healthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="date"
                  stroke="#6b7280"
                  fontSize={12}
                />
                <YAxis
                  stroke="#6b7280"
                  fontSize={12}
                  domain={[6, 10]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#f9fafb',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="sleep"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#7c3aed' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}