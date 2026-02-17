
## Plan de cambios solicitados

Se realizaran multiples cambios en varios archivos del proyecto. A continuacion el detalle:

---

### 1. Cambio de icono del Asistente Virtual PLUS
**Archivo:** `src/components/ServicesSection.tsx`
- Reemplazar el icono `Sparkles` del asistente PLUS por `BotMessageSquare` (similar al `Bot` del PRO pero con diferencia visual - incluye un cuadro de mensaje)
- Importar `BotMessageSquare` de lucide-react

### 2. Cambio de icono en el Tutorial de Sara
**Archivo:** `src/components/WelcomeTutorial.tsx`
- En el primer paso del tutorial, reemplazar `Sparkles` por `MessageCircleHeart` (un icono mas acorde con Sara como asistente)
- Tambien reemplazar el icono pequeno sobre el avatar de Sara (linea 123) por el mismo icono

### 3. Actualizacion de precios en ServicesSection
**Archivo:** `src/components/ServicesSection.tsx`
- Pagina web: precio de 1000 a 600, label "desde 600€"
- Asistente Virtual PRO: precio de 200 a 100, label "100€"
- Asistente Virtual PLUS: precio de 400 a 200, label "200€"
- Branding profesional: precio de 300 a 200, label "desde 200€"

### 4. Cambio en includes de paginas web
**Archivo:** `src/components/ServicesSection.tsx`
- Cambiar "SEM base y estructura" por "SEO"

### 5. Cambio en SEM (servicios adicionales)
**Archivo:** `src/components/ServicesSection.tsx`
- Badge: cambiar "Gratis con 4 servicios" a "Primer mes gratis con 4 servicios"
- Descripcion: actualizar a "Creacion y seguimiento de campanas en Google/Social Ads"

### 6. Actualizacion de precios en PackagesSection
**Archivo:** `src/components/PackagesSection.tsx`
- Paquete Pro: precio de 1400 a 800, label "800€"
- Paquete Plus: precio de 2500 a 1900, label "1.900€"

### 7. Cambios en el Aviso Legal
**Archivo:** `src/pages/LegalNotice.tsx`
- Eliminar la linea del titular (Ana Patricia Velasco Franco) dejando solo el NIF
- En la seccion "Objeto", eliminar la parte "del que es titular Ana Patricia Velasco Franco"

---

### Resumen tecnico de archivos a modificar

| Archivo | Cambios |
|---------|---------|
| `src/components/ServicesSection.tsx` | Icono PLUS, precios web/PRO/PLUS/branding, includes web, SEM badge y descripcion |
| `src/components/WelcomeTutorial.tsx` | Icono del primer paso y del avatar de Sara |
| `src/components/PackagesSection.tsx` | Precios paquete Pro y Plus |
| `src/pages/LegalNotice.tsx` | Eliminar nombre titular, modificar seccion objeto |
