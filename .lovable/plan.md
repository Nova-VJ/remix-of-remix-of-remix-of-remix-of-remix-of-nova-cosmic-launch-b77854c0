

# Plan: Optimizar Google TTS para igualar la velocidad de ElevenLabs

## Diagnostico

El Google TTS actual tarda 3-10 segundos, pero NO es culpa del modelo `gemini-2.5-flash-tts`. El problema esta en el codigo de la edge function, que tiene varios fallos graves:

### Bug 1: Doble llamada con API key
```text
Linea 141: synthesize(text, {})          <-- Llamada SIN api key (siempre falla)
Linea 149: fetch(urlWithKey, ...)        <-- Llamada CON api key (la correcta)
```
Se hacen DOS llamadas HTTP a Google, la primera siempre falla. Eso ya son 1-2 segundos perdidos.

### Bug 2: Fallback a OAuth2 innecesario
Si la API key falla (porque el primer intento sin key contamina `ttsRes`), se lanza el flujo OAuth2 completo: generar JWT, firmar con RSA, intercambiar por access token, y luego hacer otra llamada. Eso anade 2-4 segundos.

### Bug 3: Base64 decode en el servidor
Google TTS devuelve audio en base64 dentro de JSON. La edge function lo decodifica byte a byte en un bucle, lo cual es lento para audios largos.

### Resultado: 3 llamadas HTTP + decode lento = 3-10 segundos

## Solucion: Corregir la edge function

Con los bugs arreglados, Google TTS deberia responder en **500ms-1.5s**, comparable a ElevenLabs (~300-800ms).

### Cambios en `supabase/functions/google-tts/index.ts`

1. **Eliminar la llamada duplicada**: Una sola llamada con API key directamente en la URL
2. **Simplificar el flujo de auth**: Probar API key primero. Si no hay key, usar service account. Sin llamadas duplicadas
3. **Decodificacion rapida de base64**: Usar `atob` con `Uint8Array.from()` en una sola linea en vez del bucle manual
4. **Eliminar la funcion `synthesize` separada**: Inline el fetch para evitar confusion y la llamada fantasma

### Codigo simplificado (estructura)

```text
1. Recibir texto
2. Si hay GOOGLE_TTS_API_KEY:
   - fetch(TTS_URL + "?key=" + apiKey, body)
3. Si no hay key o fallo:
   - getAccessToken() (con cache)
   - fetch(TTS_URL, body, Authorization: Bearer token)
4. Decodificar base64 -> bytes (una linea)
5. Devolver audio/mpeg
```

### Cambios en `SaraVoiceCallMode.tsx`

Ninguno necesario. El frontend ya llama a `google-tts` y reproduce el blob correctamente.

## Resultado esperado

```text
ANTES (con bugs):
fetch sin key (1-2s) + fetch con key (falla) + OAuth2 JWT (1-2s) + fetch con token (1-2s) + decode lento = 3-10s

DESPUES (corregido):  
fetch con key (0.5-1.5s) + decode rapido = 0.5-1.5s
```

## Comparativa final

| Proveedor | Tiempo estimado |
|---|---|
| Google TTS (actual, con bugs) | 3-10s |
| Google TTS (corregido) | 0.5-1.5s |
| ElevenLabs TTS | 0.3-0.8s |

La diferencia entre Google corregido y ElevenLabs seria minima (menos de 1 segundo). No merece la pena cambiar de proveedor si se corrige el codigo.

## Archivos a modificar

| Archivo | Cambio |
|---|---|
| `supabase/functions/google-tts/index.ts` | Eliminar llamada duplicada, simplificar auth flow, decode rapido |

