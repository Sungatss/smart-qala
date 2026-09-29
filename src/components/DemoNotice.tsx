'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { Info, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DemoNotice() {
  const { t } = useApp();
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    try {
      const isDismissed = sessionStorage.getItem('smart_qala_demo_notice_dismissed');
      if (!isDismissed) {
        setDismissed(false);
      }
    } catch {
      setDismissed(false);
    }
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    try {
      sessionStorage.setItem('smart_qala_demo_notice_dismissed', 'true');
    } catch {
      // ignore storage errors
    }
  };

  if (dismissed) return null;

  return (
    <aside 
      aria-label={t.demoNoticeBadge} 
      className="border-b border-border bg-muted/80 text-foreground transition-all"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 px-4 py-1.5 md:px-6 text-xs">
        <div className="flex items-center gap-2 min-w-0">
          <Info className="h-3.5 w-3.5 text-info shrink-0" />
          <span className="font-semibold text-foreground shrink-0 text-[11px] sm:text-xs">
            {t.demoNoticeBadge}:
          </span>
          <span className="text-muted-foreground truncate text-[11px] sm:text-xs">
            {t.demoNoticeText}
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDismiss}
          className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground shrink-0"
          aria-label={t.demoNoticeDismiss}
        >
          <span className="hidden sm:inline mr-1 text-[11px]">{t.demoNoticeDismiss}</span>
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>
    </aside>
  );
}
