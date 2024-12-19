import React, { useState } from 'react';
import { Calendar } from '../components/calendar/Calendar';
import { AppointmentModal } from '../components/calendar/AppointmentModal';
import { useAppointments } from '../hooks/useAppointments';
import { useCustomers } from '../hooks/useCustomers';
import { useServices } from '../hooks/useServices';
import { Appointment } from '../types';
import { useNavigate } from 'react-router-dom';

export function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const navigate = useNavigate();
  const { appointments, addAppointment, updateAppointment, deleteAppointment } = useAppointments();
  const { customers } = useCustomers();
  const { services } = useServices();

  // Enriquece os dados dos agendamentos com informações do cliente e serviço
  const enrichedAppointments = appointments.map(appointment => {
    const customer = customers.find(c => c.id === appointment.customerId);
    const service = services.find(s => s.id === appointment.serviceId);
    
    return {
      ...appointment,
      customerName: customer?.name || 'Cliente não encontrado',
      serviceName: service?.name || 'Serviço não encontrado'
    };
  });

  // Lógica para "Agendamentos Hoje"
  const todayAppointments = enrichedAppointments.filter(appointment => {
    const appointmentDate = new Date(appointment.date);
    return appointmentDate.getFullYear() === new Date().getFullYear() &&
           appointmentDate.getMonth() === new Date().getMonth() &&
           appointmentDate.getDate() === new Date().getDate();
  }).length;

  // Lógica para "Faturamento do Dia"
  const todayRevenue = enrichedAppointments.reduce((total, appointment) => {
    const appointmentDate = new Date(appointment.date);
    if (appointmentDate.getFullYear() === new Date().getFullYear() &&
        appointmentDate.getMonth() === new Date().getMonth() &&
        appointmentDate.getDate() === new Date().getDate()) {
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

  const handleSelectSlot = (date: Date) => {
    setSelectedDate(date);
    setSelectedAppointment(undefined);
    setIsModalOpen(true);
  };

  const handleSelectEvent = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  const handleSave = async (appointmentData: Omit<Appointment, 'id'>) => {
    try {
      if (selectedAppointment) {
        await updateAppointment({ ...appointmentData, id: selectedAppointment.id });
      } else {
        await addAppointment(appointmentData);
      }
      setIsModalOpen(false);
      setSelectedAppointment(undefined);
    } catch (error) {
      console.error('Error saving appointment:', error);
      alert('Erro ao salvar o agendamento');
    }
  };

  const handleDelete = async (appointmentId: string) => {
    try {
      await deleteAppointment(appointmentId);
      setIsModalOpen(false);
      setSelectedAppointment(undefined);
    } catch (error) {
      console.error('Error deleting appointment:', error);
      alert('Erro ao excluir o agendamento');
    }
  };

  const handleCreateQuote = (appointment: Appointment) => {
    navigate('/quotes/new', { state: { appointmentId: appointment.id } });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Agenda</h1>
        <button
          onClick={() => {
            setSelectedDate(new Date());
            setSelectedAppointment(undefined);
            setIsModalOpen(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Novo Agendamento
        </button>
      </div>

      <Calendar
        appointments={enrichedAppointments}
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
      />

      <AppointmentModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedAppointment(undefined);
        }}
        onSave={handleSave}
        onDelete={handleDelete}
        onCreateQuote={handleCreateQuote}
        date={selectedDate}
        customers={customers}
        services={services}
        initialData={selectedAppointment}
      />
    </div>
  );
}