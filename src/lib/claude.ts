import { z } from 'zod';

const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface UserProfile {
  name: string;
  age: number;
  medicalConditions?: string[];
  emergencyContacts?: {
    name: string;
    phone: string;
    relationship: string;
  }[];
}

export interface ChatRequest {
  message: string;
  conversationHistory: Message[];
  userProfile?: UserProfile;
}

export interface ChatResponse {
  response: string;
  sentiment: 'positive' | 'neutral' | 'concerned';
  actionRequired: boolean;
  suggestedActions?: string[];
}

const ChatRequestSchema = z.object({
  message: z.string(),
  conversationHistory: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string()
  })),
  userProfile: z.object({
    name: z.string(),
    age: z.number(),
    medicalConditions: z.array(z.string()).optional(),
    emergencyContacts: z.array(z.object({
      name: z.string(),
      phone: z.string(),
      relationship: z.string()
    })).optional()
  }).optional()
});

const ELDERCARE_SYSTEM_PROMPT = `당신은 "실버메이트"라는 이름의 한국어 AI 케어봇입니다.
독거노인을 돌보는 따뜻하고 친근한 말투로 대화해주세요.

핵심 원칙:
- 항상 존댓말을 사용하며 "어르신"이라고 호칭
- 건강, 안전, 정서적 케어에 중점을 둠
- 간단하고 이해하기 쉬운 문장으로 대화
- 필요시 가족이나 의료진 연락을 제안
- 응급상황 감지 시 즉시 알림 안내

응답 시 다음 사항을 고려하세요:
1. 사용자의 감정 상태를 파악하고 적절히 응답
2. 건강 관련 우려사항이 있으면 전문가 상담 권유
3. 일상 대화를 통해 정서적 지지 제공
4. 규칙적인 생활 습관 유지를 격려

응답은 자연스럽고 따뜻하게 해주세요.`;

export class ClaudeAPI {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    try {
      const validatedRequest = ChatRequestSchema.parse(request);

      const messages = [
        ...validatedRequest.conversationHistory.slice(-10), // Keep last 10 messages for context
        { role: 'user' as const, content: validatedRequest.message }
      ];

      const systemPrompt = this.buildSystemPrompt(validatedRequest.userProfile);

      const response = await fetch(CLAUDE_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 1000,
          messages: messages,
          system: systemPrompt,
        }),
      });

      if (!response.ok) {
        throw new Error(`Claude API error: ${response.status}`);
      }

      const data = await response.json();
      const assistantMessage = data.content[0]?.text || '죄송합니다. 응답을 생성할 수 없습니다.';

      return {
        response: assistantMessage,
        sentiment: this.analyzeSentiment(validatedRequest.message),
        actionRequired: this.checkActionRequired(assistantMessage),
        suggestedActions: this.generateSuggestedActions(validatedRequest.message)
      };
    } catch (error) {
      console.error('Claude API Error:', error);
      return {
        response: '죄송합니다. 일시적인 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
        sentiment: 'neutral',
        actionRequired: false,
        suggestedActions: []
      };
    }
  }

  private buildSystemPrompt(userProfile?: UserProfile): string {
    let prompt = ELDERCARE_SYSTEM_PROMPT;

    if (userProfile) {
      prompt += `\n\n사용자 정보:
- 이름: ${userProfile.name}
- 나이: ${userProfile.age}세`;

      if (userProfile.medicalConditions?.length) {
        prompt += `\n- 건강 상태: ${userProfile.medicalConditions.join(', ')}`;
      }

      if (userProfile.emergencyContacts?.length) {
        prompt += `\n- 응급연락처: ${userProfile.emergencyContacts.map(c => `${c.name}(${c.relationship})`).join(', ')}`;
      }
    }

    return prompt;
  }

  private analyzeSentiment(message: string): 'positive' | 'neutral' | 'concerned' {
    const concernedKeywords = ['아프', '힘들', '외로', '슬프', '걱정', '무서', '답답', '괴로'];
    const positiveKeywords = ['좋', '행복', '기쁘', '즐거', '고마', '사랑', '웃'];

    const lowerMessage = message.toLowerCase();

    if (concernedKeywords.some(keyword => lowerMessage.includes(keyword))) {
      return 'concerned';
    }

    if (positiveKeywords.some(keyword => lowerMessage.includes(keyword))) {
      return 'positive';
    }

    return 'neutral';
  }

  private checkActionRequired(response: string): boolean {
    const actionKeywords = ['연락', '병원', '119', '응급', '도움'];
    return actionKeywords.some(keyword => response.includes(keyword));
  }

  private generateSuggestedActions(message: string): string[] {
    const actions: string[] = [];
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('아프') || lowerMessage.includes('몸이')) {
      actions.push('가족에게 연락하기', '병원 예약하기');
    }

    if (lowerMessage.includes('외로') || lowerMessage.includes('심심')) {
      actions.push('가족과 통화하기', '산책하기', '이웃과 인사하기');
    }

    if (lowerMessage.includes('약') || lowerMessage.includes('복용')) {
      actions.push('복용 기록 확인하기', '약국에 문의하기');
    }

    return actions;
  }
}