'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import AuthGate from '@/components/AuthGate';
import SemeyBridgeLogo from '@/components/SemeyBridgeLogo';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { hasEnteredSite } = useApp();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // SSR loading skeleton before client hydration
  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">
        <div className="animate-pulse flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-xs">
            <SemeyBridgeLogo size={24} className="text-primary-foreground" />
          </div>
          <span className="font-bold text-lg text-foreground">VoiceOfSemey • Семей</span>
        </div>
      </div>
    );
  }

  // If user hasn't entered site through authorization gate, show the full-page AuthGate
  if (!hasEnteredSite) {
    return <AuthGate />;
  }

  return <>{children}</>;
}
