import { isEn } from '@/i18n';

// FAQ Categories and Responses - Spanish
const FAQ_CATEGORIES_ES = {
  services: {
    label: 'Sobre nuestros servicios',
    questions: [
      {
        q: '¿Qué servicios ofrece Nova?',
        a: 'En Nova diseñamos y construimos sistemas digitales para crecer: webs que convierten, apps móviles, contenido y marketing en redes, branding profesional y ciberseguridad/pentesting. Todo con enfoque en resultados, velocidad y experiencia de usuario.'
      },
      {
        q: '¿Trabajáis con autónomos, pymes y empresas grandes?',
        a: 'Sí. Adaptamos el alcance al tamaño del negocio: desde una landing para validar una idea hasta plataformas completas con mantenimiento, soporte y seguridad.'
      },
      {
        q: '¿Puedo contratar solo una parte?',
        a: 'Sí. Puedes contratar solo diseño, solo desarrollo, solo mantenimiento, solo Ads, solo branding o solo ciberseguridad. También podemos mejorar o escalar lo que ya tienes.'
      },
      {
        q: '¿Trabajáis con clientes de toda España?',
        a: 'Sí. Trabajamos 100% online con reuniones por videollamada, entregas por fases y seguimiento por panel.'
      },
      {
        q: '¿Ofrecéis servicios recurrentes o solo proyectos puntuales?',
        a: 'Ambos. Hacemos proyectos cerrados (entrega final) y también planes mensuales (mantenimiento, redes, Ads, mejoras continuas y seguridad).'
      }
    ]
  },
  pricing: {
    label: 'Precios y presupuestos',
    questions: [
      {
        q: '¿Cuánto cuesta una página web?',
        a: 'Depende del tipo (landing, corporativa, e-commerce) y funciones. Te damos un rango y cerramos un presupuesto exacto tras un brief rápido (5 minutos).'
      },
      {
        q: '¿Cuánto cuesta una app móvil?',
        a: 'Depende de funciones (login, pagos, mapas, panel admin). Podemos empezar con un MVP y añadir módulos después.'
      },
      {
        q: '¿Cuánto cuestan los planes de redes sociales?',
        a: 'Hay planes desde gestión básica (community manager) hasta contenido + anuncios + estrategia. Se ajusta al volumen de publicaciones y objetivos.'
      },
      {
        q: '¿Cuánto cuesta ciberseguridad / pentesting?',
        a: 'Depende del alcance (web/app, nº de módulos, profundidad). Podemos empezar con auditoría express y escalar a pentesting avanzado con re-test.'
      },
      {
        q: '¿Los precios son cerrados o orientativos?',
        a: 'Primero damos rangos. Tras definir alcance y entregables, el presupuesto se convierte en cerrado con condiciones claras.'
      },
      {
        q: '¿Ofrecéis presupuestos personalizados?',
        a: 'Sí. Siempre. Cada negocio tiene objetivos distintos (ventas, leads, marca, seguridad), y el plan se adapta a eso.'
      },
      {
        q: '¿Hay costes extra que deba tener en cuenta?',
        a: 'Sí, normalmente aparte: dominio/hosting, herramientas premium, licencias, cuentas de Apple/Google para publicar apps y campañas de Ads (inversión publicitaria). En ciberseguridad, puede variar si se amplía el alcance.'
      },
      {
        q: '¿Puedo pagar en fases?',
        a: 'Sí. Normalmente trabajamos por hitos: inicio, avance, entrega (o mensual si es recurrente).'
      }
    ]
  },
  timelines: {
    label: 'Plazos y procesos',
    questions: [
      {
        q: '¿Cuánto tarda una web?',
        a: 'Depende del alcance. Una landing puede estar en 1–2 semanas, una corporativa en 2–4 semanas y un e-commerce suele requerir 4–8 semanas.'
      },
      {
        q: '¿Cuánto tarda una app?',
        a: 'Un MVP puede tardar 4–8 semanas. Una app media/avanzada puede ir de 8 a 16+ semanas según funciones y revisiones.'
      },
      {
        q: '¿Cuándo empieza el proyecto tras aceptar el presupuesto?',
        a: 'Tras confirmar el primer pago/hito y recibir el material necesario (logo, textos, accesos si aplica).'
      },
      {
        q: '¿Qué pasa si necesito algo urgente?',
        a: 'Podemos trabajar en modo prioridad si hay disponibilidad. Se define un alcance mínimo (MVP) para entregar rápido.'
      },
      {
        q: '¿Cómo es el proceso paso a paso?',
        a: '1) Brief → 2) Propuesta → 3) Diseño → 4) Desarrollo → 5) Revisión → 6) Publicación → 7) Soporte/mantenimiento.'
      },
      {
        q: '¿Puedo ver avances antes de la entrega final?',
        a: 'Sí. Entregamos por fases y compartimos avances (preview) para revisar antes de publicar.'
      }
    ]
  },
  maintenance: {
    label: 'Mantenimiento y soporte',
    questions: [
      {
        q: '¿Qué es el mantenimiento web?',
        a: 'Un plan para mantener tu web segura, actualizada y rápida: actualizaciones, backups, revisión de errores y soporte.'
      },
      {
        q: '¿Es obligatorio contratar mantenimiento?',
        a: 'No. La web se entrega funcionando. El mantenimiento es opcional pero muy recomendable para evitar problemas de seguridad y caídas.'
      },
      {
        q: '¿Qué incluye el soporte?',
        a: 'Resolución de incidencias, dudas, cambios menores de contenido y supervisión técnica según el plan contratado.'
      },
      {
        q: '¿Cómo pido ayuda si algo falla?',
        a: 'Puedes abrir un ticket desde el portal de cliente, escribir a soporte o contactar por WhatsApp para urgencias.'
      },
      {
        q: '¿Hacéis copias de seguridad?',
        a: 'Sí, en los planes con mantenimiento incluimos backups periódicos para restaurar la web si fuese necesario.'
      }
    ]
  },
  social: {
    label: 'Redes sociales y contenido',
    questions: [
      {
        q: '¿Creáis contenido o solo gestionáis?',
        a: 'Ambas opciones: solo gestión o gestión + creación de contenido (posts, reels, stories).'
      },
      {
        q: '¿Hacéis anuncios en redes sociales?',
        a: 'Sí. Configuramos y optimizamos campañas (Meta Ads/TikTok/LinkedIn) con seguimiento de resultados.'
      },
      {
        q: '¿Trabajáis con Instagram, TikTok, Facebook, LinkedIn?',
        a: 'Sí. Elegimos canales según tu objetivo y cliente ideal.'
      },
      {
        q: '¿Puedo contratar solo creación de contenido?',
        a: 'Sí. Packs por mes (X posts, X reels) o por pieza.'
      },
      {
        q: '¿Hay informes de resultados?',
        a: 'Sí, incluidos según plan. Reportamos alcance, engagement, crecimiento y métricas clave.'
      },
      {
        q: '¿Cuánto tiempo se tarda en ver resultados?',
        a: 'Depende. En orgánico, suele notarse en semanas/meses. En Ads, los resultados llegan antes pero requieren optimización continua.'
      }
    ]
  },
  cybersecurity: {
    label: 'Ciberseguridad / Pentesting',
    questions: [
      {
        q: '¿Qué es un pentesting?',
        a: 'Es una prueba de intrusión controlada para detectar vulnerabilidades antes de que sean explotadas.'
      },
      {
        q: '¿Qué evaluáis en un pentest?',
        a: 'Se evalúan puntos de entrada comunes, configuración, autenticación, exposición, y riesgos según el alcance pactado.'
      },
      {
        q: '¿Qué incluye el informe?',
        a: 'Vulnerabilidades encontradas, evidencias, severidad, impacto y recomendaciones priorizadas para corregir.'
      },
      {
        q: '¿Entregáis recomendaciones de remediación?',
        a: 'Sí. Incluimos pasos recomendados y prioridades para que el equipo aplique correcciones con orden.'
      },
      {
        q: '¿Hacéis re-test después de corregir?',
        a: 'Sí, en el plan Premium o como extra: verificamos que las correcciones cierran el riesgo.'
      },
      {
        q: '¿Cuánto tarda un pentest?',
        a: 'Depende del alcance. Puede ir de 1 a 4 semanas según complejidad y profundidad.'
      },
      {
        q: '¿Necesitamos firmar algo?',
        a: 'Se define un alcance (scope) y, si se requiere, se firma NDA y autorización para que la prueba sea legal y controlada.'
      },
      {
        q: '¿También hacéis seguridad continua?',
        a: 'Sí, ofrecemos planes mensuales para revisiones periódicas y control de cambios.'
      }
    ]
  },
  revisions: {
    label: 'Cambios, revisiones y garantías',
    questions: [
      {
        q: '¿Cuántas revisiones incluye el proyecto?',
        a: 'Depende del paquete. Se define por contrato (normalmente 1–2 en básico, más en pro/plus).'
      },
      {
        q: '¿Qué se considera un cambio extra?',
        a: 'Cambios fuera del alcance acordado (nuevas secciones, nuevas funciones, rediseños completos, nuevas pantallas).'
      },
      {
        q: '¿Hay garantía tras la entrega?',
        a: 'Sí. Se incluye un periodo de garantía para corregir errores del desarrollo.'
      },
      {
        q: '¿Qué pasa si algo falla después de publicar?',
        a: 'Si es bug, lo revisamos. Si es por cambios externos (plugins, servidores, actualizaciones), se resuelve vía mantenimiento o soporte por horas.'
      },
      {
        q: '¿Cómo solicito una modificación?',
        a: 'Abre un ticket desde aquí, describe el cambio y te respondemos con tiempo y coste si aplica.'
      }
    ]
  },
  billing: {
    label: 'Pagos, facturación y contratos',
    questions: [
      {
        q: '¿Cómo se realiza el pago?',
        a: 'Transferencia o método acordado. En proyectos grandes, se paga por fases.'
      },
      {
        q: '¿Se paga todo al inicio?',
        a: 'No. Normalmente hay un inicio y pagos por hitos (o mensual si es un plan).'
      },
      {
        q: '¿Aceptáis pagos por fases?',
        a: 'Sí. Es lo habitual: inicio → avance → entrega.'
      },
      {
        q: '¿Hay permanencia?',
        a: 'En proyectos cerrados no. En servicios mensuales depende del plan (a veces mensual sin permanencia, a veces mínimo 3 meses).'
      },
      {
        q: '¿Qué pasa si cancelo un servicio recurrente?',
        a: 'Puedes cancelarlo según condiciones del plan. Mantienes lo entregado y se detiene el servicio mensual.'
      }
    ]
  },
  security: {
    label: 'Seguridad, accesos y propiedad',
    questions: [
      {
        q: '¿La web/app es mía?',
        a: 'Sí. El producto es del cliente. Los detalles de entrega y accesos se definen en el acuerdo.'
      },
      {
        q: '¿Tendré acceso a todo?',
        a: 'Sí. Te damos accesos a lo que corresponda: dominio, hosting, repositorio, analítica, cuentas publicitarias, etc.'
      },
      {
        q: '¿Usáis repositorios?',
        a: 'Sí, usamos repositorios para control de versiones y despliegues seguros.'
      },
      {
        q: '¿Cómo protegéis mis datos?',
        a: 'Aplicamos buenas prácticas: accesos por roles, contraseñas seguras y minimización de datos. Si hay datos personales, se configura cumplimiento RGPD.'
      },
      {
        q: '¿Cumplís RGPD?',
        a: 'Sí, trabajamos con enfoque de privacidad. El cumplimiento final también depende de cómo el cliente use la web/app y los datos.'
      }
    ]
  }
};

