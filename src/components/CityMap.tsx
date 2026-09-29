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
import { MAP_COLORS } from '@/lib/design-tokens';

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
    if (req.status === 'resolved') return MAP_COLORS.resolved;
    if (req.type === 'idea') return MAP_COLORS.idea;
    if (req.priority === 'high') return MAP_COLORS.priorityHigh;
    if (req.priority === 'medium') return MAP_COLORS.priorityMedium;
    return MAP_COLORS.defaultMarker;
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
          color: MAP_COLORS.markerStroke,
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
        const color = req.priority === 'high' ? MAP_COLORS.heatHigh : req.priority === 'medium' ? MAP_COLORS.heatMedium : MAP_COLORS.heatLow;

        L.circle([req.latitude, req.longitude], {
          radius,
          fillColor: color,
          fillOpacity: 0.35,
          stroke: false
        }).addTo(heatLayerRef.current!);

        // Core hotspot
        L.circleMarker([req.latitude, req.longitude], {
          radius: 4,
          fillColor: MAP_COLORS.hotspotFill,
          color: MAP_COLORS.hotspotStroke,
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
      <div className="w-full lg:w-80 bg-card rounded-md border border-border shadow-2xs p-4 flex flex-col justify-between overflow-y-auto shrink-0">
        <div className="space-y-4">
          
          <div className="pb-3 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs font-bold text-foreground uppercase tracking-wider">
                Карта инцидентов Семея
              </span>
            </div>
            <span className="text-[10px] font-mono bg-muted text-muted-foreground px-1.5 py-0.5 rounded border border-border">
              {filteredRequests.length} точек
            </span>
          </div>

          {/* Mode Switcher: Markers vs Heatmap */}
          <div>
            <label className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
              Режим отображения
            </label>
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-muted rounded-md border border-border text-xs">
              <button
                type="button"
                onClick={() => setViewMode('markers')}
                className={`py-1.5 px-2 rounded-md font-medium transition-colors flex items-center justify-center gap-1.5 ${
                  viewMode === 'markers'
                    ? 'bg-card text-foreground shadow-2xs font-semibold'
                    : 'text-muted-foreground hover:text-foreground'
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
                    ? 'bg-card text-foreground shadow-2xs font-semibold'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Flame className="w-3.5 h-3.5 text-amber-600" />
                <span>Теплокарта</span>
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="space-y-3 pt-2 border-t border-border">
            {/* Type Filter */}
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Тип обращения
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full p-2 text-xs rounded-md border border-border bg-card"
              >
                <option value="all">Все (Проблемы и идеи)</option>
                <option value="problem">🔴 Только проблемы</option>
                <option value="idea">💡 Только городские идеи</option>
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Категория
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-2 text-xs rounded-md border border-border bg-card"
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
              <label className="block text-xs font-semibold text-foreground mb-1">
                Статус
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full p-2 text-xs rounded-md border border-border bg-card"
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
              <label className="block text-xs font-semibold text-foreground mb-1">
                Уровень приоритета
              </label>
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="w-full p-2 text-xs rounded-md border border-border bg-card"
              >
                <option value="Все">Все приоритеты</option>
                <option value="high">Высокий (Срочно)</option>
                <option value="medium">Средний</option>
                <option value="low">Низкий</option>
              </select>
            </div>
          </div>

          {/* Color Legend */}
          <div className="pt-3 border-t border-border text-xs space-y-1.5">
            <span className="font-semibold text-muted-foreground block text-[11px] uppercase tracking-wider">
              Обозначения на карте:
            </span>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-600 shrink-0"></span>
              <span className="text-muted-foreground">Высокий приоритет (угроза/авария)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-500 shrink-0"></span>
              <span className="text-muted-foreground">Средний приоритет</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-600 shrink-0"></span>
              <span className="text-muted-foreground">Устранено / Решено</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-indigo-600 shrink-0"></span>
              <span className="text-muted-foreground">Городская инициатива (Идея)</span>
            </div>
          </div>

        </div>

        <div className="pt-3 border-t border-border text-[11px] font-mono text-muted-foreground text-center">
          ДЕМОНСТРАЦИОННЫЕ ДАННЫЕ / СЕМЕЙ
        </div>
      </div>

      {/* Map Canvas and Card Overlay */}
      <div className="flex-1 relative rounded-md border border-border overflow-hidden shadow-2xs">
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Selected Request Bottom Slide Card */}
        {selectedRequest && (
          <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 bg-card rounded-md border border-border shadow-xl p-4 z-20 animate-in fade-in slide-in-from-bottom duration-200">
            <div className="flex items-start justify-between pb-2 border-b border-border">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-foreground bg-muted border border-border px-2 py-0.5 rounded">
                  {selectedRequest.id}
                </span>
                <span className="text-[11px] font-medium text-muted-foreground">
                  {selectedRequest.category}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRequest(null)}
                className="text-muted-foreground hover:text-foreground text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="mt-2.5">
              <h4 className="text-xs font-bold text-foreground line-clamp-2">
                {selectedRequest.title}
              </h4>
              <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                {selectedRequest.cleaned_text}
              </p>
              <div className="flex items-center gap-1 text-[11px] text-muted-foreground mt-1.5">
                <MapPin className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                <span className="truncate">{selectedRequest.location_address}</span>
              </div>
            </div>

            {/* Actions: Upvote & View details */}
            <div className="mt-3 pt-2.5 border-t border-border flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => handleUpvoteClick(selectedRequest.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md border transition-colors ${
                  upvotedIds.has(selectedRequest.id)
                    ? 'bg-info-soft border-info-soft text-blue-700'
                    : 'bg-card border-border text-muted-foreground hover:bg-muted'
                }`}
              >
                <ThumbsUp className={`w-3.5 h-3.5 ${upvotedIds.has(selectedRequest.id) ? 'fill-blue-600 text-blue-600' : ''}`} />
                <span>
                  {upvotedIds.has(selectedRequest.id) ? 'Подтверждено' : 'У меня так же'}
                </span>
                <span className="font-mono font-bold bg-muted border border-border px-1 rounded text-[10px]">
                  {selectedRequest.upvotes || 0}
                </span>
              </button>

              <Link
                href={`/requests/${selectedRequest.id}`}
                className="inline-flex items-center gap-1 text-xs font-semibold text-foreground hover:underline"
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
