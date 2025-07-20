import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';

// Mock data for development
const mockTrainerProfile: Trainer = {
  id: 'trainer-001',
  bio: 'Certified personal trainer with over 8 years of experience in strength training, weight loss, and sports conditioning. Passionate about helping clients achieve their fitness goals through personalized workout plans and nutritional guidance.',
  certifications: ['NASM-CPT', 'ACSM-CPT', 'Nutrition Specialist', 'Strength & Conditioning'],
  experience_years: 8,
  is_active: true,
  image: '/experts.png',
  created_at: '2017-01-15T00:00:00Z',
  updated_at: '2025-07-20T00:00:00Z',
  fullName: 'John Smith',
  email: 'john.smith@tfcweb.com',
  clients: 42,
  mealLogs: 156,
  appointments: 12
};

const generateMockAppointments = (filters?: {
  date?: string;
  type?: 'EXERCISE' | 'NUTRITION' | 'ASSESSMENT';
  sessionType?: 'physical' | 'online' | 'self';
}): Appointment[] => {
  const today = new Date();
  const appointments: Appointment[] = [
    {
      id: 'apt-001',
      date: format(today, 'yyyy-MM-dd'),
      clientName: 'Sarah Johnson',
      appointmentNumber: 1,
      type: 'EXERCISE',
      sessionType: 'physical'
    },
    {
      id: 'apt-002',
      date: format(today, 'yyyy-MM-dd'),
      clientName: 'Mike Chen',
      appointmentNumber: 2,
      type: 'NUTRITION',
      sessionType: 'online'
    },
    {
      id: 'apt-003',
      date: format(today, 'yyyy-MM-dd'),
      clientName: 'Emma Davis',
      appointmentNumber: 3,
      type: 'ASSESSMENT',
      sessionType: 'physical'
    },
    {
      id: 'apt-004',
      date: format(today, 'yyyy-MM-dd'),
      clientName: 'Alex Rodriguez',
      appointmentNumber: 4,
      type: 'EXERCISE',
      sessionType: 'online'
    },
    {
      id: 'apt-005',
      date: format(today, 'yyyy-MM-dd'),
      clientName: 'Lisa Thompson',
      appointmentNumber: 5,
      type: 'NUTRITION',
      sessionType: 'physical'
    },
    {
      id: 'apt-006',
      date: format(today, 'yyyy-MM-dd'),
      clientName: 'David Wilson',
      appointmentNumber: 6,
      type: 'EXERCISE',
      sessionType: 'self'
    },
    {
      id: 'apt-007',
      date: format(today, 'yyyy-MM-dd'),
      clientName: 'Rachel Green',
      appointmentNumber: 7,
      type: 'ASSESSMENT',
      sessionType: 'online'
    },
    {
      id: 'apt-008',
      date: format(today, 'yyyy-MM-dd'),
      clientName: 'Tom Anderson',
      appointmentNumber: 8,
      type: 'NUTRITION',
      sessionType: 'self'
    }
  ];

  // Apply filters if provided
  return appointments.filter(appointment => {
    if (filters?.date && appointment.date !== filters.date) {
      return false;
    }
    if (filters?.type && appointment.type !== filters.type) {
      return false;
    }
    if (filters?.sessionType && appointment.sessionType !== filters.sessionType) {
      return false;
    }
    return true;
  });
};

// Trainer interface definition
export interface Trainer {
  id: string;
  bio: string;
  certifications: string[];
  experience_years: number;
  is_active: boolean;
  image?: string;
  created_at: string;
  updated_at: string;
  // We'll keep these for backward compatibility with existing code
  fullName?: string;
  email?: string;
  clients?: number;
  mealLogs?: number;
  appointments?: number;
}

// Appointment interface definition
export interface Appointment {
  id: string;
  date: string;
  clientName: string;
  appointmentNumber: number;
  type: 'EXERCISE' | 'NUTRITION' | 'ASSESSMENT';
  sessionType: 'physical' | 'online' | 'self';
}

export interface AppointmentsResponse {
  appointments: Appointment[];
  count: number;
}

/**
 * Hook for fetching trainer appointments with optional filters
 */
export const useTrainerAppointments = (filters?: {
  date?: Date;
  type?: 'EXERCISE' | 'NUTRITION' | 'ASSESSMENT';
  sessionType?: 'physical' | 'online' | 'self';
}) => {
  // Convert date to string format if provided
  const formattedFilters = filters ? {
    ...(filters.date && { date: format(filters.date, 'yyyy-MM-dd') }),
    ...(filters.type && { type: filters.type }),
    ...(filters.sessionType && { sessionType: filters.sessionType }),
  } : undefined;
  
  // Create a stable filter key for the query
  const filterKey = formattedFilters ? JSON.stringify(formattedFilters) : 'all';
  
  return useQuery<AppointmentsResponse, Error>({
    queryKey: ['trainerAppointments', filterKey],
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Use mock data instead of API call
      const filteredAppointments = generateMockAppointments(formattedFilters);
      
      return {
        appointments: filteredAppointments,
        count: filteredAppointments.length
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook for fetching trainer profile data
 */
export const useTrainerProfile = () => {
  return useQuery<Trainer, Error>({
    queryKey: ['trainerProfile'],
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Return mock data instead of API call
      return mockTrainerProfile;
    },
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 60 * 60 * 1000, // 1 hour
  });
};

/**
 * Hook for force refreshing trainer profile
 */
export const useTrainerProfileRefresh = () => {
  const { refetch } = useTrainerProfile();
  return refetch;
};

/**
 * Hook for force refreshing trainer appointments
 */
export const useTrainerAppointmentsRefresh = () => {
  const { refetch } = useTrainerAppointments();
  return refetch;
};