// FAQ Categories and Responses - US English
const FAQ_CATEGORIES_EN = {
  services: {
    label: 'About Our Services',
    questions: [
      {
        q: 'What services does NOVA offer?',
        a: 'At NOVA, we design and build digital growth systems: conversion-focused websites, custom mobile and web applications, social media content and paid ads, brand identity, and cybersecurity/pentesting. Everything is engineered for speed, clean UX, and measurable business results.'
      },
      {
        q: 'Do you work with startups, small businesses, and enterprises?',
        a: 'Yes. We adapt the scope to your business stage: from an initial landing page to validate an offer, to scalable custom software with continuous support and enterprise security.'
      },
      {
        q: 'Can I hire just one specific service?',
        a: 'Absolutely. You can hire us strictly for UI/UX design, custom development, maintenance, paid ad management, branding, or security auditing. We can also optimize or rebuild existing systems.'
      },
      {
        q: 'Do you work with clients across the United States?',
        a: 'Yes. We operate 100% digitally with seamless video calls, sprint-based milestones, and real-time project portal tracking.'
      },
      {
        q: 'Do you offer monthly retainer plans or fixed-scope projects?',
        a: 'Both. We deliver fixed-scope turnkey projects (with defined delivery milestones) as well as monthly subscriptions (website maintenance, ad management, continuous improvements, and security).'
      }
    ]
  },
  pricing: {
    label: 'Pricing & Estimates',
    questions: [
      {
        q: 'How much does a custom website cost?',
        a: 'It depends on your scope (landing page, corporate website, or full e-commerce) and features. We provide a transparent range and a fixed quote following a quick 5-minute project briefing.'
      },
      {
        q: 'How much does a mobile app cost?',
        a: 'Pricing depends on functionality (authentication, payment processing, real-time sync, geolocation, admin portals). We frequently start with an MVP to validate quickly and scale in phases.'
      },
      {
        q: 'How much do social media and ad management plans cost?',
        a: 'Plans range from core content management to full-funnel paid advertising (Meta/TikTok/Google Ads) with custom creative production. Retainers are tailored to your target volume and conversion goals.'
      },
      {
        q: 'How much does cybersecurity / pentesting cost?',
        a: 'Pricing depends on attack surface and scope (web app, mobile app, API endpoints). We provide express security audits as well as comprehensive penetration tests with verified re-testing.'
      },
      {
        q: 'Are your quotes fixed or estimated?',
        a: 'We provide an upfront ballpark estimate, and once deliverables and technical scope are agreed upon, we lock in a clear fixed quote with no surprise fees.'
      },
      {
        q: 'Do you offer custom scopes?',
        a: 'Always. Every business has distinct priorities (sales, inbound leads, brand authority, or compliance), and every proposal is customized accordingly.'
      },
      {
        q: 'Are there any third-party costs to keep in mind?',
        a: 'Typically, third-party infrastructure is separate: domain registration, cloud hosting, third-party API keys, Apple/Google developer accounts ($99/year or $25 one-time), and direct ad spend. In cybersecurity, scope expansions are quoted prior to work.'
      },
      {
        q: 'Can I pay in milestones?',
        a: 'Yes. For fixed-scope projects we standardly work on milestone-based payments: kickoff deposit, milestone review, and final delivery prior to launch.'
      }
    ]
  },
  timelines: {
    label: 'Timelines & Process',
    questions: [
      {
        q: 'How long does a website take to build?',
        a: 'Landing pages are typically live in 1–2 weeks, standard business websites in 2–4 weeks, and advanced platforms or e-commerce stores in 4–8 weeks.'
      },
      {
        q: 'How long does a mobile app take?',
        a: 'An MVP usually takes 4–8 weeks. Feature-rich cross-platform applications typically run 8–16+ weeks depending on backend integrations and revision cycles.'
      },
      {
        q: 'When does work begin after quote acceptance?',
        a: 'Work kicks off immediately upon initial milestone confirmation and receipt of project onboarding materials (brand assets, copy guidelines, or account access).'
      },
      {
        q: 'Can you handle urgent rush turnarounds?',
        a: 'Yes, expedited priority sprints are available subject to team bandwidth. We establish a clear MVP scope to launch critical functionality fast.'
      },
      {
        q: 'What does your step-by-step process look like?',
        a: '1) Brief & Strategy → 2) Proposal & Agreement → 3) UI/UX Design → 4) Agile Development → 5) QA Testing & Review → 6) Live Launch → 7) Ongoing Support.'
      },
      {
        q: 'Can I see live progress before delivery?',
        a: 'Yes. We provide interactive staging preview links at each milestone so you can test features before going live.'
      }
    ]
  },
  maintenance: {
    label: 'Maintenance & Support',
    questions: [
      {
        q: 'What is web maintenance?',
        a: 'A dedicated plan ensuring your platform remains fast, secure, and up to date: automated backups, security patching, library upgrades, uptime monitoring, and priority technical support.'
      },
      {
        q: 'Is maintenance mandatory?',
        a: 'No. All completed projects are handed over fully functional. Maintenance is optional but strongly recommended to safeguard against downtime and security exploits.'
      },
      {
        q: 'What does technical support include?',
        a: 'Bug fixes, minor content revisions, technical troubleshooting, and priority assistance according to your selected plan.'
      },
      {
        q: 'How do I request support if an issue occurs?',
        a: 'You can submit a ticket directly through your client dashboard, email our dedicated support desk, or reach us via WhatsApp/phone for urgent matters.'
      },
      {
        q: 'Do you manage backups?',
        a: 'Yes. All active maintenance plans include regular automated backups with instant disaster-recovery rollback capabilities.'
      }
    ]
  },
  social: {
    label: 'Social Media & Paid Ads',
    questions: [
      {
        q: 'Do you produce content or only manage publishing?',
        a: 'Both options are available: pure management and community engagement, or end-to-end creative production (reels, short-form video, motion graphics, and copy).'
      },
      {
        q: 'Do you run paid advertising campaigns?',
        a: 'Yes. We configure, test, and optimize conversion campaigns across Meta Ads, TikTok Ads, and Google Ads with comprehensive ROAS tracking.'
      },
      {
        q: 'Which platforms do you focus on?',
        a: 'Instagram, TikTok, Facebook, LinkedIn, and YouTube, chosen specifically based on where your high-intent buyers spend their time.'
      },
      {
        q: 'Can I hire content creation separately?',
        a: 'Yes. We offer recurring monthly creative packages (e.g. 8–16 videos/posts) as well as standalone campaign asset production.'
      },
      {
        q: 'Do you provide performance reporting?',
        a: 'Yes. Monthly reports track impressions, click-through rates, qualified conversions, customer acquisition cost (CAC), and return on ad spend.'
      },
      {
        q: 'How soon can we expect results?',
        a: 'Organic reach scales steadily over weeks and months. Paid campaigns deliver actionable traffic immediately, which we refine iteratively for peak conversion.'
      }
    ]
  },
  cybersecurity: {
    label: 'Cybersecurity & Pentesting',
    questions: [
      {
        q: 'What is penetration testing?',
        a: 'Controlled security testing where ethical engineers simulate real-world attacks to identify and remediate vulnerabilities before bad actors can exploit them.'
      },
      {
        q: 'What is evaluated in a pentest?',
        a: 'Entry points, authentication and authorization flows, API exposures, cloud misconfigurations, and data handling vulnerabilities based on your agreed scope.'
      },
      {
        q: 'What does the security deliverable look like?',
        a: 'An executive summary for stakeholders plus an in-depth technical report with reproduction proofs, CVSS risk ratings, and prioritized remediation instructions.'
      },
      {
        q: 'Do you provide remediation support?',
        a: 'Yes. We provide actionable code and architecture recommendations and consult directly with your engineering team.'
      },
      {
        q: 'Do you offer a re-test after patches are applied?',
        a: 'Yes, included in our Pro and Premium audits: we re-assess identified vulnerabilities to certify that the risk has been eliminated.'
      },
      {
        q: 'How long does a pentest take?',
        a: 'Typically 1 to 4 weeks depending on the application surface, number of microservices, and testing depth.'
      },
      {
        q: 'Do we sign legal authorizations?',
        a: 'Yes. We define a strict Rules of Engagement (RoE) document and bilateral NDA to ensure all testing is fully authorized and controlled.'
      },
      {
        q: 'Do you provide ongoing security monitoring?',
        a: 'Yes, we provide recurring monthly vulnerability scanning and configuration reviews.'
      }
    ]
  },
  revisions: {
    label: 'Revisions & Warranties',
    questions: [
      {
        q: 'How many revisions are included?',
        a: 'Every package defines structured revision rounds (typically 1–2 in starter scopes, expanded in Pro and custom plans) to ensure you love the final result.'
      },
      {
        q: 'What counts as an out-of-scope change?',
        a: 'Features or structural rewrites that were not part of the initial specification (e.g., brand-new modules, additional user roles, or new third-party integrations).'
      },
      {
        q: 'Is there a warranty after project delivery?',
        a: 'Yes. Every project includes a post-launch warranty window where any technical bug or deviation from specification is corrected at zero additional charge.'
      },
      {
        q: 'What happens if something breaks after launch?',
        a: 'If caused by an underlying bug within the warranty period, it is resolved immediately. If due to external factor changes (hosting, third-party API deprecations), it is covered under active maintenance or hourly support.'
      },
      {
        q: 'How do I request scope expansions?',
        a: 'Submit a ticket or ping your project manager. We provide a transparent scope and turnaround time estimate before writing a single line of code.'
      }
    ]
  },
  billing: {
    label: 'Payments & Contracts',
    questions: [
      {
        q: 'How are payments handled?',
        a: 'Bank ACH/wire transfer, credit card via Stripe, or agreed digital invoicing. Fixed-scope projects are invoiced in milestone stages.'
      },
      {
        q: 'Is full payment required upfront?',
        a: 'No. Standard projects are split across defined milestones: kickoff deposit, functional deliverable review, and final launch.'
      },
      {
        q: 'Can I pay in stages?',
        a: 'Yes. Milestone-based billing aligns payment with tangible, reviewed project progress.'
      },
      {
        q: 'Is there a long-term commitment?',
        a: 'Fixed projects have no recurring commitments. Monthly retainer services can be canceled with standard 30-day notice.'
      },
      {
        q: 'What happens if I pause or cancel a recurring service?',
        a: 'You retain full ownership of all assets delivered to date, and recurring billing terminates per plan terms.'
      }
    ]
  },
  security: {
    label: 'Ownership & Data Privacy',
    questions: [
      {
        q: 'Do I own the final code and digital assets?',
        a: 'Yes 100%. Upon completion and final payment, complete intellectual property and source code ownership transfer to you.'
      },
      {
        q: 'Will I have full administrative access to everything?',
        a: 'Yes. We hand over credentials and admin rights to your domain, hosting, repository, analytics, and advertising accounts.'
      },
      {
        q: 'Do you use secure source control repositories?',
        a: 'Yes, all codebases are version-controlled with secure Git repositories and automated deployment pipelines.'
      },
      {
        q: 'How do you safeguard client data?',
        a: 'We implement industry best practices: role-based access controls, encrypted secret vaults, and strict confidentiality protocols.'
      },
      {
        q: 'Do your platforms comply with privacy regulations?',
        a: 'Yes. We architect for US privacy standards, CCPA, and GDPR requirements with proper cookie consent and data governance.'
      }
    ]
  }
};

