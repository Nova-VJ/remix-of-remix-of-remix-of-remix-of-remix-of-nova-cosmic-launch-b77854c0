export interface FormData {
  // Hidden fields
  source: string;
  page_url: string;
  cart_services: string;
  
  // Contact info
  contacto_nombre: string;
  contacto_email: string;
  contacto_telefono: string;
  contacto_negocio: string;
  contacto_sector: string;
  contacto_web: string;
  
  // Services selected
  servicios: string[];
  
  // Section 1: General
  gen_etapa: string;
  gen_etapa_otro: string;
  gen_objetivo: string;
  gen_objetivo_otro: string;
  gen_tipo_cliente: string;
  gen_tipo_cliente_otro: string;
  gen_urgencia: string;
  gen_urgencia_otro: string;
  gen_presupuesto: string;
  gen_presupuesto_otro: string;
  gen_contenido: string;
  gen_contenido_otro: string;
  gen_competencia: string;
  gen_competencia_otro: string;
  gen_canal: string;
  gen_canal_otro: string;
  gen_prioridad_marca: string;
  gen_prioridad_marca_otro: string;
  gen_siguiente_paso: string;
  gen_siguiente_paso_otro: string;
  
  // Section 2: Branding
  branding_tipo: string;
  branding_tipo_otro: string;
  branding_urgencia: string;
  branding_urgencia_otro: string;
  branding_estilo: string;
  branding_estilo_otro: string;
  branding_personalidad: string;
  branding_personalidad_otro: string;
  branding_publico: string;
  branding_publico_otro: string;
  branding_diferenciacion: string;
  branding_diferenciacion_otro: string;
  branding_uso: string;
  branding_uso_otro: string;
  branding_colores: string;
  branding_colores_otro: string;
  branding_entregables: string;
  branding_entregables_otro: string;
  branding_referencias: string;
  branding_referencias_otro: string;
  
  // Section 3: Web
  web_tipo: string;
  web_tipo_otro: string;
  web_objetivo: string;
  web_objetivo_otro: string;
  web_contenidos: string;
  web_contenidos_otro: string;
  web_diseno: string;
  web_diseno_otro: string;
  web_seo: string;
  web_seo_otro: string;
  web_funcion: string;
  web_funcion_otro: string;
  web_idiomas: string;
  web_idiomas_otro: string;
  web_hosting: string;
  web_hosting_otro: string;
  web_mantenimiento: string;
  web_mantenimiento_otro: string;
  web_urgencia: string;
  web_urgencia_otro: string;
  
  // Section 4: Apps
  app_plataforma: string;
  app_plataforma_otro: string;
  app_etapa: string;
  app_etapa_otro: string;
  app_login: string;
  app_login_otro: string;
  app_pagos: string;
  app_pagos_otro: string;
  app_admin: string;
  app_admin_otro: string;
  app_notif: string;
  app_notif_otro: string;
  app_complejidad: string;
  app_complejidad_otro: string;
  app_usuarios: string;
  app_usuarios_otro: string;
  app_refs: string;
  app_refs_otro: string;
  app_mant: string;
  app_mant_otro: string;
  
  // Section 5: Social Media
  rrss_redes: string;
  rrss_redes_otro: string;
  rrss_objetivo: string;
  rrss_objetivo_otro: string;
  rrss_estado: string;
  rrss_estado_otro: string;
  rrss_formato: string;
  rrss_formato_otro: string;
  rrss_freq: string;
  rrss_freq_otro: string;
  rrss_material: string;
  rrss_material_otro: string;
  rrss_estilo: string;
  rrss_estilo_otro: string;
  rrss_ads: string;
  rrss_ads_otro: string;
  rrss_competencia: string;
  rrss_competencia_otro: string;
  rrss_entrega: string;
  rrss_entrega_otro: string;
  
  // Closing
  cierre_nota: string;
  cierre_nota_otro: string;
  privacidad: boolean;
}

