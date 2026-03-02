import { useQuery } from '@tanstack/react-query';
import { mockMetrics, mockAvailabilityData, mockIncidents } from '../services/dashboardService';

export function useDashboardMetrics() {
  return useQuery({
    queryKey: ['dashboard', 'metrics'],
    queryFn: async () => mockMetrics,
  });
}

export function useAvailabilityData() {
  return useQuery({
    queryKey: ['dashboard', 'availability'],
    queryFn: async () => mockAvailabilityData,
  });
}

export function useRecentIncidents() {
  return useQuery({
    queryKey: ['dashboard', 'incidents'],
    queryFn: async () => mockIncidents,
  });
}
