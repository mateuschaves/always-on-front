import api from '@/shared/lib/api';

export interface DashboardMetrics {
  totalSystems: number;
  activeSystems: number;
  totalIncidents: number;
  averageUptime: number;
}

export interface AvailabilityData {
  date: string;
  uptime: number;
}

export interface Incident {
  id: string;
  systemName: string;
  type: string;
  startedAt: string;
  resolvedAt?: string;
  status: 'open' | 'resolved';
}

export const dashboardService = {
  getMetrics: async (): Promise<DashboardMetrics> => {
    const response = await api.get<DashboardMetrics>('/dashboard/metrics');
    return response.data;
  },

  getAvailabilityData: async (): Promise<AvailabilityData[]> => {
    const response = await api.get<AvailabilityData[]>('/dashboard/availability');
    return response.data;
  },

  getRecentIncidents: async (): Promise<Incident[]> => {
    const response = await api.get<Incident[]>('/dashboard/incidents');
    return response.data;
  },
};

// Mock data for development
export const mockMetrics: DashboardMetrics = {
  totalSystems: 12,
  activeSystems: 10,
  totalIncidents: 3,
  averageUptime: 99.7,
};

export const mockAvailabilityData: AvailabilityData[] = Array.from({ length: 30 }, (_, i) => ({
  date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR'),
  uptime: 95 + Math.random() * 5,
}));

export const mockIncidents: Incident[] = [
  { id: '1', systemName: 'API Principal', type: 'Timeout', startedAt: '2024-01-15T10:30:00', resolvedAt: '2024-01-15T11:00:00', status: 'resolved' },
  { id: '2', systemName: 'Banco de Dados', type: 'Connection Error', startedAt: '2024-01-14T15:00:00', resolvedAt: '2024-01-14T15:45:00', status: 'resolved' },
  { id: '3', systemName: 'CDN', type: 'High Latency', startedAt: '2024-01-16T09:00:00', status: 'open' },
];
