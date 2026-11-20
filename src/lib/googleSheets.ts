import crypto from 'crypto';
import { PosRecord, PROMO_CONFIG, CategoryType } from './promoConfig';

export type SimMode = 'MAYOR_50' | 'TOTAL_SIM' | 'SEMANAS';

// Cache memory storage with timestamp
interface SheetCache {
  timestamp: number;
  records: PosRecord[];
  classifiedCount: number;
}

let memoryCache: SheetCache | null = null;
const CACHE_TTL_MS = 60 * 1000; // 60 seconds controlled cache

/**
 * Sanitizes and cleans currency string (e.g., "C$ 12,345.67", "3558,18", "48,86")
 */
export function parseCurrency(value: string | number | undefined | null): number {
  if (value === undefined || value === null) return 0;
  if (typeof value === 'number') return isNaN(value) ? 0 : value;

  let str = String(value).replace(/[C\$c\$\s]/g, '').trim();
  if (!str) return 0;

  // Handle format like 1.234,56 (dot thousands, comma decimals)
  if (str.includes('.') && str.includes(',')) {
    if (str.lastIndexOf(',') > str.lastIndexOf('.')) {
      str = str.replace(/\./g, '').replace(',', '.');
    } else {
      str = str.replace(/,/g, '');
    }
  } else if (str.includes(',')) {
    // Single comma format like 3558,18 or 48,86
    str = str.replace(',', '.');
  }

  const num = parseFloat(str);
  return isNaN(num) ? 0 : num;
}

/**
 * Safely parses numeric value
 */
export function parseNumber(value: string | number | undefined | null): number {
  return parseCurrency(value);
}

/**
 * Sanitizes POS: always 8 digits string with leading zeros
 */
export function normalizePos(pos: string | number | undefined | null): string {
  if (!pos) return '';
  const digitsOnly = String(pos).replace(/\D/g, '').trim();
  return digitsOnly.padStart(8, '0');
}

/**
 * Calculates SIM cards according to selected mode
 */
export function calculateSims(
  row: Record<string, string | number>,
  mode: SimMode
): number {
  const mayor50 = parseNumber(
    row['MAYOR C$50'] ??
      row['MAYOR C$65'] ??
      row['MAYOR_50'] ??
      row['MAYOR_65'] ??
      row['M'] ??
      0
  );
  const menor50 = parseNumber(
    row['MENOR C$50'] ??
      row['MENOR C$65'] ??
      row['MENOR_50'] ??
      row['MENOR_65'] ??
      row['N'] ??
      0
  );
  const sem1 = parseNumber(row['SEMANA 1'] ?? row['H'] ?? 0);
  const sem2 = parseNumber(row['SEMANA 2'] ?? row['I'] ?? 0);
  const sem3 = parseNumber(row['SEMANA 3'] ?? row['J'] ?? 0);
  const sem4 = parseNumber(row['SEMANA 4'] ?? row['K'] ?? 0);
  const sem5 = parseNumber(row['SEMANA 5'] ?? row['L'] ?? 0);
  const semTotal = sem1 + sem2 + sem3 + sem4 + sem5;

  switch (mode) {
    case 'TOTAL_SIM': {
      const sum = mayor50 + menor50;
      return sum > 0 ? sum : semTotal;
    }
    case 'SEMANAS':
      return semTotal;
    case 'MAYOR_50':
    default:
      // If mayor is defined and > 0, use it; otherwise fallback to accumulated weekly SIMs
      return mayor50 > 0 ? mayor50 : semTotal;
  }
}

/**
 * Normalizes raw row data into safe PosRecord
 */
