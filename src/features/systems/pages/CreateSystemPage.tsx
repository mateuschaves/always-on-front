import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SystemForm } from '../components/SystemForm';
import type { SystemFormData } from '../components/SystemForm';
import { useCreateSystem } from '../hooks/useSystems';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export function CreateSystemPage() {
  const navigate = useNavigate();
  const { mutate: createSystem, isPending } = useCreateSystem();

  const handleSubmit = (data: SystemFormData) => {
    createSystem(
      { ...data, port: data.port ? parseInt(data.port) : undefined },
      { onSuccess: () => navigate('/systems') }
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Link to="/systems">
          <Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button>
        </Link>
        <h1 className="text-2xl font-bold">Novo Sistema</h1>
      </div>
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Informações do sistema</CardTitle>
        </CardHeader>
        <CardContent>
          <SystemForm onSubmit={handleSubmit} isLoading={isPending} submitLabel="Criar sistema" />
        </CardContent>
      </Card>
    </div>
  );
}
