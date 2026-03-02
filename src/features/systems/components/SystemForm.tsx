import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import type { System } from '../types';

const systemSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  baseUrl: z.string().url('URL inválida'),
  route: z.string().min(1, 'Rota é obrigatória'),
  port: z.string().optional().refine(
    (val) => !val || (!isNaN(parseInt(val)) && parseInt(val) >= 1 && parseInt(val) <= 65535),
    'Porta deve ser um número entre 1 e 65535'
  ),
  method: z.enum(['GET', 'POST', 'PUT', 'DELETE']),
  expectedStatusCode: z.coerce.number().int().min(100).max(599),
});

export type SystemFormData = z.infer<typeof systemSchema>;

interface SystemFormProps {
  defaultValues?: Partial<System>;
  onSubmit: (data: SystemFormData) => void;
  isLoading?: boolean;
  submitLabel?: string;
}

export function SystemForm({ defaultValues, onSubmit, isLoading, submitLabel = 'Salvar' }: SystemFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SystemFormData>({
    resolver: zodResolver(systemSchema) as Resolver<SystemFormData>,
    defaultValues: {
      name: defaultValues?.name ?? '',
      baseUrl: defaultValues?.baseUrl ?? '',
      route: defaultValues?.route ?? '',
      port: defaultValues?.port?.toString() ?? '',
      method: defaultValues?.method ?? 'GET',
      expectedStatusCode: defaultValues?.expectedStatusCode ?? 200,
    },
  });

  const method = watch('method');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome do sistema</Label>
        <Input id="name" placeholder="API Principal" {...register('name')} />
        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="baseUrl">URL Base</Label>
        <Input id="baseUrl" placeholder="https://api.example.com" {...register('baseUrl')} />
        {errors.baseUrl && <p className="text-sm text-destructive">{errors.baseUrl.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="route">Rota</Label>
        <Input id="route" placeholder="/health" {...register('route')} />
        {errors.route && <p className="text-sm text-destructive">{errors.route.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="port">Porta (opcional)</Label>
          <Input id="port" type="number" placeholder="443" {...register('port')} />
          {errors.port && <p className="text-sm text-destructive">{errors.port.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="expectedStatusCode">Status HTTP esperado</Label>
          <Input id="expectedStatusCode" type="number" placeholder="200" {...register('expectedStatusCode')} />
          {errors.expectedStatusCode && <p className="text-sm text-destructive">{errors.expectedStatusCode.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Método HTTP</Label>
        <Select value={method} onValueChange={(v) => setValue('method', v as SystemFormData['method'])}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(['GET', 'POST', 'PUT', 'DELETE'] as const).map((m) => (
              <SelectItem key={m} value={m}>{m}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.method && <p className="text-sm text-destructive">{errors.method.message}</p>}
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {submitLabel}
      </Button>
    </form>
  );
}
