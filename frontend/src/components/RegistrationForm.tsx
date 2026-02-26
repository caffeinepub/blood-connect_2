import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRegisterUser } from '../hooks/useQueries';
import { BloodGroup, UserRole } from '../backend';
import { BLOOD_GROUP_OPTIONS } from '../lib/bloodGroup';
import { Loader2, CheckCircle2 } from 'lucide-react';

interface RegistrationFormProps {
  onSuccess?: () => void;
}

export default function RegistrationForm({ onSuccess }: RegistrationFormProps) {
  const registerUser = useRegisterUser();

  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.donor);
  const [bloodGroup, setBloodGroup] = useState<BloodGroup | ''>('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [age, setAge] = useState('');
  const [lastDonation, setLastDonation] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) { setError('Name is required.'); return; }
    if (!bloodGroup) { setError('Please select a blood group.'); return; }
    if (!phone.trim()) { setError('Phone number is required.'); return; }
    if (!city.trim()) { setError('City is required.'); return; }
    if (!age || isNaN(Number(age)) || Number(age) < 1) { setError('Please enter a valid age.'); return; }

    let lastDonationTimestamp: bigint | null = null;
    if (lastDonation) {
      const d = new Date(lastDonation);
      lastDonationTimestamp = BigInt(d.getTime()) * BigInt(1_000_000);
    }

    try {
      await registerUser.mutateAsync({
        name: name.trim(),
        role,
        bloodGroup: bloodGroup as BloodGroup,
        phone: phone.trim(),
        city: city.trim(),
        age: BigInt(Math.floor(Number(age))),
        lastDonationDate: lastDonationTimestamp,
      });
      setSuccess(true);
      onSuccess?.();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center gap-4 py-8">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle2 size={40} className="text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-green-700">Registration Successful!</h3>
        <p className="text-base text-muted-foreground text-center">
          Welcome to Blood Connect. You are now registered as a{' '}
          <strong>{role === UserRole.donor ? 'Donor' : 'Receiver'}</strong>.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label>I want to register as *</Label>
        <div className="grid grid-cols-2 gap-3">
          {[UserRole.donor, UserRole.receiver].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className={`min-h-touch rounded-xl border-2 font-semibold text-base transition-colors ${
                role === r
                  ? 'border-primary bg-secondary text-primary'
                  : 'border-border text-muted-foreground hover:border-primary/50'
              }`}
            >
              {r === UserRole.donor ? '🩸 Donor' : '🏥 Receiver'}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="reg-name">Full Name *</Label>
        <Input
          id="reg-name"
          placeholder="Enter your full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="min-h-touch text-base"
        />
      </div>

      <div className="space-y-1.5">
        <Label>Blood Group *</Label>
        <Select value={bloodGroup} onValueChange={(v) => setBloodGroup(v as BloodGroup)}>
          <SelectTrigger className="min-h-touch text-base">
            <SelectValue placeholder="Select blood group" />
          </SelectTrigger>
          <SelectContent>
            {BLOOD_GROUP_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value} className="text-base">
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="reg-age">Age *</Label>
          <Input
            id="reg-age"
            type="number"
            placeholder="Age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            min={1}
            max={120}
            className="min-h-touch text-base"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="reg-phone">Phone *</Label>
          <Input
            id="reg-phone"
            type="tel"
            placeholder="+91 XXXXX"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="min-h-touch text-base"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="reg-city">City *</Label>
        <Input
          id="reg-city"
          placeholder="e.g. Chennai, Coimbatore, Madurai"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="min-h-touch text-base"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="reg-donation">Last Donation Date (optional)</Label>
        <Input
          id="reg-donation"
          type="date"
          value={lastDonation}
          onChange={(e) => setLastDonation(e.target.value)}
          className="min-h-touch text-base"
          max={new Date().toISOString().split('T')[0]}
        />
      </div>

      {error && (
        <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">{error}</p>
      )}

      <Button
        type="submit"
        className="w-full min-h-touch text-base font-bold bg-primary text-primary-foreground hover:bg-primary/90"
        disabled={registerUser.isPending}
      >
        {registerUser.isPending ? (
          <><Loader2 size={18} className="animate-spin mr-2" /> Registering...</>
        ) : (
          'Register Now'
        )}
      </Button>
    </form>
  );
}
