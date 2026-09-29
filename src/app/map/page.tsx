import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CityMap from '@/components/CityMap';
import { getRequests } from '@/lib/mock-data';

export const dynamic = 'force-dynamic';

export default function MapPage() {
  const requests = getRequests();

  return (
    <div className="flex flex-col min-h-screen bg-muted text-gray-900">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
              Интерактивная карта городской среды • Семей
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Мониторинг инцидентов, тепловая карта скопления проблем и городские идеи жителей в реальном времени.
            </p>
          </div>

          <div className="flex items-center gap-2 text-[11px] font-mono text-muted-foreground bg-card border border-gray-200 px-2.5 py-1 rounded">
            <span>Геопривязка: г. Семей, область Абай</span>
          </div>
        </div>

        <CityMap initialRequests={requests} />
      </main>

      <Footer />
    </div>
  );
}
