function generatePDF(district = "All") {
  if (!window.jspdf || !window.jspdf.jsPDF || !window.airtableData) {
    alert("⚠️ jsPDF or data not ready.");
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

  doc.setFontSize(18);
  doc.text("Eye Screening Summary Report", doc.internal.pageSize.getWidth() / 2, y, { align: 'center' });
  y += 10;

  doc.setFontSize(12);
  doc.text(`District: ${district}`, margin, y);
  y += 6;
  doc.text(`Generated on: ${new Date().toLocaleString()}`, margin, y);
  y += 10;

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

  doc.autoTable({
    startY: y,
    head: [["Metric", "Value"]],
    body: summaryData,
    theme: "grid",
    headStyles: { fillColor: [56, 108, 174], halign: "center" },
    styles: { fontSize: 10 },
    margin: { left: margin, right: margin },
  });

  y = doc.lastAutoTable.finalY + 10;

  if (district === "All") {
    const allDistricts = [...new Set(window.airtableData.map(d => d.district))];
    const rows = allDistricts.map(dist => {
      const distData = window.airtableData.filter(d => d.district === dist);
      const sum = window.summarizeData(distData, dist);
      return [dist, sum.screened, sum.re_detected, sum.specs_prescribed, sum.cataract_detected, `${sum.completion_pct}%`];
    });

    doc.autoTable({
      startY: y,
      head: [["District", "Screened", "R.E.", "Spectacles", "Cataracts", "Completion %"]],
      body: rows,
      theme: "striped",
      headStyles: { fillColor: [46, 125, 50] },
      styles: { fontSize: 9 },
      margin: { left: margin, right: margin }
    });

  } else {
    const rows = Object.keys(blockData).map(block => [
      block,
      blockData[block].screened,
      blockData[block].re,
      blockData[block].cataract
    ]);

    doc.autoTable({
      startY: y,
      head: [["Block", "Screened", "R.E.", "Cataract"]],
      body: rows,
      theme: "striped",
      headStyles: { fillColor: [94, 53, 177] },
      styles: { fontSize: 9 },
      margin: { left: margin, right: margin }
    });
  }

  doc.save(`Eye_Screening_Report_${district.replace(/\s+/g, '_')}.pdf`);
}

window.generatePDF = generatePDF;
