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
    <div className="bg-slate-50 border-2 border-slate-300 rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b-2 border-slate-200">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-slate-800" />
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
            3 сценария доступа (Демо)
          </span>
        </div>
        <span className="text-xs font-mono font-bold px-2 py-0.5 bg-slate-200 text-slate-900 rounded border border-slate-300">
          СЕМЕЙ 2026
        </span>
      </div>

      <p className="text-xs text-slate-800 mt-2.5 leading-relaxed font-semibold">
        Нажмите на любую роль для мгновенного входа или введите служебный пароль:
      </p>

      <div className="mt-4 space-y-3.5">
        
        {/* Role 1: Citizen */}
        <div className={`p-4 rounded-lg border-2 transition-all ${
          role === 'citizen' ? 'bg-white border-blue-600 ring-2 ring-blue-600/10' : 'bg-white border-slate-200 hover:border-slate-400'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-900 flex items-center justify-center font-bold shrink-0">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <span>1. Гражданин (Простой доступ)</span>
                  {role === 'citizen' && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-800 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                      <CheckCircle2 className="w-3 h-3" /> Активно
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-700 font-medium">Подача заявок, банк идей, обжалование. Без доступа к ПДн.</div>
              </div>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              onClick={handleEnterAsCitizen}
              className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <span>Войти как житель (Подать заявку)</span>
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => openAuthModal('citizen', 'register')}
              className="px-2.5 py-2 text-xs font-bold rounded-lg border border-slate-300 text-slate-800 hover:bg-slate-100 transition-colors"
              title="Регистрация нового жителя"
            >
              Регистрация
            </button>
          </div>
        </div>

        {/* Role 2: Employee / Housing */}
        <div className={`p-4 rounded-lg border-2 transition-all ${
          role === 'employee' ? 'bg-white border-indigo-600 ring-2 ring-indigo-600/10' : 'bg-white border-slate-200 hover:border-slate-400'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-950 flex items-center justify-center font-bold shrink-0">
                <Building className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <span>2. Служба ЖКХ (Контакт-центр 109)</span>
                  {role === 'employee' && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-800 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-200">
                      <CheckCircle2 className="w-3 h-3" /> Активно
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-700 font-medium">Досье заявителей, наряды бригадам, фото «ПОСЛЕ».</div>
              </div>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              onClick={handleEnterAsJkh}
              className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold rounded-lg bg-indigo-900 text-white hover:bg-indigo-800 transition-colors cursor-pointer"
            >
              <span>Войти как диспетчер ЖКХ</span>
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => openAuthModal('employee', 'login')}
              className="px-2.5 py-2 text-xs font-bold rounded-lg border border-slate-300 text-slate-800 hover:bg-slate-100 transition-colors flex items-center gap-1"
              title="Ввести служебный пароль ЖКХ"
            >
              <KeyRound className="w-3.5 h-3.5 text-slate-700" />
              <span className="hidden sm:inline">Пароль</span>
            </button>
          </div>
        </div>

        {/* Role 3: Administration */}
        <div className={`p-4 rounded-lg border-2 transition-all ${
          role === 'admin' ? 'bg-white border-emerald-600 ring-2 ring-emerald-600/10' : 'bg-white border-slate-200 hover:border-slate-400'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-950 flex items-center justify-center font-bold shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <span>3. Администрация (Акимат г. Семей)</span>
                  {role === 'admin' && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3" /> Активно
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-700 font-medium">Модерация, цензура, аудит ЖКХ, связь с разработчиками.</div>
              </div>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              onClick={handleEnterAsAdmin}
              className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold rounded-lg bg-emerald-900 text-white hover:bg-emerald-800 transition-colors cursor-pointer"
            >
              <span>Войти как Администрация города</span>
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => openAuthModal('admin', 'login')}
              className="px-2.5 py-2 text-xs font-bold rounded-lg border border-slate-300 text-slate-800 hover:bg-slate-100 transition-colors flex items-center gap-1"
              title="Ввести служебный пароль Акимата"
            >
              <KeyRound className="w-3.5 h-3.5 text-slate-700" />
              <span className="hidden sm:inline">Пароль</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
