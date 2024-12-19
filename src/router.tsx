import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { DashboardOverview } from './components/dashboard/DashboardOverview';
import { CalendarPage } from './pages/CalendarPage';
import { QuotesPage } from './pages/QuotesPage';
import { VehiclesPage } from './pages/VehiclesPage';
import { FinancePage } from './pages/FinancePage';
import { InventoryPage } from './pages/InventoryPage';
import { CustomersPage } from './pages/CustomersPage';
import { SettingsPage } from './pages/SettingsPage';
import { ServicesPage } from './pages/ServicesPage';
import { Layout } from './components/Layout';
import { useAppointments } from './hooks/useAppointments';
import { useCustomers } from './hooks/useCustomers';
import { useServices } from './hooks/useServices';

const DashboardOverviewWrapper = () => {
  const { appointments } = useAppointments();
  const { customers } = useCustomers();
  const { services } = useServices();

  console.log('Serviços:', services);
  console.log('Agendamentos:', appointments);

  const enrichedAppointments = appointments.map(appointment => {
    const customer = customers.find(c => c.id === appointment.customerId);
    const service = services.find(s => s.id === appointment.serviceId);
    return {
      ...appointment,
      customerName: customer?.name || 'Cliente não encontrado',
      serviceName: service?.name || 'Serviço não encontrado',
      serviceValue: service?.value || 0
    };
  });

  // Lógica para "Agendamentos Hoje"
  console.log('Appointment Dates:', appointments.map(a => a.date));
  const todayAppointments = enrichedAppointments.filter(appointment => {
    const appointmentDate = new Date(appointment.date);
    return appointmentDate.toDateString() === new Date().toDateString();
  }).length;

  // Lógica para "Faturamento do Dia"
  const todayRevenue = enrichedAppointments.reduce((total, appointment) => {
    const appointmentDate = new Date(appointment.date);
    if (appointmentDate.toDateString() === new Date().toDateString()) {
      return total + appointment.serviceValue;
    }
    return total;
  }, 0);

  // Lógica para "Faturamento do Mês"
  const monthRevenue = enrichedAppointments.reduce((total, appointment) => {
    const appointmentDate = new Date(appointment.date);
    if (appointmentDate.getFullYear() === new Date().getFullYear() &&
        appointmentDate.getMonth() === new Date().getMonth()) {
      return total + appointment.serviceValue;
    }
    return total;
  }, 0);

  console.log('Serviços:', services);
  console.log('Agendamentos Enriquecidos:', enrichedAppointments);
  enrichedAppointments.forEach(appointment => {
    const service = services.find(s => s.id === appointment.serviceId);
    console.log(`Agendamento ID: ${appointment.id}, Service ID: ${appointment.serviceId}, Serviço Associado: ${service ? service.name : 'Nenhum serviço encontrado'}`);
  });
  console.log('Agendamentos Hoje:', todayAppointments);
  console.log('Faturamento do Dia:', todayRevenue);
  console.log('Faturamento do Mês:', monthRevenue);

  return (
    <DashboardOverview 
      todayAppointments={todayAppointments}
      todayRevenue={todayRevenue}
      monthRevenue={monthRevenue}
    />
  );
};

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Layout />,
      children: [
        {
          index: true,
          element: <DashboardOverviewWrapper />,
        },
        {
          path: 'calendar',
          element: <CalendarPage />,
        },
        {
          path: 'quotes',
          element: <QuotesPage />,
        },
        {
          path: 'vehicles',
          element: <VehiclesPage />,
        },
        {
          path: 'finance',
          element: <FinancePage />,
        },
        {
          path: 'inventory',
          element: <InventoryPage />,
        },
        {
          path: 'customers',
          element: <CustomersPage />,
        },
        {
          path: 'settings',
          element: <SettingsPage />,
        },
        {
          path: 'services',
          element: <ServicesPage />,
        },
      ],
    },
  ],
  {
    future: {
      v7_relativeSplatPath: true,
    },
  }
);
