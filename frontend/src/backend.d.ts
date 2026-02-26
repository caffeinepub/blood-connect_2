import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface EmergencyRequest {
    requester: string;
    city: string;
    bloodGroup: BloodGroup;
    timestamp: Time;
}
export interface UserProfile {
    age: bigint;
    active: boolean;
    city: string;
    name: string;
    createdAt: Time;
    role: UserRole;
    lastDonationDate?: Time;
    bloodGroup: BloodGroup;
    phone: string;
    lastActive: Time;
}
export enum BloodGroup {
    B_Negative = "B_Negative",
    AB_Positive = "AB_Positive",
    O_Positive = "O_Positive",
    A_Negative = "A_Negative",
    B_Positive = "B_Positive",
    AB_Negative = "AB_Negative",
    A_Positive = "A_Positive",
    O_Negative = "O_Negative"
}
export enum UserRole {
    donor = "donor",
    receiver = "receiver"
}
export enum UserRole__1 {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole__1): Promise<void>;
    createEmergencyRequest(requester: string, bloodGroup: BloodGroup, city: string): Promise<void>;
    deactivateUser(user: Principal): Promise<void>;
    getAdminPanelData(): Promise<{
        users: Array<UserProfile>;
        emergencyRequests: Array<EmergencyRequest>;
    }>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole__1>;
    getDashboardData(): Promise<{
        recentRequests: Array<EmergencyRequest>;
        nearbyDonors: Array<UserProfile>;
        totalDonors: bigint;
    }>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    registerUser(name: string, role: UserRole, bloodGroup: BloodGroup, phone: string, city: string, age: bigint, lastDonationDate: Time | null): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    smartDonorSearch(requiredBloodGroup: BloodGroup, city: string): Promise<Array<UserProfile>>;
}
