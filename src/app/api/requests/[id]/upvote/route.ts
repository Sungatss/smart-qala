import { NextRequest, NextResponse } from 'next/server';
import { upvoteRequest } from '@/lib/mock-data';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(
  _request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const updated = upvoteRequest(id);

    if (!updated) {
      return NextResponse.json(
        { error: `Обращение ${id} не найдено.` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updated
    });
  } catch (error) {
    console.error('Error in upvoting:', error);
    return NextResponse.json(
      { error: 'Ошибка при поддержке обращения.' },
      { status: 500 }
    );
  }
}
