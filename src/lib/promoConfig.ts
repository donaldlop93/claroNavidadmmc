export type CategoryType = 'A' | 'B' | 'C';
export type DepartmentType = 'JINOTEGA' | 'SEBACO' | 'GRANADA' | 'MASAYA' | 'CARAZO' | 'RIVAS';
export type ZoneType = 'Zona Norte' | 'Zona Suroriente';

export interface CategoryPromoInfo {
  category: CategoryType;
  title: string;
  badgeColor: string;
  targetTae: number;
  targetSim: number;
  prizes: string[];
}

export interface DepartmentConfig {
  code: DepartmentType;
  displayName: string;
  zone: ZoneType;
  categories: Record<CategoryType, {
    targetTae: number;
    targetSim: number;
  }>;
  prizes: Record<CategoryType, string[]>;
}

// Official Prizes for Zona Norte (Jinotega y Sébaco)
const PRIZES_NORTE: Record<CategoryType, string[]> = {
  A: [
    '10 giftcards La Colonia de C$10,000',
    '1 refrigeradora Cetron 11 pies, 2 puertas',
    '3 microondas Frigidaire 0.6 ft³, blanco',
    '1 cocina de gas Murcia Plus, 4 quemadores',
    '1 televisor TCL 55" LED 4K UHD 55V6C',
  ],
  B: [
    '8 giftcards La Colonia de C$10,000',
    '4 licuadoras Black + Decker 1.65 L, rojas',
    '3 cafeteras Black + Decker, 12 tazas, blancas',
    '4 planchas TELSTAR',
    '1 televisor TCL 32" QLED FHD',
  ],
  C: [
    '4 giftcards Walmart de C$3,662.43 cada una',
  ],
};

// Official Prizes for Granada (Electrodomésticos y GiftCards según arte oficial)
const PRIZES_GRANADA: Record<CategoryType, string[]> = {
  A: [
    'Cocina de gas con horno',
    'Refrigeradora de 2 puertas',
    'Pantalla Smart TV LED',
    'Microondas para el hogar',
    'GiftCard de Supermercado',
  ],
  B: [
    'Licuadora de alta potencia',
    'Cafetera eléctrica de 12 tazas',
    'Plancha de vapor',
    'GiftCard de Supermercado',
  ],
  C: [
    'Plancha de vapor / Licuadora',
    'GiftCard de Supermercado para compras navideñas',
  ],
};

// Official Prizes for Masaya (SOLO GIFTCARDS de Supermercado según arte oficial)
const PRIZES_MASAYA: Record<CategoryType, string[]> = {
  A: [
    'GiftCard de Supermercado (Compras navideñas de alto valor)',
    'GiftCard de Supermercado para compras del hogar',
  ],
  B: [
    'GiftCard de Supermercado (Compras navideñas)',
    'GiftCard de Supermercado para surtido familiar',
  ],
  C: [
    'GiftCard de Supermercado para compras navideñas',
  ],
};

