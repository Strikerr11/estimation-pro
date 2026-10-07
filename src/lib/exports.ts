import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { BOQ, Project } from '../types';
import { formatCurrency, formatNumber } from './engine';

export function exportBOQToPDF(boq: BOQ, project: Project) {
  const doc = new jsPDF();
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Bill of Quantities', 14, 20);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Project: ${project.name}`, 14, 30);
  doc.text(`Client: ${project.client_name}`, 14, 36);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 42);

  const rows = boq.items.map(item => [
    item.item_no,
    item.item,
    item.description,
    item.unit,
    formatNumber(item.quantity),
    formatCurrency(item.rate),
    formatCurrency(item.amount),
  ]);

  autoTable(doc, {
    startY: 50,
    head: [['S.No', 'Item', 'Description', 'Unit', 'Qty', 'Rate', 'Amount']],
    body: rows,
    theme: 'grid',
    headStyles: { fillColor: [30, 58, 138], textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [245, 247, 250] },
    styles: { fontSize: 8, cellPadding: 3 },
  });

  const finalY = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;
  doc.setFontSize(10);
  doc.text(`Subtotal: ${formatCurrency(boq.subtotal)}`, 140, finalY);
  doc.text(`Tax (${boq.tax_percent}%): ${formatCurrency(boq.tax_amount)}`, 140, finalY + 6);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(`Grand Total: ${formatCurrency(boq.grand_total)}`, 140, finalY + 14);

  doc.save(`BOQ_${project.name.replace(/\s+/g, '_')}.pdf`);
}

export function exportBOQToExcel(boq: BOQ, project: Project) {
  const wsData = [
    ['Bill of Quantities'],
    [`Project: ${project.name}`, `Client: ${project.client_name}`, `Date: ${new Date().toLocaleDateString()}`],
    [],
    ['S.No', 'Item', 'Description', 'Unit', 'Quantity', 'Rate', 'Amount'],
    ...boq.items.map(item => [item.item_no, item.item, item.description, item.unit, item.quantity, item.rate, item.amount]),
    [],
    ['', '', '', '', '', 'Subtotal', boq.subtotal],
    ['', '', '', '', '', `Tax (${boq.tax_percent}%)`, boq.tax_amount],
    ['', '', '', '', '', 'Grand Total', boq.grand_total],
  ];

  const ws = XLSX.utils.aoa_to_sheet(wsData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'BOQ');
  XLSX.writeFile(wb, `BOQ_${project.name.replace(/\s+/g, '_')}.xlsx`);
}

export function exportProjectReportToPDF(project: Project, estimates: Record<string, unknown>[]) {
  const doc = new jsPDF();
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Project Report', 14, 20);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Project: ${project.name}`, 14, 30);
  doc.text(`Client: ${project.client_name}`, 14, 36);
  doc.text(`Engineer: ${project.engineer_name}`, 14, 42);
  doc.text(`Location: ${project.location}`, 14, 48);
  doc.text(`Type: ${project.project_type}`, 14, 54);
  doc.text(`Status: ${project.status}`, 14, 60);
  doc.text(`Total Cost: ${formatCurrency(project.total_cost)}`, 14, 66);

  if (estimates.length > 0) {
    const rows = estimates.map((e, i) => [i + 1, (e as Record<string, string>).name || '', (e as Record<string, string>).type || '', formatCurrency(Number((e as Record<string, number>).total_cost || 0))]);
    autoTable(doc, {
      startY: 75,
      head: [['S.No', 'Estimate', 'Type', 'Cost']],
      body: rows,
      theme: 'grid',
      headStyles: { fillColor: [30, 58, 138], textColor: 255 },
      styles: { fontSize: 9, cellPadding: 3 },
    });
  }

  doc.save(`Report_${project.name.replace(/\s+/g, '_')}.pdf`);
}
