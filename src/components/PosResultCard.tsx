'use client';

import React, { useState } from 'react';
import {
  PosRecord,
  PROMO_CONFIG,
  formatCordobas,
  getRemainingDays,
  getWhatsAppOrderUrl,
  getClientWhatsAppShareMessage,
  getClientWhatsAppShareUrl,
} from '@/lib/promoConfig';
import { ConfettiCelebration } from './ConfettiCelebration';

interface PosResultCardProps {
  record: PosRecord;
  onReset: () => void;
}

export function PosResultCard({ record, onReset }: PosResultCardProps) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);
  const [clientPhone, setClientPhone] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const catConfig = PROMO_CONFIG.categories[record.categoria] || PROMO_CONFIG.categories.B;

  const targetTae = catConfig.targetTae;
  const targetSim = catConfig.targetSim;

  const taeActual = record.taeActual;
  const simActual = record.simActual;

  const pctTae = Math.min(100, Math.round((taeActual / targetTae) * 100));
  const pctSim = Math.min(100, Math.round((simActual / targetSim) * 100));

  const missingTae = Math.max(0, targetTae - taeActual);
  const missingSim = Math.max(0, targetSim - simActual);

  const daysLeft = Math.max(1, getRemainingDays());

  // Suggested daily pace
  const dailyTaeSuggested = missingTae > 0 ? missingTae / daysLeft : 0;
  const simFrequencyDays = missingSim > 0 ? Math.max(1, Math.floor(daysLeft / missingSim)) : 0;

  // Status conditions
  const isTaeDone = taeActual >= targetTae;
  const isSimDone = simActual >= targetSim;
  const isClassified = isTaeDone && isSimDone;

  const isNearlyDone = !isClassified && (pctTae >= 80 || pctSim >= 80);
  const hasDesbalance = (isTaeDone && !isSimDone) || (!isTaeDone && isSimDone);

  const isInactive = record.estado === 'INACTIVO';
  const isSimInactive = record.activandoSim === 'INACTIVO';

  const currentWebUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}?pos=${record.pos.padStart(8, '0')}`
      : `https://claronavidadmmc.vercel.app?pos=${record.pos.padStart(8, '0')}`;

  const waUrl = getWhatsAppOrderUrl(record);
  const clientWaMessage = getClientWhatsAppShareMessage(record, currentWebUrl);

  // Normalize client phone (prepend 505 for Nicaragua if 8 digits)
  const normalizedClientPhone = () => {
    const digits = clientPhone.replace(/\D/g, '');
    if (!digits) return '';
    if (digits.length === 8) return `505${digits}`;
    return digits;
  };

  const clientWaUrl = getClientWhatsAppShareUrl(record, currentWebUrl, normalizedClientPhone());

  // Share web link
  const handleShareLink = async () => {
    const url = currentWebUrl;
    const title = `Avance Reto Navideño Claro - POS ${record.pos}`;
    const text = `Consulta el avance del POS ${record.pos} (${record.cliente}) en el Reto Navideño Claro 2026.`;

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch {
        // Fallback to clipboard
      }
    }

    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(url);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2500);
      } catch {
        // Ignore clipboard failure
      }
    }
  };

  // Copy full formatted WhatsApp message to clipboard
  const handleCopyMessage = async () => {
    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(clientWaMessage);
        setCopiedMessage(true);
        setTimeout(() => setCopiedMessage(false), 2500);
      } catch {
        // Fallback
      }
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Confetti if classified */}
      {isClassified && <ConfettiCelebration trigger={true} />}

      {/* Main Result Card */}
      <div className="bg-white rounded-2xl shadow-md border border-slate-200/90 overflow-hidden festive-ribbon-border transition-all">
        {/* Customer Header info */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white relative">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs uppercase font-extrabold px-2.5 py-0.5 rounded-md bg-red-600 text-white shadow-xs">
                  POS {record.pos.padStart(8, '0')}
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-amber-400 text-slate-900">
                  Categoría {record.categoria}
                </span>
                {isInactive && (
                  <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-red-800 text-red-100 border border-red-500">
                    INACTIVO
                  </span>
                )}
              </div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white capitalize drop-shadow-xs">
                {record.cliente.toLowerCase()}
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                Cartera M&M Comunicaciones S.A. • Zona Norte
              </p>
            </div>

            {/* Quick action buttons: WhatsApp to Client, Copy Link, Change POS */}
            <div className="flex flex-wrap items-center gap-1.5 self-start sm:self-center">
              <a
                href={clientWaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold shadow-xs transition-all active:scale-95"
                title="Enviar reporte completo con avance y premios al cliente por WhatsApp"
              >
                <span>📲</span>
                <span>Enviar por WA</span>
              </a>

              <button
                type="button"
                onClick={handleShareLink}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium border border-white/20 transition-all active:scale-95"
                title="Copiar enlace de consulta directa"
              >
                <span>{copiedLink ? '✅' : '🔗'}</span>
                <span>{copiedLink ? '¡Copiado!' : 'Enlace'}</span>
              </button>

              <button
                type="button"
                onClick={onReset}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-600/80 hover:bg-red-600 text-white text-xs font-medium border border-red-400/40 transition-all active:scale-95"
              >
                <span>🔍</span>
                <span>Otro POS</span>
              </button>
            </div>
          </div>
        </div>

        {/* Psychological Status Banners */}
        <div className="p-4 sm:p-6 space-y-4">
          {/* Status 1: Classified 100% both */}
          {isClassified && (
            <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-600 to-green-700 text-white shadow-sm flex items-start gap-3 golden-glow">
              <span className="text-2xl">🎉</span>
              <div>
                <h3 className="text-sm sm:text-base font-extrabold leading-tight">
                  ¡CLASIFICADO! Cumpliste el 100% en ambas metas
                </h3>
                <p className="text-xs text-emerald-100 mt-1">
                  Tu Punto de Venta ya tiene su boleto virtual asegurado para el sorteo del <strong>15 de enero de 2027</strong>.
                  ¡Mantené tu ritmo para continuar liderando la Zona Norte!
                </p>
              </div>
            </div>
          )}

          {/* Status 2: Desbalance alert */}
          {!isClassified && hasDesbalance && (
            <div className="p-4 rounded-xl bg-amber-500 text-slate-950 border border-amber-600 shadow-sm flex items-start gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <h3 className="text-sm sm:text-base font-extrabold leading-tight">
                  {isTaeDone
                    ? '¡Ya tenés lista tu meta de TAE!'
                    : '¡Ya tenés lista tu meta de SIM Cards!'}
                </h3>
                <p className="text-xs text-slate-900 mt-1 font-medium">
                  {isTaeDone
                    ? `No dejés perder tus premios: solo te faltan ${missingSim} SIM Cards (> C$65) para entrar al sorteo oficial.`
                    : `No dejés perder tus premios: solo te faltan ${formatCordobas(missingTae)} en TAE para entrar al sorteo oficial.`}
                </p>
              </div>
            </div>
          )}

          {/* Status 3: Almost there (>= 80% and < 100%) */}
          {!isClassified && !hasDesbalance && isNearlyDone && (
            <div className="p-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 text-white shadow-sm flex items-start gap-3">
              <span className="text-2xl">🔥</span>
              <div>
                <h3 className="text-sm sm:text-base font-extrabold leading-tight">
                  ¡Estás a un paso de clasificar!
                </h3>
                <p className="text-xs text-red-100 mt-1">
                  Tu avance supera el 80%. Quedan solo <strong>{daysLeft} días</strong> para asegurar tus premios de Categoría {record.categoria}.
                </p>
              </div>
            </div>
          )}

          {/* Status 4: In Progress standard */}
          {!isClassified && !hasDesbalance && !isNearlyDone && (
            <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 flex items-start gap-2.5">
              <span className="text-xl">🎅</span>
              <div>
                <h3 className="text-xs sm:text-sm font-bold leading-tight">
                  Reto Navideño en marcha
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-600 mt-0.5">
                  Seguí las recomendaciones de ritmo diario para asegurar tu participación en el sorteo de Zona Norte.
                </p>
              </div>
            </div>
          )}

          {/* Inactive Warnings */}
          {isInactive && (
            <div className="p-3 rounded-lg bg-red-100 border border-red-300 text-red-800 text-xs flex items-center gap-2">
              <span>🚨</span>
              <span>
                <strong>Aviso de Cartera:</strong> Tu POS figura en estado INACTIVO. Contactá a tu ejecutivo de ruta para regularizar tu estatus.
              </span>
            </div>
          )}
          {isSimInactive && (
            <div className="p-3 rounded-lg bg-amber-100 border border-amber-300 text-amber-900 text-xs flex items-center gap-2">
              <span>💳</span>
              <span>
                <strong>Alerta SIM:</strong> La función de activación de SIM figura inactiva. Verificá con Cristian Rojas o tu supervisor de zona.
              </span>
            </div>
          )}

          {/* Progress Bars Section */}
          <div className="space-y-4 pt-2">
            {/* 1. TAE Progress Bar */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-base">📱</span>
                  <span className="text-xs sm:text-sm font-bold text-slate-800">
                    Avance TAE (Tiempo Aire)
                  </span>
                </div>
                <span
                  className={`text-xs font-black px-2 py-0.5 rounded-full ${
                    pctTae >= 100
                      ? 'bg-emerald-100 text-emerald-800'
                      : pctTae >= 80
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {pctTae}%
                </span>
              </div>

              {/* Bar */}
              <div className="w-full h-4 bg-slate-200 rounded-full overflow-hidden p-0.5 shadow-inner">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    pctTae >= 100
                      ? 'bg-emerald-500'
                      : pctTae >= 80
                      ? 'bg-red-600 animate-shimmer'
                      : 'bg-red-500'
                  }`}
                  style={{ width: `${pctTae}%` }}
                />
              </div>

              {/* Details & Pace */}
              <div className="mt-2 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1">
                <div className="text-slate-600">
                  Actual: <strong className="text-slate-900">{formatCordobas(taeActual)}</strong> / Meta:{' '}
                  <span className="text-slate-700">{formatCordobas(targetTae)}</span>
                </div>
                <div className="font-semibold text-slate-700">
                  {missingTae > 0 ? (
                    <span className="text-red-700">Faltan: {formatCordobas(missingTae)}</span>
                  ) : (
                    <span className="text-emerald-700 font-bold">¡Meta TAE Cumplida! ✓</span>
                  )}
                </div>
              </div>

              {/* Suggested daily pace TAE */}
              {missingTae > 0 && (
                <div className="mt-2.5 pt-2 border-t border-slate-200/70 text-xs font-medium text-slate-700 flex items-center gap-1.5">
                  <span className="text-red-600">🎄</span>
                  <span>
                    Ritmo sugerido:{' '}
                    <strong className="text-red-600 font-bold">
                      ~{formatCordobas(dailyTaeSuggested)} / día
                    </strong>{' '}
                    (en los {daysLeft} días restantes).
                  </span>
                </div>
              )}
            </div>

            {/* 2. SIM Cards Progress Bar */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-base">💳</span>
                  <span className="text-xs sm:text-sm font-bold text-slate-800">
                    Avance SIM Cards (&gt; C$65)
                  </span>
                </div>
                <span
                  className={`text-xs font-black px-2 py-0.5 rounded-full ${
                    pctSim >= 100
                      ? 'bg-emerald-100 text-emerald-800'
                      : pctSim >= 80
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {pctSim}%
                </span>
              </div>

              {/* Bar */}
              <div className="w-full h-4 bg-slate-200 rounded-full overflow-hidden p-0.5 shadow-inner">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    pctSim >= 100
                      ? 'bg-emerald-500'
                      : pctSim >= 80
                      ? 'bg-amber-500 animate-shimmer'
                      : 'bg-amber-500'
                  }`}
                  style={{ width: `${pctSim}%` }}
                />
              </div>

              {/* Details & Pace */}
              <div className="mt-2 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1">
                <div className="text-slate-600">
                  Actual: <strong className="text-slate-900">{simActual} SIMs (&gt; C$65)</strong> / Meta:{' '}
                  <span className="text-slate-700">{targetSim} SIMs (&gt; C$65)</span>
                </div>
                <div className="font-semibold text-slate-700">
                  {missingSim > 0 ? (
                    <span className="text-red-700">Faltan: {missingSim} SIMs (&gt; C$65)</span>
                  ) : (
                    <span className="text-emerald-700 font-bold">¡Meta SIM Cumplida! ✓</span>
                  )}
                </div>
              </div>

              {/* Suggested pace SIM */}
              {missingSim > 0 && (
                <div className="mt-2.5 pt-2 border-t border-slate-200/70 text-xs font-medium text-slate-700 flex items-center gap-1.5">
                  <span className="text-amber-600">🎄</span>
                  <span>
                    Ritmo sugerido:{' '}
                    <strong className="text-amber-700 font-bold">
                      activar 1 SIM (&gt; C$65) cada {simFrequencyDays} {simFrequencyDays === 1 ? 'día' : 'días'}
                    </strong>{' '}
                    para asegurar la meta.
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Section: Direct Share to Client via WhatsApp */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 border border-emerald-300 shadow-xs space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">📲</span>
                <div>
                  <h4 className="text-sm sm:text-base font-extrabold text-slate-800 flex items-center gap-1.5">
                    <span>Enviar Reporte al Cliente por WhatsApp</span>
                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-full bg-emerald-600 text-white">
                      Oficial
                    </span>
                  </h4>
                  <p className="text-[11px] sm:text-xs text-slate-600 mt-0.5">
                    Envía a <strong>{record.cliente}</strong> su avance en TAE y SIMs (&gt; C$65), ritmo diario y la lista completa de premios de Categoría {record.categoria}.
                  </p>
                </div>
              </div>
            </div>

            {/* Optional Client Phone Input */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Número de WhatsApp del cliente (opcional):
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">
                    🇳🇮 +505
                  </span>
                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    placeholder="8888 8888 (o dejar vacío para elegir contacto en WhatsApp)"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="w-full pl-20 pr-3 py-2 text-xs sm:text-sm font-semibold text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500 shadow-inner"
                  />
                </div>
              </div>
            </div>

            {/* Main Action: Send to Client WhatsApp */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <a
                href={clientWaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-3 rounded-lg bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98]"
              >
                <span>📲</span>
                <span>Enviar al WhatsApp del Cliente</span>
              </a>

              <button
                type="button"
                onClick={handleCopyMessage}
                className="py-2.5 px-3 rounded-lg bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-[0.98]"
              >
                <span>{copiedMessage ? '✅' : '📋'}</span>
                <span>{copiedMessage ? '¡Mensaje Copiado!' : 'Copiar Texto Completo'}</span>
              </button>
            </div>

            {/* Toggle Preview */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="text-[11px] text-emerald-800 hover:text-emerald-950 font-bold underline cursor-pointer inline-flex items-center gap-1"
              >
                <span>{showPreview ? '▲ Ocultar vista previa del mensaje' : '👁️ Ver vista previa del mensaje a enviar'}</span>
              </button>

              {showPreview && (
                <div className="mt-2 p-3 bg-white/95 rounded-lg border border-emerald-200 text-slate-800 text-[11px] leading-relaxed whitespace-pre-line font-mono select-all shadow-inner">
                  {clientWaMessage}
                </div>
              )}
            </div>
          </div>

          {/* Direct WhatsApp Conversion Button */}
          <div className="pt-2">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
            >
              {/* WhatsApp Icon */}
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
              </svg>
              <span>Hacer Pedido de TAE / SIM a Cristian Rojas</span>
            </a>
            <p className="text-[11px] text-center text-slate-500 mt-1.5">
              WhatsApp Oficial de Pedidos: <strong>+505 8448-0260</strong> (Cristian Rojas)
            </p>
          </div>

          {/* Exclusive Category Prizes Section */}
          <div className="mt-4 pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between mb-2.5">
              <h3 className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <span>🎁</span>
                <span>Premios en Sorteo para tu Categoría ({record.categoria})</span>
              </h3>
              <span className="text-[11px] font-semibold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                Exclusivo Zona Norte
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {catConfig.prizes.map((prize, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 flex items-center gap-2"
                >
                  <span className="text-amber-500 font-bold">✓</span>
                  <span className="font-medium">{prize}</span>
                </div>
              ))}
            </div>

            <div className="mt-3 text-[11px] text-slate-500 italic text-center">
              * El sorteo se realizará de forma electrónica el 15 de enero de 2027 entre todos los PDR que cumplan ambas metas.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
