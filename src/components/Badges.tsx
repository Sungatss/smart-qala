import React from 'react';
import { PriorityLevel, RequestStatus, Department } from '@/types';
import { 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight, 
  Building, 
  ShieldAlert, 
  HelpCircle 
} from 'lucide-react';

export function StatusBadge({ status }: { status: RequestStatus }) {
  switch (status) {
    case 'new':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md bg-info-soft text-info-soft-foreground border border-info-soft">
          <Clock className="w-3.5 h-3.5 text-blue-600" />
          Новое
        </span>
      );
    case 'under_review':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md bg-warning-soft text-warning-soft-foreground border border-warning-soft">
          <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
          На рассмотрении
        </span>
      );
    case 'assigned':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md bg-purple-50 text-purple-800 border border-purple-200">
          <Building className="w-3.5 h-3.5 text-purple-600" />
          Назначено
        </span>
      );
    case 'in_progress':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md bg-info-soft text-info-soft-foreground border border-info-soft">
          <ArrowUpRight className="w-3.5 h-3.5 text-indigo-600" />
          В работе
        </span>
      );
    case 'resolved':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md bg-success-soft text-success-soft-foreground border border-success-soft">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          Решено
        </span>
      );
    default:
      return null;
  }
}

export function PriorityBadge({ priority }: { priority: PriorityLevel }) {
  switch (priority) {
    case 'high':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-md bg-danger-soft text-red-700 border border-danger-soft">
          <ShieldAlert className="w-3 h-3 text-red-600" />
          Высокий
        </span>
      );
    case 'medium':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-md bg-warning-soft text-amber-700 border border-warning-soft">
          <AlertCircle className="w-3 h-3 text-amber-600" />
          Средний
        </span>
      );
    case 'low':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-md bg-muted text-muted-foreground border border-border">
          Низкий
        </span>
      );
    default:
      return null;
  }
}

export function DepartmentBadge({ department }: { department: Department }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md bg-slate-100 text-foreground border border-border">
      <Building className="w-3.5 h-3.5 text-muted-foreground" />
      {department}
    </span>
  );
}

export function ModerationBadge({ status }: { status?: 'approved' | 'rejected' | 'flagged_inappropriate' }) {
  if (!status || status === 'approved') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md bg-success-soft text-success-soft-foreground border border-success-soft">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
        Одобрено
      </span>
    );
  }
  if (status === 'flagged_inappropriate') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md bg-amber-100 text-warning-soft-foreground border border-amber-400">
        <AlertCircle className="w-3.5 h-3.5 text-warning-soft-foreground" />
        Требует модерации
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md bg-red-100 text-danger-soft-foreground border border-danger-soft">
      <ShieldAlert className="w-3.5 h-3.5 text-red-700" />
      Отклонено
    </span>
  );
}

export function AnonymousBadge({ isAnonymous }: { isAnonymous?: boolean }) {
  if (isAnonymous) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-md bg-slate-200 text-foreground border border-slate-400">
        Анонимно
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-md bg-info-soft text-info-soft-foreground border border-info-soft">
      Верифицирован
    </span>
  );
}