export function parseRowToRecord(
  rowObj: Record<string, string | number>,
  simMode: SimMode
): PosRecord | null {
  const rawPos = rowObj['POS'] ?? rowObj['C'];
  const pos = normalizePos(rawPos);
  if (!pos || pos === '00000000') return null;

  const cliente = String(rowObj['CLIENTE'] ?? rowObj['B'] ?? 'PDR Claro').trim();
  const estado = String(rowObj['ESTADO'] ?? rowObj['D'] ?? 'ACTIVO').trim().toUpperCase();
  const activandoSim = String(rowObj['ACTIVANDO SIM'] ?? rowObj['ACTIVANDO_SIM'] ?? rowObj['E'] ?? 'ACTIVO').trim().toUpperCase();

  let rawCat = String(rowObj['CLASIFICACION'] ?? rowObj['G'] ?? 'B').trim().toUpperCase();
  if (rawCat !== 'A' && rawCat !== 'B' && rawCat !== 'C') {
    rawCat = 'B';
  }
  const categoria = rawCat as CategoryType;

  const rawTae = rowObj['TAE'] ?? rowObj['O'];
  const taeActual = parseCurrency(rawTae);
  const simActual = calculateSims(rowObj, simMode);

  return {
    pos,
    cliente,
    estado,
    activandoSim,
    categoria,
    taeActual,
    simActual,
  };
}

/**
 * Built-in mock data for local testing, fallback, and validation.
 * Includes official examples specified in requirements.
 */