// Services and Packages Data - Spanish
const SERVICES_DATA_ES = {
  web: {
    title: 'Páginas Web',
    packs: [
      {
        id: 'web-basic',
        name: 'Pack Web Básico',
        title: 'Web Profesional Básica',
        copy: 'Una web clara, rápida y profesional para presentar tu negocio y generar confianza.',
        includes: [
          'Hasta 5 secciones',
          'Diseño responsive',
          'Formulario de contacto',
          'SEO técnico básico',
          'Entrega rápida'
        ],
        timeline: '1–2 semanas',
        price: 'Desde 400 €'
      },
      {
        id: 'web-pro',
        name: 'Pack Web Pro',
        title: 'Web que Convierte',
        copy: 'Pensada para atraer, convencer y convertir visitantes en clientes.',
        includes: [
          '8–12 secciones',
          'Diseño a medida',
          'Blog o catálogo',
          'SEO base optimizado',
          'Medición y analítica'
        ],
        timeline: '3–4 semanas',
        price: 'Desde 600 €'
      },
      {
        id: 'web-premium',
        name: 'Pack Web Premium',
        title: 'Web Avanzada / E-commerce',
        copy: 'Una plataforma completa preparada para vender y escalar.',
        includes: [
          'E-commerce o web avanzada',
          'Pagos online',
          'Automatizaciones',
          'Optimización de velocidad',
          'Preparada para crecimiento',
          '100 primeros productos añadidos gratuitos'
        ],
        timeline: '4–8 semanas',
        price: 'Desde 800 €'
      }
    ]
  },
  apps: {
    title: 'Aplicaciones Móviles',
    packs: [
      {
        id: 'app-basic',
        name: 'Pack App Básica (MVP)',
        title: 'App MVP',
        copy: 'La forma más rápida de lanzar tu idea y validarla en el mercado.',
        includes: [
          '1 plataforma (Android o iOS)',
          'Funciones esenciales',
          'Diseño funcional',
          'Preparada para escalar'
        ],
        timeline: '4–6 semanas',
        price: 'Desde 1.700 €'
      },
      {
        id: 'app-pro',
        name: 'Pack App Pro',
        title: 'App Funcional',
        copy: 'Una app completa para usuarios reales.',
        includes: [
          'Login y perfiles',
          'Backend y base de datos',
          'Notificaciones',
          'Panel de administración'
        ],
        timeline: '8–12 semanas',
        price: 'Desde 3.000 €'
      },
      {
        id: 'app-premium',
        name: 'Pack App Premium',
        title: 'App Avanzada',
        copy: 'Una app robusta preparada para crecer y monetizar.',
        includes: [
          'Android + iOS',
          'Pagos, mapas o tiempo real',
          'Arquitectura escalable',
          'Soporte post-lanzamiento'
        ],
        timeline: '12–20 semanas',
        price: 'Desde 5.000 €'
      }
    ]
  },
  social: {
    title: 'Redes Sociales',
    packs: [
      {
        id: 'social-basic',
        name: 'Pack Redes Básico',
        title: 'Community Manager',
        copy: 'Presencia constante y profesional en redes.',
        includes: [
          'Gestión 1 red social',
          'Calendario de publicaciones',
          'Respuestas personalizadas',
          'Informe mensual'
        ],
        price: 'Desde 500 €/mes'
      },
      {
        id: 'social-plus',
        name: 'Pack Redes Plus',
        title: 'Crecimiento Acelerado',
        copy: 'Estrategia + contenido + anuncios.',
        includes: [
          'Gestión completa',
          'Creatividad, originalidad y contenido genuino',
          '1 Sesión de grabación al mes',
          'Pre y post producción',
          'Meta Ads / TikTok Ads',
          'Optimización continua'
        ],
        price: 'Desde 900 €/mes',
        note: 'Primer mes en solo 500 €. Plan de Branding se vende por separado.'
      }
    ]
  },
  branding: {
    title: 'Branding',
    packs: [
      {
        id: 'branding-basic',
        name: 'Pack Branding Básico',
        title: 'Branding Básico',
        copy: 'Identidad clara y profesional.',
        includes: [
          'Logotipo principal',
          'Paleta de colores',
          'Tipografías'
        ],
        price: 'Desde 200 €'
      },
      {
        id: 'branding-pro',
        name: 'Pack Branding Pro',
        title: 'Branding Premium',
        copy: 'Marca sólida preparada para crecer. Marca coherente y memorable.',
        includes: [
          'Identidad completa',
          'Manual avanzado',
          'Recursos y plantillas',
          'Papelería corporativa si requiere'
        ],
        price: 'A medida (según alcance)'
      }
    ]
  },
  cybersecurity: {
    title: 'Ciberseguridad / Pentesting',
    packs: [
      {
        id: 'ciber-basic',
        name: 'Pack Ciber Básico',
        title: 'Auditoría de Seguridad Express',
        copy: 'Identificamos riesgos y puntos débiles para mejorar la seguridad sin fricción.',
        includes: [
          'Revisión básica de configuración y superficie de exposición',
          'Checklist de buenas prácticas (web/app)',
          'Recomendaciones priorizadas',
          'Informe ejecutivo + técnico'
        ],
        timeline: '3–5 días',
        price: 'Desde 900 €'
      },
      {
        id: 'ciber-pro',
        name: 'Pack Ciber Pro',
        title: 'Pentesting Web / App',
        copy: 'Simulamos ataques en un entorno controlado para encontrar vulnerabilidades antes que un atacante.',
        includes: [
          'Definición de alcance y objetivos (Scope)',
          'Pruebas de intrusión sobre web o app',
          'Evidencias y clasificación por severidad',
          'Informe técnico + plan de remediación',
          'Reunión de entrega de resultados'
        ],
        timeline: '1–2 semanas',
        price: 'Desde 2.500 €'
      },
      {
        id: 'ciber-premium',
        name: 'Pack Ciber Premium',
        title: 'Pentesting Avanzado + Re-test',
        copy: 'Seguridad a nivel alto: pruebas profundas, priorización, y verificación tras corregir.',
        includes: [
          'Pentesting avanzado (según alcance pactado)',
          'Priorización por impacto (riesgo real)',
          'Plan de remediación detallado',
          'Re-test / verificación tras corrección',
          'Informe final actualizado'
        ],
        timeline: '2–4 semanas',
        price: 'Desde 5.000 €'
      },
      {
        id: 'ciber-monthly',
        name: 'Plan Ciber Mensual',
        title: 'Mantenimiento y Monitorización de Seguridad',
        copy: 'Seguimiento continuo para reducir riesgos con el tiempo.',
        includes: [
          'Revisión periódica (mensual)',
          'Recomendaciones continuas',
          'Mini-auditorías y control de cambios'
        ],
        price: 'Desde 300 €/mes'
      }
    ]
  }
};

