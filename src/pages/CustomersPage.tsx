import React, { useState } from 'react';
import { CustomerList } from '../components/customers/CustomerList';
import { CustomerModal } from '../components/customers/CustomerModal';
import { useCustomers } from '../hooks/useCustomers';
import { Customer } from '../types';

export function CustomersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer>();
  const { customers, addCustomer, updateCustomer, deleteCustomer } = useCustomers();

  const handleEdit = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  };

  const handleSave = (customerData: Omit<Customer, 'id'>) => {
    if (selectedCustomer) {
      updateCustomer({ ...customerData, id: selectedCustomer.id });
    } else {
      addCustomer(customerData);
    }
    setIsModalOpen(false);
    setSelectedCustomer(undefined);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Clientes</h1>
        <button
          onClick={() => {
            setSelectedCustomer(undefined);
            setIsModalOpen(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Novo Cliente
        </button>
      </div>

      <CustomerList
        customers={customers}
        onEdit={handleEdit}
        onDelete={deleteCustomer}
      />

      <CustomerModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCustomer(undefined);
        }}
        onSave={handleSave}
        initialData={selectedCustomer}
      />
    </div>
  );
}