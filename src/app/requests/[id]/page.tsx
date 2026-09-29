import React from 'react';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getRequestById } from '@/lib/mock-data';
import RequestDetailClient from '@/components/RequestDetailClient';

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ created?: string }>;
}

export const dynamic = 'force-dynamic';

export default async function RequestDetailPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { created } = await searchParams;
  const request = getRequestById(id);

  if (!request) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900">
      <Navbar />

      <main className="flex-1 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <RequestDetailClient
            initialRequest={request}
            isCreatedJustNow={created === 'true'}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