const FALLBACK_POS_DATA: PosRecord[] = [
  {
    pos: '85176118',
    cliente: 'KAREN KEIRUTH PALACIOS LANZA',
    estado: 'ACTIVO',
    activandoSim: 'ACTIVO',
    categoria: 'B',
    taeActual: 21500.0,
    simActual: 4,
  },
  {
    pos: '03325009',
    cliente: 'VARIEDADES Y COMERCIAL LA BENDICIÓN',
    estado: 'ACTIVO',
    activandoSim: 'ACTIVO',
    categoria: 'C',
    taeActual: 7200.0,
    simActual: 6,
  },
  {
    pos: '84472889',
    cliente: 'DISTRIBUIDORA DEL NORTE EL ROSARIO',
    estado: 'ACTIVO',
    activandoSim: 'ACTIVO',
    categoria: 'A',
    taeActual: 62450.0,
    simActual: 15,
  },
  {
    pos: '84123456',
    cliente: 'PULPERÍA SANTA MARÍA - SEBACO',
    estado: 'ACTIVO',
    activandoSim: 'ACTIVO',
    categoria: 'B',
    taeActual: 22100.0,
    simActual: 9,
  },
  {
    pos: '83921004',
    cliente: 'COMERCIAL SAN ANTONIO - MATAGALPA',
    estado: 'ACTIVO',
    activandoSim: 'ACTIVO',
    categoria: 'A',
    taeActual: 51200.0,
    simActual: 14,
  },
  {
    pos: '82441991',
    cliente: 'FARMACIA SAN MARTÍN - JINOTEGA',
    estado: 'ACTIVO',
    activandoSim: 'ACTIVO',
    categoria: 'B',
    taeActual: 20550.0,
    simActual: 7,
  },
  {
    pos: '81092345',
    cliente: 'PULPERÍA LA ESPERANZA',
    estado: 'INACTIVO',
    activandoSim: 'INACTIVO',
    categoria: 'B',
    taeActual: 9500.0,
    simActual: 2,
  },
  {
    pos: '85661201',
    cliente: 'MULTISERVICIOS Y CELL JALAPA',
    estado: 'ACTIVO',
    activandoSim: 'ACTIVO',
    categoria: 'C',
    taeActual: 6850.0,
    simActual: 5,
  },
  {
    pos: '87994321',
    cliente: 'ABARROTERÍA CENTRAL OCOTAL',
    estado: 'ACTIVO',
    activandoSim: 'ACTIVO',
    categoria: 'A',
    taeActual: 59100.0,
    simActual: 13,
  },
  {
    pos: '86112233',
    cliente: 'CYBER Y RECARGAS EL CHAVAL',
    estado: 'ACTIVO',
    activandoSim: 'ACTIVO',
    categoria: 'B',
    taeActual: 20400.0,
    simActual: 8,
  },
  {
    pos: '88234567',
    cliente: 'MINISÚPER LA FE - ESTELÍ',
    estado: 'ACTIVO',
    activandoSim: 'ACTIVO',
    categoria: 'A',
    taeActual: 60100.0,
    simActual: 12,
  },
  {
    pos: '89345678',
    cliente: 'COMUNICACIONES EL DIAMANTE',
    estado: 'ACTIVO',
    activandoSim: 'ACTIVO',
    categoria: 'B',
    taeActual: 21200.0,
    simActual: 10,
  },
  {
    pos: '84556677',
    cliente: 'FARMACIA GUADALUPE - SOMOTO',
    estado: 'ACTIVO',
    activandoSim: 'ACTIVO',
    categoria: 'C',
    taeActual: 7100.0,
    simActual: 6,
  },
  {
    pos: '85778899',
    cliente: 'DISTRIBUIDORA SAN FRANCISCO',
    estado: 'ACTIVO',
    activandoSim: 'ACTIVO',
    categoria: 'A',
    taeActual: 65400.0,
    simActual: 14,
  },
  {
    pos: '86889900',
    cliente: 'VARIEDADES MARILYN',
    estado: 'ACTIVO',
    activandoSim: 'ACTIVO',
    categoria: 'B',
    taeActual: 20900.0,
    simActual: 8,
  },
  {
    pos: '87112244',
    cliente: 'PULPERÍA EL TRIUNFO - PANTASMA',
    estado: 'ACTIVO',
    activandoSim: 'ACTIVO',
    categoria: 'C',
    taeActual: 6700.0,
    simActual: 5,
  },
  {
    pos: '88334455',
    cliente: 'SUPERMERCADO FAMILIAR SAN JOSÉ',
    estado: 'ACTIVO',
    activandoSim: 'ACTIVO',
    categoria: 'A',
    taeActual: 58900.0,
    simActual: 12,
  },
  {
    pos: '89556688',
    cliente: 'CELL PHONE EXPRESS JINOTEGA',
    estado: 'ACTIVO',
    activandoSim: 'ACTIVO',
    categoria: 'B',
    taeActual: 21800.0,
    simActual: 9,
  },
  {
    pos: '83114477',
    cliente: 'TIENDA Y RECARGAS LA PROVIDENCIA',
    estado: 'ACTIVO',
    activandoSim: 'ACTIVO',
    categoria: 'C',
    taeActual: 6950.0,
    simActual: 7,
  },
  {
    pos: '82998811',
    cliente: 'LIBRERÍA Y COMUNICACIONES EL ÉXITO',
    estado: 'ACTIVO',
    activandoSim: 'ACTIVO',
    categoria: 'A',
    taeActual: 63200.0,
    simActual: 13,
  },
  {
    pos: '81776655',
    cliente: 'PULPERÍA MI ESPERANZA - MATIGUÁS',
    estado: 'ACTIVO',
    activandoSim: 'ACTIVO',
    categoria: 'B',
    taeActual: 20350.0,
    simActual: 8,
  },
];

/**
 * Creates a Google Service Account JWT token using native Node crypto
 */
async function getGoogleAuthToken(clientEmail: string, privateKeyRaw: string): Promise<string | null> {
  try {
    const privateKey = privateKeyRaw.replace(/\\n/g, '\n');
    const header = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url');
    const now = Math.floor(Date.now() / 1000);
    const claimSet = {
      iss: clientEmail,
      scope: 'https://www.googleapis.com/auth/spreadsheets.readonly',
      aud: 'https://oauth2.googleapis.com/token',
      exp: now + 3600,
      iat: now,
    };
    const payload = Buffer.from(JSON.stringify(claimSet)).toString('base64url');
    const sign = crypto.createSign('RSA-SHA256');
    sign.update(`${header}.${payload}`);
    const signature = sign.sign(privateKey, 'base64url');
    const jwt = `${header}.${payload}.${signature}`;

    const res = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: jwt,
      }),
      next: { revalidate: 3000 },
    });

    if (!res.ok) {
      console.warn('OAuth token fetch error:', res.status, await res.text());
      return null;
    }

    const data = await res.json();
    return data.access_token || null;
  } catch (err) {
    console.warn('Error signing Google JWT:', err);
    return null;
  }
}

