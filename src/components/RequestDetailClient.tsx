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
        setAppealSuccessMsg('Ваше обжалование официально зарегистрировано и передано в Ситуационный центр Администрации г. Семей на повторный аудит.');
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
      <div className="flex items-center gap-2 text-xs font-bold text-foreground">
        <Link href="/" className="hover:text-foreground/80 hover:underline">Главная</Link>
        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
        <Link href="/map" className="hover:text-foreground/80 hover:underline">Карта проблем</Link>
        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
        <span className="text-foreground bg-muted px-2 py-0.5 rounded font-extrabold border border-border">{request.id}</span>
      </div>

      {/* Success Notification if redirected from create wizard */}
      {isCreatedJustNow && (
        <div className="p-4 bg-success-soft border-2 border-success-soft rounded-lg text-success-soft-foreground flex items-start gap-3 shadow-xs">
          <CheckCircle2 className="w-6 h-6 text-success shrink-0 mt-0.5" />
          <div>
            <h4 className="text-base font-extrabold">Обращение успешно зарегистрировано в системе г. Семей!</h4>
            <p className="text-sm font-medium text-success-soft-foreground mt-1">
              Присвоен официальный номер <span className="font-bold">{request.id}</span>. 
              Заявка автоматически направлена в ведомство {request.department}. Вы можете сохранить ссылку для контроля статуса.
            </p>
          </div>
        </div>
      )}

      {/* Main Card */}
      <div className="bg-card rounded-lg border-2 border-border shadow-xs overflow-hidden">
        
        {/* Header Bar */}
        <div className="p-6 border-b-2 border-border bg-muted flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="text-sm font-extrabold text-foreground bg-card border-2 border-border px-2.5 py-1 rounded">
                {request.id}
              </span>
              <StatusBadge status={request.status} />
              <PriorityBadge priority={request.priority} />
              <DepartmentBadge department={request.department} />
              <AnonymousBadge isAnonymous={request.is_anonymous} />
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
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
                  ? 'bg-info-soft border-info-soft text-info-soft-foreground'
                  : 'bg-card border-border text-foreground hover:bg-muted'
              }`}
            >
              <ThumbsUp className={`w-4 h-4 ${isUpvoted ? 'fill-info text-info' : 'text-foreground'}`} />
              <span>{isUpvoted ? 'Подтверждено' : 'У меня такая же проблема'}</span>
              <span className="font-extrabold bg-muted text-foreground px-1.5 py-0.5 rounded ml-0.5 text-xs border border-border">
                {request.upvotes || 1}
              </span>
            </button>

            {/* Appeal Button for Citizens */}
            <button
              type="button"
              onClick={() => setIsAppealOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-bold rounded-lg border-2 border-border bg-card text-foreground hover:bg-muted transition-colors cursor-pointer"
              title="Обжаловать некачественное выполнение или несогласие с решением"
            >
              <Scale className="w-4 h-4 text-foreground" />
              <span>Обжаловать</span>
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="p-2.5 text-foreground bg-card border-2 border-border rounded-lg hover:bg-muted transition-colors cursor-pointer"
              title="Скопировать ссылку"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {copiedNotice && (
          <div className="bg-primary text-primary-foreground text-xs px-4 py-2 text-center font-bold">
            Ссылка на обращение скопирована в буфер обмена
          </div>
        )}

        {/* Content Details */}
        <div className="p-6 sm:p-8 space-y-6">

          {/* 🔒 CONFIDENTIAL DATA BLOCK (VISIBLE TO ЖКХ & ADMIN ONLY) */}
          {isStaff ? (
            <div className="p-4 rounded-lg bg-info-soft/80 border-2 border-info-soft">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-info-soft-foreground flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-blue-700" />
                  <span>Служебное досье заявителя (Доступно госслужбам и Администрации)</span>
                </span>
                <span className="text-xs font-mono font-bold text-info-soft-foreground bg-blue-100 px-2 py-0.5 rounded">
                  Конфиденциально
                </span>
              </div>

              {request.is_anonymous ? (
                <div className="p-3 bg-card rounded border border-info-soft text-xs font-semibold text-foreground">
                  🔒 Заявитель выбрал режим анонимности. Контакты скрыты в соответствии с законом РК о защите персональных данных.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  <div className="bg-card p-2.5 rounded border border-info-soft">
                    <span className="text-muted-foreground block font-semibold">ФИО заявителя:</span>
                    <strong className="text-foreground text-sm">{request.author_name || 'Не указано'}</strong>
                  </div>
                  <div className="bg-card p-2.5 rounded border border-info-soft">
                    <span className="text-muted-foreground block font-semibold">Телефон:</span>
                    <strong className="text-foreground text-sm font-mono">{request.author_phone || '+7 (705) 412-88-99'}</strong>
                  </div>
                  <div className="bg-card p-2.5 rounded border border-info-soft">
                    <span className="text-muted-foreground block font-semibold">Email:</span>
                    <strong className="text-foreground text-sm font-mono">{request.author_email || 'citizen@semey.kz'}</strong>
                  </div>
                  <div className="bg-card p-2.5 rounded border border-info-soft">
                    <span className="text-muted-foreground block font-semibold">Дата регистрации:</span>
                    <strong className="text-foreground text-xs font-mono">
                      {new Date(request.created_at).toLocaleString('ru-RU')}
                    </strong>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-3.5 bg-muted rounded-lg border border-border text-xs font-semibold text-muted-foreground flex items-center justify-between">
              <span>Заявитель: <strong>{request.is_anonymous ? 'Анонимный житель города' : (request.author_name || 'Житель г. Семей')}</strong></span>
              <span className="text-muted-foreground font-mono">Персональные контакты защищены</span>
            </div>
          )}
          
          {/* Location & Priority */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-muted rounded-lg border-2 border-border text-sm">
              <span className="font-bold text-foreground flex items-center gap-1.5 mb-1">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span>Адрес инцидента:</span>
              </span>
              <p className="text-foreground font-bold text-base">{request.location_address}</p>
            </div>

            <div className="p-4 bg-muted rounded-lg border-2 border-border text-sm">
              <span className="font-bold text-foreground flex items-center gap-1.5 mb-1">
                <ShieldCheck className="w-4 h-4 text-muted-foreground" />
                <span>Обоснование критичности (ИИ):</span>
              </span>
              <p className="text-foreground font-medium">{request.priority_reason}</p>
            </div>
          </div>

          {/* Texts */}
          <div className="space-y-4">
            <div className="p-5 bg-muted rounded-lg border-2 border-border">
              <div className="font-bold text-foreground text-xs uppercase tracking-wider mb-1.5">
                Структурированное описание (Протокол ИИ Smart Qala):
              </div>
              <p className="text-foreground leading-relaxed text-base font-medium">
                {request.cleaned_text}
              </p>
            </div>

            <div className="p-4 bg-card rounded-lg border-2 border-border">
              <div className="font-bold text-muted-foreground text-xs uppercase tracking-wider mb-1">
                Первоначальный текст заявителя:
              </div>
              <p className="text-foreground italic text-sm">
                «{request.original_text}»
              </p>
            </div>
          </div>

          {/* Official Feedback Timeline Loop */}
          {request.official_feedback && request.official_feedback.length > 0 && (
            <div className="p-5 rounded-lg bg-info-soft/60 border-2 border-info-soft space-y-3">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-info-soft-foreground flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-info-soft-foreground" />
                <span>Официальные ответы ведомств заявителю</span>
              </h3>

              <div className="space-y-3">
                {request.official_feedback.map((fb) => (
                  <div key={fb.id} className="p-3.5 rounded-lg bg-card border border-info-soft text-sm shadow-2xs">
                    <div className="flex items-center justify-between font-bold text-foreground mb-1">
                      <span className="text-info-soft-foreground">{fb.author}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(fb.created_at).toLocaleString('ru-RU')}
                      </span>
                    </div>
                    <p className="text-foreground font-medium leading-relaxed">{fb.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Lifecycle Timeline: 4 stages */}
          <div className="pt-4 border-t-2 border-border">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-foreground mb-3">
              Статус заявки в едином контакт-центре 109 г. Семей
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {lifecycleStages.map((stage, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-lg border-2 text-sm flex flex-col justify-between ${
                    stage.done 
                      ? 'bg-primary text-primary-foreground border-border' 
                      : 'bg-muted text-muted-foreground border-border'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold">{stage.title}</span>
                      {stage.done && <span>✓</span>}
                    </div>
                    <p className={`text-xs mt-1 font-medium ${stage.done ? 'text-primary-foreground/90' : 'text-muted-foreground'}`}>
                      {stage.desc}
                    </p>
                  </div>
                  <div className={`mt-3 pt-1 border-t text-xs font-bold ${stage.done ? 'border-primary-foreground/20 text-primary-foreground/80' : 'border-border text-muted-foreground'}`}>
                    {stage.date}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Photo Proof Evidence Section */}
          <div className="pt-4 border-t-2 border-border">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-foreground mb-3">
              Фотофиксация объекта (ДО и ПОСЛЕ)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Before Photo */}
              <div>
                <div className="text-sm font-bold text-foreground mb-1.5">
                  Фотография до выполнения работ:
                </div>
                <div className="relative rounded-lg overflow-hidden border-2 border-border aspect-4/3 bg-muted">
                  {request.photo_before_url ? (
                    <img
                      src={request.photo_before_url}
                      alt="Состояние до"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-sm font-bold text-muted-foreground">
                      Фотография не прикреплена
                    </div>
                  )}
                  <span className="absolute top-2 left-2 px-2.5 py-1 text-xs font-extrabold rounded bg-primary text-primary-foreground shadow-sm">
                    ДО
                  </span>
                </div>
              </div>

              {/* After Photo */}
              <div>
                <div className="text-sm font-bold text-success-soft-foreground mb-1.5">
                  Фотоотчет о выполнении (Службы города):
                </div>
                <div className="relative rounded-lg overflow-hidden border-2 border-success aspect-4/3 bg-muted">
                  {request.photo_after_url ? (
                    <img
                      src={request.photo_after_url}
                      alt="Состояние после"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-sm font-medium text-muted-foreground p-4 text-center">
                      Работы в процессе исполнения. Фотоотчет появится после закрытия заявки.
                    </div>
                  )}
                  {request.photo_after_url && (
                    <span className="absolute top-2 left-2 px-2.5 py-1 text-xs font-extrabold rounded bg-success text-success-foreground shadow-sm">
                      ПОСЛЕ
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Resolution Report */}
            {isResolved && request.resolution_report && (
              <div className="mt-4 p-5 bg-success-soft rounded-lg border-2 border-success-soft text-sm">
                <div className="font-extrabold text-success-soft-foreground flex items-center gap-2 mb-1.5 text-base">
                  <CheckCircle2 className="w-5 h-5 text-success" />
                  <span>Официальный акт устранения проблемы:</span>
                </div>
                <p className="text-success-soft-foreground leading-relaxed font-medium">
                  {request.resolution_report}
                </p>
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="p-5 bg-muted border-t-2 border-border flex items-center justify-between text-sm">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-foreground hover:text-foreground/80 font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>На главную страницу</span>
          </Link>

          <span className="text-xs font-bold text-muted-foreground">
            ДЕМОНСТРАЦИОННЫЕ ДАННЫЕ / СЕМЕЙ
          </span>
        </div>

      </div>

      {/* ========================================================
          CITIZEN APPEAL MODAL (ОБЖАЛОВАНИЕ РЕШЕНИЯ)
          ======================================================== */}
      {isAppealOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-card rounded-lg border-2 border-border shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-danger" />
                <h3 className="text-lg font-extrabold text-foreground">
                  Обжаловать решение по обращению
                </h3>
              </div>
              <button
                onClick={() => setIsAppealOpen(false)}
                className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {appealSuccessMsg ? (
              <div className="py-6 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-success mx-auto" />
                <h4 className="text-base font-extrabold text-foreground">Жалоба принята в работу</h4>
                <p className="text-sm font-medium text-foreground">{appealSuccessMsg}</p>
              </div>
            ) : (
              <form onSubmit={handleSendAppeal} className="mt-4 space-y-4">
                <div className="p-3 bg-muted rounded border border-border text-xs text-foreground">
                  Обращение: <strong>{request.id}</strong> — {request.title}
                </div>

                <div>
                  <label className="block text-xs font-bold text-foreground uppercase tracking-wide mb-1">
                    Суть претензии или причина несогласия:
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={appealReason}
                    onChange={(e) => setAppealReason(e.target.value)}
                    placeholder="Например: Работы выполнены не полностью, мусор остался на прилегающей территории / яму засыпали гравием вместо асфальта..."
                    className="w-full p-3 text-sm rounded-lg border-2 border-border font-medium text-foreground focus:outline-none focus:border-ring"
                  />
                </div>

                <p className="text-xs text-muted-foreground">
                  Апелляция будет направлена напрямую в аппарат Акима г. Семей для проверки качества работы подрядной организации.
                </p>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAppealOpen(false)}
                    className="px-4 py-2.5 text-sm font-bold text-foreground rounded-lg hover:bg-muted"
                  >
                    Отмена
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingAppeal || !appealReason.trim()}
                    className="px-5 py-2.5 text-sm font-bold text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 disabled:opacity-50 cursor-pointer shadow-sm"
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
