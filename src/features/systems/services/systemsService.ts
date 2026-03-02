import api from '@/shared/lib/api';
import type { System, CreateSystemDto, UpdateSystemDto } from '../types';

export const systemsService = {
  getAll: async (): Promise<System[]> => {
    const response = await api.get<System[]>('/systems');
    return response.data;
  },

  getById: async (id: string): Promise<System> => {
    const response = await api.get<System>(`/systems/${id}`);
    return response.data;
  },

  create: async (data: CreateSystemDto): Promise<System> => {
    const response = await api.post<System>('/systems', data);
    return response.data;
  },

  update: async (id: string, data: UpdateSystemDto): Promise<System> => {
    const response = await api.put<System>(`/systems/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/systems/${id}`);
  },

  toggleActive: async (id: string): Promise<System> => {
    const response = await api.patch<System>(`/systems/${id}/toggle`);
    return response.data;
  },
};
