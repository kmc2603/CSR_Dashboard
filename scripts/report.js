window.generatePDF = async function (district) {
  const pdf = new jsPDF("p", "mm", "a4");
  const margin = 10;

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(18);
  pdf.text("Eye Screening Camp Report", margin, 20);

  pdf.setFontSize(12);
  pdf.setFont("helvetica", "normal");
  pdf.text(`District: ${district}`, margin, 30);
  pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, margin, 37);

  // 📸 Screenshot summaryCards div
  const summaryEl = document.querySelector("#summaryCards");
  const canvas = await html2canvas(summaryEl);
  const img = canvas.toDataURL("image/png");
  pdf.addImage(img, "PNG", margin, 45, 190, 60);

  // 📊 Screenshot chart
  const chartCanvas = document.getElementById("completionChart");
  const chartImg = chartCanvas.toDataURL("image/png");
  pdf.addImage(chartImg, "PNG", margin, 110, 190, 80);

  pdf.save(`${district}_EyeCampReport.pdf`);
};

if (district === "All") {
  const allDistricts = [...new Set(window.airtableData.map(d => d.district))];
  for (let i = 0; i < allDistricts.length; i++) {
    if (i > 0) pdf.addPage();
    const d = allDistricts[i];
    await renderDashboard(d); // from global scope
    await new Promise(resolve => setTimeout(resolve, 500)); // wait to render

    // Capture and add
    const canvas = await html2canvas(document.querySelector("#summaryCards"));
    const img = canvas.toDataURL("image/png");
    pdf.addImage(img, "PNG", margin, 20, 190, 60);
  }
  await renderDashboard("All"); // restore
}
