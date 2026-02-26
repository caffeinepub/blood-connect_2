import { BloodGroup } from '../backend';

export const BLOOD_GROUP_LABELS: Record<BloodGroup, string> = {
  [BloodGroup.A_Positive]: 'A+',
  [BloodGroup.A_Negative]: 'A−',
  [BloodGroup.B_Positive]: 'B+',
  [BloodGroup.B_Negative]: 'B−',
  [BloodGroup.O_Positive]: 'O+',
  [BloodGroup.O_Negative]: 'O−',
  [BloodGroup.AB_Positive]: 'AB+',
  [BloodGroup.AB_Negative]: 'AB−',
};

export const BLOOD_GROUP_OPTIONS = Object.entries(BLOOD_GROUP_LABELS).map(([value, label]) => ({
  value: value as BloodGroup,
  label,
}));

export function formatBloodGroup(bg: BloodGroup): string {
  return BLOOD_GROUP_LABELS[bg] ?? bg;
}

export function timeAgo(timestamp: bigint): string {
  const ms = Number(timestamp / BigInt(1_000_000));
  const now = Date.now();
  const diff = now - ms;

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} min ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (days < 30) return `${days} day${days > 1 ? 's' : ''} ago`;
  return `${Math.floor(days / 30)} month${Math.floor(days / 30) > 1 ? 's' : ''} ago`;
}

export function isAvailableNow(lastActive: bigint): boolean {
  const ms = Number(lastActive / BigInt(1_000_000));
  const diff = Date.now() - ms;
  return diff < 24 * 60 * 60 * 1000; // 24 hours
}
