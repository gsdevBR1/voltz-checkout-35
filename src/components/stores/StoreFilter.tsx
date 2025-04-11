
import React from 'react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, Filter, X } from 'lucide-react';

export type StoreStatusFilter = 'all' | 'active' | 'incomplete' | 'demo' | 'new';
export type StoreSortOption = 'name' | 'createdAt' | 'lastAccessed';

interface StoreFilterProps {
  statusFilter: StoreStatusFilter;
  setStatusFilter: (status: StoreStatusFilter) => void;
  sortOption: StoreSortOption;
  setSortOption: (option: StoreSortOption) => void;
}

export function StoreFilter({ 
  statusFilter, 
  setStatusFilter, 
  sortOption, 
  setSortOption 
}: StoreFilterProps) {
  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Filter className="h-4 w-4" />
            <span>
              {statusFilter === 'all' && 'Todos os status'}
              {statusFilter === 'active' && 'Ativas'}
              {statusFilter === 'incomplete' && 'Incompletas'}
              {statusFilter === 'demo' && 'Demo'}
              {statusFilter === 'new' && 'Novas'}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setStatusFilter('all')}>
            Todos os status
            {statusFilter === 'all' && <CheckCircle className="h-4 w-4 ml-2" />}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setStatusFilter('active')}>
            <div className="flex items-center">
              <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
              Ativas
            </div>
            {statusFilter === 'active' && <CheckCircle className="h-4 w-4 ml-2" />}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setStatusFilter('incomplete')}>
            <div className="flex items-center">
              <span className="h-2 w-2 rounded-full bg-amber-500 mr-2"></span>
              Incompletas
            </div>
            {statusFilter === 'incomplete' && <CheckCircle className="h-4 w-4 ml-2" />}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setStatusFilter('demo')}>
            <div className="flex items-center">
              <span className="h-2 w-2 rounded-full bg-purple-500 mr-2"></span>
              Demo
            </div>
            {statusFilter === 'demo' && <CheckCircle className="h-4 w-4 ml-2" />}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setStatusFilter('new')}>
            <div className="flex items-center">
              <span className="h-2 w-2 rounded-full bg-gray-500 mr-2"></span>
              Novas
            </div>
            {statusFilter === 'new' && <CheckCircle className="h-4 w-4 ml-2" />}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>
              {sortOption === 'name' && 'Nome'}
              {sortOption === 'createdAt' && 'Data de criação'}
              {sortOption === 'lastAccessed' && 'Último acesso'}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setSortOption('name')}>
            Nome
            {sortOption === 'name' && <CheckCircle className="h-4 w-4 ml-2" />}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setSortOption('createdAt')}>
            Data de criação
            {sortOption === 'createdAt' && <CheckCircle className="h-4 w-4 ml-2" />}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setSortOption('lastAccessed')}>
            Último acesso
            {sortOption === 'lastAccessed' && <CheckCircle className="h-4 w-4 ml-2" />}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
