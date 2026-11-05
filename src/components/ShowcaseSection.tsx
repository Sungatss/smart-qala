'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CityRequest } from '@/types';
import { StatusBadge, DepartmentBadge } from '@/components/Badges';
import { MapPin, Calendar, CheckCircle2, ArrowRight } from 'lucide-react';

interface ShowcaseProps {
  resolvedRequests: CityRequest[];
}

export default function ShowcaseSection({ resolvedRequests }: ShowcaseProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('Все');
  const [activeTabMap, setActiveTabMap] = useState<Record<string, 'after' | 'before' | 'both'>>({});

  const categories = ['Все', 'Мусор', 'Благоустройство', 'Дороги', 'Освещение'];

  const filteredRequests = resolvedRequests.filter((r) => {
    if (selectedCategory === 'Все') return true;
    return r.category === selectedCategory;
  });

  const getActiveTab = (id: string): 'after' | 'before' | 'both' => {
    return activeTabMap[id] || 'both';
  };

  const setTab = (id: string, tab: 'after' | 'before' | 'both') => {
    setActiveTabMap((prev) => ({ ...prev, [id]: tab }));
  };

  return (
    <div>
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between pb-6 border-b-2 border-slate-200 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
              Открытый контроль результатов
            </span>
          </div>
          <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Что изменилось в городе
          </h2>
          <p className="mt-1 text-sm sm:text-base text-slate-700 max-w-2xl font-medium">
            Фотофиксация выполненных работ коммунальными службами города Семей. Прозрачный отчет перед жителями.
          </p>
        </div>

        {/* Category Filter Buttons */}
        <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100 rounded-lg border-2 border-slate-200">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-xs font-bold rounded-md transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-800 hover:text-black hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Resolved Cases */}
      {filteredRequests.length === 0 ? (
        <div className="py-12 text-center text-slate-800 bg-slate-50 rounded-lg border-2 border-dashed border-slate-300 mt-6">
          <CheckCircle2 className="w-10 h-10 text-slate-600 mx-auto mb-2" />
          <p className="text-sm font-bold">Нет завершенных инцидентов в данной категории.</p>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredRequests.map((req) => {
            const currentTab = getActiveTab(req.id);
            return (
              <div
                key={req.id}
                className="bg-white rounded-lg border-2 border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between"
              >
                <div>
                  {/* Card Header */}
                  <div className="p-4 sm:p-5 border-b-2 border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-extrabold text-slate-900 bg-white border border-slate-300 px-2.5 py-1 rounded">
                        {req.id}
                      </span>
                      <StatusBadge status={req.status} />
                      <DepartmentBadge department={req.department} />
                    </div>

                    <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-700">
                      <Calendar className="w-3.5 h-3.5 text-slate-600" />
                      <span>
                        Решено: {req.resolved_at ? new Date(req.resolved_at).toLocaleDateString('ru-RU') : 'Недавно'}
                      </span>
                    </div>
                  </div>

                  {/* Incident Title & Address */}
                  <div className="p-4 sm:p-5 pb-3">
                    <h3 className="text-lg font-bold text-slate-900">
                      {req.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                      <span>{req.location_address}</span>
                    </div>
                  </div>

                  {/* Photo Comparison Display */}
                  <div className="px-4 sm:px-5">
                    {/* View mode toggle */}
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200 text-xs">
                      <span className="font-bold text-slate-800">Фотофиксация:</span>
                      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-300">
                        <button
                          onClick={() => setTab(req.id, 'both')}
                          className={`px-3 py-1 text-xs rounded transition-colors cursor-pointer ${
                            currentTab === 'both' ? 'bg-slate-900 font-bold text-white shadow-2xs' : 'text-slate-800 font-semibold'
                          }`}
                        >
                          Сравнение (До и После)
                        </button>
                        <button
                          onClick={() => setTab(req.id, 'before')}
                          className={`px-3 py-1 text-xs rounded transition-colors cursor-pointer ${
                            currentTab === 'before' ? 'bg-slate-900 font-bold text-white shadow-2xs' : 'text-slate-800 font-semibold'
                          }`}
                        >
                          Было
                        </button>
                        <button
                          onClick={() => setTab(req.id, 'after')}
                          className={`px-3 py-1 text-xs rounded transition-colors cursor-pointer ${
                            currentTab === 'after' ? 'bg-slate-900 font-bold text-white shadow-2xs' : 'text-slate-800 font-semibold'
                          }`}
                        >
                          Стало
                        </button>
                      </div>
                    </div>

                    {/* Image Renderers */}
                    {currentTab === 'both' ? (
                      <div className="grid grid-cols-2 gap-3">
                        {/* Before */}
                        <div className="relative rounded-lg overflow-hidden border-2 border-slate-300 aspect-4/3 bg-slate-100">
                          <img
                            src={req.photo_before_url || 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80'}
                            alt="Состояние до устранения"
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute top-2 left-2 px-2 py-0.5 text-xs font-extrabold rounded bg-slate-900 text-white tracking-wide shadow-xs">
                            ДО
                          </span>
                        </div>

                        {/* After */}
                        <div className="relative rounded-lg overflow-hidden border-2 border-emerald-400 aspect-4/3 bg-slate-100">
                          <img
                            src={req.photo_after_url || 'https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?auto=format&fit=crop&w=600&q=80'}
                            alt="Состояние после устранения"
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute top-2 left-2 px-2 py-0.5 text-xs font-extrabold rounded bg-emerald-700 text-white tracking-wide shadow-xs">
                            ПОСЛЕ
                          </span>
                        </div>
                      </div>
                    ) : currentTab === 'before' ? (
                      <div className="relative rounded-lg overflow-hidden border-2 border-slate-300 aspect-16/9 bg-slate-100">
                        <img
                          src={req.photo_before_url || 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80'}
                          alt="Состояние до устранения"
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-2 left-2 px-2.5 py-1 text-xs font-extrabold rounded bg-slate-900 text-white tracking-wide shadow-xs">
                          СОСТОЯНИЕ ДО ВЫПОЛНЕНИЯ РАБОТ
                        </span>
                      </div>
                    ) : (
                      <div className="relative rounded-lg overflow-hidden border-2 border-emerald-400 aspect-16/9 bg-slate-100">
                        <img
                          src={req.photo_after_url || 'https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?auto=format&fit=crop&w=800&q=80'}
                          alt="Состояние после устранения"
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-2 left-2 px-2.5 py-1 text-xs font-extrabold rounded bg-emerald-700 text-white tracking-wide shadow-xs">
                          РЕЗУЛЬТАТ: РАБОТЫ ВЫПОЛНЕНЫ
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Official Resolution Report */}
                  <div className="p-4 sm:p-5 pt-3">
                    <div className="p-4 bg-emerald-50 rounded-lg border-2 border-emerald-300 text-sm">
                      <div className="font-extrabold text-emerald-950 flex items-center gap-1.5 mb-1">
                        <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                        <span>Отчет об устранении проблемы:</span>
                      </div>
                      <p className="text-emerald-950 leading-relaxed font-medium">
                        {req.resolution_report || 'Работы по обращению выполнены в полном объеме в соответствии с регламентом.'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer link to detail */}
                <div className="px-4 sm:px-5 py-3.5 bg-slate-50 border-t-2 border-slate-200 flex items-center justify-between text-xs font-bold">
                  <span className="text-xs font-mono text-slate-700">
                    ДЕМОНСТРАЦИОННЫЕ ДАННЫЕ / СЕМЕЙ
                  </span>
                  <Link
                    href={`/requests/${req.id}`}
                    className="inline-flex items-center gap-1.5 font-bold text-slate-900 hover:text-black hover:underline"
                  >
                    <span>Подробнее</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

