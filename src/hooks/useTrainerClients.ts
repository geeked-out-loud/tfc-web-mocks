import { useQuery } from '@tanstack/react-query';
import { apiService } from '../services/api';

// Mock response for fallback
const mockClientsResponse = {
  trainer_id: 'mock-trainer-id',
  clients: [],
  count: 0
};

export interface TrainerClient {
  id: string;
  user_id: string;
  status: string;
  session_type: string;
  scheduled_at: string;
  user_name: string;
  user_email: string;
  age?: number;
  gender?: string;
  fitness_goals?: string[];
  injuries?: string[];
  created_at: string;
  updated_at: string;
  plan_status?: string; // Added for plan status from API
}

export interface TrainerClientsResponse {
  trainer_id: string;
  clients: TrainerClient[];
  count: number;
}

export const useTrainerClients = () => {
  return useQuery<TrainerClientsResponse, Error>({
    queryKey: ['trainerClients'],
    queryFn: async () => {
      try {
        const data = await apiService.trainer.getMyClients();
        return data;
      } catch (err) {
        // Fallback to mock if API fails
        console.warn('Falling back to mock trainer clients:', err);
        return mockClientsResponse;
      }
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