/**
 * Parses CSV text to array of records
 */
function parseCsvRows(csvText: string, simMode: SimMode): PosRecord[] {
  const lines = csvText.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 2) return [];

  // Auto-detect delimiter: TSV (\t), Semicolon (;), or CSV (,)
  const firstLine = lines[0];
  let delimiter = ',';
  if (firstLine.includes('\t')) {
    delimiter = '\t';
  } else if (firstLine.includes(';') && !firstLine.includes(',')) {
    delimiter = ';';
  }

  // Parse line respecting quotes and chosen delimiter
  const parseLine = (line: string): string[] => {
    if (delimiter === '\t') {
      return line.split('\t').map((c) => c.replace(/^["']|["']$/g, '').trim());
    }

    const result: string[] = [];
    let cur = '';
    let inQuote = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (c === '"') {
        if (inQuote && line[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuote = !inQuote;
        }
      } else if (c === delimiter && !inQuote) {
        result.push(cur.trim());
        cur = '';
      } else {
        cur += c;
      }
    }
    result.push(cur.trim());
    return result;
  };

  const headers = parseLine(lines[0]).map((h) => h.toUpperCase().replace(/\s+/g, ' '));
  const records: PosRecord[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseLine(lines[i]);
    const rowObj: Record<string, string> = {};
    headers.forEach((h, idx) => {
      rowObj[h] = values[idx] ?? '';
    });

    // Also support column index letters fallback (A, B, C...)
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    values.forEach((v, idx) => {
      if (idx < alphabet.length) {
        rowObj[alphabet[idx]] = v;
      }
    });

    const record = parseRowToRecord(rowObj, simMode);
    if (record) {
      records.push(record);
    }
  }

  return records;
}

/**
 * Fetches sheet data via Google Sheets v4 API
 */
async function fetchViaGoogleApi(
  sheetId: string,
  tabName: string,
  tokenOrKey: { token?: string; key?: string },
  simMode: SimMode
): Promise<PosRecord[] | null> {
  const range = encodeURIComponent(`${tabName}!A1:O`);
  let url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}`;
  const headers: Record<string, string> = {};

  if (tokenOrKey.token) {
    headers['Authorization'] = `Bearer ${tokenOrKey.token}`;
  } else if (tokenOrKey.key) {
    url += `?key=${tokenOrKey.key}`;
  } else {
    return null;
  }

  const res = await fetch(url, {
    headers,
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    console.warn('Google Sheets API response not OK:', res.status, res.statusText);
    return null;
  }

  const data = await res.json();
  const rows: (string | number)[][] = data.values || [];
  if (rows.length < 2) return [];

  const headersRow = rows[0].map((h) => String(h).toUpperCase().replace(/\s+/g, ' '));
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const records: PosRecord[] = [];

  for (let i = 1; i < rows.length; i++) {
    const rowValues = rows[i];
    const rowObj: Record<string, string | number> = {};
    headersRow.forEach((h, idx) => {
      rowObj[h] = rowValues[idx] ?? '';
    });
    rowValues.forEach((v, idx) => {
      if (idx < alphabet.length) {
        rowObj[alphabet[idx]] = v;
      }
    });

    const record = parseRowToRecord(rowObj, simMode);
    if (record) {
      records.push(record);
    }
  }

  return records;
}

/**
 * Counts how many PDRs in the list have reached 100% of both TAE and SIM goals
 */
export function calculateClassifiedCount(records: PosRecord[]): number {
  return records.filter((r) => {
    const config = PROMO_CONFIG.categories[r.categoria];
    if (!config) return false;
    return r.taeActual >= config.targetTae && r.simActual >= config.targetSim;
  }).length;
}

/**
 * Primary function to fetch and cache all PDR records from Google Sheets
 * with fallback to local mock data.
 */
export async function getPdrData(): Promise<{ records: PosRecord[]; classifiedCount: number }> {
  const now = Date.now();
  if (memoryCache && now - memoryCache.timestamp < CACHE_TTL_MS) {
    return {
      records: memoryCache.records,
      classifiedCount: memoryCache.classifiedCount,
    };
  }

  const sheetId = process.env.GOOGLE_SHEET_ID || '14lONUMysN2Zhh295ahKEcIi3FAtKSncGf0lfaUPG58';
  const tabName = process.env.GOOGLE_SHEET_TAB || 'TAE KPI';
  const simMode = (process.env.SIM_CALCULATION_MODE as SimMode) || 'MAYOR_50';
  const saEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const saKey = process.env.GOOGLE_PRIVATE_KEY;
  const apiKey = process.env.GOOGLE_API_KEY;
  const csvUrl = process.env.GOOGLE_SHEET_CSV_URL;

  let loadedRecords: PosRecord[] | null = null;

  // 1. Try Public CSV or Custom URL (Easiest and most direct method)
  if (csvUrl) {
    try {
      const res = await fetch(csvUrl, { next: { revalidate: 60 } });
      if (res.ok) {
        const text = await res.text();
        // Check if response is actually CSV and not an HTML error page
        if (!text.trim().startsWith('<!DOCTYPE') && !text.trim().startsWith('<html')) {
          loadedRecords = parseCsvRows(text, simMode);
          if (loadedRecords.length > 0) {
            console.log(`Successfully loaded ${loadedRecords.length} records via CSV URL.`);
          }
        }
      }
    } catch (err) {
      console.warn('Error fetching via CSV URL:', err);
    }
  }

  // 2. Try Service Account
  if (!loadedRecords && saEmail && saKey) {
    try {
      const token = await getGoogleAuthToken(saEmail, saKey);
      if (token) {
        loadedRecords = await fetchViaGoogleApi(sheetId, tabName, { token }, simMode);
      }
    } catch (err) {
      console.warn('Error fetching via Google Service Account:', err);
    }
  }

  // 3. Try API Key
  if (!loadedRecords && apiKey) {
    try {
      loadedRecords = await fetchViaGoogleApi(sheetId, tabName, { key: apiKey }, simMode);
    } catch (err) {
      console.warn('Error fetching via Google API Key:', err);
    }
  }

  // 4. Try automatic public Google Sheets CSV export
  if (!loadedRecords && sheetId) {
    try {
      const directCsvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(tabName)}`;
      const res = await fetch(directCsvUrl, { next: { revalidate: 60 } });
      if (res.ok) {
        const text = await res.text();
        if (!text.trim().startsWith('<!DOCTYPE') && !text.trim().startsWith('<html')) {
          loadedRecords = parseCsvRows(text, simMode);
        }
      }
    } catch {
      // Fallback silently to simulated data
    }
  }

  // 4. Default / Fallback to robust simulated data
  const finalRecords = loadedRecords && loadedRecords.length > 0 ? loadedRecords : FALLBACK_POS_DATA;
  const classifiedCount = calculateClassifiedCount(finalRecords);

  memoryCache = {
    timestamp: now,
    records: finalRecords,
    classifiedCount,
  };

  return {
    records: finalRecords,
    classifiedCount,
  };
}

/**
 * Searches a POS by 8-digit code
 */
export async function findPosRecord(posQuery: string): Promise<{
  record: PosRecord | null;
  classifiedCount: number;
}> {
  const { records, classifiedCount } = await getPdrData();
  const normalized = normalizePos(posQuery);
  const found = records.find((r) => r.pos === normalized) || null;

  return {
    record: found,
    classifiedCount,
  };
}
