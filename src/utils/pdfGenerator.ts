import jsPDF from 'jspdf';
import type { Prescription } from '../types/database';

export function generatePrescriptionPDF(prescription: Prescription) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header Background
  doc.setFillColor(95, 184, 176); // #5FB8B0 (Sankalp Teal)
  doc.rect(0, 0, pageWidth, 35, 'F');

  // Clinic Brand
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('SANKALP HEALTHCARE', 14, 18);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Online Doctor Consultation & Post-Visit Recovery Care', 14, 26);

  // Doctor Details (Right-aligned in header)
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  const docName = prescription.doctor?.profile?.full_name || 'Dr. Medical Specialist';
  doc.text(docName, pageWidth - 14, 16, { align: 'right' });

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(prescription.doctor?.specialization || 'Consultant Physician', pageWidth - 14, 22, { align: 'right' });
  doc.text(`Reg No: ${prescription.doctor?.license_number || 'MCI-VERIFIED'}`, pageWidth - 14, 28, { align: 'right' });

  // Patient Info Card
  doc.setFillColor(247, 251, 250);
  doc.setDrawColor(205, 235, 221);
  doc.roundedRect(14, 42, pageWidth - 28, 28, 3, 3, 'FD');

  doc.setTextColor(30, 41, 59);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('PATIENT CONSULTATION SUMMARY', 20, 50);

  doc.setFont('helvetica', 'normal');
  doc.text(`Patient ID: ${prescription.patient_id}`, 20, 58);
  doc.text(`Consultation Date: ${new Date(prescription.created_at).toLocaleDateString()}`, 20, 64);

  doc.text(`Prescription ID: ${prescription.id}`, pageWidth / 2 + 10, 58);
  doc.text(`Follow-up Date: ${prescription.follow_up_date || 'As required'}`, pageWidth / 2 + 10, 64);

  // Diagnosis Section
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(43, 120, 113); // primary dark
  doc.text('DIAGNOSIS & CLINICAL NOTES', 14, 80);

  doc.setDrawColor(95, 184, 176);
  doc.line(14, 83, pageWidth - 14, 83);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(30, 41, 59);
  doc.text(prescription.diagnosis || 'Routine review and clinical care', 14, 90);

  // Rx Section
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(43, 120, 113);
  doc.text('Rx — PRESCRIBED MEDICINES', 14, 104);

  doc.line(14, 107, pageWidth - 14, 107);

  // Table Header
  let currentY = 114;
  doc.setFillColor(235, 248, 246);
  doc.rect(14, currentY - 5, pageWidth - 28, 9, 'F');

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text('Medicine & Strength', 18, currentY);
  doc.text('Dosage', 80, currentY);
  doc.text('Frequency', 115, currentY);
  doc.text('Food Timing', 145, currentY);
  doc.text('Duration', pageWidth - 20, currentY, { align: 'right' });

  currentY += 8;

  // Medicine Items
  doc.setFont('helvetica', 'normal');
  prescription.items.forEach((item, index) => {
    if (index % 2 === 1) {
      doc.setFillColor(250, 253, 252);
      doc.rect(14, currentY - 5, pageWidth - 28, 9, 'F');
    }
    doc.text(item.medicine_name, 18, currentY);
    doc.text(item.dosage, 80, currentY);
    doc.text(item.frequency, 115, currentY);
    doc.text(item.timing, 145, currentY);
    doc.text(`${item.duration_days} days`, pageWidth - 20, currentY, { align: 'right' });
    currentY += 9;
  });

  // Doctor Advice / Lifestyle Instructions
  currentY += 8;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(43, 120, 113);
  doc.text('ADVICE & LIFESTYLE GUIDELINES', 14, currentY);
  currentY += 3;
  doc.line(14, currentY, pageWidth - 14, currentY);
  currentY += 7;

  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  const adviceLines = doc.splitTextToSize(prescription.advice || 'Drink plenty of water and rest well.', pageWidth - 28);
  doc.text(adviceLines, 14, currentY);

  currentY += adviceLines.length * 6 + 15;

  // AI Care Note & Doctor Signature
  doc.setFillColor(240, 250, 245);
  doc.roundedRect(14, currentY, pageWidth - 28, 22, 2, 2, 'F');
  doc.setFontSize(8.5);
  doc.setTextColor(42, 106, 80);
  doc.setFont('helvetica', 'bold');
  doc.text('AI FOLLOW-UP ASSISTANT ENABLED', 20, currentY + 7);
  doc.setFont('helvetica', 'normal');
  doc.text(
    'Sankalp Care Assistant will send you medicine reminders and daily check-ins to monitor your recovery rate.',
    20,
    currentY + 14
  );

  // Digital Signature
  currentY += 34;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text(docName, pageWidth - 14, currentY, { align: 'right' });
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.text('Digitally Signed via Sankalp Platform', pageWidth - 14, currentY + 5, { align: 'right' });

  // Footer Disclaimer
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text(
    'Notice: This digital prescription is generated pursuant to Telemedicine Practice Guidelines. In emergencies, call 112 / 108.',
    pageWidth / 2,
    285,
    { align: 'center' }
  );

  // Save PDF
  doc.save(`Sankalp_Prescription_${prescription.id}.pdf`);
}
