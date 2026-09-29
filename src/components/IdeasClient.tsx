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
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';

interface IdeasClientProps {
  initialIdeas: CityRequest[];
}

export default function IdeasClient({ initialIdeas }: IdeasClientProps) {
  const { upvote, upvotedIds, t } = useApp();
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
      
      {/* Page Header */}
      <PageHeader
        title={t.ideasHeaderTitle}
        description={t.ideasHeaderSubtitle}
        actions={
          <Button asChild size="sm" className="h-9 gap-1.5 px-3.5 text-xs font-medium">
            <Link href="/create?type=idea">
              <PlusCircle className="h-4 w-4" />
              <span>{t.createTypeIdea}</span>
            </Link>
          </Button>
        }
      />

      {/* Filter and Sort Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card p-3.5 rounded-md border border-gray-200 text-xs">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="font-semibold text-muted-foreground mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-muted-foreground" />
            <span>Категории:</span>
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-md transition-colors ${
                selectedCategory === cat
                  ? 'bg-primary text-primary-foreground font-semibold'
                  : 'bg-gray-100 text-muted-foreground hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Сортировка:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'votes' | 'recent')}
            className="p-1.5 rounded-md border border-gray-300 bg-card text-foreground focus:outline-none"
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
              className="bg-card rounded-md border border-gray-200 shadow-2xs overflow-hidden flex flex-col justify-between"
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
                    <span className="font-mono text-xs font-bold text-foreground bg-slate-100 px-2 py-0.5 rounded">
                      {idea.id}
                    </span>
                    <DepartmentBadge department={idea.department} />
                  </div>

                  <h3 className="text-base font-bold text-foreground leading-snug">
                    {idea.title}
                  </h3>

                  <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                    {idea.cleaned_text || idea.original_text}
                  </p>

                  <div className="flex items-center gap-1 text-xs text-muted-foreground pt-1">
                    <MapPin className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    <span className="truncate">{idea.location_address}</span>
                  </div>

                  {/* Progress bar towards municipal review */}
                  <div className="pt-2">
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="text-muted-foreground">Поддержка жителей:</span>
                      <span className="font-mono font-bold text-foreground">
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
              <div className="p-4 bg-muted border-t border-gray-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => handleSupportClick(idea.id)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-md border transition-colors ${
                    isUpvoted
                      ? 'bg-info-soft border-info-soft text-indigo-700'
                      : 'bg-card border-gray-300 text-foreground hover:bg-slate-100'
                  }`}
                >
                  <ThumbsUp className={`w-3.5 h-3.5 ${isUpvoted ? 'fill-indigo-600 text-indigo-600' : ''}`} />
                  <span>{isUpvoted ? 'Вы поддержали' : 'Поддержать идею'}</span>
                  <span className="font-mono font-bold ml-0.5">({currentVotes})</span>
                </button>

                <Link
                  href={`/requests/${idea.id}`}
                  className="text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1"
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
