import React, { useState } from 'react';

export default function PaintingEstimator() {
  const [length, setLength] = useState<number>(20);
  const [height, setHeight] = useState<number>(10);
  const [coatsCount, setCoatsCount] = useState<number>(2);
  const [doors, setDoors] = useState<number>(1);
  const [windows, setWindows] = useState<number>(2);
  
  const [paintRate, setPaintRate] = useState<number>(250); // ₹ per liter
  const [primerRate, setPrimerRate] = useState<number>(180); // ₹ per liter

  // 1. Professional Civil Engineering Area Calculations
  const grossWallArea = length * height;
  
  // Standard IS code deduction sizes: Door = 21 sq ft (3'x7'), Window = 15 sq ft (3'x5')
  const doorArea = doors * 21; 
  const windowArea = windows * 15; 
  const totalDeductions = doorArea + windowArea;
  
  const netPaintableArea = Math.max(0, grossWallArea - totalDeductions);

  // 2. Industry Standard Material Thumb Rules
  // Primer (1 coat standard): ~200 sq ft per liter coverage
  const primerLitres = Math.ceil(netPaintableArea / 200);
  
  // Emulsion Paint: ~100 sq ft per liter per coat, scaled dynamically by coatsCount
  const paintLitres = Math.ceil((netPaintableArea * coatsCount) / 100);

  // 3. Cost Calculations
  const primerCost = primerLitres * primerRate;
  const paintCost = paintLitres * paintRate;
  const totalEstimatedCost = Math.round(primerCost + paintCost);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6 font-sans">
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-orange-100/60 grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column: Structured Input Grid */}
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Surface Parameters</h2>
            <p className="text-xs text-slate-400 mt-0.5">Configure wall dimensions, coats, and standard openings</p>
          </div>

          <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-200">
            <div className="grid grid-cols-3 divide-x divide-slate-200">
              <div className="p-3.5 bg-slate-50/50">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Length (ft)</label>
                <input type="number" value={length} onChange={(e) => setLength(Number(e.target.value))} className="w-full bg-transparent font-semibold text-slate-800 focus:outline-none text-sm" />
              </div>
              <div className="p-3.5 bg-slate-50/50">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Height (ft)</label>
                <input type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))} className="w-full bg-transparent font-semibold text-slate-800 focus:outline-none text-sm" />
              </div>
              <div className="p-3.5 bg-slate-50/50">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Coats Count</label>
                <input type="number" value={coatsCount} onChange={(e) => setCoatsCount(Number(e.target.value))} className="w-full bg-transparent font-semibold text-slate-800 focus:outline-none text-sm" />
              </div>
            </div>

            <div className="grid grid-cols-2 divide-x divide-slate-200">
              <div className="p-3.5 bg-slate-50/50">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Doors Count (21 sq ft ea)</label>
                <input type="number" value={doors} onChange={(e) => setDoors(Number(e.target.value))} className="w-full bg-transparent font-semibold text-slate-800 focus:outline-none text-sm" />
              </div>
              <div className="p-3.5 bg-slate-50/50">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Windows Count (15 sq ft ea)</label>
                <input type="number" value={windows} onChange={(e) => setWindows(Number(e.target.value))} className="w-full bg-transparent font-semibold text-slate-800 focus:outline-none text-sm" />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Material Rates</h3>
            <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-200">
              <div className="grid grid-cols-2 divide-x divide-slate-200">
                <div className="p-3.5 bg-slate-50/50">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Paint Rate (₹/liter)</label>
                  <input type="number" value={paintRate} onChange={(e) => setPaintRate(Number(e.target.value))} className="w-full bg-transparent font-semibold text-slate-800 focus:outline-none text-sm" />
                </div>
                <div className="p-3.5 bg-slate-50/50">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Primer Rate (₹/liter)</label>
                  <input type="number" value={primerRate} onChange={(e) => setPrimerRate(Number(e.target.value))} className="w-full bg-transparent font-semibold text-slate-800 focus:outline-none text-sm" />
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
                <div className="flex justify-between font-semibold text-slate-700">
                  <span>Gross Wall Area:</span>
                  <span>{grossWallArea.toFixed(2)} sq ft</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">[Formula: Length × Height]</p>
              </div>

              <div>
                <div className="flex justify-between font-semibold text-slate-700">
                  <span>Openings Deductions:</span>
                  <span>{totalDeductions.toFixed(2)} sq ft</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">[Formula: (Doors × 21 sq ft) + (Windows × 15 sq ft)]</p>
              </div>

              <div>
                <div className="flex justify-between font-bold text-orange-600 text-base">
                  <span>Net Paintable Area:</span>
                  <span>{netPaintableArea.toFixed(2)} sq ft</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">[Formula: Gross Wall Area - Total Deductions]</p>
              </div>

              <div>
                <div className="flex justify-between font-semibold text-slate-700">
                  <span>Primer Quantity (1 Coat):</span>
                  <span>{primerLitres} litres</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">[Formula: Net Area / 200 sq ft per liter]</p>
              </div>

              <div>
                <div className="flex justify-between font-semibold text-slate-700">
                  <span>Paint Quantity ({coatsCount} Coats):</span>
                  <span>{paintLitres} litres</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">[Formula: (Net Area × Coats Count) / 100 sq ft per liter]</p>
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