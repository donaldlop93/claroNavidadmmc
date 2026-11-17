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
 * Generates WhatsApp URL pre-filled message
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
    text = `Hola Cristian Rojas, soy el POS ${posClean} (${record.cliente}). Estoy en Categoría ${record.categoria} del Reto Navideño y me faltan ${formatCordobas(missingTae)} en TAE y ${missingSim} SIM Cards para clasificar. Quiero hacer un pedido.`;
  }

  return `https://wa.me/${PROMO_CONFIG.whatsappNumber}?text=${encodeURIComponent(text)}`;
}
