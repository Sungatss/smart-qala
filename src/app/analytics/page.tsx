'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageHeader from '@/components/PageHeader';
import { useApp } from '@/context/AppContext';
import { getRequestStats } from '@/lib/mock-data';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Lightbulb, 
  Layers,
  ShieldAlert
} from 'lucide-react';

export default function AnalyticsPage() {
  const { t, role } = useApp();
  const isStaff = role === 'employee' || role === 'admin';

  if (!isStaff) {
    return (
      <div className="flex flex-col min-h-screen bg-muted text-foreground">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-6 py-12 flex items-center justify-center">
          <div className="max-w-md w-full p-8 bg-card border border-border rounded-xl text-center space-y-4 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground border border-border">
              <ShieldAlert className="w-6 h-6 text-warning" />
            </div>
            <h2 className="text-lg font-bold text-foreground">
              Служебная аналитика
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Детальная статистика и отчетность по городским инцидентам доступны исключительно для специалистов государственных служб и администрации города Семей.
            </p>
            <div className="pt-3 flex flex-col sm:flex-row gap-2">
              <Button asChild className="flex-1" variant="default">
                <Link href="/">На главную</Link>
              </Button>
              <Button asChild className="flex-1" variant="outline">
                <Link href="/map">Карта проблем</Link>
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const stats = getRequestStats();

  const total = stats.total || 1;
  const resolutionRate = Math.round(((stats.resolved || 0) / total) * 100);

  const categories = Object.entries(stats.by_category || {}).sort((a, b) => b[1] - a[1]);
  const districts = Object.entries(stats.by_district || {}).sort((a, b) => b[1] - a[1]);

  return (
    <div className="flex flex-col min-h-screen bg-muted text-foreground">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-6 py-8 md:py-12 space-y-6">
        
        {/* Header */}
        <PageHeader
          title={t.analyticsHeaderTitle}
          description={t.analyticsHeaderSubtitle}
        />

        {/* Top KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-card p-5 rounded-md border border-border shadow-2xs">
            <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold uppercase">
              <span>Всего обращений</span>
              <Layers className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="text-2xl font-bold text-foreground mt-2">{stats.total}</div>
            <div className="text-[11px] text-muted-foreground mt-0.5">За весь период пилота</div>
          </div>

          <div className="bg-card p-5 rounded-md border border-border shadow-2xs">
            <div className="flex items-center justify-between text-emerald-700 text-xs font-semibold uppercase">
              <span>Процент решения</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-bold text-emerald-700 mt-2">{resolutionRate}%</div>
            <div className="text-[11px] text-muted-foreground mt-0.5">{stats.resolved} заявок с фотоотчетом</div>
          </div>

          <div className="bg-card p-5 rounded-md border border-border shadow-2xs">
            <div className="flex items-center justify-between text-blue-700 text-xs font-semibold uppercase">
              <span>Среднее время ответа</span>
              <Clock className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-2xl font-bold text-blue-700 mt-2">{stats.avg_resolution_days} дня</div>
            <div className="text-[11px] text-muted-foreground mt-0.5">Норматив регламента: 3 дня</div>
          </div>

          <div className="bg-card p-5 rounded-md border border-border shadow-2xs">
            <div className="flex items-center justify-between text-indigo-700 text-xs font-semibold uppercase">
              <span>Инициатив жителей</span>
              <Lightbulb className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="text-2xl font-bold text-indigo-700 mt-2">{stats.total_ideas}</div>
            <div className="text-[11px] text-muted-foreground mt-0.5">В банке городских идей</div>
          </div>
        </div>

        {/* Detailed Breakdown Grids */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* By Category */}
          <div className="bg-card p-6 rounded-md border border-border shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
                Распределение по категориям проблем
              </h3>
              <span className="text-xs text-muted-foreground font-mono">Доля от общего числа</span>
            </div>

            <div className="space-y-3 pt-2">
              {categories.map(([cat, count]) => {
                const pct = Math.round((count / total) * 100);
                return (
                  <div key={cat} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-medium">
                      <span className="text-foreground">{cat}</span>
                      <span className="text-muted-foreground font-mono font-bold">{count} ({pct}%)</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden border border-border">
                      <div
                        className="h-full bg-primary text-primary-foreground rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* By District */}
          <div className="bg-card p-6 rounded-md border border-border shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
                Активность по районам города Семей
              </h3>
              <span className="text-xs text-muted-foreground font-mono">Концентрация заявок</span>
            </div>

            <div className="space-y-3 pt-2">
              {districts.map(([dist, count]) => {
                const pct = Math.round((count / total) * 100);
                return (
                  <div key={dist} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-medium">
                      <span className="text-foreground flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                        <span>{dist} район</span>
                      </span>
                      <span className="text-muted-foreground font-mono font-bold">{count} заявок</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden border border-border">
                      <div
                        className="h-full bg-indigo-700 rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Department Response Ranking */}
        <div className="bg-card p-6 rounded-md border border-border shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div>
              <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
                Рейтинг оперативности городских служб Семея
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Индекс соблюдения нормативных сроков устранения неполадок
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-success-soft border border-success-soft px-2 py-1 rounded">
              Общий KPI: 94.2%
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 bg-muted rounded-md border border-border">
              <div className="text-xs font-bold text-foreground">МП «Семей Водоканал» / ЖКХ</div>
              <div className="text-xs text-muted-foreground mt-1">Срочные аварии на трубопроводах</div>
              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Ср. время:</span>
                <span className="font-mono font-bold text-foreground">14 часов</span>
              </div>
            </div>

            <div className="p-4 bg-muted rounded-md border border-border">
              <div className="text-xs font-bold text-foreground">МП «Благоустройство и Горсвет»</div>
              <div className="text-xs text-muted-foreground mt-1">Освещение, скверы, малые формы</div>
              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Ср. время:</span>
                <span className="font-mono font-bold text-foreground">1.9 дня</span>
              </div>
            </div>

            <div className="p-4 bg-muted rounded-md border border-border">
              <div className="text-xs font-bold text-foreground">Отдел пассажирского транспорта</div>
              <div className="text-xs text-muted-foreground mt-1">Маршруты, расписания, остановочные пункты</div>
              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Ср. время:</span>
                <span className="font-mono font-bold text-foreground">2.4 дня</span>
              </div>
            </div>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
