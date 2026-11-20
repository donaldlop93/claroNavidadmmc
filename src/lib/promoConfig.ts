export type CategoryType = 'A' | 'B' | 'C';

export interface CategoryPromoInfo {
  category: CategoryType;
  title: string;
  badgeColor: string;
  targetTae: number;
  targetSim: number;
  prizes: string[];
}

export const PROMO_CONFIG = {
  name: 'EL RETO NAVIDEÑO CLARO 2026 — ZONA NORTE',
  distributor: 'M&M Comunicaciones S.A.',
  distributorSubtitle: 'Distribuidor Autorizado de Claro Nicaragua',
  zone: 'Zona Norte',
  startDate: new Date('2026-11-01T00:00:00-06:00'),
  endDate: new Date('2026-12-31T23:59:59-06:00'),
  drawDate: '15 de enero de 2027',
  whatsappNumber: '50584480260',
  whatsappContactName: 'Cristian Rojas',
  categories: {
    A: {
      category: 'A',
      title: 'Categoría A',
      badgeColor: 'bg-amber-500 text-white',
      targetTae: 58418.66,
      targetSim: 12,
      prizes: [
        '10 giftcards La Colonia de C$10,000',
        '1 refrigeradora Cetron 11 pies, 2 puertas',
        '3 microondas Frigidaire 0.6 ft³, blanco',
        '1 cocina de gas Murcia Plus, 4 quemadores',
        '1 televisor TCL 55" LED 4K UHD 55V6C',
      ],
    },
    B: {
      category: 'B',
      title: 'Categoría B',
      badgeColor: 'bg-blue-600 text-white',
      targetTae: 20298.0,
      targetSim: 8,
      prizes: [
        '8 giftcards La Colonia de C$10,000',
        '4 licuadoras Black + Decker 1.65 L, rojas',
        '3 cafeteras Black + Decker, 12 tazas, blancas',
        '4 planchas TELSTAR',
        '1 televisor TCL 32" QLED FHD',
      ],
    },
    C: {
      category: 'C',
      title: 'Categoría C',
      badgeColor: 'bg-emerald-600 text-white',
      targetTae: 6613.9,
      targetSim: 5,
      prizes: [
        '4 giftcards Walmart de C$3,662.43 cada una',
      ],
    },
  } as Record<CategoryType, CategoryPromoInfo>,
};

export interface PosRecord {
  pos: string;
  cliente: string;
  estado: 'ACTIVO' | 'INACTIVO' | string;
  activandoSim: 'ACTIVO' | 'INACTIVO' | string;
  categoria: CategoryType;
  taeActual: number;
  simActual: number;
}

export interface ConsultaResponse {
  classifiedCount: number;
  record?: PosRecord;
  error?: string;
  message?: string;
}

/**
 * Calculates remaining days until campaign closing (Dec 31, 2026).
 * Minimum return is 1 to avoid division by zero.
 */
