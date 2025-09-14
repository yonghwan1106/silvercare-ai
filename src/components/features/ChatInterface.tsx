'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useChatStore } from '@/stores/chatStore';
import { UserProfile } from '@/types';
import { cn, formatTime, getSentimentColor } from '@/lib/utils';

interface ChatInterfaceProps {
  userProfile: UserProfile;
}

export function ChatInterface({ userProfile }: ChatInterfaceProps) {
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { messages, isLoading, error, sendMessage } = useChatStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const message = inputValue.trim();
    setInputValue('');

    try {
      await sendMessage(message, userProfile);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('음성 인식이 지원되지 않는 브라우저입니다.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      // Stop voice recognition logic here
      return;
    }

    setIsListening(true);

    // Basic speech recognition setup
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = 'ko-KR';
    recognition.continuous = false;
    recognition.interimResults = false;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputValue(transcript);
      setIsListening(false);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      {/* Chat Header */}
      <div className="flex-shrink-0 p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white font-medium text-sm">AI</span>
          </div>
          <div>
            <h2 className="font-semibold text-lg text-gray-900">실버메이트</h2>
            <p className="text-sm text-gray-600">
              {userProfile.name}님의 AI 케어봇
            </p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">👋</span>
            </div>
            <h3 className="font-medium text-lg text-gray-900 mb-2">
              안녕하세요, {userProfile.name}님!
            </h3>
            <p className="text-gray-600">
              무엇이든 편하게 말씀해 주세요. 제가 도와드리겠습니다.
            </p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              'flex',
              message.role === 'user' ? 'justify-end' : 'justify-start'
            )}
          >
            <Card
              className={cn(
                'max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl',
                message.role === 'user'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white border-none'
                  : 'bg-white/95 backdrop-blur-sm'
              )}
            >
              <CardContent className="p-4">
                <div className="space-y-2">
                  <p className={cn(
                    'text-sm leading-relaxed',
                    message.role === 'user' ? 'text-white' : 'text-gray-900'
                  )}>
                    {message.content}
                  </p>

                  <div className="flex items-center justify-between text-xs">
                    <span className={cn(
                      message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                    )}>
                      {formatTime(message.timestamp)}
                    </span>

                    {message.role === 'assistant' && message.sentiment && (
                      <span className={getSentimentColor(message.sentiment)}>
                        {message.sentiment === 'positive' && '😊'}
                        {message.sentiment === 'neutral' && '😐'}
                        {message.sentiment === 'concerned' && '😟'}
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <Card className="max-w-xs bg-white/95 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-sm text-gray-600">답변을 준비 중입니다...</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {error && (
          <div className="flex justify-center">
            <Card className="max-w-md bg-red-50 border-red-200">
              <CardContent className="p-4">
                <p className="text-sm text-red-600 text-center">{error}</p>
              </CardContent>
            </Card>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="flex-shrink-0 p-4 bg-gray-50 border-t border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="flex-1 relative">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="메시지를 입력하세요..."
              disabled={isLoading}
              className="pr-12 text-base h-14"
            />

            <Button
              type="button"
              variant="ghost"
              size="icon"
              className={cn(
                'absolute right-2 top-1/2 transform -translate-y-1/2',
                isListening && 'text-red-500'
              )}
              onClick={toggleVoiceInput}
              disabled={isLoading}
            >
              {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </Button>
          </div>

          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            variant="eldercare"
            size="icon"
            className="h-14 w-14"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// Add speech recognition types to window
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}