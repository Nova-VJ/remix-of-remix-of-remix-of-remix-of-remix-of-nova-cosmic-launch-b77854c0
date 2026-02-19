
## Fix del build de Cloudflare Pages — lockfile desincronizado

### Diagnóstico del problema

Cloudflare Pages usa `npm ci` (clean install), que es estricto: **falla si el `package-lock.json` no coincide exactamente con `package.json`**. El log muestra conflictos en:

- `rollup`: lockfile tiene `4.24.0` pero `package.json` requiere `4.57.x`
- `ajv`: lockfile tiene `6.12.6` pero se necesita `8.18.0`
- `picomatch`: lockfile tiene `2.3.1` pero se necesita `4.0.3`
- `@rollup/*` platform binaries: todos desactualizados
- `json-schema-traverse`, `@types/estree`: versiones incompatibles

Esto ocurre porque el `package.json` ha recibido actualizaciones de versiones (vite, rollup, etc.) pero el `package-lock.json` no se regeneró en sincronía.

### Solución: Eliminar el lockfile y que Cloudflare use `npm install`

Dado que no es posible ejecutar `npm install` directamente para regenerar el lockfile, la solución más limpia es:

**1. Eliminar el `package-lock.json`** del repositorio (escribir un archivo vacío o eliminarlo hace que `npm install` lo regenere).

**2. Cambiar el comando de build en Cloudflare Pages** de su `npm ci` automático a un comando explícito:
```
npm install && npm run build
```

Esto se configura en el panel de Cloudflare Pages → Settings → Builds & Deployments → Build command.

**3. Agregar `.nvmrc`** con `20` para fijar Node 20.x en Cloudflare.

**4. Agregar `engines`** en `package.json` para declarar explícitamente la versión de Node compatible.

---

### Archivos a modificar/crear

| Archivo | Cambio |
|---|---|
| `package.json` | Añadir `"engines": { "node": ">=20.0.0" }` |
| `.nvmrc` | Crear con contenido `20` |
| `package-lock.json` | Eliminar (se reemplaza por uno mínimo vacío que fuerza a Cloudflare a usar `npm install`) |

### Instrucción manual requerida en Cloudflare (1 paso)

Una vez hecho el commit, hay que cambiar el **build command** en Cloudflare Pages:

> Settings → Builds & Deployments → Build command → cambiar a:
> `npm install && npm run build`

Esto evita que Cloudflare use `npm ci` automáticamente, y en su lugar ejecuta `npm install` que genera el lockfile fresco y luego compila.

### Por qué esto es seguro

- El proyecto compila correctamente en el entorno de Lovable (Node 22, npm 10)
- El `package.json` tiene todas las versiones correctas con rangos `^`
- `npm install` resolverá las versiones más recientes compatibles y generará un lockfile correcto
- El build con `vite build` funciona perfectamente (ya se ha verificado en Lovable)
