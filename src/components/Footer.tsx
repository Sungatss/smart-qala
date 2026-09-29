import React from 'react';
import { Building2, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-card mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-primary text-primary-foreground flex items-center justify-center">
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                Smart Qala • Семей
              </p>
              <p className="text-xs text-muted-foreground">
                Платформа открытого взаимодействия жителей и коммунальных служб города
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted px-3 py-2 rounded-md border border-gray-200">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              ДЕМОНСТРАЦИОННЫЕ ДАННЫЕ / СЕМЕЙ. Разработано для Smart City Hackathon 2026.
            </span>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-2">
          <span>© 2026 Акимат города Семей. Все права защищены.</span>
          <span>Стандарт открытого городского управления Республики Казахстан</span>
        </div>
      </div>
    </footer>
  );
}
