// ✅ Exported function to be used on button click in HTML
export function generatePDF(district = "All") {
  const doc = new window.jspdf.jsPDF();

  // Add a title
  doc.setFontSize(16);
  doc.text(`Eye Screening Report`, 10, 15);
  doc.setFontSize(12);
  doc.text(`District: ${district}`, 10, 25);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 10, 32);

  // Capture summary cards
  const summaryEl = document.getElementById("summaryCards");

  if (!summaryEl) {
    alert("📛 Summary section not found!");
    return;
  }

  html2canvas(summaryEl).then(canvas => {
    const imgData = canvas.toDataURL("image/png");
    const pageWidth = doc.internal.pageSize.getWidth();
    const imgWidth = pageWidth - 20;
    const imgHeight = canvas.height * (imgWidth / canvas.width);

    doc.addImage(imgData, "PNG", 10, 40, imgWidth, imgHeight);

    // Save the file
    const fileName = `Eye_Screening_Report_${district.replace(/\s+/g, "_")}.pdf`;
    doc.save(fileName);
  }).catch(err => {
    console.error("Error generating canvas:", err);
    alert("❌ Failed to generate report. See console for details.");
  });
}

// ✅ Make available globally for inline onclick="generatePDF(...)"
window.generatePDF = generatePDF;
