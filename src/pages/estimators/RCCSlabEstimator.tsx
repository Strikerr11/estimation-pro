import React, { useState } from 'react';

export default function RCCSlabEstimator() {
  const [length, setLength] = useState<number>(20);
  const [width, setWidth] = useState<number>(15);
  const [thicknessInches, setThicknessInches] = useState<number>(6);
  const [cementBagRate, setCementBagRate] = useState<number>(400);
  const [sandRate, setSandRate] = useState<number>(50);
  const [aggregateRate, setAggregateRate] = useState<number>(60);
  const [steelRate, setSteelRate] = useState<number>(75);

  const thicknessFt = thicknessInches / 12;
  const wetVolumeCft = length * width * thicknessFt;
  const dryVolumeCft = wetVolumeCft * 1.54; 

  const ratioSum = 5.5;
  const cementCft = (dryVolumeCft * 1) / ratioSum;
  const cementBags = Math.ceil((cementCft / 1.25) * 10) / 10; 
  const sandCft = Math.round((dryVolumeCft * 1.5) / ratioSum * 10) / 10;
  const aggregateCft = Math.round((dryVolumeCft * 3) / ratioSum * 10) / 10;

  const totalWetVolumeCum = wetVolumeCft * 0.0283168;
  const steelWeightKg = Math.round(totalWetVolumeCum * 0.01 * 7850);

  const cementCost = cementBags * cementBagRate;
  const sandCost = sandCft * sandRate;
  const aggregateCost = aggregateCft * aggregateRate;
  const steelCost = steelWeightKg * steelRate;
  const totalEstimatedCost = Math.round(cementCost + sandCost + aggregateCost + steelCost);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-orange-100/60 grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column: Structured Input Grid */}
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Slab Parameters</h2>
            <p className="text-xs text-slate-400 mt-0.5">Configure dimensions and material rates</p>
          </div>

          <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-200">
            <div className="grid grid-cols-3 divide-x divide-slate-200">
              <div className="p-3.5 bg-slate-50/50">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Length (ft)</label>
                <input type="number" value={length} onChange={(e) => setLength(Number(e.target.value))} className="w-full bg-transparent font-semibold text-slate-800 focus:outline-none text-sm" />
              </div>
              <div className="p-3.5 bg-slate-50/50">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Width (ft)</label>
                <input type="number" value={width} onChange={(e) => setWidth(Number(e.target.value))} className="w-full bg-transparent font-semibold text-slate-800 focus:outline-none text-sm" />
              </div>
              <div className="p-3.5 bg-slate-50/50">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Thickness (in)</label>
                <input type="number" value={thicknessInches} onChange={(e) => setThicknessInches(Number(e.target.value))} className="w-full bg-transparent font-semibold text-slate-800 focus:outline-none text-sm" />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Material Rates</h3>
            <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-200">
              <div className="grid grid-cols-2 divide-x divide-slate-200">
                <div className="p-3.5 bg-slate-50/50">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Cement Rate (₹/bag)</label>
                  <input type="number" value={cementBagRate} onChange={(e) => setCementBagRate(Number(e.target.value))} className="w-full bg-transparent font-semibold text-slate-800 focus:outline-none text-sm" />
                </div>
                <div className="p-3.5 bg-slate-50/50">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Sand Rate (₹/cft)</label>
                  <input type="number" value={sandRate} onChange={(e) => setSandRate(Number(e.target.value))} className="w-full bg-transparent font-semibold text-slate-800 focus:outline-none text-sm" />
                </div>
              </div>
              <div className="grid grid-cols-2 divide-x divide-slate-200">
                <div className="p-3.5 bg-slate-50/50">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Aggregate Rate (₹/cft)</label>
                  <input type="number" value={aggregateRate} onChange={(e) => setAggregateRate(Number(e.target.value))} className="w-full bg-transparent font-semibold text-slate-800 focus:outline-none text-sm" />
                </div>
                <div className="p-3.5 bg-slate-50/50">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Steel Rate (₹/kg)</label>
                  <input type="number" value={steelRate} onChange={(e) => setSteelRate(Number(e.target.value))} className="w-full bg-transparent font-semibold text-slate-800 focus:outline-none text-sm" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Calculated Results & Formulas */}
        <div className="space-y-6 flex flex-col justify-between bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-800 border-b border-slate-200 pb-3">Calculated Results & Formulas</h2>
            <div className="space-y-3 pt-3 text-sm">
              <div>
                <div className="flex justify-between font-semibold text-slate-700"><span>Wet Concrete Volume:</span><span>{wetVolumeCft.toFixed(2)} cft</span></div>
                <p className="text-[11px] text-slate-400 mt-0.5">[Formula: Length $\times$ Width $\times$ Thickness]</p>
              </div>
              <div>
                <div className="flex justify-between font-semibold text-slate-700"><span>Dry Concrete Volume:</span><span>{dryVolumeCft.toFixed(2)} cft</span></div>
                <p className="text-[11px] text-slate-400 mt-0.5">[Formula: Wet Volume $\times$ 1.54 factor]</p>
              </div>
              <div>
                <div className="flex justify-between font-semibold text-slate-700"><span>Cement Quantity (1:1.5:3):</span><span>{cementBags} bags</span></div>
                <p className="text-[11px] text-slate-400 mt-0.5">[Formula: Dry Vol $\times$ (1/5.5) / 1.25 cft]</p>
              </div>
              <div>
                <div className="flex justify-between font-semibold text-slate-700"><span>Sand Quantity:</span><span>{sandCft} cft</span></div>
                <p className="text-[11px] text-slate-400 mt-0.5">[Formula: Dry Vol $\times$ (1.5/5.5)]</p>
              </div>
              <div>
                <div className="flex justify-between font-semibold text-slate-700"><span>Aggregate Quantity:</span><span>{aggregateCft} cft</span></div>
                <p className="text-[11px] text-slate-400 mt-0.5">[Formula: Dry Vol $\times$ (3/5.5)]</p>
              </div>
              <div>
                <div className="flex justify-between font-bold text-orange-600 text-base"><span>Steel Reinforcement:</span><span>{steelWeightKg.toLocaleString()} kg</span></div>
                <p className="text-[11px] text-slate-400 mt-0.5">[Formula: ~1% of wet volume weight]</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Estimated Cost</p>
              <p className="text-xl font-extrabold text-slate-900 mt-0.5">₹{totalEstimatedCost.toLocaleString()}</p>
            </div>
            <span className="bg-orange-50 text-orange-600 text-xs px-2.5 py-1 rounded-full font-semibold border border-orange-100">Live Engine</span>
          </div>
        </div>

      </div>
    </div>
  );
}