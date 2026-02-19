## Explicación técnica honesta + Plan de mejoras en la página de instalación

### ¿Se puede descargar un APK de Android directamente desde la web?

**Respuesta corta: No para esta app tal como está construida.**

Esta app es una PWA (aplicación web progresiva), no una app nativa compilada. Para distribuir un APK real (que se instale como cualquier app de Google Play), habría que convertir la PWA en una app nativa usando una herramienta llamada **Capacitor** o **TWA (Trusted Web Activity)**, lo que implica compilar y generar el archivo APK. Eso es un proceso técnico que requiere herramientas externas (Android Studio) que no se pueden ejecutar aquí.

**Lo mismo aplica a iOS (.ipa):** Apple es aún más restrictivo. No permite instalar apps fuera de la App Store en iPhone/iPad sin un proceso de firma de código y cuenta de desarrollador de pago ($99/año).

**Para PC (Windows):** Sí se puede generar un instalador `.exe` con herramientas como Electron o PWABuilder, pero también requiere compilación externa.

---

### Lo que SÍ podemos hacer ahora mismo (sin herramientas externas)

La instalación PWA directa desde el navegador es **funcionalmente equivalente a una app instalada**:

- Se ve y comporta igual que una app nativa
- Aparece en la pantalla de inicio / escritorio con el icono de Nova
- Funciona sin abrir el navegador
- Recibe notificaciones

El problema actual es que el botón de instalación solo aparece cuando el navegador dispara el evento automático, lo cual no siempre ocurre de inmediato.

---

### Plan de mejoras en la página /instalar-app

#### 1. Navbar — reducir tamaño del ícono de Método Nova y compactar spacing

El ícono `metodo-nova-icon.png` en la navbar desktop está configurado como `w-12 h-12` (48px), lo que hace que todos los items del menú se separen verticalmente. Se cambia a `w-5 h-5` para que sea consistente con los demás iconos. El `gap-6` del menú desktop se reduce a `gap-4`.

#### 2. Página InstalarApp — nueva sección de descarga directa prominente

Justo debajo del hero, antes de las tarjetas de beneficios, se añade una sección con **3 botones grandes por plataforma**:

- **Android:** Botón "Instalar en Android" que intenta disparar el prompt nativo. Si el navegador aún no ha generado el `beforeinstallprompt`, muestra un tooltip con un mensaje explicativo honesto.
- **iPhone / iPad:** Botón que al hacer clic abre un pequeño panel (accordion/callout) con los 3 pasos de Safari, directamente visible sin necesidad de scrollear. Incluye iconos visuales claros.
- **PC / Mac:** Botón que intenta el prompt nativo de Chrome/Edge. Si no está disponible, muestra cómo acceder al ícono de instalación en la barra de direcciones.

#### 3. Que dependiendo al boton que le de el usuario aparezca sara y le explique en un breve tutorial como instalar la app dependiendo de su caso. 

#### 4. Mejora visual de la sección de beneficios

Se mejora el diseño de las tarjetas de beneficios añadiendo un borde con color de acento y un fondo degradado sutil para que se vean más atractivas y profesionales.

---

### Archivos a modificar


| Archivo                     | Cambio                                                                 |
| --------------------------- | ---------------------------------------------------------------------- |
| `src/components/Navbar.tsx` | Ícono Método Nova `w-12 h-12` → `w-5 h-5`, gap `gap-6` → `gap-4`       |
| `src/pages/InstalarApp.tsx` | Nueva sección de botones de descarga por plataforma + nota informativa |
