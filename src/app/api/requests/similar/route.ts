import { NextRequest, NextResponse } from 'next/server';
import { findSimilarRequests } from '@/lib/mock-data';

export async function POST(request: NextRequest) {
  try {
    const { text, address } = await request.json();

    if (!text) {
      return NextResponse.json({ success: true, data: [] });
    }

    const similar = findSimilarRequests(text, address);

    return NextResponse.json({
      success: true,
      data: similar
    });
  } catch (error) {
    console.error('Error finding similar requests:', error);
    return NextResponse.json(
      { error: 'Ошибка проверки дубликатов.' },
      { status: 500 }
    );
  }
}
