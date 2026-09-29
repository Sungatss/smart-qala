'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Language } from '@/lib/translations';
import { 
  Building2, 
  PlusCircle, 
  Map, 
  Lightbulb, 
  BarChart3, 
  Bell, 
  User, 
  Globe, 
  LogOut, 
  Sun, 
  Moon, 
  Accessibility, 
  Menu, 
  Layers, 
  ExternalLink,
  SlidersHorizontal,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';

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

  const [mobileOpen, setMobileOpen] = useState(false);

  const getRoleLabel = () => {
    if (role === 'admin') return t.navRoleAdmin;
    if (role === 'employee') return t.navRoleJkh;
    if (isGuest) return t.navRoleGuest;
    return t.navRoleCitizen;
  };

  const navLinks = [
    { href: '/map', label: t.navMap, icon: Map },
    { href: '/ideas', label: t.navIdeas, icon: Lightbulb },
    { href: '/analytics', label: t.navAnalytics, icon: BarChart3 },
    { href: '/profile', label: t.navMyRequests, icon: User },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-card">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
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
          </Link>

          {/* Desktop Nav Items (4 items) */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-medium">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 rounded-md px-3 py-2 text-sm whitespace-nowrap transition-colors ${
                    isActive
                      ? 'bg-muted text-foreground font-semibold'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {/* Municipal staff extra link if logged as admin or employee */}
            {(role === 'employee' || role === 'admin') && (
              <Link
                href="/admin"
                className={`flex items-center gap-1.5 rounded-md px-3 py-2 text-sm whitespace-nowrap transition-colors ${
                  pathname.startsWith('/admin')
                    ? 'bg-primary text-primary-foreground font-semibold'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <Layers className="h-4 w-4 shrink-0" />
                <span>{role === 'admin' ? t.adminTitleAdmin : t.adminTitleJkh}</span>
              </Link>
            )}
          </nav>
        </div>

        {/* Right Desktop Actions */}
        <div className="hidden lg:flex items-center gap-2">
          
          {/* Language Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-9 gap-1.5 px-2.5 text-xs font-medium">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <span className="uppercase">{lang === 'kz' ? 'KAZ' : lang === 'ru' ? 'RUS' : 'ENG'}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36">
              <DropdownMenuItem onClick={() => setLang('kz')} className="flex items-center justify-between cursor-pointer">
                <span>{t.langKz}</span>
                {lang === 'kz' && <Check className="h-3.5 w-3.5 text-primary" />}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLang('ru')} className="flex items-center justify-between cursor-pointer">
                <span>{t.langRu}</span>
                {lang === 'ru' && <Check className="h-3.5 w-3.5 text-primary" />}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLang('en')} className="flex items-center justify-between cursor-pointer">
                <span>{t.langEn}</span>
                {lang === 'en' && <Check className="h-3.5 w-3.5 text-primary" />}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Display Settings Popover (Theme + Large Font) */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground" title={t.navDisplaySettings}>
                <SlidersHorizontal className="h-4 w-4" />
                <span className="sr-only">{t.navDisplaySettings}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 p-2 space-y-1">
              <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground">
                {t.navDisplaySettings}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              {/* Theme option */}
              <DropdownMenuItem 
                onClick={toggleTheme} 
                className="flex items-center justify-between cursor-pointer py-2"
              >
                <div className="flex items-center gap-2">
                  {theme === 'light' ? <Sun className="h-4 w-4 text-amber-500" /> : <Moon className="h-4 w-4 text-blue-400" />}
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

          {/* Notification Bell */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative h-9 w-9 text-muted-foreground" title={t.navNotifications}>
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-danger opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-danger"></span>
                  </span>
                )}
                <span className="sr-only">{t.navNotifications}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 sm:w-96 max-h-96 overflow-y-auto">
              <div className="flex items-center justify-between px-3 py-2 border-b border-border">
                <span className="text-xs font-semibold">{t.navNotifications}</span>
                {unreadCount > 0 && (
                  <Badge variant="info" className="text-[10px]">
                    {unreadCount} {t.navNewCount}
                  </Badge>
                )}
              </div>
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-xs text-muted-foreground">
                  {t.navNoNotifications}
                </div>
              ) : (
                notifications.map((n) => (
                  <DropdownMenuItem
                    key={n.id}
                    asChild
                    onClick={() => markNotificationRead(n.id)}
                    className="cursor-pointer p-3 border-b border-border last:border-0"
                  >
                    <Link href={n.link} className="flex flex-col gap-1">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span>{n.title}</span>
                        {!n.read && <span className="h-1.5 w-1.5 rounded-full bg-info" />}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed font-normal">
                        {n.message}
                      </p>
                    </Link>
                  </DropdownMenuItem>
                ))
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Account Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 gap-2 px-3 text-xs font-medium max-w-[170px]">
                <User className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <span className="truncate">{user?.name ? user.name.split(' ')[0] : t.navProfile}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-60">
              <div className="px-3 py-2">
                <p className="text-sm font-semibold truncate">{user?.name}</p>
                <div className="mt-1 flex items-center gap-1.5">
                  <Badge variant="secondary" className="text-[10px]">
                    {getRoleLabel()}
                  </Badge>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href="/profile" className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>{t.navMyRequests}</span>
                </Link>
              </DropdownMenuItem>
              {(role === 'employee' || role === 'admin') && (
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href="/admin" className="flex items-center gap-2">
                    <Layers className="h-4 w-4 text-muted-foreground" />
                    <span>{role === 'admin' ? t.adminTitleAdmin : t.adminTitleJkh}</span>
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={logout} 
                className="cursor-pointer text-destructive focus:text-destructive flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                <span>{t.navLogout}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Report CTA */}
          <Button asChild size="sm" className="h-9 gap-1.5 px-3.5 text-xs font-medium">
            <Link href="/create">
              <PlusCircle className="h-4 w-4" />
              <span>{t.navCreate}</span>
            </Link>
          </Button>

        </div>

        {/* Mobile Hamburger Trigger & Quick Report CTA */}
        <div className="flex items-center gap-2 lg:hidden">
          <Button asChild size="sm" className="h-8 gap-1 px-2.5 text-xs">
            <Link href="/create">
              <PlusCircle className="h-3.5 w-3.5" />
              <span>{t.navCreate}</span>
            </Link>
          </Button>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="h-9 w-9" aria-label={t.navMenu}>
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[85vw] max-w-sm flex flex-col p-6 overflow-y-auto">
              <SheetHeader className="text-left pb-4 border-b border-border">
                <SheetTitle className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                    <Building2 className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <div>
                    <span className="text-base font-bold">{t.brandName}</span>
                    <Badge variant="outline" className="ml-2 text-[10px]">
                      {t.brandCity}
                    </Badge>
                  </div>
                </SheetTitle>
              </SheetHeader>

              {/* Mobile Navigation Links */}
              <div className="py-4 space-y-1">
                {navLinks.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                        isActive 
                          ? 'bg-muted text-foreground font-semibold' 
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      }`}
                    >
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}

                {(role === 'employee' || role === 'admin') && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                  >
                    <Layers className="h-4 w-4 text-muted-foreground" />
                    <span>{role === 'admin' ? t.adminTitleAdmin : t.adminTitleJkh}</span>
                  </Link>
                )}
              </div>

              {/* Display & Accessibility Controls */}
              <div className="mt-auto pt-4 border-t border-border space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground">{t.navTheme}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleTheme}
                    className="h-8 gap-1.5 text-xs"
                  >
                    {theme === 'light' ? <Sun className="h-3.5 w-3.5 text-amber-500" /> : <Moon className="h-3.5 w-3.5 text-blue-400" />}
                    <span>{theme === 'light' ? t.themeLight : t.themeDark}</span>
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground">{t.navAccessibilityMode}</span>
                  <Button
                    variant={easyMode ? 'default' : 'outline'}
                    size="sm"
                    onClick={toggleEasyMode}
                    className="h-8 gap-1.5 text-xs"
                  >
                    <Accessibility className="h-3.5 w-3.5" />
                    <span>{easyMode ? 'ON' : 'OFF'}</span>
                  </Button>
                </div>

                {/* Language Switcher in Mobile */}
                <div className="pt-2">
                  <span className="block text-xs font-semibold text-muted-foreground mb-1.5">Тіл / Язык / Language</span>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(['kz', 'ru', 'en'] as Language[]).map((l) => (
                      <Button
                        key={l}
                        variant={lang === l ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setLang(l)}
                        className="h-8 text-xs font-semibold uppercase"
                      >
                        {l === 'kz' ? 'KAZ' : l === 'ru' ? 'RUS' : 'ENG'}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Account & Sign out in Mobile */}
                <div className="pt-3 border-t border-border">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-xs font-semibold text-foreground truncate max-w-[180px]">{user?.name}</p>
                      <span className="text-[11px] text-muted-foreground">{getRoleLabel()}</span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setMobileOpen(false);
                      logout();
                    }}
                    className="w-full justify-start text-xs text-destructive hover:text-destructive h-9"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    <span>{t.navLogout}</span>
                  </Button>
                </div>

              </div>

            </SheetContent>
          </Sheet>
        </div>

      </div>
    </header>
  );
}
