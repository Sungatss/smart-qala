'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Language } from '@/lib/translations';
import { 
  Building2, 
  PlusCircle, 
  Layers, 
  Map, 
  Lightbulb, 
  BarChart3, 
  Bell, 
  User, 
  Check, 
  Accessibility, 
  ChevronDown,
  ExternalLink,
  Globe,
  LogOut,
  ShieldCheck,
  Building,
  Sun,
  Moon
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { 
    lang, 
    setLang, 
    t, 
    role, 
    user, 
    isGuest,
    theme,
    toggleTheme,
    easyMode, 
    toggleEasyMode, 
    notifications, 
    unreadCount, 
    markNotificationRead,
    logout 
  } = useApp();

  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const roleMenuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (roleMenuRef.current && !roleMenuRef.current.contains(event.target as Node)) {
        setIsRoleMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="border-b-2 border-border bg-card sticky top-0 z-40">
      {/* Institutional Top Banner */}
      <div className="bg-primary text-primary-foreground text-xs px-4 py-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
          <span className="font-mono tracking-wider font-extrabold text-xs text-white">
            ДЕМОНСТРАЦИОННЫЕ ДАННЫЕ / СЕМЕЙ
          </span>
          <span className="hidden sm:inline text-muted-foreground text-xs">|</span>
          <span className="hidden sm:inline text-slate-200 text-xs font-medium">
            Smart Qala
          </span>
        </div>

        {/* Trilingual Switcher & Accessibility & Role Quick Badge */}
        <div className="flex items-center gap-2 sm:gap-3 text-xs">
          
          {/* Language Selector */}
          <div className="flex items-center bg-primary/90 rounded p-0.5 border border-slate-700">
            <Globe className="w-3 h-3 text-muted-foreground ml-1 mr-0.5" />
            {(['kz', 'ru', 'en'] as Language[]).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLang(l)}
                className={`px-1.5 py-0.5 text-[11px] font-bold rounded transition-colors cursor-pointer ${
                  lang === l
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                }`}
              >
                {l === 'kz' ? 'ҚАЗ' : l === 'ru' ? 'РУС' : 'ENG'}
              </button>
            ))}
          </div>

          <span className="text-muted-foreground">•</span>

          {/* Easy Mode accessibility switch */}
          <button
            onClick={toggleEasyMode}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold transition-colors cursor-pointer ${
              easyMode 
                ? 'bg-yellow-400 text-slate-950 font-extrabold' 
                : 'text-slate-200 hover:text-white hover:bg-primary/90'
            }`}
            title="Режим для слабовидящих с увеличенным шрифтом и высоким контрастом"
          >
            <Accessibility className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{easyMode ? t.navLargeFontOn : t.navLargeFont}</span>
          </button>

          <span className="text-muted-foreground">•</span>

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold transition-colors cursor-pointer ${
              theme === 'light'
                ? 'text-slate-200 hover:text-white hover:bg-primary/90'
                : 'bg-amber-400 text-slate-950 font-extrabold'
            }`}
            title={theme === 'light' ? t.themeDark : t.themeLight}
          >
            {theme === 'light' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-950" />}
            <span className="hidden sm:inline">{theme === 'light' ? 'Светлая' : 'Темная'}</span>
          </button>

          <span className="text-muted-foreground">•</span>

          {/* Current Role Indicator */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-muted-foreground hidden sm:inline font-medium">Статус:</span>
            <span className={`font-bold px-2 py-0.5 rounded border text-[11px] ${
              role === 'citizen' 
                ? isGuest 
                  ? 'bg-primary/90 text-slate-300 border-slate-700'
                  : 'bg-blue-900/80 text-blue-200 border-blue-700' 
                : role === 'employee' 
                ? 'bg-indigo-900/80 text-indigo-200 border-indigo-700' 
                : 'bg-emerald-900/80 text-emerald-200 border-emerald-700'
            }`}>
              {role === 'citizen' ? (isGuest ? 'Гость' : 'Гражданин') : role === 'employee' ? 'ЖКХ / 109' : 'Акимат'}
            </span>
          </div>

          {/* Direct Return to Entrance Gate / Logout */}
          <button
            type="button"
            onClick={logout}
            className="text-muted-foreground hover:text-white text-xs underline cursor-pointer ml-1"
            title="Выйти на начальную страницу авторизации"
          >
            {t.navLogout}
          </button>

        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl border-2 border-slate-800 shadow-xs">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-foreground text-lg sm:text-xl tracking-tight">Smart Qala</span>
                <span className="px-2 py-0.5 text-xs font-bold bg-slate-100 text-foreground rounded border border-border">
                  {t.brandCity}
                </span>
              </div>
              <p className="text-xs font-semibold text-muted-foreground hidden sm:block">
                {t.brandTagline}
              </p>
            </div>
          </Link>

          {/* Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-sm font-bold">
            <Link
              href="/#showcase"
              className={`px-3 py-2 rounded-lg transition-colors ${
                pathname === '/' ? 'text-foreground hover:bg-slate-100 font-extrabold' : 'text-foreground hover:text-slate-950 hover:bg-muted'
              }`}
            >
              {t.navShowcase}
            </Link>

            <Link
              href="/map"
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                pathname === '/map' ? 'bg-slate-100 text-foreground font-extrabold' : 'text-foreground hover:text-slate-950 hover:bg-muted'
              }`}
            >
              <Map className="w-4 h-4 text-muted-foreground" />
              <span>{t.navMap}</span>
            </Link>

            <Link
              href="/ideas"
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                pathname === '/ideas' ? 'bg-slate-100 text-foreground font-extrabold' : 'text-foreground hover:text-slate-950 hover:bg-muted'
              }`}
            >
              <Lightbulb className="w-4 h-4 text-amber-600" />
              <span>{t.navIdeas}</span>
            </Link>

            <Link
              href="/analytics"
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                pathname === '/analytics' ? 'bg-slate-100 text-foreground font-extrabold' : 'text-foreground hover:text-slate-950 hover:bg-muted'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-muted-foreground" />
              <span>{t.navAnalytics}</span>
            </Link>

            <Link
              href="/profile"
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                pathname === '/profile' ? 'bg-slate-100 text-foreground font-extrabold' : 'text-foreground hover:text-slate-950 hover:bg-muted'
              }`}
            >
              <User className="w-4 h-4 text-muted-foreground" />
              <span>{t.navMyRequests}</span>
            </Link>

            {/* Municipal/Admin panel link: STRICTLY HIDDEN FOR CITIZENS! */}
            {(role === 'employee' || role === 'admin') && (
              <Link
                href="/admin"
                className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                  pathname.startsWith('/admin')
                    ? 'bg-primary text-primary-foreground font-extrabold shadow-xs'
                    : 'text-foreground hover:text-slate-950 hover:bg-slate-100'
                }`}
              >
                <Layers className={`w-4 h-4 ${pathname.startsWith('/admin') ? 'text-white' : 'text-muted-foreground'}`} />
                <span>{role === 'admin' ? t.adminTitleAdmin : t.adminTitleJkh}</span>
              </Link>
            )}
          </nav>

          {/* Right Action Tools */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Notification Bell */}
            <div className="relative" ref={notifRef}>
              <button
                type="button"
                onClick={() => setIsNotifOpen((prev) => !prev)}
                className="relative p-2.5 rounded-lg border-2 border-border bg-card text-foreground hover:bg-muted transition-colors cursor-pointer"
                title="Уведомления об изменении статуса"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white rounded-full text-xs font-bold flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-card rounded-lg border-2 border-border shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-4 py-2 border-b border-border flex items-center justify-between">
                    <span className="text-xs font-extrabold text-foreground uppercase tracking-wider">
                      {lang === 'kz' ? 'Хабарламалар' : lang === 'en' ? 'Notifications' : 'Уведомления'}
                    </span>
                    <span className="text-xs font-mono font-bold text-muted-foreground">
                      {unreadCount} {lang === 'kz' ? 'жаңа' : lang === 'en' ? 'new' : 'новых'}
                    </span>
                  </div>

                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-xs text-muted-foreground text-center font-medium">
                        {lang === 'kz' ? 'Жаңа хабарлама жоқ' : lang === 'en' ? 'No new notifications' : 'Нет новых уведомлений'}
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <Link
                          key={n.id}
                          href={n.link}
                          onClick={() => {
                            markNotificationRead(n.id);
                            setIsNotifOpen(false);
                          }}
                          className={`block p-3.5 text-xs hover:bg-muted transition-colors ${
                            !n.read ? 'bg-info-soft/50' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-bold text-foreground">{n.title}</span>
                            {!n.read && (
                              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 shrink-0 mt-1"></span>
                            )}
                          </div>
                          <p className="text-foreground text-xs mt-1 leading-relaxed font-medium">{n.message}</p>
                          <span className="text-xs font-mono text-muted-foreground mt-1 block">
                            {new Date(n.created_at).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </Link>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile & Role Switcher */}
            <div className="relative" ref={roleMenuRef}>
              <button
                type="button"
                onClick={() => setIsRoleMenuOpen((prev) => !prev)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border-2 border-border bg-card hover:bg-muted transition-colors text-xs font-bold text-foreground cursor-pointer"
              >
                <User className="w-4 h-4 text-foreground" />
                <span className="hidden md:inline truncate max-w-[130px]">
                  {user?.name?.split(' ')[0] || 'Профиль'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
              </button>

              {/* Role Dropdown */}
              {isRoleMenuOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-card rounded-lg border-2 border-border shadow-2xl py-2 z-50">
                  <div className="px-4 py-3 border-b border-border">
                    <div className="text-sm font-extrabold text-foreground">{user?.name}</div>
                    <div className="text-xs font-semibold text-muted-foreground">{user?.roleTitle}</div>
                    <Link
                      href="/profile"
                      onClick={() => setIsRoleMenuOpen(false)}
                      className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-bold text-foreground hover:underline"
                    >
                      <span>{t.navMyRequests}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  <div className="p-2 border-t border-border">
                    <button
                      type="button"
                      onClick={() => {
                        setIsRoleMenuOpen(false);
                        logout();
                      }}
                      className="w-full text-left px-3 py-2.5 rounded-lg text-xs font-bold text-red-700 hover:bg-danger-soft transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-red-600" />
                      <span>{t.navLogout}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Create request primary CTA */}
            <Link
              href="/create"
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-bold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm shrink-0 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-white" />
              <span className="hidden sm:inline">{t.navCreate}</span>
              <span className="sm:hidden">{t.navCreate}</span>
            </Link>

          </div>
        </div>

        {/* Mobile Submenu Bar */}
        <div className="lg:hidden flex items-center gap-2 overflow-x-auto py-2.5 border-t border-border text-xs font-bold text-foreground">
          <Link href="/map" className="px-3 py-1.5 rounded-lg bg-slate-100 whitespace-nowrap border border-border">
            {t.navMap}
          </Link>
          <Link href="/ideas" className="px-3 py-1.5 rounded-lg bg-slate-100 whitespace-nowrap border border-border">
            {t.navIdeas}
          </Link>
          <Link href="/analytics" className="px-3 py-1.5 rounded-lg bg-slate-100 whitespace-nowrap border border-border">
            {t.navAnalytics}
          </Link>
          <Link href="/profile" className="px-3 py-1.5 rounded-lg bg-slate-100 whitespace-nowrap border border-border">
            {t.navMyRequests}
          </Link>
          {/* Municipal panel link in mobile ONLY for employee or admin */}
          {(role === 'employee' || role === 'admin') && (
            <Link href="/admin" className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground whitespace-nowrap">
              {role === 'admin' ? t.adminTitleAdmin : t.adminTitleJkh}
            </Link>
          )}
        </div>

      </div>
    </header>
  );
}
