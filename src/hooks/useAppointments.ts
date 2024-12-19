import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { Appointment } from '../types';

export function useAppointments() {
  const appointments = useLiveQuery(() => db.appointments.toArray()) || [];

  const addAppointment = async (newAppointment: Omit<Appointment, 'id'>) => {
    try {
      const appointment: Appointment = {
        ...newAppointment,
        id: crypto.randomUUID(),
      };
      await db.appointments.add(appointment);
      return appointment;
    } catch (error) {
      console.error('Error adding appointment:', error);
      throw error;
    }
  };

  const updateAppointment = async (updatedAppointment: Appointment) => {
    try {
      await db.appointments.put(updatedAppointment);
      return updatedAppointment;
    } catch (error) {
      console.error('Error updating appointment:', error);
      throw error;
    }
  };

  const deleteAppointment = async (id: string) => {
    try {
      await db.appointments.delete(id);
    } catch (error) {
      console.error('Error deleting appointment:', error);
      throw error;
    }
  };

  return {
    appointments,
    addAppointment,
    updateAppointment,
    deleteAppointment,
  };
}