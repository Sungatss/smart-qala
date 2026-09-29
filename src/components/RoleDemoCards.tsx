'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { 
  UserCheck, 
  Building, 
  ShieldCheck, 
  ChevronRight, 
  SlidersHorizontal,
  KeyRound,
  CheckCircle2
} from 'lucide-react';

export default function RoleDemoCards() {
  const router = useRouter();
  const { role, setRole, login, openAuthModal } = useApp();

  const handleEnterAsCitizen = () => {
    login('citizen', {
      name: 'Азамат Султанов',
      phone: '+7 (705) 412-88-99',
      email: 'azamat.s@mail.kz'
    });
    router.push('/create');
  };

  const handleEnterAsJkh = () => {
    login('employee');
    router.push('/admin');
  };

  const handleEnterAsAdmin = () => {
    login('admin');
    router.push('/admin');
  };

  return (
    <div className="bg-muted border-2 border-border rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b-2 border-border">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-foreground" />
          <span className="text-xs font-extrabold uppercase tracking-wider text-foreground">
            3 сценария доступа (Демо)
          </span>
        </div>
        <span className="text-xs font-bold px-2 py-0.5 bg-muted text-foreground rounded border border-border">
          СЕМЕЙ 2026
        </span>
      </div>

      <p className="text-xs text-foreground mt-2.5 leading-relaxed font-semibold">
        Нажмите на любую роль для мгновенного входа или введите служебный пароль:
      </p>

      <div className="mt-4 space-y-3.5">
        
        {/* Role 1: Citizen */}
        <div className={`p-4 rounded-lg border-2 transition-all ${
          role === 'citizen' ? 'bg-card border-info ring-2 ring-info/10' : 'bg-card border-border hover:border-foreground/30'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-info-soft text-info-soft-foreground flex items-center justify-center font-bold shrink-0">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-extrabold text-foreground flex items-center gap-2">
                  <span>1. Гражданин (Простой доступ)</span>
                  {role === 'citizen' && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-info-soft-foreground bg-info-soft px-1.5 py-0.5 rounded border border-info-soft">
                      <CheckCircle2 className="w-3 h-3" /> Активно
                    </span>
                  )}
                </div>
                <div className="text-xs text-muted-foreground font-medium">Подача заявок, банк идей, обжалование. Без доступа к ПДн.</div>
              </div>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              onClick={handleEnterAsCitizen}
              className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer"
            >
              <span>Войти как житель (Подать заявку)</span>
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => openAuthModal('citizen', 'register')}
              className="px-2.5 py-2 text-xs font-bold rounded-lg border border-border text-foreground hover:bg-muted transition-colors"
              title="Регистрация нового жителя"
            >
              Регистрация
            </button>
          </div>
        </div>

        {/* Role 2: Employee / Housing */}
        <div className={`p-4 rounded-lg border-2 transition-all ${
          role === 'employee' ? 'bg-card border-info ring-2 ring-info/10' : 'bg-card border-border hover:border-foreground/30'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-info-soft text-info-soft-foreground flex items-center justify-center font-bold shrink-0">
                <Building className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-extrabold text-foreground flex items-center gap-2">
                  <span>2. Служба ЖКХ (Контакт-центр 109)</span>
                  {role === 'employee' && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-info-soft-foreground bg-info-soft px-1.5 py-0.5 rounded border border-info-soft">
                      <CheckCircle2 className="w-3 h-3" /> Активно
                    </span>
                  )}
                </div>
                <div className="text-xs text-muted-foreground font-medium">Досье заявителей, наряды бригадам, фото «ПОСЛЕ».</div>
              </div>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              onClick={handleEnterAsJkh}
              className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer"
            >
              <span>Войти как диспетчер ЖКХ</span>
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => openAuthModal('employee', 'login')}
              className="px-2.5 py-2 text-xs font-bold rounded-lg border border-border text-foreground hover:bg-muted transition-colors flex items-center gap-1"
              title="Ввести служебный пароль ЖКХ"
            >
              <KeyRound className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="hidden sm:inline">Пароль</span>
            </button>
          </div>
        </div>

        {/* Role 3: Administration */}
        <div className={`p-4 rounded-lg border-2 transition-all ${
          role === 'admin' ? 'bg-card border-success ring-2 ring-success/10' : 'bg-card border-border hover:border-foreground/30'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-success-soft text-success-soft-foreground flex items-center justify-center font-bold shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-extrabold text-foreground flex items-center gap-2">
                  <span>3. Администрация (Акимат г. Семей)</span>
                  {role === 'admin' && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-success-soft-foreground bg-success-soft px-1.5 py-0.5 rounded border border-success-soft">
                      <CheckCircle2 className="w-3 h-3" /> Активно
                    </span>
                  )}
                </div>
                <div className="text-xs text-muted-foreground font-medium">Модерация, цензура, аудит ЖКХ, связь с разработчиками.</div>
              </div>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              onClick={handleEnterAsAdmin}
              className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer"
            >
              <span>Войти как Администрация города</span>
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => openAuthModal('admin', 'login')}
              className="px-2.5 py-2 text-xs font-bold rounded-lg border border-border text-foreground hover:bg-muted transition-colors flex items-center gap-1"
              title="Ввести служебный пароль Акимата"
            >
              <KeyRound className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="hidden sm:inline">Пароль</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
