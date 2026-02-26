import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useRegisterUser } from '../hooks/useQueries';
import { BloodGroup, UserRole } from '../backend';
import { BLOOD_GROUP_OPTIONS } from '../lib/bloodGroup';
import { Loader2 } from 'lucide-react';

export default function ProfileSetupModal() {
  const { identity } = useInternetIdentity();
  const registerUser = useRegisterUser();

  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.donor);
  const [bloodGroup, setBloodGroup] = useState<BloodGroup | ''>('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [age, setAge] = useState('');
  const [error, setError] = useState('');

  if (!identity) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !bloodGroup || !phone.trim() || !city.trim() || !age) {
      setError('Please fill in all required fields.');
      return;
    }
    if (isNaN(Number(age)) || Number(age) < 1) {
      setError('Please enter a valid age.');
      return;
    }

    try {
      await registerUser.mutateAsync({
        name: name.trim(),
        role,
        bloodGroup: bloodGroup as BloodGroup,
        phone: phone.trim(),
        city: city.trim(),
        age: BigInt(Math.floor(Number(age))),
        lastDonationDate: null,
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
    }
  };

  return (
    <Dialog open={true}>
      <DialogContent className="max-w-[400px] mx-auto" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-primary">Welcome to Blood Connect!</DialogTitle>
          <DialogDescription>
            Please complete your profile to get started.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label htmlFor="ps-name">Full Name *</Label>
            <Input
              id="ps-name"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="min-h-touch"
            />
          </div>

          <div className="space-y-1.5">
            <Label>I am a *</Label>
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
            <Label>Blood Group *</Label>
            <Select value={bloodGroup} onValueChange={(v) => setBloodGroup(v as BloodGroup)}>
              <SelectTrigger className="min-h-touch">
                <SelectValue placeholder="Select blood group" />
              </SelectTrigger>
              <SelectContent>
                {BLOOD_GROUP_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="ps-age">Age *</Label>
              <Input
                id="ps-age"
                type="number"
                placeholder="Age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                min={1}
                max={120}
                className="min-h-touch"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ps-phone">Phone *</Label>
              <Input
                id="ps-phone"
                type="tel"
                placeholder="+91 XXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="min-h-touch"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ps-city">City *</Label>
            <Input
              id="ps-city"
              placeholder="e.g. Chennai, Coimbatore"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="min-h-touch"
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
              <><Loader2 size={18} className="animate-spin mr-2" /> Saving...</>
            ) : (
              'Complete Registration'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
