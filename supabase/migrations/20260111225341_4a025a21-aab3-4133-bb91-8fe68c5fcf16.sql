-- Tabla para conversaciones anónimas de Sara
CREATE TABLE public.sara_anonymous_conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  anon_id TEXT NOT NULL,
  anon_number INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Índice para buscar por anon_id
CREATE INDEX idx_sara_anon_conv_anon_id ON public.sara_anonymous_conversations(anon_id);

-- Tabla para mensajes de conversaciones anónimas
CREATE TABLE public.sara_anonymous_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES public.sara_anonymous_conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Índice para buscar mensajes por conversación
CREATE INDEX idx_sara_anon_msg_conv ON public.sara_anonymous_messages(conversation_id);

-- Secuencia para generar números de anónimos
CREATE SEQUENCE IF NOT EXISTS sara_anon_number_seq START 1;

-- Función para asignar número de anónimo automáticamente
CREATE OR REPLACE FUNCTION public.assign_anon_number()
RETURNS TRIGGER AS $$
BEGIN
  -- Buscar si ya existe un número para este anon_id
  SELECT anon_number INTO NEW.anon_number
  FROM public.sara_anonymous_conversations
  WHERE anon_id = NEW.anon_id
  LIMIT 1;
  
  -- Si no existe, asignar nuevo número
  IF NEW.anon_number IS NULL THEN
    NEW.anon_number := nextval('sara_anon_number_seq');
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Trigger para asignar número antes de insertar
CREATE TRIGGER assign_anon_number_trigger
BEFORE INSERT ON public.sara_anonymous_conversations
FOR EACH ROW
EXECUTE FUNCTION public.assign_anon_number();

-- Habilitar RLS
ALTER TABLE public.sara_anonymous_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sara_anonymous_messages ENABLE ROW LEVEL SECURITY;

-- Políticas: Solo admins pueden ver las conversaciones anónimas
CREATE POLICY "Admins can view anonymous conversations"
ON public.sara_anonymous_conversations
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM profiles
  WHERE profiles.user_id = auth.uid() AND profiles.is_admin = true
));

CREATE POLICY "Admins can manage anonymous conversations"
ON public.sara_anonymous_conversations
FOR ALL
USING (EXISTS (
  SELECT 1 FROM profiles
  WHERE profiles.user_id = auth.uid() AND profiles.is_admin = true
));

CREATE POLICY "Admins can view anonymous messages"
ON public.sara_anonymous_messages
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM profiles
  WHERE profiles.user_id = auth.uid() AND profiles.is_admin = true
));

CREATE POLICY "Admins can manage anonymous messages"
ON public.sara_anonymous_messages
FOR ALL
USING (EXISTS (
  SELECT 1 FROM profiles
  WHERE profiles.user_id = auth.uid() AND profiles.is_admin = true
));

-- Política para permitir inserciones desde edge functions (service role)
CREATE POLICY "Service role can insert anonymous conversations"
ON public.sara_anonymous_conversations
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Service role can insert anonymous messages"
ON public.sara_anonymous_messages
FOR INSERT
WITH CHECK (true);

-- Añadir políticas a chat_messages para que el admin pueda verlos
CREATE POLICY "Admins can view all chat messages"
ON public.chat_messages
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM profiles
  WHERE profiles.user_id = auth.uid() AND profiles.is_admin = true
));

-- Añadir políticas a conversations para que el admin pueda verlas
CREATE POLICY "Admins can view all conversations"
ON public.conversations
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM profiles
  WHERE profiles.user_id = auth.uid() AND profiles.is_admin = true
));

-- Añadir columna budget_id a projects para vincular presupuesto con proyecto
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS budget_id UUID REFERENCES public.budgets(id);

-- Actualizar políticas de projects para permitir que admins creen proyectos
CREATE POLICY "Admins can insert projects"
ON public.projects
FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1 FROM profiles
  WHERE profiles.user_id = auth.uid() AND profiles.is_admin = true
));

CREATE POLICY "Admins can update all projects"
ON public.projects
FOR UPDATE
USING (EXISTS (
  SELECT 1 FROM profiles
  WHERE profiles.user_id = auth.uid() AND profiles.is_admin = true
));

CREATE POLICY "Admins can view all projects"
ON public.projects
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM profiles
  WHERE profiles.user_id = auth.uid() AND profiles.is_admin = true
));