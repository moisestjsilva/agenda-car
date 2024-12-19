import { useState, useEffect } from 'react';
import { Quote, QuoteStatus } from '../types';
import { db } from '../db';
import { v4 as uuidv4 } from 'uuid';
import { useLiveQuery } from 'dexie-react-hooks';

export function useQuotes() {
  const quotes = useLiveQuery(() => db.quotes.toArray()) || [];

  const addQuote = async (quoteData: Omit<Quote, 'id'>) => {
    const quote = {
      ...quoteData,
      id: uuidv4(),
      status: quoteData.status || 'aberto' as QuoteStatus,
    };
    await db.quotes.add(quote);
    return quote;
  };

  const updateQuote = async (quote: Quote) => {
    await db.quotes.put(quote);
  };

  const deleteQuote = async (id: string) => {
    await db.quotes.delete(id);
  };

  const getQuoteById = async (id: string) => {
    return await db.quotes.get(id);
  };

  return {
    quotes,
    addQuote,
    updateQuote,
    deleteQuote,
    getQuoteById,
  };
}