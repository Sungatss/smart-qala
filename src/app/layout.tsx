import type { Metadata } from 'next';
import { AppProvider } from '@/context/AppContext';
import AppShell from '@/components/AppShell';
import AuthModal from '@/components/AuthModal';
import './globals.css';

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
    <html lang="ru">
      <body className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
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

