import { useState } from 'react';
import { useProject } from '../context/ProjectContext';
import { motion } from 'framer-motion';
import { BOQItem, BOQ } from '../types';
import { Plus, Trash2, FileDown, FileSpreadsheet, Save } from 'lucide-react';
import { exportBOQToPDF, exportBOQToExcel } from '../lib/exports';
import { formatCurrency } from '../lib/engine';

const emptyItem: BOQItem = { id: '', item_no: 0, item: '', description: '', unit: 'nos', quantity: 0, rate: 0, amount: 0 };

export default function BOQPage() {
  const { currentProject, estimates, saveBOQ } = useProject();
  const [items, setItems] = useState<BOQItem[]>([
    { id: '1', item_no: 1, item: 'Earth Work in Excavation', description: 'Excavation for foundation trenches', unit: 'cum', quantity: 0, rate: 250, amount: 0 },
    { id: '2', item_no: 2, item: 'P.C.C. (1:4:8)', description: 'Plain cement concrete in foundation', unit: 'cum', quantity: 0, rate: 4500, amount: 0 },
    { id: '3', item_no: 3, item: 'R.C.C. (1:2:4)', description: 'Reinforced cement concrete', unit: 'cum', quantity: 0, rate: 7500, amount: 0 },
    { id: '4', item_no: 4, item: 'Brick Work in C.M. (1:6)', description: 'Brick masonry in cement mortar', unit: 'cum', quantity: 0, rate: 5500, amount: 0 },
    { id: '5', item_no: 5, item: 'Plastering in C.M. (1:4)', description: 'Cement plaster 12mm thick', unit: 'sqm', quantity: 0, rate: 150, amount: 0 },
  ]);
  const [costs, setCosts] = useState({
    material_cost: 0, labor_cost: 0, transportation_cost: 0,
    machinery_cost: 0, miscellaneous: 0, tax_percent: 18,
  });

  const updateItem = (id: string, field: keyof BOQItem, value: string | number) => {
    setItems(prev => prev.map(item => {
      if (item.id !== id) return item;
      let normalized = value;
      if (typeof value === 'string' && (field === 'quantity' || field === 'rate' || field === 'item_no' || field === 'amount')) {
        const num = parseFloat(value);
        if (!isNaN(num) && value !== '' && value !== '-') normalized = num;
      }
      const updated = { ...item, [field]: normalized };
      if (field === 'quantity' || field === 'rate') {
        updated.amount = Number(updated.quantity) * Number(updated.rate);
      }
      return updated;
    }));
  };

  const addItem = () => {
    const newId = String(items.length + 1);
    setItems(prev => [...prev, { ...emptyItem, id: newId, item_no: prev.length + 1 }]);
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id).map((item, idx) => ({ ...item, item_no: idx + 1 })));
  };

  const subtotal = items.reduce((sum, i) => sum + i.amount, 0) + costs.material_cost + costs.labor_cost + costs.transportation_cost + costs.machinery_cost + costs.miscellaneous;
  const taxAmount = subtotal * costs.tax_percent / 100;
  const grandTotal = subtotal + taxAmount;

  const boq: BOQ = {
    id: crypto.randomUUID(),
    project_id: currentProject?.id || '',
    name: `BOQ - ${currentProject?.name || 'New'}`,
    items,
    ...costs,
    subtotal,
    tax_amount: taxAmount,
    grand_total: grandTotal,
    created_at: new Date().toISOString(),
  };

  const handleExportPDF = () => {
    if (currentProject) exportBOQToPDF(boq, currentProject);
  };

  const handleExportExcel = () => {
    if (currentProject) exportBOQToExcel(boq, currentProject);
  };

  const handleSave = () => {
    saveBOQ(boq);
  };

  const handleAutoFill = () => {
    const newItems = estimates.map((e, idx: number) => ({
      id: String(idx + 1),
      item_no: idx + 1,
      item: e.name,
      description: `${e.type} estimation`,
      unit: 'ls',
      quantity: 1,
      rate: Number((e.results as Record<string, number>)?.total_cost || (e.results as Record<string, number>)?.cost_estimate || 0),
      amount: Number((e.results as Record<string, number>)?.total_cost || (e.results as Record<string, number>)?.cost_estimate || 0),
    }));
    setItems(newItems);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Bill of Quantities</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">{currentProject ? currentProject.name : 'No project selected'}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleAutoFill} className="px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">
            Auto-Fill from Estimates
          </button>
          <button onClick={handleSave} className="px-3 py-2 rounded-lg bg-amber-500/10 text-amber-400 text-sm hover:bg-amber-500/20 transition-all flex items-center gap-1.5">
            <Save className="w-4 h-4" /> Save
          </button>
          <button onClick={handleExportPDF} className="px-3 py-2 rounded-lg bg-red-500/10 text-red-400 text-sm hover:bg-red-500/20 transition-all flex items-center gap-1.5">
            <FileDown className="w-4 h-4" /> PDF
          </button>
          <button onClick={handleExportExcel} className="px-3 py-2 rounded-lg bg-emerald-500/10 text-emerald-400 text-sm hover:bg-emerald-500/20 transition-all flex items-center gap-1.5">
            <FileSpreadsheet className="w-4 h-4" /> Excel
          </button>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800/50">
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider w-16">S.No</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Item</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Description</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider w-20">Unit</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider w-24">Qty</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider w-28">Rate (₹)</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider w-32">Amount (₹)</th>
                <th className="px-4 py-3 w-12"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-t border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-4 py-2 text-slate-500 dark:text-slate-400">{item.item_no}</td>
                  <td className="px-4 py-2">
                    <input value={item.item} onChange={e => updateItem(item.id, 'item', e.target.value)}
                      className="w-full bg-transparent text-slate-900 dark:text-white outline-none text-sm" placeholder="Item name" />
                  </td>
                  <td className="px-4 py-2">
                    <input value={item.description} onChange={e => updateItem(item.id, 'description', e.target.value)}
                      className="w-full bg-transparent text-slate-600 dark:text-slate-300 outline-none text-sm" placeholder="Description" />
                  </td>
                  <td className="px-4 py-2">
                    <select value={item.unit} onChange={e => updateItem(item.id, 'unit', e.target.value)}
                      className="bg-transparent text-slate-600 dark:text-slate-300 outline-none text-sm cursor-pointer">
                      {['nos', 'cum', 'sqm', 'rmt', 'kg', 'ltr', 'ls', 'cft', 'sq ft', 'ft'].map(u => (
                        <option key={u} value={u} className="bg-white dark:bg-slate-800">{u}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-2">
                    <input type="number" value={item.quantity} onChange={e => updateItem(item.id, 'quantity', Number(e.target.value))}
                      className="w-full bg-transparent text-slate-900 dark:text-white outline-none text-sm text-right" min="0" />
                  </td>
                  <td className="px-4 py-2">
                    <input type="number" value={item.rate} onChange={e => updateItem(item.id, 'rate', Number(e.target.value))}
                      className="w-full bg-transparent text-slate-900 dark:text-white outline-none text-sm text-right" min="0" />
                  </td>
                  <td className="px-4 py-2 text-right font-medium text-amber-400">{formatCurrency(item.amount)}</td>
                  <td className="px-4 py-2">
                    <button onClick={() => removeItem(item.id)} className="p-1 rounded hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-all">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <button onClick={addItem} className="px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center gap-1.5">
            <Plus className="w-4 h-4" /> Add Item
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5">
          <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-4">Additional Costs</h3>
          <div className="space-y-3">
            {[
              { key: 'material_cost', label: 'Material Cost' },
              { key: 'labor_cost', label: 'Labor Cost' },
              { key: 'transportation_cost', label: 'Transportation' },
              { key: 'machinery_cost', label: 'Machinery' },
              { key: 'miscellaneous', label: 'Miscellaneous' },
            ].map(({ key, label }) => (
              <div key={key} className="flex items-center justify-between">
                <label className="text-sm text-slate-500 dark:text-slate-400">{label}</label>
                <input type="number" value={costs[key as keyof typeof costs]}
                  onChange={e => setCosts(prev => ({ ...prev, [key]: Number(e.target.value) }))}
                  className="w-32 px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm text-right focus:border-amber-500/50 outline-none transition-all" min="0" />
              </div>
            ))}
            <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-800">
              <label className="text-sm text-slate-500 dark:text-slate-400">Tax Rate (%)</label>
              <input type="number" value={costs.tax_percent}
                onChange={e => setCosts(prev => ({ ...prev, tax_percent: Number(e.target.value) }))}
                className="w-32 px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm text-right focus:border-amber-500/50 outline-none transition-all" min="0" step="0.5" />
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-amber-500/20 p-5">
          <h3 className="text-sm font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-4">Cost Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm"><span className="text-slate-500 dark:text-slate-400">BOQ Items Total</span><span className="text-slate-900 dark:text-white">{formatCurrency(items.reduce((s, i) => s + i.amount, 0))}</span></div>
            <div className="flex justify-between text-sm"><span className="text-slate-500 dark:text-slate-400">Material Cost</span><span className="text-slate-900 dark:text-white">{formatCurrency(costs.material_cost)}</span></div>
            <div className="flex justify-between text-sm"><span className="text-slate-500 dark:text-slate-400">Labor Cost</span><span className="text-slate-900 dark:text-white">{formatCurrency(costs.labor_cost)}</span></div>
            <div className="flex justify-between text-sm"><span className="text-slate-500 dark:text-slate-400">Transportation</span><span className="text-slate-900 dark:text-white">{formatCurrency(costs.transportation_cost)}</span></div>
            <div className="flex justify-between text-sm"><span className="text-slate-500 dark:text-slate-400">Machinery</span><span className="text-slate-900 dark:text-white">{formatCurrency(costs.machinery_cost)}</span></div>
            <div className="flex justify-between text-sm"><span className="text-slate-500 dark:text-slate-400">Miscellaneous</span><span className="text-slate-900 dark:text-white">{formatCurrency(costs.miscellaneous)}</span></div>
            <div className="border-t border-slate-200 dark:border-slate-800 pt-2 flex justify-between text-sm font-semibold"><span className="text-slate-600 dark:text-slate-300">Subtotal</span><span className="text-slate-900 dark:text-white">{formatCurrency(subtotal)}</span></div>
            <div className="flex justify-between text-sm"><span className="text-slate-500 dark:text-slate-400">Tax ({costs.tax_percent}%)</span><span className="text-slate-900 dark:text-white">{formatCurrency(taxAmount)}</span></div>
            <div className="border-t border-amber-500/30 pt-3 flex justify-between">
              <span className="text-base font-bold text-amber-400">Grand Total</span>
              <span className="text-xl font-bold text-amber-400">{formatCurrency(grandTotal)}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
