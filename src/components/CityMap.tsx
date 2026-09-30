'use client';

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import type { Map as LeafletMap, LayerGroup, TileLayer, Marker as LeafletMarker } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { CityRequest } from '@/types';
import { useApp } from '@/context/AppContext';
import {
  MapPin,
  Flame,
  ThumbsUp,
  ExternalLink,
  Search,
  Layers,
  Maximize2,
  Minimize2,
  Navigation,
  Compass,
  Filter,
  List,
  CheckCircle2,
  AlertTriangle,
  X,
  RotateCcw,
  Sparkles,
  Car,
  Lightbulb,
  Trash2,
  Bus,
  Droplets,
  Leaf,
  ShieldAlert,
  SlidersHorizontal,
  ChevronRight,
  Info
} from 'lucide-react';
import Link from 'next/link';
import { MAP_COLORS } from '@/lib/design-tokens';

interface CityMapProps {
  initialRequests: CityRequest[];
}

type BasemapMode = 'voyager' | 'satellite' | 'dark';

interface DistrictCoord {
  name: string;
  center: [number, number];
  zoom: number;
}

const DISTRICT_COORDS: Record<string, DistrictCoord> = {
  'Все': { name: 'Весь город', center: [50.4111, 80.2458], zoom: 13 },
  'Центральный': { name: 'Центральный', center: [50.4100, 80.2480], zoom: 14 },
  'Левобережный': { name: 'Левобережный', center: [50.4020, 80.2280], zoom: 14 },
  'Затон': { name: 'Затон', center: [50.4300, 80.2640], zoom: 14 },
  'Юность': { name: 'Юность', center: [50.4350, 80.2750], zoom: 14 },
};

const BASEMAP_CONFIGS: Record<BasemapMode, { name: string; url: string; subdomains: string[]; attribution: string; maxZoom: number }> = {
  voyager: {
    name: 'Схема',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
    subdomains: [],
    attribution: 'Tiles &copy; Esri &mdash; Semey Street Map',
    maxZoom: 19,
  },
  satellite: {
    name: 'Спутник',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    subdomains: [],
    attribution: 'Tiles &copy; Esri &mdash; Semey Satellite',
    maxZoom: 19,
  },
  dark: {
    name: 'Ночь',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
    subdomains: [],
    attribution: 'Tiles &copy; Esri &mdash; Semey Dark Canvas',
    maxZoom: 19,
  },
};

