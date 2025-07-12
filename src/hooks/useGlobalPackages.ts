import { useQuery } from '@tanstack/react-query';
import { apiService } from '../services/api';

interface Package {
  id: string;
  title: string;
  category: string;
  whats_included: string[];
  short_description: string;
  duration: number;
  price: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  image_url: string;
}

interface PackagesResponse {
  packages: Package[];
  count: number;
}

// Global packages hook that persists across navigation
export const useGlobalPackages = () => {
  return useQuery<PackagesResponse, Error>({
    queryKey: ['packages'],
    queryFn: apiService.membership.getPackages,
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 60 * 60 * 1000, // 1 hour
    refetchOnMount: false, // Don't refetch when component mounts if data exists
    refetchOnWindowFocus: false, // Don't refetch when window gains focus
    refetchOnReconnect: false, // Don't refetch when reconnecting
  });
};

// Hook for accessing cached packages data (doesn't trigger fetch)
export const useCachedPackages = () => {
  return useQuery<PackagesResponse, Error>({
    queryKey: ['packages'],
    queryFn: apiService.membership.getPackages,
    staleTime: 60 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    enabled: false, // This prevents automatic fetching
  });
};

// Legacy hook for backward compatibility
export const usePackages = useGlobalPackages;
