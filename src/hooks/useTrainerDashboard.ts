import { useQuery } from '@tanstack/react-query';
import { apiService } from '../services/api';

export const useTrainerDashboard = () => {
  return useQuery({
    queryKey: ['trainerDashboard'],
    queryFn: apiService.trainer.getDashboard,
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 60 * 60 * 1000,
  });
};