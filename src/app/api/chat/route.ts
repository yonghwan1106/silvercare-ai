import { NextRequest, NextResponse } from 'next/server';
import { ClaudeAPI, type ChatRequest } from '@/lib/claude';

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.CLAUDE_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Claude API key not configured' },
        { status: 500 }
      );
    }

    const body: ChatRequest = await request.json();

    if (!body.message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const claudeAPI = new ClaudeAPI(apiKey);
    const response = await claudeAPI.sendMessage(body);

    return NextResponse.json(response);
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { message: 'Chat API is running' },
    { status: 200 }
  );
}