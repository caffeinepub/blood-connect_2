export type HealthCondition = 'fever' | 'surgery' | 'pregnancy' | 'medication' | 'none';

export interface EligibilityInput {
  age: number;
  weight: number;
  lastDonationDate: Date | null;
  healthConditions: HealthCondition[];
}

export interface EligibilityResult {
  eligible: boolean;
  reason?: string;
  nextDonationDate?: Date;
}

const CONDITION_LABELS: Record<HealthCondition, string> = {
  fever: 'Fever or active infection',
  surgery: 'Recent surgery (within 6 months)',
  pregnancy: 'Pregnancy or recent childbirth',
  medication: 'Active medication / treatment',
  none: 'None of the above',
};

export function checkEligibility(input: EligibilityInput): EligibilityResult {
  const { age, weight, lastDonationDate, healthConditions } = input;

  // Age check
  if (age < 18) {
    return { eligible: false, reason: 'You must be at least 18 years old to donate blood.' };
  }
  if (age > 65) {
    return { eligible: false, reason: 'Donors above 65 years of age are not eligible for safety reasons.' };
  }

  // Weight check
  if (weight < 50) {
    return { eligible: false, reason: 'You must weigh at least 50 kg to donate blood.' };
  }

  // Health conditions check
  const disqualifying = healthConditions.filter((c) => c !== 'none');
  if (disqualifying.length > 0) {
    const conditionText = disqualifying.map((c) => CONDITION_LABELS[c]).join(', ');
    return {
      eligible: false,
      reason: `You are currently not eligible due to: ${conditionText}.`,
    };
  }

  // Last donation check (3 months = ~90 days)
  const now = new Date();
  if (lastDonationDate) {
    const daysSince = Math.floor((now.getTime() - lastDonationDate.getTime()) / (1000 * 60 * 60 * 24));
    if (daysSince < 90) {
      const nextDate = new Date(lastDonationDate);
      nextDate.setDate(nextDate.getDate() + 90);
      return {
        eligible: false,
        reason: `You donated blood recently. You need to wait at least 3 months between donations.`,
        nextDonationDate: nextDate,
      };
    }
  }

  // Eligible — next donation date is 3 months from today
  const nextDate = new Date(now);
  nextDate.setDate(nextDate.getDate() + 90);

  return {
    eligible: true,
    nextDonationDate: nextDate,
  };
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}

export { CONDITION_LABELS };
