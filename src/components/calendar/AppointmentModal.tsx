import React, { useState, useEffect } from 'react';
import { Appointment, Customer, Service } from '../../types';
import { X } from 'lucide-react';
import { format } from 'date-fns';
import { useQuotes } from '../../hooks/useQuotes';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (appointment: Omit<Appointment, 'id'>) => void;
  onDelete?: (id: string) => void;
  onCreateQuote?: (appointment: Appointment) => void;
  date?: Date;
  customers: Customer[];
  services: Service[];
  initialData?: Appointment;
}

const timeZone = 'America/Sao_Paulo';

export function AppointmentModal({
  isOpen,
  onClose,
  onSave,
  onDelete,
  onCreateQuote,
  date,
  customers,
  services,
  initialData,
}: AppointmentModalProps) {
  const [formData, setFormData] = useState<Omit<Appointment, 'id'>>({
    customerId: '',
    serviceId: '',
    date: date?.toISOString() || new Date().toISOString(),
    status: 'agendado',
    notes: '',
  });

  const [showQuoteSelect, setShowQuoteSelect] = useState(false);
  const { quotes } = useQuotes();

  useEffect(() => {
    if (initialData) {
      setFormData({
        customerId: initialData.customerId,
        serviceId: initialData.serviceId,
        date: initialData.date,
        status: initialData.status,
        notes: initialData.notes || '',
      });
    } else if (date) {
      setFormData(prev => ({
        ...prev,
        date: date.toISOString(),
      }));
    }
  }, [initialData, date]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const selectedCustomer = customers.find(c => c.id === formData.customerId);
  const selectedService = services.find(s => s.id === formData.serviceId);

  const formatDateTimeForInput = (isoString: string) => {
    const date = new Date(isoString);
    const offset = date.getTimezoneOffset() * 60000;
    const localDate = new Date(date.getTime() - offset);
    return format(localDate, "yyyy-MM-dd'T'HH:mm");
  };

  const handleDateTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const localDate = new Date(e.target.value);
    const offset = localDate.getTimezoneOffset() * 60000;
    const utcDate = new Date(localDate.getTime() + offset);
    
    setFormData({
      ...formData,
      date: utcDate.toISOString(),
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-75" onClick={onClose}></div>
      <div className="relative bg-white rounded-lg w-full max-w-4xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {initialData ? 'Editar Agendamento' : 'Novo Agendamento'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Cliente
              </label>
              <select
                value={formData.customerId}
                onChange={(e) =>
                  setFormData({ ...formData, customerId: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="">Selecione um cliente</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Serviço
              </label>
              <select
                value={formData.serviceId}
                onChange={(e) =>
                  setFormData({ ...formData, serviceId: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="">Selecione um serviço</option>
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name} - R$ {service.price.toFixed(2)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Data e Hora
              </label>
              <input
                type="datetime-local"
                value={formatDateTimeForInput(formData.date)}
                onChange={handleDateTimeChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {showQuoteSelect ? (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">
                Selecionar Orçamento
              </label>
              <div className="mt-1 flex space-x-2">
                <select
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  onChange={(e) => {
                    const quoteId = e.target.value;
                    if (!quoteId) return;
                    
                    const quote = quotes.find(q => q.id === quoteId);
                    if (quote) {
                      setFormData(prev => ({
                        ...prev,
                        customerId: quote.customerId,
                        serviceId: quote.items[0]?.serviceId || '',
                        notes: `Orçamento #${quote.id}\n${quote.notes || ''}`
                      }));
                      setShowQuoteSelect(false);
                    }
                  }}
                >
                  <option value="">Selecione um orçamento</option>
                  {quotes
                    .filter(q => q.customerId === formData.customerId || !formData.customerId)
                    .map((quote) => {
                      const customer = customers.find(c => c.id === quote.customerId);
                      const total = quote.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
                      const formattedDate = format(new Date(quote.date), 'dd/MM/yyyy');
                      return (
                        <option key={quote.id} value={quote.id}>
                          {formattedDate} - {customer?.name} - R$ {total.toFixed(2)}
                        </option>
                      );
                    })}
                </select>
                <button
                  type="button"
                  onClick={() => setShowQuoteSelect(false)}
                  className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowQuoteSelect(true)}
              className="mt-2 text-sm text-blue-600 hover:text-blue-800"
            >
              Importar de Orçamento
            </button>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Observações
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-3">
            {initialData && onDelete && (
              <button
                type="button"
                onClick={() => onDelete(initialData.id)}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md"
              >
                Excluir
              </button>
            )}

            {initialData && onCreateQuote && (
              <button
                type="button"
                onClick={() => onCreateQuote(initialData)}
                className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 border border-blue-600 rounded-md"
              >
                Criar Orçamento
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm"
            >
              {initialData ? 'Atualizar' : 'Criar'} Agendamento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}