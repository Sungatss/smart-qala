'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Language } from '@/lib/translations';
import {
  Building2,
  SlidersHorizontal,
  Sun,
  Moon,
  Accessibility,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import AuthForm from '@/components/auth/AuthForm';

const LANG_CODES: Record<Language, string> = {
  kz: 'KAZ',
  ru: 'РУС',
  en: 'ENG',
};

export default function AuthGate() {
  const {
    lang,
    setLang,
    t,
    theme,
    toggleTheme,
    easyMode,
    toggleEasyMode,
  } = useApp();

  return (
    <div className="min-h-dvh bg-background text-foreground grid lg:grid-cols-2">
      {/* LEFT PANEL: Inset rounded-3xl with hero photo, navy gradient overlay, headline & subtext */}
      <div className="hidden lg:flex p-4 xl:p-6 h-full flex-col">
        <div className="relative w-full h-full rounded-3xl overflow-hidden min-h-[640px] flex flex-col justify-end p-8 xl:p-12 shadow-black/5">
          {/* Background image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: "url('/images/semey/bridge.jpg')",
            }}
          />

          {/* Navy gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/65 to-transparent" />

          {/* Content at bottom */}
          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold rounded-full bg-white/10 backdrop-blur-md text-white border border-white/15">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Smart Qala • {t.brandCity}</span>
            </div>

            <h1 className="text-3xl xl:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {t.authHeroHeadline}
            </h1>

            <p className="text-sm xl:text-base text-slate-200 font-normal leading-relaxed max-w-lg">
              {t.authHeroSubtext}
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: Header controls, Centered form (max-w-sm), and Concept footer */}
      <div className="flex flex-col justify-between p-6 sm:p-8 lg:p-12 min-h-dvh">
        {/* Top Header Row */}
        <div className="flex items-center justify-between w-full">
          {/* Logo top-left */}
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs">
              <Building2 className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-semibold tracking-tight text-foreground">
                {t.brandName}
              </span>
              <Badge variant="outline" className="px-1.5 py-0 text-[11px] font-medium">
                {t.brandCity}
              </Badge>
            </div>
          </div>

          {/* Display Settings Popover top-right (Language, Theme, Large Font all in one popover) */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-9 gap-2 text-xs font-medium border-border"
                title={t.navDisplaySettings}
              >
                <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
                <span className="hidden sm:inline">{t.navDisplaySettings}</span>
                <span className="uppercase text-muted-foreground font-semibold">
                  ({LANG_CODES[lang]})
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 p-2 space-y-1">
              <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground">
                {t.navDisplaySettings}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              {/* Language selection inside popover */}
              <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                Тіл / Язык / Language
              </div>
              <div className="grid grid-cols-3 gap-1 px-1 mb-1">
                {(['kz', 'ru', 'en'] as Language[]).map((l) => (
                  <Button
                    key={l}
                    type="button"
                    variant={lang === l ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setLang(l)}
                    className="h-7 text-xs font-semibold uppercase"
                  >
                    {LANG_CODES[l]}
                  </Button>
                ))}
              </div>

              <DropdownMenuSeparator />

              {/* Theme option */}
              <DropdownMenuItem
                onClick={toggleTheme}
                className="flex items-center justify-between cursor-pointer py-2"
              >
                <div className="flex items-center gap-2">
                  {theme === 'light' ? (
                    <Sun className="h-4 w-4 text-amber-500" />
                  ) : (
                    <Moon className="h-4 w-4 text-blue-400" />
                  )}
                  <span>{theme === 'light' ? t.themeLight : t.themeDark}</span>
                </div>
                <Badge variant="outline" className="text-[10px]">
                  {theme === 'light' ? 'Light' : 'Dark'}
                </Badge>
              </DropdownMenuItem>

              {/* Large Font / Accessibility option */}
              <DropdownMenuItem
                onClick={toggleEasyMode}
                className="flex items-center justify-between cursor-pointer py-2"
              >
                <div className="flex items-center gap-2">
                  <Accessibility className="h-4 w-4 text-primary" />
                  <span>{t.navAccessibilityMode}</span>
                </div>
                <Badge variant={easyMode ? 'default' : 'outline'} className="text-[10px]">
                  {easyMode ? 'ON' : 'OFF'}
                </Badge>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Center: Form centered max-w-sm */}
        <div className="flex-1 flex flex-col justify-center items-center py-8 w-full">
          <div className="w-full max-w-sm mx-auto">
            <AuthForm />
          </div>
        </div>

        {/* Bottom: Concept Project Disclaimer */}
        <footer className="mt-auto pt-6 text-center">
          <p className="text-xs text-muted-foreground leading-relaxed max-w-md mx-auto">
            {t.authFooterConcept}
          </p>
        </footer>
      </div>
    </div>
  );
}
