// 📁 scripts/report.js

import jsPDF from "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
import autoTable from "https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.29/jspdf.plugin.autotable.min.js";

export async function generatePDF(district = "All") {
  if (!window.airtableData || !Array.isArray(window.airtableData)) {
    alert("⚠️ Data not ready. Please wait a moment.");
    return;
  }

  const doc = new window.jspdf.jsPDF();
  const margin = 15;
  let y = margin;

  const data = district === "All"
    ? window.airtableData
    : window.airtableData.filter(d => d.district === district);

  const summary = window.summarizeData(data, district);
  const blockData = window.groupByBlock(data);

  // 🧾 Title and Header
  doc.setFontSize(18);
  doc.setTextColor(40);
  doc.text("Eye Screening Camp Summary Report", doc.internal.pageSize.getWidth() / 2, y, { align: 'center' });
  y += 10;

  doc.setFontSize(12);
  doc.text(`District: ${district}`, margin, y);
  y += 6;
  doc.text(`Generated on: ${new Date().toLocaleString()}`, margin, y);
  y += 10;

  // 📌 Summary Stats
  const summaryData = [
    ["Screened", summary.screened],
    ["R.E. Detected", summary.re_detected],
    ["Spectacles Prescribed", summary.specs_prescribed],
    ["Cataract Cases", summary.cataract_detected],
    ["Camps Done", `${summary.camps_done}/${summary.camps_allotted}`],
    ["Completion %", `${summary.completion_pct}%`],
    ["Avg Specs/Camp", summary.avg_specs_per_camp],
    ["Expected Specs/Camp", summary.expected_specs_per_camp],
    ["Target Beneficiaries", summary.expected_target],
  ];

  autoTable(doc, {
    startY: y,
    head: [["Metric", "Value"]],
    body: summaryData,
    theme: "grid",
    headStyles: { fillColor: [56, 108, 174], halign: "center" },
    styles: { halign: "left", fontSize: 10 },
    margin: { left: margin, right: margin },
  });

  y = doc.lastAutoTable.finalY + 10;

  // 📊 Block or District Table
  if (district === "All") {
    const allDistricts = [...new Set(window.airtableData.map(d => d.district))];
    const rows = allDistricts.map(dist => {
      const distData = window.airtableData.filter(d => d.district === dist);
      const sum = window.summarizeData(distData, dist);
      return [dist, sum.screened, sum.re_detected, sum.specs_prescribed, sum.cataract_detected, `${sum.completion_pct}%`];
    });

    autoTable(doc, {
      startY: y,
      head: [["District", "Screened", "R.E.", "Spectacles", "Cataracts", "Completion %"]],
      body: rows,
      theme: "striped",
      headStyles: { fillColor: [46, 125, 50] },
      styles: { fontSize: 9 },
      margin: { left: margin, right: margin }
    });
  } else {
    const blockRows = Object.keys(blockData).map(block => [
      block,
      blockData[block].screened,
      blockData[block].re,
      blockData[block].cataract
    ]);

    autoTable(doc, {
      startY: y,
      head: [["Block", "Screened", "R.E.", "Cataract"]],
      body: blockRows,
      theme: "striped",
      headStyles: { fillColor: [94, 53, 177] },
      styles: { fontSize: 9 },
      margin: { left: margin, right: margin }
    });
  }

  doc.save(`Eye_Screening_Report_${district.replace(/\s+/g, '_')}.pdf`);
}

window.generatePDF = generatePDF;
