import React from 'react';
import { Customer } from '../../types';
import { CustomerListItem } from './CustomerListItem';

interface CustomerListProps {
  customers: Customer[];
  onEdit: (customer: Customer) => void;
  onDelete: (id: string) => void;
}

export function CustomerList({ customers, onEdit, onDelete }: CustomerListProps) {
  if (customers.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
        Nenhum cliente cadastrado
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Cabeçalho - visível apenas em desktop */}
      <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b border-gray-200 font-medium text-gray-700">
        <div className="col-span-4">Nome</div>
        <div className="col-span-3">Email</div>
        <div className="col-span-2">Telefone</div>
        <div className="col-span-2">Veículos</div>
        <div className="col-span-1">Ações</div>
      </div>
      <div className="divide-y divide-gray-200">
        {customers.map((customer) => (
          <CustomerListItem
            key={customer.id}
            customer={customer}
            onEdit={() => onEdit(customer)}
            onDelete={() => onDelete(customer.id)}
          />
        ))}
      </div>
    </div>
  );
}