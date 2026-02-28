

# Plan: Corregir branding en todas las plataformas + Scroll de Sara en movil

## 1. Reemplazar imagenes OG/Twitter por el icono oficial de Nova

**Problema**: Las meta tags `og:image` y `twitter:image` en `index.html` apuntan a `https://lovable.dev/opengraph-image-p98pqg.png`. Por eso al compartir desde iPhone (u otro sitio) sale la miniatura de Lovable en lugar de Nova.

**Solucion**: Cambiar ambas URLs a la imagen oficial de Nova. Como las meta tags OG requieren URLs absolutas, se usara la URL de preview del proyecto apuntando al icono PNG 512.

**Archivo**: `index.html` (lineas 18 y 22)

## 2. Agregar apple-touch-icon de mayor resolucion para iPhone

**Problema**: iPhone usa el `apple-touch-icon` para el icono del acceso directo. Actualmente apunta a `nova-icon-192.png` (192x192), pero iOS prefiere 180x180 y escala desde la imagen mas grande disponible. Para mejor calidad se debe apuntar al de 512px.

**Solucion**: Cambiar `apple-touch-icon` de `nova-icon-192.png` a `nova-icon-512.png` para que iOS tenga la mayor resolucion posible al recortar el icono.

**Archivo**: `index.html` (linea 31)

## 3. Scroll del chat de Sara en movil

**Problema**: El `ScrollArea` de Radix no permite scroll tactil en iOS. El modo IA ya usa scroll nativo y funciona bien.

**Solucion**: Reemplazar `<ScrollArea>` por un `<div>` con `overflow-y-auto`, `overscroll-contain`, `-webkit-overflow-scrolling: touch` y `touch-action: pan-y`.

**Archivo**: `src/components/VirtualAssistant/index.tsx` (lineas 499 y 513)

## 4. Verificacion de iconos en todas las plataformas

Despues de aplicar los cambios, se verificara que cada icono se vea correctamente:

- **iPhone**: Icono de acceso directo en pantalla de inicio (apple-touch-icon), miniatura al compartir por iMessage/Safari (og:image), favicon en pestana de Safari
- **Android**: Icono de acceso directo en pantalla de inicio (manifest icons any), icono adaptativo en el launcher (manifest icons maskable), favicon en Chrome
- **PC**: Favicon en pestana del navegador (SVG), icono de la PWA instalada (manifest icons any), miniatura al compartir en redes sociales (og:image)

Se comprobara que en ninguna plataforma aparezca el logo de Lovable ni bordes blancos no deseados.

## Seccion tecnica

### `index.html` - Cambios:

```text
<!-- Linea 18: cambiar og:image -->
<meta property="og:image" content="/nova-icon-512.png" />

<!-- Linea 22: cambiar twitter:image -->
<meta name="twitter:image" content="/nova-icon-512.png" />

<!-- Linea 31: mejorar apple-touch-icon -->
<link rel="apple-touch-icon" href="/nova-icon-512.png" />
```

### `VirtualAssistant/index.tsx` - Reemplazar ScrollArea:

Cambiar linea 499:
```text
<ScrollArea className="flex-1 p-4" style={{ maxHeight: '400px' }} ref={scrollRef}>
```
Por:
```text
<div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4" ref={scrollRef} style={{ maxHeight: '400px', WebkitOverflowScrolling: 'touch', touchAction: 'pan-y' }}>
```

Y linea 513: cambiar `</ScrollArea>` por `</div>`.

Eliminar la importacion de `ScrollArea` si ya no se usa en el archivo.

