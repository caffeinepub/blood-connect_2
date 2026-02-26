import EligibilityQuestionnaire from '../components/EligibilityQuestionnaire';
import { Activity } from 'lucide-react';

export default function EligibilityPage() {
  return (
    <div className="px-4 py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-foreground">Eligibility Checker</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Find out if you are eligible to donate blood
        </p>
      </div>

      <div className="bg-secondary rounded-2xl p-4 flex items-start gap-3">
        <Activity size={20} className="text-primary shrink-0 mt-0.5" />
        <div className="text-sm text-muted-foreground space-y-1">
          <p className="font-semibold text-foreground">How it works</p>
          <p>Answer 4 simple questions about your health. Our checker will tell you if you can donate blood today.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-border shadow-card p-5">
        <EligibilityQuestionnaire />
      </div>
    </div>
  );
}
