import crypto from 'crypto';
import {
  PosRecord,
  CategoryType,
  DepartmentType,
  ZoneType,
  normalizeDepartment,
  getDepartmentCategoryMeta,
} from './promoConfig';

export type SimMode = 'MAYOR_65' | 'MAYOR_50' | 'TOTAL_SIM' | 'SEMANAS';

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
 * Calculates SIM cards: reads directly Column M (MAYOR C$65)
 */
export function calculateSims(
  row: Record<string, string | number>,
  _mode?: SimMode
): number {
  // Strictly read Column M (MAYOR C$65)
  const mayor65 = parseNumber(
    row['MAYOR C$65'] ??
      row['MAYOR C$50'] ??
      row['MAYOR_65'] ??
      row['MAYOR_50'] ??
      row['M'] ??
      0
  );

  return mayor65;
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

  const rawTae = parseCurrency(rowObj['TAE'] ?? rowObj['O']);
  // Convert from USD to Cordobas (tipo de cambio oficial 36.6243)
  const exchangeRate = parseFloat(process.env.EXCHANGE_RATE || '36.6243');
  const taeActual = Math.round(rawTae * exchangeRate * 100) / 100;
  const simActual = calculateSims(rowObj, simMode);

  const sucursalRaw = String(rowObj['SUCURSAL'] ?? rowObj['F'] ?? '').trim();
  const departamento = normalizeDepartment(sucursalRaw);
  const zona: ZoneType =
    departamento === 'GRANADA' ||
    departamento === 'MASAYA' ||
    departamento === 'CARAZO' ||
    departamento === 'RIVAS'
      ? 'Zona Suroriente'
      : 'Zona Norte';
  const sucursal = sucursalRaw || departamento;

  return {
    pos,
    cliente,
    estado,
    activandoSim,
    categoria,
    taeActual,
    simActual,
    sucursal,
    departamento,
    zona,
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
    sucursal: 'JINOTEGA',
    departamento: 'JINOTEGA',
    zona: 'Zona Norte',
  },
  {
    pos: '03325009',
    cliente: 'VARIEDADES Y COMERCIAL LA BENDICIÓN',
    estado: 'ACTIVO',
    activandoSim: 'ACTIVO',
    categoria: 'C',
    taeActual: 7200.0,
    simActual: 6,
    sucursal: 'JINOTEGA',
    departamento: 'JINOTEGA',
    zona: 'Zona Norte',
  },
  {
    pos: '84472889',
    cliente: 'DISTRIBUIDORA DEL NORTE EL ROSARIO',
    estado: 'ACTIVO',
    activandoSim: 'ACTIVO',
    categoria: 'A',
    taeActual: 62450.0,
    simActual: 15,
    sucursal: 'JINOTEGA',
    departamento: 'JINOTEGA',
    zona: 'Zona Norte',
  },
  {
    pos: '84123456',
    cliente: 'PULPERÍA SANTA MARÍA - SEBACO',
    estado: 'ACTIVO',
    activandoSim: 'ACTIVO',
    categoria: 'B',
    taeActual: 22100.0,
    simActual: 9,
    sucursal: 'SÉBACO',
    departamento: 'SEBACO',
    zona: 'Zona Norte',
  },
  {
    pos: '83921004',
    cliente: 'COMERCIAL GRANADA CENTRO',
    estado: 'ACTIVO',
    activandoSim: 'ACTIVO',
    categoria: 'A',
    taeActual: 61200.0,
    simActual: 13,
    sucursal: 'GRANADA',
    departamento: 'GRANADA',
    zona: 'Zona Suroriente',
  },
  {
    pos: '82441991',
    cliente: 'FARMACIA SAN MARTÍN - MASAYA',
    estado: 'ACTIVO',
    activandoSim: 'ACTIVO',
    categoria: 'B',
    taeActual: 21550.0,
    simActual: 8,
    sucursal: 'MASAYA',
    departamento: 'MASAYA',
    zona: 'Zona Suroriente',
  },
  {
    pos: '85661201',
    cliente: 'MULTISERVICIOS Y CELL GRANADA',
    estado: 'ACTIVO',
    activandoSim: 'ACTIVO',
    categoria: 'C',
    taeActual: 5850.0,
    simActual: 5,
    sucursal: 'GRANADA',
    departamento: 'GRANADA',
    zona: 'Zona Suroriente',
  },
  {
    pos: '87994321',
    cliente: 'ABARROTERÍA CENTRAL MASAYA',
    estado: 'ACTIVO',
    activandoSim: 'ACTIVO',
    categoria: 'C',
    taeActual: 6900.0,
    simActual: 5,
    sucursal: 'MASAYA',
    departamento: 'MASAYA',
    zona: 'Zona Suroriente',
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
    const meta = getDepartmentCategoryMeta(r.departamento, r.categoria);
    return r.taeActual >= meta.targetTae && r.simActual >= meta.targetSim;
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
  const simMode = (process.env.SIM_CALCULATION_MODE as SimMode) || 'MAYOR_65';
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
