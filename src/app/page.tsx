'use client';

import React, { useState, useEffect, Suspense, useRef, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { ChristmasHeader } from '@/components/ChristmasHeader';
import { ChristmasHero } from '@/components/ChristmasHero';
import { CategoryTabs } from '@/components/CategoryTabs';
import { PosResultCard } from '@/components/PosResultCard';
import { PosRecord, ConsultaResponse } from '@/lib/promoConfig';

function MainContent() {
  const searchParams = useSearchParams();
  const initialPos = searchParams.get('pos') || '';

  const [posInput, setPosInput] = useState<string>(initialPos);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [record, setRecord] = useState<PosRecord | null>(null);
  const [classifiedCount, setClassifiedCount] = useState<number>(18);

  const resultRef = useRef<HTMLDivElement>(null);
  const hasAutoQueried = useRef<boolean>(false);

  // Load initial classified count
  useEffect(() => {
    fetch('/api/consulta')
      .then((res) => res.json())
      .then((data: ConsultaResponse) => {
        if (data.classifiedCount) {
          setClassifiedCount(data.classifiedCount);
        }
      })
      .catch((err) => console.error('Error fetching global count:', err));
  }, []);

  // Function to execute query
  const executeQuery = useCallback(async (codeToQuery: string, shouldScroll = true) => {
    const trimmed = codeToQuery.trim();
    if (!trimmed) {
      setErrorMsg('Por favor ingresá tu código POS de 8 dígitos.');
      return;
    }

    if (!/^\d{8}$/.test(trimmed)) {
      setErrorMsg('El código POS debe contener exactamente 8 dígitos numéricos.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch(`/api/consulta?pos=${encodeURIComponent(trimmed)}`);
      const data: ConsultaResponse = await res.json();

      if (data.classifiedCount) {
        setClassifiedCount(data.classifiedCount);
      }

      if (!res.ok || !data.record) {
        setRecord(null);
        setErrorMsg(
          data.message || 'No encontramos el POS ingresado en la cartera activa de M&M Comunicaciones.'
        );
      } else {
        setRecord(data.record);
        setErrorMsg(null);

        // Update URL query parameter
        if (typeof window !== 'undefined') {
          const newUrl = `${window.location.pathname}?pos=${data.record.pos}`;
          window.history.replaceState({ path: newUrl }, '', newUrl);
        }

        // Smooth scroll to results
        if (shouldScroll) {
          setTimeout(() => {
            resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 150);
        }
      }
    } catch {
      setErrorMsg('Error de conexión al consultar el servidor. Intentá de nuevo.');
      setRecord(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-query if URL has ?pos=XXXXXXXX on load
  useEffect(() => {
    if (initialPos && !hasAutoQueried.current) {
      hasAutoQueried.current = true;
      setPosInput(initialPos);
      executeQuery(initialPos, true);
    }
  }, [initialPos, executeQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeQuery(posInput, true);
  };

  const handleClear = () => {
    setPosInput('');
    setRecord(null);
    setErrorMsg(null);
    if (typeof window !== 'undefined') {
      window.history.replaceState({}, '', window.location.pathname);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Institutional Christmas Header */}
      <ChristmasHeader />

      {/* Hero Banner with Countdown & Social Proof */}
      <ChristmasHero classifiedCount={classifiedCount} />

      {/* Main Container */}
      <main className="max-w-2xl mx-auto w-full px-3.5 sm:px-6 py-6 flex-1 flex flex-col space-y-6">
        {/* Search Card */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200/90 overflow-hidden festive-ribbon-border transition-all">
          <div className="p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">🔍</span>
              <h2 className="text-base sm:text-lg font-bold text-slate-800">
                Consultar Avance de mi Punto de Venta (PDR)
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mb-4 leading-relaxed">
              Ingresá los 8 dígitos de tu código POS (ejemplo: <strong>85176118</strong> o <strong>03325009</strong>) para conocer tu estado, porcentaje acumulado y ritmo diario:
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="relative">
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={8}
                  placeholder="Ingresá tu POS (8 dígitos)"
                  value={posInput}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    setPosInput(val);
                    if (errorMsg) setErrorMsg(null);
                  }}
                  className="w-full pl-4 pr-11 py-3 sm:py-3.5 bg-slate-50 border border-slate-300 rounded-xl text-base sm:text-lg font-bold text-slate-800 tracking-wider placeholder:text-slate-400 placeholder:font-normal focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all shadow-inner"
                />

                {posInput.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-600 flex items-center justify-center text-xs font-bold transition-all"
                    title="Limpiar"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Error Message */}
              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-start gap-2">
                  <span className="text-base">⚠️</span>
                  <div className="flex-1 font-medium">{errorMsg}</div>
                </div>
              )}

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-xl bg-[#DA291C] hover:bg-[#b91c1c] active:scale-[0.98] text-white text-sm sm:text-base font-extrabold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <span>Consultando avance oficial...</span>
                  </>
                ) : (
                  <>
                    <span>🎄</span>
                    <span>Consultar Mi Avance Navideño</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </section>

        {/* Dynamic Display: Results OR Initial Category Tabs */}
        <div ref={resultRef} className="scroll-mt-20">
          {record ? (
            <PosResultCard record={record} onReset={handleClear} />
          ) : (
            <CategoryTabs />
          )}
        </div>
      </main>

      {/* Institutional Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-2xl mx-auto space-y-2">
          <p className="font-semibold text-slate-700">
            El Reto Navideño Claro 2026 • Zona Norte
          </p>
          <p>
            M&M Comunicaciones S.A. — Distribuidor Autorizado de Claro Nicaragua
          </p>
          <p className="text-[11px] text-slate-400">
            * Promoción válida del 1 de noviembre al 31 de diciembre de 2026. Sorteo electrónico: 15 de enero de 2027. Indispensable cumplir 100% en ambas metas (TAE y SIM Cards) y no registrar facturas pendientes con ENITEL.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-bold text-slate-600">Cargando Reto Navideño Claro...</span>
          </div>
        </div>
      }
    >
      <MainContent />
    </Suspense>
  );
}
