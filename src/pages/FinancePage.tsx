import React from 'react';

export function FinancePage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Financeiro</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Nova Transação
        </button>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <p>Relatórios financeiros em desenvolvimento...</p>
      </div>
    </div>
  );
}