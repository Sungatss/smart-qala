import React from 'react';
import { PriorityLevel, RequestStatus, Department } from '@/types';
import { Badge } from '@/components/ui/badge';
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
        <Badge variant="info" className="gap-1.5 py-1 font-medium">
          <Clock className="w-3.5 h-3.5 text-blue-600" />
          Новое
        </Badge>
      );
    case 'under_review':
      return (
        <Badge variant="warning" className="gap-1.5 py-1 font-medium">
          <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
          На рассмотрении
        </Badge>
      );
    case 'assigned':
      return (
        <Badge variant="info" className="gap-1.5 py-1 font-medium">
          <Building className="w-3.5 h-3.5" />
          Назначено
        </Badge>
      );
    case 'in_progress':
      return (
        <Badge variant="info" className="gap-1.5 py-1 font-medium">
          <ArrowUpRight className="w-3.5 h-3.5" />
          В работе
        </Badge>
      );
    case 'resolved':
      return (
        <Badge variant="success" className="gap-1.5 py-1 font-medium">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Решено
        </Badge>
      );
    default:
      return null;
  }
}

export function PriorityBadge({ priority }: { priority: PriorityLevel }) {
  switch (priority) {
    case 'high':
      return (
        <Badge variant="danger" className="gap-1 font-semibold">
          <ShieldAlert className="w-3 h-3 text-red-600" />
          Высокий
        </Badge>
      );
    case 'medium':
      return (
        <Badge variant="warning" className="gap-1 font-semibold">
          <AlertCircle className="w-3 h-3 text-amber-600" />
          Средний
        </Badge>
      );
    case 'low':
      return (
        <Badge variant="outline" className="gap-1 font-semibold bg-muted text-muted-foreground border-border">
          Низкий
        </Badge>
      );
    default:
      return null;
  }
}

export function DepartmentBadge({ department }: { department: Department }) {
  return (
    <Badge variant="outline" className="gap-1.5 py-1 font-semibold bg-muted text-foreground border-border">
      <Building className="w-3.5 h-3.5 text-muted-foreground" />
      {department}
    </Badge>
  );
}

export function ModerationBadge({ status }: { status?: 'approved' | 'rejected' | 'flagged_inappropriate' }) {
  if (!status || status === 'approved') {
    return (
      <Badge variant="success" className="gap-1.5 py-1 font-semibold">
        <CheckCircle2 className="w-3.5 h-3.5 text-success" />
        Одобрено
      </Badge>
    );
  }
  if (status === 'flagged_inappropriate') {
    return (
      <Badge variant="warning" className="gap-1.5 py-1 font-semibold">
        <AlertCircle className="w-3.5 h-3.5 text-warning-soft-foreground" />
        Требует модерации
      </Badge>
    );
  }
  return (
    <Badge variant="danger" className="gap-1.5 py-1 font-semibold">
      <ShieldAlert className="w-3.5 h-3.5 text-danger" />
      Отклонено
    </Badge>
  );
}

export function AnonymousBadge({ isAnonymous }: { isAnonymous?: boolean }) {
  if (isAnonymous) {
    return (
      <Badge variant="outline" className="gap-1 font-semibold bg-muted text-foreground border-border">
        Анонимно
      </Badge>
    );
  }
  return (
    <Badge variant="info" className="gap-1 font-semibold">
      Верифицирован
    </Badge>
  );
}
