

# Plan: Notas de voz + Modo llamada con Sara (ElevenLabs)

## Resumen

Se agregaran dos funcionalidades al chat de Sara:
1. **Notas de voz**: Un boton de microfono en el chat para enviar mensajes por voz (Speech-to-Text)
2. **Modo llamada**: Una pantalla tipo "llamada" con animacion visual que se mueve con la voz de Sara (Text-to-Speech), similar a ChatGPT

## Arquitectura

```text
Usuario habla (microfono)
       |
       v
[ElevenLabs STT] --- transcribe ---> texto
       |
       v
[sara-chat edge function] --- responde ---> texto de Sara
       |
       v
[ElevenLabs TTS] --- genera audio ---> voz de Sara
       |
       v
Animacion visual + reproduccion de audio
```

## Componentes nuevos a crear

### 1. Edge function: `elevenlabs-tts` (Text-to-Speech)
- Recibe texto y lo convierte en audio MP3 usando ElevenLabs
- Usa el modelo `eleven_multilingual_v2` para voz en espanol
- Voz femenina profesional (Laura - FGY2WhTYpPnrIDTdsKH5, voz femenina con acento europeo)
- Devuelve audio binario

### 2. Edge function: `elevenlabs-stt` (Speech-to-Text)
- Recibe audio grabado desde el microfono del usuario
- Usa el modelo `scribe_v2` para transcribir a texto
- Idioma: espanol (`spa`)
- Devuelve el texto transcrito

### 3. Componente: `SaraVoiceCallMode.tsx`
- Pantalla completa dentro del widget de chat
- Animacion circular/orbe que pulsa con la voz de Sara (similar a ChatGPT)
- Estados visuales:
  - **Escuchando**: Orbe azul pulsante, icono de microfono activo
  - **Procesando**: Orbe con animacion de carga
  - **Sara hablando**: Orbe grande pulsando con la amplitud del audio
  - **Pausa**: Orbe estatico, boton para hablar
- Boton rojo para colgar/terminar la llamada
- Boton de mute para silenciar microfono

### 4. Boton de microfono en AIChatMode
- Al lado del boton de enviar, un boton de microfono
- Al presionar: graba audio, lo transcribe con STT, y envia el texto como mensaje normal
- Indicador visual de grabacion (punto rojo pulsante)

### 5. Boton de "Llamar a Sara" en el menu principal del asistente
- Nueva opcion en el menu con icono de telefono
- Abre directamente el modo llamada

## Flujo del modo llamada

1. Usuario toca "Llamar a Sara"
2. Se pide permiso de microfono
3. Aparece la pantalla de llamada con animacion
4. Sara saluda con voz: "Hola, soy Sara, tu asistente de Nova. En que puedo ayudarte?"
5. El usuario habla, su voz se transcribe (STT)
6. El texto se envia a sara-chat
7. La respuesta de Sara se convierte en audio (TTS)
8. Se reproduce el audio con animacion visual sincronizada
9. Se repite el ciclo hasta que el usuario "cuelga"

## Flujo de nota de voz en chat

1. Usuario toca icono de microfono en el chat
2. Se graba audio (MediaRecorder API)
3. Al soltar/parar, se envia a STT
4. El texto transcrito aparece como mensaje del usuario
5. Sara responde normalmente por texto (y opcionalmente se puede activar TTS)

## Archivos a crear/modificar

| Archivo | Accion |
|---------|--------|
| `supabase/functions/elevenlabs-tts/index.ts` | Crear - Edge function TTS |
| `supabase/functions/elevenlabs-stt/index.ts` | Crear - Edge function STT |
| `supabase/config.toml` | Modificar - Agregar funciones TTS y STT |
| `src/components/VirtualAssistant/SaraVoiceCallMode.tsx` | Crear - Modo llamada con animacion |
| `src/components/VirtualAssistant/VoiceRecordButton.tsx` | Crear - Boton microfono para chat |
| `src/components/VirtualAssistant/AIChatMode.tsx` | Modificar - Agregar boton de microfono |
| `src/components/VirtualAssistant/index.tsx` | Modificar - Agregar opcion "Llamar a Sara" y estado voice-call |
| `src/hooks/useVoiceRecorder.ts` | Crear - Hook para grabar audio del microfono |

## Detalles tecnicos

### Animacion del orbe
- Usara framer-motion (ya instalado) para animar un circulo/orbe
- La amplitud se calculara con `AnalyserNode` del Web Audio API durante la reproduccion del audio de Sara
- Colores: degradado del tema de Nova (morado/azul)
- Efecto de "respiracion" cuando esta en espera

### Grabacion de audio
- `MediaRecorder` API del navegador
- Formato: webm/opus (compatible con ElevenLabs STT)
- Deteccion automatica de silencio para modo llamada (VAD simple)

### Permisos de microfono
- Se pedira permiso antes de iniciar grabacion
- Si se deniega, se mostrara un mensaje explicativo

### Compatibilidad movil
- Touch events para el boton de grabar
- `-webkit-overflow-scrolling: touch` donde sea necesario
- Funciona en iOS Safari y Android Chrome

