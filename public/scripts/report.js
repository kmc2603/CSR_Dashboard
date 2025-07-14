export function generatePDF(district = "All") {
  if (!window.airtableData || !Array.isArray(window.airtableData)) {
    alert("⚠️ Data is not loaded yet. Please wait a few seconds and try again.");
    return;
  }

  const doc = new window.jspdf.jsPDF();
  const margin = 15;
  let y = margin;

  // ✅ FIRST define 'data'
  const data = district === "All"
    ? window.airtableData
    : window.airtableData.filter(d => d.district === district);

  // ✅ THEN use it
  const summary = window.summarizeData(data, district);
  const blockData = window.groupByBlock(data);
  
  // 🧾 Add text summary
  doc.setFontSize(16);
  doc.text("Eye Screening Report", margin, y);
  y += 8;
  doc.setFontSize(12);
  doc.text(`District: ${district}`, margin, y);
  y += 6;
  doc.text(`Generated on: ${new Date().toLocaleString()}`, margin, y);
  y += 10;

  const summaryLines = [
    ["👥 Screened", summary.screened],
    ["👓 R.E. Detected", summary.re_detected],
    ["🩺 Spectacles Prescribed", summary.specs_prescribed],
    ["👁️ Cataract Cases", summary.cataract_detected],
    ["📊 Camps Done", `${summary.camps_done}/${summary.camps_allotted}`],
    ["✅ Completion %", `${summary.completion_pct}%`],
    ["📅 Avg Specs/Camp", summary.avg_specs_per_camp],
    ["📈 Expected Specs/Camp", summary.expected_specs_per_camp],
    ["🎯 Target Beneficiaries", summary.expected_target]
  ];

  summaryLines.forEach(([label, value]) => {
    doc.text(`${label}:`, margin, y);
    doc.setFont("helvetica", "bold");
    doc.text(String(value), margin + 80, y);
    doc.setFont("helvetica", "normal");
    y += 7;
  });

  // 📋 Add block-wise table
  const tableRows = Object.keys(blockData).map(block => [
    block,
    blockData[block].screened,
    blockData[block].re,
    blockData[block].cataract
  ]);

  y += 5;
  doc.autoTable({
    head: [["Block", "Screened", "R.E. Detected", "Cataract"]],
    body: tableRows,
    startY: y,
    theme: "striped",
    headStyles: { fillColor: [99, 179, 237] },
    styles: { fontSize: 10 },
    margin: { left: margin, right: margin }
  });

  y = doc.lastAutoTable.finalY + 10;

  // 📊 Capture bar chart as image
  const chartCanvas = document.getElementById("barChart");
  if (chartCanvas) {
    html2canvas(chartCanvas).then(canvas => {
      const imgData = canvas.toDataURL("image/png");
      const pageWidth = doc.internal.pageSize.getWidth();
      const imgWidth = pageWidth - margin * 2;
      const imgHeight = canvas.height * (imgWidth / canvas.width);

      doc.addImage(imgData, "PNG", margin, y, imgWidth, imgHeight);

      const fileName = `Eye_Screening_Report_${district.replace(/\s+/g, "_")}.pdf`;
      doc.save(fileName);
    }).catch(err => {
      console.error("Chart rendering failed:", err);
      doc.text("⚠️ Chart could not be rendered", margin, y);
      doc.save(`Eye_Screening_Report_${district.replace(/\s+/g, "_")}.pdf`);
    });
  } else {
    doc.text("⚠️ Chart not available", margin, y);
    doc.save(`Eye_Screening_Report_${district.replace(/\s+/g, "_")}.pdf`);
  }
}
if (!window.airtableData || !Array.isArray(window.airtableData)) {
  alert("⚠️ Data not loaded. Please wait a moment.");
  return;
}

window.generatePDF = generatePDF;

