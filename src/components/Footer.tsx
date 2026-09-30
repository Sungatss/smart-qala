'use client';

import React from 'react';
import { ShieldCheck } from 'lucide-react';
import SemeyBridgeLogo from '@/components/SemeyBridgeLogo';
import { useApp } from '@/context/AppContext';

export default function Footer() {
  const { t } = useApp();

  return (
    <footer className="border-t border-border bg-card mt-auto">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-primary text-primary-foreground flex items-center justify-center shrink-0">
              <SemeyBridgeLogo size={18} className="text-primary-foreground" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                {t.footerConceptTitle}
              </p>
              <p className="text-xs text-muted-foreground">
                {t.footerConceptSubtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted px-3 py-2 rounded-md border border-border">
            <ShieldCheck className="w-4 h-4 text-success shrink-0" />
            <span>
              {t.footerConceptNotice}
            </span>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-border flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-2">
          <span>{t.footerCopyright}</span>
          <span>{t.footerStandards}</span>
        </div>
      </div>
    </footer>
  );
}
