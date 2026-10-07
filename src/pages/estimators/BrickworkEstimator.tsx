import React, { useState } from 'react';

export default function BrickworkEstimator() {
  const [length, setLength] = useState<number>(20);
  const [height, setHeight] = useState<number>(10);
  const [thickness, setThickness] = useState<number>(9); // 9 or 4.5 inches
  const [doors, setDoors] = useState<number>(1);
  const [windows, setWindows] = useState<number>(2);
  const [ratePerBrick, setRatePerBrick] = useState<number>(8);
  const [cementBagRate, setCementBagRate] = useState<number>(400);
  const [sandBagRate, setSandBagRate] = useState<number>(50);

  // 1. Real-life Area Calculations
  const grossArea = length * height;
  const doorArea = doors * 21; // Standard door size ~21 sq ft
  const windowArea = windows * 7.75; // Standard window size ~7.75 sq ft
  const totalDeductions = doorArea + windowArea;
  const netWallArea = Math.max(0, grossArea - totalDeductions);

  // 2. Real-life Material Calculations
  const brickFactor = thickness === 9 ? 13.5 : 6.75;
  const totalBricks = Math.round(netWallArea * brickFactor * 1.05);

  // Dry mortar volume calculation (~0.4 cft per sq ft for 9" wall, ~0.2 cft for 4.5")
  const dryMortarCft = netWallArea * (thickness === 9 ? 0.4 : 0.2);

  // Cement (1:4 mix ratio, sum = 5). 1 bag of cement = 1.25 cft.
  const cementBags = Math.round(((dryMortarCft * (1 / 5)) / 1.25) * 10) / 10;

  // Sand (1:4 mix ratio, sum = 5)
  const sandCft = Math.round((dryMortarCft * (4 / 5)) * 10) / 10;

  // 3. Cost Calculations
  const brickCost = totalBricks * ratePerBrick;
  const cementCost = cementBags * cementBagRate;
  const sandCost = sandCft * sandBagRate;
  const totalEstimatedCost = Math.round(brickCost + cementCost + sandCost);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-orange-100/60 grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column: Structured Input Grid */}
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Brickwork Parameters</h2>
            <p className="text-xs text-slate-400 mt-0.5">Configure dimensions, thickness, and openings</p>
          </div>

          <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-200">
            <div className="grid grid-cols-2 divide-x divide-slate-200">
              <div className="p-3.5 bg-slate-50/50">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Length (ft)</label>
                <input type="number" value={length} onChange={(e) => setLength(Number(e.target.value))} className="w-full bg-transparent font-semibold text-slate-800 focus:outline-none text-sm" />
              </div>
              <div className="p-3.5 bg-slate-50/50">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Height (ft)</label>
                <input type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))} className="w-full bg-transparent font-semibold text-slate-800 focus:outline-none text-sm" />
              </div>
            </div>

            <div className="grid grid-cols-3 divide-x divide-slate-200">
              <div className="p-3.5 bg-slate-50/50">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Thickness</label>
                <select value={thickness} onChange={(e) => setThickness(Number(e.target.value))} className="w-full bg-transparent font-semibold text-slate-800 focus:outline-none text-sm">
                  <option value={9}>9 inches</option>
                  <option value={4.5}>4.5 inches</option>
                </select>
              </div>
              <div className="p-3.5 bg-slate-50/50">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Doors Count</label>
                <input type="number" value={doors} onChange={(e) => setDoors(Number(e.target.value))} className="w-full bg-transparent font-semibold text-slate-800 focus:outline-none text-sm" />
              </div>
              <div className="p-3.5 bg-slate-50/50">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Windows Count</label>
                <input type="number" value={windows} onChange={(e) => setWindows(Number(e.target.value))} className="w-full bg-transparent font-semibold text-slate-800 focus:outline-none text-sm" />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Material Rates</h3>
            <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-200">
              <div className="grid grid-cols-3 divide-x divide-slate-200">
                <div className="p-3.5 bg-slate-50/50">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Brick Rate (₹)</label>
                  <input type="number" value={ratePerBrick} onChange={(e) => setRatePerBrick(Number(e.target.value))} className="w-full bg-transparent font-semibold text-slate-800 focus:outline-none text-sm" />
                </div>
                <div className="p-3.5 bg-slate-50/50">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Cement Rate (₹)</label>
                  <input type="number" value={cementBagRate} onChange={(e) => setCementBagRate(Number(e.target.value))} className="w-full bg-transparent font-semibold text-slate-800 focus:outline-none text-sm" />
                </div>
                <div className="p-3.5 bg-slate-50/50">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Sand Rate (₹)</label>
                  <input type="number" value={sandBagRate} onChange={(e) => setSandBagRate(Number(e.target.value))} className="w-full bg-transparent font-semibold text-slate-800 focus:outline-none text-sm" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Calculated Results & Formulas */}
        <div className="space-y-6 flex flex-col justify-between bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-800 border-b border-slate-200 pb-3">Calculated Results & Formulas</h2>
            <div className="space-y-4 pt-4 text-sm">
              <div>
                <div className="flex justify-between font-semibold text-slate-700"><span>Gross Wall Area:</span><span>{grossArea.toFixed(2)} sq ft</span></div>
                <p className="text-[11px] text-slate-400 mt-0.5">[Formula: Length × Height]</p>
              </div>
              <div>
                <div className="flex justify-between font-semibold text-slate-700"><span>Openings Deductions:</span><span>{totalDeductions.toFixed(2)} sq ft</span></div>
                <p className="text-[11px] text-slate-400 mt-0.5">[Formula: (Doors × 21) + (Windows × 7.75)]</p>
              </div>
              <div>
                <div className="flex justify-between font-semibold text-slate-700"><span>Net Wall Area:</span><span>{netWallArea.toFixed(2)} sq ft</span></div>
                <p className="text-[11px] text-slate-400 mt-0.5">[Formula: Gross Area - Openings Deductions]</p>
              </div>
              <div>
                <div className="flex justify-between font-bold text-orange-600 text-base"><span>Total Bricks Required:</span><span>{totalBricks.toLocaleString()} bricks</span></div>
                <p className="text-[11px] text-slate-400 mt-0.5">[Formula: Net Area × {brickFactor} × 1.05 wastage]</p>
              </div>
              <div>
                <div className="flex justify-between font-semibold text-slate-700"><span>Cement Quantity (1:4):</span><span>{cementBags} bags</span></div>
                <p className="text-[11px] text-slate-400 mt-0.5">[Formula: Dry Mortar × (1/5) / 1.25 cft per bag]</p>
              </div>
              <div>
                <div className="flex justify-between font-semibold text-slate-700"><span>Sand Quantity (1:4):</span><span>{sandCft} cft</span></div>
                <p className="text-[11px] text-slate-400 mt-0.5">[Formula: Dry Mortar × (4/5)]</p>
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