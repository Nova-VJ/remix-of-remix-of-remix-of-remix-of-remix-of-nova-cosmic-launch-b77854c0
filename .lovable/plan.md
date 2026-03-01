

# Google Cloud TTS para Sara

## Resumen
Reemplazar la voz nativa del navegador (`speechSynthesis`) por Google Cloud Text-to-Speech con el modelo **Gemini 2.5 Flash TTS**, voz **Achernar** y estilo juvenil castellano. Se creara una edge function backend que autentica con la cuenta de servicio de Google y devuelve audio MP3. El frontend reproducira el audio con cola y control de mute/stop, con fallback a texto si falla.

## Secretos necesarios

Se almacenaran dos secretos en el backend:
- **GOOGLE_TTS_API_KEY**: `AQ.Ab8RN6IzGOhGDAD6fGHsqocUZY81flSxGtB60r3idXQRQU6q7Q`
- **GOOGLE_SERVICE_ACCOUNT_JSON**: El contenido completo del archivo JSON de cuenta de servicio (para autenticacion OAuth si la API key no soporta el modelo Gemini TTS)

## Cambios

### 1. Nueva edge function: `google-tts`

Archivo: `supabase/functions/google-tts/index.ts`

- Recibe POST con `{ "text": "..." }`
- Intenta primero con API key (mas simple), si falla con 403/401, usa la cuenta de servicio para generar un access token OAuth2
- Llama a `https://eu-texttospeech.googleapis.com/v1/text:synthesize` con:
  ```json
  {
    "input": {
      "text": "TEXTO",
      "prompt": "Juvenil. Acento Valladolid. Castilla y Leon Espana."
    },
    "voice": {
      "languageCode": "es-ES",
      "name": "Achernar",
      "model_name": "gemini-2.5-flash-tts"
    },
    "audioConfig": { "audioEncoding": "MP3" }
  }
  ```
- Decodifica `audioContent` (base64) y responde con `Content-Type: audio/mpeg` y los bytes MP3
- Si falla, devuelve JSON con error y status apropiado

Para la autenticacion con cuenta de servicio se generara un JWT firmado con RS256 usando la clave privada del JSON, se intercambiara por un access token en `https://oauth2.googleapis.com/token`, y se usara como `Authorization: Bearer <token>`.

### 2. Actualizar `supabase/config.toml`

Anadir configuracion para la nueva funcion:
```toml
[functions.google-tts]
verify_jwt = false
```

### 3. Actualizar `SaraVoiceCallMode.tsx`

- Reemplazar la funcion `playTTS` (browser `speechSynthesis`) por una nueva `playGoogleTTS` que:
  - Llama a la edge function `google-tts` con el texto
  - Recibe bytes MP3
  - Crea un `Blob` -> `URL.createObjectURL` -> `new Audio()` y reproduce
  - Resuelve la promesa cuando el audio termina (`onended`)
  - Actualiza `audioLevel` durante la reproduccion para animar el orbe
- Anadir referencia `audioRef` para controlar el `Audio` activo (stop/pause)
- En `handleEndCall` y `handleMuteToggle`: parar el audio actual (`audioRef.current.pause()`)
- Si el usuario empieza a hablar (listening), detener cualquier audio en curso
- **Fallback**: Si la llamada a `google-tts` falla, usar `speechSynthesis` del navegador como respaldo y mostrar toast informativo

### 4. Cola de audio

Implementar una cola simple en `SaraVoiceCallMode`:
- `audioQueueRef = useRef<string[]>([])` para encolar textos pendientes
- Funcion `processQueue` que toma el siguiente texto, llama a `playGoogleTTS`, y al terminar procesa el siguiente
- Si el usuario habla o hace mute, vaciar la cola y parar el audio actual

### 5. Limpieza

- Eliminar `pickSpanishVoice` y toda la logica de `speechSynthesis` como TTS principal (mantener solo como fallback)
- La edge function `elevenlabs-tts` queda sin uso y se puede eliminar opcionalmente

## Secuencia del flujo

```text
Usuario habla --> Deepgram STT --> texto --> Sara API --> respuesta texto
    --> google-tts edge function --> MP3 bytes --> Audio() --> reproducir
    --> al terminar: volver a escuchar
```

## Detalles tecnicos

- La firma JWT RS256 en Deno se hara importando la clave privada PEM con `crypto.subtle.importKey` y firmando con `crypto.subtle.sign`
- El token OAuth tiene 1h de validez; se puede cachear en memoria de la edge function
- El texto se limita a 5000 caracteres por llamada (limite de Google)
- El audio se reproduce con la Web Audio API estandar (`HTMLAudioElement`)

