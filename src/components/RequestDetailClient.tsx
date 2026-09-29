'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CityRequest } from '@/types';
import { StatusBadge, PriorityBadge, DepartmentBadge, ModerationBadge, AnonymousBadge } from '@/components/Badges';
import { useApp } from '@/context/AppContext';
import { 
  MapPin, 
  CheckCircle2, 
  ArrowLeft, 
  ShieldCheck, 
  ChevronRight,
  ThumbsUp,
  Share2,
  Lock,
  Phone,
  Mail,
  Calendar,
  AlertTriangle,
  MessageSquare,
  Send,
  X,
  User,
  Scale
} from 'lucide-react';

interface RequestDetailClientProps {
  initialRequest: CityRequest;
  isCreatedJustNow?: boolean;
}

export default function RequestDetailClient({ initialRequest, isCreatedJustNow }: RequestDetailClientProps) {
  const { role, user, upvote, upvotedIds } = useApp();
  const [request, setRequest] = useState<CityRequest>(initialRequest);
  const [copiedNotice, setCopiedNotice] = useState(false);

  // Appeal modal state (citizen right to appeal/contest)
  const [isAppealOpen, setIsAppealOpen] = useState(false);
  const [appealReason, setAppealReason] = useState('');
  const [isSubmittingAppeal, setIsSubmittingAppeal] = useState(false);
  const [appealSuccessMsg, setAppealSuccessMsg] = useState('');

  const isResolved = request.status === 'resolved';
  const isUpvoted = upvotedIds.has(request.id);
  const isStaff = role === 'employee' || role === 'admin';

  const handleUpvote = async () => {
    const newCount = await upvote(request.id);
    if (newCount !== null) {
      setRequest((prev) => ({ ...prev, upvotes: newCount }));
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedNotice(true);
      setTimeout(() => setCopiedNotice(false), 2500);
    }
  };

  const handleSendAppeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appealReason.trim()) return;

    setIsSubmittingAppeal(true);
    setAppealSuccessMsg('');

    try {
      const payload = {
        add_feedback: {
          author: `Заявитель: ${user.name} (Обжалование)`,
          department: request.department,
          text: `ОБЖАЛОВАНИЕ РЕШЕНИЯ: ${appealReason.trim()}`
        },
        status: 'under_review' as const
      };

      const res = await fetch(`/api/requests/${request.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const json = await res.json();
      if (json.success) {
        setRequest(json.data);
        setAppealSuccessMsg('Ваше обжалование официально зарегистрировано и передано в Ситуационный центр Акимата г. Семей на повторный аудит.');
        setAppealReason('');
        setTimeout(() => setIsAppealOpen(false), 3000);
      }
    } catch (err) {
      console.error('Appeal submission failed:', err);
    } finally {
      setIsSubmittingAppeal(false);
    }
  };

  const lifecycleStages = [
    {
      title: 'Отправлено',
      desc: 'Зарегистрировано в Smart Qala',
      date: new Date(request.created_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
      done: true
    },
    {
      title: 'На рассмотрении',
      desc: 'ИИ-маршрутизация и модерация',
      date: 'Норматив: 2 часа',
      done: request.status !== 'new'
    },
    {
      title: 'В работе',
      desc: `Отдел: ${request.department}`,
      date: request.status === 'in_progress' || request.status === 'resolved' ? 'Бригада на участке' : 'В очереди',
      done: request.status === 'in_progress' || request.status === 'resolved'
    },
    {
      title: 'Решено',
      desc: isResolved ? 'Акт и фото прикреплены' : 'Выполнение работ',
      date: request.resolved_at ? new Date(request.resolved_at).toLocaleDateString('ru-RU') : 'В процессе',
      done: isResolved
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
        <Link href="/" className="hover:text-slate-950 hover:underline">Главная</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <Link href="/map" className="hover:text-slate-950 hover:underline">Карта проблем</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <span className="font-mono text-slate-900 bg-slate-200 px-2 py-0.5 rounded font-extrabold">{request.id}</span>
      </div>

      {/* Success Notification if redirected from create wizard */}
      {isCreatedJustNow && (
        <div className="p-4 bg-emerald-50 border-2 border-emerald-300 rounded-lg text-emerald-950 flex items-start gap-3 shadow-xs">
          <CheckCircle2 className="w-6 h-6 text-emerald-700 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-base font-extrabold">Обращение успешно зарегистрировано в системе г. Семей!</h4>
            <p className="text-sm font-medium text-emerald-900 mt-1">
              Присвоен официальный номер <span className="font-mono font-bold">{request.id}</span>. 
              Заявка автоматически направлена в ведомство {request.department}. Вы можете сохранить ссылку для контроля статуса.
            </p>
          </div>
        </div>
      )}

      {/* Main Card */}
      <div className="bg-white rounded-lg border-2 border-slate-200 shadow-xs overflow-hidden">
        
        {/* Header Bar */}
        <div className="p-6 border-b-2 border-slate-200 bg-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="font-mono text-sm font-extrabold text-slate-900 bg-white border-2 border-slate-300 px-2.5 py-1 rounded">
                {request.id}
              </span>
              <StatusBadge status={request.status} />
              <PriorityBadge priority={request.priority} />
              <DepartmentBadge department={request.department} />
              <AnonymousBadge isAnonymous={request.is_anonymous} />
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {request.title}
            </h1>
          </div>

          {/* Action buttons: Upvote, Appeal & Share */}
          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            <button
              type="button"
              onClick={handleUpvote}
              className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm font-bold rounded-lg border-2 transition-colors cursor-pointer ${
                isUpvoted
                  ? 'bg-blue-50 border-blue-400 text-blue-900'
                  : 'bg-white border-slate-300 text-slate-900 hover:bg-slate-100'
              }`}
            >
              <ThumbsUp className={`w-4 h-4 ${isUpvoted ? 'fill-blue-700 text-blue-700' : 'text-slate-800'}`} />
              <span>{isUpvoted ? 'Подтверждено' : 'У меня такая же проблема'}</span>
              <span className="font-mono font-extrabold bg-slate-200 text-slate-900 px-1.5 py-0.5 rounded ml-0.5 text-xs">
                {request.upvotes || 1}
              </span>
            </button>

            {/* Appeal Button for Citizens */}
            <button
              type="button"
              onClick={() => setIsAppealOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-bold rounded-lg border-2 border-slate-300 bg-white text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Обжаловать некачественное выполнение или несогласие с решением"
            >
              <Scale className="w-4 h-4 text-slate-800" />
              <span>Обжаловать</span>
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="p-2.5 text-slate-800 bg-white border-2 border-slate-300 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              title="Скопировать ссылку"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {copiedNotice && (
          <div className="bg-slate-900 text-white text-xs px-4 py-2 text-center font-bold">
            Ссылка на обращение скопирована в буфер обмена
          </div>
        )}

        {/* Content Details */}
        <div className="p-6 sm:p-8 space-y-6">

          {/* 🔒 CONFIDENTIAL DATA BLOCK (VISIBLE TO ЖКХ & ADMIN ONLY) */}
          {isStaff ? (
            <div className="p-4 rounded-lg bg-blue-50/80 border-2 border-blue-300">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-blue-950 flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-blue-700" />
                  <span>Служебное досье заявителя (Доступно ЖКХ и Акимату)</span>
                </span>
                <span className="text-xs font-mono font-bold text-blue-900 bg-blue-100 px-2 py-0.5 rounded">
                  Конфиденциально
                </span>
              </div>

              {request.is_anonymous ? (
                <div className="p-3 bg-white rounded border border-blue-200 text-xs font-semibold text-slate-800">
                  🔒 Заявитель выбрал режим анонимности. Контакты скрыты в соответствии с законом РК о защите персональных данных.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  <div className="bg-white p-2.5 rounded border border-blue-200">
                    <span className="text-slate-700 block font-semibold">ФИО заявителя:</span>
                    <strong className="text-slate-900 text-sm">{request.author_name || 'Не указано'}</strong>
                  </div>
                  <div className="bg-white p-2.5 rounded border border-blue-200">
                    <span className="text-slate-700 block font-semibold">Телефон:</span>
                    <strong className="text-slate-900 text-sm font-mono">{request.author_phone || '+7 (705) 412-88-99'}</strong>
                  </div>
                  <div className="bg-white p-2.5 rounded border border-blue-200">
                    <span className="text-slate-700 block font-semibold">Email:</span>
                    <strong className="text-slate-900 text-sm font-mono">{request.author_email || 'citizen@semey.kz'}</strong>
                  </div>
                  <div className="bg-white p-2.5 rounded border border-blue-200">
                    <span className="text-slate-700 block font-semibold">Дата регистрации:</span>
                    <strong className="text-slate-900 text-xs font-mono">
                      {new Date(request.created_at).toLocaleString('ru-RU')}
                    </strong>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 flex items-center justify-between">
              <span>Заявитель: <strong>{request.is_anonymous ? 'Анонимный житель города' : (request.author_name || 'Житель г. Семей')}</strong></span>
              <span className="text-slate-600 font-mono">Персональные контакты защищены</span>
            </div>
          )}
          
          {/* Location & Priority */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-lg border-2 border-slate-200 text-sm">
              <span className="font-bold text-slate-800 flex items-center gap-1.5 mb-1">
                <MapPin className="w-4 h-4 text-slate-700" />
                <span>Адрес инцидента:</span>
              </span>
              <p className="text-slate-950 font-bold text-base">{request.location_address}</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg border-2 border-slate-200 text-sm">
              <span className="font-bold text-slate-800 flex items-center gap-1.5 mb-1">
                <ShieldCheck className="w-4 h-4 text-slate-700" />
                <span>Обоснование критичности (ИИ):</span>
              </span>
              <p className="text-slate-950 font-medium">{request.priority_reason}</p>
            </div>
          </div>

          {/* Texts */}
          <div className="space-y-4">
            <div className="p-5 bg-slate-100 rounded-lg border-2 border-slate-300">
              <div className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-1.5">
                Структурированное описание (Протокол ИИ Smart Qala):
              </div>
              <p className="text-slate-950 leading-relaxed text-base font-medium">
                {request.cleaned_text}
              </p>
            </div>

            <div className="p-4 bg-white rounded-lg border-2 border-slate-200">
              <div className="font-bold text-slate-700 text-xs uppercase tracking-wider mb-1">
                Первоначальный текст заявителя:
              </div>
              <p className="text-slate-800 italic text-sm">
                «{request.original_text}»
              </p>
            </div>
          </div>

          {/* Official Feedback Timeline Loop */}
          {request.official_feedback && request.official_feedback.length > 0 && (
            <div className="p-5 rounded-lg bg-indigo-50/60 border-2 border-indigo-200 space-y-3">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-indigo-950 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-indigo-700" />
                <span>Официальные ответы ведомств заявителю</span>
              </h3>

              <div className="space-y-3">
                {request.official_feedback.map((fb) => (
                  <div key={fb.id} className="p-3.5 rounded-lg bg-white border border-indigo-200 text-sm shadow-2xs">
                    <div className="flex items-center justify-between font-bold text-slate-900 mb-1">
                      <span className="text-indigo-950">{fb.author}</span>
                      <span className="font-mono text-xs text-slate-600">
                        {new Date(fb.created_at).toLocaleString('ru-RU')}
                      </span>
                    </div>
                    <p className="text-slate-900 font-medium leading-relaxed">{fb.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Lifecycle Timeline: 4 stages */}
          <div className="pt-4 border-t-2 border-slate-200">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 mb-3">
              Статус заявки в едином контакт-центре 109 г. Семей
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {lifecycleStages.map((stage, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-lg border-2 text-sm flex flex-col justify-between ${
                    stage.done 
                      ? 'bg-slate-900 text-white border-slate-900' 
                      : 'bg-slate-50 text-slate-700 border-slate-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold">{stage.title}</span>
                      {stage.done && <span>✓</span>}
                    </div>
                    <p className={`text-xs mt-1 font-medium ${stage.done ? 'text-slate-200' : 'text-slate-700'}`}>
                      {stage.desc}
                    </p>
                  </div>
                  <div className={`mt-3 pt-1 border-t text-xs font-mono font-bold ${stage.done ? 'border-slate-700 text-slate-300' : 'border-slate-300 text-slate-700'}`}>
                    {stage.date}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Photo Proof Evidence Section */}
          <div className="pt-4 border-t-2 border-slate-200">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 mb-3">
              Фотофиксация объекта (ДО и ПОСЛЕ)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Before Photo */}
              <div>
                <div className="text-sm font-bold text-slate-900 mb-1.5">
                  Фотография до выполнения работ:
                </div>
                <div className="relative rounded-lg overflow-hidden border-2 border-slate-300 aspect-4/3 bg-slate-100">
                  {request.photo_before_url ? (
                    <img
                      src={request.photo_before_url}
                      alt="Состояние до"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-sm font-bold text-slate-600">
                      Фотография не прикреплена
                    </div>
                  )}
                  <span className="absolute top-2 left-2 px-2.5 py-1 text-xs font-extrabold rounded bg-slate-900 text-white shadow-sm">
                    ДО
                  </span>
                </div>
              </div>

              {/* After Photo */}
              <div>
                <div className="text-sm font-bold text-emerald-950 mb-1.5">
                  Фотоотчет о выполнении (Службы города):
                </div>
                <div className="relative rounded-lg overflow-hidden border-2 border-emerald-400 aspect-4/3 bg-slate-100">
                  {request.photo_after_url ? (
                    <img
                      src={request.photo_after_url}
                      alt="Состояние после"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-sm font-medium text-slate-700 p-4 text-center">
                      Работы в процессе исполнения. Фотоотчет появится после закрытия заявки.
                    </div>
                  )}
                  {request.photo_after_url && (
                    <span className="absolute top-2 left-2 px-2.5 py-1 text-xs font-extrabold rounded bg-emerald-700 text-white shadow-sm">
                      ПОСЛЕ
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Resolution Report */}
            {isResolved && request.resolution_report && (
              <div className="mt-4 p-5 bg-emerald-50 rounded-lg border-2 border-emerald-300 text-sm">
                <div className="font-extrabold text-emerald-950 flex items-center gap-2 mb-1.5 text-base">
                  <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                  <span>Официальный акт устранения проблемы:</span>
                </div>
                <p className="text-emerald-950 leading-relaxed font-medium">
                  {request.resolution_report}
                </p>
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="p-5 bg-slate-100 border-t-2 border-slate-200 flex items-center justify-between text-sm">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-slate-900 hover:text-black font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>На главную страницу</span>
          </Link>

          <span className="text-xs font-mono font-bold text-slate-700">
            ДЕМОНСТРАЦИОННЫЕ ДАННЫЕ / СЕМЕЙ
          </span>
        </div>

      </div>

      {/* ========================================================
          CITIZEN APPEAL MODAL (ОБЖАЛОВАНИЕ РЕШЕНИЯ)
          ======================================================== */}
      {isAppealOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-lg border-2 border-slate-300 shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-red-700" />
                <h3 className="text-lg font-extrabold text-slate-900">
                  Обжаловать решение по обращению
                </h3>
              </div>
              <button
                onClick={() => setIsAppealOpen(false)}
                className="p-1.5 text-slate-700 hover:text-slate-950 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {appealSuccessMsg ? (
              <div className="py-6 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="text-base font-extrabold text-slate-900">Жалоба принята в работу</h4>
                <p className="text-sm font-medium text-slate-800">{appealSuccessMsg}</p>
              </div>
            ) : (
              <form onSubmit={handleSendAppeal} className="mt-4 space-y-4">
                <div className="p-3 bg-slate-50 rounded border border-slate-200 text-xs text-slate-800">
                  Обращение: <strong>{request.id}</strong> — {request.title}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide mb-1">
                    Суть претензии или причина несогласия:
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={appealReason}
                    onChange={(e) => setAppealReason(e.target.value)}
                    placeholder="Например: Работы выполнены не полностью, мусор остался на прилегающей территории / яму засыпали гравием вместо асфальта..."
                    className="w-full p-3 text-sm rounded-lg border-2 border-slate-300 font-medium text-slate-900 focus:outline-none focus:border-slate-900"
                  />
                </div>

                <p className="text-xs text-slate-700">
                  Апелляция будет направлена напрямую в аппарат Акима г. Семей для проверки качества работы подрядной организации.
                </p>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAppealOpen(false)}
                    className="px-4 py-2.5 text-sm font-bold text-slate-800 rounded-lg hover:bg-slate-100"
                  >
                    Отмена
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingAppeal || !appealReason.trim()}
                    className="px-5 py-2.5 text-sm font-bold text-white bg-slate-900 rounded-lg hover:bg-slate-800 disabled:opacity-50 cursor-pointer shadow-sm"
                  >
                    {isSubmittingAppeal ? 'Отправка...' : 'Отправить жалобу'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
