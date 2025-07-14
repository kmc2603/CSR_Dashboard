export function generatePDF(district = "All") {
  const doc = new window.jspdf.jsPDF();
  const margin = 15;
  let y = margin;

  const summaryData = summarizeData(
    district === "All"
      ? window.airtableData
      : window.airtableData.filter(d => d.district === district),
    district
  );

  // Header
  doc.setFontSize(16);
  doc.setTextColor(40);
  doc.text("Eye Screening Report", margin, y);
  y += 8;
  doc.setFontSize(12);
  doc.text(`District: ${district}`, margin, y);
  y += 6;
  doc.text(`Generated on: ${new Date().toLocaleString()}`, margin, y);
  y += 10;

  // Data table
  const lines = [
    ["👥 Screened", summaryData.screened],
    ["👓 R.E. Detected", summaryData.re_detected],
    ["🩺 Spectacles Prescribed", summaryData.specs_prescribed],
    ["👁️ Cataract Cases", summaryData.cataract_detected],
    ["📊 Camps Done", `${summaryData.camps_done}/${summaryData.camps_allotted}`],
    ["✅ Completion %", `${summaryData.completion_pct}%`],
    ["📅 Avg Specs/Camp", summaryData.avg_specs_per_camp],
    ["📈 Expected Specs/Camp", summaryData.expected_specs_per_camp],
    ["🎯 Target Beneficiaries", summaryData.expected_target]
  ];

  lines.forEach(([label, value]) => {
    doc.text(`${label}:`, margin, y);
    doc.setFont("helvetica", "bold");
    doc.text(String(value), margin + 80, y);
    doc.setFont("helvetica", "normal");
    y += 8;
  });

  doc.save(`Eye_Screening_Report_${district.replace(/\s+/g, "_")}.pdf`);
}

window.generatePDF = generatePDF;
