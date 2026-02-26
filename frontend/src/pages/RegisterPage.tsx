import { useNavigate } from '@tanstack/react-router';
import RegistrationForm from '../components/RegistrationForm';
import { ArrowLeft } from 'lucide-react';

export default function RegisterPage() {
  const navigate = useNavigate();

  return (
    <div className="px-4 py-6 space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate({ to: '/' })}
          className="p-2 rounded-xl hover:bg-secondary transition-colors min-h-touch flex items-center"
        >
          <ArrowLeft size={22} className="text-foreground" />
        </button>
        <div>
          <h1 className="text-2xl font-black text-foreground">Register</h1>
          <p className="text-sm text-muted-foreground">Join Blood Connect today</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-border shadow-card p-5">
        <RegistrationForm onSuccess={() => setTimeout(() => navigate({ to: '/' }), 2000)} />
      </div>

      <div className="bg-secondary rounded-2xl p-4 text-sm text-muted-foreground space-y-1">
        <p className="font-semibold text-foreground">Why register?</p>
        <p>🩸 Donors: Help save lives in your community</p>
        <p>🏥 Receivers: Find matching donors quickly</p>
        <p>🚨 Both: Use the SOS emergency button</p>
      </div>
    </div>
  );
}
