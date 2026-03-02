import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { systemsService } from '../services/systemsService';
import type { CreateSystemDto, UpdateSystemDto } from '../types';
import { toast } from 'sonner';

export const SYSTEMS_QUERY_KEY = ['systems'];

export function useSystems() {
  return useQuery({
    queryKey: SYSTEMS_QUERY_KEY,
    queryFn: systemsService.getAll,
  });
}

export function useCreateSystem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateSystemDto) => systemsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SYSTEMS_QUERY_KEY });
      toast.success('Sistema criado com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao criar sistema.');
    },
  });
}

export function useUpdateSystem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSystemDto }) =>
      systemsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SYSTEMS_QUERY_KEY });
      toast.success('Sistema atualizado com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao atualizar sistema.');
    },
  });
}

export function useDeleteSystem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => systemsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SYSTEMS_QUERY_KEY });
      toast.success('Sistema deletado com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao deletar sistema.');
    },
  });
}

export function useToggleSystem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => systemsService.toggleActive(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SYSTEMS_QUERY_KEY });
      toast.success('Status do sistema atualizado!');
    },
  });
}
