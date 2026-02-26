import { UserProfile } from '../backend';
import { formatBloodGroup, isAvailableNow, timeAgo } from '../lib/bloodGroup';
import { Phone, MapPin, Clock } from 'lucide-react';
import { SiWhatsapp } from 'react-icons/si';

interface DonorResultCardProps {
  donor: UserProfile;
}

export default function DonorResultCard({ donor }: DonorResultCardProps) {
  const available = isAvailableNow(donor.lastActive);
  const lastActiveText = timeAgo(donor.lastActive);

  const whatsappMessage = encodeURIComponent(
    'Hi, I found your profile on Blood Connect. I urgently need blood. Can you help?'
  );
  const whatsappUrl = `https://wa.me/${donor.phone.replace(/\D/g, '')}?text=${whatsappMessage}`;

  return (
    <div className="bg-white rounded-2xl border border-border shadow-card p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center shrink-0">
            <span className="text-lg font-black text-primary">
              {formatBloodGroup(donor.bloodGroup)}
            </span>
          </div>
          <div>
            <p className="text-base font-bold text-foreground">{donor.name}</p>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin size={13} />
              <span>{donor.city}</span>
            </div>
          </div>
        </div>
        {available && (
          <span className="shrink-0 text-xs font-bold bg-green-100 text-green-700 border border-green-200 rounded-full px-2.5 py-1">
            ✓ Available Now
          </span>
        )}
      </div>

      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <Clock size={13} />
        <span>Last active: {lastActiveText}</span>
      </div>

      <div className="flex gap-2 mt-1">
        <a
          href={`tel:${donor.phone}`}
          className="flex-1 flex items-center justify-center gap-2 min-h-touch rounded-xl border-2 border-primary text-primary font-semibold text-sm hover:bg-secondary transition-colors"
        >
          <Phone size={16} />
          Call
        </a>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 min-h-touch rounded-xl font-semibold text-sm text-white transition-colors"
          style={{ backgroundColor: '#25D366' }}
        >
          <SiWhatsapp size={16} />
          WhatsApp
        </a>
      </div>
    </div>
  );
}
