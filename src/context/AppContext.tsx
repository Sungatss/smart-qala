'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole, UserProfile, NotificationItem, District } from '@/types';
import { MOCK_USERS } from '@/lib/mock-data';
import { Language, Translations, TRANSLATIONS } from '@/lib/translations';

interface AppContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: Translations;
  role: UserRole;
  setRole: (role: UserRole) => void;
  user: UserProfile;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
  easyMode: boolean;
  toggleEasyMode: () => void;
  notifications: NotificationItem[];
  unreadCount: number;
  markNotificationRead: (id: string) => Promise<void>;
  upvotedIds: Set<string>;
  upvote: (requestId: string) => Promise<number | null>;

  // Authentication gate & modal state
  hasEnteredSite: boolean;
  isAuthenticated: boolean;
  isGuest: boolean;
  isAuthModalOpen: boolean;
  modalInitialRole?: UserRole;
  modalInitialTab?: 'login' | 'register';
  openAuthModal: (role?: UserRole, tab?: 'login' | 'register') => void;
  closeAuthModal: () => void;
  login: (role: UserRole, customUser?: Partial<UserProfile>) => void;
  loginAsGuest: () => void;
  registerCitizen: (data: { name: string; phone: string; email: string; district?: District }) => void;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('smart_qala_lang') as Language;
        if (saved && ['ru', 'kz', 'en'].includes(saved)) return saved;
      } catch {}
    }
    return 'ru';
  });

  const setLang = (next: Language) => {
    setLangState(next);
    try { localStorage.setItem('smart_qala_lang', next); } catch {}
  };
  const t = TRANSLATIONS[lang] || TRANSLATIONS.ru;

  const [role, setRoleState] = useState<UserRole>(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedRole = localStorage.getItem('smart_qala_role') as UserRole;
        if (savedRole && MOCK_USERS[savedRole]) {
          return savedRole;
        }
      } catch {}
    }
    return 'citizen';
  });

  const [isGuest, setIsGuest] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      try { return localStorage.getItem('smart_qala_is_guest') === 'true'; } catch {}
    }
    return false;
  });

  const [hasEnteredSite, setHasEnteredSite] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      try {
        const params = new URLSearchParams(window.location.search);
        if (params.get('entered') === 'true') {
          localStorage.setItem('smart_qala_entered', 'true');
          return true;
        }
        return localStorage.getItem('smart_qala_entered') === 'true' ||
          localStorage.getItem('voiceofsemey_entered') === 'true';
      } catch {}
    }
    return false;
  });

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('smart_qala_custom_user');
        if (saved) return JSON.parse(saved) as UserProfile;
      } catch {}
    }
    return null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      try {
        return localStorage.getItem('smart_qala_authenticated') === 'true';
      } catch {}
    }
    return false; // Opens AuthModal first as requested!
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      try {
        const isAuth = localStorage.getItem('smart_qala_authenticated') === 'true';
        return !isAuth; // Open modal if not authenticated
      } catch {}
    }
    return true;
  });

  const [modalInitialRole, setModalInitialRole] = useState<UserRole | undefined>('citizen');
  const [modalInitialTab, setModalInitialTab] = useState<'login' | 'register' | undefined>('login');

  const [theme, setThemeState] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('smart_qala_theme');
      if (saved === 'light' || saved === 'dark') {
        setThemeState(saved);
        document.documentElement.classList.toggle('dark', saved === 'dark');
      }
    } catch {}
  }, []);

  const setTheme = (next: 'light' | 'dark') => {
    setThemeState(next);
    document.documentElement.classList.toggle('dark', next === 'dark');
    try { localStorage.setItem('smart_qala_theme', next); } catch {}
  };

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  const [easyMode, setEasyModeState] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedEasyMode = localStorage.getItem('smart_qala_easy_mode') === 'true';
        if (savedEasyMode) {
          document.documentElement.classList.add('easy-mode');
        }
        return savedEasyMode;
      } catch {}
    }
    return false;
  });

  const [upvotedIds, setUpvotedIds] = useState<Set<string>>(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedUpvotes = localStorage.getItem('smart_qala_upvotes');
        if (savedUpvotes) {
          return new Set(JSON.parse(savedUpvotes));
        }
      } catch {}
    }
    return new Set();
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    let ignore = false;
    fetch('/api/notifications')
      .then((res) => res.json())
      .then((data) => {
        if (!ignore && data.success) {
          setNotifications(data.data);
        }
      })
      .catch(() => {});

    return () => {
      ignore = true;
    };
  }, []);

  const login = (newRole: UserRole, customData?: Partial<UserProfile>) => {
    setRoleState(newRole);
    setIsGuest(false);
    setIsAuthenticated(true);
    setHasEnteredSite(true);
    setIsAuthModalOpen(false);
    const baseUser = MOCK_USERS[newRole] || MOCK_USERS.citizen;
    const nextUser: UserProfile = { ...baseUser, ...customData, role: newRole, isGuest: false };
    setCurrentUser(nextUser);
    try {
      localStorage.setItem('smart_qala_role', newRole);
      localStorage.setItem('smart_qala_authenticated', 'true');
      localStorage.setItem('smart_qala_is_guest', 'false');
      localStorage.setItem('smart_qala_entered', 'true');
      localStorage.setItem('smart_qala_custom_user', JSON.stringify(nextUser));
    } catch {}
  };

  const loginAsGuest = () => {
    const guest: UserProfile = {
      id: 'user-guest-1',
      name: 'Гость г. Семей',
      role: 'citizen',
      roleTitle: 'Гость (Режим просмотра)',
      email: '',
      phone: '',
      district: 'Центральный',
      isGuest: true
    };
    setRoleState('citizen');
    setIsGuest(true);
    setIsAuthenticated(true);
    setHasEnteredSite(true);
    setIsAuthModalOpen(false);
    setCurrentUser(guest);
    try {
      localStorage.setItem('smart_qala_role', 'citizen');
      localStorage.setItem('smart_qala_authenticated', 'true');
      localStorage.setItem('smart_qala_is_guest', 'true');
      localStorage.setItem('smart_qala_entered', 'true');
      localStorage.setItem('smart_qala_custom_user', JSON.stringify(guest));
    } catch {}
  };

  const registerCitizen = (data: { name: string; phone: string; email: string; district?: District }) => {
    login('citizen', {
      id: `citizen-${Date.now()}`,
      name: data.name.trim() || 'Новый житель',
      roleTitle: 'Зарегистрированный житель г. Семей',
      phone: data.phone.trim(),
      email: data.email.trim(),
      district: data.district || 'Центральный'
    });
  };

  const logout = () => {
    setIsAuthenticated(false);
    setIsGuest(false);
    setHasEnteredSite(false);
    setCurrentUser(null);
    setIsAuthModalOpen(true);
    try {
      localStorage.removeItem('smart_qala_authenticated');
      localStorage.removeItem('smart_qala_is_guest');
      localStorage.removeItem('smart_qala_entered');
      localStorage.removeItem('smart_qala_custom_user');
    } catch {}
  };

  const openAuthModal = (initialRole?: UserRole, initialTab?: 'login' | 'register') => {
    setModalInitialRole(initialRole || 'citizen');
    setModalInitialTab(initialTab || 'login');
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    setIsGuest(false);
    const nextUser = MOCK_USERS[newRole] || MOCK_USERS.citizen;
    setCurrentUser(nextUser);
    try {
      localStorage.setItem('smart_qala_role', newRole);
      localStorage.setItem('smart_qala_is_guest', 'false');
      localStorage.setItem('smart_qala_custom_user', JSON.stringify(nextUser));
    } catch {}
  };

  const toggleEasyMode = () => {
    setEasyModeState((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('easy-mode');
      } else {
        document.documentElement.classList.remove('easy-mode');
      }
      try {
        localStorage.setItem('smart_qala_easy_mode', String(next));
      } catch {}
      return next;
    });
  };

  const markNotificationRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
    } catch {}
  };

  const upvote = async (requestId: string): Promise<number | null> => {
    if (upvotedIds.has(requestId)) {
      return null;
    }

    try {
      const res = await fetch(`/api/requests/${requestId}/upvote`, {
        method: 'POST'
      });
      const data = await res.json();
      if (data.success && data.data) {
        const nextSet = new Set(upvotedIds);
        nextSet.add(requestId);
        setUpvotedIds(nextSet);
        try {
          localStorage.setItem('smart_qala_upvotes', JSON.stringify([...nextSet]));
        } catch {}
        return data.data.upvotes;
      }
    } catch (err) {
      console.error('Error upvoting:', err);
    }
    return null;
  };

  const unreadCount = notifications.filter((n) => !n.read).length;
  const activeUser = currentUser || MOCK_USERS[role] || MOCK_USERS.citizen;

  return (
    <AppContext.Provider
      value={{
        lang,
        setLang,
        t,
        role,
        setRole,
        user: activeUser,
        theme,
        setTheme,
        toggleTheme,
        easyMode,
        toggleEasyMode,
        notifications,
        unreadCount,
        markNotificationRead,
        upvotedIds,
        upvote,
        hasEnteredSite,
        isAuthenticated,
        isGuest,
        isAuthModalOpen,
        modalInitialRole,
        modalInitialTab,
        openAuthModal,
        closeAuthModal,
        login,
        loginAsGuest,
        registerCitizen,
        logout
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return ctx;
}
