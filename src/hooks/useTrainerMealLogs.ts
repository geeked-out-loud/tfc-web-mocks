import { useQuery } from '@tanstack/react-query';
import { apiService } from '../services/api';

export const useTrainerMealLogs = () => {
  return useQuery({
    queryKey: ['trainerMealLogs'],
    queryFn: apiService.trainer.getMealLogs,
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 60 * 60 * 1000,
  });
};

