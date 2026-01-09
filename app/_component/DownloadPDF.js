"use client";
import jsPDF from "jspdf";
import "jspdf-autotable";

export const exportToPDF = (title, subheading, responses) => {
  const doc = new jsPDF();

  // 1. Header Styling
  doc.setFontSize(22);
  doc.setTextColor(22, 101, 52); // Dark Green
  doc.text(title || "Form Submission", 14, 20);

  // 2. Subheading
  doc.setFontSize(12);
  doc.setTextColor(100);
  doc.text(subheading || "", 14, 28);

  // 3. Metadata
  doc.setFontSize(10);
  doc.setTextColor(150);
  doc.text(`Date: ${new Date().toLocaleString()}`, 14, 35);

  // 4. Transform responses object into table rows
  const tableRows = Object.entries(responses).map(([label, value]) => [
    label,
    value || "N/A",
  ]);

  // 5. Generate Table
  doc.autoTable({
    startY: 40,
    head: [["Field Name", "User Response"]],
    body: tableRows,
    theme: "striped",
    headStyles: { fillColor: [22, 163, 74] }, // FormAI Green
    styles: { fontSize: 11, cellPadding: 5 },
  });

  // 6. Download
  const fileName = `${title.replace(/\s+/g, "_")}_Submission.pdf`;
  doc.save(fileName);
};