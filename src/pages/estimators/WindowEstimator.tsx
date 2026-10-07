import { useState } from 'react';
import { calculateWindow } from '../../lib/calculations';

export default function WindowEstimatorUI() {
  // [STATE: FORM INPUT PARAMETERS]
  const [width, setWidth] = useState<number>(48);
  const [height, setHeight] = useState<number>(60);
  const [unit, setUnit] = useState<'ft' | 'in' | 'm' | 'cm' | 'mm'>('in');
  const [numOpenings, setNumOpenings] = useState<number>(1);
  const [numMullions, setNumMullions] = useState<number>(1);
  const [numTransoms, setNumTransoms] = useState<number>(1);
  const [numSpecialTransoms, setNumSpecialTransoms] = useState<number>(0);
  const [specialTransomLength, setSpecialTransomLength] = useState<number>(0);
  const [numSpecialMullions, setNumSpecialMullions] = useState<number>(0);
  const [specialMullionLength, setSpecialMullionLength] = useState<number>(0);
  const [numHorns, setNumHorns] = useState<number>(4);
  const [hornLength, setHornLength] = useState<number>(3);
  const [timberThickness, setTimberThickness] = useState<number>(3);
  const [timberWidth, setTimberWidth] = useState<number>(4);
  const [materialRate, setMaterialRate] = useState<number>(2800);

  // [EXECUTE CALCULATION ENGINE]
  const results = calculateWindow({
    width,
    height,
    unit,
    num_openings: numOpenings,
    num_mullions: numMullions,
    num_transoms: numTransoms,
    num_special_transoms: numSpecialTransoms,
    special_transom_length: specialTransomLength,
    num_special_mullions: numSpecialMullions,
    special_mullion_length: specialMullionLength,
    num_horns: numHorns,
    horn_length: hornLength,
    timber_thickness: timberThickness,
    timber_width: timberWidth,
    material_rate: materialRate,
  });

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-xl grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* INPUT FORM SECTION */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-800 border-b pb-2">Window Parameters</h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600">Width</label>
            <input 
              type="number" 
              value={width} 
              onChange={(e) => setWidth(Number(e.target.value))}
              className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500" 
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600">Height</label>
            <input 
              type="number" 
              value={height} 
              onChange={(e) => setHeight(Number(e.target.value))}
              className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500" 
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600">Dimension Unit</label>
          <select 
            value={unit} 
            onChange={(e) => setUnit(e.target.value as any)}
            className="w-full mt-1 p-2 border rounded-lg bg-white"
          >
            <option value="in">Inches (in)</option>
            <option value="cm">Centimetres (cm)</option>
            <option value="ft">Feet (ft)</option>
            <option value="mm">Millimetres (mm)</option>
            <option value="m">Metres (m)</option>
          </select>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="block text-[11px] font-semibold text-gray-600">Openings</label>
            <input type="number" value={numOpenings} onChange={(e) => setNumOpenings(Number(e.target.value))} className="w-full mt-1 p-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-gray-600">Mullions</label>
            <input type="number" value={numMullions} onChange={(e) => setNumMullions(Number(e.target.value))} className="w-full mt-1 p-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-gray-600">Transoms</label>
            <input type="number" value={numTransoms} onChange={(e) => setNumTransoms(Number(e.target.value))} className="w-full mt-1 p-2 border rounded-lg" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-semibold text-gray-600">Special Transoms Count</label>
            <input type="number" value={numSpecialTransoms} onChange={(e) => setNumSpecialTransoms(Number(e.target.value))} className="w-full mt-1 p-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-gray-600">Special Transom Length (in)</label>
            <input type="number" value={specialTransomLength} onChange={(e) => setSpecialTransomLength(Number(e.target.value))} className="w-full mt-1 p-2 border rounded-lg" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-semibold text-gray-600">Special Mullions Count</label>
            <input type="number" value={numSpecialMullions} onChange={(e) => setNumSpecialMullions(Number(e.target.value))} className="w-full mt-1 p-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-gray-600">Special Mullion Length (in)</label>
            <input type="number" value={specialMullionLength} onChange={(e) => setSpecialMullionLength(Number(e.target.value))} className="w-full mt-1 p-2 border rounded-lg" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600">Horns Count</label>
            <input type="number" value={numHorns} onChange={(e) => setNumHorns(Number(e.target.value))} className="w-full mt-1 p-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600">Horn Length (in)</label>
            <input type="number" value={hornLength} onChange={(e) => setHornLength(Number(e.target.value))} className="w-full mt-1 p-2 border rounded-lg" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600">Timber Thickness (in)</label>
            <input type="number" value={timberThickness} onChange={(e) => setTimberThickness(Number(e.target.value))} className="w-full mt-1 p-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600">Timber Width (in)</label>
            <input type="number" value={timberWidth} onChange={(e) => setTimberWidth(Number(e.target.value))} className="w-full mt-1 p-2 border rounded-lg" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600">Material Rate (₹ / cft)</label>
          <input type="number" value={materialRate} onChange={(e) => setMaterialRate(Number(e.target.value))} className="w-full mt-1 p-2 border rounded-lg" />
        </div>
      </div>

      {/* RESULTS DISPLAY & FORMULA BREAKDOWN SECTION */}
      <div className="bg-gray-50 p-6 rounded-xl flex flex-col justify-between border">
        <div>
          <h2 className="text-xl font-bold text-gray-800 border-b pb-2 mb-4">Calculated Results & Formulas</h2>
          
          <div className="space-y-3 text-sm">
            <div className="flex justify-between border-b pb-1">
              <span className="text-gray-600">Total Window Area:</span>
              <span className="font-semibold text-gray-900">{results.total_area.toFixed(2)} sq ft</span>
            </div>
            <p className="text-[11px] text-gray-500 italic">[Formula: (Width In × Height In / 144) × Openings Count]</p>

            <div className="flex justify-between border-b pb-1 pt-2">
              <span className="text-gray-600">Net Glass Area:</span>
              <span className="font-semibold text-gray-900">{results.glass_area.toFixed(2)} sq ft</span>
            </div>
            <p className="text-[11px] text-gray-500 italic">[Formula: Total Area - Timber Frame Front Face Obstruction Area]</p>

            <div className="flex justify-between border-b pb-1 pt-2">
              <span className="text-gray-600">Total Frame Length:</span>
              <span className="font-semibold text-gray-900">{results.total_member_length.toFixed(2)} ft</span>
            </div>
            <p className="text-[11px] text-gray-500 italic">[Formula: (Head + Sill + Posts + Mullions + Transoms + Special Members + Horns) / 12]</p>

            <div className="flex justify-between border-b pb-1 pt-2">
              <span className="text-gray-600">Total Timber Quantity:</span>
              <span className="font-semibold text-gray-900">{results.total_timber_qty.toFixed(2)} cft</span>
            </div>
            <p className="text-[11px] text-gray-500 italic">[Formula: Frame Length Ft × Openings × ((Thickness × Width) / 144)]</p>

            <div className="flex justify-between border-b pb-1 pt-2">
              <span className="text-gray-600">Material Cost:</span>
              <span className="font-semibold text-gray-900">₹{results.material_cost.toFixed(0)}</span>
            </div>
            <p className="text-[11px] text-gray-500 italic">[Formula: Timber Qty cft × Material Rate]</p>

            <div className="flex justify-between border-b pb-1 pt-2">
              <span className="text-gray-600">Labor Cost:</span>
              <span className="font-semibold text-gray-900">₹{results.labor_cost.toFixed(0)}</span>
            </div>
            <p className="text-[11px] text-gray-500 italic">[Formula: Total Area sq ft × ₹150 fixed labor rate]</p>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t bg-blue-50 p-4 rounded-lg flex justify-between items-center">
          <span className="font-bold text-blue-900">Total Estimated Cost:</span>
          <span className="text-xl font-extrabold text-blue-700">₹{results.total_cost.toFixed(0)}</span>
        </div>
      </div>
    </div>
  );
}