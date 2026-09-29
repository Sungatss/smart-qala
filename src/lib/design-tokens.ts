/**
 * City Map design tokens - extracted from CityMap.tsx
 * Consolidates all 11 Leaflet map hex color values.
 */

export const MAP_COLORS = {
  resolved: '#059669',       // Emerald - status resolved
  idea: '#4f46e5',           // Indigo - type idea
  priorityHigh: '#dc2626',   // Red - high priority
  priorityMedium: '#d97706', // Amber - medium priority
  defaultMarker: '#475569',  // Slate - default marker color
  markerStroke: '#ffffff',   // White - marker outline
  heatHigh: '#dc2626',       // Red - heatmap high concentration
  heatMedium: '#ea580c',     // Orange - heatmap medium concentration
  heatLow: '#ca8a04',        // Yellow - heatmap low concentration
  hotspotFill: '#991b1b',    // Dark red - core hotspot fill
  hotspotStroke: '#ffffff',  // White - core hotspot outline
} as const;

export type MapColor = typeof MAP_COLORS[keyof typeof MAP_COLORS];
