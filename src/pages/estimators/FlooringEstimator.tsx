import React, { useState } from 'react';

export default function FlooringEstimator() {
  const [length, setLength] = useState<number>(20);
  const [width, setWidth] = useState<number>(15);
  const [tileSize, setTileSize] = useState<number>(4); // e.g., 2x2 ft = 4 sq ft
  const [skirtingHeight, setSkirtingHeight] = useState<number>(0.5); // 6 inches
  const [tileRate, setTileRate] = useState<number>(60);
  const [cementRate, setCementRate] = useState<number>(350);
  const [sandRate, setSandRate] = useState<number>(45);

  // 1. Area Calculations
  const floorArea = length * width;
  const perimeter = 2 * (length + width);
  const skirtingArea = perimeter * skirtingHeight;
  const grossArea = floorArea + skirtingArea;
  const totalAreaWithWastage = grossArea * 1.05; // 5% wastage

  // 2. Material Calculations
  const totalTiles = Math.ceil(totalAreaWithWastage / tileSize);

  // Mortar bed for flooring (~1 inch thickness = 1/12 ft)
  const wetMortarCft = floorArea * (1 / 12);
  const dryMortarCft = wetMortarCft * 1.54;
  const cementBags = Math.round(((dryMortarCft * (1 / 5)) / 1.25) * 10) / 10;
  const sandCft = Math.round((dryMortarCft * (4 / 5)) * 10) / 10;

  // 3. Cost Calculations
  const tileCost = totalAreaWithWastage * tileRate;
  const cementCost = cementBags * cementRate;
  const sandCost = sandCft * sandRate;
  const totalEstimatedCost = Math.round(tileCost + cementCost + sandCost);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-orange-100/60 grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column: Structured Input Grid */}
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Flooring Parameters</h2>
            <p className="text-xs text-slate-400 mt-0.5">Configure room dimensions, tile specs, and skirting</p>
          </div>

          <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-200">
            <div className="grid grid-cols-2 divide-x divide-slate-200">
              <div className="p-3.5 bg-slate-50/50">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Room Length (ft)</label>
                <input type="number" value={length} onChange={(e) => setLength(Number(e.target.value))} className="w-full bg-transparent font-semibold text-slate-800 focus:outline-none text-sm" />
              </div>
              <div className="p-3.5 bg-slate-50/50">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Room Width (ft)</label>
                <input type="number" value={width} onChange={(e) => setWidth(Number(e.target.value))} className="w-full bg-transparent font-semibold text-slate-800 focus:outline-none text-sm" />
              </div>
            </div>

            <div className="grid grid-cols-2 divide-x divide-slate-200">
              <div className="p-3.5 bg-slate-50/50">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Tile Size Area (sq ft)</label>
                <select value={tileSize} onChange={(e) => setTileSize(Number(e.target.value))} className="w-full bg-transparent font-semibold text-slate-800 focus:outline-none text-sm">
                  <option value={1}>1x1 ft (1 sq ft)</option>
                  <option value={2.25}>1.5x1.5 ft (2.25 sq ft)</option>
                  <option value={4}>2x2 ft (4 sq ft)</option>
                  <option value={9}>3x3 ft (9 sq ft)</option>
                </select>
              </div>
              <div className="p-3.5 bg-slate-50/50">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Skirting Height (ft)</label>
                <input type="number" step="0.1" value={skirtingHeight} onChange={(e) => setSkirtingHeight(Number(e.target.value))} className="w-full bg-transparent font-semibold text-slate-800 focus:outline-none text-sm" />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Material Rates</h3>
            <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-200">
              <div className="grid grid-cols-3 divide-x divide-slate-200">
                <div className="p-3.5 bg-slate-50/50">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Tile Rate (₹/sq ft)</label>
                  <input type="number" value={tileRate} onChange={(e) => setTileRate(Number(e.target.value))} className="w-full bg-transparent font-semibold text-slate-800 focus:outline-none text-sm" />
                </div>
                <div className="p-3.5 bg-slate-50/50">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Cement Rate (₹/bag)</label>
                  <input type="number" value={cementRate} onChange={(e) => setCementRate(Number(e.target.value))} className="w-full bg-transparent font-semibold text-slate-800 focus:outline-none text-sm" />
                </div>
                <div className="p-3.5 bg-slate-50/50">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Sand Rate (₹/cft)</label>
                  <input type="number" value={sandRate} onChange={(e) => setSandRate(Number(e.target.value))} className="w-full bg-transparent font-semibold text-slate-800 focus:outline-none text-sm" />
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
                <div className="flex justify-between font-semibold text-slate-700"><span>Floor Area:</span><span>{floorArea.toFixed(2)} sq ft</span></div>
                <p className="text-[11px] text-slate-400 mt-0.5">[Formula: Length × Width]</p>
              </div>
              <div>
                <div className="flex justify-between font-semibold text-slate-700"><span>Skirting Area:</span><span>{skirtingArea.toFixed(2)} sq ft</span></div>
                <p className="text-[11px] text-slate-400 mt-0.5">[Formula: Perimeter × Skirting Height]</p>
              </div>
              <div>
                <div className="flex justify-between font-semibold text-slate-700"><span>Total Area (w/ 5% Wastage):</span><span>{totalAreaWithWastage.toFixed(2)} sq ft</span></div>
                <p className="text-[11px] text-slate-400 mt-0.5">[Formula: (Floor + Skirting) × 1.05]</p>
              </div>
              <div>
                <div className="flex justify-between font-bold text-orange-600 text-base"><span>Total Tiles Required:</span><span>{totalTiles} tiles</span></div>
                <p className="text-[11px] text-slate-400 mt-0.5">[Formula: Total Area / Tile Size Area]</p>
              </div>
              <div>
                <div className="flex justify-between font-semibold text-slate-700"><span>Bedding Cement (1:4):</span><span>{cementBags} bags</span></div>
                <p className="text-[11px] text-slate-400 mt-0.5">[Formula: Dry Mortar (1 inch bed) × (1/5) / 1.25]</p>
              </div>
              <div>
                <div className="flex justify-between font-semibold text-slate-700"><span>Bedding Sand (1:4):</span><span>{sandCft} cft</span></div>
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