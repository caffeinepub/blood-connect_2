import { Users, TrendingUp } from 'lucide-react';

interface DashboardStatsProps {
  totalDonors: bigint;
}

export default function DashboardStats({ totalDonors }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="bg-primary rounded-2xl p-4 text-primary-foreground">
        <div className="flex items-center gap-2 mb-2">
          <Users size={20} />
          <span className="text-sm font-medium opacity-90">Total Donors</span>
        </div>
        <p className="text-4xl font-black">{totalDonors.toString()}</p>
        <p className="text-xs opacity-75 mt-1">Registered donors</p>
      </div>
      <div className="bg-secondary rounded-2xl p-4 border border-border">
        <div className="flex items-center gap-2 mb-2 text-primary">
          <TrendingUp size={20} />
          <span className="text-sm font-medium">Lives Saved</span>
        </div>
        <p className="text-4xl font-black text-primary">∞</p>
        <p className="text-xs text-muted-foreground mt-1">Every drop counts</p>
      </div>
    </div>
  );
}
