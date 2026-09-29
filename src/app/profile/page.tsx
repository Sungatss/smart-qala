'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useApp } from '@/context/AppContext';
import { CityRequest } from '@/types';
import PageHeader from '@/components/PageHeader';
import { StatusBadge, PriorityBadge, DepartmentBadge } from '@/components/Badges';
import { 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  PlusCircle, 
  ThumbsUp, 
  ArrowRight
} from 'lucide-react';

export default function ProfilePage() {
  const { user, upvotedIds, t } = useApp();
  const [userRequests, setUserRequests] = useState<CityRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterTab, setFilterTab] = useState<'all' | 'in_progress' | 'resolved' | 'ideas'>('all');

  useEffect(() => {
    fetch('/api/requests')
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          // If citizen, filter by author or show assigned/curated requests
          const all: CityRequest[] = json.data;
          const my = all.filter((r) => r.author_id === user.id || r.author_name?.includes(user.name.split(' ')[0]));
          // If no specific match, show representative sample
          setUserRequests(my.length > 0 ? my : all.slice(0, 3));
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [user.id, user.name]);

  const filtered = userRequests.filter((r) => {
    if (filterTab === 'in_progress') return r.status === 'in_progress' || r.status === 'assigned' || r.status === 'under_review';
    if (filterTab === 'resolved') return r.status === 'resolved';
    if (filterTab === 'ideas') return r.type === 'idea';
    return true;
  });

  return (
    <div className="flex flex-col min-h-screen bg-muted text-foreground">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-6 py-8 md:py-12 space-y-6">
        
        {/* Page Header */}
        <PageHeader
          title={t.profileHeaderTitle}
          description={t.profileHeaderSubtitle}
        />

        {/* Profile Card Header */}
        <div className="bg-card rounded-md border border-border p-6 shadow-2xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-md bg-primary text-primary-foreground flex items-center justify-center font-bold text-2xl shrink-0">
                {user.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-extrabold text-foreground">
                    {user.name}
                  </h1>
                  <span className="px-2 py-0.5 text-xs font-semibold rounded bg-muted text-foreground border border-border">
                    {user.roleTitle}
                  </span>
                </div>
                
                <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground mt-2">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                    <span>г. Семей, район {user.district}</span>
                  </span>
                  <span>•</span>
                  <span>{user.email}</span>
                  <span>•</span>
                  <span>{user.phone}</span>
                </div>
              </div>
            </div>

            {/* Quick action buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="/create"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-xs"
              >
                <PlusCircle className="w-4 h-4 text-white" />
                <span>Новое обращение</span>
              </Link>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-border">
            <div className="p-3 bg-muted rounded-md border border-border">
              <div className="text-[11px] font-semibold text-muted-foreground uppercase">Подано обращений</div>
              <div className="text-xl font-bold text-foreground mt-0.5">{userRequests.length}</div>
            </div>
            <div className="p-3 bg-muted rounded-md border border-border">
              <div className="text-[11px] font-semibold text-info-soft-foreground uppercase">В работе</div>
              <div className="text-xl font-bold text-info-soft-foreground mt-0.5">
                {userRequests.filter((r) => r.status === 'in_progress' || r.status === 'assigned').length}
              </div>
            </div>
            <div className="p-3 bg-muted rounded-md border border-border">
              <div className="text-[11px] font-semibold text-success-soft-foreground uppercase">Успешно решено</div>
              <div className="text-xl font-bold text-success-soft-foreground mt-0.5">
                {userRequests.filter((r) => r.status === 'resolved').length}
              </div>
            </div>
            <div className="p-3 bg-muted rounded-md border border-border">
              <div className="text-[11px] font-semibold text-muted-foreground uppercase">Поддержано чужих тем</div>
              <div className="text-xl font-bold text-foreground mt-0.5">{upvotedIds.size}</div>
            </div>
          </div>
        </div>

        {/* My Requests Section */}
        <div className="bg-card rounded-md border border-border p-6 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border gap-3">
            <div>
              <h2 className="text-lg font-bold text-foreground">
                Мои зарегистрированные обращения и идеи
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Отслеживание этапов рассмотрения и фотоотчетов городских служб
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 bg-muted p-1 rounded-md text-xs">
              <button
                type="button"
                onClick={() => setFilterTab('all')}
                className={`px-3 py-1 rounded transition-colors ${
                  filterTab === 'all' ? 'bg-card text-foreground font-semibold shadow-2xs' : 'text-muted-foreground'
                }`}
              >
                Все ({userRequests.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterTab('in_progress')}
                className={`px-3 py-1 rounded transition-colors ${
                  filterTab === 'in_progress' ? 'bg-card text-foreground font-semibold shadow-2xs' : 'text-muted-foreground'
                }`}
              >
                В работе
              </button>
              <button
                type="button"
                onClick={() => setFilterTab('resolved')}
                className={`px-3 py-1 rounded transition-colors ${
                  filterTab === 'resolved' ? 'bg-card text-foreground font-semibold shadow-2xs' : 'text-muted-foreground'
                }`}
              >
                Решенные
              </button>
              <button
                type="button"
                onClick={() => setFilterTab('ideas')}
                className={`px-3 py-1 rounded transition-colors ${
                  filterTab === 'ideas' ? 'bg-card text-foreground font-semibold shadow-2xs' : 'text-muted-foreground'
                }`}
              >
                Идеи
              </button>
            </div>
          </div>

          {/* List of Requests */}
          {loading ? (
            <div className="py-12 text-center text-xs text-muted-foreground">Загрузка обращений...</div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground bg-muted rounded-md border border-dashed border-border">
              <CheckCircle2 className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-xs font-medium">Нет обращений в данной вкладке.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((req) => (
                <div
                  key={req.id}
                  className="bg-card p-4 sm:p-5 rounded-md border border-border hover:border-border/80 transition-colors space-y-4"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-foreground bg-muted px-2 py-0.5 rounded border border-border">
                        {req.id}
                      </span>
                      <StatusBadge status={req.status} />
                      <PriorityBadge priority={req.priority} />
                      <DepartmentBadge department={req.department} />
                    </div>

                    <div className="flex items-center gap-2 text-[11px] font-mono text-muted-foreground">
                      <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                      <span>{new Date(req.created_at).toLocaleDateString('ru-RU')}</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-foreground">
                      {req.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                      {req.cleaned_text}
                    </p>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-2">
                      <MapPin className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                      <span>{req.location_address}</span>
                    </div>
                  </div>

                  {/* Lifecycle Stepper */}
                  <div className="pt-3 border-t border-border">
                    <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                      Этап исполнения:
                    </div>
                    <div className="grid grid-cols-4 gap-1 text-[11px]">
                      <div className="p-2 rounded bg-primary text-primary-foreground font-medium text-center">
                        1. Зарегистрировано
                      </div>
                      <div className={`p-2 rounded text-center font-medium ${
                        req.status !== 'new' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                      }`}>
                        2. Назначено в отдел
                      </div>
                      <div className={`p-2 rounded text-center font-medium ${
                        req.status === 'in_progress' || req.status === 'resolved' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                      }`}>
                        3. Бригада на выезде
                      </div>
                      <div className={`p-2 rounded text-center font-medium ${
                        req.status === 'resolved' ? 'bg-emerald-600 text-white' : 'bg-muted text-muted-foreground'
                      }`}>
                        4. Устранено с фото
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <ThumbsUp className="w-3.5 h-3.5 text-muted-foreground" />
                      <span>Поддержали жители: <b>{req.upvotes || 1}</b></span>
                    </span>

                    <Link
                      href={`/requests/${req.id}`}
                      className="inline-flex items-center gap-1 font-semibold text-foreground hover:underline"
                    >
                      <span>Открыть карточку с фото</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </main>

      <Footer />
    </div>
  );
}