// Metas oficiales por Departamento y Categoría
export const DEPARTMENT_CONFIGS: Record<DepartmentType, DepartmentConfig> = {
  JINOTEGA: {
    code: 'JINOTEGA',
    displayName: 'Jinotega',
    zone: 'Zona Norte',
    categories: {
      A: { targetTae: 58418.66, targetSim: 12 },
      B: { targetTae: 20298.00, targetSim: 8 },
      C: { targetTae: 6613.90, targetSim: 5 },
    },
    prizes: PRIZES_NORTE,
  },
  SEBACO: {
    code: 'SEBACO',
    displayName: 'Sébaco',
    zone: 'Zona Norte',
    categories: {
      A: { targetTae: 58418.66, targetSim: 12 },
      B: { targetTae: 20298.00, targetSim: 8 },
      C: { targetTae: 6613.90, targetSim: 5 },
    },
    prizes: PRIZES_NORTE,
  },
  GRANADA: {
    code: 'GRANADA',
    displayName: 'Granada',
    zone: 'Zona Suroriente',
    categories: {
      A: { targetTae: 60365.00, targetSim: 12 },
      B: { targetTae: 20266.04, targetSim: 8 },
      C: { targetTae: 5565.06, targetSim: 5 },
    },
    prizes: PRIZES_GRANADA,
  },
  MASAYA: {
    code: 'MASAYA',
    displayName: 'Masaya',
    zone: 'Zona Suroriente',
    categories: {
      A: { targetTae: 61023.00, targetSim: 12 },
      B: { targetTae: 20952.55, targetSim: 8 },
      C: { targetTae: 6843.83, targetSim: 5 },
    },
    prizes: PRIZES_MASAYA,
  },
  CARAZO: {
    code: 'CARAZO',
    displayName: 'Carazo',
    zone: 'Zona Suroriente',
    categories: {
      A: { targetTae: 63565.00, targetSim: 12 },
      B: { targetTae: 21402.30, targetSim: 8 },
      C: { targetTae: 6712.12, targetSim: 5 },
    },
    prizes: PRIZES_MASAYA,
  },
  RIVAS: {
    code: 'RIVAS',
    displayName: 'Rivas',
    zone: 'Zona Suroriente',
    categories: {
      A: { targetTae: 55603.00, targetSim: 12 },
      B: { targetTae: 20805.05, targetSim: 8 },
      C: { targetTae: 5999.84, targetSim: 5 },
    },
    prizes: PRIZES_MASAYA,
  },
};

export const PROMO_CONFIG = {
  name: 'EL RETO NAVIDEÑO CLARO 2026',
  distributor: 'M&M Comunicaciones S.A.',
  distributorSubtitle: 'Distribuidor Autorizado de Claro Nicaragua',
  zones: ['Zona Norte', 'Zona Suroriente'] as ZoneType[],
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
      prizes: PRIZES_NORTE.A,
    },
    B: {
      category: 'B',
      title: 'Categoría B',
      badgeColor: 'bg-blue-600 text-white',
      targetTae: 20298.0,
      targetSim: 8,
      prizes: PRIZES_NORTE.B,
    },
    C: {
      category: 'C',
      title: 'Categoría C',
      badgeColor: 'bg-emerald-600 text-white',
      targetTae: 6613.9,
      targetSim: 5,
      prizes: PRIZES_NORTE.C,
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
  sucursal: string;
  departamento: DepartmentType;
  zona: ZoneType;
}

export interface ConsultaResponse {
  classifiedCount: number;
  record?: PosRecord;
  error?: string;
  message?: string;
}

/**
 * Normalizes sucursal text to DepartmentType
 */
export function normalizeDepartment(rawSucursal?: string | null): DepartmentType {
  if (!rawSucursal) return 'JINOTEGA';
  const clean = String(rawSucursal).toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
  if (clean.includes('GRANADA')) return 'GRANADA';
  if (clean.includes('MASAYA')) return 'MASAYA';
  if (clean.includes('CARAZO')) return 'CARAZO';
  if (clean.includes('RIVAS')) return 'RIVAS';
  if (clean.includes('SEBACO')) return 'SEBACO';
  return 'JINOTEGA';
}

/**
 * Gets specific target goals and prizes based on Department and Category
 */
export function getDepartmentCategoryMeta(
  department: DepartmentType | string,
  category: CategoryType
): {
  targetTae: number;
  targetSim: number;
  prizes: string[];
  displayName: string;
  zone: ZoneType;
} {
  const deptKey = normalizeDepartment(department);
  const deptConfig = DEPARTMENT_CONFIGS[deptKey] || DEPARTMENT_CONFIGS.JINOTEGA;
  const catConfig = deptConfig.categories[category] || deptConfig.categories.B;
  const prizes = deptConfig.prizes[category] || deptConfig.prizes.B;

  return {
    targetTae: catConfig.targetTae,
    targetSim: catConfig.targetSim,
    prizes,
    displayName: deptConfig.displayName,
    zone: deptConfig.zone,
  };
}

/**
 * Calculates remaining days until campaign closing (Dec 31, 2026).
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

export interface ExecutiveContact {
  name: string;
  phone: string;
  displayPhone: string;
}

/**
 * Returns official executive contact based on zone:
 * Norte (Jinotega, Sébaco) -> Cristian Rojas (84480260)
 * Suroriente (Granada, Masaya, Carazo, Rivas) -> Leonel Gaitán (83359575)
 */
