import React from 'react';
import { Calendar, Car, DollarSign, Package } from 'lucide-react';
import { DashboardCard } from './DashboardCard';

export function DashboardOverview({ todayAppointments, todayRevenue, monthRevenue }) {
  return (
    <div className="space-y-6">
      <h1 className="text-xl md:text-2xl font-bold text-gray-800">Dashboard</h1>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        <DashboardCard
          title="Agendamentos Hoje"
          value={todayAppointments.toString()}
          icon={<Calendar className="w-6 h-6 md:w-8 md:h-8 text-blue-500" />}
          className="bg-white"
        />
        <DashboardCard
          title="Faturamento do Dia"
          value={`R$ ${todayRevenue.toFixed(2)}`}
          icon={<DollarSign className="w-6 h-6 md:w-8 md:h-8 text-purple-500" />}
          className="bg-white"
        />
        <DashboardCard
          title="Faturamento do Mês"
          value={`R$ ${monthRevenue.toFixed(2)}`}
          icon={<DollarSign className="w-6 h-6 md:w-8 md:h-8 text-purple-500" />}
          className="bg-white"
        />
        <DashboardCard
          title="Produtos em Baixa"
          value="5"
          icon={<Package className="w-6 h-6 md:w-8 md:h-8 text-red-500" />}
          className="bg-white"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">Próximos Agendamentos</h2>
          <div className="space-y-3">
            <div className="border rounded-lg p-3 md:p-4">
              <div className="space-y-2 md:space-y-0 md:flex md:items-center md:justify-between">
                <div className="min-w-0">
                  <h3 className="font-semibold truncate">Honda Civic</h3>
                  <p className="text-gray-600 text-sm">João Silva</p>
                </div>
                <div className="flex items-center justify-between md:justify-end gap-2 md:gap-4">
                  <div className="flex items-center text-gray-600 text-sm space-x-4">
                    <span>14:30</span>
                    <span>180min</span>
                  </div>
                  <span className="px-2 py-1 rounded-full text-xs md:text-sm bg-yellow-100 text-yellow-800 whitespace-nowrap">
                    Pendente
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">Serviços em Andamento</h2>
          <div className="space-y-3">
            <div className="border rounded-lg p-3 md:p-4">
              <div className="space-y-2 md:space-y-0 md:flex md:items-center md:justify-between">
                <div className="min-w-0">
                  <h3 className="font-semibold truncate">Toyota Corolla</h3>
                  <p className="text-gray-600 text-sm">Maria Santos</p>
                </div>
                <div className="flex items-center justify-between md:justify-end gap-2 md:gap-4">
                  <div className="flex items-center text-gray-600 text-sm space-x-4">
                    <span>Em andamento</span>
                  </div>
                  <span className="px-2 py-1 rounded-full text-xs md:text-sm bg-green-100 text-green-800 whitespace-nowrap">
                    2h restantes
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}