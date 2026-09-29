'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole, UserProfile, NotificationItem, District } from '@/types';
import { MOCK_USERS } from '@/lib/mock-data';
import { Language, Translations, TRANSLATIONS } from '@/lib/translations';

interface AppContextType {
  // Language
  lang: Language;
  setLang: (lang: Language) => void;
  t: Translations;

  // Active Role & User
  role: UserRole;
  setRole: (role: UserRole) => void;
  user: UserProfile;

  // Theme
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;

  // Accessibility (WCAG AAA High Contrast & Large Font)
  easyMode: boolean;
  toggleEasyMode: () => void;

  // Notifications
  notifications: NotificationItem[];
  unreadCount: number;
  markNotificationRead: (id: string) => Promise<void>;

  // Upvotes
  upvotedIds: Set<string>;
  upvote: (requestId: string) => Promise<number | null>;

  // Authentication & Gate State
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
  // Language state
  const [lang, setLangState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedLang = localStorage.getItem('smart_qala_lang') as Language;
        if (savedLang && ['ru', 'kz', 'en'].includes(savedLang)) {
          return savedLang;
        }
      } catch {}
    }
    return 'ru';
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    try {
      localStorage.setItem('smart_qala_lang', newLang);
    } catch {}
  };

  const t = TRANSLATIONS[lang] || TRANSLATIONS.ru;

  // Role state
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
      try {
        return localStorage.getItem('smart_qala_is_guest') === 'true';
      } catch {}
    }
    return false;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      try {
        return localStorage.getItem('smart_qala_authenticated') === 'true';
      } catch {}
    }
    return false;
  });

  // Has entered site gate (if false, user sees full-page AuthGate)
  const [hasEnteredSite, setHasEnteredSite] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      try {
        return localStorage.getItem('smart_qala_entered') === 'true';
      } catch {}
    }
    return false;
  });

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('smart_qala_custom_user');
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return null;
  });

  // Modal State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [modalInitialRole, setModalInitialRole] = useState<UserRole | undefined>('citizen');
  const [modalInitialTab, setModalInitialTab] = useState<'login' | 'register' | undefined>('login');

  const openAuthModal = (initialRole?: UserRole, initialTab?: 'login' | 'register') => {
    setModalInitialRole(initialRole || 'citizen');
    setModalInitialTab(initialTab || 'login');
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  // Theme State ('light' by default)
  const [theme, setThemeState] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedTheme = localStorage.getItem('smart_qala_theme') as 'light' | 'dark';
        if (savedTheme === 'dark' || savedTheme === 'light') {
          setThemeState(savedTheme);
          if (savedTheme === 'dark') {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }
      } catch {}
    }
  }, []);

  const setTheme = (newTheme: 'light' | 'dark') => {
    setThemeState(newTheme);
    try {
      localStorage.setItem('smart_qala_theme', newTheme);
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch {}
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };



  // Easy mode / Large font
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

    const baseUser = MOCK_USERS[newRole] || MOCK_USERS.citizen;
    const finalUser: UserProfile = customData
      ? { ...baseUser, ...customData, role: newRole, isGuest: false }
      : { ...baseUser, isGuest: false };

    setCurrentUser(finalUser);

    try {
      localStorage.setItem('smart_qala_role', newRole);
      localStorage.setItem('smart_qala_authenticated', 'true');
      localStorage.setItem('smart_qala_is_guest', 'false');
      localStorage.setItem('smart_qala_entered', 'true');
      localStorage.setItem('smart_qala_custom_user', JSON.stringify(finalUser));
    } catch {}
  };

  const loginAsGuest = () => {
    setRoleState('citizen');
    setIsGuest(true);
    setIsAuthenticated(true);
    setHasEnteredSite(true);

    const guestProfile: UserProfile = {
      id: 'user-guest-1',
      name: 'Гость г. Семей',
      role: 'citizen',
      roleTitle: 'Гость (Режим просмотра)',
      email: '',
      phone: '',
      district: 'Центральный',
      isGuest: true
    };

    setCurrentUser(guestProfile);

    try {
      localStorage.setItem('smart_qala_role', 'citizen');
      localStorage.setItem('smart_qala_authenticated', 'true');
      localStorage.setItem('smart_qala_is_guest', 'true');
      localStorage.setItem('smart_qala_entered', 'true');
      localStorage.setItem('smart_qala_custom_user', JSON.stringify(guestProfile));
    } catch {}
  };

  const registerCitizen = (data: { name: string; phone: string; email: string; district?: District }) => {
    const newProfile: UserProfile = {
      id: `citizen-${Date.now()}`,
      name: data.name.trim() || 'Новый житель',
      role: 'citizen',
      roleTitle: 'Зарегистрированный житель г. Семей',
      email: data.email.trim() || 'resident@semey.kz',
      phone: data.phone.trim() || '+7 (705) 000-00-00',
      district: data.district || 'Центральный',
      isGuest: false
    };

    setRoleState('citizen');
    setIsGuest(false);
    setIsAuthenticated(true);
    setHasEnteredSite(true);
    setCurrentUser(newProfile);

    try {
      localStorage.setItem('smart_qala_role', 'citizen');
      localStorage.setItem('smart_qala_authenticated', 'true');
      localStorage.setItem('smart_qala_is_guest', 'false');
      localStorage.setItem('smart_qala_entered', 'true');
      localStorage.setItem('smart_qala_custom_user', JSON.stringify(newProfile));
    } catch {}
  };

  const logout = () => {
    setIsAuthenticated(false);
    setIsGuest(false);
    setHasEnteredSite(false);
    setCurrentUser(null);
    try {
      localStorage.removeItem('smart_qala_authenticated');
      localStorage.removeItem('smart_qala_is_guest');
      localStorage.removeItem('smart_qala_entered');
      localStorage.removeItem('smart_qala_custom_user');
    } catch {}
  };

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    setIsGuest(false);
    const newUser = MOCK_USERS[newRole] || MOCK_USERS.citizen;
    setCurrentUser(newUser);
    try {
      localStorage.setItem('smart_qala_role', newRole);
      localStorage.setItem('smart_qala_is_guest', 'false');
      localStorage.setItem('smart_qala_custom_user', JSON.stringify(newUser));
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

  const upvote = async (requestId: string): Promise<number | null> => {
    try {
      const res = await fetch(`/api/requests/${requestId}/upvote`, {
        method: 'POST'
      });
      const data = await res.json();
      if (data.success) {
        setUpvotedIds((prev) => {
          const next = new Set(prev);
          next.add(requestId);
          try {
            localStorage.setItem('smart_qala_upvotes', JSON.stringify(Array.from(next)));
          } catch {}
          return next;
        });
        return data.upvotes;
      }
      return null;
    } catch {
      return null;
    }
  };

  const markNotificationRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const activeUser: UserProfile = currentUser || (isGuest ? {
    id: 'user-guest-1',
    name: 'Гость г. Семей',
    role: 'citizen',
    roleTitle: 'Гость (Режим просмотра)',
    email: '',
    phone: '',
    district: 'Центральный',
    isGuest: true
  } : MOCK_USERS[role] || MOCK_USERS.citizen);

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
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