export const initialFormData: FormData = {
  source: 'solutionsnova.es',
  page_url: '',
  cart_services: '',
  contacto_nombre: '',
  contacto_email: '',
  contacto_telefono: '',
  contacto_negocio: '',
  contacto_sector: '',
  contacto_web: '',
  servicios: [],
  gen_etapa: '',
  gen_etapa_otro: '',
  gen_objetivo: '',
  gen_objetivo_otro: '',
  gen_tipo_cliente: '',
  gen_tipo_cliente_otro: '',
  gen_urgencia: '',
  gen_urgencia_otro: '',
  gen_presupuesto: '',
  gen_presupuesto_otro: '',
  gen_contenido: '',
  gen_contenido_otro: '',
  gen_competencia: '',
  gen_competencia_otro: '',
  gen_canal: '',
  gen_canal_otro: '',
  gen_prioridad_marca: '',
  gen_prioridad_marca_otro: '',
  gen_siguiente_paso: '',
  gen_siguiente_paso_otro: '',
  branding_tipo: '',
  branding_tipo_otro: '',
  branding_urgencia: '',
  branding_urgencia_otro: '',
  branding_estilo: '',
  branding_estilo_otro: '',
  branding_personalidad: '',
  branding_personalidad_otro: '',
  branding_publico: '',
  branding_publico_otro: '',
  branding_diferenciacion: '',
  branding_diferenciacion_otro: '',
  branding_uso: '',
  branding_uso_otro: '',
  branding_colores: '',
  branding_colores_otro: '',
  branding_entregables: '',
  branding_entregables_otro: '',
  branding_referencias: '',
  branding_referencias_otro: '',
  web_tipo: '',
  web_tipo_otro: '',
  web_objetivo: '',
  web_objetivo_otro: '',
  web_contenidos: '',
  web_contenidos_otro: '',
  web_diseno: '',
  web_diseno_otro: '',
  web_seo: '',
  web_seo_otro: '',
  web_funcion: '',
  web_funcion_otro: '',
  web_idiomas: '',
  web_idiomas_otro: '',
  web_hosting: '',
  web_hosting_otro: '',
  web_mantenimiento: '',
  web_mantenimiento_otro: '',
  web_urgencia: '',
  web_urgencia_otro: '',
  app_plataforma: '',
  app_plataforma_otro: '',
  app_etapa: '',
  app_etapa_otro: '',
  app_login: '',
  app_login_otro: '',
  app_pagos: '',
  app_pagos_otro: '',
  app_admin: '',
  app_admin_otro: '',
  app_notif: '',
  app_notif_otro: '',
  app_complejidad: '',
  app_complejidad_otro: '',
  app_usuarios: '',
  app_usuarios_otro: '',
  app_refs: '',
  app_refs_otro: '',
  app_mant: '',
  app_mant_otro: '',
  rrss_redes: '',
  rrss_redes_otro: '',
  rrss_objetivo: '',
  rrss_objetivo_otro: '',
  rrss_estado: '',
  rrss_estado_otro: '',
  rrss_formato: '',
  rrss_formato_otro: '',
  rrss_freq: '',
  rrss_freq_otro: '',
  rrss_material: '',
  rrss_material_otro: '',
  rrss_estilo: '',
  rrss_estilo_otro: '',
  rrss_ads: '',
  rrss_ads_otro: '',
  rrss_competencia: '',
  rrss_competencia_otro: '',
  rrss_entrega: '',
  rrss_entrega_otro: '',
  cierre_nota: '',
  cierre_nota_otro: '',
  privacidad: false,
};

export type ServiceType = 'branding' | 'web' | 'apps' | 'rrss';

export const SERVICE_NAMES: Record<ServiceType, string> = {
  branding: 'Branding',
  web: 'Páginas Web',
  apps: 'Aplicaciones',
  rrss: 'Redes Sociales',
};
