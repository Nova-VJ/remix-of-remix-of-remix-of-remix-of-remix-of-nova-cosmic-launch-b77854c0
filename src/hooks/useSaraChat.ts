import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { sendToSara } from '@/lib/saraApi';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: Date;
}

interface UseSaraChatReturn {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (content: string) => Promise<void>;
  isDemo: boolean;
  demoCount: number;
  demoLimitReached: boolean;
  conversationId: string | null;
}

const DEMO_LIMIT = 3;
const DEMO_MESSAGES_KEY = 'sara_demo_messages';
const DEMO_COUNT_KEY = 'sara_demo_count';

export const useSaraChat = (): UseSaraChatReturn => {
  const { user, session } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [demoCount, setDemoCount] = useState(0);

  const isDemo = !user;
  const demoLimitReached = isDemo && demoCount >= DEMO_LIMIT;

  // Cargar mensajes al iniciar
  useEffect(() => {
    if (isDemo) {
      // Cargar mensajes de demo desde localStorage
      const storedMessages = localStorage.getItem(DEMO_MESSAGES_KEY);
      const storedCount = localStorage.getItem(DEMO_COUNT_KEY);
      
      if (storedMessages) {
        try {
          const parsed = JSON.parse(storedMessages);
          setMessages(parsed.map((m: any) => ({
            ...m,
            createdAt: new Date(m.createdAt)
          })));
        } catch (e) {
          console.error('Error parsing demo messages:', e);
        }
      }
      
      if (storedCount) {
        setDemoCount(parseInt(storedCount, 10));
      }
    } else {
      // Cargar conversación y mensajes desde Supabase
      loadConversation();
    }
  }, [user]);

  const loadConversation = async () => {
    if (!user) return;

    try {
      // Buscar la última conversación del usuario
      const { data: conversations, error: convError } = await supabase
        .from('conversations')
        .select('id')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(1);

      if (convError) throw convError;

      let convId: string;

      if (conversations && conversations.length > 0) {
        convId = conversations[0].id;
      } else {
        // Crear nueva conversación
        const { data: newConv, error: newConvError } = await supabase
          .from('conversations')
          .insert({ user_id: user.id, title: 'Chat con Sara' })
          .select('id')
          .single();

        if (newConvError) throw newConvError;
        convId = newConv.id;
      }

      setConversationId(convId);

      // Cargar mensajes de la conversación
      const { data: chatMessages, error: msgError } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('conversation_id', convId)
        .order('created_at', { ascending: true });

      if (msgError) throw msgError;

      if (chatMessages) {
        setMessages(chatMessages.map((m) => ({
          id: m.id,
          role: m.role as 'user' | 'assistant',
          content: m.content,
          createdAt: new Date(m.created_at)
        })));
      }
    } catch (e) {
      console.error('Error loading conversation:', e);
      setError('Error al cargar el historial');
    }
  };

  const saveDemoMessage = (newMessages: Message[], newCount: number) => {
    localStorage.setItem(DEMO_MESSAGES_KEY, JSON.stringify(newMessages));
    localStorage.setItem(DEMO_COUNT_KEY, newCount.toString());
  };

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;
    if (demoLimitReached) return;

    setIsLoading(true);
    setError(null);

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      createdAt: new Date()
    };

    // Añadir mensaje del usuario inmediatamente
    setMessages(prev => [...prev, userMessage]);

    try {
      // Obtener token de acceso si existe sesión
      const accessToken = session?.access_token;

      // Llamar a la Edge Function externa
      const { reply } = await sendToSara(content, accessToken);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: reply || 'Ahora mismo no puedo responder. Intenta de nuevo.',
        createdAt: new Date()
      };

      if (isDemo) {
        // Modo demo: guardar en localStorage
        const newCount = demoCount + 1;
        setDemoCount(newCount);
        const newMessages = [...messages, userMessage, assistantMessage];
        setMessages(newMessages);
        saveDemoMessage(newMessages, newCount);
      } else {
        // Modo logueado: guardar en Supabase
        if (conversationId && user) {
          // Guardar mensaje del usuario en DB
          await supabase
            .from('chat_messages')
            .insert({
              conversation_id: conversationId,
              user_id: user.id,
              role: 'user',
              content
            });

          // Guardar respuesta en DB
          await supabase
            .from('chat_messages')
            .insert({
              conversation_id: conversationId,
              user_id: user.id,
              role: 'assistant',
              content: assistantMessage.content
            });

          // Actualizar timestamp de la conversación
          await supabase
            .from('conversations')
            .update({ updated_at: new Date().toISOString() })
            .eq('id', conversationId);
        }

        setMessages(prev => [...prev, assistantMessage]);
      }
    } catch (e) {
      console.error('Error sending message:', e);
      
      // Añadir burbuja de error como mensaje de Sara
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Ahora mismo no puedo responder. Intenta de nuevo.',
        createdAt: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
      setError(e instanceof Error ? e.message : 'Error al enviar mensaje');
    } finally {
      setIsLoading(false);
    }
  }, [messages, isDemo, demoCount, demoLimitReached, conversationId, user, session]);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    isDemo,
    demoCount,
    demoLimitReached,
    conversationId
  };
};
