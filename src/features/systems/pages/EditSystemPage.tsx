import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SystemForm } from '../components/SystemForm';
import type { SystemFormData } from '../components/SystemForm';
import { useUpdateSystem } from '../hooks/useSystems';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

// Mock data for development - in production this would come from useQuery
const mockSystems = [
  { id: '1', name: 'API Principal', baseUrl: 'https://api.example.com', route: '/health', port: 443, method: 'GET' as const, expectedStatusCode: 200, isActive: true, createdAt: new Date().toISOString() },
  { id: '2', name: 'Banco de Dados', baseUrl: 'https://db.example.com', route: '/ping', port: 5432, method: 'GET' as const, expectedStatusCode: 200, isActive: true, createdAt: new Date().toISOString() },
];

export function EditSystemPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { mutate: updateSystem, isPending } = useUpdateSystem();

  const system = mockSystems.find((s) => s.id === id);

  const handleSubmit = (data: SystemFormData) => {
    if (!id) return;
    updateSystem(
      { id, data: { ...data, port: data.port ? parseInt(data.port) : undefined } },
      { onSuccess: () => navigate('/systems') }
    );
  };

  if (!system) {
    return <p>Sistema não encontrado.</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Link to="/systems">
          <Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button>
        </Link>
        <h1 className="text-2xl font-bold">Editar Sistema</h1>
      </div>
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Informações do sistema</CardTitle>
        </CardHeader>
        <CardContent>
          <SystemForm defaultValues={system} onSubmit={handleSubmit} isLoading={isPending} submitLabel="Salvar alterações" />
        </CardContent>
      </Card>
    </div>
  );
}