export function getExecutiveForZone(zone: ZoneType): ExecutiveContact {
  if (zone === 'Zona Suroriente') {
    return {
      name: 'Leonel Gaitán',
      phone: '50583359575',
      displayPhone: '+505 8335-9575',
    };
  }
  return {
    name: 'Cristian Rojas',
    phone: '50584480260',
    displayPhone: '+505 8448-0260',
  };
}

/**
 * Generates official formatted WhatsApp message for sending directly to the client/PDR
 */
export function getClientWhatsAppShareMessage(record: PosRecord, webUrl?: string): string {
  const meta = getDepartmentCategoryMeta(record.departamento, record.categoria);
  const executive = getExecutiveForZone(meta.zone);
  const targetTae = meta.targetTae;
  const targetSim = meta.targetSim;
  const pctTae = Math.min(100, Math.round((record.taeActual / targetTae) * 100));
  const pctSim = Math.min(100, Math.round((record.simActual / targetSim) * 100));

  const missingTae = Math.max(0, targetTae - record.taeActual);
  const missingSim = Math.max(0, targetSim - record.simActual);
  const isClassified = record.taeActual >= targetTae && record.simActual >= targetSim;

  const daysLeft = Math.max(1, getRemainingDays());
  const dailyTae = missingTae > 0 ? missingTae / daysLeft : 0;
  const simFreq = missingSim > 0 ? Math.max(1, Math.floor(daysLeft / missingSim)) : 0;

  const posClean = record.pos.padStart(8, '0');
  const prizesList = meta.prizes.map((p) => `🎁 ${p}`).join('\n');

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
🏢 *Departamento:* ${meta.displayName}
⭐ *Categoría:* ${record.categoria}
⏳ *Días restantes:* ${daysLeft} días para el cierre (31 Dic 2026)

📊 *ESTADO DE TUS METAS:*
📱 *TAE:* ${formatCordobas(record.taeActual)} de ${formatCordobas(targetTae)} (*${pctTae}%*)
💳 *SIMs (> C$65):* ${record.simActual} de ${targetSim} SIMs (*${pctSim}%*)

${statusSection}
🏆 *PREMIOS DE TU CATEGORÍA (${record.categoria}):*
${prizesList}

🗓️ *Sorteo Electrónico:* 15 de enero de 2027
📞 *Consultar Saldo / Pedidos:* ${executive.name} (${executive.displayPhone})
${urlSection}
¡No dejés perder tus premios navideños! 🎅✨`;
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
 * Generates WhatsApp URL pre-filled message and executive info for orders / saldo
 */
export function getWhatsAppOrderInfo(record: PosRecord): {
  url: string;
  executive: ExecutiveContact;
} {
  const meta = getDepartmentCategoryMeta(record.departamento, record.categoria);
  const executive = getExecutiveForZone(meta.zone);
  const isClassified = record.taeActual >= meta.targetTae && record.simActual >= meta.targetSim;
  const posClean = record.pos.padStart(8, '0');

  let text = '';
  if (isClassified) {
    text = `Hola ${executive.name}, soy el POS ${posClean} (${record.cliente}) de ${meta.displayName}. Ya cumplí mi meta del Reto Navideño (Categoría ${record.categoria}) y quiero consultar saldo y hacer un nuevo pedido.`;
  } else {
    const missingTae = Math.max(0, meta.targetTae - record.taeActual);
    const missingSim = Math.max(0, meta.targetSim - record.simActual);
    text = `Hola ${executive.name}, soy el POS ${posClean} (${record.cliente}) de ${meta.displayName}. Estoy en Categoría ${record.categoria} del Reto Navideño y me faltan ${formatCordobas(missingTae)} en TAE y ${missingSim} SIM Cards (> C$65) para clasificar. Quiero consultar saldo y hacer un pedido.`;
  }

  return {
    url: `https://wa.me/${executive.phone}?text=${encodeURIComponent(text)}`,
    executive,
  };
}

/**
 * Generates WhatsApp URL pre-filled message for orders (backward-compatible)
 */
export function getWhatsAppOrderUrl(record: PosRecord): string {
  return getWhatsAppOrderInfo(record).url;
}
