// scripts/report.js
export function generatePDF(district = "All") {
  const doc = new window.jspdf.jsPDF();

  doc.text(`Eye Screening Report: ${district}`, 10, 10);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 10, 20);

  doc.save(`eye-screening-${district}.pdf`);
}

// Attach to global if needed
window.generatePDF = generatePDF;

