'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { District, UserRole } from '@/types';
import {
  Phone,
  Lock,
  Mail,
  User,
  Building,
  ShieldCheck,
  ArrowRight,
  Eye,
  EyeOff,
  Compass,
  ChevronDown,
  Sparkles,
  AlertCircle,
  Briefcase,
  ArrowLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';

export interface AuthFormProps {
  inModal?: boolean;
  onSuccess?: () => void;
  defaultView?: 'resident' | 'staff';
  defaultDemoOpen?: boolean;
}

export default function AuthForm({
  inModal = false,
  onSuccess,
  defaultView = 'resident',
  defaultDemoOpen = false,
}: AuthFormProps) {
  const router = useRouter();
  const {
    t,
    login,
    loginAsGuest,
    registerCitizen,
  } = useApp();

  // View state: 'resident' or 'staff'
  const [view, setView] = useState<'resident' | 'staff'>(defaultView);
  const [residentTab, setResidentTab] = useState<'login' | 'register'>('login');

  // Resident Login inputs (No prefilled values)
  const [residentLoginInput, setResidentLoginInput] = useState('');
  const [residentPassword, setResidentPassword] = useState('');
  const [showResidentPassword, setShowResidentPassword] = useState(false);

  // Resident Register inputs (No prefilled values)
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regDistrict, setRegDistrict] = useState<District>('Центральный');
  const [regPassword, setRegPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);

  // Staff Login inputs (No prefilled values)
  const [staffRole, setStaffRole] = useState<'employee' | 'admin'>('employee');
  const [staffLogin, setStaffLogin] = useState('');
  const [staffPassword, setStaffPassword] = useState('');
  const [showStaffPassword, setShowStaffPassword] = useState(false);

  // Error message
  const [errorMsg, setErrorMsg] = useState('');

  // Demo accounts collapsible state
  const isDemoEnabled = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
  const [isDemoOpen, setIsDemoOpen] = useState(defaultDemoOpen);

  // Handlers
  const handleGuestEntry = () => {
    setErrorMsg('');
    loginAsGuest();
    onSuccess?.();
  };

  const handleResidentLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!residentLoginInput.trim()) {
      setErrorMsg(t.authErrorFillFields);
      return;
    }
    setErrorMsg('');
    login('citizen', {
      name: 'Айгүл Ахметова',
      phone: residentLoginInput,
      email: residentLoginInput.includes('@')
        ? residentLoginInput
        : 'resident@semey.kz',
      district: 'Центральный',
    });
    onSuccess?.();
  };

  const handleResidentRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regPhone.trim()) {
      setErrorMsg(t.authErrorFillFields);
      return;
    }
    setErrorMsg('');
    registerCitizen({
      name: regName,
      phone: regPhone,
      email: regEmail || `${regPhone.replace(/\D/g, '')}@semey.kz`,
      district: regDistrict,
    });
    onSuccess?.();
  };

  const handleStaffLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffLogin.trim() || !staffPassword.trim()) {
      setErrorMsg(t.authErrorFillFields);
      return;
    }
    setErrorMsg('');
    login(staffRole);
    onSuccess?.();
    if (!inModal) {
      router.push('/admin');
    }
  };

  const handleQuickDemo = (roleType: UserRole) => {
    setErrorMsg('');
    if (roleType === 'citizen') {
      login('citizen', {
        name: 'Айгүл Ахметова',
        phone: '+7 (705) 412-88-99',
        email: 'resident@semey.kz',
        district: 'Центральный',
      });
      onSuccess?.();
    } else {
      login(roleType);
      onSuccess?.();
      if (!inModal) {
        router.push('/admin');
      }
    }
  };

  return (
    <div className="w-full">
      {/* Error Banner */}
      {errorMsg && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-danger-soft bg-danger-soft p-3 text-xs font-medium text-danger-soft-foreground">
          <AlertCircle className="h-4 w-4 shrink-0 text-danger" />
          <span>{errorMsg}</span>
        </div>
      )}

      <AnimatePresence mode="wait">
        {view === 'resident' ? (
          <motion.div
            key="resident"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            {/* Resident Tabs: Sign in | Create account */}
            <Tabs
              value={residentTab}
              onValueChange={(val) => {
                setResidentTab(val as 'login' | 'register');
                setErrorMsg('');
              }}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 h-11 p-1 rounded-xl bg-muted">
                <TabsTrigger
                  value="login"
                  className="rounded-lg h-9 text-sm font-medium data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-xs"
                >
                  {t.authResidentTabSignIn}
                </TabsTrigger>
                <TabsTrigger
                  value="register"
                  className="rounded-lg h-9 text-sm font-medium data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-xs"
                >
                  {t.authResidentTabSignUp}
                </TabsTrigger>
              </TabsList>

              {/* Resident Sign In Tab Content */}
              <TabsContent value="login" className="mt-4 space-y-4">
                <form onSubmit={handleResidentLoginSubmit} className="space-y-3.5">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground block">
                      {t.authPhoneOrEmail}
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="text"
                        value={residentLoginInput}
                        onChange={(e) => setResidentLoginInput(e.target.value)}
                        placeholder="+7 (705) 000-00-00"
                        className="h-11 rounded-xl bg-muted pl-10 text-sm border-border focus-visible:ring-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground block">
                      {t.authPassword}
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type={showResidentPassword ? 'text' : 'password'}
                        value={residentPassword}
                        onChange={(e) => setResidentPassword(e.target.value)}
                        placeholder="••••••••"
                        className="h-11 rounded-xl bg-muted pl-10 pr-10 text-sm border-border focus-visible:ring-1"
                      />
                      <button
                        type="button"
                        onClick={() => setShowResidentPassword(!showResidentPassword)}
                        className="absolute right-3.5 top-3.5 text-muted-foreground hover:text-foreground cursor-pointer"
                        aria-label="Toggle password visibility"
                      >
                        {showResidentPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full h-11 rounded-xl font-semibold text-sm bg-primary text-primary-foreground hover:bg-primary/90 mt-2"
                  >
                    <span>{t.authLoginBtn}</span>
                    <ArrowRight className="h-4 w-4 ml-1.5" />
                  </Button>
                </form>
              </TabsContent>

              {/* Resident Create Account Tab Content */}
              <TabsContent value="register" className="mt-4 space-y-4">
                <form onSubmit={handleResidentRegisterSubmit} className="space-y-3">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground block">
                      {t.authFullName}
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="text"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        placeholder="Алихан Бокейханов"
                        className="h-11 rounded-xl bg-muted pl-10 text-sm border-border focus-visible:ring-1"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground block">
                      {t.authPhone}
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="tel"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        placeholder="+7 (777) 123-45-67"
                        className="h-11 rounded-xl bg-muted pl-10 text-sm border-border focus-visible:ring-1"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground block">
                      {t.authDistrict}
                    </label>
                    <Select
                      value={regDistrict}
                      onValueChange={(val) => setRegDistrict(val as District)}
                    >
                      <SelectTrigger className="h-11 rounded-xl bg-muted text-sm border-border focus:ring-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Центральный">Центральный</SelectItem>
                        <SelectItem value="Затон">Затон</SelectItem>
                        <SelectItem value="Юность">Юность</SelectItem>
                        <SelectItem value="Левый берег">Левый берег</SelectItem>
                        <SelectItem value="Восточный">Восточный</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground block">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="email"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="resident@semey.kz"
                        className="h-11 rounded-xl bg-muted pl-10 text-sm border-border focus-visible:ring-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground block">
                      {t.authPassword}
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type={showRegPassword ? 'text' : 'password'}
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="••••••••"
                        className="h-11 rounded-xl bg-muted pl-10 pr-10 text-sm border-border focus-visible:ring-1"
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegPassword(!showRegPassword)}
                        className="absolute right-3.5 top-3.5 text-muted-foreground hover:text-foreground cursor-pointer"
                        aria-label="Toggle password visibility"
                      >
                        {showRegPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full h-11 rounded-xl font-semibold text-sm bg-primary text-primary-foreground hover:bg-primary/90 mt-2"
                  >
                    <span>{t.authRegisterBtn}</span>
                    <ArrowRight className="h-4 w-4 ml-1.5" />
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            {/* Below primary button: "or", then outline "Continue as guest" */}
            <div className="relative my-4 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <span className="relative bg-card px-3 text-xs text-muted-foreground font-medium lowercase">
                {t.authOrDivider}
              </span>
            </div>

            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={handleGuestEntry}
              className="w-full h-11 rounded-xl font-medium text-sm border-border text-foreground hover:bg-muted"
            >
              <Compass className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{t.authContinueAsGuest}</span>
            </Button>

            {/* Link to Staff view */}
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => {
                  setView('staff');
                  setErrorMsg('');
                }}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <Briefcase className="h-3.5 w-3.5" />
                <span>{t.authLinkToStaff}</span>
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="staff"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            {/* Staff header */}
            <div className="space-y-1">
              <h2 className="text-base font-semibold text-foreground">
                {t.authStaffTitle}
              </h2>
              <p className="text-xs text-muted-foreground font-normal">
                {t.authStaffSubtitle}
              </p>
            </div>

            {/* Staff form */}
            <form onSubmit={handleStaffLoginSubmit} className="space-y-3.5">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground block">
                  {t.authStaffRoleSelect}
                </label>
                <Select
                  value={staffRole}
                  onValueChange={(val) => setStaffRole(val as 'employee' | 'admin')}
                >
                  <SelectTrigger className="h-11 rounded-xl bg-muted text-sm border-border focus:ring-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="employee">
                      {t.authStaffDispatcher}
                    </SelectItem>
                    <SelectItem value="admin">
                      {t.authStaffAkimat}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground block">
                  {t.authOfficialLogin}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    value={staffLogin}
                    onChange={(e) => setStaffLogin(e.target.value)}
                    placeholder="official@semey-gov.kz"
                    className="h-11 rounded-xl bg-muted pl-10 text-sm border-border focus-visible:ring-1"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground block">
                  {t.authPassword}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type={showStaffPassword ? 'text' : 'password'}
                    value={staffPassword}
                    onChange={(e) => setStaffPassword(e.target.value)}
                    placeholder="••••••••"
                    className="h-11 rounded-xl bg-muted pl-10 pr-10 text-sm border-border focus-visible:ring-1"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowStaffPassword(!showStaffPassword)}
                    className="absolute right-3.5 top-3.5 text-muted-foreground hover:text-foreground cursor-pointer"
                    aria-label="Toggle password visibility"
                  >
                    {showStaffPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full h-11 rounded-xl font-semibold text-sm bg-primary text-primary-foreground hover:bg-primary/90 mt-2"
              >
                <span>{t.authLoginBtn}</span>
                <ArrowRight className="h-4 w-4 ml-1.5" />
              </Button>
            </form>

            {/* Below primary button: "or", then outline "Continue as guest" */}
            <div className="relative my-4 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <span className="relative bg-card px-3 text-xs text-muted-foreground font-medium lowercase">
                {t.authOrDivider}
              </span>
            </div>

            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={handleGuestEntry}
              className="w-full h-11 rounded-xl font-medium text-sm border-border text-foreground hover:bg-muted"
            >
              <Compass className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{t.authContinueAsGuest}</span>
            </Button>

            {/* Link back to Resident view */}
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => {
                  setView('resident');
                  setErrorMsg('');
                }}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>{t.authLinkToResident}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
