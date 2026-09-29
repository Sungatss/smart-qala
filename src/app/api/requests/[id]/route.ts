import { NextRequest, NextResponse } from 'next/server';
import { getRequestById, updateRequestStatus } from '@/lib/mock-data';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(
  _request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const item = getRequestById(id);

    if (!item) {
      return NextResponse.json(
        { error: `Обращение ${id} не найдено.` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: item
    });
  } catch (error) {
    console.error('Error in GET /api/requests/[id]:', error);
    return NextResponse.json(
      { error: 'Ошибка сервера при поиске обращения.' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    const updated = updateRequestStatus(id, body);

    if (!updated) {
      return NextResponse.json(
        { error: `Обращение ${id} не найдено для обновления.` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updated
    });
  } catch (error) {
    console.error('Error in PATCH /api/requests/[id]:', error);
    return NextResponse.json(
      { error: 'Ошибка сервера при обновлении обращения.' },
      { status: 500 }
    );
  }
}
