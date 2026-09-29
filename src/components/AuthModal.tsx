'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { UserRole, District } from '@/types';
import { 
  Building2, 
  User, 
  Building, 
  ShieldCheck, 
  ArrowRight, 
  Lock, 
  Phone, 
  Mail, 
  Eye, 
  EyeOff, 
  Sparkles,
  X,
  Compass
} from 'lucide-react';

export default function AuthModal() {
  const router = useRouter();
  const { 
    isAuthModalOpen, 
    closeAuthModal, 
    login, 
    loginAsGuest, 
    registerCitizen, 
    modalInitialRole, 
    modalInitialTab 
  } = useApp();

  // Prevent SSR hydration mismatch
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Active role selected in modal
  const [selectedRole, setSelectedRole] = useState<UserRole>('citizen');
  // Citizen tab: 'login' | 'register'
  const [citizenTab, setCitizenTab] = useState<'login' | 'register'>('login');

  // Form states
  const [citizenLoginInput, setCitizenLoginInput] = useState('+7 (705) 412-88-99');
  const [citizenPassword, setCitizenPassword] = useState('password123');

  // Citizen registration fields
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regDistrict, setRegDistrict] = useState<District>('Центральный');
  const [regPassword, setRegPassword] = useState('');

  // Staff (ЖКХ / Admin) credentials
  const [staffLogin, setStaffLogin] = useState('k.serikov@semey-gov.kz');
  const [staffPassword, setStaffPassword] = useState('jkh2026pass');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Sync role and tab only when modal opens
  useEffect(() => {
    if (isAuthModalOpen) {
      const initial = modalInitialRole || 'citizen';
      setSelectedRole(initial);
      setCitizenTab(modalInitialTab || 'login');
      if (initial === 'employee') {
        setStaffLogin('k.serikov@semey-gov.kz');
        setStaffPassword('jkh2026pass');
      } else if (initial === 'admin') {
        setStaffLogin('d.baizhanov@abai.gov.kz');
        setStaffPassword('admin2026pass');
      }
    }
  }, [isAuthModalOpen, modalInitialRole, modalInitialTab]);

  // Pre-fill demo data for ЖКХ
  const handleAutofillJkh = () => {
    setStaffLogin('k.serikov@semey-gov.kz');
    setStaffPassword('jkh2026pass');
    setErrorMsg('');
  };

  // Pre-fill demo data for Admin
  const handleAutofillAdmin = () => {
    setStaffLogin('d.baizhanov@abai.gov.kz');
    setStaffPassword('admin2026pass');
    setErrorMsg('');
  };

  // Submit Citizen Login
  const handleCitizenLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!citizenLoginInput.trim()) {
      setErrorMsg('Пожалуйста, введите номер телефона или email');
      return;
    }
    setErrorMsg('');
    login('citizen', {
      name: 'Азамат Султанов',
      phone: citizenLoginInput.includes('@') ? '+7 (705) 412-88-99' : citizenLoginInput,
      email: citizenLoginInput.includes('@') ? citizenLoginInput : 'azamat.s@mail.kz'
    });
  };

  // Submit Citizen Registration
  const handleCitizenRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regPhone.trim()) {
      setErrorMsg('Укажите ФИО и номер телефона для создания профиля');
      return;
    }
    setErrorMsg('');
    registerCitizen({
      name: regName,
      phone: regPhone,
      email: regEmail || `${regPhone.replace(/\D/g, '')}@semey.kz`,
      district: regDistrict
    });
  };

  // Submit Staff Login (ЖКХ or Admin)
  const handleStaffLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffLogin.trim() || !staffPassword.trim()) {
      setErrorMsg('Введите служебный логин и пароль');
      return;
    }
    setErrorMsg('');
    login(selectedRole);
    router.push('/admin');
  };

  // If not mounted or closed, do not render
  if (!mounted || !isAuthModalOpen) {
    return null;
  }

  return (
    <div 
      onClick={(e) => {
        if (e.target === e.currentTarget) closeAuthModal();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs overflow-y-auto cursor-pointer"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl bg-card rounded-lg border-2 border-border shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-150 my-auto cursor-default"
      >
        
        {/* Header */}
        <div className="relative pb-5 border-b-2 border-border text-center">
          <button
            type="button"
            onClick={closeAuthModal}
            className="absolute right-0 top-0 p-2 text-muted-foreground hover:text-black rounded-lg hover:bg-slate-100 cursor-pointer"
            title="Закрыть окно (продолжить как гость)"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-12 h-12 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl border-2 border-slate-800 mx-auto mb-3 shadow-xs">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
            Smart Qala • Семей
          </h1>
          <p className="text-sm font-semibold text-foreground mt-1">
            Единая система взаимодействия жителей и органов города
          </p>
        </div>

        {/* STEP 1: SELECT ROLE (3 кнопки-роли) */}
        <div className="pt-5">
          <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-2.5">
            1. Выберите категорию доступа:
          </label>

          <div className="grid grid-cols-3 gap-2">
            
            {/* Role: Citizen */}
            <button
              type="button"
              onClick={() => {
                setSelectedRole('citizen');
                setErrorMsg('');
              }}
              className={`p-3.5 rounded-lg border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                selectedRole === 'citizen'
                  ? 'border-blue-700 bg-info-soft/70 ring-2 ring-blue-700/20 shadow-xs'
                  : 'border-border bg-card hover:border-border'
              }`}
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-2 ${
                selectedRole === 'citizen' ? 'bg-blue-900 text-white' : 'bg-slate-100 text-foreground'
              }`}>
                <User className="w-5 h-5" />
              </div>
              <div className="font-extrabold text-sm text-foreground">Гражданин</div>
              <div className="text-xs font-semibold text-muted-foreground mt-0.5">Жители г. Семей</div>
            </button>

            {/* Role: Housing (ЖКХ) */}
            <button
              type="button"
              onClick={() => {
                setSelectedRole('employee');
                setErrorMsg('');
                handleAutofillJkh();
              }}
              className={`p-3.5 rounded-lg border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                selectedRole === 'employee'
                  ? 'border-indigo-700 bg-info-soft/70 ring-2 ring-indigo-700/20 shadow-xs'
                  : 'border-border bg-card hover:border-border'
              }`}
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-2 ${
                selectedRole === 'employee' ? 'bg-indigo-900 text-white' : 'bg-slate-100 text-foreground'
              }`}>
                <Building className="w-5 h-5" />
              </div>
              <div className="font-extrabold text-sm text-foreground">Служба ЖКХ</div>
              <div className="text-xs font-semibold text-muted-foreground mt-0.5">Контакт-центр 109</div>
            </button>

            {/* Role: Administration */}
            <button
              type="button"
              onClick={() => {
                setSelectedRole('admin');
                setErrorMsg('');
                handleAutofillAdmin();
              }}
              className={`p-3.5 rounded-lg border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                selectedRole === 'admin'
                  ? 'border-emerald-700 bg-success-soft/70 ring-2 ring-emerald-700/20 shadow-xs'
                  : 'border-border bg-card hover:border-border'
              }`}
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-2 ${
                selectedRole === 'admin' ? 'bg-emerald-900 text-white' : 'bg-slate-100 text-foreground'
              }`}>
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="font-extrabold text-sm text-foreground">Акимат</div>
              <div className="text-xs font-semibold text-muted-foreground mt-0.5">Администрация</div>
            </button>

          </div>
        </div>

        {/* Error notification if any */}
        {errorMsg && (
          <div className="mt-4 p-3 bg-danger-soft border-2 border-danger-soft text-danger-soft-foreground rounded-lg text-xs font-bold">
            {errorMsg}
          </div>
        )}

        {/* STEP 2: FORMS BY ROLE */}
        <div className="mt-6 pt-5 border-t-2 border-border">
          
          {/* ========================================================
              ROLE A: CITIZEN (Житель) — Войти / Регистрация / Гость
              ======================================================== */}
          {selectedRole === 'citizen' && (
            <div>
              {/* Tabs: Login vs Register */}
              <div className="flex border-b-2 border-border mb-5">
                <button
                  type="button"
                  onClick={() => {
                    setCitizenTab('login');
                    setErrorMsg('');
                  }}
                  className={`flex-1 py-2.5 text-sm font-bold text-center border-b-2 transition-colors cursor-pointer ${
                    citizenTab === 'login'
                      ? 'border-slate-900 text-foreground font-extrabold'
                      : 'border-transparent text-muted-foreground hover:text-black'
                  }`}
                >
                  Вход для жителей
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCitizenTab('register');
                    setErrorMsg('');
                  }}
                  className={`flex-1 py-2.5 text-sm font-bold text-center border-b-2 transition-colors cursor-pointer ${
                    citizenTab === 'register'
                      ? 'border-slate-900 text-foreground font-extrabold'
                      : 'border-transparent text-muted-foreground hover:text-black'
                  }`}
                >
                  Создать профиль (Регистрация)
                </button>
              </div>

              {/* CITIZEN LOGIN FORM */}
              {citizenTab === 'login' && (
                <form onSubmit={handleCitizenLoginSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-foreground uppercase tracking-wide mb-1">
                      Номер телефона или Email
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-muted-foreground absolute left-3 top-3.5" />
                      <input
                        type="text"
                        required
                        value={citizenLoginInput}
                        onChange={(e) => setCitizenLoginInput(e.target.value)}
                        placeholder="+7 (705) 412-88-99 или email"
                        className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border-2 border-border font-medium text-foreground focus:outline-none focus:border-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-foreground uppercase tracking-wide mb-1">
                      Пароль
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-muted-foreground absolute left-3 top-3.5" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={citizenPassword}
                        onChange={(e) => setCitizenPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-9 pr-10 py-2.5 text-sm rounded-lg border-2 border-border font-medium text-foreground focus:outline-none focus:border-slate-900"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-muted-foreground hover:text-black"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 px-4 rounded-lg bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Войти в личный кабинет</span>
                    <ArrowRight className="w-4 h-4 text-white" />
                  </button>

                  {/* Fast 1-Click Demo Login */}
                  <button
                    type="button"
                    onClick={() => {
                      setCitizenLoginInput('+7 (705) 412-88-99');
                      setCitizenPassword('azamat2026');
                      login('citizen', {
                        name: 'Азамат Султанов',
                        phone: '+7 (705) 412-88-99',
                        email: 'azamat.s@mail.kz'
                      });
                    }}
                    className="w-full py-2.5 px-3 text-xs font-bold text-info-soft-foreground bg-info-soft border border-info-soft rounded-lg hover:bg-blue-100 transition-colors cursor-pointer"
                  >
                    ⚡ Быстрый вход жителя (Азамат Султанов)
                  </button>

                  {/* OR GUEST LOGIN */}
                  <div className="relative pt-3">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-border"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-2 text-muted-foreground font-bold">или без авторизации</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={loginAsGuest}
                    className="w-full py-3 px-4 rounded-lg bg-card text-foreground font-extrabold text-sm border-2 border-border hover:bg-slate-100 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                  >
                    <Compass className="w-4 h-4 text-foreground" />
                    <span>Войти как гость (Только просмотр)</span>
                  </button>
                  <p className="text-[11px] text-center text-muted-foreground font-medium">
                    В режиме гостя доступен просмотр карты и витрины. Для подачи заявки потребуется регистрация.
                  </p>
                </form>
              )}

              {/* CITIZEN REGISTRATION FORM */}
              {citizenTab === 'register' && (
                <form onSubmit={handleCitizenRegisterSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-foreground uppercase tracking-wide mb-1">
                      ФИО жителя <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="Например: Арман Серикович Жолдасов"
                      className="w-full p-2.5 text-sm rounded-lg border-2 border-border font-medium text-foreground focus:outline-none focus:border-slate-900"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-foreground uppercase tracking-wide mb-1">
                        Номер телефона <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        placeholder="+7 (777) 123-45-67"
                        className="w-full p-2.5 text-sm rounded-lg border-2 border-border font-medium text-foreground focus:outline-none focus:border-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-foreground uppercase tracking-wide mb-1">
                        Район проживания
                      </label>
                      <select
                        value={regDistrict}
                        onChange={(e) => setRegDistrict(e.target.value as District)}
                        className="w-full p-2.5 text-sm rounded-lg border-2 border-border font-bold text-foreground bg-card"
                      >
                        <option value="Центральный">Центральный</option>
                        <option value="Левобережный">Левобережный</option>
                        <option value="Затон">Затон</option>
                        <option value="Восточный">Восточный</option>
                        <option value="Юность">Юность</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-foreground uppercase tracking-wide mb-1">
                      Email (для уведомлений)
                    </label>
                    <input
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="arman@mail.kz"
                      className="w-full p-2.5 text-sm rounded-lg border-2 border-border font-medium text-foreground focus:outline-none focus:border-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-foreground uppercase tracking-wide mb-1">
                      Придумайте пароль
                    </label>
                    <input
                      type="password"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Минимум 6 символов"
                      className="w-full p-2.5 text-sm rounded-lg border-2 border-border font-medium text-foreground focus:outline-none focus:border-slate-900"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 px-4 rounded-lg bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer mt-2"
                  >
                    <span>Зарегистрироваться и войти</span>
                    <ArrowRight className="w-4 h-4 text-white" />
                  </button>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={loginAsGuest}
                      className="text-xs font-bold text-foreground hover:text-black hover:underline cursor-pointer"
                    >
                      Или продолжить просмотр как гость
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* ========================================================
              ROLE B: HOUSING (Служба ЖКХ / 109) — Служебный вход
              ======================================================== */}
          {selectedRole === 'employee' && (
            <form onSubmit={handleStaffLoginSubmit} className="space-y-4">
              <div className="p-3 bg-info-soft border border-info-soft rounded-lg text-xs text-info-soft-foreground font-semibold leading-relaxed">
                🔒 Доступ к служебному досье заявителей, нарядам выездных бригад «Горсвет»/«Водоканал» и публикации фотоотчетов «ПОСЛЕ».
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground uppercase tracking-wide mb-1">
                  Служебный Email / Логин диспетчера
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-muted-foreground absolute left-3 top-3.5" />
                  <input
                    type="text"
                    required
                    value={staffLogin}
                    onChange={(e) => setStaffLogin(e.target.value)}
                    placeholder="k.serikov@semey-gov.kz или 109"
                    className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border-2 border-border font-medium text-foreground focus:outline-none focus:border-indigo-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground uppercase tracking-wide mb-1">
                  Пароль служебной учетной записи
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-muted-foreground absolute left-3 top-3.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={staffPassword}
                    onChange={(e) => setStaffPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-10 py-2.5 text-sm rounded-lg border-2 border-border font-medium text-foreground focus:outline-none focus:border-indigo-700"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-black"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-lg bg-indigo-900 text-white font-bold text-sm hover:bg-indigo-800 transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Войти в панель диспетчера ЖКХ</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>

              <button
                type="button"
                onClick={() => {
                  handleAutofillJkh();
                  login('employee');
                  router.push('/admin');
                }}
                className="w-full py-2.5 px-3 text-xs font-bold text-info-soft-foreground bg-info-soft border border-info-soft rounded-lg hover:bg-indigo-100 transition-colors cursor-pointer"
              >
                ⚡ Мгновенный демо-вход диспетчера (Канат Сериков • 109)
              </button>
            </form>
          )}

          {/* ========================================================
              ROLE C: ADMINISTRATION (Акимат г. Семей)
              ======================================================== */}
          {selectedRole === 'admin' && (
            <form onSubmit={handleStaffLoginSubmit} className="space-y-4">
              <div className="p-3 bg-success-soft border border-success-soft rounded-lg text-xs text-success-soft-foreground font-semibold leading-relaxed">
                🏛️ Доступ аппарата Акима г. Семей: цензурный контроль, аудит просрочек ЖКХ и прямая линия с разработчиками (dev@smartqala.kz).
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground uppercase tracking-wide mb-1">
                  Логин администратора / ИИН
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-muted-foreground absolute left-3 top-3.5" />
                  <input
                    type="text"
                    required
                    value={staffLogin}
                    onChange={(e) => setStaffLogin(e.target.value)}
                    placeholder="d.baizhanov@abai.gov.kz или akimat"
                    className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border-2 border-border font-medium text-foreground focus:outline-none focus:border-emerald-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground uppercase tracking-wide mb-1">
                  Пароль администратора
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-muted-foreground absolute left-3 top-3.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={staffPassword}
                    onChange={(e) => setStaffPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-10 py-2.5 text-sm rounded-lg border-2 border-border font-medium text-foreground focus:outline-none focus:border-emerald-700"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-black"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-lg bg-emerald-900 text-white font-bold text-sm hover:bg-emerald-800 transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Войти в ситуационный центр Акимата</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>

              <button
                type="button"
                onClick={() => {
                  handleAutofillAdmin();
                  login('admin');
                  router.push('/admin');
                }}
                className="w-full py-2.5 px-3 text-xs font-bold text-success-soft-foreground bg-success-soft border border-success-soft rounded-lg hover:bg-emerald-100 transition-colors cursor-pointer"
              >
                ⚡ Мгновенный демо-вход Акимата (Даурен Байжанов)
              </button>
            </form>
          )}

        </div>

        {/* Footer info & Guest bypass */}
        <div className="mt-5 pt-3 border-t border-border flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground font-medium">
          <span>Безопасное соединение SSL • Защита ПДн</span>
          <button
            type="button"
            onClick={loginAsGuest}
            className="font-bold text-foreground hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Compass className="w-3.5 h-3.5 text-muted-foreground" />
            <span>Продолжить просмотр как гость</span>
          </button>
        </div>

      </div>
    </div>
  );
}
