import { UserProfile } from '../backend';
import DonorResultCard from './DonorResultCard';
import { MapPin } from 'lucide-react';

interface NearbyDonorsListProps {
  donors: UserProfile[];
  city: string;
}

export default function NearbyDonorsList({ donors, city }: NearbyDonorsListProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <MapPin size={18} className="text-primary" />
        <h3 className="text-lg font-bold">Donors in {city}</h3>
        <span className="ml-auto text-sm text-muted-foreground">{donors.length} found</span>
      </div>
      {donors.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground bg-secondary rounded-2xl">
          <p className="text-base">No donors found in your city yet.</p>
          <p className="text-sm mt-1">Be the first to register!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {donors.map((donor, i) => (
            <DonorResultCard key={i} donor={donor} />
          ))}
        </div>
      )}
    </div>
  );
}
