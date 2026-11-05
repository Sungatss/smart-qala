import type { CityRequest, RequestStatus, RequestType } from '@/types';

export const CALENDAR_TIME_ZONE = 'Asia/Almaty';

const submissionDateFormatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: CALENDAR_TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

export function isCalendarDate(value: string | null | undefined): value is string {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T12:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

/** Group timestamps by the city's date, independently of the browser's timezone. */
export function getSubmissionDate(timestamp: string): string | null {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return null;
  const parts = submissionDateFormatter.formatToParts(date);
  const part = (type: Intl.DateTimeFormatPartTypes) => parts.find((item) => item.type === type)?.value;
  return `${part('year')}-${part('month')}-${part('day')}`;
}

export function shiftCalendarDate(date: string, days: number): string {
  const shifted = new Date(`${date}T12:00:00Z`);
  shifted.setUTCDate(shifted.getUTCDate() + days);
  return shifted.toISOString().slice(0, 10);
}

export function shiftCalendarMonth(date: string, months: number): string {
  const shifted = new Date(`${date.slice(0, 7)}-01T12:00:00Z`);
  shifted.setUTCMonth(shifted.getUTCMonth() + months);
  return shifted.toISOString().slice(0, 10);
}

/** Six complete Monday-first weeks, including adjacent-month dates. */
export function getCalendarDays(month: string): string[] {
  const first = `${month.slice(0, 7)}-01`;
  const weekday = new Date(`${first}T12:00:00Z`).getUTCDay();
  const start = shiftCalendarDate(first, -((weekday + 6) % 7));
  return Array.from({ length: 42 }, (_, index) => shiftCalendarDate(start, index));
}

export function formatCalendarDate(
  date: string,
  locale: string,
  options: Intl.DateTimeFormatOptions,
): string {
  return new Intl.DateTimeFormat(locale, { ...options, timeZone: 'UTC' })
    .format(new Date(`${date}T12:00:00Z`));
}

export interface CalendarFilters {
  type: RequestType | 'all';
  status: RequestStatus | 'all';
  query: string;
}

export function filterCalendarRequests(requests: CityRequest[], filters: CalendarFilters): CityRequest[] {
  const query = filters.query.trim().toLocaleLowerCase();
  return requests.filter((request) => {
    if (filters.type !== 'all' && request.type !== filters.type) return false;
    if (filters.status !== 'all' && request.status !== filters.status) return false;
    return !query || [request.id, request.title, request.location_address]
      .some((value) => value.toLocaleLowerCase().includes(query));
  }).sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at));
}

export function groupCalendarRequests(requests: CityRequest[]): Map<string, CityRequest[]> {
  const grouped = new Map<string, CityRequest[]>();
  for (const request of requests) {
    const date = getSubmissionDate(request.created_at);
    if (!date) continue;
    const cards = grouped.get(date) || [];
    cards.push(request);
    grouped.set(date, cards);
  }
  return grouped;
}
