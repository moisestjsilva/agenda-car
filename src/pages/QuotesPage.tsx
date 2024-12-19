import React, { useState } from 'react';
import { useQuotes } from '../hooks/useQuotes';
import { useCustomers } from '../hooks/useCustomers';
import { QuoteModal } from '../components/quotes/QuoteModal';
import { format } from 'date-fns';
import { Plus, Search, Pencil, Trash2, Printer, MessageCircle } from 'lucide-react';
import { QuoteStatus } from '../types';
import jsPDF from 'jspdf';

export function QuotesPage() {
  const { quotes, deleteQuote } = useQuotes();
  const { customers } = useCustomers();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | QuoteStatus>('all');
  const [filterCustomer, setFilterCustomer] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredQuotes = quotes.filter(quote => {
    const matchesStatus = filterStatus === 'all' || quote.status === filterStatus;
    const matchesCustomer = filterCustomer === 'all' || quote.customerId === filterCustomer;
    const customer = customers.find(c => c.id === quote.customerId);
    const searchMatch = searchTerm === '' || 
      customer?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.notes?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesCustomer && searchMatch;
  });

  const handleEditQuote = (quoteId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedQuote(quoteId);
    setIsModalOpen(true);
  };

  const handleDeleteQuote = async (quoteId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Tem certeza que deseja excluir este orçamento?')) {
      await deleteQuote(quoteId);
    }
  };

  const handleWhatsApp = (quoteId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const quote = quotes.find(q => q.id === quoteId);
    if (!quote) return;

    const customer = customers.find(c => c.id === quote.customerId);
    if (!customer?.phone) {
      alert('Cliente não possui telefone cadastrado');
      return;
    }

    let message = `*Orçamento - ${format(new Date(quote.date), 'dd/MM/yyyy')}*\n\n`;
    message += `Cliente: ${customer.name}\n\n`;
    message += `*Serviços:*\n`;
    
    quote.items.forEach(item => {
      message += `${item.name}: R$ ${item.price.toFixed(2)}\n`;
    });
    
    const total = quote.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    message += `\n*Total: R$ ${total.toFixed(2)}*`;

    const phoneNumber = customer.phone.replace(/\D/g, '');
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/55${phoneNumber}?text=${encodedMessage}`, '_blank');
  };

  const handlePrint = (quoteId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const quote = quotes.find(q => q.id === quoteId);
    if (!quote) return;

    const customer = customers.find(c => c.id === quote.customerId);
    const pdf = new jsPDF();

    // Add header
    pdf.setFontSize(20);
    pdf.text('Orçamento', 105, 20, { align: 'center' });

    // Add customer info
    pdf.setFontSize(12);
    pdf.text(`Cliente: ${customer?.name || 'N/A'}`, 20, 40);
    pdf.text(`Data: ${format(new Date(quote.date), 'dd/MM/yyyy')}`, 20, 50);

    // Add items
    pdf.text('Serviços:', 20, 70);
    let y = 80;
    quote.items.forEach((item) => {
      pdf.text(`${item.name}`, 20, y);
      pdf.text(`R$ ${item.price.toFixed(2)}`, 150, y);
      y += 10;
    });

    // Add total
    const total = quote.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    y += 10;
    pdf.text(`Total: R$ ${total.toFixed(2)}`, 150, y);

    // Add notes if any
    if (quote.notes) {
      y += 20;
      pdf.text('Observações:', 20, y);
      y += 10;
      pdf.text(quote.notes, 20, y);
    }

    pdf.save(`orcamento-${quote.id}.pdf`);
  };

  const statusOptions = [
    { value: 'all', label: 'Todos os Status' },
    { value: 'aguardando', label: 'Aguardando' },
    { value: 'aprovado', label: 'Aprovado' },
    { value: 'reprovado', label: 'Reprovado' },
  ] as const;

  const getStatusColor = (status: QuoteStatus) => {
    switch (status) {
      case 'aprovado':
        return 'bg-green-100 text-green-800';
      case 'reprovado':
        return 'bg-red-100 text-red-800';
      case 'aguardando':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: QuoteStatus) => {
    switch (status) {
      case 'aprovado':
        return 'Aprovado';
      case 'reprovado':
        return 'Reprovado';
      case 'aguardando':
        return 'Aguardando';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 md:mb-0">Orçamentos</h1>
        <button
          onClick={() => {
            setSelectedQuote(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          <Plus size={20} />
          Novo Orçamento
        </button>
      </div>

      {/* Filtros e Busca */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar orçamentos..."
            className="pl-10 w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as 'all' | QuoteStatus)}
          className="rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          {statusOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select
          value={filterCustomer}
          onChange={(e) => setFilterCustomer(e.target.value)}
          className="rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="all">Todos os Clientes</option>
          {customers.map(customer => (
            <option key={customer.id} value={customer.id}>
              {customer.name}
            </option>
          ))}
        </select>
      </div>

      {/* Tabela para Desktop */}
      <div className="hidden md:block">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Itens
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredQuotes.map((quote) => {
                const customer = customers.find(c => c.id === quote.customerId);
                const total = quote.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                
                return (
                  <tr key={quote.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {format(new Date(quote.date), 'dd/MM/yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {customer?.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {quote.items.length}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      R$ {total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(quote.status)}`}>
                        {getStatusLabel(quote.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={(e) => handlePrint(quote.id, e)}
                          className="p-1.5 text-gray-600 hover:bg-gray-50 rounded-full transition-colors"
                          title="Imprimir PDF"
                        >
                          <Printer size={18} />
                        </button>
                        <button
                          onClick={(e) => handleWhatsApp(quote.id, e)}
                          className="p-1.5 text-green-600 hover:bg-green-50 rounded-full transition-colors"
                          title="Enviar por WhatsApp"
                        >
                          <MessageCircle size={20} />
                        </button>
                        <button
                          onClick={(e) => handleEditQuote(quote.id, e)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                          title="Editar"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={(e) => handleDeleteQuote(quote.id, e)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                          title="Excluir"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cards para Mobile */}
      <div className="md:hidden grid grid-cols-1 gap-4">
        {filteredQuotes.map((quote) => {
          const customer = customers.find(c => c.id === quote.customerId);
          const total = quote.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
          
          return (
            <div
              key={quote.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                    {customer?.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {format(new Date(quote.date), 'dd/MM/yyyy')}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(quote.status)}`}>
                  {getStatusLabel(quote.status)}
                </span>
              </div>

              <div className="space-y-2">
                <div className="text-sm text-gray-900 dark:text-white">
                  <span className="font-medium">Itens:</span> {quote.items.length}
                </div>
                <div className="text-sm text-gray-900 dark:text-white">
                  <span className="font-medium">Total:</span> R$ {total.toFixed(2)}
                </div>
                {quote.notes && (
                  <div className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {quote.notes}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={(e) => handlePrint(quote.id, e)}
                  className="p-1.5 text-gray-600 hover:bg-gray-50 rounded-full transition-colors"
                  title="Imprimir PDF"
                >
                  <Printer size={18} />
                </button>
                <button
                  onClick={(e) => handleWhatsApp(quote.id, e)}
                  className="p-1.5 text-green-600 hover:bg-green-50 rounded-full transition-colors"
                  title="Enviar por WhatsApp"
                >
                  <MessageCircle size={20} />
                </button>
                <button
                  onClick={(e) => handleEditQuote(quote.id, e)}
                  className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                  title="Editar"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={(e) => handleDeleteQuote(quote.id, e)}
                  className="p-1.5 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                  title="Excluir"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredQuotes.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          Nenhum orçamento encontrado com os filtros selecionados.
        </div>
      )}

      {isModalOpen && (
        <QuoteModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedQuote(null);
          }}
          quoteId={selectedQuote}
          customers={customers}
        />
      )}
    </div>
  );
}