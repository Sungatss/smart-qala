'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CityRequest } from '@/types';
import { useApp } from '@/context/AppContext';
import { 
  Lightbulb, 
  ThumbsUp, 
  PlusCircle, 
  MapPin, 
  ArrowRight,
  Filter
} from 'lucide-react';
import { DepartmentBadge } from '@/components/Badges';

interface IdeasClientProps {
  initialIdeas: CityRequest[];
}

export default function IdeasClient({ initialIdeas }: IdeasClientProps) {
  const { upvote, upvotedIds } = useApp();
  const [ideas, setIdeas] = useState<CityRequest[]>(initialIdeas);
  const [selectedCategory, setSelectedCategory] = useState<string>('Все');
  const [sortBy, setSortBy] = useState<'votes' | 'recent'>('votes');

  const categories = ['Все', 'Благоустройство', 'Транспорт', 'Экология'];

  const handleSupportClick = async (id: string) => {
    const newCount = await upvote(id);
    if (newCount !== null) {
      setIdeas((prev) =>
        prev.map((item) => (item.id === id ? { ...item, upvotes: newCount } : item))
      );
    }
  };

  const filteredIdeas = ideas
    .filter((idea) => {
      if (selectedCategory === 'Все') return true;
      return idea.category === selectedCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'votes') {
        return (b.upvotes || 0) - (a.upvotes || 0);
      }
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Submit CTA */}
      <div className="bg-white rounded-md border border-gray-200 p-6 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-amber-100 text-amber-800">
              <Lightbulb className="w-4 h-4 text-amber-700" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
              Банк городских инициатив • Семей
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 mt-2">
            Идеи жителей по развитию города
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Предлагайте проекты благоустройства, экологические инициативы и транспортные решения. 
            Идеи, набравшие свыше 50 голосов, передаются на прямое рассмотрение в Общественный совет и Акимат города.
          </p>
        </div>

        <Link
          href="/create?type=idea"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-md bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-colors shadow-xs shrink-0"
        >
          <PlusCircle className="w-4 h-4 text-white" />
          <span>Предложить идею</span>
        </Link>
      </div>

      {/* Filter and Sort Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-md border border-gray-200 text-xs">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="font-semibold text-slate-700 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <span>Категории:</span>
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-md transition-colors ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white font-semibold'
                  : 'bg-gray-100 text-slate-700 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-500">Сортировка:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'votes' | 'recent')}
            className="p-1.5 rounded-md border border-gray-300 bg-white text-slate-800 focus:outline-none"
          >
            <option value="votes">По популярности (голосам)</option>
            <option value="recent">По дате публикации</option>
          </select>
        </div>
      </div>

      {/* Ideas Feed */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredIdeas.map((idea) => {
          const isUpvoted = upvotedIds.has(idea.id);
          const threshold = 100;
          const currentVotes = idea.upvotes || 0;
          const progressPercent = Math.min(100, Math.round((currentVotes / threshold) * 100));

          return (
            <div
              key={idea.id}
              className="bg-white rounded-md border border-gray-200 shadow-2xs overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Photo if available */}
                {idea.photo_before_url && (
                  <div className="relative aspect-16/9 bg-gray-100 overflow-hidden border-b border-gray-200">
                    <img
                      src={idea.photo_before_url}
                      alt={idea.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2 left-2 px-2 py-0.5 text-[10px] font-bold rounded bg-indigo-900/90 text-white tracking-wide flex items-center gap-1">
                      <Lightbulb className="w-3 h-3 text-amber-300" />
                      ГОРОДСКАЯ ИДЕЯ
                    </span>
                  </div>
                )}

                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                      {idea.id}
                    </span>
                    <DepartmentBadge department={idea.department} />
                  </div>

                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {idea.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {idea.cleaned_text || idea.original_text}
                  </p>

                  <div className="flex items-center gap-1 text-xs text-slate-500 pt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{idea.location_address}</span>
                  </div>

                  {/* Progress bar towards municipal review */}
                  <div className="pt-2">
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="text-slate-500">Поддержка жителей:</span>
                      <span className="font-mono font-bold text-slate-900">
                        {currentVotes} / {threshold} голосов
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
                      <div
                        className="h-full bg-indigo-600 transition-all duration-300"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                    {progressPercent >= 50 && (
                      <span className="text-[10px] text-emerald-700 font-semibold mt-1 inline-block">
                        ✓ Набрано достаточно голосов для передачи в акимат
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => handleSupportClick(idea.id)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-md border transition-colors ${
                    isUpvoted
                      ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                      : 'bg-white border-gray-300 text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  <ThumbsUp className={`w-3.5 h-3.5 ${isUpvoted ? 'fill-indigo-600 text-indigo-600' : ''}`} />
                  <span>{isUpvoted ? 'Вы поддержали' : 'Поддержать идею'}</span>
                  <span className="font-mono font-bold ml-0.5">({currentVotes})</span>
                </button>

                <Link
                  href={`/requests/${idea.id}`}
                  className="text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-1"
                >
                  <span>Подробнее</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
