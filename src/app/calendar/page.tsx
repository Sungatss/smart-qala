import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CalendarClient from '@/components/CalendarClient';
import { getRequests } from '@/lib/mock-data';
import { getSubmissionDate, isCalendarDate } from '@/lib/calendar';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Календарь обращений — VoiceOfSemey',
};

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string | string[]; created?: string | string[] }>;
}) {
  const params = await searchParams;
  const requests = getRequests();
  const today = getSubmissionDate(new Date().toISOString())!;
  const requestedDate = typeof params.date === 'string' ? params.date : null;
  const createdRequest = requests.find((request) => request.id === params.created);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 md:px-6 md:py-12">
        <CalendarClient
          initialRequests={requests}
          today={today}
          initialDate={isCalendarDate(requestedDate) ? requestedDate : today}
          createdRequestId={createdRequest?.id}
        />
      </main>
      <Footer />
    </div>
  );
}
