import { useState } from 'react';
import DonorSearchForm from '../components/DonorSearchForm';
import DonorResultCard from '../components/DonorResultCard';
import { BloodGroup } from '../backend';
import { useSmartDonorSearch } from '../hooks/useQueries';
import { formatBloodGroup } from '../lib/bloodGroup';
import { Skeleton } from '@/components/ui/skeleton';
import { Search } from 'lucide-react';

export default function DonorSearchPage() {
  const [searchParams, setSearchParams] = useState<{ bloodGroup: BloodGroup; city: string } | null>(null);
  const { data: donors, isLoading, isFetched } = useSmartDonorSearch(
    searchParams?.bloodGroup ?? null,
    searchParams?.city ?? ''
  );

  const handleSearch = (bloodGroup: BloodGroup, city: string) => {
    setSearchParams({ bloodGroup, city });
  };

  return (
    <div className="px-4 py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-foreground">Find Donors</h1>
        <p className="text-sm text-muted-foreground mt-1">Search for blood donors near you</p>
      </div>

      <div className="bg-white rounded-3xl border border-border shadow-card p-5">
        <DonorSearchForm onSearch={handleSearch} isLoading={isLoading} />
      </div>

      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-border p-4 space-y-3">
              <div className="flex items-center gap-3">
                <Skeleton className="w-12 h-12 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
          ))}
        </div>
      )}

      {!isLoading && isFetched && searchParams && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">
              {formatBloodGroup(searchParams.bloodGroup)} donors in {searchParams.city}
            </h2>
            <span className="text-sm text-muted-foreground bg-secondary rounded-full px-3 py-1">
              {donors?.length ?? 0} found
            </span>
          </div>

          {!donors || donors.length === 0 ? (
            <div className="text-center py-12 bg-secondary rounded-3xl space-y-3">
              <Search size={40} className="mx-auto text-muted-foreground" />
              <p className="text-base font-semibold text-muted-foreground">No donors found</p>
              <p className="text-sm text-muted-foreground">
                Try a different blood group or city name
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {donors.map((donor, i) => (
                <DonorResultCard key={i} donor={donor} />
              ))}
            </div>
          )}
        </div>
      )}

      {!searchParams && (
        <div className="text-center py-12 bg-secondary rounded-3xl space-y-3">
          <Search size={40} className="mx-auto text-muted-foreground" />
          <p className="text-base font-semibold text-muted-foreground">
            Enter blood group and city to search
          </p>
        </div>
      )}
    </div>
  );
}
