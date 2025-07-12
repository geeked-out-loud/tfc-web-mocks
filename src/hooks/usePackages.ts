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

export const usePackages = () => {
  return useQuery<PackagesResponse, Error>({
    queryKey: ['packages'],
    queryFn: apiService.membership.getPackages,
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 60 * 60 * 1000, // 1 hour
  });
};

// Hook for force refreshing packages
export const usePackagesRefresh = () => {
  const { refetch } = usePackages();
  return refetch;
};
