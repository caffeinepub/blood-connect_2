import { EmergencyRequest } from '../backend';
import { formatBloodGroup } from '../lib/bloodGroup';
import { AlertTriangle, MapPin, Clock } from 'lucide-react';

interface AdminEmergencyRequestsTableProps {
  requests: EmergencyRequest[];
}

function formatTimestamp(timestamp: bigint): string {
  const ms = Number(timestamp / BigInt(1_000_000));
  return new Date(ms).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function AdminEmergencyRequestsTable({ requests }: AdminEmergencyRequestsTableProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <AlertTriangle size={18} className="text-primary" />
        <h3 className="text-lg font-bold">Emergency Requests ({requests.length})</h3>
      </div>

      {requests.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground bg-secondary rounded-2xl">
          <p>No emergency requests yet.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {[...requests].reverse().map((req, i) => (
            <div key={i} className="bg-white border border-border rounded-xl p-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                  <span className="text-sm font-black text-primary">
                    {formatBloodGroup(req.bloodGroup)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold">{req.requester}</p>
                  <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground mt-0.5">
                    <span className="flex items-center gap-1">
                      <MapPin size={11} /> {req.city}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={11} /> {formatTimestamp(req.timestamp)}
                    </span>
                  </div>
                </div>
                <span className="shrink-0 text-xs font-bold text-primary bg-red-50 border border-red-200 rounded-full px-2 py-0.5">
                  SOS
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
