import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import IdeasClient from '@/components/IdeasClient';
import { getRequests } from '@/lib/mock-data';

export const dynamic = 'force-dynamic';

export default function IdeasPage() {
  const requests = getRequests();
  const ideas = requests.filter((r) => r.type === 'idea');

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <IdeasClient initialIdeas={ideas} />
      </main>

      <Footer />
    </div>
  );
}
