import React from "react";
import { jsPDF } from "jspdf";

// Fungsi untuk membuat gambar dengan sudut membulat menggunakan canvas
const createRoundedImage = (imageSrc, radius, callback) => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  const img = new Image();
  img.crossOrigin = "Anonymous";
  img.src = imageSrc;
  img.onload = function () {
    const width = img.width;
    const height = img.height;

    canvas.width = width;
    canvas.height = height;

    ctx.clearRect(0, 0, width, height);
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(radius, 0);
    ctx.lineTo(width - radius, 0);
    ctx.quadraticCurveTo(width, 0, width, radius);
    ctx.lineTo(width, height - radius);
    ctx.quadraticCurveTo(width, height, width - radius, height);
    ctx.lineTo(radius, height);
    ctx.quadraticCurveTo(0, height, 0, height - radius);
    ctx.lineTo(0, radius);
    ctx.quadraticCurveTo(0, 0, radius, 0);
    ctx.clip();

    ctx.drawImage(img, 0, 0);
    ctx.restore();

    callback(canvas.toDataURL("image/png"));
  };
};

// Fungsi untuk membuat PDF
const generatePDF = (imageSrc) => {
  const doc = new jsPDF();

  createRoundedImage(imageSrc, 10, (roundedImageSrc) => {
    doc.addImage(roundedImageSrc, "PNG", 10, 10, 180, 160);
    doc.save("rounded-image.pdf");
  });
};

const Coba = () => {
  const imageUrl =
    "https://images.unsplash.com/photo-1720048170970-3848514c3d60?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"; // Ganti dengan URL gambar yang sesuai

  // Event handler untuk tombol download
  const handleDownloadPDF = () => {
    generatePDF(imageUrl);
  };

  return (
    <div>
      <button onClick={handleDownloadPDF}>Download PDF</button>
    </div>
  );
};

export default Coba;
