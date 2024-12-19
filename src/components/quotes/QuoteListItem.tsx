import React from 'react';
import { format } from 'date-fns';
import { Pencil, Trash2, Share2 } from 'lucide-react';
import { Quote } from '../../types';
import { formatCurrency } from '../../utils/format';

interface QuoteListItemProps {
  quote: Quote;
  onEdit: () => void;
  onDelete: () => void;
  onShare: () => void;
}

export function QuoteListItem({ quote, onEdit, onDelete, onShare }: QuoteListItemProps) {
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
  };

  return (
    <div className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-gray-50">
      <div className="col-span-2">
        {format(new Date(quote.date), 'dd/MM/yyyy')}
      </div>
      <div className="col-span-3">{quote.customerId}</div>
      <div className="col-span-2">
        {format(new Date(quote.validUntil), 'dd/MM/yyyy')}
      </div>
      <div className="col-span-2">{formatCurrency(quote.total)}</div>
      <div className="col-span-2">
        <span className={`px-2 py-1 rounded-full text-sm ${statusColors[quote.status]}`}>
          {quote.status === 'pending' && 'Pendente'}
          {quote.status === 'approved' && 'Aprovado'}
          {quote.status === 'rejected' && 'Rejeitado'}
        </span>
      </div>
      <div className="col-span-1 flex space-x-2">
        <button
          onClick={onEdit}
          className="p-1 text-gray-400 hover:text-blue-500"
          title="Editar orçamento"
        >
          <Pencil className="w-5 h-5" />
        </button>
        <button
          onClick={onShare}
          className="p-1 text-gray-400 hover:text-green-500"
          title="Compartilhar via WhatsApp"
        >
          <Share2 className="w-5 h-5" />
        </button>
        <button
          onClick={onDelete}
          className="p-1 text-gray-400 hover:text-red-500"
          title="Excluir orçamento"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}