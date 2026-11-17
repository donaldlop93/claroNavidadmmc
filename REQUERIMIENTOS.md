# Portal Web "El Reto Navideño Claro 2026" — Zona Norte

Aplicación web *Mobile-First* de alta velocidad desarrollada para **M&M Comunicaciones S.A.** (Distribuidor Autorizado de Claro Nicaragua) para la consulta de avance acumulado en Tiempo Aire Electrónico (TAE) y activación de SIM Cards durante la campaña oficial navideña 2026.

---

## 1. Características Principales

* **Mobile-First & PWA:** Totalmente optimizado para pantallas táctiles de celulares (360px a 430px) y escritorio, con soporte de instalación en pantalla de inicio (`manifest.json`, `theme-color: #DA291C`).
* **Búsqueda Ergonómica:** Teclado numérico móvil automático (`inputmode="numeric"`, `pattern="[0-9]*"`, `maxLength={8}`), botón de borrado rápido `✕` y preservación estricta de 8 dígitos incluyendo ceros a la izquierda (ej. `03325009`).
* **Enlaces Directos y Compartir:** Apertura automática con `?pos=XXXXXXXX`, actualización dinámica de la URL con `window.history.replaceState` y botón nativo para compartir enlace vía WhatsApp o portapapeles.
* **Gamificación y Alertas Psicológicas:**
  * **🎉 Clasificado (100% TAE y SIMs):** Banner verde esmeralda y disparo automático de confeti festivo en canvas.
  * **⚠️ Alerta de Desbalance:** Aviso preventivo cuando una meta está al 100% y la otra aún no.
  * **🔥 A un paso (>= 80%):** Banner motivacional y efecto de brillo animado (*shimmer*) en las barras de progreso.
  * **🎅 Reto en Marcha:** Cálculo en tiempo real del ritmo diario sugerido (`C$/día` y frecuencia de activación de SIMs) según los días restantes hasta el 31 de diciembre de 2026.
* **Conversión Directa a WhatsApp:** Botón prellenado con enlace a Cristian Rojas (`+505 8448-0260`) calculando los faltantes exactos o notificando el cumplimiento para pedidos de saldo y SIMs.
* **Seguridad y Privacidad:** Exclusión total de coordenadas, direcciones y rutas de clientes en las respuestas del API (`/api/consulta`), garantizando protección de datos personales.

---

## 2. Metas y Premios Oficiales por Categoría (Zona Norte)

| Categoría | Meta Acumulada TAE | Meta Acumulada SIM Cards | Premios en Sorteo (15 de enero de 2027) |
| :--- | :--- | :--- | :--- |
| **Categoría A** | C$ 58,418.66 | 12 SIMs | • 10 giftcards La Colonia de C$10,000<br>• 1 refrigeradora Cetron 11 pies, 2 puertas<br>• 3 microondas Frigidaire 0.6 ft³, blanco<br>• 1 cocina de gas Murcia Plus, 4 quemadores<br>• 1 televisor TCL 55" LED 4K UHD 55V6C |
| **Categoría B** | C$ 20,298.00 | 8 SIMs | • 8 giftcards La Colonia de C$10,000<br>• 4 licuadoras Black + Decker 1.65 L, rojas<br>• 3 cafeteras Black + Decker, 12 tazas, blancas<br>• 4 planchas TELSTAR<br>• 1 televisor TCL 32" QLED FHD |
| **Categoría C** | C$ 6,613.90 | 5 SIMs | • 4 giftcards Walmart de C$3,662.43 cada una |

*Requisitos indispensables:* Cumplir el 100% de ambas metas y no registrar facturas pendientes con ENITEL.

---

## 3. Configuración y Despliegue en Vercel

### Variables de Entorno (Vercel Environment Variables)
Configurar en el panel de Vercel (o en `.env.local` para desarrollo local):

```ini
GOOGLE_SHEET_ID=14lONUMysN2Zhh295ahKEcIi3FAtKSncGf0lfaUPG58
GOOGLE_SHEET_TAB="TAE KPI"
SIM_CALCULATION_MODE=MAYOR_50

# Si la hoja maestra se mantiene Privada (Opción A):
# GOOGLE_SERVICE_ACCOUNT_EMAIL=cuenta-servicio@proyecto.iam.gserviceaccount.com
# GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Si se usa API Key de Google Cloud:
# GOOGLE_API_KEY=AIzaSy...

# Si se usa una hoja espejo publicada como CSV:
# GOOGLE_SHEET_CSV_URL=https://docs.google.com/spreadsheets/d/.../export?format=csv
```

### Modos de Cálculo de SIM Cards (`SIM_CALCULATION_MODE`)
1. `MAYOR_50` (Por defecto): Considera únicamente la columna M (`MAYOR C$50`).
2. `TOTAL_SIM`: Suma columna M + columna N (`MAYOR C$50` + `MENOR C$50`).
3. `SEMANAS`: Suma de activaciones semanales (columnas H a L: `SEMANA 1` a `SEMANA 5`).

---

## 4. Estructura del Proyecto

```text
/
├── public/
│   ├── logos/
│   │   ├── claro-logo.png             # Logotipo oficial de Claro
│   │   └── mm-comunicaciones.png      # Logotipo oficial M&M Comunicaciones S.A.
│   └── manifest.json                  # Configuración PWA para acceso directo móvil
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── consulta/
│   │   │       └── route.ts           # Endpoint GET: consulta POS + conteo clasificados
│   │   ├── globals.css                # Estilos navideños (nieve, cinta festiva, shimmer)
│   │   ├── layout.tsx                 # Metadatos SEO, fuentes y configuración PWA
│   │   └── page.tsx                   # Interfaz principal Mobile-First
│   ├── components/
│   │   ├── ChristmasHeader.tsx        # Header institucional Claro (con gorro navideño) + M&M
│   │   ├── ChristmasHero.tsx          # Banner rojo navideño, esferas, countdown y social proof
│   │   ├── CategoryTabs.tsx           # Pestañas táctiles Categorías A / B / C
│   │   ├── PosResultCard.tsx          # Ficha personalizada, barras de progreso, ritmo diario y WA CTA
│   │   └── ConfettiCelebration.tsx    # Animación canvas al cumplir 100% en ambas metas
│   └── lib/
│       ├── promoConfig.ts             # Metas oficiales, premios, contacto WA y helpers
│       └── googleSheets.ts            # Conexión, parseo seguro y caché de Google Sheets
├── .env.local                         # Variables locales (ignorado en Git)
├── .env.example                       # Plantilla de variables para el equipo
├── .gitignore                         # Excluye .env*, *.pem, credentials*.json
└── REQUERIMIENTOS.md                  # Este documento
```

---

## 5. Verificación de Criterios de Aceptación

- [x] Encabezado rojo navideño con alto contraste y legibilidad perfecta en pantallas móviles (360px a 430px) y escritorio.
- [x] Logos oficiales de Claro y M&M Comunicaciones S.A. cargados desde `/public/logos/` con preservación de proporciones.
- [x] Búsqueda y despliegue preciso de códigos POS que inician con cero (ej. `03325009`).
- [x] Consulta y despliegue automático al acceder con `?pos=XXXXXXXX`.
- [x] Botón de WhatsApp conectado a Cristian Rojas (`+505 8448-0260`) con mensaje dinámico y cálculo exacto de faltantes.
- [x] Cero credenciales ni archivos `.env` expuestos en el repositorio.
