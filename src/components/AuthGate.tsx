'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Language } from '@/lib/translations';
import { District } from '@/types';
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
  Accessibility,
  Globe,
  Sun,
  Moon,
  Sparkles,
  MapPin,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function AuthGate() {
  const { 
    lang, 
    setLang, 
    t, 
    theme, 
    toggleTheme, 
    easyMode, 
    toggleEasyMode, 
    login, 
    loginAsGuest, 
    registerCitizen 
  } = useApp();

  const isLight = theme === 'light';

  // Role card tabs / states
  const [citizenTab, setCitizenTab] = useState<'guest' | 'login' | 'register'>('guest');

  // Citizen login state
  const [citizenLoginInput, setCitizenLoginInput] = useState('');
  const [citizenPassword, setCitizenPassword] = useState('');

  // Citizen register state
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regDistrict, setRegDistrict] = useState<District>('Центральный');

  // Staff credentials
  const [jkhLogin, setJkhLogin] = useState('');
  const [jkhPassword, setJkhPassword] = useState('');
  const [showJkhPassword, setShowJkhPassword] = useState(false);

  const [adminLogin, setAdminLogin] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminPassword, setShowAdminPassword] = useState(false);

  const [errorMsg, setErrorMsg] = useState('');

  // 1. Citizen Handlers
  const handleGuestEntry = () => {
    setErrorMsg('');
    loginAsGuest();
  };

  const handleCitizenLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!citizenLoginInput.trim()) {
      setErrorMsg(lang === 'kz' ? 'Телефон нөмірін немесе email енгізіңіз' : lang === 'en' ? 'Please enter phone or email' : 'Пожалуйста, введите телефон или email');
      return;
    }
    setErrorMsg('');
    login('citizen', {
      name: 'Айгүл Ахметова',
      phone: citizenLoginInput,
      email: citizenLoginInput.includes('@') ? citizenLoginInput : 'resident@semey.kz',
      district: 'Центральный'
    });
  };

  const handleCitizenRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim()) {
      setErrorMsg(lang === 'kz' ? 'Аты-жөніңізді енгізіңіз' : lang === 'en' ? 'Please enter your name' : 'Пожалуйста, введите ваше имя');
      return;
    }
    if (!regPhone.trim()) {
      setErrorMsg(lang === 'kz' ? 'Телефон нөмірін енгізіңіз' : lang === 'en' ? 'Please enter phone number' : 'Пожалуйста, укажите контактный телефон');
      return;
    }
    setErrorMsg('');
    registerCitizen({
      name: regName,
      phone: regPhone,
      email: regEmail,
      district: regDistrict
    });
  };

  // 2. Staff Handlers
  const handleJkhSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jkhLogin.trim() || !jkhPassword.trim()) {
      setErrorMsg(lang === 'kz' ? 'Логин мен құпия сөзді енгізіңіз' : lang === 'en' ? 'Enter login and password' : 'Пожалуйста, введите логин и пароль сотрудника ЖКХ');
      return;
    }
    setErrorMsg('');
    login('employee');
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminLogin.trim() || !adminPassword.trim()) {
      setErrorMsg(lang === 'kz' ? 'Логин мен құпия сөзді енгізіңіз' : lang === 'en' ? 'Enter login and password' : 'Пожалуйста, введите логин и пароль администратора');
      return;
    }
    setErrorMsg('');
    login('admin');
  };

  return (
    <div className={`min-h-screen relative flex flex-col justify-between overflow-x-hidden selection:bg-blue-600 selection:text-white transition-colors duration-200 ${
      isLight ? 'bg-slate-100 text-foreground' : 'bg-slate-950 text-slate-100'
    }`}>
      
      {/* Background with Atmospheric Semey City Overlay */}
      <div 
        className={`absolute inset-0 bg-cover bg-center z-0 filter ${
          isLight ? 'opacity-25 saturate-75 contrast-110' : 'opacity-30 brightness-90 contrast-115'
        }`}
        style={{
          backgroundImage: `url('/images/semey/bridge.jpg')`
        }}
      />
      
      <div className={`absolute inset-0 z-0 pointer-events-none ${
        isLight 
          ? 'bg-gradient-to-b from-slate-100/90 via-slate-50/95 to-slate-100'
          : 'bg-gradient-to-b from-slate-950/90 via-slate-900/95 to-slate-950'
      }`} />

      {/* TOP HEADER: Branding, Theme Toggle, Language & Accessibility */}
      <header className={`relative z-10 border-b backdrop-blur-md transition-colors ${
        isLight 
          ? 'border-border bg-card/90 text-foreground shadow-xs'
          : 'border-slate-800/80 bg-slate-950/80 text-slate-100'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-black text-xl shadow-md border ${
              isLight 
                ? 'bg-primary text-primary-foreground border-slate-700' 
                : 'bg-blue-600 text-white border-blue-400'
            }`}>
              SQ
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight">Smart Qala</span>
                <span className={`px-2 py-0.5 text-xs font-bold rounded border ${
                  isLight
                    ? 'bg-slate-100 text-foreground border-border'
                    : 'bg-blue-900/80 text-blue-200 border-blue-700'
                }`}>
                  {t.brandCity}
                </span>
              </div>
              <p className={`text-xs hidden sm:block font-medium ${isLight ? 'text-muted-foreground' : 'text-muted-foreground'}`}>
                {t.brandTagline}
              </p>
            </div>
          </div>

          {/* Right Controls: Theme Switcher, Language & Accessibility */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            
            {/* Theme Toggle (White / Dark) */}
            <button
              type="button"
              onClick={toggleTheme}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer shadow-2xs ${
                isLight
                  ? 'bg-warning-soft hover:bg-amber-100 text-warning-soft-foreground border-warning-soft'
                  : 'bg-primary/90 hover:bg-slate-700 text-slate-200 border-slate-700'
              }`}
              title={isLight ? t.themeDark : t.themeLight}
            >
              {isLight ? <Sun className="w-4 h-4 text-amber-600" /> : <Moon className="w-4 h-4 text-blue-400" />}
              <span>{isLight ? t.themeLight : t.themeDark}</span>
            </button>

            {/* Language Switcher */}
            <div className={`flex items-center rounded-lg p-0.5 border ${
              isLight ? 'bg-slate-100 border-border' : 'bg-primary/90/90 border-slate-700'
            }`}>
              <Globe className={`w-3.5 h-3.5 ml-1.5 mr-1 ${isLight ? 'text-muted-foreground' : 'text-muted-foreground'}`} />
              {(['kz', 'ru', 'en'] as Language[]).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLang(l)}
                  className={`px-2 py-1 text-xs font-bold rounded transition-colors cursor-pointer ${
                    lang === l
                      ? isLight ? 'bg-primary text-primary-foreground shadow-xs' : 'bg-blue-600 text-white shadow-xs'
                      : isLight ? 'text-muted-foreground hover:text-foreground hover:bg-slate-200' : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                  }`}
                >
                  {l === 'kz' ? 'ҚАЗ' : l === 'ru' ? 'РУС' : 'ENG'}
                </button>
              ))}
            </div>

            {/* Accessibility Button */}
            <button
              type="button"
              onClick={toggleEasyMode}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors border cursor-pointer ${
                easyMode
                  ? 'bg-yellow-400 text-slate-950 border-warning-soft font-extrabold shadow-md'
                  : isLight
                  ? 'bg-card text-foreground border-border hover:bg-slate-100'
                  : 'bg-primary/90/90 text-slate-200 border-slate-700 hover:text-white hover:bg-slate-700'
              }`}
              title="Режим для слабовидящих с крупным шрифтом и высоким контрастом"
            >
              <Accessibility className="w-4 h-4" />
              <span className="hidden md:inline">{easyMode ? t.navLargeFontOn : t.navLargeFont}</span>
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER: Hero Intro & 3 Role Authorization Cards */}
      <main className="relative z-10 flex-1 flex flex-col justify-center max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
        {/* Title Area */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <div className={`inline-flex items-center gap-2 px-3 py-1 text-xs font-bold rounded-full mb-3 border ${
            isLight
              ? 'bg-info-soft text-info-soft-foreground border-info-soft'
              : 'bg-blue-950/80 text-blue-300 border-blue-800'
          }`}>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>{t.authTitle}</span>
          </div>

          <h1 className={`text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight leading-tight ${
            isLight ? 'text-slate-950' : 'text-white'
          }`}>
            {t.authSubtitle}
          </h1>

          <p className={`mt-2 text-sm sm:text-base font-medium ${
            isLight ? 'text-muted-foreground' : 'text-slate-300'
          }`}>
            {t.authChooseRole}
          </p>

          {/* Global error banner if any */}
          {errorMsg && (
            <div className="mt-4 p-3 bg-red-100 border-2 border-danger-soft text-danger-soft-foreground text-sm font-bold rounded-lg flex items-center justify-center gap-2 shadow-sm">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* 3 ROLES CARDS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          
          {/* ======================================================== */}
          {/* CARD 1: CITIZEN (Житель города) */}
          {/* ======================================================== */}
          <div className={`rounded-xl border-2 shadow-xl flex flex-col p-6 transition-all ${
            isLight
              ? 'bg-card border-border hover:border-blue-600 text-foreground'
              : 'bg-primary text-primary-foreground/90 backdrop-blur-md border-slate-700/80 hover:border-blue-500/80 text-slate-100'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center border ${
                isLight 
                  ? 'bg-info-soft border-info-soft text-blue-700' 
                  : 'bg-blue-600/20 border-blue-500/50 text-blue-400'
              }`}>
                <User className="w-6 h-6" />
              </div>
              <span className={`px-2.5 py-1 text-xs font-extrabold uppercase tracking-wider rounded border ${
                isLight 
                  ? 'bg-info-soft text-info-soft-foreground border-info-soft' 
                  : 'bg-blue-900/60 text-blue-300 border-blue-700'
              }`}>
                {lang === 'kz' ? 'Ашық қолжетімділік' : lang === 'en' ? 'Public Access' : 'Открытый доступ'}
              </span>
            </div>

            <h2 className="text-xl font-bold mb-1">
              {t.authRoleCitizen}
            </h2>
            <p className={`text-xs mb-5 leading-relaxed min-h-[36px] font-medium ${
              isLight ? 'text-muted-foreground' : 'text-slate-300'
            }`}>
              {t.authRoleCitizenDesc}
            </p>

            {/* Quick Guest Entrance Button */}
            <div className="mb-4">
              <button
                type="button"
                onClick={handleGuestEntry}
                className="w-full py-3 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-md cursor-pointer"
              >
                <span>{t.authGuestBtn}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <p className={`text-[11px] text-center mt-1.5 font-medium ${
                isLight ? 'text-muted-foreground' : 'text-muted-foreground'
              }`}>
                {t.authGuestHint}
              </p>
            </div>

            <div className="relative flex py-2 items-center mb-4">
              <div className={`flex-grow border-t ${isLight ? 'border-border' : 'border-slate-700'}`}></div>
              <span className={`flex-shrink mx-3 text-[11px] font-extrabold uppercase tracking-wider ${
                isLight ? 'text-muted-foreground' : 'text-muted-foreground'
              }`}>
                {lang === 'kz' ? 'немесе' : lang === 'en' ? 'or' : 'или'}
              </span>
              <div className={`flex-grow border-t ${isLight ? 'border-border' : 'border-slate-700'}`}></div>
            </div>

            {/* Citizen Tabs: Login / Register */}
            <div className={`flex rounded-lg p-1 border mb-4 ${
              isLight ? 'bg-slate-100 border-border' : 'bg-slate-950 border-slate-800'
            }`}>
              <button
                type="button"
                onClick={() => { setCitizenTab('login'); setErrorMsg(''); }}
                className={`flex-1 py-1.5 text-xs font-bold rounded transition-colors cursor-pointer ${
                  citizenTab === 'login' || citizenTab === 'guest'
                    ? isLight ? 'bg-primary text-primary-foreground shadow-xs' : 'bg-blue-600 text-white shadow-xs'
                    : isLight ? 'text-muted-foreground hover:text-slate-950' : 'text-muted-foreground hover:text-white'
                }`}
              >
                {t.authLoginTab}
              </button>
              <button
                type="button"
                onClick={() => { setCitizenTab('register'); setErrorMsg(''); }}
                className={`flex-1 py-1.5 text-xs font-bold rounded transition-colors cursor-pointer ${
                  citizenTab === 'register'
                    ? isLight ? 'bg-primary text-primary-foreground shadow-xs' : 'bg-blue-600 text-white shadow-xs'
                    : isLight ? 'text-muted-foreground hover:text-slate-950' : 'text-muted-foreground hover:text-white'
                }`}
              >
                {t.authRegisterTab}
              </button>
            </div>

            {/* Citizen Tab: Login */}
            {(citizenTab === 'login' || citizenTab === 'guest') && (
              <form onSubmit={handleCitizenLoginSubmit} className="space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <div>
                    <label className={`block text-xs font-bold mb-1 ${isLight ? 'text-foreground' : 'text-slate-300'}`}>
                      {t.authPhoneOrEmail}
                    </label>
                    <div className="relative">
                      <Phone className={`w-4 h-4 absolute left-3 top-2.5 ${isLight ? 'text-muted-foreground' : 'text-muted-foreground'}`} />
                      <input
                        type="text"
                        value={citizenLoginInput}
                        onChange={(e) => setCitizenLoginInput(e.target.value)}
                        placeholder="+7 (705) 000-00-00"
                        className={`w-full pl-9 pr-3 py-2 border rounded-lg text-sm font-medium focus:outline-none ${
                          isLight 
                            ? 'bg-card border-border text-foreground placeholder-slate-400 focus:border-slate-900' 
                            : 'bg-slate-950 border-slate-700 text-white placeholder-slate-500 focus:border-blue-500'
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={`block text-xs font-bold mb-1 ${isLight ? 'text-foreground' : 'text-slate-300'}`}>
                      {t.authPassword}
                    </label>
                    <div className="relative">
                      <Lock className={`w-4 h-4 absolute left-3 top-2.5 ${isLight ? 'text-muted-foreground' : 'text-muted-foreground'}`} />
                      <input
                        type="password"
                        value={citizenPassword}
                        onChange={(e) => setCitizenPassword(e.target.value)}
                        placeholder="••••••••"
                        className={`w-full pl-9 pr-3 py-2 border rounded-lg text-sm font-medium focus:outline-none ${
                          isLight 
                            ? 'bg-card border-border text-foreground placeholder-slate-400 focus:border-slate-900' 
                            : 'bg-slate-950 border-slate-700 text-white placeholder-slate-500 focus:border-blue-500'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2 space-y-2">
                  <button
                    type="submit"
                    className={`w-full py-2.5 px-4 rounded-lg font-bold text-sm transition-colors cursor-pointer ${
                      isLight 
                        ? 'bg-primary text-primary-foreground hover:bg-primary/90 text-white shadow-xs' 
                        : 'bg-blue-600 hover:bg-blue-500 text-white'
                    }`}
                  >
                    {t.authLoginBtn}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setCitizenLoginInput('+7 (705) 412-88-99');
                      setCitizenPassword('password123');
                      login('citizen', {
                        name: 'Айгүл Ахметова',
                        phone: '+7 (705) 412-88-99',
                        district: 'Центральный'
                      });
                    }}
                    className={`w-full py-1.5 px-2 text-[11px] rounded border font-semibold transition-colors cursor-pointer ${
                      isLight 
                        ? 'bg-info-soft text-info-soft-foreground hover:bg-blue-100 border-info-soft' 
                        : 'text-blue-300 hover:text-white bg-blue-950/40 hover:bg-blue-900/60 border-blue-900/80'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 inline mr-1" />
                    <span>{t.authFastCitizenDemo}</span>
                  </button>
                </div>
              </form>
            )}

            {/* Citizen Tab: Register */}
            {citizenTab === 'register' && (
              <form onSubmit={handleCitizenRegisterSubmit} className="space-y-2.5 flex-1 flex flex-col justify-between">
                <div className="space-y-2.5">
                  <div>
                    <label className={`block text-xs font-bold mb-1 ${isLight ? 'text-foreground' : 'text-slate-300'}`}>
                      {t.authFullName}
                    </label>
                    <input
                      type="text"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="Алихан Бокейханов"
                      required
                      className={`w-full px-3 py-2 border rounded-lg text-sm font-medium focus:outline-none ${
                        isLight 
                          ? 'bg-card border-border text-foreground placeholder-slate-400 focus:border-slate-900' 
                          : 'bg-slate-950 border-slate-700 text-white placeholder-slate-500 focus:border-blue-500'
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block text-xs font-bold mb-1 ${isLight ? 'text-foreground' : 'text-slate-300'}`}>
                      {t.authPhone}
                    </label>
                    <input
                      type="tel"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="+7 (777) 123-45-67"
                      required
                      className={`w-full px-3 py-2 border rounded-lg text-sm font-medium focus:outline-none ${
                        isLight 
                          ? 'bg-card border-border text-foreground placeholder-slate-400 focus:border-slate-900' 
                          : 'bg-slate-950 border-slate-700 text-white placeholder-slate-500 focus:border-blue-500'
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block text-xs font-bold mb-1 ${isLight ? 'text-foreground' : 'text-slate-300'}`}>
                      {t.authDistrict}
                    </label>
                    <select
                      value={regDistrict}
                      onChange={(e) => setRegDistrict(e.target.value as District)}
                      className={`w-full px-3 py-2 border rounded-lg text-sm font-medium focus:outline-none ${
                        isLight 
                          ? 'bg-card border-border text-foreground focus:border-slate-900' 
                          : 'bg-slate-950 border-slate-700 text-white focus:border-blue-500'
                      }`}
                    >
                      <option value="Центральный">Центральный</option>
                      <option value="Затон">Затон</option>
                      <option value="Юность">Юность</option>
                      <option value="Левый берег">Левый берег</option>
                      <option value="Восточный">Восточный</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className={`w-full py-2.5 px-4 rounded-lg font-bold text-sm transition-colors cursor-pointer ${
                      isLight 
                        ? 'bg-primary text-primary-foreground hover:bg-primary/90 text-white shadow-xs' 
                        : 'bg-blue-600 hover:bg-blue-500 text-white'
                    }`}
                  >
                    {t.authRegisterBtn}
                  </button>
                </div>
              </form>
            )}
          </div>


          {/* ======================================================== */}
          {/* CARD 2: ЖКХ / КОНТАКТ-ЦЕНТР 109 */}
          {/* ======================================================== */}
          <div className={`rounded-xl border-2 shadow-xl flex flex-col p-6 transition-all ${
            isLight
              ? 'bg-card border-border hover:border-indigo-600 text-foreground'
              : 'bg-primary text-primary-foreground/90 backdrop-blur-md border-slate-700/80 hover:border-indigo-500/80 text-slate-100'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center border ${
                isLight 
                  ? 'bg-info-soft border-info-soft text-indigo-700' 
                  : 'bg-indigo-600/20 border-indigo-500/50 text-indigo-400'
              }`}>
                <Building className="w-6 h-6" />
              </div>
              <span className={`px-2.5 py-1 text-xs font-extrabold uppercase tracking-wider rounded border ${
                isLight 
                  ? 'bg-info-soft text-info-soft-foreground border-info-soft' 
                  : 'bg-indigo-900/60 text-indigo-300 border-indigo-700'
              }`}>
                {lang === 'kz' ? 'Қызметтік рұқсат' : lang === 'en' ? 'Official Access' : 'Служебный доступ'}
              </span>
            </div>

            <h2 className="text-xl font-bold mb-1">
              {t.authRoleJkh}
            </h2>
            <p className={`text-xs mb-5 leading-relaxed min-h-[36px] font-medium ${
              isLight ? 'text-muted-foreground' : 'text-slate-300'
            }`}>
              {t.authRoleJkhDesc}
            </p>

            {/* Quick 1-Click Demo Entrance for Jury / Testing */}
            <div className="mb-4">
              <button
                type="button"
                onClick={() => {
                  setErrorMsg('');
                  login('employee');
                }}
                className="w-full py-3 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-md cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>{t.authFastJkhDemo}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <p className={`text-[11px] text-center mt-1.5 font-medium ${
                isLight ? 'text-muted-foreground' : 'text-muted-foreground'
              }`}>
                {lang === 'kz' ? '1 басу арқылы кіру (ЖКХ 109 Диспетчері)' : lang === 'en' ? '1-click demo entry (Dispatcher 109)' : 'Вход в 1 клик для демонстрации (Диспетчер 109)'}
              </p>
            </div>

            <div className="relative flex py-2 items-center mb-4">
              <div className={`flex-grow border-t ${isLight ? 'border-border' : 'border-slate-700'}`}></div>
              <span className={`flex-shrink mx-3 text-[11px] font-extrabold uppercase tracking-wider ${
                isLight ? 'text-muted-foreground' : 'text-muted-foreground'
              }`}>
                {t.authOfficialLogin}
              </span>
              <div className={`flex-grow border-t ${isLight ? 'border-border' : 'border-slate-700'}`}></div>
            </div>

            {/* ЖКХ Login Form */}
            <form onSubmit={handleJkhSubmit} className="space-y-3 flex-1 flex flex-col justify-between">
              <div className="space-y-3">
                <div>
                  <label className={`block text-xs font-bold mb-1 ${isLight ? 'text-foreground' : 'text-slate-300'}`}>
                    Служебный email / логин
                  </label>
                  <div className="relative">
                    <Mail className={`w-4 h-4 absolute left-3 top-2.5 ${isLight ? 'text-muted-foreground' : 'text-muted-foreground'}`} />
                    <input
                      type="text"
                      value={jkhLogin}
                      onChange={(e) => setJkhLogin(e.target.value)}
                      className={`w-full pl-9 pr-3 py-2 border rounded-lg text-sm font-mono focus:outline-none ${
                        isLight 
                          ? 'bg-card border-border text-foreground focus:border-indigo-600' 
                          : 'bg-slate-950 border-slate-700 text-white focus:border-indigo-500'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-xs font-bold mb-1 ${isLight ? 'text-foreground' : 'text-slate-300'}`}>
                    {t.authPassword}
                  </label>
                  <div className="relative">
                    <Lock className={`w-4 h-4 absolute left-3 top-2.5 ${isLight ? 'text-muted-foreground' : 'text-muted-foreground'}`} />
                    <input
                      type={showJkhPassword ? 'text' : 'password'}
                      value={jkhPassword}
                      onChange={(e) => setJkhPassword(e.target.value)}
                      className={`w-full pl-9 pr-9 py-2 border rounded-lg text-sm font-mono focus:outline-none ${
                        isLight 
                          ? 'bg-card border-border text-foreground focus:border-indigo-600' 
                          : 'bg-slate-950 border-slate-700 text-white focus:border-indigo-500'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowJkhPassword(!showJkhPassword)}
                      className={`absolute right-3 top-2.5 cursor-pointer ${
                        isLight ? 'text-muted-foreground hover:text-foreground' : 'text-muted-foreground hover:text-white'
                      }`}
                    >
                      {showJkhPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className={`w-full py-2.5 px-4 rounded-lg font-bold text-sm border transition-colors cursor-pointer ${
                    isLight 
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90 text-white border-slate-800 shadow-xs' 
                      : 'bg-primary/90 hover:bg-slate-700 text-white border-slate-600'
                  }`}
                >
                  {t.authLoginBtn}
                </button>
              </div>
            </form>
          </div>


          {/* ======================================================== */}
          {/* CARD 3: АДМИНИСТРАЦИЯ (Акимат г. Семей) */}
          {/* ======================================================== */}
          <div className={`rounded-xl border-2 shadow-xl flex flex-col p-6 transition-all ${
            isLight
              ? 'bg-card border-border hover:border-emerald-600 text-foreground'
              : 'bg-primary text-primary-foreground/90 backdrop-blur-md border-slate-700/80 hover:border-emerald-500/80 text-slate-100'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center border ${
                isLight 
                  ? 'bg-success-soft border-success-soft text-emerald-700' 
                  : 'bg-emerald-600/20 border-emerald-500/50 text-emerald-400'
              }`}>
                <ShieldCheck className="w-6 h-6" />
              </div>
              <span className={`px-2.5 py-1 text-xs font-extrabold uppercase tracking-wider rounded border ${
                isLight 
                  ? 'bg-success-soft text-success-soft-foreground border-success-soft' 
                  : 'bg-emerald-900/60 text-emerald-300 border-emerald-700'
              }`}>
                {lang === 'kz' ? 'Қалалық аудит' : lang === 'en' ? 'City Audit' : 'Городской аудит'}
              </span>
            </div>

            <h2 className="text-xl font-bold mb-1">
              {t.authRoleAdmin}
            </h2>
            <p className={`text-xs mb-5 leading-relaxed min-h-[36px] font-medium ${
              isLight ? 'text-muted-foreground' : 'text-slate-300'
            }`}>
              {t.authRoleAdminDesc}
            </p>

            {/* Quick 1-Click Demo Entrance for Jury / Testing */}
            <div className="mb-4">
              <button
                type="button"
                onClick={() => {
                  setErrorMsg('');
                  login('admin');
                }}
                className="w-full py-3 px-4 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-md cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>{t.authFastAdminDemo}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <p className={`text-[11px] text-center mt-1.5 font-medium ${
                isLight ? 'text-muted-foreground' : 'text-muted-foreground'
              }`}>
                {lang === 'kz' ? '1 басу арқылы кіру (Әкімдік инспекторы)' : lang === 'en' ? '1-click demo entry (City Inspector)' : 'Вход в 1 клик для демонстрации (Инспектор Акимата)'}
              </p>
            </div>

            <div className="relative flex py-2 items-center mb-4">
              <div className={`flex-grow border-t ${isLight ? 'border-border' : 'border-slate-700'}`}></div>
              <span className={`flex-shrink mx-3 text-[11px] font-extrabold uppercase tracking-wider ${
                isLight ? 'text-muted-foreground' : 'text-muted-foreground'
              }`}>
                {t.authOfficialLogin}
              </span>
              <div className={`flex-grow border-t ${isLight ? 'border-border' : 'border-slate-700'}`}></div>
            </div>

            {/* Admin Login Form */}
            <form onSubmit={handleAdminSubmit} className="space-y-3 flex-1 flex flex-col justify-between">
              <div className="space-y-3">
                <div>
                  <label className={`block text-xs font-bold mb-1 ${isLight ? 'text-foreground' : 'text-slate-300'}`}>
                    Служебный email / логин
                  </label>
                  <div className="relative">
                    <Mail className={`w-4 h-4 absolute left-3 top-2.5 ${isLight ? 'text-muted-foreground' : 'text-muted-foreground'}`} />
                    <input
                      type="text"
                      value={adminLogin}
                      onChange={(e) => setAdminLogin(e.target.value)}
                      className={`w-full pl-9 pr-3 py-2 border rounded-lg text-sm font-mono focus:outline-none ${
                        isLight 
                          ? 'bg-card border-border text-foreground focus:border-emerald-600' 
                          : 'bg-slate-950 border-slate-700 text-white focus:border-emerald-500'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-xs font-bold mb-1 ${isLight ? 'text-foreground' : 'text-slate-300'}`}>
                    {t.authPassword}
                  </label>
                  <div className="relative">
                    <Lock className={`w-4 h-4 absolute left-3 top-2.5 ${isLight ? 'text-muted-foreground' : 'text-muted-foreground'}`} />
                    <input
                      type={showAdminPassword ? 'text' : 'password'}
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      className={`w-full pl-9 pr-9 py-2 border rounded-lg text-sm font-mono focus:outline-none ${
                        isLight 
                          ? 'bg-card border-border text-foreground focus:border-emerald-600' 
                          : 'bg-slate-950 border-slate-700 text-white focus:border-emerald-500'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowAdminPassword(!showAdminPassword)}
                      className={`absolute right-3 top-2.5 cursor-pointer ${
                        isLight ? 'text-muted-foreground hover:text-foreground' : 'text-muted-foreground hover:text-white'
                      }`}
                    >
                      {showAdminPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className={`w-full py-2.5 px-4 rounded-lg font-bold text-sm border transition-colors cursor-pointer ${
                    isLight 
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90 text-white border-slate-800 shadow-xs' 
                      : 'bg-primary/90 hover:bg-slate-700 text-white border-slate-600'
                  }`}
                >
                  {t.authLoginBtn}
                </button>
              </div>
            </form>
          </div>

        </div>

      </main>

      {/* FOOTER: Official Project Credentials & Feedback */}
      <footer className={`relative z-10 border-t py-4 text-xs transition-colors ${
        isLight 
          ? 'border-border bg-card/95 text-muted-foreground shadow-xs' 
          : 'border-slate-800/80 bg-slate-950/80 text-muted-foreground backdrop-blur-md'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="font-semibold">
              Smart Qala Semey • Официальный пилотный сервис города Семей
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span>Техподдержка разработчиков:</span>
            <a 
              href="mailto:dev@smartqala-semey.kz" 
              className={`font-mono underline ${isLight ? 'text-blue-700 hover:text-info-soft-foreground font-bold' : 'text-blue-400 hover:text-blue-300'}`}
            >
              dev@smartqala-semey.kz
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
