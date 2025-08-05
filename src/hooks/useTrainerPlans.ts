import { useQuery } from '@tanstack/react-query';
import { apiService } from '../services/api';

export const useTrainerDashboard = () => {
  return useQuery({
    queryKey: ['trainerDashboard'],
    queryFn: apiService.trainer.getPlans,
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 60 * 60 * 1000,
  });
};

export const useClientDetails = (clientId: string) => {
  return useQuery({
    queryKey: ['clientDetails', clientId],
    queryFn: () => apiService.trainer.getClientDetails(clientId),
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 60 * 60 * 1000,
    enabled: !!clientId, // Only run if clientId is provided
  });
}
