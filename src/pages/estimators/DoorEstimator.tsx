import { useState } from 'react';
import { calculateDoor } from '../../lib/calculations';

export default function DoorEstimatorUI() {
  const [width, setWidth] = useState<number>(36);
  const [height, setHeight] = useState<number>(80);
  const [quantity, setQuantity] = useState<number>(1);
  const [frameType, setFrameType] = useState<string>('Standard');
  const [shutterType, setShutterType] = useState<string>('panelled');
  const [materialType, setMaterialType] = useState<string>('teak');
  const [thickness, setThickness] = useState<number>(3);
  const [timberWidth, setTimberWidth] = useState<number>(4);
  const [widthUnit, setWidthUnit] = useState<string>('in');
  const [thicknessUnit, setThicknessUnit] = useState<string>('in');

  const results = calculateDoor({
    width,
    height,
    quantity,
    frame_type: frameType,
    shutter_type: shutterType,
    material_type: materialType,
    thickness,
    timber_width: timberWidth,
    width_unit: widthUnit,
    thickness_unit: thicknessUnit,
  });

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-xl grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* INPUT FORM SECTION */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-800 border-b pb-2">Door Parameters</h2>

        <div className="grid grid-cols-3 gap-2">
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
          <div>
            <label className="block text-xs font-semibold text-gray-600">Quantity</label>
            <input 
              type="number" 
              value={quantity} 
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500" 
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600">Width Unit</label>
            <select 
              value={widthUnit} 
              onChange={(e) => setWidthUnit(e.target.value)}
              className="w-full mt-1 p-2 border rounded-lg bg-white"
            >
              <option value="in">Inches (in)</option>
              <option value="ft">Feet (ft)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600">Material Type</label>
            <select 
              value={materialType} 
              onChange={(e) => setMaterialType(e.target.value)}
              className="w-full mt-1 p-2 border rounded-lg bg-white"
            >
              <option value="teak">Teak</option>
              <option value="sal">Sal</option>
              <option value="mango">Mango</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600">Shutter Type</label>
            <select 
              value={shutterType} 
              onChange={(e) => setShutterType(e.target.value)}
              className="w-full mt-1 p-2 border rounded-lg bg-white"
            >
              <option value="panelled">Panelled</option>
              <option value="flush">Flush</option>
              <option value="glazed">Glazed</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600">Frame Type</label>
            <input 
              type="text" 
              value={frameType} 
              onChange={(e) => setFrameType(e.target.value)}
              className="w-full mt-1 p-2 border rounded-lg" 
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="block text-[11px] font-semibold text-gray-600">Thickness (in)</label>
            <input type="number" value={thickness} onChange={(e) => setThickness(Number(e.target.value))} className="w-full mt-1 p-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-gray-600">Timber Width (in)</label>
            <input type="number" value={timberWidth} onChange={(e) => setTimberWidth(Number(e.target.value))} className="w-full mt-1 p-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-gray-600">Thickness Unit</label>
            <select 
              value={thicknessUnit} 
              onChange={(e) => setThicknessUnit(e.target.value)}
              className="w-full mt-1 p-2 border rounded-lg bg-white text-xs"
            >
              <option value="in">Inches</option>
              <option value="ft">Feet</option>
            </select>
          </div>
        </div>
      </div>

      {/* RESULTS DISPLAY & FORMULA BREAKDOWN SECTION */}
      <div className="bg-gray-50 p-6 rounded-xl flex flex-col justify-between border">
        <div>
          <h2 className="text-xl font-bold text-gray-800 border-b pb-2 mb-4">Calculated Results & Formulas</h2>
          
          <div className="space-y-3 text-sm">
            <div className="flex justify-between border-b pb-1">
              <span className="text-gray-600">Total Door Area:</span>
              <span className="font-semibold text-gray-900">{results.door_area.toFixed(2)} sq ft</span>
            </div>
            <p className="text-[11px] text-gray-500 italic">[Formula: Width Ft x Height Ft x Quantity]</p>

            <div className="flex justify-between border-b pb-1 pt-2">
              <span className="text-gray-600">Total Frame Length:</span>
              <span className="font-semibold text-gray-900">{results.frame_length.toFixed(2)} ft</span>
            </div>
            <p className="text-[11px] text-gray-500 italic">[Formula: (Head + 2 Posts) x Quantity]</p>

            <div className="flex justify-between border-b pb-1 pt-2">
              <span className="text-gray-600">Total Timber Quantity:</span>
              <span className="font-semibold text-gray-900">{results.timber_quantity.toFixed(2)} cft</span>
            </div>
            <p className="text-[11px] text-gray-500 italic">[Formula: Frame Length Ft x Thickness x Width over 144]</p>

            <div className="flex justify-between border-b pb-1 pt-2">
              <span className="text-gray-600">Material Cost:</span>
              <span className="font-semibold text-gray-900">₹{results.material_cost.toFixed(0)}</span>
            </div>
            <p className="text-[11px] text-gray-500 italic">[Formula: Frame Timber Cost + Shutter Cost]</p>

            <div className="flex justify-between border-b pb-1 pt-2">
              <span className="text-gray-600">Labor Cost:</span>
              <span className="font-semibold text-gray-900">₹{results.labor_cost.toFixed(0)}</span>
            </div>
            <p className="text-[11px] text-gray-500 italic">[Formula: Total Area sq ft x 150]</p>
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