export function getRemainingDays(now: Date = new Date()): number {
  const end = PROMO_CONFIG.endDate.getTime();
  const current = now.getTime();
  const diffMs = end - current;
  if (diffMs <= 0) return 0;
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Format currency to Nicaraguan Cordobas (C$ #,###.##)
 */
export function formatCordobas(amount: number): string {
  return (
    'C$ ' +
    amount.toLocaleString('es-NI', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
}

/**
 * Generates official formatted WhatsApp message for sending directly to the client/PDR
 */
export function getClientWhatsAppShareMessage(record: PosRecord, webUrl?: string): string {
  const catConfig = PROMO_CONFIG.categories[record.categoria] || PROMO_CONFIG.categories.B;
  const targetTae = catConfig.targetTae;
  const targetSim = catConfig.targetSim;
  const pctTae = Math.min(100, Math.round((record.taeActual / targetTae) * 100));
  const pctSim = Math.min(100, Math.round((record.simActual / targetSim) * 100));

  const missingTae = Math.max(0, targetTae - record.taeActual);
  const missingSim = Math.max(0, targetSim - record.simActual);
  const isClassified = record.taeActual >= targetTae && record.simActual >= targetSim;

  const daysLeft = Math.max(1, getRemainingDays());
  const dailyTae = missingTae > 0 ? missingTae / daysLeft : 0;
  const simFreq = missingSim > 0 ? Math.max(1, Math.floor(daysLeft / missingSim)) : 0;

  const posClean = record.pos.padStart(8, '0');
  const prizesList = catConfig.prizes.map((p) => `🎁 ${p}`).join('\n');

  let statusSection = '';
  if (isClassified) {
    statusSection = `🎉 *¡FELICIDADES! ESTÁS 100% CLASIFICADO(A)*\nCumpliste ambas metas y tu boleto virtual está asegurado para el sorteo navideño. 🏆✨\n`;
  } else {
    statusSection = `⚠️ *LO QUE TE FALTA PARA CLASIFICAR:*
👉 *En TAE:* Te faltan ${formatCordobas(missingTae)} (Ritmo: ~${formatCordobas(dailyTae)} / día)
👉 *En SIMs (> C$65):* Te faltan ${missingSim} SIMs (Activar 1 cada ${simFreq} ${simFreq === 1 ? 'día' : 'días'})\n`;
  }

  const link = webUrl || `https://claronavidadmmc.vercel.app?pos=${posClean}`;
  const urlSection = `\n📲 *Consultá tu avance interactivo en vivo aquí:*\n${link}\n`;

  return `🎄 *EL RETO NAVIDEÑO CLARO 2026* 🎄
*M&M Comunicaciones S.A.* — Distribuidor Autorizado

Estimado(a) *${record.cliente}*, te compartimos el avance oficial de tu Punto de Venta:

📍 *Código POS:* ${posClean}
⭐ *Categoría:* ${record.categoria}
⏳ *Días restantes:* ${daysLeft} días para el cierre (31 Dic 2026)

📊 *ESTADO DE TUS METAS:*
📱 *TAE:* ${formatCordobas(record.taeActual)} de ${formatCordobas(targetTae)} (*${pctTae}%*)
💳 *SIMs (> C$65):* ${record.simActual} de ${targetSim} SIMs (*${pctSim}%*)

${statusSection}
🏆 *PREMIOS DE TU CATEGORÍA (${record.categoria}):*
${prizesList}

🗓️ *Sorteo Electrónico:* 15 de enero de 2027
${urlSection}
¡No dejés perder tus premios de Zona Norte! 🎅✨`;
}

/**
 * Generates WhatsApp URL pre-filled for sending directly to the client/PDR
 */
export function getClientWhatsAppShareUrl(
  record: PosRecord,
  webUrl?: string,
  clientPhone?: string
): string {
  const message = getClientWhatsAppShareMessage(record, webUrl);
  const cleanPhone = clientPhone ? clientPhone.replace(/\D/g, '') : '';
  const baseUrl = cleanPhone ? `https://wa.me/${cleanPhone}` : `https://api.whatsapp.com/send`;
  return `${baseUrl}?text=${encodeURIComponent(message)}`;
}

/**
 * Generates WhatsApp URL pre-filled message for Cristian Rojas orders
 */
export function getWhatsAppOrderUrl(record: PosRecord): string {
  const catConfig = PROMO_CONFIG.categories[record.categoria] || PROMO_CONFIG.categories.B;
  const isClassified = record.taeActual >= catConfig.targetTae && record.simActual >= catConfig.targetSim;
  const posClean = record.pos.padStart(8, '0');

  let text = '';
  if (isClassified) {
    text = `Hola Cristian Rojas, soy el POS ${posClean} (${record.cliente}). Ya cumplí mi meta del Reto Navideño (Categoría ${record.categoria}) y quiero hacer un nuevo pedido de saldo/SIMs.`;
  } else {
    const missingTae = Math.max(0, catConfig.targetTae - record.taeActual);
    const missingSim = Math.max(0, catConfig.targetSim - record.simActual);
    text = `Hola Cristian Rojas, soy el POS ${posClean} (${record.cliente}). Estoy en Categoría ${record.categoria} del Reto Navideño y me faltan ${formatCordobas(missingTae)} en TAE y ${missingSim} SIM Cards (> C$65) para clasificar. Quiero hacer un pedido.`;
  }

  return `https://wa.me/${PROMO_CONFIG.whatsappNumber}?text=${encodeURIComponent(text)}`;
}
