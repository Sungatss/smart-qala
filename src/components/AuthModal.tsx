'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { Building2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import AuthForm from '@/components/auth/AuthForm';

export default function AuthModal() {
  const {
    isAuthModalOpen,
    closeAuthModal,
    modalInitialRole,
    t,
  } = useApp();

  // Prevent SSR hydration mismatch
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isAuthModalOpen) {
    return null;
  }

  const initialView =
    modalInitialRole === 'employee' || modalInitialRole === 'admin'
      ? 'staff'
      : 'resident';

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) closeAuthModal();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs overflow-y-auto cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md bg-card rounded-2xl border border-border shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-150 my-auto cursor-default"
      >
        {/* Close Button */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={closeAuthModal}
          className="absolute right-4 top-4 h-8 w-8 text-muted-foreground hover:text-foreground"
          aria-label={t.authBackToSite}
        >
          <X className="h-4 w-4" />
        </Button>

        {/* Modal Header */}
        <div className="text-center pb-5 mb-5 border-b border-border">
          <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs">
            <Building2 className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="flex items-center justify-center gap-1.5">
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              {t.brandName}
            </h2>
            <Badge variant="outline" className="text-[10px]">
              {t.brandCity}
            </Badge>
          </div>
          <p className="mt-1 text-xs text-muted-foreground font-normal">
            {t.authSubtitle}
          </p>
        </div>

        {/* AuthForm Body */}
        <AuthForm
          inModal={true}
          onSuccess={closeAuthModal}
          defaultView={initialView}
        />
      </div>
    </div>
  );
}
