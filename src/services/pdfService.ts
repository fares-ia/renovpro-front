import jsPDF from 'jspdf';
import { ClientInfo, QuoteInfo, Prestation } from "@/components/admin/CreateQuoteForm";

export interface FullQuote {
  id?: string;
  clientInfo: ClientInfo;
  quoteInfo: QuoteInfo;
  prestations: Prestation[];
  createdAt: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected';
}

export const generateQuotePDF = (quote: FullQuote) => {
  console.log('Génération du PDF pour le devis:', quote.quoteInfo.number);
  
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.width;
  const pageHeight = pdf.internal.pageSize.height;
  let yPosition = 20;

  // En-tête avec logo simulé et informations entreprise
  pdf.setFontSize(20);
  pdf.setTextColor(255, 193, 7); // Jaune
  pdf.text('RenovPro', 20, yPosition);
  
  // Informations entreprise (côté gauche)
  pdf.setFontSize(10);
  pdf.setTextColor(0, 0, 0);
  yPosition += 10;
  pdf.text('85 Avenue de la Liberté', 20, yPosition);
  yPosition += 5;
  pdf.text('94260 FRESNES', 20, yPosition);
  yPosition += 5;
  pdf.text('France', 20, yPosition);
  yPosition += 5;
  pdf.text('TEL : +33 (0) 771 209 997', 20, yPosition);
  yPosition += 5;
  pdf.text('Email : contact@renov-pro.eu', 20, yPosition);

  // Numéro de devis (côté droit)
  pdf.setFontSize(16);
  pdf.setTextColor(0, 0, 0);
  pdf.text(`DEVIS N° ${quote.quoteInfo.number}`, pageWidth - 80, 30);

  // Dates
  pdf.setFontSize(10);
  yPosition = 50;
  pdf.text(`Date d'émission: ${quote.quoteInfo.emissionDate}`, pageWidth - 80, yPosition);
  yPosition += 5;
  pdf.text(`Date de validité: ${quote.quoteInfo.validityDate}`, pageWidth - 80, yPosition);

  // Informations client
  yPosition = 80;
  pdf.setFontSize(12);
  pdf.setTextColor(0, 0, 0);
  pdf.text('CLIENT:', 20, yPosition);
  
  pdf.setFontSize(10);
  yPosition += 8;
  pdf.text(`${quote.clientInfo.firstName} ${quote.clientInfo.lastName}`, 20, yPosition);
  yPosition += 5;
  pdf.text(quote.clientInfo.email, 20, yPosition);
  yPosition += 5;
  pdf.text(quote.clientInfo.phone, 20, yPosition);
  yPosition += 5;
  pdf.text(quote.clientInfo.address, 20, yPosition);
  yPosition += 5;
  pdf.text(`${quote.clientInfo.postalCode} ${quote.clientInfo.city}`, 20, yPosition);

  if (quote.clientInfo.type === 'professionnel' && quote.clientInfo.companyName) {
    yPosition += 8;
    pdf.text(`Entreprise: ${quote.clientInfo.companyName}`, 20, yPosition);
    if (quote.clientInfo.siret) {
      yPosition += 5;
      pdf.text(`SIRET: ${quote.clientInfo.siret}`, 20, yPosition);
    }
  }

  // Tableau des prestations
  yPosition += 20;
  const tableStartY = yPosition;
  
  // En-têtes du tableau
  pdf.setFontSize(10);
  pdf.setTextColor(255, 255, 255);
  pdf.setFillColor(0, 0, 0);
  pdf.rect(20, yPosition, pageWidth - 40, 8, 'F');
  
  yPosition += 6;
  pdf.text('N°', 25, yPosition);
  pdf.text('Désignation', 40, yPosition);
  pdf.text('Qté', 120, yPosition);
  pdf.text('Unité', 135, yPosition);
  pdf.text('Prix U.', 155, yPosition);
  pdf.text('Prix Total', 175, yPosition);

  // Lignes du tableau
  pdf.setTextColor(0, 0, 0);
  yPosition += 5;
  
  quote.prestations.forEach((prestation, index) => {
    if (yPosition > pageHeight - 50) {
      pdf.addPage();
      yPosition = 20;
    }

    const total = prestation.isFree ? 0 : prestation.quantity * prestation.unitPriceHT;
    
    // Alternance de couleurs
    if (index % 2 === 0) {
      pdf.setFillColor(248, 249, 250);
      pdf.rect(20, yPosition - 3, pageWidth - 40, 8, 'F');
    }
    
    yPosition += 5;
    pdf.text((index + 1).toString(), 25, yPosition);
    pdf.text(prestation.description.substring(0, 40), 40, yPosition);
    pdf.text(prestation.quantity.toString(), 120, yPosition);
    pdf.text(prestation.unit, 135, yPosition);
    pdf.text(prestation.isFree ? 'Offert' : `${prestation.unitPriceHT.toFixed(2)}€`, 155, yPosition);
    pdf.text(prestation.isFree ? 'Offert' : `${total.toFixed(2)}€`, 175, yPosition);
    
    yPosition += 3;
  });

  // Récapitulatif financier
  yPosition += 15;
  const totalHT = calculateTotalHT(quote.prestations);
  const totalTVA = calculateTotalTVA(quote.prestations);
  const totalTTC = calculateTotalTTC(quote.prestations);

  pdf.setFontSize(12);
  pdf.text('RÉCAPITULATIF FINANCIER:', 20, yPosition);
  
  pdf.setFontSize(10);
  yPosition += 10;
  pdf.text(`Total HT: ${totalHT.toFixed(2)}€`, pageWidth - 80, yPosition);
  yPosition += 5;
  pdf.text(`Total TVA: ${totalTVA.toFixed(2)}€`, pageWidth - 80, yPosition);
  yPosition += 5;
  pdf.setFontSize(12);
  pdf.text(`Total TTC: ${totalTTC.toFixed(2)}€`, pageWidth - 80, yPosition);

  // Pied de page - Informations bancaires
  yPosition = pageHeight - 40;
  pdf.setFontSize(8);
  pdf.text('INFORMATIONS BANCAIRES:', 20, yPosition);
  yPosition += 5;
  pdf.text('SOCIETE GENERALE', 20, yPosition);
  yPosition += 4;
  pdf.text('RENOV-PRO', 20, yPosition);
  yPosition += 4;
  pdf.text('IBAN : FR76 3000 3037 7100 0202 1152 463', 20, yPosition);
  yPosition += 4;
  pdf.text('SWIFT (BIC) : SOGEFRPP', 20, yPosition);
  yPosition += 4;
  pdf.text('RCS et Siren Creteil: 930 972 328', 20, yPosition);
  yPosition += 4;
  pdf.text('C.E.E (TVA): FR70 930 972 328', 20, yPosition);

  // Téléchargement du PDF
  pdf.save(`Devis_${quote.quoteInfo.number}.pdf`);
};

const calculateTotalHT = (prestations: Prestation[]) => {
  return prestations.reduce((sum, p) => {
    if (p.isFree) return sum;
    return sum + (p.quantity * p.unitPriceHT);
  }, 0);
};

const calculateTotalTVA = (prestations: Prestation[]) => {
  return prestations.reduce((sum, p) => {
    if (p.isFree) return sum;
    const totalHT = p.quantity * p.unitPriceHT;
    return sum + (totalHT * p.tvaRate / 100);
  }, 0);
};

const calculateTotalTTC = (prestations: Prestation[]) => {
  return calculateTotalHT(prestations) + calculateTotalTVA(prestations);
};
