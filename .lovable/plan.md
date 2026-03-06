

# Plan: SEO Completo para posicionar solutionsnova.es en Google

## Problema actual

1. **No existe `sitemap.xml`** - Google Search Console muestra "1 error" porque se envio la URL raiz como sitemap
2. **`robots.txt` incompleto** - No tiene directiva `Sitemap` ni bloquea rutas privadas
3. **Meta tags solo en `index.html`** - Al ser SPA, todas las paginas comparten el mismo title/description. Google ve contenido duplicado
4. **Falta `og:url` y `canonical`** - Google no sabe cual es la URL canonica
5. **Open Graph images usan ruta relativa** - Debe ser URL absoluta para que funcionen en redes sociales
6. **No hay datos estructurados (Schema.org)** - Google no puede mostrar rich snippets

## Cambios a implementar

### 1. Crear `public/sitemap.xml`
Archivo XML estatico con las 10 rutas publicas, usando `https://solutionsnova.es` como dominio base, con `lastmod`, `changefreq` y `priority` apropiados.

### 2. Actualizar `public/robots.txt`
- Agregar `Sitemap: https://solutionsnova.es/sitemap.xml`
- Agregar `Disallow` para `/auth`, `/dashboard`, `/profile`, `/admin`, `/forgot-password`, `/reset-password`

### 3. Crear componente `SEOHead` reutilizable
Un componente React que use `document.title` y meta tags dinamicos via `useEffect` para que cada pagina tenga:
- **Title unico** optimizado con keywords
- **Meta description** unica por pagina
- **Canonical URL** (`<link rel="canonical">`)
- **Open Graph** completo con URLs absolutas
- **Twitter Card** meta tags

### 4. Agregar `SEOHead` a cada pagina publica

| Pagina | Title | Keywords objetivo |
|---|---|---|
| `/` | NOVA Marketing Solutions · Agencia Digital en Valladolid | agencia marketing digital valladolid |
| `/casos-exito` | Casos de Exito · NOVA Marketing Solutions | casos exito marketing digital |
| `/casos-exito/hawkers` | Caso Hawkers · NOVA Marketing Solutions | hawkers marketing digital caso estudio |
| `/casos-exito/dominos` | Caso Domino's Pizza · NOVA Marketing Solutions | dominos pizza marketing digital |
| `/metodo-nova` | Metodo NOVA · Estrategia Digital Personalizada | metodo marketing digital estrategia |
| `/invita-a-un-amigo` | Programa de Referidos · NOVA Marketing | referidos descuento marketing |
| `/instalar-app` | Instalar App · NOVA Marketing Solutions | app nova marketing |

### 5. Agregar datos estructurados JSON-LD en `index.html`
Schema.org `LocalBusiness` + `Organization` para que Google muestre:
- Nombre, direccion, telefono
- Tipo de negocio (agencia de marketing)
- Logo, redes sociales
- Zona de servicio (Valladolid, Espana)

### 6. Corregir Open Graph images
Cambiar rutas relativas (`/nova-icon-512.png`) a absolutas (`https://solutionsnova.es/nova-icon-512.png`) en `index.html`.

### 7. Agregar `<link rel="canonical">` en `index.html`
Para la pagina principal: `https://solutionsnova.es/`

## Archivos a crear/modificar

| Archivo | Accion |
|---|---|
| `public/sitemap.xml` | Crear |
| `public/robots.txt` | Actualizar |
| `src/components/SEOHead.tsx` | Crear (componente reutilizable) |
| `src/pages/Index.tsx` | Agregar SEOHead |
| `src/pages/CasosExito.tsx` | Agregar SEOHead |
| `src/pages/CasoHawkers.tsx` | Agregar SEOHead |
| `src/pages/CasoDominos.tsx` | Agregar SEOHead |
| `src/pages/MetodoNova.tsx` | Agregar SEOHead |
| `src/pages/InvitaAmigo.tsx` | Agregar SEOHead |
| `src/pages/InstalarApp.tsx` | Agregar SEOHead |
| `src/pages/PrivacyPolicy.tsx` | Agregar SEOHead |
| `src/pages/CookiePolicy.tsx` | Agregar SEOHead |
| `src/pages/LegalNotice.tsx` | Agregar SEOHead |
| `index.html` | JSON-LD, canonical, OG absolutas |

## Impacto esperado

- Google indexara correctamente todas las paginas publicas
- Cada pagina tendra title y description unicos (elimina contenido duplicado)
- Rich snippets en resultados de busqueda (nombre, telefono, tipo de negocio)
- Mejor CTR en redes sociales con Open Graph correcto
- Bloqueo de paginas privadas para no desperdiciar crawl budget

