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


export const useMealLogMessages = (mealLogId?: string) => {
    return useQuery({
        queryKey: ['mealLogMessages', mealLogId],
        queryFn: () => {
            if (!mealLogId) {
                throw new Error('mealLogId is required');
            }
            return apiService.trainer.getMealLogMessages(mealLogId);
        },
        enabled: !!mealLogId, // Only run when mealLogId exists
        refetchInterval: 10000, // Optional: auto refresh every 10s
    });
};


