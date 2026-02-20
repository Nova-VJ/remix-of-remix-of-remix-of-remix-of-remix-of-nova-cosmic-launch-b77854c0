

## Chat Sara: Recomendaciones interactivas al carrito (estilo Ecoland)

### Estado actual

El sistema de propuestas al carrito ya existe parcialmente:
- La edge function `sara-chat` tiene instrucciones en el system prompt para generar `[PROPUESTA_CARRITO:{...}]` al final de sus respuestas
- `AIChatMode.tsx` ya parsea ese tag con `extractCartProposal()` y muestra una card con botones "Añadir al carrito" / "No, gracias"
- El `CartContext` ya soporta `addItem()` con servicios y paquetes

Sin embargo, hay problemas que impiden que funcione bien:

1. **Sara no siempre genera la propuesta** porque el prompt no es lo suficientemente claro sobre cuándo y cómo hacerlo
2. **La card de propuesta es demasiado simple** - no se parece al estilo de Ecoland (con iconos, precios destacados e items individuales seleccionables)
3. **Los items de la propuesta no coinciden con los IDs reales del carrito** (el CartContext espera IDs como "web", "apps", "pkg-pro", etc.)
4. **Falta feedback visual** cuando se acepta o rechaza la propuesta

### Cambios planificados

#### 1. Mejorar el system prompt de la edge function (`supabase/functions/sara-chat/index.ts`)

- Hacer las instrucciones de PROPUESTA_CARRITO mas claras y enfaticas
- Añadir ejemplos concretos de cuándo generar la propuesta (cuando el usuario describe su proyecto, cuando pregunta por precios de algo concreto)
- Asegurar que los IDs y precios del JSON coinciden con los del CartContext
- Añadir instruccion para que Sara presente la propuesta con un mensaje natural antes del tag (ej: "Basandome en lo que me cuentas, te recomiendo:")

#### 2. Mejorar la card de propuesta en `AIChatMode.tsx`

Rediseñar la card `pendingProposal` para que sea mas visual y profesional (estilo Ecoland):

- Cada item aparece como una mini-card con icono del servicio, nombre y precio
- Precio total calculado y visible
- Boton principal "Aceptar y añadir al carrito" con icono de carrito
- Boton secundario "No me interesa"
- Animacion de entrada suave
- Feedback visual tras aceptar (checkmark, toast con resumen)

#### 3. Mejorar la ventana del chat en PC

- La ventana del chat AI (`h-[400px]`) es fija y a veces corta mensajes
- Cambiar a `h-[450px]` o `max-h-[70vh]` para pantallas grandes
- Asegurar que el ScrollArea funciona correctamente y no corta contenido

#### 4. Fix del link al formulario que genera Sara

Sara genera links como `https://solutionsnova.es/formulario` que dan 404. El normalizador ya reemplaza `[LINK_FORMULARIO]` por `?openBriefing=true`, pero Sara a veces genera URLs literales en lugar del placeholder.

- Actualizar el system prompt para que Sara use SIEMPRE el placeholder `[LINK_FORMULARIO]` y NUNCA escriba URLs de formulario
- Añadir en `normalizeSaraReply` un regex que capture URLs con "formulario" y las reemplace por el FORM_URL correcto

#### 5. Fix de links que se salen del cuerpo del chat

- Los links largos no tienen `word-break` y se desbordan del contenedor
- Añadir `break-all` o `overflow-wrap: break-word` al contenedor de mensajes en AIChatMode

### Archivos a modificar

| Archivo | Cambio |
|---|---|
| `supabase/functions/sara-chat/index.ts` | Mejorar system prompt para propuestas de carrito y uso de placeholders |
| `src/components/VirtualAssistant/AIChatMode.tsx` | Rediseñar card de propuesta, fix overflow de links, ajustar altura del chat |
| `src/components/VirtualAssistant/index.tsx` | Ajustar altura del contenedor ai-chat |

### Detalles tecnicos

**Formato del JSON de propuesta (sin cambios):**
```json
[PROPUESTA_CARRITO:{"items":[{"id":"web","name":"Pagina Web","price":1000,"type":"service"}],"description":"Recomendacion personalizada"}]
```

**IDs validos del CartContext:**
- Servicios: `web` (1000), `apps` (1700), `social` (500), `branding` (300), `marketing` (200), `sem` (150)
- Paquetes: `pkg-pro` (1400), `pkg-plus` (2500)

**Iconos por servicio (para la card mejorada):**
- web -> Globe
- apps -> Smartphone
- social -> Share2
- branding -> Palette
- marketing -> TrendingUp
- sem -> BarChart3
- pkg-pro -> Briefcase
- pkg-plus -> Gem