/** SVG category icon generator for custom pin markers */
function getCategoryIconSvg(category: string, type: string): string {
  if (type === 'idea') {
    return `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>`;
  }
  switch (category) {
    case 'Дороги':
      return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C2.1 10.9 2 11.2 2 11.5V16c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>`;
    case 'Освещение':
      return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>`;
    case 'Мусор':
      return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" x2="17"/><line x1="14" x2="14" y1="11" x2="17"/></svg>`;
    case 'Транспорт':
      return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 6v6"/><path d="M15 6v6"/><path d="M2 12h19.6"/><path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.2 6 18.2 6H5.8C4.8 6 3.9 6.8 3.6 7.8l-1.4 5c-.1.4-.2.8-.2 1.2 0 .4.1.8.2 1.2.3 1.1.8 2.8.8 2.8h3"/><circle cx="7" cy="18" r="2"/><circle cx="16" cy="18" r="2"/></svg>`;
    case 'Водоснабжение':
      return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/></svg>`;
    case 'Экология':
      return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>`;
    case 'Безопасность':
      return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>`;
    default:
      return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/></svg>`;
  }
}

export default function CityMap({ initialRequests }: CityMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<LeafletMap | null>(null);
  const currentTileLayerRef = useRef<TileLayer | null>(null);
  const markersLayerRef = useRef<LayerGroup | null>(null);
  const heatLayerRef = useRef<LayerGroup | null>(null);
  const userMarkerRef = useRef<LeafletMarker | null>(null);

  const { upvote, upvotedIds, theme } = useApp();

  const [requests, setRequests] = useState<CityRequest[]>(initialRequests);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('Все');
  const [selectedStatus, setSelectedStatus] = useState<string>('Все');
  const [selectedPriority, setSelectedPriority] = useState<string>('Все');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Все');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sidebarTab, setSidebarTab] = useState<'filters' | 'list'>('filters');
  const [viewMode, setViewMode] = useState<'markers' | 'heatmap'>('markers');
  const [selectedRequest, setSelectedRequest] = useState<CityRequest | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [basemapMode, setBasemapMode] = useState<BasemapMode>(theme === 'dark' ? 'dark' : 'voyager');
  const [isLocating, setIsLocating] = useState<boolean>(false);

  // Sync default basemap mode when app theme changes, if not user-customized to satellite
  useEffect(() => {
    if (basemapMode !== 'satellite') {
      setBasemapMode(theme === 'dark' ? 'dark' : 'voyager');
    }
  }, [theme]);

  // Color resolver
  const getMarkerColor = useCallback((req: CityRequest): string => {
    if (req.status === 'resolved') return MAP_COLORS.resolved;
    if (req.type === 'idea') return MAP_COLORS.idea;
    if (req.priority === 'high') return MAP_COLORS.priorityHigh;
    if (req.priority === 'medium') return MAP_COLORS.priorityMedium;
    return '#2563eb';
  }, []);

  // Filter requests
  const filteredRequests = useMemo(() => {
    return requests.filter((r) => {
      const matchesType = selectedType === 'all' || r.type === selectedType;
      const matchesCat = selectedCategory === 'Все' || r.category === selectedCategory;
      const matchesStat = selectedStatus === 'Все' || r.status === selectedStatus;
      const matchesPrio = selectedPriority === 'Все' || r.priority === selectedPriority;
      const matchesDist = selectedDistrict === 'Все' || (r.district && r.district === selectedDistrict);
      const matchesSearch =
        searchQuery.trim() === '' ||
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.location_address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.cleaned_text.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesType && matchesCat && matchesStat && matchesPrio && matchesDist && matchesSearch;
    });
  }, [requests, selectedType, selectedCategory, selectedStatus, selectedPriority, selectedDistrict, searchQuery]);

  // Top hotspot count for heatmap analysis
  const heatmapHotspots = useMemo(() => {
    const districts: Record<string, number> = {};
    filteredRequests.forEach((r) => {
      const d = r.district || 'Центральный';
      districts[d] = (districts[d] || 0) + 1;
    });
    return Object.entries(districts).sort((a, b) => b[1] - a[1]);
  }, [filteredRequests]);

  // Switch basemap tile layer
  const applyTileLayer = useCallback(async (mode: BasemapMode) => {
    if (!mapInstanceRef.current) return;
    const L = await import('leaflet');

    if (currentTileLayerRef.current) {
      mapInstanceRef.current.removeLayer(currentTileLayerRef.current);
    }

    const cfg = BASEMAP_CONFIGS[mode];
    const newLayer = L.tileLayer(cfg.url, {
      attribution: cfg.attribution,
      maxZoom: cfg.maxZoom,
      subdomains: cfg.subdomains.length > 0 ? cfg.subdomains : 'abc',
    });

    newLayer.addTo(mapInstanceRef.current);
    currentTileLayerRef.current = newLayer;
  }, []);

  // Effect to update tiles when basemapMode changes
  useEffect(() => {
    applyTileLayer(basemapMode);
  }, [basemapMode, applyTileLayer]);

  // Render markers or heatmap
  const renderMarkers = useCallback(async () => {
    if (!markersLayerRef.current || !heatLayerRef.current) return;
    const L = await import('leaflet');

    markersLayerRef.current.clearLayers();
    heatLayerRef.current.clearLayers();

    if (viewMode === 'markers') {
      filteredRequests.forEach((req) => {
        const isSelected = selectedRequest?.id === req.id;
        const color = getMarkerColor(req);
        const isUrgent = req.priority === 'high' && req.status !== 'resolved';
        const isResolved = req.status === 'resolved';
        const iconSvg = getCategoryIconSvg(req.category, req.type);

        const customHtml = `
          <div class="sq-marker-wrapper ${isSelected ? 'is-selected' : ''}" data-id="${req.id}">
            ${isUrgent ? '<div class="sq-marker-radar"></div>' : ''}
            <div class="sq-marker-pin" style="background-color: ${color};">
              <div class="sq-marker-icon">
                ${iconSvg}
              </div>
            </div>
            ${isResolved ? '<div class="sq-marker-check">✓</div>' : ''}
          </div>
        `;

        const customIcon = L.divIcon({
          className: 'sq-custom-leaflet-icon',
          html: customHtml,
          iconSize: [36, 44],
          iconAnchor: [18, 42],
          popupAnchor: [0, -42],
        });

        const marker = L.marker([req.latitude, req.longitude], {
          icon: customIcon,
          zIndexOffset: isSelected ? 1000 : req.priority === 'high' ? 500 : 100,
        });

        marker.on('click', () => {
          setSelectedRequest(req);
          if (mapInstanceRef.current) {
            mapInstanceRef.current.flyTo([req.latitude, req.longitude], Math.max(mapInstanceRef.current.getZoom(), 15), {
              duration: 0.8,
            });
          }
        });

        // Crisp informative tooltip
        const statusLabel = req.status === 'resolved' ? 'Решено' : req.priority === 'high' ? 'Срочно' : req.category;
        marker.bindTooltip(`
          <div class="sq-tooltip-inner">
            <div class="sq-tooltip-header">
              <span class="sq-tooltip-id">${req.id}</span>
              <span class="sq-tooltip-badge" style="background: ${color}20; color: ${color};">${statusLabel}</span>
            </div>
            <div class="sq-tooltip-title">${req.title}</div>
            <div class="sq-tooltip-addr">📍 ${req.location_address}</div>
          </div>
        `, {
          direction: 'top',
          offset: [0, -38],
          className: 'sq-leaflet-tooltip',
          opacity: 1,
        });

        marker.addTo(markersLayerRef.current!);
      });
    } else {
      // Enhanced Multi-tier Heatmap Simulation
      filteredRequests.forEach((req) => {
        const isUrgent = req.priority === 'high';
        const isMedium = req.priority === 'medium';

        // Outer ambient glow ring
        L.circle([req.latitude, req.longitude], {
          radius: isUrgent ? 550 : isMedium ? 400 : 260,
          fillColor: isUrgent ? MAP_COLORS.heatHigh : isMedium ? MAP_COLORS.heatMedium : MAP_COLORS.heatLow,
          fillOpacity: 0.22,
          stroke: false,
        }).addTo(heatLayerRef.current!);

        // Mid density ring
        L.circle([req.latitude, req.longitude], {
          radius: isUrgent ? 300 : isMedium ? 200 : 130,
          fillColor: isUrgent ? MAP_COLORS.heatHigh : isMedium ? MAP_COLORS.heatMedium : MAP_COLORS.heatLow,
          fillOpacity: 0.45,
          stroke: false,
        }).addTo(heatLayerRef.current!);

        // Core hotspot nucleus
        L.circleMarker([req.latitude, req.longitude], {
          radius: isUrgent ? 7 : 5,
          fillColor: MAP_COLORS.hotspotFill,
          color: '#ffffff',
          weight: 2,
          fillOpacity: 0.95,
        }).addTo(heatLayerRef.current!);
      });
    }
  }, [filteredRequests, viewMode, selectedRequest, getMarkerColor]);

  // Initialize Leaflet map
  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      if (!mapContainerRef.current || mapInstanceRef.current) return;

      const L = await import('leaflet');

      if (!isMounted || !mapContainerRef.current) return;

      // Semey initial coordinates
      const map = L.map(mapContainerRef.current, {
        center: [50.4111, 80.2458],
        zoom: 13,
        zoomControl: false, // We use custom styled controls
        attributionControl: false,
      });

      mapInstanceRef.current = map;
      markersLayerRef.current = L.layerGroup().addTo(map);
      heatLayerRef.current = L.layerGroup().addTo(map);

      // Add custom attribution bottom right
      L.control.attribution({ position: 'bottomright', prefix: false }).addTo(map);

      // Apply initial basemap
      await applyTileLayer(basemapMode);

      // Check if URL has ?id= to focus on specific problem/idea
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        const targetId = urlParams.get('id');
        if (targetId) {
          const found = initialRequests.find((r) => r.id === targetId);
          if (found) {
            setSelectedRequest(found);
            map.setView([found.latitude, found.longitude], 16);
          }
        }
      }

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
  }, []); // Run once on mount

  // Update map markers when filters or mode change
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    renderMarkers();
  }, [renderMarkers]);

  // Handle Fullscreen resize recalculation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKey);

    const timer = setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    }, 250);

    return () => {
      window.removeEventListener('keydown', handleKey);
      clearTimeout(timer);
    };
  }, [isFullscreen]);

  // Actions
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

  const handleZoomIn = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomOut();
    }
  };

  const handleFitAll = () => {
    if (!mapInstanceRef.current || filteredRequests.length === 0) return;
    import('leaflet').then((L) => {
      const bounds = L.latLngBounds(filteredRequests.map((r) => [r.latitude, r.longitude]));
      mapInstanceRef.current?.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    });
  };

  const handleDistrictChange = (district: string) => {
    setSelectedDistrict(district);
    const target = DISTRICT_COORDS[district] || DISTRICT_COORDS['Все'];
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(target.center, target.zoom, { duration: 1.2 });
    }
  };

  const handleLocateMe = async () => {
    setIsLocating(true);
    const L = await import('leaflet');

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setIsLocating(false);
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          if (mapInstanceRef.current) {
            mapInstanceRef.current.flyTo([lat, lng], 15, { duration: 1.2 });

            if (userMarkerRef.current) {
              mapInstanceRef.current.removeLayer(userMarkerRef.current);
            }

            const userIcon = L.divIcon({
              className: 'sq-custom-leaflet-icon',
              html: `
                <div class="sq-user-location-marker">
                  <div class="sq-user-pulse"></div>
                  <div class="sq-user-dot"></div>
                </div>
              `,
              iconSize: [24, 24],
              iconAnchor: [12, 12],
            });

            const marker = L.marker([lat, lng], { icon: userIcon });
            marker.bindTooltip('Вы находитесь здесь', { direction: 'top', className: 'sq-leaflet-tooltip' });
            marker.addTo(mapInstanceRef.current);
            userMarkerRef.current = marker;
          }
        },
        () => {
          setIsLocating(false);
          // Fallback to Semey center
          if (mapInstanceRef.current) {
            mapInstanceRef.current.flyTo([50.4111, 80.2458], 14, { duration: 1 });
          }
        },
        { timeout: 5000 }
      );
    } else {
      setIsLocating(false);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.flyTo([50.4111, 80.2458], 14, { duration: 1 });
      }
    }
  };

  const handleResetFilters = () => {
    setSelectedType('all');
    setSelectedCategory('Все');
    setSelectedStatus('Все');
    setSelectedPriority('Все');
    setSelectedDistrict('Все');
    setSearchQuery('');
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([50.4111, 80.2458], 13, { duration: 1 });
    }
  };

  const hasActiveFilters =
    selectedType !== 'all' ||
    selectedCategory !== 'Все' ||
    selectedStatus !== 'Все' ||
    selectedPriority !== 'Все' ||
    selectedDistrict !== 'Все' ||
    searchQuery.trim() !== '';

  return (
    <>
      {/* Inline styles for custom high-DPI Leaflet markers and tooltips */}
      <style jsx global>{`
        .sq-custom-leaflet-icon {
          background: transparent !important;
          border: none !important;
        }
        .sq-marker-wrapper {
          position: relative;
          width: 36px;
          height: 44px;
          display: flex;
          flex-direction: column;
          align-items: center;
          cursor: pointer;
          transition: transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .sq-marker-wrapper:hover {
          transform: scale(1.22) translateY(-5px);
          z-index: 99999 !important;
        }
        .sq-marker-wrapper.is-selected {
          transform: scale(1.3) translateY(-6px);
          z-index: 100000 !important;
        }
        .sq-marker-pin {
          width: 34px;
          height: 34px;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.35);
          border: 2px solid #ffffff;
          transition: box-shadow 0.2s ease, border-color 0.2s ease;
        }
        .sq-marker-wrapper.is-selected .sq-marker-pin {
          border-color: #facc15;
          box-shadow: 0 0 0 3px rgba(250, 204, 21, 0.5), 0 8px 18px rgba(0, 0, 0, 0.45);
        }
        .sq-marker-icon {
          transform: rotate(45deg);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
        }
        .sq-marker-radar {
          position: absolute;
          top: -6px;
          left: -5px;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: rgba(220, 38, 38, 0.42);
          animation: sq-pulse-anim 1.8s cubic-bezier(0.1, 0, 0.3, 1) infinite;
          pointer-events: none;
        }
        @keyframes sq-pulse-anim {
          0% { transform: scale(0.6); opacity: 0.95; }
          100% { transform: scale(1.9); opacity: 0; }
        }
        .sq-marker-check {
          position: absolute;
          top: -3px;
          right: -2px;
          width: 15px;
          height: 15px;
          border-radius: 50%;
          background: #059669;
          border: 1.5px solid #ffffff;
          color: #ffffff;
          font-size: 10px;
          font-weight: 900;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
        }
        .sq-user-location-marker {
          position: relative;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .sq-user-pulse {
          position: absolute;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(37, 99, 235, 0.3);
          animation: sq-pulse-anim 1.8s infinite;
        }
        .sq-user-dot {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #2563eb;
          border: 2.5px solid #ffffff;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
        }
        .leaflet-tooltip.sq-leaflet-tooltip {
          background: rgba(15, 23, 42, 0.95) !important;
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.15) !important;
          border-radius: 8px !important;
          padding: 8px 12px !important;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35) !important;
        }
        .leaflet-tooltip.sq-leaflet-tooltip::before {
          border-top-color: rgba(15, 23, 42, 0.95) !important;
        }
        .sq-tooltip-inner {
          display: flex;
          flex-direction: column;
          gap: 3px;
          max-width: 240px;
        }
        .sq-tooltip-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 6px;
        }
        .sq-tooltip-id {
          font-family: monospace;
          font-weight: 700;
          font-size: 11px;
          color: #94a3b8;
        }
        .sq-tooltip-badge {
          font-size: 10px;
          font-weight: 700;
          padding: 1px 6px;
          border-radius: 4px;
          text-transform: uppercase;
        }
        .sq-tooltip-title {
          font-size: 12px;
          font-weight: 700;
          color: #ffffff;
          line-height: 1.3;
        }
        .sq-tooltip-addr {
          font-size: 10px;
          color: #cbd5e1;
        }
      `}</style>

      <div
        className={`flex flex-col lg:flex-row gap-4 transition-all duration-300 ${
          isFullscreen
            ? 'fixed inset-0 z-50 w-screen h-screen bg-background p-3 md:p-6'
            : 'h-[calc(100vh-140px)] min-h-[640px]'
        }`}
      >
        {/* SIDEBAR: Filters, District Switcher & Request List */}
        <div className="w-full lg:w-96 bg-card rounded-xl border border-border shadow-sm flex flex-col overflow-hidden shrink-0">
          
          {/* Header & Tabs */}
          <div className="p-3.5 border-b border-border space-y-3 bg-muted/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                    Семей · Городская среда
                  </h3>
                  <p className="text-[11px] text-muted-foreground">
                    {filteredRequests.length} из {requests.length} объектов на карте
                  </p>
                </div>
              </div>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-[11px] text-primary hover:underline font-semibold flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Сброс</span>
                </button>
              )}
            </div>

            {/* Live Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск по адресу, названию, №..."
                className="w-full pl-8.5 pr-8 py-1.5 text-xs rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Sidebar View Tabs */}
            <div className="grid grid-cols-2 gap-1 p-1 bg-muted rounded-lg text-xs font-medium">
              <button
                type="button"
                onClick={() => setSidebarTab('filters')}
                className={`py-1.5 px-3 rounded-md transition-all flex items-center justify-center gap-1.5 ${
                  sidebarTab === 'filters'
                    ? 'bg-card text-foreground font-bold shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Фильтры</span>
              </button>

              <button
                type="button"
                onClick={() => setSidebarTab('list')}
                className={`py-1.5 px-3 rounded-md transition-all flex items-center justify-center gap-1.5 ${
                  sidebarTab === 'list'
                    ? 'bg-card text-foreground font-bold shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span>Список ({filteredRequests.length})</span>
              </button>
            </div>
          </div>

          {/* TAB 1: FILTERS & DISTRICT CONTROLS */}
          {sidebarTab === 'filters' && (
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
              
              {/* Display Mode: Markers vs Heatmap */}
              <div>
                <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
                  Режим отображения
                </label>
                <div className="grid grid-cols-2 gap-1.5 p-1 bg-muted rounded-lg border border-border">
                  <button
                    type="button"
                    onClick={() => setViewMode('markers')}
                    className={`py-1.5 px-2 rounded-md font-medium transition-colors flex items-center justify-center gap-1.5 ${
                      viewMode === 'markers'
                        ? 'bg-card text-foreground font-bold shadow-xs'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <MapPin className="w-3.5 h-3.5 text-blue-600" />
                    <span>Метки</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setViewMode('heatmap')}
                    className={`py-1.5 px-2 rounded-md font-medium transition-colors flex items-center justify-center gap-1.5 ${
                      viewMode === 'heatmap'
                        ? 'bg-card text-foreground font-bold shadow-xs'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Flame className="w-3.5 h-3.5 text-amber-500" />
                    <span>Теплокарта</span>
                  </button>
                </div>
              </div>

              {/* District Quick Selector Chips */}
              <div>
                <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
                  Районы города Семей
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {Object.keys(DISTRICT_COORDS).map((d) => {
                    const isCurrent = selectedDistrict === d;
                    return (
                      <button
                        key={d}
                        type="button"
                        onClick={() => handleDistrictChange(d)}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-medium border transition-colors ${
                          isCurrent
                            ? 'bg-primary text-primary-foreground border-primary font-bold shadow-xs'
                            : 'bg-card text-muted-foreground border-border hover:bg-muted'
                        }`}
                      >
                        {d === 'Все' ? 'Весь Семей' : d}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Type Filter */}
              <div>
                <label className="block text-[11px] font-bold text-foreground mb-1">
                  Тип обращения
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full p-2 text-xs rounded-lg border border-border bg-card text-foreground"
                >
                  <option value="all">Все (Городские проблемы и идеи)</option>
                  <option value="problem">🔴 Только городские проблемы</option>
                  <option value="idea">💡 Только инициативы жителей</option>
                </select>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-[11px] font-bold text-foreground mb-1">
                  Категория
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-2 text-xs rounded-lg border border-border bg-card text-foreground"
                >
                  <option value="Все">Все категории</option>
                  <option value="Дороги">🛣️ Дороги и тротуары</option>
                  <option value="Освещение">💡 Уличное освещение</option>
                  <option value="Мусор">🗑️ Вывоз ТБО и уборка</option>
                  <option value="Транспорт">🚌 Общественный транспорт</option>
                  <option value="Благоустройство">🌳 Благоустройство и парки</option>
                  <option value="Экология">🌿 Экология и Иртыш</option>
                  <option value="Водоснабжение">🚰 Водоснабжение и сети</option>
                  <option value="Безопасность">🛡️ Общественная безопасность</option>
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-[11px] font-bold text-foreground mb-1">
                  Статус решения
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full p-2 text-xs rounded-lg border border-border bg-card text-foreground"
                >
                  <option value="Все">Все статусы</option>
                  <option value="new">Новое обращение</option>
                  <option value="assigned">Назначено ответственным</option>
                  <option value="in_progress">В работе у служб</option>
                  <option value="resolved">Устранено / Решено</option>
                </select>
              </div>

              {/* Priority Filter */}
              <div>
                <label className="block text-[11px] font-bold text-foreground mb-1">
                  Приоритет
                </label>
                <select
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value)}
                  className="w-full p-2 text-xs rounded-lg border border-border bg-card text-foreground"
                >
                  <option value="Все">Все приоритеты</option>
                  <option value="high">Высокий (Срочно / Авария)</option>
                  <option value="medium">Средний приоритет</option>
                  <option value="low">Низкий (Плановый)</option>
                </select>
              </div>

              {/* Heatmap Insights Box (if in heatmap mode) */}
              {viewMode === 'heatmap' && (
                <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 space-y-2">
                  <div className="flex items-center gap-1.5 font-bold text-amber-700 dark:text-amber-400 text-xs">
                    <Flame className="w-4 h-4 shrink-0" />
                    <span>Концентрация по районам:</span>
                  </div>
                  <div className="space-y-1">
                    {heatmapHotspots.slice(0, 3).map(([dist, count]) => (
                      <div key={dist} className="flex items-center justify-between text-[11px]">
                        <span className="text-foreground">{dist}</span>
                        <span className="font-mono font-bold bg-card border border-border px-1.5 py-0.5 rounded">
                          {count} инцидентов
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Marker Legend */}
              <div className="pt-3 border-t border-border space-y-2">
                <span className="font-bold text-muted-foreground block text-[11px] uppercase tracking-wider">
                  Обозначения на карте:
                </span>
                <div className="grid grid-cols-1 gap-1.5 text-[11px]">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-600 ring-2 ring-red-300 dark:ring-red-950 shrink-0"></span>
                    <span className="text-muted-foreground">Высокий приоритет (срочная угроза/авария)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-amber-500 shrink-0"></span>
                    <span className="text-muted-foreground">Средний приоритет</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-600 shrink-0"></span>
                    <span className="text-muted-foreground">Устранено / Решено службами</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-indigo-600 shrink-0"></span>
                    <span className="text-muted-foreground">Городская инициатива жителей (Идея)</span>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: REQUEST FEED LIST */}
          {sidebarTab === 'list' && (
            <div className="flex-1 overflow-y-auto divide-y divide-border">
              {filteredRequests.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground space-y-2">
                  <Info className="w-6 h-6 mx-auto opacity-50" />
                  <p className="text-xs">По выбранным фильтрам ничего не найдено</p>
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="text-xs text-primary underline font-medium"
                  >
                    Сбросить фильтры
                  </button>
                </div>
              ) : (
                filteredRequests.map((req) => {
                  const isSelected = selectedRequest?.id === req.id;
                  const color = getMarkerColor(req);

                  return (
                    <div
                      key={req.id}
                      onClick={() => {
                        setSelectedRequest(req);
                        if (mapInstanceRef.current) {
                          mapInstanceRef.current.flyTo([req.latitude, req.longitude], 16, { duration: 1 });
                        }
                      }}
                      className={`p-3 text-xs cursor-pointer transition-all hover:bg-muted/60 ${
                        isSelected ? 'bg-primary/5 border-l-4 border-l-primary' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1.5">
                          <span
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ backgroundColor: color }}
                          />
                          <span className="font-mono text-[10px] font-bold text-muted-foreground">
                            {req.id}
                          </span>
                          <span className="text-[10px] font-semibold text-foreground/80 bg-muted px-1.5 py-0.2 rounded">
                            {req.category}
                          </span>
                        </div>
                        <span className="text-[10px] text-muted-foreground font-mono">
                          👍 {req.upvotes || 0}
                        </span>
                      </div>

                      <h4 className="font-bold text-foreground line-clamp-1 mb-1">
                        {req.title}
                      </h4>

                      <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                        <span className="truncate pr-2">📍 {req.location_address}</span>
                        <ChevronRight className="w-3.5 h-3.5 shrink-0 opacity-60" />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* Footer note */}
          <div className="p-2.5 border-t border-border bg-muted/20 text-[10px] font-mono text-muted-foreground text-center">
            GPS КООРДИНАТЫ · СЕМЕЙ, АБАЙ ОБЛЫСЫ
          </div>
        </div>

        {/* MAP CANVAS & FLOATING OVERLAYS */}
        <div className="flex-1 relative rounded-xl border border-border overflow-hidden shadow-sm bg-muted">
          
          {/* Leaflet map container */}
          <div ref={mapContainerRef} className="w-full h-full z-0" />

          {/* FLOATING TOP-RIGHT: Basemap Layer Switcher */}
          <div className="absolute top-3 right-3 z-10 flex items-center bg-card/90 backdrop-blur-md rounded-lg border border-border shadow-md p-1 gap-1">
            {(['voyager', 'satellite', 'dark'] as BasemapMode[]).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setBasemapMode(mode)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                  basemapMode === mode
                    ? 'bg-primary text-primary-foreground font-bold shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {BASEMAP_CONFIGS[mode].name}
              </button>
            ))}
          </div>

          {/* FLOATING TOP-LEFT: Zoom, Geolocation & Navigation Tools */}
          <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
            <div className="bg-card/90 backdrop-blur-md rounded-lg border border-border shadow-md p-1 flex flex-col gap-1">
              <button
                type="button"
                onClick={handleZoomIn}
                title="Приблизить"
                className="w-8 h-8 rounded-md flex items-center justify-center text-foreground hover:bg-muted font-bold text-base transition-colors"
              >
                +
              </button>
              <button
                type="button"
                onClick={handleZoomOut}
                title="Отдалить"
                className="w-8 h-8 rounded-md flex items-center justify-center text-foreground hover:bg-muted font-bold text-base transition-colors"
              >
                −
              </button>
            </div>

            <div className="bg-card/90 backdrop-blur-md rounded-lg border border-border shadow-md p-1 flex flex-col gap-1">
              <button
                type="button"
                onClick={handleLocateMe}
                disabled={isLocating}
                title="Моя геопозиция"
                className="w-8 h-8 rounded-md flex items-center justify-center text-foreground hover:bg-muted transition-colors disabled:opacity-50"
              >
                <Navigation className={`w-4 h-4 ${isLocating ? 'animate-spin text-primary' : ''}`} />
              </button>

              <button
                type="button"
                onClick={handleFitAll}
                title="Показать все точки"
                className="w-8 h-8 rounded-md flex items-center justify-center text-foreground hover:bg-muted transition-colors"
              >
                <Compass className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setIsFullscreen(!isFullscreen)}
                title={isFullscreen ? 'Свернуть карту' : 'Развернуть на весь экран'}
                className="w-8 h-8 rounded-md flex items-center justify-center text-foreground hover:bg-muted transition-colors"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* FLOATING BOTTOM-LEFT: City Badge & Heatmap density legend */}
          <div className="absolute bottom-3 left-3 z-10 hidden sm:flex flex-col gap-1 pointer-events-none">
            <div className="bg-card/90 backdrop-blur-md rounded-lg border border-border shadow-md px-3 py-1.5 flex items-center gap-2 pointer-events-auto">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[11px] font-semibold text-foreground">
                Семей, Область Абай
              </span>
              <span className="text-[10px] text-muted-foreground font-mono">
                • {filteredRequests.length} меток
              </span>
            </div>

            {viewMode === 'heatmap' && (
              <div className="bg-card/90 backdrop-blur-md rounded-lg border border-border shadow-md px-3 py-1.5 pointer-events-auto">
                <div className="text-[10px] font-bold text-muted-foreground uppercase mb-1">
                  Плотность концентрации:
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                  <span>Мин</span>
                  <div className="w-24 h-2 rounded-full bg-gradient-to-r from-yellow-500 via-orange-500 to-red-600"></div>
                  <span>Макс</span>
                </div>
              </div>
            )}
          </div>

          {/* SELECTED REQUEST FLOATING MODAL CARD */}
          {selectedRequest && (
            <div className="absolute bottom-3 right-3 left-3 sm:left-auto sm:w-[410px] bg-card rounded-xl border border-border shadow-2xl p-4 z-20 animate-in fade-in slide-in-from-bottom duration-200">
              
              {/* Header */}
              <div className="flex items-start justify-between pb-2 border-b border-border">
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-xs font-bold text-foreground bg-muted border border-border px-2 py-0.5 rounded">
                    {selectedRequest.id}
                  </span>
                  <span className="text-[11px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded">
                    {selectedRequest.category}
                  </span>
                  {selectedRequest.priority === 'high' && selectedRequest.status !== 'resolved' && (
                    <span className="text-[10px] font-bold text-red-700 bg-red-100 dark:bg-red-950 dark:text-red-300 px-1.5 py-0.5 rounded">
                      Срочно
                    </span>
                  )}
                  {selectedRequest.status === 'resolved' && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-300 px-1.5 py-0.5 rounded">
                      Решено
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedRequest(null)}
                  className="text-muted-foreground hover:text-foreground p-1 rounded-md hover:bg-muted text-sm font-bold"
                  title="Закрыть карточку"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Thumbnail and content */}
              <div className="mt-3 flex gap-3">
                {selectedRequest.photo_before_url && (
                  <div className="w-20 h-20 rounded-lg overflow-hidden border border-border shrink-0 bg-muted">
                    <img
                      src={selectedRequest.photo_before_url}
                      alt={selectedRequest.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-foreground line-clamp-2 leading-snug">
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
              </div>

              {/* If resolved: resolution note */}
              {selectedRequest.status === 'resolved' && selectedRequest.resolution_report && (
                <div className="mt-2.5 p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-800 dark:text-emerald-300 flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span className="line-clamp-2">{selectedRequest.resolution_report}</span>
                </div>
              )}

              {/* Action buttons */}
              <div className="mt-3 pt-2.5 border-t border-border flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => handleUpvoteClick(selectedRequest.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                    upvotedIds.has(selectedRequest.id)
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-card border-border text-foreground hover:bg-muted'
                  }`}
                >
                  <ThumbsUp className={`w-3.5 h-3.5 ${upvotedIds.has(selectedRequest.id) ? 'fill-white' : ''}`} />
                  <span>
                    {upvotedIds.has(selectedRequest.id) ? 'Подтверждено' : 'У меня так же'}
                  </span>
                  <span className="font-mono font-bold bg-black/10 dark:bg-white/20 px-1 rounded text-[10px]">
                    {selectedRequest.upvotes || 0}
                  </span>
                </button>

                <Link
                  href={`/requests/${selectedRequest.id}`}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/10 rounded-lg transition-colors"
                >
                  <span>Подробнее</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>

            </div>
          )}

        </div>
      </div>
    </>
  );
}
