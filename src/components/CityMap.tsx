'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import type { Map as LeafletMap, LayerGroup } from 'leaflet';
import { CityRequest } from '@/types';
import { useApp } from '@/context/AppContext';
import { 
  MapPin, 
  Flame, 
  ThumbsUp, 
  ExternalLink 
} from 'lucide-react';
import Link from 'next/link';

interface CityMapProps {
  initialRequests: CityRequest[];
}

export default function CityMap({ initialRequests }: CityMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<LeafletMap | null>(null);
  const markersLayerRef = useRef<LayerGroup | null>(null);
  const heatLayerRef = useRef<LayerGroup | null>(null);

  const { upvote, upvotedIds } = useApp();

  const [requests, setRequests] = useState<CityRequest[]>(initialRequests);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('Все');
  const [selectedStatus, setSelectedStatus] = useState<string>('Все');
  const [selectedPriority, setSelectedPriority] = useState<string>('Все');
  const [viewMode, setViewMode] = useState<'markers' | 'heatmap'>('markers');
  const [selectedRequest, setSelectedRequest] = useState<CityRequest | null>(null);

  const getMarkerColor = (req: CityRequest): string => {
    if (req.status === 'resolved') return '#059669'; // Emerald
    if (req.type === 'idea') return '#4f46e5'; // Indigo
    if (req.priority === 'high') return '#dc2626'; // Red
    if (req.priority === 'medium') return '#d97706'; // Amber
    return '#475569'; // Slate
  };

  const filteredRequests = requests.filter((r) => {
    const matchesType = selectedType === 'all' || r.type === selectedType;
    const matchesCat = selectedCategory === 'Все' || r.category === selectedCategory;
    const matchesStat = selectedStatus === 'Все' || r.status === selectedStatus;
    const matchesPrio = selectedPriority === 'Все' || r.priority === selectedPriority;
    return matchesType && matchesCat && matchesStat && matchesPrio;
  });

  const renderMarkers = useCallback(async () => {
    if (!markersLayerRef.current || !heatLayerRef.current) return;
    const L = await import('leaflet');

    markersLayerRef.current.clearLayers();
    heatLayerRef.current.clearLayers();

    if (viewMode === 'markers') {
      filteredRequests.forEach((req) => {
        const color = getMarkerColor(req);

        const circle = L.circleMarker([req.latitude, req.longitude], {
          radius: req.priority === 'high' ? 9 : 7,
          fillColor: color,
          color: '#ffffff',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.9
        });

        circle.on('click', () => {
          setSelectedRequest(req);
        });

        circle.bindTooltip(`<b>${req.id}</b>: ${req.title}`, {
          direction: 'top',
          offset: [0, -5]
        });

        circle.addTo(markersLayerRef.current!);
      });
    } else {
      // Heatmap concentration simulation circles
      filteredRequests.forEach((req) => {
        const radius = req.priority === 'high' ? 450 : req.priority === 'medium' ? 300 : 200;
        const color = req.priority === 'high' ? '#dc2626' : req.priority === 'medium' ? '#ea580c' : '#ca8a04';

        L.circle([req.latitude, req.longitude], {
          radius,
          fillColor: color,
          fillOpacity: 0.35,
          stroke: false
        }).addTo(heatLayerRef.current!);

        // Core hotspot
        L.circleMarker([req.latitude, req.longitude], {
          radius: 4,
          fillColor: '#991b1b',
          color: '#ffffff',
          weight: 1,
          fillOpacity: 1
        }).addTo(heatLayerRef.current!);
      });
    }
  }, [filteredRequests, viewMode]);

  // Initialize Leaflet map
  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      if (!mapContainerRef.current || mapInstanceRef.current) return;

      const L = await import('leaflet');

      // Import Leaflet styles
      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link');
        link.id = 'leaflet-css';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      if (!isMounted || !mapContainerRef.current) return;

      // Semey coordinates
      const map = L.map(mapContainerRef.current, {
        center: [50.4111, 80.2458],
        zoom: 13,
        zoomControl: true
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(map);

      mapInstanceRef.current = map;
      markersLayerRef.current = L.layerGroup().addTo(map);
      heatLayerRef.current = L.layerGroup().addTo(map);

      renderMarkers();
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [renderMarkers]);

  // Update map markers when filters or mode change
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    renderMarkers();
  }, [renderMarkers]);

  const handleUpvoteClick = async (id: string) => {
    const newCount = await upvote(id);
    if (newCount !== null) {
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, upvotes: newCount } : r))
      );
      if (selectedRequest && selectedRequest.id === id) {
        setSelectedRequest({ ...selectedRequest, upvotes: newCount });
      }
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-140px)] min-h-[580px]">
      
      {/* Sidebar Controls & Legend */}
      <div className="w-full lg:w-80 bg-white rounded-md border border-gray-200 shadow-2xs p-4 flex flex-col justify-between overflow-y-auto shrink-0">
        <div className="space-y-4">
          
          <div className="pb-3 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-slate-700" />
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Карта инцидентов Семея
              </span>
            </div>
            <span className="text-[10px] font-mono bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">
              {filteredRequests.length} точек
            </span>
          </div>

          {/* Mode Switcher: Markers vs Heatmap */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Режим отображения
            </label>
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-gray-100 rounded-md border border-gray-200 text-xs">
              <button
                type="button"
                onClick={() => setViewMode('markers')}
                className={`py-1.5 px-2 rounded-md font-medium transition-colors flex items-center justify-center gap-1.5 ${
                  viewMode === 'markers'
                    ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Маркеры</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('heatmap')}
                className={`py-1.5 px-2 rounded-md font-medium transition-colors flex items-center justify-center gap-1.5 ${
                  viewMode === 'heatmap'
                    ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Flame className="w-3.5 h-3.5 text-amber-600" />
                <span>Теплокарта</span>
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="space-y-3 pt-2 border-t border-gray-100">
            {/* Type Filter */}
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Тип обращения
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full p-2 text-xs rounded-md border border-gray-300 bg-white"
              >
                <option value="all">Все (Проблемы и идеи)</option>
                <option value="problem">🔴 Только проблемы</option>
                <option value="idea">💡 Только городские идеи</option>
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Категория
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-2 text-xs rounded-md border border-gray-300 bg-white"
              >
                <option value="Все">Все категории</option>
                <option value="Дороги">Дороги</option>
                <option value="Освещение">Освещение</option>
                <option value="Мусор">Мусор</option>
                <option value="Транспорт">Транспорт</option>
                <option value="Благоустройство">Благоустройство</option>
                <option value="Экология">Экология</option>
                <option value="Водоснабжение">Водоснабжение</option>
                <option value="Безопасность">Безопасность</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Статус
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full p-2 text-xs rounded-md border border-gray-300 bg-white"
              >
                <option value="Все">Все статусы</option>
                <option value="new">Новое</option>
                <option value="assigned">Назначено</option>
                <option value="in_progress">В работе</option>
                <option value="resolved">Решено</option>
              </select>
            </div>

            {/* Priority Filter */}
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Уровень приоритета
              </label>
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="w-full p-2 text-xs rounded-md border border-gray-300 bg-white"
              >
                <option value="Все">Все приоритеты</option>
                <option value="high">Высокий (Срочно)</option>
                <option value="medium">Средний</option>
                <option value="low">Низкий</option>
              </select>
            </div>
          </div>

          {/* Color Legend */}
          <div className="pt-3 border-t border-gray-100 text-xs space-y-1.5">
            <span className="font-semibold text-slate-700 block text-[11px] uppercase tracking-wider">
              Обозначения на карте:
            </span>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-600 shrink-0"></span>
              <span className="text-slate-600">Высокий приоритет (угроза/авария)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-500 shrink-0"></span>
              <span className="text-slate-600">Средний приоритет</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-600 shrink-0"></span>
              <span className="text-slate-600">Устранено / Решено</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-indigo-600 shrink-0"></span>
              <span className="text-slate-600">Городская инициатива (Идея)</span>
            </div>
          </div>

        </div>

        <div className="pt-3 border-t border-gray-100 text-[11px] font-mono text-slate-500 text-center">
          ДЕМОНСТРАЦИОННЫЕ ДАННЫЕ / СЕМЕЙ
        </div>
      </div>

      {/* Map Canvas and Card Overlay */}
      <div className="flex-1 relative rounded-md border border-gray-200 overflow-hidden shadow-2xs">
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Selected Request Bottom Slide Card */}
        {selectedRequest && (
          <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 bg-white rounded-md border border-gray-300 shadow-xl p-4 z-20 animate-in fade-in slide-in-from-bottom duration-200">
            <div className="flex items-start justify-between pb-2 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                  {selectedRequest.id}
                </span>
                <span className="text-[11px] font-medium text-slate-600">
                  {selectedRequest.category}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRequest(null)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="mt-2.5">
              <h4 className="text-xs font-bold text-slate-900 line-clamp-2">
                {selectedRequest.title}
              </h4>
              <p className="text-[11px] text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                {selectedRequest.cleaned_text}
              </p>
              <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{selectedRequest.location_address}</span>
              </div>
            </div>

            {/* Actions: Upvote & View details */}
            <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => handleUpvoteClick(selectedRequest.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md border transition-colors ${
                  upvotedIds.has(selectedRequest.id)
                    ? 'bg-blue-50 border-blue-300 text-blue-700'
                    : 'bg-white border-gray-300 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <ThumbsUp className={`w-3.5 h-3.5 ${upvotedIds.has(selectedRequest.id) ? 'fill-blue-600 text-blue-600' : ''}`} />
                <span>
                  {upvotedIds.has(selectedRequest.id) ? 'Подтверждено' : 'У меня так же'}
                </span>
                <span className="font-mono font-bold bg-slate-100 px-1 rounded text-[10px]">
                  {selectedRequest.upvotes || 0}
                </span>
              </button>

              <Link
                href={`/requests/${selectedRequest.id}`}
                className="inline-flex items-center gap-1 text-xs font-semibold text-slate-900 hover:underline"
              >
                <span>Подробнее</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
