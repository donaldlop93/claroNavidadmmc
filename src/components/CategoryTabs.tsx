'use client';

import React, { useState } from 'react';
import {
  CategoryType,
  DepartmentType,
  formatCordobas,
  getDepartmentCategoryMeta,
} from '@/lib/promoConfig';

interface DeptOption {
  code: DepartmentType;
  label: string;
  zone: string;
}

const DEPARTMENTS: DeptOption[] = [
  { code: 'JINOTEGA', label: '🏔️ Jinotega & Sébaco', zone: 'Zona Norte' },
  { code: 'GRANADA', label: '🏛️ Granada', zone: 'Zona Suroriente' },
  { code: 'MASAYA', label: '🌺 Masaya', zone: 'Zona Suroriente' },
];

export function CategoryTabs() {
  const [selectedDept, setSelectedDept] = useState<DepartmentType>('JINOTEGA');
  const [selectedCat, setSelectedCat] = useState<CategoryType>('B');
  const catKeys: CategoryType[] = ['A', 'B', 'C'];

  const meta = getDepartmentCategoryMeta(selectedDept, selectedCat);

  return (
    <div className="w-full bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden festive-ribbon-border transition-all">
      <div className="p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-800 flex items-center gap-2">
              <span>🎁</span>
              <span>Metas y Premios por Zona y Categoría</span>
            </h2>
            <p className="text-xs text-slate-500">
              Elegí tu departamento y categoría para ver los requisitos oficiales y premios del sorteo:
            </p>
          </div>
          <span className="self-start sm:self-auto text-[11px] font-semibold text-red-600 bg-red-50 border border-red-200/60 px-2 py-0.5 rounded-md">
            📍 {meta.zone}
          </span>
        </div>

        {/* Department / Zone Selector */}
        <div className="mb-3">
          <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
            Seleccionar Departamento:
          </label>
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl">
            {DEPARTMENTS.map((dept) => {
              const isSelected = selectedDept === dept.code;
              return (
                <button
                  key={dept.code}
                  type="button"
                  onClick={() => setSelectedDept(dept.code)}
                  className={`py-2 px-2 rounded-lg text-xs font-bold transition-all text-center flex flex-col items-center justify-center gap-0.5 ${
                    isSelected
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  <span className="truncate">{dept.label}</span>
                  <span
                    className={`text-[9px] font-medium ${
                      isSelected ? 'text-amber-300' : 'text-slate-400'
                    }`}
                  >
                    {dept.zone}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tactile Category Selector Tabs */}
        <div className="mb-4">
          <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
            Seleccionar Categoría:
          </label>
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl">
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
        </div>

        {/* Selected Category Details */}
        <div className="bg-gradient-to-br from-slate-50 to-red-50/40 rounded-xl p-3.5 sm:p-4 border border-slate-200/70">
          {/* Target badges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4">
            <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 block">
                  Meta Acumulada TAE ({meta.displayName})
                </span>
                <span className="text-sm sm:text-base font-extrabold text-slate-800">
                  {formatCordobas(meta.targetTae)}
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
                  {meta.targetSim} SIMs (&gt; C$65)
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
                Premios en Sorteo ({meta.zone} • {meta.displayName})
              </span>
            </div>
            <ul className="space-y-1.5">
              {meta.prizes.map((prize, idx) => (
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
              Para clasificar debes cumplir el <strong>100% en ambas metas</strong> (TAE y SIMs &gt; C$65) y no tener facturas pendientes con ENITEL.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}