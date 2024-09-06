import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const downloadPDF = async () => {
  const element = document.querySelector(".invoice");

  const canvas = await html2canvas(element);
  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "pt", "a4");

  pdf.addImage(imgData, "PNG", 0, 0, 595, 842);

  pdf.save("invoice.pdf");
};

export default downloadPDF;
