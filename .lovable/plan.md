
## Plan de cambios: Tutorial Sara interactivo, Navbar, Favicon y Cloudflare

### 1. Eliminar texto "¿Por qué no hay un archivo APK o IPA?"

En `src/pages/InstalarApp.tsx`, se elimina el bloque `div` de "Honest note" (líneas 243–249) que contiene ese texto explicativo sobre APK/IPA.

---

### 2. Tutorial interactivo de Sara con callouts posicionados

Se reemplaza el componente `SaraTutorial` actual (un simple panel estático) por un **tutorial de pantalla completa con overlay**, al estilo del `WelcomeTutorial` del dashboard. La diferencia clave es que cada paso mostrará a Sara en una **posición diferente de la pantalla** con una **flecha o indicador apuntando** al área de la interfaz que el usuario debe mirar.

Estructura del nuevo componente `SaraInstallTutorial`:

- **Overlay semitransparente** de fondo (igual que WelcomeTutorial)
- **Card de Sara posicionada dinámicamente** según el paso actual:
  - Paso 1 (abrir navegador): centrada
  - Paso 2 (tres puntos / compartir): posicionada en la **esquina superior derecha** de la pantalla con una flecha apuntando hacia arriba
  - Paso 3 (menú / añadir a inicio): posicionada a la derecha con flecha apuntando al lado
  - Paso 4 (listo): centrada con confetti animado
- Cada card incluye:
  - Avatar de Sara (imagen real `sara-avatar.png`)
  - Título del paso con icono
  - Descripción contextual
  - Indicador de posición visual (flecha animada con CSS `animate-bounce`)
  - Puntos de progreso navegables
  - Botones Anterior / Siguiente / Cerrar
- Se activa al pulsar cualquiera de los 3 botones de plataforma (Android, iOS, PC)

Posiciones de Sara por paso (usando clases Tailwind `fixed`):

```text
Paso 1: Centrado (items-center justify-center)
Paso 2: top-16 right-4   ← apunta a los 3 puntos (arriba derecha)
Paso 3: top-1/2 right-4  ← apunta al menú que se despliega
Paso 4: Centrado          ← celebración final
```

---

### 3. Icono Método Nova en Navbar — tamaño intermedio

El icono desktop en `src/components/Navbar.tsx` está actualmente en `w-5 h-5`. Se sube a **`w-7 h-7`** (28px), que es un punto intermedio entre el `w-5` actual y el `w-12` original, manteniendo la organización visual. El gap del menú se deja en `gap-4` (ya optimizado).

El icono mobile (actualmente `w-12 h-12`) se deja en `w-7 h-7` también para consistencia.

---

### 4. Fix del favicon (Cloudflare build)

El problema de build en Cloudflare se debe a **dos causas posibles**:

**a) Favicon duplicado:** Existe `public/Favicon.ico` (con F mayúscula) y `public/favicon.png`. Algunos sistemas de archivos case-sensitive (Linux/Cloudflare) ven ambos. Se puede eliminar la referencia al `.ico` o consolidar.

**b) Workbox / vite-plugin-pwa con RegExp:** El `navigateFallbackDenylist` usa expresiones regulares (`/^\/~oauth/`, `/^\/api\//`) que pueden no serializar correctamente en el proceso de build de Cloudflare Pages. Se cambia a usar `navigateFallbackAllowlist` o se simplifica la config de workbox para evitar el error.

**c) TypeScript errors:** Si hay errores de TS en modo strict, Cloudflare falla. Se revisará `tsconfig.app.json`.

Fix aplicado:
- En `vite.config.ts`: cambiar `navigateFallbackDenylist` (que puede generar error de serialización) a una configuración compatible con el entorno de Cloudflare
- En `index.html`: añadir `<link rel="icon" href="/Favicon.ico" type="image/x-icon" />` como fallback (o mejor, eliminar el `.ico` duplicado ya que `favicon.png` es el correcto)

---

### 5. Sincronización con GitHub / Cloudflare

**Esta sincronización ya es automática.** Cada cambio que se hace aquí en Lovable se empuja automáticamente al repositorio de GitHub conectado. Cloudflare Pages detecta el push y lanza el build automáticamente.

El build de Cloudflare **falló** porque hay un error de compilación en el código actual (probablemente el `navigateFallbackDenylist` con RegExp en vite.config.ts, que no se serializa bien en el builder de Cloudflare). Al corregir ese error, el próximo push a GitHub disparará un build exitoso en Cloudflare automáticamente.

No es necesario hacer nada manual en GitHub ni Cloudflare.

---

### Archivos a modificar

| Archivo | Cambio |
|---|---|
| `src/pages/InstalarApp.tsx` | Eliminar nota APK/IPA + reemplazar `SaraTutorial` estático por overlay interactivo posicionado |
| `src/components/Navbar.tsx` | Icono Método Nova `w-5 h-5` → `w-7 h-7` (desktop y mobile) |
| `vite.config.ts` | Fix config de workbox para compatibilidad con Cloudflare Pages build |
| `index.html` | Asegurar favicon correcto sin duplicados |
