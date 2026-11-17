'use client';

import React, { useEffect, useState } from 'react';
import { getRemainingDays } from '@/lib/promoConfig';

interface ChristmasHeroProps {
  classifiedCount: number;
}

export function ChristmasHero({ classifiedCount }: ChristmasHeroProps) {
  const [daysLeft, setDaysLeft] = useState<number>(() => getRemainingDays());

  useEffect(() => {
    setDaysLeft(getRemainingDays());
    const interval = setInterval(() => {
      setDaysLeft(getRemainingDays());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-[#DA291C] via-[#B91C1C] to-[#7F1D1D] text-white pt-6 pb-9 px-4 sm:px-6 shadow-md">
      {/* Pine branch decorations & hanging baubles on corners */}
      {/* Top Left Pine Branch + Red Bauble */}
      <div className="absolute -top-2 left-0 sm:left-4 pointer-events-none select-none z-10">
        <svg width="80" height="70" viewBox="0 0 100 90" fill="none" className="opacity-90">
          <path d="M0 0 L45 25 L15 30 L60 50 L25 55 L75 75 L10 80 L0 90 Z" fill="#14532D" />
          <path d="M10 5 L50 28 L25 33 L65 52 L35 58 L80 77 Z" fill="#166534" />
        </svg>
        {/* Hanging sphere swinging */}
        <div className="absolute top-10 left-12 animate-swing">
          <div className="w-0.5 h-7 bg-amber-300 mx-auto opacity-80" />
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 shadow-md border border-amber-200/50 flex items-center justify-center">
            <span className="text-[10px] text-amber-100">✦</span>
          </div>
        </div>
      </div>

      {/* Top Right Pine Branch + Gold Bauble */}
      <div className="absolute -top-2 right-0 sm:right-4 pointer-events-none select-none z-10">
        <svg width="80" height="70" viewBox="0 0 100 90" fill="none" className="opacity-90 transform -scale-x-100">
          <path d="M0 0 L45 25 L15 30 L60 50 L25 55 L75 75 L10 80 L0 90 Z" fill="#14532D" />
          <path d="M10 5 L50 28 L25 33 L65 52 L35 58 L80 77 Z" fill="#166534" />
        </svg>
        {/* Hanging sphere swinging with delay */}
        <div className="absolute top-12 right-12 animate-swing-delay">
          <div className="w-0.5 h-6 bg-red-200 mx-auto opacity-80" />
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-red-400 via-red-600 to-red-900 shadow-md border border-white/40 flex items-center justify-center">
            <span className="text-[8px] text-white">❄</span>
          </div>
        </div>
      </div>

      {/* Background Star Sparkles & Snow SVG */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        <div className="absolute top-4 left-1/4 text-yellow-300 text-xs animate-pulse">✦</div>
        <div className="absolute top-12 right-1/4 text-white text-sm">❄</div>
        <div className="absolute top-1/2 left-8 text-white text-xs opacity-70">❅</div>
        <div className="absolute bottom-4 right-1/3 text-yellow-200 text-xs">✦</div>
        <div className="absolute top-8 right-12 text-white text-base">❄</div>
        <div className="absolute bottom-6 left-1/3 text-white text-xs">✦</div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto relative z-20 text-center flex flex-col items-center">
        {/* Pill Badges: Countdown & Social Proof */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-3">
          {/* Urgency Countdown */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/35 backdrop-blur-sm border border-white/20 text-white text-xs sm:text-sm font-semibold shadow-inner">
            <span className="text-amber-300">⏳</span>
            <span>
              Quedan <strong className="text-amber-300 font-extrabold">{daysLeft} días</strong> para cerrar
            </span>
          </div>

          {/* Social Proof: Zona Norte Classified */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/95 text-slate-900 text-xs sm:text-sm font-bold shadow-md">
            <span className="text-amber-900">⭐</span>
            <span>
              <strong className="text-slate-950 font-black">{classifiedCount} PDR</strong> clasificados en Zona Norte
            </span>
          </div>
        </div>

        {/* Main Title */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white drop-shadow-sm leading-tight max-w-xl">
          El Reto Navideño <span className="text-amber-300">Claro 2026</span>
        </h1>

        {/* Subtitle */}
        <p className="mt-2 text-red-100 text-xs sm:text-sm md:text-base font-normal max-w-lg leading-relaxed">
          Consulta oficial de avance de metas TAE y SIM Cards en <span className="font-semibold text-white">Zona Norte</span>.
          ¡Cumplí tus dos metas antes del 31 de diciembre y entrá al sorteo de fabulosos premios!
        </p>

        {/* Campaign Period info chip */}
        <div className="mt-3 flex items-center justify-center gap-2 text-[11px] sm:text-xs text-red-200">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400" />
          <span>Vigencia: 1 de nov. al 31 de dic. 2026</span>
          <span className="text-red-300">•</span>
          <span>Sorteo: 15 de enero 2027</span>
        </div>
      </div>
    </div>
  );
}
