export function generatePDF(district) {
  import("jspdf").then(jsPDFModule => {
    import("html2canvas").then(html2canvasModule => {
      const jsPDF = jsPDFModule.jsPDF;
      const html2canvas = html2canvasModule.default;

      const target = document.body;

      html2canvas(target).then(canvas => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");

        const width = pdf.internal.pageSize.getWidth();
        const height = (canvas.height * width) / canvas.width;

        pdf.addImage(imgData, "PNG", 0, 0, width, height);
        const filename = district === "All" ? "All-District-Report.pdf" : `${district}-Report.pdf`;
        pdf.save(filename);
      });
    });
  });
}

window.generatePDF = generatePDF; // 👈 This line makes it work in index.html
