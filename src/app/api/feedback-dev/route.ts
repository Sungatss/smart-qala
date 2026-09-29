import { NextRequest, NextResponse } from 'next/server';
import { getDeveloperFeedbacks, addDeveloperFeedback } from '@/lib/mock-data';

export async function GET() {
  try {
    const list = getDeveloperFeedbacks();
    return NextResponse.json({
      success: true,
      data: list
    });
  } catch (error) {
    console.error('Error fetching developer feedback:', error);
    return NextResponse.json(
      { error: 'Не удалось получить фидбэк разработчиков' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sender_name, sender_email, sender_role, topic, message } = body;

    if (!topic || !message) {
      return NextResponse.json(
        { error: 'Тема и сообщение обязательны для заполнения' },
        { status: 400 }
      );
    }

    const created = addDeveloperFeedback({
      sender_name: sender_name || 'Сотрудник Акимата',
      sender_email: sender_email || 'dev@smartqala.kz',
      sender_role: sender_role || 'admin',
      topic: String(topic).trim(),
      message: String(message).trim()
    });

    return NextResponse.json({
      success: true,
      data: created
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating developer feedback:', error);
    return NextResponse.json(
      { error: 'Ошибка сервера при отправке сообщения разработчикам' },
      { status: 500 }
    );
  }
}
