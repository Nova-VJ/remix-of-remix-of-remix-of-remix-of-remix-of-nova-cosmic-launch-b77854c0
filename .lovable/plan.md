

# Optimizar velocidad, eliminar asteriscos y UI premium para la llamada de Sara

## Problema actual

1. **Lentitud**: La edge function `sara-chat` ejecuta la clasificacion IA y las notificaciones push DE FORMA SINCRONA antes de devolver la respuesta. Esto anade 2-5 segundos innecesarios a cada mensaje.
2. **Asteriscos**: El system prompt no prohibe markdown, asi que el modelo responde con `**negritas**` y `*cursivas*` que el TTS lee como "asterisco".
3. **UI basica**: La interfaz de llamada es funcional pero simple, sin aspecto premium.

## Cambios

### 1. Acelerar respuesta de sara-chat (edge function)

Archivo: `supabase/functions/sara-chat/index.ts`

- **Mover clasificacion y notificaciones a segundo plano**: Usar `EdgeRuntime` o simplemente NO hacer await en la clasificacion. Devolver la respuesta al usuario inmediatamente despues de guardar el mensaje de Sara, y ejecutar clasificacion/notificacion/push sin bloquear.
- **Usar modelo mas rapido**: Cambiar de `google/gemini-2.5-flash` a `google/gemini-2.5-flash-lite` para respuestas mas agiles (suficiente para un chatbot de ventas).
- **Reducir max_tokens**: De 500 a 300, ya que respuestas mas cortas son mejores para voz.
- **Reducir historial**: Cargar solo los ultimos 6 mensajes en vez de 10 para reducir tokens de entrada.

### 2. Eliminar asteriscos y markdown del prompt

Archivo: `supabase/functions/sara-chat/index.ts`

Anadir al SYSTEM_PROMPT las siguientes instrucciones:

```
FORMATO DE RESPUESTA (CRITICO):
- NUNCA uses asteriscos (*), negritas (**), cursivas, ni ningun formato markdown
- Escribe texto plano siempre, sin formato especial
- No uses listas con guiones ni numeradas a menos que sea estrictamente necesario
- Tus respuestas se leen en voz alta, asi que escribe de forma natural y conversacional
```

Ademas, en el frontend (`SaraVoiceCallMode.tsx`), anadir un regex para limpiar cualquier asterisco residual antes de enviarlo al TTS:

```typescript
.replace(/\*+/g, '')
```

### 3. Interfaz de llamada premium

Archivo: `src/components/VirtualAssistant/SaraVoiceCallMode.tsx`

Redisenar la interfaz con:

- **Fondo inmersivo**: Gradiente oscuro de pantalla completa con particulas o estrellas sutiles usando CSS, estilo cosmico coherente con la estetica del proyecto.
- **Orbe mejorado**: Multiples capas de glow con colores mas ricos (violet/indigo/cyan), efecto "glass morphism" interno, y anillos concentricos animados que reaccionan al audio.
- **Avatar de Sara**: Mostrar la imagen `sara-avatar.png` dentro del orbe cuando esta idle o procesando.
- **Tipografia premium**: Nombre "Sara" en texto grande con font-weight light, estado en texto mas pequeno con tracking wide.
- **Controles rediseados**: Botones con fondo glass/blur, iconos mas grandes, separacion visual clara. Boton de colgar rojo brillante con glow.
- **Indicador de ondas**: Barras de audio animadas (tipo ecualizador) cuando Sara habla, en lugar del simple circulo pulsante.
- **Transiciones suaves**: AnimatePresence para cada cambio de estado con fade/scale.

### 4. Resumen de secuencia optimizada

```text
ANTES (lento):
Usuario habla -> STT -> sara-chat [AI + guardar + notificar + CLASIFICAR + PUSH] -> respuesta -> TTS

DESPUES (rapido):
Usuario habla -> STT -> sara-chat [AI + guardar] -> respuesta -> TTS
                                                 \-> [notificar + clasificar + push en background]
```

Tiempo estimado de mejora: 2-4 segundos menos por turno de conversacion.

## Archivos a modificar

| Archivo | Cambio |
|---|---|
| `supabase/functions/sara-chat/index.ts` | Modelo lite, max_tokens 300, historial 6, background tasks, prompt sin markdown |
| `src/components/VirtualAssistant/SaraVoiceCallMode.tsx` | UI premium completa, limpieza de asteriscos en cleanReply |

