'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getRequests, getRequestStats } from '@/lib/mock-data';
import { StatusBadge, PriorityBadge, DepartmentBadge } from '@/components/Badges';
import ShowcaseSection from '@/components/ShowcaseSection';
import { useApp } from '@/context/AppContext';
import { CityRequest, RequestStats } from '@/types';
import { 
  PlusCircle, 
  CheckCircle2, 
  MapPin, 
  Clock, 
  ChevronRight,
  ArrowRight, 
  MessageSquare, 
  Cpu, 
  Map,
  Sparkles,
  Lightbulb,
  Building2,
  ShieldCheck
} from 'lucide-react';

export default function HomePage() {
  const { t, lang, role } = useApp();

  const [requests, setRequests] = useState<CityRequest[]>([]);
  const [stats, setStats] = useState<RequestStats>({
    total: 13,
    in_progress: 3,
    high_priority: 3,
    resolved: 3
  });

  useEffect(() => {
    let ignore = false;
    fetch('/api/requests')
      .then((res) => res.json())
      .then((data) => {
        if (!ignore && data.success) {
          setRequests(data.data);
          setStats(data.stats);
        }
      })
      .catch(() => {
        // Fallback to mock data if network fails
        if (!ignore) {
          setRequests(getRequests());
          setStats(getRequestStats());
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  const resolvedRequests = requests.filter((r) => r.status === 'resolved');
  const recentRequests = requests.slice(0, 5);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-slate-900">
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="bg-white border-b-2 border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left Column: Hero Text & Actions */}
              <div className="lg:col-span-7">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-extrabold rounded-md bg-slate-100 text-slate-900 border-2 border-slate-300 mb-5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse"></span>
                  <span>{t.heroPilotBadge}</span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  {t.heroTitle}
                </h1>

                <p className="mt-4 text-base sm:text-lg text-slate-800 leading-relaxed max-w-2xl font-medium">
                  {t.heroSubtitle}
                </p>

                {/* Primary Action Buttons */}
                <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                  <Link
                    href="/create"
                    className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-lg bg-slate-900 text-white font-bold text-base hover:bg-slate-800 transition-colors shadow-sm cursor-pointer"
                  >
                    <PlusCircle className="w-5 h-5 text-white" />
                    <span>{t.heroSubmitBtn}</span>
                  </Link>

                  <Link
                    href="#showcase"
                    className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-lg bg-white text-slate-900 font-bold text-base border-2 border-slate-300 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                    <span>{t.heroShowcaseBtn}</span>
                  </Link>
                </div>

                {/* Live Civic Stats Counter */}
                <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t-2 border-slate-200">
                  <div className="p-3.5 bg-slate-50 rounded-lg border-2 border-slate-200">
                    <div className="text-xs text-slate-800 font-bold uppercase tracking-wider">{t.statsTotal}</div>
                    <div className="text-2xl font-extrabold text-slate-900 mt-1">{stats.total}</div>
                  </div>
                  <div className="p-3.5 bg-indigo-50 rounded-lg border-2 border-indigo-200">
                    <div className="text-xs text-indigo-900 font-bold uppercase tracking-wider">{t.statsInProgress}</div>
                    <div className="text-2xl font-extrabold text-indigo-950 mt-1">{stats.in_progress}</div>
                  </div>
                  <div className="p-3.5 bg-red-50 rounded-lg border-2 border-red-200">
                    <div className="text-xs text-red-900 font-bold uppercase tracking-wider">{t.statsHighPriority}</div>
                    <div className="text-2xl font-extrabold text-red-950 mt-1">{stats.high_priority}</div>
                  </div>
                  <div className="p-3.5 bg-emerald-50 rounded-lg border-2 border-emerald-200">
                    <div className="text-xs text-emerald-900 font-bold uppercase tracking-wider">{t.statsResolved}</div>
                    <div className="text-2xl font-extrabold text-emerald-950 mt-1">{stats.resolved}</div>
                  </div>
                </div>
              </div>

              {/* Right Column: Visual Civic City Banner (Replacing old 3-role cards) */}
              <div className="lg:col-span-5">
                <div className="relative rounded-2xl overflow-hidden border-2 border-slate-300 shadow-xl bg-slate-900 text-white group">
                  {/* Photo of Semey Cityscape / Suspension Bridge */}
                  <div 
                    className="h-80 sm:h-96 w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                    style={{
                      backgroundImage: `url('/images/semey/bridge.jpg')`
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

                  {/* Floating Content on the Card */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 space-y-3">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600/90 text-white text-xs font-bold shadow-md">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>ИИ-система маршрутизации г. Семей</span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-black text-white leading-snug">
                      Город слышит каждого жителя
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                      Заявки классифицируются автоматически и направляются в профильные отделы акимата и службы 109 без бюрократических задержек.
                    </p>

                    <div className="pt-2 flex items-center gap-3">
                      <Link
                        href="/map"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-slate-950 font-bold text-xs hover:bg-slate-100 transition-colors shadow-sm"
                      >
                        <Map className="w-3.5 h-3.5 text-slate-900" />
                        <span>{t.navMap}</span>
                      </Link>

                      <Link
                        href="/ideas"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/90 text-white font-bold text-xs hover:bg-slate-700 transition-colors border border-slate-600"
                      >
                        <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                        <span>{t.navIdeas}</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 3-STEP VALUE PROPOSITION */}
        <section className="py-14 bg-gray-50 border-b-2 border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                {lang === 'kz' ? 'Жұмыс принципі' : lang === 'en' ? 'How it Works' : 'Принцип работы платформы'}
              </h2>
              <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900">
                {lang === 'kz' ? 'Тұрғынның өтінішінен нақты нәтижеге дейін' : lang === 'en' ? 'From resident report to real results' : 'От сообщения жителя до реального результата'}
              </p>
              <p className="mt-2 text-sm sm:text-base text-slate-700 font-medium">
                {lang === 'kz' ? 'Аралық делдалдарсыз және ресми бас тартуларсыз ашық регламент.' : lang === 'en' ? 'Transparent workflow without middlemen or formal refusals.' : 'Прозрачный регламент без посредников и формальных отписок.'}
              </p>
            </div>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Step 1 */}
              <div className="bg-white p-6 rounded-lg border-2 border-slate-200 shadow-xs relative">
                <div className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center font-extrabold text-base mb-4">
                  1
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="w-5 h-5 text-slate-800" />
                  <h3 className="text-lg font-bold text-slate-900">
                    {lang === 'kz' ? 'Хабарлау' : lang === 'en' ? 'Report' : 'Сообщить'}
                  </h3>
                </div>
                <p className="text-sm text-slate-800 leading-relaxed font-medium">
                  {lang === 'kz' 
                    ? 'Тұрғын мәселені қарапайым сөзбен сипаттайды. Акиматтың күрделі регламенттерін білу қажет емес.'
                    : lang === 'en'
                    ? 'Citizens describe problems in plain words. No need to understand bureaucratic municipal codes.'
                    : 'Житель описывает проблему своими словами в свободной форме. Нет необходимости разбираться в юридических регламентах и структурах акимата.'}
                </p>
                <div className="mt-4 pt-3 border-t border-slate-200 text-xs font-mono font-bold text-slate-700">
                  {lang === 'kz' ? 'Формат: Мәтін + Фото + Мекенжай' : lang === 'en' ? 'Format: Text + Photo + Address' : 'Формат: Текст + Фото + Адрес'}
                </div>
              </div>

              {/* Step 2 */}
              <div className="bg-white p-6 rounded-lg border-2 border-slate-200 shadow-xs relative">
                <div className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center font-extrabold text-base mb-4">
                  2
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <Cpu className="w-5 h-5 text-slate-800" />
                  <h3 className="text-lg font-bold text-slate-900">
                    {lang === 'kz' ? 'Талдау және бағыттау' : lang === 'en' ? 'AI Routing' : 'Понять и направить'}
                  </h3>
                </div>
                <p className="text-sm text-slate-800 leading-relaxed font-medium">
                  {lang === 'kz'
                    ? 'Жасанды интеллект мәтінді ретке келтіреді, жауапты бөлімді анықтайды және шұғылдық деңгейін тағайындайды.'
                    : lang === 'en'
                    ? 'Artificial intelligence structures the complaint, identifies the responsible department, and assigns priority.'
                    : 'Искусственный интеллект очищает текст от лишних эмоций, сохраняет факты, определяет ведомство (ЖКХ, Транспорт) и назначает приоритет.'}
                </p>
                <div className="mt-4 pt-3 border-t border-slate-200 text-xs font-mono font-bold text-slate-700">
                  {lang === 'kz' ? 'Формат: Санат + Бөлім + Басымдық' : lang === 'en' ? 'Format: Category + Department + Priority' : 'Формат: Категория + Ведомство + Приоритет'}
                </div>
              </div>

              {/* Step 3 */}
              <div className="bg-white p-6 rounded-lg border-2 border-slate-200 shadow-xs relative">
                <div className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center font-extrabold text-base mb-4">
                  3
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                  <h3 className="text-lg font-bold text-slate-900">
                    {lang === 'kz' ? 'Шешу және есеп беру' : lang === 'en' ? 'Resolve & Report' : 'Решить и отчитаться'}
                  </h3>
                </div>
                <p className="text-sm text-slate-800 leading-relaxed font-medium">
                  {lang === 'kz'
                    ? 'Коммуналдық қызметтер жұмысты орындайды және фото-есеп жариялайды. Нәтиже барлық қалалықтарға көрінеді.'
                    : lang === 'en'
                    ? 'Municipal teams resolve the issue and publish verification photos. Results are visible to all city residents.'
                    : 'Муниципальные службы берут заявку в работу, устраняют проблему и публикуют фото подтверждение. Результат виден всем горожанам.'}
                </p>
                <div className="mt-4 pt-3 border-t border-slate-200 text-xs font-mono font-bold text-slate-700">
                  {lang === 'kz' ? 'Формат: ДЕЙІН/КЕЙІН фотолары' : lang === 'en' ? 'Format: BEFORE/AFTER Photos' : 'Формат: Фото ДО/ПОСЛЕ + Отчет'}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PUBLIC SHOWCASE: ЧТО ИЗМЕНИЛОСЬ В ГОРОДЕ */}
        <section id="showcase" className="py-14 bg-white border-b-2 border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ShowcaseSection resolvedRequests={resolvedRequests} />
          </div>
        </section>

        {/* RECENT REQUESTS FEED PREVIEW */}
        <section className="py-14 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b-2 border-slate-200 gap-4">
              <div>
                <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                  {lang === 'kz' ? 'Қалалық журнал' : lang === 'en' ? 'City Feed' : 'Единый городской журнал'}
                </h2>
                <p className="mt-1 text-2xl font-extrabold text-slate-900">
                  {lang === 'kz' ? 'Соңғы келіп түскен өтініштер' : lang === 'en' ? 'Recent Civic Submissions' : 'Последние поступившие обращения'}
                </p>
                <p className="text-sm text-slate-700 mt-1 font-medium">
                  {lang === 'kz' ? 'Нақты уақытта жаңартылуда • Семей қ.' : lang === 'en' ? 'Live updates • Semey city' : 'Обновление в режиме реального времени • г. Семей'}
                </p>
              </div>

              <Link
                href="/map"
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-bold rounded-lg bg-white border-2 border-slate-300 text-slate-900 hover:bg-slate-100 transition-colors shadow-2xs"
              >
                <Map className="w-4 h-4 text-slate-700" />
                <span>{t.navMap}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="mt-6 space-y-3">
              {recentRequests.map((req) => (
                <div
                  key={req.id}
                  className="bg-white p-4 sm:p-5 rounded-lg border-2 border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-slate-400 transition-colors shadow-xs"
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-extrabold text-slate-900 bg-slate-100 border border-slate-300 px-2 py-0.5 rounded">
                        {req.id}
                      </span>
                      <StatusBadge status={req.status} />
                      <PriorityBadge priority={req.priority} />
                      <DepartmentBadge department={req.department} />
                    </div>

                    <h4 className="text-base font-bold text-slate-900 truncate">
                      {req.title}
                    </h4>

                    <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-700">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-600" />
                        {req.location_address}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-600" />
                        {new Date(req.created_at).toLocaleDateString(lang === 'kz' ? 'kk-KZ' : lang === 'en' ? 'en-US' : 'ru-RU', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <Link
                      href={`/requests/${req.id}`}
                      className="px-4 py-2 text-xs font-bold rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-2xs"
                    >
                      {lang === 'kz' ? 'Толығырақ' : lang === 'en' ? 'View Details' : 'Карточка инцидента'}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
