'use client';

import React, { useState } from 'react';
import { PROMO_CONFIG, CategoryType, formatCordobas } from '@/lib/promoConfig';

export function CategoryTabs() {
  const [selectedCat, setSelectedCat] = useState<CategoryType>('B');
  const catKeys: CategoryType[] = ['A', 'B', 'C'];
  const current = PROMO_CONFIG.categories[selectedCat];

  return (
    <div className="w-full bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden festive-ribbon-border transition-all">
      <div className="p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-800 flex items-center gap-2">
              <span>🎁</span>
              <span>Metas y Premios por Categoría</span>
            </h2>
            <p className="text-xs text-slate-500">
              Seleccioná tu categoría para conocer los requisitos oficiales y premios del sorteo:
            </p>
          </div>
          <span className="self-start sm:self-auto text-[11px] font-semibold text-red-600 bg-red-50 border border-red-200/60 px-2 py-0.5 rounded-md">
            Zona Norte
          </span>
        </div>

        {/* Tactile Category Selector Tabs */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl mb-4">
          {catKeys.map((key) => {
            const isSelected = selectedCat === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedCat(key)}
                className={`py-2.5 px-3 rounded-lg text-xs sm:text-sm font-bold transition-all text-center flex flex-col sm:flex-row items-center justify-center gap-1 ${
                  isSelected
                    ? 'bg-red-600 text-white shadow-sm scale-[1.02]'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <span>Categoría {key}</span>
                {isSelected && <span className="text-[10px] sm:text-xs">✨</span>}
              </button>
            );
          })}
        </div>

        {/* Selected Category Details */}
        <div className="bg-gradient-to-br from-slate-50 to-red-50/40 rounded-xl p-3.5 sm:p-4 border border-slate-200/70">
          {/* Target badges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4">
            <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 block">
                  Meta Acumulada TAE
                </span>
                <span className="text-sm sm:text-base font-extrabold text-slate-800">
                  {formatCordobas(current.targetTae)}
                </span>
              </div>
              <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-sm font-bold">
                📱
              </div>
            </div>

            <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 block">
                  Meta SIMs (&gt; C$65)
                </span>
                <span className="text-sm sm:text-base font-extrabold text-slate-800">
                  {current.targetSim} SIMs (&gt; C$65)
                </span>
              </div>
              <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-sm font-bold">
                💳
              </div>
            </div>
          </div>

          {/* Prizes list */}
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <span className="text-sm">🏆</span>
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                Premios en Sorteo Electrónico (15 Ene 2027)
              </span>
            </div>
            <ul className="space-y-1.5">
              {current.prizes.map((prize, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 bg-white/80 backdrop-blur-xs px-2.5 py-1.5 rounded-lg border border-slate-200/60 text-xs sm:text-sm text-slate-700"
                >
                  <span className="text-amber-500 font-bold mt-0.5">•</span>
                  <span className="font-medium">{prize}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Requirement Disclaimer */}
          <div className="mt-3 pt-2.5 border-t border-slate-200/70 text-[11px] text-slate-500 flex items-center gap-1.5">
            <span className="text-red-500">ℹ️</span>
            <span>
              Para clasificar debes cumplir el <strong>100% en ambas metas</strong> (TAE y SIMs) y no tener facturas pendientes con ENITEL.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
