'use client';

import React, { useState } from 'react';
import { CategoryType } from '@/lib/promoConfig';

export function CategoryTabs() {
  const [selectedCat, setSelectedCat] = useState<CategoryType>('B');

  const categoriesOverview = {
    A: {
      title: 'Categoría A',
      badge: 'bg-amber-500 text-white',
      sims: '12 SIM Cards (> C$65)',
      description: 'Puntos de venta de alto volumen con metas preferenciales de TAE.',
      rewards: [
        'Grandes GiftCards de Supermercado',
        'Refrigeradoras de 2 puertas',
        'Cocinas de gas de 4 quemadores',
        'Microondas para el hogar',
        'Pantallas Smart TV LED 4K UHD',
      ],
    },
    B: {
      title: 'Categoría B',
      badge: 'bg-blue-600 text-white',
      sims: '8 SIM Cards (> C$65)',
      description: 'Puntos de venta en crecimiento activo con metas intermedias de TAE.',
      rewards: [
        'GiftCards de Supermercado',
        'Licuadoras de alta potencia',
        'Cafeteras eléctricas de 12 tazas',
        'Planchas de vapor',
        'Televisores FHD',
      ],
    },
    C: {
      title: 'Categoría C',
      badge: 'bg-emerald-600 text-white',
      sims: '5 SIM Cards (> C$65)',
      description: 'Puntos de venta iniciales con metas accesibles de TAE.',
      rewards: [
        'GiftCards de Supermercado para compras navideñas',
        'Premios y certificados especiales de temporada',
      ],
    },
  };

  const current = categoriesOverview[selectedCat];

  return (
    <div className="w-full bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden festive-ribbon-border transition-all">
      <div className="p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-800 flex items-center gap-2">
              <span>🎁</span>
              <span>Bases y Premios de la Dinámica Navideña</span>
            </h2>
            <p className="text-xs text-slate-500">
              Participan todos los Puntos de Recarga (PDR) en Categorías A, B y C.
            </p>
          </div>
          <span className="self-start sm:self-auto text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
            🎄 Edición Oficial 2026
          </span>
        </div>

        {/* Category selector */}
        <div className="mb-4">
          <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
            Explorar Categoría:
          </label>
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl">
            {(['A', 'B', 'C'] as CategoryType[]).map((key) => {
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
        </div>

        {/* Selected Category Details */}
        <div className="bg-gradient-to-br from-slate-50 to-red-50/40 rounded-xl p-3.5 sm:p-4 border border-slate-200/70 space-y-3.5">
          {/* Target Requirement Badge */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 block">
                  Meta SIMs Requerida
                </span>
                <span className="text-sm sm:text-base font-extrabold text-slate-800">
                  {current.sims}
                </span>
              </div>
              <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-sm font-bold">
                💳
              </div>
            </div>

            <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 block">
                  Meta Acumulada TAE
                </span>
                <span className="text-xs sm:text-sm font-bold text-slate-700">
                  Asignada por POS
                </span>
              </div>
              <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-sm font-bold">
                📱
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            {current.description}
          </p>

          {/* Premios en sorteo */}
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <span className="text-sm">🏆</span>
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                Premios en Sorteo para {current.title}
              </span>
            </div>
            <ul className="space-y-1.5">
              {current.rewards.map((reward, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 bg-white/80 backdrop-blur-xs px-2.5 py-1.5 rounded-lg border border-slate-200/60 text-xs sm:text-sm text-slate-700"
                >
                  <span className="text-amber-500 font-bold mt-0.5">✦</span>
                  <span className="font-medium">{reward}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Invitation Box to Query Exact POS */}
          <div className="p-3 rounded-lg bg-red-50 border border-red-200/80 text-xs text-red-900 flex items-start gap-2">
            <span className="text-base">🔍</span>
            <div className="leading-relaxed">
              <strong>¿Querés ver tus metas exactas y premios asignados?</strong>
              <br />
              Ingresá tu código POS de 8 dígitos en la barra de consulta de arriba para ver tu avance en vivo y los premios específicos en los que participás.
            </div>
          </div>

          {/* Requirement Disclaimer */}
          <div className="pt-2 border-t border-slate-200/70 text-[11px] text-slate-500 flex items-center gap-1.5">
            <span className="text-red-500">ℹ️</span>
            <span>
              Para clasificar debes cumplir el <strong>100% en ambas metas</strong> (TAE y SIMs &gt; C$65) y no tener facturas pendientes con ENITEL. Sorteo: 15 de enero de 2027.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}