import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { BloodGroup, UserProfile, UserRole } from '../backend';
import type { Principal } from '@icp-sdk/core/principal';

// ─── Profile ────────────────────────────────────────────────────────────────

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// ─── Registration ────────────────────────────────────────────────────────────

export function useRegisterUser() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      name: string;
      role: UserRole;
      bloodGroup: BloodGroup;
      phone: string;
      city: string;
      age: bigint;
      lastDonationDate: bigint | null;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.registerUser(
        params.name,
        params.role,
        params.bloodGroup,
        params.phone,
        params.city,
        params.age,
        params.lastDonationDate,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardData'] });
    },
  });
}

// ─── Donor Search ────────────────────────────────────────────────────────────

export function useSmartDonorSearch(bloodGroup: BloodGroup | null, city: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<UserProfile[]>({
    queryKey: ['donorSearch', bloodGroup, city],
    queryFn: async () => {
      if (!actor || !bloodGroup || !city.trim()) return [];
      return actor.smartDonorSearch(bloodGroup, city.trim());
    },
    enabled: !!actor && !actorFetching && !!bloodGroup && !!city.trim(),
  });
}

// ─── Emergency Request ───────────────────────────────────────────────────────

export function useCreateEmergencyRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { requester: string; bloodGroup: BloodGroup; city: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createEmergencyRequest(params.requester, params.bloodGroup, params.city);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboardData'] });
      queryClient.invalidateQueries({ queryKey: ['adminPanelData'] });
    },
  });
}

// ─── Dashboard ───────────────────────────────────────────────────────────────

export function useGetDashboardData() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<{
    totalDonors: bigint;
    nearbyDonors: UserProfile[];
    recentRequests: Array<{ requester: string; city: string; bloodGroup: BloodGroup; timestamp: bigint }>;
  }>({
    queryKey: ['dashboardData'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getDashboardData();
    },
    enabled: !!actor && !actorFetching,
    refetchOnMount: true,
  });
}

// ─── Admin Panel ─────────────────────────────────────────────────────────────

export function useGetAdminPanelData() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<{
    users: UserProfile[];
    emergencyRequests: Array<{ requester: string; city: string; bloodGroup: BloodGroup; timestamp: bigint }>;
  }>({
    queryKey: ['adminPanelData'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAdminPanelData();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

export function useDeactivateUser() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (user: Principal) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deactivateUser(user);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminPanelData'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardData'] });
    },
  });
}
