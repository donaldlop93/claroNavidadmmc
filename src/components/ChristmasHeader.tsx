'use client';

import React from 'react';
import Image from 'next/image';

export function ChristmasHeader() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-red-100 shadow-sm transition-all">
      <div className="max-w-4xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-2">
        {/* Claro Logo with festive Santa Hat */}
        <div className="flex items-center gap-2">
          <div className="relative inline-flex items-center">
            {/* Santa Hat SVG positioned over Claro logo */}
            <span
              className="absolute -top-3.5 -right-2.5 w-7 h-7 pointer-events-none transform rotate-12 z-20 drop-shadow-sm"
              title="Navidad Claro"
            >
              <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                {/* Red Cone */}
                <path
                  d="M16 46C20 28 32 12 50 14C48 24 44 38 42 46H16Z"
                  fill="#DA291C"
                  stroke="#991B1B"
                  strokeWidth="1.5"
                />
                {/* White fluffy trim */}
                <rect x="12" y="44" width="34" height="10" rx="5" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
                {/* Pompom */}
                <circle cx="52" cy="14" r="6" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
              </svg>
            </span>

            {/* Claro Official 3D Sphere Logo */}
            <div className="h-9 sm:h-10 w-9 sm:w-10 relative flex items-center justify-center">
              <Image
                src="/logos/claro-logo.png"
                alt="Claro Nicaragua"
                width={44}
                height={44}
                priority
                className="object-contain h-full w-full drop-shadow-xs"
              />
            </div>
          </div>

          {/* Region Badge */}
          <div className="hidden xs:flex sm:flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-50 border border-red-200 text-red-700 text-[11px] sm:text-xs font-semibold">
            <span>🎄</span>
            <span>Zona Norte</span>
          </div>
        </div>

        {/* Distributor M&M Comunicaciones S.A. */}
        <div className="flex items-center gap-2 text-right">
          <div className="flex flex-col items-end justify-center">
            <span className="text-[12px] sm:text-sm font-bold text-slate-800 leading-tight">
              M&M Comunicaciones S.A.
            </span>
            <span className="text-[9px] sm:text-[11px] font-medium text-slate-500 leading-tight">
              Distribuidor Autorizado
            </span>
          </div>

          <div className="h-9 sm:h-10 w-9 sm:w-10 relative flex items-center justify-center rounded-full bg-slate-50 border border-slate-200/80 p-0.5 overflow-hidden shadow-xs">
            <Image
              src="/logos/mm-comunicaciones.png"
              alt="M&M Comunicaciones S.A."
              width={44}
              height={44}
              className="object-contain h-full w-full"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
