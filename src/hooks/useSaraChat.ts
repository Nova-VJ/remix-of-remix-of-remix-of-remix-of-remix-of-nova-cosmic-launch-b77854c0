import { useState, useCallback, useEffect, useRef } from 'react';
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
const SARA_SESSION_KEY = 'nova_chat_session_id';

export const useSaraChat = (): UseSaraChatReturn => {
  const { user, session } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [demoCount, setDemoCount] = useState(0);
  const migrationDoneRef = useRef(false);

  const isDemo = !user;
  const demoLimitReached = isDemo && demoCount >= DEMO_LIMIT;

  // Load conversation from Supabase (for logged-in users)
  const loadConversation = async (userId: string) => {
    try {
      const { data: conversations, error: convError } = await supabase
        .from('conversations')
        .select('id')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })
        .limit(1);

      if (convError) throw convError;

      let convId: string;

      if (conversations && conversations.length > 0) {
        convId = conversations[0].id;
      } else {
        const { data: newConv, error: newConvError } = await supabase
          .from('conversations')
          .insert({ user_id: userId, title: 'Chat con Sara' })
          .select('id')
          .single();

        if (newConvError) throw newConvError;
        convId = newConv.id;
      }

      setConversationId(convId);

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

      return convId;
    } catch (e) {
      console.error('Error loading conversation:', e);
      setError('Error al cargar el historial');
      return null;
    }
  };

  // Migrate demo messages to DB when user logs in
  const migrateDemoMessages = async (userId: string, convId: string) => {
    const storedMessages = localStorage.getItem(DEMO_MESSAGES_KEY);
    if (!storedMessages) return;

    try {
      const demoMessages: Message[] = JSON.parse(storedMessages).map((m: any) => ({
        ...m,
        createdAt: new Date(m.createdAt)
      }));

      if (demoMessages.length === 0) return;

      // Insert demo messages into DB at the beginning
      for (const msg of demoMessages) {
        await supabase.from('chat_messages').insert({
          conversation_id: convId,
          user_id: userId,
          role: msg.role,
          content: msg.content
        });
      }

      // Reload messages from DB (includes migrated + any existing)
      const { data: chatMessages } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('conversation_id', convId)
        .order('created_at', { ascending: true });

      if (chatMessages) {
        setMessages(chatMessages.map((m) => ({
          id: m.id,
          role: m.role as 'user' | 'assistant',
          content: m.content,
          createdAt: new Date(m.created_at)
        })));
      }

      // Clear demo data from localStorage
      localStorage.removeItem(DEMO_MESSAGES_KEY);
      localStorage.removeItem(DEMO_COUNT_KEY);
    } catch (e) {
      console.error('Error migrating demo messages:', e);
    }
  };

  // Main effect: load messages based on auth state
  useEffect(() => {
    if (isDemo) {
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
    } else if (user && !migrationDoneRef.current) {
      migrationDoneRef.current = true;
      // Check if there are demo messages to migrate
      const hasDemoMessages = !!localStorage.getItem(DEMO_MESSAGES_KEY);
      
      loadConversation(user.id).then((convId) => {
        if (convId && hasDemoMessages) {
          migrateDemoMessages(user.id, convId);
        }
      });
    }
  }, [user]);

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

    setMessages(prev => [...prev, userMessage]);

    try {
      const accessToken = session?.access_token;

      let sid = localStorage.getItem(SARA_SESSION_KEY);
      if (!sid) {
        sid = crypto.randomUUID();
        localStorage.setItem(SARA_SESSION_KEY, sid);
      }

      const { reply, session_id } = await sendToSara(content, accessToken, sid);

      if (session_id && session_id !== sid) {
        localStorage.setItem(SARA_SESSION_KEY, session_id);
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: reply || 'Ahora mismo no puedo responder. Intenta de nuevo.',
        createdAt: new Date()
      };

      if (isDemo) {
        const newCount = demoCount + 1;
        setDemoCount(newCount);
        const newMessages = [...messages, userMessage, assistantMessage];
        setMessages(newMessages);
        saveDemoMessage(newMessages, newCount);
      } else {
        if (conversationId && user) {
          await supabase.from('chat_messages').insert({
            conversation_id: conversationId,
            user_id: user.id,
            role: 'user',
            content
          });

          await supabase.from('chat_messages').insert({
            conversation_id: conversationId,
            user_id: user.id,
            role: 'assistant',
            content: assistantMessage.content
          });

          await supabase
            .from('conversations')
            .update({ updated_at: new Date().toISOString() })
            .eq('id', conversationId);
        }

        setMessages(prev => [...prev, assistantMessage]);
      }
    } catch (e) {
      console.error('Error sending message:', e);

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