// Services and Packages Data - US English
const SERVICES_DATA_EN = {
  web: {
    title: 'Websites',
    packs: [
      {
        id: 'web-basic',
        name: 'Starter Web Pack',
        title: 'Professional Starter Website',
        copy: 'A clean, high-performance website designed to present your business and build trust.',
        includes: [
          'Up to 5 sections',
          'Responsive mobile design',
          'Contact & lead capture form',
          'Core technical SEO foundation',
          'Fast turnaround'
        ],
        timeline: '1–2 weeks',
        price: 'From $400'
      },
      {
        id: 'web-pro',
        name: 'Pro Conversion Web Pack',
        title: 'High-Converting Website',
        copy: 'Engineered to attract visitors, communicate value, and convert them into paying clients.',
        includes: [
          '8–12 custom sections',
          'Bespoke UI/UX design',
          'Blog or product showcase',
          'Optimized search & social tags',
          'Analytics & conversion tracking'
        ],
        timeline: '3–4 weeks',
        price: 'From $600'
      },
      {
        id: 'web-premium',
        name: 'Premium E-Commerce Pack',
        title: 'Advanced Platform / E-Commerce',
        copy: 'A complete custom platform built to sell, automate, and scale with high reliability.',
        includes: [
          'Full e-commerce or web platform',
          'Online payment processing (Stripe/Apple Pay)',
          'Automated customer workflows',
          'Speed optimization & CDN',
          'Built for continuous growth',
          'First 100 products uploaded free'
        ],
        timeline: '4–8 weeks',
        price: 'From $800'
      }
    ]
  },
  apps: {
    title: 'Mobile Applications',
    packs: [
      {
        id: 'app-basic',
        name: 'App MVP Pack',
        title: 'MVP Application',
        copy: 'The fastest path to launch your product idea and validate customer demand.',
        includes: [
          '1 platform (iOS or Android)',
          'Core essential features',
          'Intuitive user experience',
          'Scalable codebase architecture'
        ],
        timeline: '4–6 weeks',
        price: 'From $1,700'
      },
      {
        id: 'app-pro',
        name: 'Pro App Pack',
        title: 'Full-Featured Application',
        copy: 'A complete, polished mobile application built for active daily users.',
        includes: [
          'User accounts & authentication',
          'Cloud backend & database',
          'Push notifications',
          'Administrative web portal'
        ],
        timeline: '8–12 weeks',
        price: 'From $3,000'
      },
      {
        id: 'app-premium',
        name: 'Enterprise App Pack',
        title: 'Advanced Custom Platform',
        copy: 'A resilient, scalable app built to grow user volume and monetize at scale.',
        includes: [
          'iOS + Android cross-platform',
          'In-app purchases, maps, or real-time sync',
          'Enterprise cloud architecture',
          'Post-launch priority support'
        ],
        timeline: '12–20 weeks',
        price: 'From $5,000'
      }
    ]
  },
  social: {
    title: 'Social Media & Growth',
    packs: [
      {
        id: 'social-basic',
        name: 'Starter Social Pack',
        title: 'Social Media Management',
        copy: 'Consistent, polished brand presence across your primary social channels.',
        includes: [
          '1 social channel management',
          'Monthly content calendar',
          'Community engagement & responses',
          'Monthly performance report'
        ],
        price: 'From $500/mo'
      },
      {
        id: 'social-plus',
        name: 'Accelerated Growth Pack',
        title: 'Content + Paid Ads Engine',
        copy: 'Full-funnel organic strategy combined with high-ROAS paid advertising.',
        includes: [
          'Multi-channel management',
          'Original creative assets & short-form video',
          'Monthly recording & production sprint',
          'Pre & post-production editing',
          'Meta & TikTok Ads campaign management',
          'Continuous conversion optimization'
        ],
        price: 'From $900/mo',
        note: 'First month introductory rate: $500. Brand identity package quoted separately.'
      }
    ]
  },
  branding: {
    title: 'Brand Identity',
    packs: [
      {
        id: 'branding-basic',
        name: 'Starter Branding Pack',
        title: 'Essential Brand Identity',
        copy: 'Clear, modern visual identity to launch your business with confidence.',
        includes: [
          'Primary & secondary logo variations',
          'Defined color palette & tokens',
          'Typography system'
        ],
        price: 'From $200'
      },
      {
        id: 'branding-pro',
        name: 'Premium Branding Pack',
        title: 'Complete Brand System',
        copy: 'A cohesive, memorable brand identity built to command market authority.',
        includes: [
          'Complete brand identity system',
          'Comprehensive brand guidelines manual',
          'Digital templates & social assets',
          'Corporate stationery & print assets'
        ],
        price: 'Custom quote (by scope)'
      }
    ]
  },
  cybersecurity: {
    title: 'Cybersecurity & Pentesting',
    packs: [
      {
        id: 'ciber-basic',
        name: 'Security Audit Pack',
        title: 'Express Security Audit',
        copy: 'Pinpoint critical risks and attack surface vulnerabilities to harden your systems quickly.',
        includes: [
          'Attack surface and configuration review',
          'Web and app security best-practices audit',
          'Prioritized vulnerability checklist',
          'Executive and technical summary report'
        ],
        timeline: '3–5 days',
        price: 'From $900'
      },
      {
        id: 'ciber-pro',
        name: 'Pro Pentest Pack',
        title: 'Web & App Penetration Testing',
        copy: 'Ethical intrusion testing to discover vulnerabilities before malicious actors do.',
        includes: [
          'Defined Rules of Engagement & scope',
          'Thorough manual and automated testing',
          'Evidence documentation & severity scoring',
          'Remediation guide & technical walkthrough',
          'Executive presentation briefing'
        ],
        timeline: '1–2 weeks',
        price: 'From $2,500'
      },
      {
        id: 'ciber-premium',
        name: 'Advanced Pentest + Re-Test',
        title: 'Comprehensive Audit & Verification',
        copy: 'Deep security testing, business-impact prioritization, and post-patch re-testing.',
        includes: [
          'Advanced multi-tier penetration testing',
          'Real-world business impact analysis',
          'Step-by-step remediation roadmap',
          'Full re-test to verify patched vulnerabilities',
          'Updated final certification report'
        ],
        timeline: '2–4 weeks',
        price: 'From $5,000'
      },
      {
        id: 'ciber-monthly',
        name: 'Monthly Security Guard',
        title: 'Continuous Vulnerability Monitoring',
        copy: 'Ongoing surveillance and recurring scans to minimize security risk over time.',
        includes: [
          'Recurring monthly vulnerability scanning',
          'Continuous security advisories',
          'Change-control security reviews'
        ],
        price: 'From $300/mo'
      }
    ]
  }
};

// Export locale-aware objects
export const FAQ_CATEGORIES = isEn ? FAQ_CATEGORIES_EN : FAQ_CATEGORIES_ES;
export const SERVICES_DATA = isEn ? SERVICES_DATA_EN : SERVICES_DATA_ES;

// Locale-aware contact credentials (see src/config/env.ts)
export { WHATSAPP_NUMBER, CONTACT_EMAIL } from '@/config/env';

export const CALENDLY_LINK = 'https://calendly.com/solutionsnova';
