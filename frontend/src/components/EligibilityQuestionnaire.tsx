import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { checkEligibility, formatDate, CONDITION_LABELS, HealthCondition } from '../utils/eligibilityChecker';
import { CheckCircle2, XCircle, ChevronRight, RotateCcw, Calendar } from 'lucide-react';

const HEALTH_CONDITIONS: HealthCondition[] = ['fever', 'surgery', 'pregnancy', 'medication', 'none'];
const TOTAL_STEPS = 4;

export default function EligibilityQuestionnaire() {
  const [step, setStep] = useState(1);
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [lastDonation, setLastDonation] = useState('');
  const [conditions, setConditions] = useState<HealthCondition[]>([]);
  const [result, setResult] = useState<ReturnType<typeof checkEligibility> | null>(null);
  const [errors, setErrors] = useState<string>('');

  const toggleCondition = (condition: HealthCondition) => {
    if (condition === 'none') {
      setConditions(['none']);
      return;
    }
    setConditions((prev) => {
      const withoutNone = prev.filter((c) => c !== 'none');
      if (withoutNone.includes(condition)) {
        return withoutNone.filter((c) => c !== condition);
      }
      return [...withoutNone, condition];
    });
  };

  const handleNext = () => {
    setErrors('');
    if (step === 1) {
      if (!age || isNaN(Number(age)) || Number(age) < 1 || Number(age) > 120) {
        setErrors('Please enter a valid age (1–120).');
        return;
      }
    }
    if (step === 2) {
      if (!weight || isNaN(Number(weight)) || Number(weight) < 1) {
        setErrors('Please enter a valid weight in kg.');
        return;
      }
    }
    if (step === 4) {
      if (conditions.length === 0) {
        setErrors('Please select at least one option.');
        return;
      }
      const res = checkEligibility({
        age: Number(age),
        weight: Number(weight),
        lastDonationDate: lastDonation ? new Date(lastDonation) : null,
        healthConditions: conditions,
      });
      setResult(res);
      return;
    }
    setStep((s) => s + 1);
  };

  const reset = () => {
    setStep(1);
    setAge('');
    setWeight('');
    setLastDonation('');
    setConditions([]);
    setResult(null);
    setErrors('');
  };

  if (result) {
    return (
      <div className="flex flex-col items-center gap-6 py-4">
        <div
          className={`w-24 h-24 rounded-full flex items-center justify-center ${
            result.eligible ? 'bg-green-100' : 'bg-red-100'
          }`}
        >
          {result.eligible ? (
            <CheckCircle2 size={48} className="text-green-600" />
          ) : (
            <XCircle size={48} className="text-primary" />
          )}
        </div>

        <div className="text-center space-y-2">
          <h2 className={`text-2xl font-black ${result.eligible ? 'text-green-700' : 'text-primary'}`}>
            {result.eligible ? '✅ Eligible to Donate!' : '❌ Not Eligible'}
          </h2>
          {result.reason && (
            <p className="text-base text-muted-foreground bg-secondary rounded-xl px-4 py-3">
              {result.reason}
            </p>
          )}
        </div>

        {result.nextDonationDate && (
          <div className="w-full bg-white border border-border rounded-2xl p-4 flex items-center gap-3">
            <Calendar size={24} className="text-primary shrink-0" />
            <div>
              <p className="text-sm text-muted-foreground">
                {result.eligible ? 'You can donate again after:' : 'Next eligible donation date:'}
              </p>
              <p className="text-base font-bold text-foreground">
                {formatDate(result.nextDonationDate)}
              </p>
            </div>
          </div>
        )}

        <Button
          onClick={reset}
          variant="outline"
          className="w-full min-h-touch text-base font-semibold border-primary text-primary"
        >
          <RotateCcw size={16} className="mr-2" />
          Check Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Step {step} of {TOTAL_STEPS}</span>
          <span>{Math.round((step / TOTAL_STEPS) * 100)}%</span>
        </div>
        <Progress value={(step / TOTAL_STEPS) * 100} className="h-2" />
      </div>

      {step === 1 && (
        <div className="space-y-4">
          <div className="text-center space-y-1">
            <p className="text-4xl">🎂</p>
            <h3 className="text-xl font-bold">What is your age?</h3>
            <p className="text-sm text-muted-foreground">Donors must be between 18–65 years old</p>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="eq-age">Age (years)</Label>
            <Input
              id="eq-age"
              type="number"
              placeholder="Enter your age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="min-h-touch text-xl text-center font-bold"
              min={1}
              max={120}
            />
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <div className="text-center space-y-1">
            <p className="text-4xl">⚖️</p>
            <h3 className="text-xl font-bold">What is your weight?</h3>
            <p className="text-sm text-muted-foreground">Minimum weight required is 50 kg</p>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="eq-weight">Weight (kg)</Label>
            <Input
              id="eq-weight"
              type="number"
              placeholder="Enter your weight in kg"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="min-h-touch text-xl text-center font-bold"
              min={1}
            />
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <div className="text-center space-y-1">
            <p className="text-4xl">🩸</p>
            <h3 className="text-xl font-bold">Last donation date?</h3>
            <p className="text-sm text-muted-foreground">Leave blank if you have never donated</p>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="eq-donation">Last Donation Date (optional)</Label>
            <Input
              id="eq-donation"
              type="date"
              value={lastDonation}
              onChange={(e) => setLastDonation(e.target.value)}
              className="min-h-touch text-base"
              max={new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-4">
          <div className="text-center space-y-1">
            <p className="text-4xl">🏥</p>
            <h3 className="text-xl font-bold">Current health conditions?</h3>
            <p className="text-sm text-muted-foreground">Select all that apply</p>
          </div>
          <div className="space-y-3">
            {HEALTH_CONDITIONS.map((condition) => (
              <label
                key={condition}
                className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-colors ${
                  conditions.includes(condition)
                    ? 'border-primary bg-secondary'
                    : 'border-border hover:border-primary/40'
                }`}
              >
                <Checkbox
                  checked={conditions.includes(condition)}
                  onCheckedChange={() => toggleCondition(condition)}
                  className="shrink-0"
                />
                <span className="text-base font-medium">{CONDITION_LABELS[condition]}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {errors && (
        <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">{errors}</p>
      )}

      <div className="flex gap-3">
        {step > 1 && (
          <Button
            variant="outline"
            onClick={() => setStep((s) => s - 1)}
            className="flex-1 min-h-touch text-base font-semibold"
          >
            Back
          </Button>
        )}
        <Button
          onClick={handleNext}
          className="flex-1 min-h-touch text-base font-bold bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {step === TOTAL_STEPS ? 'Check Eligibility' : (
            <>Next <ChevronRight size={18} className="ml-1" /></>
          )}
        </Button>
      </div>
    </div>
  );
}
