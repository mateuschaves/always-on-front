import { useDashboardMetrics, useAvailabilityData, useRecentIncidents } from '../hooks/useDashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Server, Activity, AlertTriangle, TrendingUp } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

function MetricCard({ title, value, icon: Icon, description }: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  description?: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
      </CardContent>
    </Card>
  );
}

export function DashboardPage() {
  const { data: metrics, isLoading: metricsLoading } = useDashboardMetrics();
  const { data: availability, isLoading: availabilityLoading } = useAvailabilityData();
  const { data: incidents, isLoading: incidentsLoading } = useRecentIncidents();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* Metrics Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metricsLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2"><Skeleton className="h-4 w-24" /></CardHeader>
              <CardContent><Skeleton className="h-8 w-16" /></CardContent>
            </Card>
          ))
        ) : (
          <>
            <MetricCard title="Total de Sistemas" value={metrics?.totalSystems ?? 0} icon={Server} />
            <MetricCard title="Sistemas Ativos" value={metrics?.activeSystems ?? 0} icon={Activity} description="Online agora" />
            <MetricCard title="Incidentes" value={metrics?.totalIncidents ?? 0} icon={AlertTriangle} description="Últimas 24h" />
            <MetricCard title="Uptime Médio" value={`${metrics?.averageUptime?.toFixed(1)}%`} icon={TrendingUp} description="Últimos 30 dias" />
          </>
        )}
      </div>

      {/* Availability Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Disponibilidade (últimos 30 dias)</CardTitle>
        </CardHeader>
        <CardContent>
          {availabilityLoading ? (
            <Skeleton className="h-64 w-full" />
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={availability}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis domain={[90, 100]} tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value) => [`${(value as number).toFixed(2)}%`, 'Uptime']} />
                <Area type="monotone" dataKey="uptime" stroke="#3b82f6" fill="#93c5fd" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Recent Incidents */}
      <Card>
        <CardHeader>
          <CardTitle>Últimos Incidentes</CardTitle>
        </CardHeader>
        <CardContent>
          {incidentsLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          ) : (
            <div className="space-y-3">
              {incidents?.map((incident) => (
                <div key={incident.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="font-medium">{incident.systemName}</p>
                    <p className="text-sm text-muted-foreground">{incident.type}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant={incident.status === 'open' ? 'destructive' : 'secondary'}>
                      {incident.status === 'open' ? 'Aberto' : 'Resolvido'}
                    </Badge>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {new Date(incident.startedAt).toLocaleString('pt-BR')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
