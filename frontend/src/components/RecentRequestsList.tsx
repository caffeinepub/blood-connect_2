import { EmergencyRequest } from '../backend';
import { formatBloodGroup, timeAgo } from '../lib/bloodGroup';
import { AlertTriangle, MapPin, Clock } from 'lucide-react';

interface RecentRequestsListProps {
  requests: EmergencyRequest[];
}

export default function RecentRequestsList({ requests }: RecentRequestsListProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <AlertTriangle size={18} className="text-primary" />
        <h3 className="text-lg font-bold">Recent Emergency Requests</h3>
      </div>
      {requests.length === 0 ? (
        <div className="text-center py-6 text-muted-foreground bg-secondary rounded-2xl">
          <p className="text-base">No emergency requests yet.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {requests.map((req, i) => (
            <div key={i} className="bg-white border border-border rounded-xl p-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <span className="text-sm font-black text-primary">
                  {formatBloodGroup(req.bloodGroup)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-foreground truncate">{req.requester}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin size={11} /> {req.city}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={11} /> {timeAgo(req.timestamp)}
                  </span>
                </div>
              </div>
              <span className="shrink-0 text-xs font-bold text-primary bg-red-50 border border-red-200 rounded-full px-2 py-0.5">
                URGENT
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
