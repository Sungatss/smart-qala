import { NextRequest, NextResponse } from 'next/server';
import { analyzeRequest } from '@/lib/ai-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, location } = body;

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return NextResponse.json(
        { error: 'Текст обращения обязателен для анализа.' },
        { status: 400 }
      );
    }

    const result = await analyzeRequest(text.trim(), location?.trim());

    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error in /api/ai:', error);
    return NextResponse.json(
      { error: 'Не удалось обработать обращение. Попробуйте еще раз.' },
      { status: 500 }
    );
  }
}
