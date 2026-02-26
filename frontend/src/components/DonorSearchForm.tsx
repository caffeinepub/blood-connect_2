import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { BloodGroup } from '../backend';
import { BLOOD_GROUP_OPTIONS } from '../lib/bloodGroup';
import { Search } from 'lucide-react';

interface DonorSearchFormProps {
  onSearch: (bloodGroup: BloodGroup, city: string) => void;
  isLoading?: boolean;
}

export default function DonorSearchForm({ onSearch, isLoading }: DonorSearchFormProps) {
  const [bloodGroup, setBloodGroup] = useState<BloodGroup | ''>('');
  const [city, setCity] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!bloodGroup) {
      setError('Please select a blood group.');
      return;
    }
    if (!city.trim()) {
      setError('Please enter a city name.');
      return;
    }
    onSearch(bloodGroup as BloodGroup, city.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label>Required Blood Group</Label>
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

      <div className="space-y-1.5">
        <Label htmlFor="search-city">City / Location</Label>
        <Input
          id="search-city"
          placeholder="e.g. Chennai, Madurai, Coimbatore"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="min-h-touch text-base"
        />
      </div>

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      <Button
        type="submit"
        className="w-full min-h-touch text-base font-bold bg-primary text-primary-foreground hover:bg-primary/90"
        disabled={isLoading}
      >
        <Search size={18} className="mr-2" />
        {isLoading ? 'Searching...' : 'Find Donors'}
      </Button>
    </form>
  );
}
