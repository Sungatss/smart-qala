'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import Link from 'next/link';
import {
  CalendarDays, CheckCircle2, ChevronLeft, ChevronRight, Lightbulb,
  MapPin, PlusCircle, RefreshCw, Search,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import type { CityRequest, RequestStatus, RequestType } from '@/types';
import {
  CALENDAR_TIME_ZONE, filterCalendarRequests, formatCalendarDate,
  getCalendarDays, getSubmissionDate, groupCalendarRequests,
  isCalendarDate, shiftCalendarDate, shiftCalendarMonth,
} from '@/lib/calendar';
import { cn } from '@/lib/utils';
import PageHeader from '@/components/PageHeader';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';

interface CalendarClientProps {
  initialRequests: CityRequest[];
  initialDate: string;
  today: string;
  createdRequestId?: string;
}

export default function CalendarClient({
  initialRequests, initialDate, today, createdRequestId,
}: CalendarClientProps) {
  const { t, lang } = useApp();
  const copy = t.calendar;
  const locale = { ru: 'ru-RU', kz: 'kk-KZ', en: 'en-GB' }[lang];
  const [requests, setRequests] = useState(initialRequests);
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [type, setType] = useState<RequestType | 'all'>('all');
  const [status, setStatus] = useState<RequestStatus | 'all'>('all');
  const [query, setQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshError, setRefreshError] = useState(false);
  const dayButtons = useRef(new Map<string, HTMLButtonElement>());
  const focusSelectedDay = useRef(false);

  const loadRequests = useCallback(async (signal?: AbortSignal) => {
    setIsRefreshing(true);
    try {
      const response = await fetch('/api/requests', { cache: 'no-store', signal });
      if (!response.ok) throw new Error('Calendar refresh failed');
      const result = await response.json();
      if (!result.success || !Array.isArray(result.data)) throw new Error('Invalid calendar response');
      if (!signal?.aborted) {
        setRequests(result.data);
        setRefreshError(false);
      }
    } catch {
      if (!signal?.aborted) setRefreshError(true);
    } finally {
      if (!signal?.aborted) setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const refresh = () => { void loadRequests(controller.signal); };
    refresh();
    window.addEventListener('focus', refresh);
    return () => {
      controller.abort();
      window.removeEventListener('focus', refresh);
    };
  }, [loadRequests]);

  useEffect(() => {
    if (focusSelectedDay.current) {
      dayButtons.current.get(selectedDate)?.focus();
      focusSelectedDay.current = false;
    }
  }, [selectedDate]);

  const filtered = useMemo(
    () => filterCalendarRequests(requests, { type, status, query }),
    [requests, type, status, query],
  );
  const grouped = useMemo(() => groupCalendarRequests(filtered), [filtered]);
  const month = `${selectedDate.slice(0, 7)}-01`;
  const days = getCalendarDays(month);
  const selectedCards = grouped.get(selectedDate) || [];
  const monthCardCount = [...grouped.entries()]
    .filter(([date]) => date.slice(0, 7) === month.slice(0, 7))
    .reduce((count, [, cards]) => count + cards.length, 0);
  const latestDate = filtered.map((card) => getSubmissionDate(card.created_at)).find(Boolean);
  const hasFilters = type !== 'all' || status !== 'all' || query.trim() !== '';
  const createHref = `/create?from=calendar${type === 'idea' ? '&type=idea' : ''}`;
  const statuses: Record<RequestStatus, string> = {
    new: t.statusNew,
    under_review: copy.underReview,
    assigned: copy.assigned,
    in_progress: t.statusInProgress,
    resolved: t.statusResolved,
  };

  const handleDayKey = (event: KeyboardEvent<HTMLButtonElement>, date: string) => {
    const weekday = (new Date(`${date}T12:00:00Z`).getUTCDay() + 6) % 7;
    const offsets: Record<string, number> = {
      ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7,
      Home: -weekday, End: 6 - weekday,
    };
    let next: string;
    if (event.key === 'PageUp' || event.key === 'PageDown') {
      next = shiftCalendarMonth(date, event.key === 'PageUp' ? -1 : 1);
    } else if (event.key in offsets) {
      next = shiftCalendarDate(date, offsets[event.key]);
    } else {
      return;
    }
    event.preventDefault();
    focusSelectedDay.current = true;
    setSelectedDate(next);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={copy.title}
        description={copy.description}
        actions={
          <Button asChild>
            <Link href={createHref}><PlusCircle />{copy.addCard}</Link>
          </Button>
        }
      />

      {createdRequestId && (
        <div role="status" className="flex flex-wrap items-center gap-2 rounded-xl border border-border bg-success-soft p-4 text-sm text-success-soft-foreground">
          <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{copy.created}</span>
          <Link href={`/requests/${createdRequestId}`} className="font-medium underline underline-offset-4">
            {copy.openCard} · {createdRequestId}
          </Link>
        </div>
      )}

      {refreshError && (
        <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-warning-soft p-4 text-sm text-warning-soft-foreground">
          <p>{copy.refreshError}</p>
          <Button variant="outline" size="sm" disabled={isRefreshing} onClick={() => void loadRequests()}>{copy.retry}</Button>
        </div>
      )}

      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 md:flex-row md:items-end">
        <div className="min-w-0 flex-1 space-y-2">
          <label htmlFor="calendar-search" className="text-sm font-medium">{copy.search}</label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <Input id="calendar-search" type="search" className="pl-9" placeholder={copy.searchPlaceholder} value={query} onChange={(event) => setQuery(event.target.value)} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 md:w-auto md:min-w-80">
          <div className="min-w-0 space-y-2">
            <label htmlFor="calendar-type" className="text-sm font-medium">{copy.typeFilter}</label>
            <Select value={type} onValueChange={(value) => setType(value as RequestType | 'all')}>
              <SelectTrigger id="calendar-type"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{copy.allTypes}</SelectItem>
                <SelectItem value="problem">{copy.problems}</SelectItem>
                <SelectItem value="idea">{copy.ideas}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="min-w-0 space-y-2">
            <label htmlFor="calendar-status" className="text-sm font-medium">{copy.statusFilter}</label>
            <Select value={status} onValueChange={(value) => setStatus(value as RequestStatus | 'all')}>
              <SelectTrigger id="calendar-status"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{copy.allStatuses}</SelectItem>
                {Object.entries(statuses).map(([value, label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
        {hasFilters && (
          <Button variant="ghost" onClick={() => { setType('all'); setStatus('all'); setQuery(''); }}>{copy.clearFilters}</Button>
        )}
      </div>

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <section className="min-w-0 overflow-hidden rounded-2xl border border-border bg-card" aria-label={copy.month}>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-4">
            <div>
              <h2 className="text-lg font-semibold capitalize" aria-live="polite">{formatCalendarDate(month, locale, { month: 'long', year: 'numeric' })}</h2>
              <p className="text-xs tabular-nums text-muted-foreground" aria-live="polite">{copy.cards}: {monthCardCount}</p>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="sm" onClick={() => setSelectedDate(getSubmissionDate(new Date().toISOString())!)}>{copy.today}</Button>
              <Button variant="ghost" size="icon" aria-label={copy.previousMonth} onClick={() => setSelectedDate(shiftCalendarMonth(month, -1))}><ChevronLeft /></Button>
              <Button variant="ghost" size="icon" aria-label={copy.nextMonth} onClick={() => setSelectedDate(shiftCalendarMonth(month, 1))}><ChevronRight /></Button>
              <Button variant="ghost" size="icon" aria-label={copy.refresh} disabled={isRefreshing} onClick={() => void loadRequests()}>
                <RefreshCw className={cn(isRefreshing && 'motion-safe:animate-spin')} />
              </Button>
            </div>
            <div className="flex w-full items-center gap-3">
              <label htmlFor="calendar-month" className="text-xs text-muted-foreground">{copy.month}</label>
              <Input id="calendar-month" type="month" className="w-auto max-w-full" value={month.slice(0, 7)} onChange={(event) => {
                const date = `${event.target.value}-01`;
                if (isCalendarDate(date)) setSelectedDate(date);
              }} />
            </div>
          </div>

          <div className="grid grid-cols-7 border-b border-border bg-muted/50">
            {days.slice(0, 7).map((date) => (
              <div key={date} className="min-w-0 py-3 text-center text-xs font-medium text-muted-foreground">
                <abbr title={formatCalendarDate(date, locale, { weekday: 'long' })} className="no-underline">
                  {formatCalendarDate(date, locale, { weekday: 'short' })}
                </abbr>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-px bg-border p-px" aria-label={copy.selectedDay}>
            {days.map((date) => {
              const cards = grouped.get(date) || [];
              const isSelected = date === selectedDate;
              const inMonth = date.slice(0, 7) === month.slice(0, 7);
              return (
                <Button
                  key={date}
                  ref={(node) => { if (node) dayButtons.current.set(date, node); else dayButtons.current.delete(date); }}
                  variant="ghost"
                  tabIndex={isSelected ? 0 : -1}
                  aria-pressed={isSelected}
                  aria-current={date === today ? 'date' : undefined}
                  aria-label={`${formatCalendarDate(date, locale, { dateStyle: 'full' })}. ${copy.cards}: ${cards.length}`}
                  onClick={() => setSelectedDate(date)}
                  onKeyDown={(event) => handleDayKey(event, date)}
                  className={cn(
                    'h-auto min-h-20 min-w-0 flex-col items-stretch justify-start gap-2 whitespace-normal rounded-none bg-card p-1.5 text-left shadow-none sm:min-h-32 sm:p-2 focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-inset',
                    !inMonth && 'bg-muted text-muted-foreground',
                    isSelected && 'bg-accent ring-2 ring-inset ring-ring',
                  )}
                >
                  <span className="flex items-center justify-between gap-1">
                    <span className={cn('flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-xs tabular-nums sm:text-sm', date === today && 'bg-primary font-semibold text-primary-foreground')}>
                      {Number(date.slice(-2))}
                    </span>
                    {cards.length > 0 && <span className="hidden text-xs tabular-nums text-muted-foreground sm:inline">{cards.length}</span>}
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col gap-1">
                    {cards.slice(0, 2).map((card) => (
                      <span key={card.id} className="hidden min-w-0 items-center gap-1 rounded border border-border bg-background px-1 py-1 text-xs sm:flex" title={card.title}>
                        {card.type === 'idea' ? <Lightbulb className="h-3 w-3 shrink-0" /> : <MapPin className="h-3 w-3 shrink-0" />}
                        <span className="truncate font-normal">{card.title}</span>
                      </span>
                    ))}
                    {cards.length > 0 && <span className="text-center text-xs tabular-nums sm:hidden">{cards.length}</span>}
                    {cards.length > 2 && <span className="hidden text-xs font-normal text-muted-foreground sm:block">{copy.more}: {cards.length - 2}</span>}
                  </span>
                </Button>
              );
            })}
          </div>

          {monthCardCount === 0 && (
            <div className="space-y-3 border-t border-border p-4 text-center text-sm text-muted-foreground">
              <p>{copy.emptyMonth}</p>
              {latestDate && <Button variant="outline" size="sm" onClick={() => setSelectedDate(latestDate)}>{copy.latestCard}</Button>}
            </div>
          )}
        </section>

        <section className="min-w-0 space-y-4 rounded-2xl border border-border bg-card p-4" aria-label={copy.selectedDay}>
          <div className="space-y-1 border-b border-border pb-4" aria-live="polite">
            <p className="text-xs font-medium text-muted-foreground">{copy.selectedDay}</p>
            <h2 className="text-lg font-semibold">{formatCalendarDate(selectedDate, locale, { day: 'numeric', month: 'long', year: 'numeric' })}</h2>
            <p className="text-sm tabular-nums text-muted-foreground">{copy.cards}: {selectedCards.length}</p>
          </div>

          {selectedCards.length === 0 ? (
            <div className="space-y-3 py-6 text-center text-muted-foreground">
              <CalendarDays className="mx-auto h-8 w-8" aria-hidden="true" />
              <p className="text-sm">{copy.emptyDay}</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {selectedCards.map((card) => (
                <li key={card.id}>
                  <Link href={`/requests/${card.id}`} className="block space-y-3 rounded-xl border border-border p-4 transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                      <span className="tabular-nums">{card.id}</span>
                      <time dateTime={card.created_at}>{new Intl.DateTimeFormat(locale, { timeZone: CALENDAR_TIME_ZONE, hour: '2-digit', minute: '2-digit' }).format(new Date(card.created_at))}</time>
                    </div>
                    <h3 className="break-words text-sm font-semibold">{card.title}</h3>
                    <p className="flex items-start gap-1.5 text-xs text-muted-foreground"><MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />{card.location_address}</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">{card.type === 'idea' ? copy.ideas : copy.problems}</Badge>
                      <Badge variant={card.status === 'resolved' ? 'success' : 'secondary'}>{statuses[card.status]}</Badge>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}

          <div className="space-y-2 border-t border-border pt-4">
            <Button asChild className="w-full"><Link href={createHref}><PlusCircle />{copy.addCard}</Link></Button>
            <p className="text-xs leading-relaxed text-muted-foreground">{copy.creationHint}</p>
          </div>
        </section>
      </div>
    </div>
  );
}
