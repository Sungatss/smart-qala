'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CityMap from '@/components/CityMap';
import PageHeader from '@/components/PageHeader';
import { useApp } from '@/context/AppContext';
import { getRequests } from '@/lib/mock-data';

export default function MapPage() {
  const { t } = useApp();
  const requests = getRequests();

  return (
    <div className="flex flex-col min-h-screen bg-muted text-foreground">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
        <PageHeader
          title={t.mapHeaderTitle}
          description={t.mapHeaderSubtitle}
          actions={
            <span className="text-xs text-muted-foreground bg-card border border-border px-3 py-1.5 rounded-md font-medium">
              {t.mapGeotag}
            </span>
          }
        />

        <CityMap initialRequests={requests} />
      </main>

      <Footer />
    </div>
  );
}
