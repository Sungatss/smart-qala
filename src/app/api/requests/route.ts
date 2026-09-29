import { NextRequest, NextResponse } from 'next/server';
import { createRequest, getRequests, getRequestStats } from '@/lib/mock-data';
import { Category, PriorityLevel, RequestStatus } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') as Category | null;
    const status = searchParams.get('status') as RequestStatus | null;
    const priority = searchParams.get('priority') as PriorityLevel | null;
    const query = searchParams.get('q')?.toLowerCase() || null;

    let requests = getRequests();

    if (category) {
      requests = requests.filter((r) => r.category === category);
    }
    if (status) {
      requests = requests.filter((r) => r.status === status);
    }
    if (priority) {
      requests = requests.filter((r) => r.priority === priority);
    }
    if (query) {
      requests = requests.filter(
        (r) =>
          r.id.toLowerCase().includes(query) ||
          r.title.toLowerCase().includes(query) ||
          r.location_address.toLowerCase().includes(query) ||
          r.cleaned_text.toLowerCase().includes(query)
      );
    }

    const stats = getRequestStats();

    return NextResponse.json({
      success: true,
      data: requests,
      stats
    });
  } catch (error) {
    console.error('Error in GET /api/requests:', error);
    return NextResponse.json(
      { error: 'Ошибка при получении списка обращений.' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.original_text || !body.location_address) {
      return NextResponse.json(
        { error: 'Поля original_text и location_address обязательны для заполнения.' },
        { status: 400 }
      );
    }

    const created = createRequest(body);

    return NextResponse.json(
      {
        success: true,
        data: created
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in POST /api/requests:', error);
    return NextResponse.json(
      { error: 'Ошибка при создании обращения.' },
      { status: 500 }
    );
  }
}
