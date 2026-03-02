import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';
import { useSystems, useDeleteSystem, useToggleSystem } from '../hooks/useSystems';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { MoreHorizontal, Plus } from 'lucide-react';
import type { System } from '../types';

const columnHelper = createColumnHelper<System>();

// Mock data for development
const mockSystems: System[] = [
  { id: '1', name: 'API Principal', baseUrl: 'https://api.example.com', route: '/health', port: 443, method: 'GET', expectedStatusCode: 200, isActive: true, createdAt: new Date().toISOString() },
  { id: '2', name: 'Banco de Dados', baseUrl: 'https://db.example.com', route: '/ping', port: 5432, method: 'GET', expectedStatusCode: 200, isActive: true, createdAt: new Date().toISOString() },
  { id: '3', name: 'CDN', baseUrl: 'https://cdn.example.com', route: '/status', port: 443, method: 'GET', expectedStatusCode: 200, isActive: false, createdAt: new Date().toISOString() },
];

export function SystemsListPage() {
  const [globalFilter, setGlobalFilter] = useState('');
  const { data: systems, isLoading } = useSystems();
  const { mutate: deleteSystem } = useDeleteSystem();
  const { mutate: toggleSystem } = useToggleSystem();

  const data = systems ?? mockSystems;

  const columns = [
    columnHelper.accessor('name', {
      header: 'Nome',
      cell: (info) => <span className="font-medium">{info.getValue()}</span>,
    }),
    columnHelper.accessor('baseUrl', {
      header: 'URL Base',
      cell: (info) => <span className="text-muted-foreground">{info.getValue()}</span>,
    }),
    columnHelper.accessor('method', {
      header: 'Método',
      cell: (info) => <Badge variant="outline">{info.getValue()}</Badge>,
    }),
    columnHelper.accessor('expectedStatusCode', {
      header: 'Status Esperado',
      cell: (info) => <span>{info.getValue()}</span>,
    }),
    columnHelper.accessor('isActive', {
      header: 'Status',
      cell: (info) => (
        <Badge variant={info.getValue() ? 'default' : 'secondary'}>
          {info.getValue() ? 'Ativo' : 'Inativo'}
        </Badge>
      ),
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Ações',
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link to={`/systems/${row.original.id}/edit`}>Editar</Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => toggleSystem(row.original.id)}>
              {row.original.isActive ? 'Desativar' : 'Ativar'}
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => {
                if (confirm('Deseja deletar este sistema?')) {
                  deleteSystem(row.original.id);
                }
              }}
            >
              Deletar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    }),
  ];

  const table = useReactTable({
    data,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Sistemas</h1>
        <Link to="/systems/new">
          <Button><Plus className="mr-2 h-4 w-4" /> Novo Sistema</Button>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <Input
          placeholder="Buscar sistemas..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {columns.map((_, j) => (
                    <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center text-muted-foreground py-8">
                  Nenhum sistema encontrado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Próxima
          </Button>
        </div>
      </div>
    </div>
  );
}
