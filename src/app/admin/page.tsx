'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { CityRequest, Department, PriorityLevel, RequestStatus, RequestStats, DeveloperFeedback } from '@/types';
import { StatusBadge, PriorityBadge, ModerationBadge, AnonymousBadge } from '@/components/Badges';
import { DEMO_PHOTOS } from '@/lib/mock-data';
import { useApp } from '@/context/AppContext';
import { 
  Search, 
  RefreshCw, 
  CheckCircle2, 
  Clock, 
  ShieldAlert, 
  X, 
  MapPin, 
  Save, 
  Layers,
  Lock,
  UserCheck,
  Building,
  ShieldCheck,
  Send,
  MessageSquare,
  AlertTriangle,
  Lightbulb,
  Phone,
  Mail,
  Calendar,
  Code,
  FileCheck,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Inbox,
  Table,
  Kanban,
  ArrowRight
} from 'lucide-react';

export default function AdminPage() {
  const { role, user, openAuthModal, setRole } = useApp();

  const [requests, setRequests] = useState<CityRequest[]>([]);
  const [stats, setStats] = useState<RequestStats>({
    total: 0,
    in_progress: 0,
    high_priority: 0,
    resolved: 0
  });
  const [loading, setLoading] = useState(true);

  // View Mode: 'table' vs 'kanban'
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('kanban');

  // Administration tabs: 'registry' | 'audit' | 'developers'
  const [adminTab, setAdminTab] = useState<'registry' | 'audit' | 'developers'>('registry');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Все');
  const [selectedStatus, setSelectedStatus] = useState<string>('Все');
  const [selectedPriority, setSelectedPriority] = useState<string>('Все');
  const [selectedModeration, setSelectedModeration] = useState<string>('Все');
  const [selectedType, setSelectedType] = useState<string>('Все');

  const handleQuickStatusChange = async (requestId: string, newStatus: RequestStatus, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      const res = await fetch(`/api/requests/${requestId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const json = await res.json();
      if (json.success) {
        await refreshRequests();
      }
    } catch (err) {
      console.error('Quick status update failed:', err);
    }
  };


  // Slide-over drawer state
  const [activeRequest, setActiveRequest] = useState<CityRequest | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [draftStatus, setDraftStatus] = useState<RequestStatus>('new');
  const [draftDepartment, setDraftDepartment] = useState<Department>('ЖКХ');
  const [draftPriority, setDraftPriority] = useState<PriorityLevel>('medium');
  const [draftReport, setDraftReport] = useState('');
  const [draftPhotoAfter, setDraftPhotoAfter] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // Official feedback dispatch state
  const [officialFeedbackInput, setOfficialFeedbackInput] = useState('');
  const [isSendingFeedback, setIsSendingFeedback] = useState(false);

  // Moderation state in drawer
  const [moderationReason, setModerationReason] = useState('');

  // Developer feedback module state (Admin role)
  const [devTopic, setDevTopic] = useState('');
  const [devMessage, setDevMessage] = useState('');
  const [isDevSending, setIsDevSending] = useState(false);
  const [devSuccessMsg, setDevSuccessMsg] = useState('');
  const [devFeedbacks, setDevFeedbacks] = useState<DeveloperFeedback[]>([]);

  const refreshRequests = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/requests');
      const data = await res.json();
      if (data.success) {
        setRequests(data.data);
        setStats(data.stats);
      }
    } catch (err) {
      console.error('Failed to load requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadDevFeedbacks = async () => {
    try {
      const res = await fetch('/api/feedback-dev');
      const data = await res.json();
      if (data.success) {
        setDevFeedbacks(data.data);
      }
    } catch (err) {
      console.error('Failed to load developer feedbacks:', err);
    }
  };

  useEffect(() => {
    let ignore = false;
    async function loadInitial() {
      try {
        const res = await fetch('/api/requests');
        const data = await res.json();
        if (!ignore && data.success) {
          setRequests(data.data);
          setStats(data.stats);
          setLoading(false);
        }
      } catch (err) {
        if (!ignore) {
          console.error('Failed to load requests:', err);
          setLoading(false);
        }
      }
    }
    loadInitial();
    loadDevFeedbacks();
    return () => {
      ignore = true;
    };
  }, []);

  const openDrawer = (req: CityRequest) => {
    setActiveRequest(req);
    setDraftStatus(req.status);
    setDraftDepartment(req.department);
    setDraftPriority(req.priority);
    setDraftReport(req.resolution_report || '');
    setDraftPhotoAfter(req.photo_after_url || '');
    setModerationReason(req.moderation_reason || '');
    setSaveSuccessMsg('');
    setOfficialFeedbackInput('');
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setActiveRequest(null);
  };

  const handleSaveChanges = async () => {
    if (!activeRequest) return;
    setIsSaving(true);
    setSaveSuccessMsg('');

    try {
      const payload: any = {
        status: draftStatus,
        department: draftDepartment,
        priority: draftPriority,
        resolution_report: draftReport.trim() || undefined,
        photo_after_url: draftPhotoAfter.trim() || undefined
      };

      const res = await fetch(`/api/requests/${activeRequest.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const json = await res.json();
      if (json.success) {
        setSaveSuccessMsg('Изменения успешно сохранены в реестре.');
        setActiveRequest(json.data);
        await refreshRequests();
      }
    } catch (err) {
      console.error('Save failed:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSendOfficialFeedback = async () => {
    if (!activeRequest || !officialFeedbackInput.trim()) return;
    setIsSendingFeedback(true);

    try {
      const payload = {
        add_feedback: {
          author: role === 'admin' ? 'Администрация г. Семей' : `${user.name} (Служба 109)`,
          department: activeRequest.department,
          text: officialFeedbackInput.trim()
        }
      };

      const res = await fetch(`/api/requests/${activeRequest.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const json = await res.json();
      if (json.success) {
        setActiveRequest(json.data);
        setOfficialFeedbackInput('');
        setSaveSuccessMsg('Официальный ответ направлен заявителю.');
        await refreshRequests();
      }
    } catch (err) {
      console.error('Feedback dispatch failed:', err);
    } finally {
      setIsSendingFeedback(false);
    }
  };

  const handleModerationDecision = async (status: 'approved' | 'rejected' | 'flagged_inappropriate') => {
    if (!activeRequest) return;
    setIsSaving(true);

    try {
      const payload = {
        moderation_status: status,
        moderation_reason: moderationReason.trim() || (status === 'approved' ? 'Обращение проверено и допущено администратором' : 'Отклонено как некомпетентное или нарушающее регламент')
      };

      const res = await fetch(`/api/requests/${activeRequest.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const json = await res.json();
      if (json.success) {
        setActiveRequest(json.data);
        setSaveSuccessMsg(`Статус модерации обновлен: ${status === 'approved' ? 'Одобрено' : status === 'rejected' ? 'Отклонено' : 'Флаг'}.`);
        await refreshRequests();
      }
    } catch (err) {
      console.error('Moderation update failed:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleTakeIdeaToRealization = async () => {
    if (!activeRequest) return;
    setIsSaving(true);

    try {
      const payload = {
        status: 'assigned' as RequestStatus,
        add_feedback: {
          author: `${user.name} (${user.roleTitle})`,
          department: activeRequest.department,
          text: 'Городская инициатива рассмотрена профильным ведомством и включена в план реализации мероприятий по развитию городской инфраструктуры г. Семей.'
        }
      };

      const res = await fetch(`/api/requests/${activeRequest.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const json = await res.json();
      if (json.success) {
        setActiveRequest(json.data);
        setDraftStatus('assigned');
        setSaveSuccessMsg('Инициатива жителя принята в реализацию ведомства.');
        await refreshRequests();
      }
    } catch (err) {
      console.error('Idea realization failed:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSendDeveloperFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!devTopic.trim() || !devMessage.trim()) return;

    setIsDevSending(true);
    setDevSuccessMsg('');

    try {
      const res = await fetch('/api/feedback-dev', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender_name: user.name,
          sender_email: user.email,
          sender_role: role,
          topic: devTopic.trim(),
          message: devMessage.trim()
        })
      });

      const json = await res.json();
      if (json.success) {
        setDevSuccessMsg('Сообщение успешно отправлено команде разработчиков Smart Qala (dev@smartqala.kz).');
        setDevTopic('');
        setDevMessage('');
        await loadDevFeedbacks();
      }
    } catch (err) {
      console.error('Failed to send dev feedback:', err);
    } finally {
      setIsDevSending(false);
    }
  };

  // Filter items
  const filteredRequests = requests.filter((r) => {
    const matchesSearch =
      r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.location_address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.cleaned_text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.author_name && r.author_name.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCat = selectedCategory === 'Все' || r.category === selectedCategory;
    const matchesStat = selectedStatus === 'Все' || r.status === selectedStatus;
    const matchesPrio = selectedPriority === 'Все' || r.priority === selectedPriority;
    const matchesType = selectedType === 'Все' || r.type === selectedType;
    const matchesModeration =
      selectedModeration === 'Все' ||
      (selectedModeration === 'flagged' && r.moderation_status === 'flagged_inappropriate') ||
      (selectedModeration === 'approved' && (!r.moderation_status || r.moderation_status === 'approved')) ||
      (selectedModeration === 'rejected' && r.moderation_status === 'rejected');

    return matchesSearch && matchesCat && matchesStat && matchesPrio && matchesType && matchesModeration;
  });

  // Calculate audit metrics for Administration
  const overdueRequests = requests.filter(
    (r) => r.priority === 'high' && r.status !== 'resolved'
  );
  const flaggedRequests = requests.filter(
    (r) => r.moderation_status === 'flagged_inappropriate'
  );
  const totalIdeas = requests.filter((r) => r.type === 'idea');

  // ==========================================
  // ACCESS RESTRICTION FOR CITIZEN ROLE
  // ==========================================
  if (role === 'citizen') {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 text-slate-900">
        <Navbar />

        <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col justify-center">
          <div className="bg-white rounded-lg border-2 border-slate-300 shadow-xl p-8 sm:p-10">
            <div className="w-14 h-14 rounded-lg bg-amber-100 text-amber-900 border border-amber-300 flex items-center justify-center mb-6">
              <Lock className="w-7 h-7" />
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-amber-50 text-amber-950 border border-amber-200 text-xs font-bold uppercase tracking-wider mb-3">
              <span>Служебный раздел • Доступ строго ограничен</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Доступ к панели управления ограничен
            </h1>

            <p className="mt-3 text-base text-slate-800 leading-relaxed font-medium">
              Данный раздел предназначен исключительно для сотрудников коммунальных служб (ЖКХ / 109) 
              и Администрации города (Акимата). Он содержит персональные и конфиденциальные данные заявителей 
              (номера телефонов, адреса проживания, внутренние наряды диспетчеров).
            </p>

            {/* Allowed Citizen Capabilities */}
            <div className="mt-6 p-5 bg-slate-50 rounded-lg border border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3">
                Как гражданин г. Семей, вы имеете полный доступ к публичным возможностям:
              </h3>
              <ul className="space-y-2 text-sm text-slate-800">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <span><strong>Подача обращений и проблем:</strong> Сообщение в свободной форме с фото и геометкой.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span><strong>Банк идей:</strong> Публикация предложений по улучшению города и поддержка чужих идей.</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                  <span><strong>Обжалование решений:</strong> Право подать апелляцию при некачественном исполнении ремонта.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Layers className="w-4 h-4 text-indigo-700 shrink-0 mt-0.5" />
                  <span><strong>Открытая витрина результатов:</strong> Просмотр фотоотчетов «ДО и ПОСЛЕ» по всему городу.</span>
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 pt-6 border-t border-slate-200 space-y-4">
              <div className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
                Мгновенный вход в служебную панель (Демо для жюри):
              </div>
              
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setRole('employee')}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-indigo-900 text-white font-bold text-sm hover:bg-indigo-800 transition-colors shadow-sm cursor-pointer"
                >
                  <Building className="w-4 h-4 text-white" />
                  <span>⚡ Войти как диспетчер ЖКХ (109)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('admin')}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-emerald-900 text-white font-bold text-sm hover:bg-emerald-800 transition-colors shadow-sm cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-white" />
                  <span>⚡ Войти как Акимат города</span>
                </button>

                <button
                  type="button"
                  onClick={() => openAuthModal('employee', 'login')}
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-white text-slate-900 font-bold text-sm border-2 border-slate-300 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <span>Ввести служебный пароль</span>
                </button>
              </div>

              <div className="flex items-center gap-3 pt-2 text-xs font-bold text-slate-700">
                <span>Или перейти:</span>
                <Link href="/" className="hover:text-black hover:underline">На главную</Link>
                <span>•</span>
                <Link href="/create" className="hover:text-black hover:underline">Подать обращение</Link>
                <span>•</span>
                <Link href="/ideas" className="hover:text-black hover:underline">Банк идей</Link>
              </div>
            </div>

            <div className="mt-4 text-xs text-slate-600 font-mono">
              ДЕМОНСТРАЦИОННЫЕ ДАННЫЕ / СЕМЕЙ • СИСТЕМА ЗАЩИТЫ ПЕРСОНАЛЬНЫХ ДАННЫХ
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  // ==========================================
  // AUTHORIZED ACCESS (ЖКХ OR АДМИНИСТРАЦИЯ)
  // ==========================================
  const isAdmin = role === 'admin';

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-slate-900">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Top Header & Civic Badge */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-200 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${isAdmin ? 'bg-emerald-600' : 'bg-blue-600'}`}></span>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                {isAdmin ? 'Ситуационный центр • Акимат г. Семей' : 'Единый контакт-центр 109 • Отдел ЖКХ г. Семей'}
              </span>
              <span className="text-xs font-mono font-bold px-2 py-0.5 bg-slate-200 text-slate-900 rounded border border-slate-300">
                {isAdmin ? 'ПРАВА: АДМИНИСТРАЦИЯ' : 'ПРАВА: ОПЕРАТОР ЖКХ'}
              </span>
            </div>
            
            <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {isAdmin ? 'Панель Администрации города' : 'Панель диспетчера и служб ЖКХ'}
            </h1>
            
            <p className="mt-1 text-sm font-semibold text-slate-700">
              {isAdmin
                ? 'Модерация некомпетентных обращений, аудит работы ЖКХ, контроль сроков и связь с разработчиками платформы.'
                : 'Контроль входящих инцидентов, доступ к контактам заявителей, устранение дефектов и официальные ответы.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={refreshRequests}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-bold rounded-lg bg-white border-2 border-slate-300 text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 text-slate-800 ${loading ? 'animate-spin' : ''}`} />
              <span>Обновить</span>
            </button>
          </div>
        </div>

        {/* ADMIN ROLE TABS */}
        {isAdmin && (
          <div className="flex items-center gap-2 mt-6 border-b border-slate-200 pb-2">
            <button
              onClick={() => setAdminTab('registry')}
              className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors cursor-pointer ${
                adminTab === 'registry'
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-800 border border-slate-300 hover:bg-slate-100'
              }`}
            >
              Реестр обращений и модерация
            </button>
            <button
              onClick={() => setAdminTab('audit')}
              className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                adminTab === 'audit'
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-800 border border-slate-300 hover:bg-slate-100'
              }`}
            >
              <ShieldAlert className="w-4 h-4 text-red-600" />
              <span>Аудит и контроль ЖКХ</span>
              {overdueRequests.length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 rounded text-xs bg-red-600 text-white font-mono font-bold">
                  {overdueRequests.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setAdminTab('developers')}
              className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                adminTab === 'developers'
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-800 border border-slate-300 hover:bg-slate-100'
              }`}
            >
              <Code className="w-4 h-4 text-slate-700" />
              <span>Связь с разработчиками</span>
            </button>
          </div>
        )}

        {/* KPI STAT CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div className="bg-white p-5 rounded-lg border-2 border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-800 text-xs font-bold uppercase">
              <span>Всего в системе</span>
              <Layers className="w-4 h-4 text-slate-700" />
            </div>
            <div className="mt-2 text-3xl font-extrabold text-slate-900">{stats.total}</div>
            <div className="mt-1 text-xs font-bold text-slate-700">Зарегистрировано инцидентов</div>
          </div>

          <div className="bg-white p-5 rounded-lg border-2 border-indigo-200 shadow-xs">
            <div className="flex items-center justify-between text-indigo-900 text-xs font-bold uppercase">
              <span>В работе у служб</span>
              <Clock className="w-4 h-4 text-indigo-700" />
            </div>
            <div className="mt-2 text-3xl font-extrabold text-indigo-900">{stats.in_progress}</div>
            <div className="mt-1 text-xs font-bold text-indigo-900">Бригады на участках</div>
          </div>

          <div className="bg-white p-5 rounded-lg border-2 border-red-200 shadow-xs">
            <div className="flex items-center justify-between text-red-900 text-xs font-bold uppercase">
              <span>Высокий приоритет</span>
              <ShieldAlert className="w-4 h-4 text-red-700" />
            </div>
            <div className="mt-2 text-3xl font-extrabold text-red-900">{stats.high_priority}</div>
            <div className="mt-1 text-xs font-bold text-red-900">Срочные аварии (норматив 24ч)</div>
          </div>

          <div className="bg-white p-5 rounded-lg border-2 border-emerald-200 shadow-xs">
            <div className="flex items-center justify-between text-emerald-900 text-xs font-bold uppercase">
              <span>Решено с фото</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            </div>
            <div className="mt-2 text-3xl font-extrabold text-emerald-900">{stats.resolved}</div>
            <div className="mt-1 text-xs font-bold text-emerald-900">Опубликованы на витрине</div>
          </div>
        </div>

        {/* TAB 1: REGISTRY & MODERATION */}
        {(adminTab === 'registry' || !isAdmin) && (
          <>
            {/* FILTERS & SEARCH BAR */}
            <div className="bg-white p-4 rounded-lg border-2 border-slate-200 shadow-xs mt-6 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                
                {/* Search */}
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-700 absolute left-3 top-3.5" />
                  <input
                    type="text"
                    placeholder="Поиск по ID, адресу, тексту, ФИО..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                {/* Type filter */}
                <div>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  >
                    <option value="Все">Все типы (Проблемы и идеи)</option>
                    <option value="problem">🔴 Только проблемы</option>
                    <option value="idea">💡 Только идеи граждан</option>
                  </select>
                </div>

                {/* Category filter */}
                <div>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  >
                    <option value="Все">Все категории</option>
                    <option value="Дороги">Дороги</option>
                    <option value="Освещение">Освещение</option>
                    <option value="Мусор">Мусор</option>
                    <option value="Транспорт">Транспорт</option>
                    <option value="Благоустройство">Благоустройство</option>
                    <option value="Экология">Экология</option>
                    <option value="Водоснабжение">Водоснабжение</option>
                    <option value="Безопасность">Безопасность</option>
                    <option value="Другое">Другое</option>
                  </select>
                </div>

                {/* Status filter */}
                <div>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  >
                    <option value="Все">Все статусы</option>
                    <option value="new">Новое</option>
                    <option value="under_review">На рассмотрении</option>
                    <option value="assigned">Назначено</option>
                    <option value="in_progress">В работе</option>
                    <option value="resolved">Решено</option>
                  </select>
                </div>

                {/* Moderation filter for Admin */}
                {isAdmin ? (
                  <div>
                    <select
                      value={selectedModeration}
                      onChange={(e) => setSelectedModeration(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-amber-300 bg-amber-50 font-bold text-amber-950 focus:outline-none focus:ring-2 focus:ring-slate-900"
                    >
                      <option value="Все">Модерация: Все</option>
                      <option value="flagged">⚠️ Требует модерации</option>
                      <option value="approved">✓ Одобренные</option>
                      <option value="rejected">✕ Отклоненные</option>
                    </select>
                  </div>
                ) : (
                  <div>
                    <select
                      value={selectedPriority}
                      onChange={(e) => setSelectedPriority(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                    >
                      <option value="Все">Все приоритеты</option>
                      <option value="high">Высокий</option>
                      <option value="medium">Средний</option>
                      <option value="low">Низкий</option>
                    </select>
                  </div>
                )}

              </div>

              <div className="flex flex-wrap items-center justify-between text-xs font-bold text-slate-800 pt-2 border-t border-slate-200 gap-2">
                <div className="flex flex-wrap items-center gap-3">
                  <span>Отображено записей: {filteredRequests.length} из {requests.length}</span>
                  
                  {/* View Mode Switcher */}
                  <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-300">
                    <button
                      type="button"
                      onClick={() => setViewMode('table')}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-bold transition-colors cursor-pointer ${
                        viewMode === 'table' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-700 hover:text-slate-900'
                      }`}
                    >
                      <Table className="w-3.5 h-3.5" />
                      <span>Таблица</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode('kanban')}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-bold transition-colors cursor-pointer ${
                        viewMode === 'kanban' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-700 hover:text-slate-900'
                      }`}
                    >
                      <Kanban className="w-3.5 h-3.5" />
                      <span>Канбан-доска (3 раздела)</span>
                    </button>
                  </div>
                </div>

                {(searchQuery || selectedCategory !== 'Все' || selectedStatus !== 'Все' || selectedPriority !== 'Все' || selectedType !== 'Все' || selectedModeration !== 'Все') && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('Все');
                      setSelectedStatus('Все');
                      setSelectedPriority('Все');
                      setSelectedType('Все');
                      setSelectedModeration('Все');
                    }}
                    className="text-xs text-blue-900 hover:underline font-bold cursor-pointer"
                  >
                    Сбросить все фильтры
                  </button>
                )}
              </div>
            </div>

            {/* KANBAN OR TABLE VIEW */}
            {viewMode === 'kanban' ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-4 items-start">
                
                {/* COLUMN 1: Новые и на рассмотрении */}
                <div className="bg-slate-100/90 rounded-xl border-2 border-slate-300 p-4 flex flex-col space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b-2 border-slate-300">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-blue-600"></span>
                      <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-wide">
                        Новые и на рассмотрении
                      </h3>
                    </div>
                    <span className="px-2 py-0.5 text-xs font-mono font-bold bg-white text-slate-900 rounded-full border border-slate-300 shadow-2xs">
                      {filteredRequests.filter((r) => r.status === 'new' || r.status === 'under_review').length}
                    </span>
                  </div>

                  <div className="space-y-3 max-h-[750px] overflow-y-auto pr-1">
                    {filteredRequests.filter((r) => r.status === 'new' || r.status === 'under_review').length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-500 font-bold bg-white/70 rounded-lg border border-dashed border-slate-300">
                        Нет обращений на рассмотрении
                      </div>
                    ) : (
                      filteredRequests
                        .filter((r) => r.status === 'new' || r.status === 'under_review')
                        .map((req) => (
                          <div
                            key={req.id}
                            onClick={() => openDrawer(req)}
                            className="bg-white p-4 rounded-xl border-2 border-slate-200 hover:border-blue-600 shadow-xs hover:shadow-md transition-all cursor-pointer space-y-2.5"
                          >
                            <div className="flex items-center justify-between gap-1.5">
                              <span className="font-mono text-xs font-extrabold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-300">
                                {req.id}
                              </span>
                              <PriorityBadge priority={req.priority} />
                            </div>

                            <h4 className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug">
                              {req.title}
                            </h4>

                            <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                              <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                              <span className="truncate">{req.location_address}</span>
                            </div>

                            {/* Confidential applicant info for ЖКХ */}
                            <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                              <div className="font-bold text-slate-900 truncate">
                                {req.is_anonymous ? 'Анонимный заявитель' : req.author_name}
                              </div>
                              {req.author_phone && (
                                <div className="text-slate-600 font-mono text-[11px] mt-0.5">
                                  {req.author_phone}
                                </div>
                              )}
                            </div>

                            <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                              <span className="text-[11px] font-bold text-slate-600 truncate">
                                {req.department}
                              </span>
                              <button
                                type="button"
                                onClick={(e) => handleQuickStatusChange(req.id, 'in_progress', e)}
                                className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                              >
                                <span>В работу</span>
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ))
                    )}
                  </div>
                </div>

                {/* COLUMN 2: В работе у служб */}
                <div className="bg-slate-100/90 rounded-xl border-2 border-indigo-200 p-4 flex flex-col space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b-2 border-indigo-200">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-indigo-600"></span>
                      <h3 className="font-extrabold text-sm text-indigo-950 uppercase tracking-wide">
                        В работе у служб
                      </h3>
                    </div>
                    <span className="px-2 py-0.5 text-xs font-mono font-bold bg-white text-indigo-900 rounded-full border border-indigo-300 shadow-2xs">
                      {filteredRequests.filter((r) => r.status === 'assigned' || r.status === 'in_progress').length}
                    </span>
                  </div>

                  <div className="space-y-3 max-h-[750px] overflow-y-auto pr-1">
                    {filteredRequests.filter((r) => r.status === 'assigned' || r.status === 'in_progress').length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-500 font-bold bg-white/70 rounded-lg border border-dashed border-slate-300">
                        Нет обращений в процессе
                      </div>
                    ) : (
                      filteredRequests
                        .filter((r) => r.status === 'assigned' || r.status === 'in_progress')
                        .map((req) => (
                          <div
                            key={req.id}
                            onClick={() => openDrawer(req)}
                            className="bg-white p-4 rounded-xl border-2 border-indigo-200 hover:border-indigo-600 shadow-xs hover:shadow-md transition-all cursor-pointer space-y-2.5"
                          >
                            <div className="flex items-center justify-between gap-1.5">
                              <span className="font-mono text-xs font-extrabold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-300">
                                {req.id}
                              </span>
                              <span className="px-2 py-0.5 text-xs font-bold bg-indigo-100 text-indigo-900 rounded border border-indigo-300">
                                {req.department}
                              </span>
                            </div>

                            <h4 className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug">
                              {req.title}
                            </h4>

                            <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                              <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                              <span className="truncate">{req.location_address}</span>
                            </div>

                            {req.photo_before_url && (
                              <div 
                                className="h-24 w-full rounded-lg bg-cover bg-center border border-slate-200"
                                style={{ backgroundImage: `url('${req.photo_before_url}')` }}
                              />
                            )}

                            <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                              <span className="text-[11px] text-slate-600 font-medium">
                                Норматив: 24ч
                              </span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openDrawer(req);
                                }}
                                className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                              >
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Отчет «ПОСЛЕ»</span>
                              </button>
                            </div>
                          </div>
                        ))
                    )}
                  </div>
                </div>

                {/* COLUMN 3: Устранено / Решено */}
                <div className="bg-slate-100/90 rounded-xl border-2 border-emerald-200 p-4 flex flex-col space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b-2 border-emerald-200">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-emerald-600"></span>
                      <h3 className="font-extrabold text-sm text-emerald-950 uppercase tracking-wide">
                        Устранено / Решено
                      </h3>
                    </div>
                    <span className="px-2 py-0.5 text-xs font-mono font-bold bg-white text-emerald-900 rounded-full border border-emerald-300 shadow-2xs">
                      {filteredRequests.filter((r) => r.status === 'resolved').length}
                    </span>
                  </div>

                  <div className="space-y-3 max-h-[750px] overflow-y-auto pr-1">
                    {filteredRequests.filter((r) => r.status === 'resolved').length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-500 font-bold bg-white/70 rounded-lg border border-dashed border-slate-300">
                        Нет завершенных инцидентов
                      </div>
                    ) : (
                      filteredRequests
                        .filter((r) => r.status === 'resolved')
                        .map((req) => (
                          <div
                            key={req.id}
                            onClick={() => openDrawer(req)}
                            className="bg-white p-4 rounded-xl border-2 border-emerald-200 hover:border-emerald-600 shadow-xs hover:shadow-md transition-all cursor-pointer space-y-2.5"
                          >
                            <div className="flex items-center justify-between gap-1.5">
                              <span className="font-mono text-xs font-extrabold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-300">
                                {req.id}
                              </span>
                              <StatusBadge status="resolved" />
                            </div>

                            <h4 className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug">
                              {req.title}
                            </h4>

                            <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                              <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                              <span className="truncate">{req.location_address}</span>
                            </div>

                            {req.photo_after_url && (
                              <div className="relative">
                                <div 
                                  className="h-24 w-full rounded-lg bg-cover bg-center border border-emerald-300"
                                  style={{ backgroundImage: `url('${req.photo_after_url}')` }}
                                />
                                <span className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-emerald-900/90 text-white text-[10px] font-bold rounded">
                                  Фото ПОСЛЕ
                                </span>
                              </div>
                            )}

                            {req.resolution_report && (
                              <p className="text-xs text-emerald-950 bg-emerald-50 p-2 rounded border border-emerald-200 line-clamp-2 font-medium">
                                {req.resolution_report}
                              </p>
                            )}

                            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-800">
                              <span className="flex items-center gap-1 text-[11px]">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                <span>На витрине города</span>
                              </span>
                              <span className="text-[11px] text-slate-500 font-mono">
                                {req.department}
                              </span>
                            </div>
                          </div>
                        ))
                    )}
                  </div>
                </div>

              </div>
            ) : (
              /* DATA TABLE */
              <div className="bg-white rounded-lg border-2 border-slate-200 shadow-xs mt-4 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-100 border-b-2 border-slate-200 text-slate-900 uppercase font-bold text-xs">
                      <tr>
                        <th className="px-4 py-3.5">ID</th>
                        <th className="px-4 py-3.5">Заявитель (Конфиденциально)</th>
                        <th className="px-4 py-3.5">Суть инцидента / Идеи</th>
                        <th className="px-4 py-3.5">Адрес в г. Семей</th>
                        <th className="px-4 py-3.5">Приоритет</th>
                        <th className="px-4 py-3.5">Статус</th>
                        {isAdmin && <th className="px-4 py-3.5">Модерация</th>}
                        <th className="px-4 py-3.5 text-right">Действие</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {filteredRequests.map((req) => (
                        <tr
                          key={req.id}
                          className={`hover:bg-slate-50 transition-colors cursor-pointer ${
                            req.moderation_status === 'flagged_inappropriate' ? 'bg-amber-50/60' : ''
                          }`}
                          onClick={() => openDrawer(req)}
                        >
                          <td className="px-4 py-3.5 font-mono font-bold text-slate-900 whitespace-nowrap">
                            {req.id}
                          </td>

                          {/* Confidential applicant info */}
                          <td className="px-4 py-3.5 whitespace-nowrap">
                            {req.is_anonymous ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold bg-slate-200 text-slate-800">
                                Анонимный житель
                              </span>
                            ) : (
                              <div>
                                <div className="font-bold text-slate-900">{req.author_name || 'Заявитель'}</div>
                                <div className="text-xs font-mono font-semibold text-slate-700 flex items-center gap-1 mt-0.5">
                                  <Phone className="w-3 h-3 text-slate-600" />
                                  <span>{req.author_phone || '+7 (705) ...'}</span>
                                </div>
                              </div>
                            )}
                          </td>

                          <td className="px-4 py-3.5 max-w-xs sm:max-w-sm">
                            <div className="font-bold text-slate-900 line-clamp-1">{req.title}</div>
                            <div className="text-slate-700 line-clamp-1 text-xs mt-0.5 font-medium">
                              {req.cleaned_text}
                            </div>
                          </td>

                          <td className="px-4 py-3.5 whitespace-nowrap text-slate-800 max-w-xs truncate font-medium">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                              <span className="truncate">{req.location_address}</span>
                            </span>
                          </td>

                          <td className="px-4 py-3.5 whitespace-nowrap">
                            <PriorityBadge priority={req.priority} />
                          </td>

                          <td className="px-4 py-3.5 whitespace-nowrap">
                            <StatusBadge status={req.status} />
                          </td>

                          {isAdmin && (
                            <td className="px-4 py-3.5 whitespace-nowrap">
                              <ModerationBadge status={req.moderation_status} />
                            </td>
                          )}

                          <td className="px-4 py-3.5 text-right whitespace-nowrap">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openDrawer(req);
                              }}
                              className="px-3 py-1.5 text-xs font-bold rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-2xs"
                            >
                              Управление
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {filteredRequests.length === 0 && (
                  <div className="p-8 text-center text-slate-700">
                    <p className="text-sm font-bold">По заданным критериям обращений не найдено.</p>
                  </div>
                )}
              </div>
            )}

          </>
        )}

        {/* TAB 2: AUDIT & CONTROL OF HOUSING AND UTILITIES (ADMIN ONLY) */}
        {isAdmin && adminTab === 'audit' && (
          <div className="mt-6 space-y-6">
            <div className="bg-white p-6 rounded-lg border-2 border-slate-200 shadow-xs">
              <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-700" />
                <span>Ситуационный аудит исполнительской дисциплины служб г. Семей</span>
              </h2>
              <p className="text-sm font-medium text-slate-700 mt-1">
                Автоматическое выявление сбоев, задержек и спорных моментов между ЖКХ и гражданами.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="p-4 rounded-lg bg-red-50 border-2 border-red-300">
                  <div className="text-xs font-bold uppercase text-red-900">Просроченные аварийные заявки (&gt; 24ч)</div>
                  <div className="text-3xl font-extrabold text-red-900 mt-2">{overdueRequests.length}</div>
                  <div className="text-xs font-bold text-red-800 mt-1">Требуют служебного запроса в Горсвет/Водоканал</div>
                </div>

                <div className="p-4 rounded-lg bg-amber-50 border-2 border-amber-300">
                  <div className="text-xs font-bold uppercase text-amber-900">Запросы на модерации / Цензура</div>
                  <div className="text-3xl font-extrabold text-amber-900 mt-2">{flaggedRequests.length}</div>
                  <div className="text-xs font-bold text-amber-800 mt-1">Содержат ненормативную лексику или спорный текст</div>
                </div>

                <div className="p-4 rounded-lg bg-blue-50 border-2 border-blue-300">
                  <div className="text-xs font-bold uppercase text-blue-900">Инициативы граждан на рассмотрении</div>
                  <div className="text-3xl font-extrabold text-blue-900 mt-2">{totalIdeas.length}</div>
                  <div className="text-xs font-bold text-blue-800 mt-1">Кандидаты для включения в план благоустройства</div>
                </div>
              </div>
            </div>

            {/* Overdue Items List */}
            <div className="bg-white p-6 rounded-lg border-2 border-slate-200 shadow-xs">
              <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <span>Инциденты с риском срыва нормативных сроков</span>
              </h3>

              <div className="space-y-3">
                {overdueRequests.map((req) => (
                  <div
                    key={req.id}
                    onClick={() => openDrawer(req)}
                    className="p-4 rounded-lg border-2 border-red-200 bg-red-50/40 hover:bg-red-50 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-red-950">{req.id}</span>
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-red-200 text-red-950">
                          {req.department}
                        </span>
                        <span className="text-xs font-bold text-slate-700">
                          {req.location_address}
                        </span>
                      </div>
                      <div className="text-sm font-bold text-slate-900 mt-1">{req.title}</div>
                      <div className="text-xs font-medium text-slate-700 mt-0.5">{req.priority_reason}</div>
                    </div>

                    <button
                      type="button"
                      className="px-3 py-1.5 text-xs font-bold bg-slate-900 text-white rounded-lg hover:bg-slate-800"
                    >
                      Инспектировать
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: DEVELOPER FEEDBACK CHANNEL (ADMIN ONLY) */}
        {isAdmin && adminTab === 'developers' && (
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Direct Feedback Form */}
            <div className="lg:col-span-6 bg-white p-6 rounded-lg border-2 border-slate-200 shadow-xs">
              <div className="flex items-center gap-2 mb-2">
                <Code className="w-5 h-5 text-slate-900" />
                <h2 className="text-lg font-extrabold text-slate-900">
                  Прямой канал связи с разработчиками Smart Qala
                </h2>
              </div>
              <p className="text-sm font-medium text-slate-700 mb-4">
                Официальный интерфейс Администрации г. Семей для запросов на доработку, 
                технических отчетов и предложений по обеспечению бесперебойной работы сайта.
              </p>

              {devSuccessMsg && (
                <div className="p-3.5 mb-4 rounded-lg bg-emerald-50 border-2 border-emerald-300 text-emerald-950 text-sm font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                  <span>{devSuccessMsg}</span>
                </div>
              )}

              <form onSubmit={handleSendDeveloperFeedback} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide mb-1">
                    Тема сообщения / Технический блок
                  </label>
                  <input
                    type="text"
                    required
                    value={devTopic}
                    onChange={(e) => setDevTopic(e.target.value)}
                    placeholder="Например: Экспорт сводных отчетов в Excel для акима"
                    className="w-full p-2.5 text-sm rounded-lg border-2 border-slate-300 font-medium text-slate-900 focus:outline-none focus:border-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide mb-1">
                    Подробное описание или предложение
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={devMessage}
                    onChange={(e) => setDevMessage(e.target.value)}
                    placeholder="Опишите требования, выявленные ошибки или пожелания по интерфейсу..."
                    className="w-full p-2.5 text-sm rounded-lg border-2 border-slate-300 font-medium text-slate-900 focus:outline-none focus:border-slate-900"
                  />
                </div>

                <div className="p-3 bg-slate-100 rounded-lg border border-slate-300 text-xs text-slate-800 flex items-center justify-between">
                  <span>Отправитель: <strong>{user.name}</strong> ({user.roleTitle})</span>
                  <span className="font-mono text-slate-700">{user.email}</span>
                </div>

                <button
                  type="submit"
                  disabled={isDevSending}
                  className="w-full py-3 px-4 rounded-lg bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 disabled:opacity-50 transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4 text-white" />
                  <span>{isDevSending ? 'Отправка разработчикам...' : 'Отправить запрос разработчикам'}</span>
                </button>
              </form>
            </div>

            {/* Official Developer Contacts & History */}
            <div className="lg:col-span-6 space-y-6">
              <div className="bg-slate-900 text-white p-6 rounded-lg shadow-sm border border-slate-800">
                <h3 className="text-base font-extrabold tracking-tight">
                  Официальные контакты команды разработки
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Поддержка платформы Smart Qala в рамках программы цифровизации Абайской области:
                </p>

                <div className="mt-4 space-y-2.5 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-emerald-400" />
                    <span>Email команды: <strong className="font-mono text-emerald-300">dev@smartqala.kz</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-emerald-400" />
                    <span>Прямая линия: <strong>+7 (7222) 56-00-01 (вн. 404)</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-emerald-400" />
                    <span>Ситуационный офис: г. Семей, ул. Мухтара Ауэзова, 26</span>
                  </div>
                </div>
              </div>

              {/* Sent Messages History */}
              <div className="bg-white p-6 rounded-lg border-2 border-slate-200 shadow-xs">
                <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Inbox className="w-4 h-4 text-slate-700" />
                  <span>Журнал обращений к разработчикам</span>
                </h3>

                <div className="space-y-3 max-h-72 overflow-y-auto">
                  {devFeedbacks.map((df) => (
                    <div key={df.id} className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 text-sm">{df.topic}</span>
                        <span className="font-mono text-slate-600 text-[11px]">
                          {new Date(df.created_at).toLocaleDateString('ru-RU')}
                        </span>
                      </div>
                      <p className="text-slate-800 mt-1 leading-relaxed font-medium">{df.message}</p>
                      <div className="mt-2 pt-1 border-t border-slate-200 text-slate-700 font-semibold flex items-center justify-between">
                        <span>От: {df.sender_name}</span>
                        <span className="text-emerald-700 font-bold">✓ Принято в бэклог</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        )}

      </main>

      {/* ========================================================
          SLIDE-OVER DRAWER MODAL (ЖКХ & АДМИНИСТРАЦИЯ)
          ======================================================== */}
      {isDrawerOpen && activeRequest && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto">
            
            {/* Drawer Header */}
            <div>
              <div className="p-5 border-b-2 border-slate-200 flex items-center justify-between bg-slate-100">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="font-mono text-sm font-extrabold text-slate-900 bg-white border border-slate-300 px-2.5 py-1 rounded">
                    {activeRequest.id}
                  </span>
                  <StatusBadge status={activeRequest.status} />
                  <PriorityBadge priority={activeRequest.priority} />
                  <AnonymousBadge isAnonymous={activeRequest.is_anonymous} />
                </div>
                
                <button
                  onClick={closeDrawer}
                  className="p-2 rounded-lg text-slate-700 hover:text-slate-950 hover:bg-slate-200 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Body Form */}
              <div className="p-6 space-y-6">
                
                {saveSuccessMsg && (
                  <div className="p-3.5 bg-emerald-50 border-2 border-emerald-300 text-emerald-950 rounded-lg text-sm font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                    <span>{saveSuccessMsg}</span>
                  </div>
                )}

                {/* 🔒 CONFIDENTIAL DOSSIER (Visible ONLY to ЖКХ and Admin) */}
                <div className="p-4 rounded-lg bg-blue-50/70 border-2 border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-blue-950 flex items-center gap-1.5">
                      <Lock className="w-4 h-4 text-blue-700" />
                      <span>Конфиденциальное досье заявителя (Служебный доступ)</span>
                    </span>
                    <span className="text-[11px] font-mono font-bold text-blue-900 bg-blue-100 px-2 py-0.5 rounded">
                      ЖКХ / 109
                    </span>
                  </div>

                  {activeRequest.is_anonymous ? (
                    <div className="p-3 bg-white rounded border border-blue-200 text-xs font-semibold text-slate-800">
                      🔒 Заявитель выбрал режим анонимности. В соответствии с Законом РК «О персональных данных», персональные контакты заявителя скрыты.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="bg-white p-2.5 rounded border border-blue-200">
                        <span className="text-slate-700 block font-semibold">ФИО заявителя:</span>
                        <strong className="text-slate-900 text-sm">{activeRequest.author_name || 'Не указано'}</strong>
                      </div>
                      <div className="bg-white p-2.5 rounded border border-blue-200">
                        <span className="text-slate-700 block font-semibold">Телефон для связи:</span>
                        <strong className="text-slate-900 text-sm font-mono">{activeRequest.author_phone || '+7 (705) 412-88-99'}</strong>
                      </div>
                      <div className="bg-white p-2.5 rounded border border-blue-200">
                        <span className="text-slate-700 block font-semibold">Электронная почта:</span>
                        <strong className="text-slate-900 text-sm font-mono">{activeRequest.author_email || 'citizen@semey.kz'}</strong>
                      </div>
                      <div className="bg-white p-2.5 rounded border border-blue-200">
                        <span className="text-slate-700 block font-semibold">Дата и время обращения:</span>
                        <strong className="text-slate-900 text-xs font-mono">
                          {new Date(activeRequest.created_at).toLocaleString('ru-RU')}
                        </strong>
                      </div>
                    </div>
                  )}
                </div>

                {/* Incident Information */}
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded ${
                        activeRequest.type === 'idea' ? 'bg-amber-100 text-amber-950' : 'bg-slate-200 text-slate-900'
                      }`}>
                        {activeRequest.type === 'idea' ? '💡 Городская идея' : '🔴 Проблема города'}
                      </span>
                      <span className="text-xs font-bold text-slate-700">{activeRequest.category}</span>
                    </div>

                    <h3 className="text-xl font-extrabold text-slate-900">{activeRequest.title}</h3>
                    
                    <div className="flex items-center gap-1.5 text-sm text-slate-800 font-semibold mt-1">
                      <MapPin className="w-4 h-4 text-slate-700 shrink-0" />
                      <span>{activeRequest.location_address}</span>
                    </div>
                  </div>

                  {/* Cleaned text protocol */}
                  <div className="p-4 bg-slate-100 rounded-lg border border-slate-300 text-sm">
                    <div className="font-bold text-slate-900 mb-1">
                      Протокол инцидента (структурировано ИИ):
                    </div>
                    <p className="text-slate-950 leading-relaxed font-medium">
                      {activeRequest.cleaned_text}
                    </p>
                  </div>

                  {/* Original text */}
                  <div className="p-3.5 bg-white rounded-lg border border-slate-300 text-sm">
                    <div className="font-bold text-slate-700 mb-1">
                      Исходный текст жителя:
                    </div>
                    <p className="text-slate-800 italic">
                      «{activeRequest.original_text}»
                    </p>
                  </div>

                  {/* Priority rationale */}
                  <div className="p-3 bg-red-50 rounded-lg border border-red-300 text-xs font-medium">
                    <span className="font-bold text-red-950">Обоснование критичности: </span>
                    <span className="text-red-950">{activeRequest.priority_reason}</span>
                  </div>
                </div>

                {/* 💡 SPECIAL ACTION: FOR CITIZEN IDEAS */}
                {activeRequest.type === 'idea' && (
                  <div className="p-4 bg-amber-50 rounded-lg border-2 border-amber-300">
                    <h4 className="text-sm font-extrabold text-amber-950 flex items-center gap-1.5">
                      <Lightbulb className="w-4 h-4 text-amber-700" />
                      <span>Принятие идеи жителей на реализацию</span>
                    </h4>
                    <p className="text-xs text-amber-900 mt-1 font-semibold">
                      Вы можете официально перевести инициативу в статус ведомственного проекта и уведомить заявителя.
                    </p>
                    <button
                      type="button"
                      onClick={handleTakeIdeaToRealization}
                      disabled={isSaving || activeRequest.status === 'assigned' || activeRequest.status === 'in_progress'}
                      className="mt-3 px-4 py-2.5 rounded-lg bg-amber-600 text-white font-bold text-xs hover:bg-amber-700 disabled:opacity-50 transition-colors shadow-2xs"
                    >
                      {activeRequest.status === 'assigned' || activeRequest.status === 'in_progress'
                        ? '✓ Идея уже принята в реализацию'
                        : 'Взять на рассмотрение ведомства на реализацию'}
                    </button>
                  </div>
                )}

                {/* ⚖️ MODERATION MODULE (ADMIN ONLY) */}
                {isAdmin && (
                  <div className="p-4 bg-amber-50/80 rounded-lg border-2 border-amber-300 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-amber-950 flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-amber-800" />
                        <span>Модерация и цензурный контроль (Акимат)</span>
                      </span>
                      <ModerationBadge status={activeRequest.moderation_status} />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-amber-950 mb-1">
                        Причина / Решение модератора:
                      </label>
                      <input
                        type="text"
                        value={moderationReason}
                        onChange={(e) => setModerationReason(e.target.value)}
                        placeholder="Например: Некомпетентное обращение / Нецензурная лексика"
                        className="w-full p-2 text-xs rounded border border-amber-300 bg-white font-medium text-slate-900"
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => handleModerationDecision('approved')}
                        className="px-3 py-1.5 rounded bg-emerald-700 text-white font-bold text-xs hover:bg-emerald-800 transition-colors"
                      >
                        ✓ Одобрить обращение
                      </button>

                      <button
                        type="button"
                        onClick={() => handleModerationDecision('rejected')}
                        className="px-3 py-1.5 rounded bg-red-700 text-white font-bold text-xs hover:bg-red-800 transition-colors"
                      >
                        ✕ Отклонить как некомпетентное
                      </button>

                      <button
                        type="button"
                        onClick={() => handleModerationDecision('flagged_inappropriate')}
                        className="px-3 py-1.5 rounded bg-amber-700 text-white font-bold text-xs hover:bg-amber-800 transition-colors"
                      >
                        ⚠️ Поставить флаг цензуры
                      </button>
                    </div>
                  </div>
                )}

                {/* 💬 OFFICIAL FEEDBACK DIRECTLY TO CITIZEN */}
                <div className="p-4 bg-slate-50 rounded-lg border-2 border-slate-300 space-y-3">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-indigo-700" />
                    <span>Официальный ответ и обратная связь заявителю</span>
                  </h4>
                  <p className="text-xs text-slate-700 font-medium">
                    Житель получит уведомление в личном кабинете и на странице обращения.
                  </p>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={officialFeedbackInput}
                      onChange={(e) => setOfficialFeedbackInput(e.target.value)}
                      placeholder="Например: Бригада Горсвет выехала на участок. Срок завершения 18:00..."
                      className="flex-1 p-2.5 text-xs rounded-lg border-2 border-slate-300 bg-white font-medium text-slate-900 focus:outline-none focus:border-slate-900"
                    />
                    <button
                      type="button"
                      onClick={handleSendOfficialFeedback}
                      disabled={isSendingFeedback || !officialFeedbackInput.trim()}
                      className="px-4 py-2 text-xs font-bold rounded-lg bg-indigo-700 text-white hover:bg-indigo-800 disabled:opacity-50 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5 text-white" />
                      <span>{isSendingFeedback ? 'Отправка...' : 'Ответить'}</span>
                    </button>
                  </div>

                  {/* Previous Feedback History */}
                  {activeRequest.official_feedback && activeRequest.official_feedback.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-slate-200">
                      <span className="text-[11px] font-bold uppercase text-slate-700">История ответов:</span>
                      {activeRequest.official_feedback.map((fb) => (
                        <div key={fb.id} className="p-2.5 rounded bg-white border border-slate-300 text-xs">
                          <div className="flex items-center justify-between font-bold text-slate-900">
                            <span>{fb.author}</span>
                            <span className="font-mono text-[10px] text-slate-600">
                              {new Date(fb.created_at).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-slate-800 mt-1 font-medium">{fb.text}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Photos Section */}
                <div className="space-y-3 pt-3 border-t-2 border-slate-200">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
                    Фотофиксация дефекта
                  </h4>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {/* Before Photo */}
                    <div>
                      <div className="text-xs font-bold text-slate-900 mb-1">Фото ДО (от жителя):</div>
                      <div className="relative rounded-lg overflow-hidden border-2 border-slate-300 aspect-4/3 bg-slate-100">
                        {activeRequest.photo_before_url ? (
                          <img src={activeRequest.photo_before_url} alt="До" className="w-full h-full object-cover" />
                        ) : (
                          <div className="flex items-center justify-center h-full text-slate-600 text-xs font-bold">Нет фото</div>
                        )}
                      </div>
                    </div>

                    {/* After Photo Preview */}
                    <div>
                      <div className="text-xs font-bold text-emerald-950 mb-1">Фото ПОСЛЕ (акт устранения):</div>
                      <div className="relative rounded-lg overflow-hidden border-2 border-emerald-400 aspect-4/3 bg-slate-100">
                        {draftPhotoAfter ? (
                          <img src={draftPhotoAfter} alt="После" className="w-full h-full object-cover" />
                        ) : (
                          <div className="flex items-center justify-center h-full text-slate-600 text-xs font-medium p-2 text-center">
                            Фото устранения еще не прикреплено
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Operator Management Actions */}
                <div className="space-y-4 pt-3 border-t-2 border-slate-200">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
                    Управление статусом и решение вопроса
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Change Status */}
                    <div>
                      <label className="block text-xs font-bold text-slate-900 mb-1">
                        Статус заявки
                      </label>
                      <select
                        value={draftStatus}
                        onChange={(e) => setDraftStatus(e.target.value as RequestStatus)}
                        className="w-full p-2.5 text-xs rounded-lg border-2 border-slate-300 bg-white font-bold text-slate-900"
                      >
                        <option value="new">Новое</option>
                        <option value="under_review">На рассмотрении</option>
                        <option value="assigned">Назначено</option>
                        <option value="in_progress">В работе</option>
                        <option value="resolved">Решено (Выполнено)</option>
                      </select>
                    </div>

                    {/* Change Department */}
                    <div>
                      <label className="block text-xs font-bold text-slate-900 mb-1">
                        Ведомство
                      </label>
                      <select
                        value={draftDepartment}
                        onChange={(e) => setDraftDepartment(e.target.value as Department)}
                        className="w-full p-2.5 text-xs rounded-lg border-2 border-slate-300 bg-white font-bold text-slate-900"
                      >
                        <option value="ЖКХ">ЖКХ</option>
                        <option value="Транспорт">Транспорт</option>
                        <option value="Благоустройство">Благоустройство</option>
                        <option value="Экология">Экология</option>
                        <option value="Городская инфраструктура">Городская инфраструктура</option>
                      </select>
                    </div>

                    {/* Change Priority */}
                    <div>
                      <label className="block text-xs font-bold text-slate-900 mb-1">
                        Приоритет
                      </label>
                      <select
                        value={draftPriority}
                        onChange={(e) => setDraftPriority(e.target.value as PriorityLevel)}
                        className="w-full p-2.5 text-xs rounded-lg border-2 border-slate-300 bg-white font-bold text-slate-900"
                      >
                        <option value="high">Высокий (24ч)</option>
                        <option value="medium">Средний (3 дня)</option>
                        <option value="low">Низкий (7 дней)</option>
                      </select>
                    </div>
                  </div>

                  {/* Resolution Report */}
                  <div>
                    <label className="block text-xs font-bold text-slate-900 mb-1">
                      Официальный акт устранения (для открытой витрины города)
                    </label>
                    <textarea
                      rows={3}
                      value={draftReport}
                      onChange={(e) => setDraftReport(e.target.value)}
                      placeholder="Опишите фактически проведенные работы. Например: Бригадой МП «Благоустройство» выполнен ремонт асфальтового полотна..."
                      className="w-full p-2.5 text-xs rounded-lg border-2 border-slate-300 font-medium text-slate-900 focus:outline-none focus:border-slate-900"
                    />
                  </div>

                  {/* After Photo URL or Quick Presets */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-slate-900">
                        Ссылка на фото «ПОСЛЕ»
                      </label>
                      <span className="text-xs text-slate-700 font-bold">Быстрые пресеты:</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-2">
                      <button
                        type="button"
                        onClick={() => setDraftPhotoAfter(DEMO_PHOTOS.trash_after)}
                        className="px-2.5 py-1 text-xs font-bold bg-slate-100 hover:bg-slate-200 rounded border border-slate-300 text-slate-900 cursor-pointer"
                      >
                        Мусор убран
                      </button>
                      <button
                        type="button"
                        onClick={() => setDraftPhotoAfter(DEMO_PHOTOS.pothole_after)}
                        className="px-2.5 py-1 text-xs font-bold bg-slate-100 hover:bg-slate-200 rounded border border-slate-300 text-slate-900 cursor-pointer"
                      >
                        Яма заделана
                      </button>
                      <button
                        type="button"
                        onClick={() => setDraftPhotoAfter(DEMO_PHOTOS.streetlight_after)}
                        className="px-2.5 py-1 text-xs font-bold bg-slate-100 hover:bg-slate-200 rounded border border-slate-300 text-slate-900 cursor-pointer"
                      >
                        Фонарь горит
                      </button>
                      <button
                        type="button"
                        onClick={() => setDraftPhotoAfter(DEMO_PHOTOS.bench_after)}
                        className="px-2.5 py-1 text-xs font-bold bg-slate-100 hover:bg-slate-200 rounded border border-slate-300 text-slate-900 cursor-pointer"
                      >
                        Скамья починена
                      </button>
                    </div>

                    <input
                      type="text"
                      value={draftPhotoAfter}
                      onChange={(e) => setDraftPhotoAfter(e.target.value)}
                      placeholder="https://... URL фотографии после выполнения работ"
                      className="w-full p-2 text-xs rounded-lg border-2 border-slate-300 font-mono text-slate-900"
                    />
                  </div>

                </div>

              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-4 border-t-2 border-slate-200 bg-slate-100 flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-slate-700">
                ДЕМОНСТРАЦИОННЫЕ ДАННЫЕ / СЕМЕЙ
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={closeDrawer}
                  className="px-4 py-2.5 text-xs font-bold rounded-lg border-2 border-slate-300 text-slate-800 hover:bg-white cursor-pointer"
                >
                  Закрыть
                </button>

                <button
                  type="button"
                  onClick={handleSaveChanges}
                  disabled={isSaving}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold rounded-lg bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50 transition-colors shadow-sm cursor-pointer"
                >
                  <Save className="w-4 h-4 text-white" />
                  <span>{isSaving ? 'Сохранение...' : 'Сохранить изменения'}</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
