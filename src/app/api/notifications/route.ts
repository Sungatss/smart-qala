import { NextRequest, NextResponse } from 'next/server';
import { getNotifications, markNotificationAsRead } from '@/lib/mock-data';

export async function GET() {
  try {
    const list = getNotifications();
    return NextResponse.json({
      success: true,
      data: list
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { error: 'Ошибка при получении уведомлений.' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { id } = await request.json();
    if (id) {
      markNotificationAsRead(id);
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error marking notification:', error);
    return NextResponse.json(
      { error: 'Ошибка обновления уведомления.' },
      { status: 500 }
    );
  }
}
