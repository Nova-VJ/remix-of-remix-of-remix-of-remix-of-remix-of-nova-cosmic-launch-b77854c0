
Objetivo: corregir únicamente el icono de acceso directo en móviles (especialmente iPhone) para que no se vea “incompleto” ni con marco blanco, manteniendo la misma imagen de Nova pero ampliada dentro del lienzo.

Diagnóstico confirmado:
- El icono actual (512) ya viene “pre-redondeado” y con margen interno.
- iOS vuelve a aplicar su propia máscara al crear el acceso directo, y ese doble recorte produce la sensación de borde/marco.
- Además, iPhone cachea muy agresivamente el icono si se reutiliza el mismo nombre de archivo.

Implementación propuesta (solo iconos móviles):
1) Crear nuevos assets dedicados para móvil (nombres nuevos para romper caché)
- `public/apple-touch-icon-v2-180.png` (iPhone/iPad)
- `public/nova-icon-any-v2-192.png`
- `public/nova-icon-any-v2-512.png`
- `public/nova-icon-maskable-v2-192.png`
- `public/nova-icon-maskable-v2-512.png`

2) Ajuste visual de esos nuevos assets
- Misma imagen/logo de Nova (sin cambiar branding), pero:
  - fondo sólido completo `#0f0a1e` en todo el cuadrado (sin transparencia exterior),
  - sin esquinas redondeadas “dibujadas” dentro del PNG (iOS/Android ya redondean),
  - logo/estrella ampliado aprox. +10% a +15% para evitar sensación de “icono pequeño dentro de marco”.

3) Actualizar referencias para usar solo los nuevos archivos (cache-busting real)
- `index.html`
  - cambiar a:
    - `<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon-v2-180.png" />`
  - no tocar favicon ni otras partes no relacionadas.
- `public/manifest.json`
  - reemplazar `icons` para que `any` y `maskable` apunten a los `*-v2-*`.

4) Verificación completa en móviles
- iPhone:
  - borrar acceso directo previo de la Home Screen,
  - volver a “Añadir a pantalla de inicio”,
  - confirmar que el icono ya no tiene borde blanco y se ve centrado/completo.
- Android:
  - reinstalar acceso directo/PWA,
  - confirmar icono `any` y `maskable` sin recortes extraños.
- Si persiste en iPhone:
  - limpiar caché de Safari para el sitio y reinstalar (solo como último paso).

Alcance exacto:
- Solo se modifica el comportamiento visual del icono móvil (assets + referencias de icono).
- No se tocarán chat, notificaciones ni otros módulos.
