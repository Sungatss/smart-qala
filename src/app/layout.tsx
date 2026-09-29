import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AppProvider } from '@/context/AppContext';
import AppShell from '@/components/AppShell';
import AuthModal from '@/components/AuthModal';
import './globals.css';

const inter = Inter({
  subsets: ['latin', 'cyrillic', 'cyrillic-ext'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Smart Qala - Городской сервис Семей',
  description: 'Прием и открытый контроль решения городских проблем Семея',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className={inter.variable}>
      <body className={`${inter.className} min-h-screen bg-muted text-gray-900 flex flex-col`}>
        <AppProvider>
          <AuthModal />
          <AppShell>
            {children}
          </AppShell>
        </AppProvider>
      </body>
    </html>
  );
}

