import React from 'react';
import { Service } from '../../types';
import { formatCurrency } from '../../utils/format';
import { ServiceListItem } from './ServiceListItem';

interface ServiceListProps {
  services: Service[];
  onEdit: (service: Service) => void;
  onDelete: (id: string) => void;
}

export function ServiceList({ services, onEdit, onDelete }: ServiceListProps) {
  if (services.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
        Nenhum serviço cadastrado
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b border-gray-200 font-medium text-gray-700">
        <div className="col-span-4">Nome</div>
        <div className="col-span-3">Categoria</div>
        <div className="col-span-2">Duração</div>
        <div className="col-span-2">Valor</div>
        <div className="col-span-1">Ações</div>
      </div>
      <div className="divide-y divide-gray-200">
        {services.map((service) => (
          <ServiceListItem
            key={service.id}
            service={service}
            onEdit={() => onEdit(service)}
            onDelete={() => onDelete(service.id)}
          />
        ))}
      </div>
    </div>
  );
}