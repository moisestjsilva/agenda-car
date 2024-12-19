import React from 'react';
import {
  Calendar as BigCalendar,
  dateFnsLocalizer,
  Views,
  SlotInfo,
} from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Appointment } from '../../types';

const timeZone = 'America/Sao_Paulo';

const locales = {
  'pt-BR': ptBR,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface CalendarProps {
  appointments: Appointment[];
  onSelectSlot: (date: Date) => void;
  onSelectEvent: (appointment: Appointment) => void;
}

export function Calendar({ appointments, onSelectSlot, onSelectEvent }: CalendarProps) {
  const events = appointments.map(appointment => {
    const customer = appointment.customerName || 'Cliente não definido';
    const service = appointment.serviceName || 'Serviço não definido';
    
    // Converte a string ISO para objeto Date e ajusta para horário local
    const date = new Date(appointment.date);
    const offset = date.getTimezoneOffset() * 60000;
    const localDate = new Date(date.getTime() - offset);
    
    return {
      id: appointment.id,
      title: `${customer} - ${service}`,
      start: localDate,
      end: new Date(localDate.getTime() + 60 * 60 * 1000), // Adiciona 1 hora
      allDay: false,
      resource: appointment,
    };
  });

  const handleSelectSlot = (slotInfo: SlotInfo) => {
    onSelectSlot(slotInfo.start);
  };

  return (
    <div className="h-[600px]">
      <BigCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
        defaultView={Views.MONTH}
        views={['month', 'week', 'day']}
        selectable
        onSelectSlot={handleSelectSlot}
        onSelectEvent={(event: any) => {
          if (event.resource) {
            onSelectEvent(event.resource);
          }
        }}
        onNavigate={() => {}}
        messages={{
          today: 'Hoje',
          previous: 'Anterior',
          next: 'Próximo',
          month: 'Mês',
          week: 'Semana',
          day: 'Dia',
          agenda: 'Agenda',
          date: 'Data',
          time: 'Hora',
          event: 'Evento',
          noEventsInRange: 'Não há eventos neste período.',
          showMore: (total) => `+ ${total} agendamentos`,
        }}
        formats={{
          dateFormat: 'dd',
          dayFormat: 'dd/MM/yyyy',
          monthHeaderFormat: 'MMMM yyyy',
          timeGutterFormat: (date: Date) => format(date, 'HH:mm'),
          eventTimeRangeFormat: ({ start, end }) => {
            return `${format(start, 'HH:mm')} - ${format(end, 'HH:mm')}`;
          },
        }}
        popup
        step={30}
        timeslots={2}
        dayPropGetter={(date) => ({
          className: 'cursor-pointer hover:bg-gray-50',
        })}
      />
    </div>
  );
}