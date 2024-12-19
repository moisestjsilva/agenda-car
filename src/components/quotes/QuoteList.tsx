import React from 'react';
import { format } from 'date-fns';
import { Quote } from '../../types';
import { QuoteListItem } from './QuoteListItem';

interface QuoteListProps {
  quotes: Quote[];
  onEdit: (quote: Quote) => void;
  onDelete: (id: string) => void;
  onShare: (quote: Quote) => void;
}

export function QuoteList({ quotes, onEdit, onDelete, onShare }: QuoteListProps) {
  if (quotes.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
        Nenhum orçamento encontrado
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b border-gray-200 font-medium text-gray-700">
        <div className="col-span-2">Data</div>
        <div className="col-span-3">Cliente</div>
        <div className="col-span-2">Validade</div>
        <div className="col-span-2">Total</div>
        <div className="col-span-2">Status</div>
        <div className="col-span-1">Ações</div>
      </div>
      <div className="divide-y divide-gray-200">
        {quotes.map((quote) => (
          <QuoteListItem
            key={quote.id}
            quote={quote}
            onEdit={() => onEdit(quote)}
            onDelete={() => onDelete(quote.id)}
            onShare={() => onShare(quote)}
          />
        ))}
      </div>
    </div>
  );
}