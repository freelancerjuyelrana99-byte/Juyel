import React, { useState } from 'react';
import { Calendar, Percent, Activity, Tag, TrendingUp, DollarSign, CreditCard, Repeat, Coins } from 'lucide-react';

interface CalculatorToolsProps {
  slug: string;
}

export const CalculatorTools: React.FC<CalculatorToolsProps> = ({ slug }) => {
  // Age Calculator State
  const [birthDate, setBirthDate] = useState('2000-01-01');
  const [targetDate, setTargetDate] = useState(new Date().toISOString().split('T')[0]);

  // Percentage Calculator State
  const [pctX, setPctX] = useState(25);
  const [pctY, setPctY] = useState(200);

  // BMI State
  const [bmiWeight, setBmiWeight] = useState(70);
  const [bmiHeight, setBmiHeight] = useState(175);

  // Discount State
  const [discOriginal, setDiscOriginal] = useState(1500);
  const [discPercent, setDiscPercent] = useState(20);
  const [discTax, setDiscTax] = useState(5);

  // Profit/Loss State
  const [costPrice, setCostPrice] = useState(1000);
  const [sellPrice, setSellPrice] = useState(1350);

  // Salary State
  const [salaryHourly, setSalaryHourly] = useState(25);
  const [salaryHoursPerWeek, setSalaryHoursPerWeek] = useState(40);

  // Loan EMI State
  const [loanAmount, setLoanAmount] = useState(500000);
  const [loanRate, setLoanRate] = useState(9.5);
  const [loanTenureYears, setLoanTenureYears] = useState(5);

  // Currency Converter State
  const [currAmount, setCurrAmount] = useState(100);
  const [currFrom, setCurrFrom] = useState('USD');
  const [currTo, setCurrTo] = useState('BDT');

  // Rates approximation
  const currencyRates: Record<string, number> = {
    USD: 1.0,
    BDT: 118.5,
    EUR: 0.92,
    GBP: 0.78,
    INR: 83.5,
    CAD: 1.36,
    AUD: 1.52,
  };

  // Age calculation
  const calculateAge = () => {
    const birth = new Date(birthDate);
    const target = new Date(targetDate);
    if (isNaN(birth.getTime()) || isNaN(target.getTime())) return null;

    let years = target.getFullYear() - birth.getFullYear();
    let months = target.getMonth() - birth.getMonth();
    let days = target.getDate() - birth.getDate();

    if (days < 0) {
      months -= 1;
      const prevMonth = new Date(target.getFullYear(), target.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }

    const diffMs = target.getTime() - birth.getTime();
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const totalHours = totalDays * 24;

    // Next birthday
    const nextBday = new Date(target.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBday < target) nextBday.setFullYear(target.getFullYear() + 1);
    const daysUntilNext = Math.ceil((nextBday.getTime() - target.getTime()) / (1000 * 60 * 60 * 24));

    return { years, months, days, totalDays, totalHours, daysUntilNext };
  };

  // BMI Calculation
  const calculateBMI = () => {
    const hM = bmiHeight / 100;
    const bmi = bmiWeight / (hM * hM);
    let category = 'Normal weight';
    let color = 'text-emerald-400';
    if (bmi < 18.5) {
      category = 'Underweight';
      color = 'text-cyan-400';
    } else if (bmi >= 25 && bmi < 30) {
      category = 'Overweight';
      color = 'text-amber-400';
    } else if (bmi >= 30) {
      category = 'Obesity';
      color = 'text-rose-400';
    }
    return { bmi: bmi.toFixed(1), category, color };
  };

  // Loan EMI Calculation
  const calculateEMI = () => {
    const p = loanAmount;
    const r = loanRate / 12 / 100;
    const n = loanTenureYears * 12;
    const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayable = emi * n;
    const totalInterest = totalPayable - p;
    return {
      monthlyEMI: Math.round(emi),
      totalInterest: Math.round(totalInterest),
      totalPayable: Math.round(totalPayable),
    };
  };

  const ageData = calculateAge();
  const bmiData = calculateBMI();
  const emiData = calculateEMI();

  // Render Age Calculator
  if (slug === 'age-calculator') {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1.5">Date of Birth</label>
            <input
              type="date"
              value={birthDate}
              onChange={e => setBirthDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1.5">Age at the Date of</label>
            <input
              type="date"
              value={targetDate}
              onChange={e => setTargetDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm"
            />
          </div>
        </div>

        {ageData && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-cyan-500/30 text-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Your Exact Age
              </span>
              <div className="text-3xl font-black text-cyan-400 font-mono">
                {ageData.years} <span className="text-sm font-normal text-slate-400">Years</span>
              </div>
              <div className="text-xs text-slate-400 mt-2 font-medium">
                {ageData.months} Months, {ageData.days} Days
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-indigo-500/30 text-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Next Birthday Countdown
              </span>
              <div className="text-3xl font-black text-indigo-400 font-mono">
                {ageData.daysUntilNext} <span className="text-sm font-normal text-slate-400">Days</span>
              </div>
              <div className="text-xs text-slate-400 mt-2">Until your next celebration</div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-purple-500/30 text-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Total Lifetime
              </span>
              <div className="text-2xl font-black text-purple-400 font-mono">
                {ageData.totalDays.toLocaleString()} <span className="text-xs font-normal text-slate-400">Days</span>
              </div>
              <div className="text-xs text-slate-400 mt-2 font-mono">
                {ageData.totalHours.toLocaleString()} Total Hours
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Render BMI Calculator
  if (slug === 'bmi-calculator') {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1.5">Weight (kg)</label>
            <input
              type="number"
              value={bmiWeight}
              onChange={e => setBmiWeight(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm font-mono"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1.5">Height (cm)</label>
            <input
              type="number"
              value={bmiHeight}
              onChange={e => setBmiHeight(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm font-mono"
            />
          </div>
        </div>

        <div className="p-8 rounded-2xl bg-slate-900/80 border border-cyan-500/30 text-center max-w-lg mx-auto space-y-4">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Your Body Mass Index (BMI)
          </span>
          <div className="text-5xl font-black text-white font-mono">{bmiData.bmi}</div>
          <div className={`text-lg font-bold ${bmiData.color}`}>{bmiData.category}</div>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Standard WHO classification: Underweight (&lt;18.5), Normal (18.5–24.9), Overweight (25–29.9), Obese (30+)
          </p>
        </div>
      </div>
    );
  }

  // Render Loan & EMI Calculator
  if (slug === 'loan-emi-calculator') {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1.5">Loan Amount (৳ / $)</label>
            <input
              type="number"
              value={loanAmount}
              onChange={e => setLoanAmount(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm font-mono"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1.5">Interest Rate (% p.a.)</label>
            <input
              type="number"
              step="0.1"
              value={loanRate}
              onChange={e => setLoanRate(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm font-mono"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1.5">Tenure (Years)</label>
            <input
              type="number"
              value={loanTenureYears}
              onChange={e => setLoanTenureYears(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-cyan-500/30 text-center">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Monthly EMI</span>
            <div className="text-3xl font-black text-cyan-400 font-mono">৳ {emiData.monthlyEMI.toLocaleString()}</div>
          </div>
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-amber-500/30 text-center">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Total Interest</span>
            <div className="text-2xl font-black text-amber-400 font-mono">৳ {emiData.totalInterest.toLocaleString()}</div>
          </div>
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-emerald-500/30 text-center">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Total Payment</span>
            <div className="text-2xl font-black text-emerald-400 font-mono">৳ {emiData.totalPayable.toLocaleString()}</div>
          </div>
        </div>
      </div>
    );
  }

  // Default: Percentage & General Financial Calculator
  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <h4 className="text-sm font-bold text-white uppercase tracking-wider">What is X% of Y?</h4>
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm text-slate-400">What is</span>
          <input
            type="number"
            value={pctX}
            onChange={e => setPctX(Number(e.target.value))}
            className="w-24 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm font-mono"
          />
          <span className="text-sm text-slate-400">% of</span>
          <input
            type="number"
            value={pctY}
            onChange={e => setPctY(Number(e.target.value))}
            className="w-32 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm font-mono"
          />
          <span className="text-sm text-slate-400">=</span>
          <span className="text-2xl font-black text-cyan-400 font-mono px-3 py-1 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
            {((pctX / 100) * pctY).toFixed(2)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Currency Converter */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <Coins className="w-4 h-4 text-cyan-400" /> Currency Converter
          </h4>
          <div className="grid grid-cols-3 gap-2">
            <input
              type="number"
              value={currAmount}
              onChange={e => setCurrAmount(Number(e.target.value))}
              className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm font-mono"
            />
            <select
              value={currFrom}
              onChange={e => setCurrFrom(e.target.value)}
              className="px-2 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
            >
              {Object.keys(currencyRates).map(k => (
                <option key={k} value={k}>{k}</option>
              ))}
            </select>
            <select
              value={currTo}
              onChange={e => setCurrTo(e.target.value)}
              className="px-2 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
            >
              {Object.keys(currencyRates).map(k => (
                <option key={k} value={k}>{k}</option>
              ))}
            </select>
          </div>
          <div className="pt-2 text-center p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-xs text-slate-400 block mb-1">Converted Value</span>
            <span className="text-2xl font-black text-cyan-400 font-mono">
              {((currAmount / currencyRates[currFrom]) * currencyRates[currTo]).toFixed(2)} {currTo}
            </span>
          </div>
        </div>

        {/* Discount Calculator */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <Tag className="w-4 h-4 text-emerald-400" /> Discount Calculator
          </h4>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Price (৳)</label>
              <input
                type="number"
                value={discOriginal}
                onChange={e => setDiscOriginal(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs font-mono"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Discount (%)</label>
              <input
                type="number"
                value={discPercent}
                onChange={e => setDiscPercent(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs font-mono"
              />
            </div>
          </div>
          <div className="pt-2 text-center p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-xs text-slate-400 block mb-1">Final Price (Savings: ৳{(discOriginal * (discPercent / 100)).toFixed(0)})</span>
            <span className="text-2xl font-black text-emerald-400 font-mono">
              ৳ {(discOriginal * (1 - discPercent / 100)).toFixed(0)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
