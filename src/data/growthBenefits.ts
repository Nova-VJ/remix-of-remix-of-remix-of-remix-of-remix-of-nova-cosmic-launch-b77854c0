export type BenefitCategory =
  | 'ads'
  | 'tools'
  | 'cloud'
  | 'ecommerce'
  | 'nonprofit';

export type BenefitCountry = 'US' | 'ES' | 'ALL';

export interface GrowthBenefit {
  id: string;
  platform: string;
  category: BenefitCategory;
  country: BenefitCountry;
  title: {
    es: string;
    en: string;
  };
  valueFormatted: {
    es: string;
    en: string;
  };
  spendRequirement: {
    es: string;
    en: string;
  };
  description: {
    es: string;
    en: string;
  };
  eligibility: {
    es: string[];
    en: string[];
  };
  officialUrl: string;
  verifiedDate: string;
  status: 'verified' | 'review';
  novaRole: {
    es: string;
    en: string;
  };
}

export const GROWTH_BENEFITS: GrowthBenefit[] = [
  // ─── 1. GOOGLE ADS ───────────────────────────────────────────────────────────
  {
    id: 'google-ads',
    platform: 'Google Ads',
    category: 'ads',
    country: 'ALL',
    title: {
      es: 'Crédito publicitario de bienvenida (Igualación 100%)',
      en: 'Promotional Ad Credit (100% Spend Match)',
    },
    valueFormatted: {
      es: 'Hasta 400 € adicionales',
      en: 'Up to $500 matching credit',
    },
    spendRequirement: {
      es: 'Invertir 400 € en los primeros 60 días',
      en: 'Spend $500 within the first 60 days',
    },
    description: {
      es: 'Google ofrece a nuevas cuentas publicitarias elegibles un crédito promocional que iguala la inversión realizada hasta el límite establecido para futuras campañas de búsqueda y display.',
      en: 'Google offers eligible new advertising accounts a promotional credit matching the amount spent up to $500 for future search and display campaigns.',
    },
    eligibility: {
      es: [
        'Cuentas nuevas de Google Ads sin promociones previas',
        'Método de pago válido configurado',
        'Completar el gasto mínimo en 60 días tras aplicar el código',
        'Sujeto a verificación de anunciante de Google',
      ],
      en: [
        'New Google Ads accounts with no prior promotions applied',
        'Valid billing method on file',
        'Achieve minimum spend requirement within 60 days of code redemption',
        'Subject to Google Advertiser Verification policies',
      ],
    },
    officialUrl: 'https://support.google.com/google-ads/answer/6388096',
    verifiedDate: '2026-11-08',
    status: 'verified',
    novaRole: {
      es: 'Configuramos tu cuenta, estructuramos campañas de conversión y optimizamos tus palabras clave para aprovechar al máximo el crédito.',
      en: 'We structure your account, configure conversion tracking, and optimize high-intent keywords to maximize your matching ad spend.',
    },
  },

  // ─── 2. TIKTOK ADS ───────────────────────────────────────────────────────────
  {
    id: 'tiktok-ads',
    platform: 'TikTok Ads',
    category: 'ads',
    country: 'US',
    title: {
      es: 'Crédito de aceleración de ventas en vídeo (Match 1:1)',
      en: 'Sales Activation Ad Credits (1:1 Match)',
    },
    valueFormatted: {
      es: 'Hasta 3.000 $ en créditos',
      en: 'Up to $3,000 matching credit',
    },
    spendRequirement: {
      es: 'Inversión mínima de 500 $ en los primeros 30 días',
      en: 'Minimum spend of $500 within the first 30 days',
    },
    description: {
      es: 'Programa oficial de activación comercial para nuevas marcas en EE. UU. que invierten en anuncios de vídeo en TikTok. Iguala dólar por dólar el gasto elegible.',
      en: 'Official sales activation program for new US advertisers on TikTok. Matches eligible ad spend dollar-for-dollar up to the tier limit.',
    },
    eligibility: {
      es: [
        'Empresas registradas en Estados Unidos',
        'Nuevas cuentas de TikTok Ads for Business',
        'Gasto completado en la ventana de 30 días',
        'Reclamar la oferta oficial antes de iniciar campañas',
      ],
      en: [
        'Businesses registered and operating in the United States',
        'New TikTok Ads for Business advertiser accounts',
        'Qualifying spend completed within the 30-day window',
        'Must claim promotional offer prior to campaign launch',
      ],
    },
    officialUrl: 'https://ads.tiktok.com/business/en-US/sales-activation-program-new',
    verifiedDate: '2026-11-08',
    status: 'verified',
    novaRole: {
      es: 'Producimos creatividades de vídeo vertical de alto impacto y gestionamos la segmentación para maximizar el ROAS.',
      en: 'We produce engaging vertical short-form video creatives and handle micro-targeting to drive measurable return on ad spend.',
    },
  },

  // ─── 3. MICROSOFT ADVERTISING ────────────────────────────────────────────────
  {
    id: 'microsoft-ads',
    platform: 'Microsoft Advertising',
    category: 'ads',
    country: 'ALL',
    title: {
      es: 'Incentivo para anunciantes en Bing & Copilot',
      en: 'Bing & Copilot Promotional Ad Incentive',
    },
    valueFormatted: {
      es: '500 $ de crédito publicitario',
      en: '$500 promotional credit',
    },
    spendRequirement: {
      es: 'Invertir 250 $ en anuncios tras registrarse',
      en: 'Spend $250 after registration',
    },
    description: {
      es: 'Crédito promocional para captar clientes en la red de búsqueda de Bing, Yahoo y ecosistema de Microsoft Copilot con menor competencia y menor coste por clic.',
      en: 'Promotional ad credit to reach high-purchasing-power searchers on Bing, Yahoo, and the Microsoft Copilot ecosystem with lower CPC.',
    },
    eligibility: {
      es: [
        'Nuevas cuentas de Microsoft Advertising',
        'Gastar 250 $ en los primeros 30 días',
        'Un cupón por cuenta y anunciante',
      ],
      en: [
        'New Microsoft Advertising customer accounts',
        'Spend $250 within 30 days of redemption',
        'One promotional code per client account',
      ],
    },
    officialUrl: 'https://about.ads.microsoft.com/',
    verifiedDate: '2026-11-08',
    status: 'verified',
    novaRole: {
      es: 'Sincronizamos tus campañas de Google Ads directamente a Microsoft Advertising para duplicar tu alcance con mínima fricción.',
      en: 'We mirror and calibrate your top Google search campaigns into Microsoft Ads to double your desktop visibility seamlessly.',
    },
  },

  // ─── 4. SNAPCHAT ADS ─────────────────────────────────────────────────────────
  {
    id: 'snapchat-ads',
    platform: 'Snapchat Ads',
    category: 'ads',
    country: 'US',
    title: {
      es: 'Bono de bienvenida para anuncios móviles',
      en: 'Starter Bonus for Mobile Video Ads',
    },
    valueFormatted: {
      es: '75 $ o 375 $ en crédito adicional',
      en: '$75 or $375 ad credit',
    },
    spendRequirement: {
      es: 'Gastar 50 $ (para obtener 75 $) o 350 $ (para 375 $)',
      en: 'Spend $50 to receive $75, or spend $350 to receive $375',
    },
    description: {
      es: 'Promoción escalonada para nuevas marcas que quieren conectar con audiencias jóvenes (Gen Z / Millennials) mediante anuncios verticales interactivos.',
      en: 'Tiered incentive for new businesses targeting Gen Z and Millennial demographics with interactive vertical mobile story ads.',
    },
    eligibility: {
      es: [
        'Nuevos anunciantes en Snapchat Ads Manager',
        'Consumir el crédito en los 30 días posteriores a la adjudicación',
      ],
      en: [
        'First-time advertisers in Snapchat Ads Manager',
        'Promotional credit must be utilized within 30 days of issuance',
      ],
    },
    officialUrl: 'https://forbusiness.snapchat.com/get-offer',
    verifiedDate: '2026-11-08',
    status: 'verified',
    novaRole: {
      es: 'Diseñamos filtros, lenses o anuncios Story que conectan con audiencias jóvenes con un coste de adquisición muy competitivo.',
      en: 'We craft authentic vertical story creatives that drive app installs, store visits, and direct e-commerce checkouts.',
    },
  },

  // ─── 5. APPLE ADS (MAPS) ─────────────────────────────────────────────────────
  {
    id: 'apple-maps-ads',
    platform: 'Apple Business Connect',
    category: 'ads',
    country: 'US',
    title: {
      es: 'Crédito de bienvenida para negocios locales en Apple Maps',
      en: 'Apple Maps Local Ad Welcome Credit',
    },
    valueFormatted: {
      es: '150 $ de crédito inicial',
      en: '$150 introductory credit',
    },
    spendRequirement: {
      es: 'Para nuevos anunciantes elegibles en Apple Maps',
      en: 'For eligible new business locations in Apple Maps',
    },
    description: {
      es: 'Apple ofrece a negocios físicos de EE. UU. un crédito promocional para destacar su ubicación cuando usuarios de iPhone buscan servicios cercanos en Apple Maps.',
      en: 'Apple provides qualifying physical businesses in the US with an introductory ad credit to showcase their location when iPhone users search in Maps.',
    },
    eligibility: {
      es: [
        'Negocios con ubicación física verificada en EE. UU. o Canadá',
        'Ficha activa en Apple Business Connect',
        'Primer registro publicitario en Apple Maps',
      ],
      en: [
        'Verified physical business location in the US or Canada',
        'Active claimed profile in Apple Business Connect',
        'First-time participation in Apple Maps local advertising',
      ],
    },
    officialUrl: 'https://businessconnect.apple.com/',
    verifiedDate: '2026-11-08',
    status: 'verified',
    novaRole: {
      es: 'Verificamos tu ficha comercial en Apple Business Connect, optimizamos fotos y categorías, y activamos la visibilidad local.',
      en: 'We claim and optimize your Apple Business Place Card, add branded action links, and activate local promotion.',
    },
  },

  // ─── 6. APPLE SEARCH ADS ─────────────────────────────────────────────────────
  {
    id: 'apple-search-ads',
    platform: 'Apple Search Ads',
    category: 'ads',
    country: 'ALL',
    title: {
      es: 'Bono inicial para lanzamiento de App en App Store',
      en: 'App Store Discovery Introductory Credit',
    },
    valueFormatted: {
      es: '100 $ en publicidad',
      en: '$100 promo credit',
    },
    spendRequirement: {
      es: 'Sin inversión mínima requerida para reclamar el bono',
      en: 'No minimum spend required to claim initial credit',
    },
    description: {
      es: 'Crédito otorgado por Apple a nuevos desarrolladores para promocionar su app en los primeros resultados de búsqueda de la App Store.',
      en: 'Promotional credit offered by Apple to new developers to promote their mobile apps at the top of App Store search results.',
    },
    eligibility: {
      es: [
        'Tener una app publicada en la App Store de Apple',
        'Primera cuenta en Apple Search Ads Basic o Advanced',
      ],
      en: [
        'Live published application on the Apple App Store',
        'First-time account in Apple Search Ads',
      ],
    },
    officialUrl: 'https://searchads.apple.com/',
    verifiedDate: '2026-11-08',
    status: 'verified',
    novaRole: {
      es: 'Cuando desarrollamos tu aplicación móvil, configuramos Apple Search Ads para conseguir tus primeras descargas cualificadas.',
      en: 'When we build your mobile application, we configure Apple Search Ads to secure your first organic-quality user downloads.',
    },
  },

  // ─── 7. GOOGLE AD GRANTS ─────────────────────────────────────────────────────
  {
    id: 'google-ad-grants',
    platform: 'Google for Nonprofits',
    category: 'nonprofit',
    country: 'ALL',
    title: {
      es: 'Publicidad gratuita para ONG y fundaciones',
      en: 'Monthly Search Advertising Grant for Nonprofits',
    },
    valueFormatted: {
      es: 'Hasta 10.000 $/mes en publicidad',
      en: 'Up to $10,000/mo in-kind ad budget',
    },
    spendRequirement: {
      es: '0 € (Subvención en especie de Google)',
      en: '$0 (100% in-kind grant provided by Google)',
    },
    description: {
      es: 'Google concede hasta 10.000 USD mensuales en anuncios de búsqueda a organizaciones sin ánimo de lucro elegibles para captar socios, voluntarios y donaciones.',
      en: 'Google awards up to $10,000 per month of in-kind search advertising to eligible 501(c)(3) and nonprofit organizations to raise awareness and donations.',
    },
    eligibility: {
      es: [
        'Estar registrada como organización benéfica / sin ánimo de lucro (ej. 501c3 en EE.UU. o entidad registrada en España)',
        'No ser entidad gubernamental, hospital ni institución académica',
        'Tener una web funcional con contenido de valor y HTTPS',
        'Mantener una tasa de clics (CTR) mínima del 5%',
      ],
      en: [
        'Recognized 501(c)(3) tax-exempt status in the US or registered charity in Spain',
        'Government entities, hospitals, and schools are not eligible',
        'Functional website with SSL and substantial mission content',
        'Must maintain account quality compliance including a 5% monthly CTR',
      ],
    },
    officialUrl: 'https://www.google.com/grants/',
    verifiedDate: '2026-11-08',
    status: 'verified',
    novaRole: {
      es: 'Tramitamos la validación con TechSoup / Google, diseñamos la web bajo los estándares requeridos y gestionamos las campañas para mantener la subvención activa.',
      en: 'We guide you through TechSoup validation, build your compliance-ready website, and manage monthly campaigns to retain active grant status.',
    },
  },

  // ─── 8. AMAZON NEW SELLER INCENTIVES ─────────────────────────────────────────
  {
    id: 'amazon-seller',
    platform: 'Amazon Ads',
    category: 'ecommerce',
    country: 'ALL',
    title: {
      es: 'Incentivos de lanzamiento para nuevas tiendas en Amazon',
      en: 'New Seller Promotional Ad Credits',
    },
    valueFormatted: {
      es: 'Hasta 1.000 $ en créditos publicitarios',
      en: 'Up to $1,000 promotional ad credits',
    },
    spendRequirement: {
      es: 'Lanzar cuenta profesional de vendedor y registrar marca',
      en: 'Register professional seller account and enroll in Brand Registry',
    },
    description: {
      es: 'Programa oficial de Amazon para nuevos vendedores profesionales con marca registrada: bonos en Sponsored Products, descuentos en logística FBA y herramientas promocionales.',
      en: 'Official Amazon package for new professional sellers enrolled in Brand Registry: includes sponsored ad credits, shipping discounts, and reviews incentives.',
    },
    eligibility: {
      es: [
        'Nuevos vendedores en Amazon Professional Selling Plan',
        'Registro de marca en Amazon Brand Registry en los primeros meses',
      ],
      en: [
        'New professional selling account on Amazon marketplace',
        'Enroll in Amazon Brand Registry within specified program timeframe',
      ],
    },
    officialUrl: 'https://sell.amazon.com/grow/new-seller-incentives',
    verifiedDate: '2026-11-08',
    status: 'verified',
    novaRole: {
      es: 'Diseñamos tu branding, preparamos las fichas A+ Content y configuramos tus campañas de Sponsored Products para posicionar tus productos.',
      en: 'We craft your brand identity, design Amazon A+ storefront content, and launch optimized Sponsored Product campaigns.',
    },
  },

  // ─── 9. AWS ACTIVATE ─────────────────────────────────────────────────────────
  {
    id: 'aws-activate',
    platform: 'Amazon Web Services',
    category: 'cloud',
    country: 'ALL',
    title: {
      es: 'Créditos Cloud para Startups y Empresas de Software',
      en: 'Cloud Infrastructure Credits for Startups',
    },
    valueFormatted: {
      es: 'De 1.000 $ a 100.000 $ en créditos AWS',
      en: '$1,000 to $100,000 in cloud credits',
    },
    spendRequirement: {
      es: 'Startups tecnológicas elegibles (autofinanciadas o con aceleradora)',
      en: 'Eligible tech startups (bootstrapped founders or accelerated ventures)',
    },
    description: {
      es: 'Amazon ofrece infraestructura en la nube sin coste para startups que construyen aplicaciones, SaaS o inteligencia artificial, además de soporte técnico de arquitectura.',
      en: 'AWS provides complimentary cloud credits, architectural reviews, and technical support for tech founders building scalable software platforms.',
    },
    eligibility: {
      es: [
        'Empresas que desarrollan productos de software propietarios',
        'Web de la empresa activa y dominio corporativo',
        'No haber superado los límites de créditos previos de AWS',
      ],
      en: [
        'Companies building proprietary digital software or SaaS products',
        'Active company website with custom business domain',
        'Not exceeded lifetime AWS Activate credit maximums',
      ],
    },
    officialUrl: 'https://aws.amazon.com/activate/',
    verifiedDate: '2026-11-08',
    status: 'verified',
    novaRole: {
      es: 'Desarrollamos tu SaaS o app con arquitectura cloud moderna optimizada para calificar y reducir al mínimo tu factura de servidores.',
      en: 'We develop your SaaS or web application with high-efficiency cloud architecture designed to qualify and keep server expenses at near zero.',
    },
  },

  // ─── 10. GOOGLE FOR STARTUPS CLOUD PROGRAM ───────────────────────────────────
  {
    id: 'google-startups',
    platform: 'Google Cloud',
    category: 'cloud',
    country: 'ALL',
    title: {
      es: 'Programa Google Cloud & AI para Startups',
      en: 'Google Cloud & AI Startup Program',
    },
    valueFormatted: {
      es: 'Hasta 200.000 $ en créditos Cloud e IA',
      en: 'Up to $200,000 in Cloud & AI credits',
    },
    spendRequirement: {
      es: 'Startups innovadoras en fase pre-seed a serie A',
      en: 'Eligible tech startups from pre-seed through Series A',
    },
    description: {
      es: 'Cubre el 100% de los costes de Google Cloud durante el primer año (hasta el límite aprobado) para procesamiento, bases de datos y modelos Gemini / Vertex AI.',
      en: 'Covers 100% of Google Cloud infrastructure costs in year one up to the approved tier, including Gemini AI and Vertex API capacity.',
    },
    eligibility: {
      es: [
        'Menos de 10 años de antigüedad',
        'Desarrollo de tecnología escalable (excluye agencias y consultoras)',
        'Solicitud sujeta a aprobación individual de Google',
      ],
      en: [
        'Founded within the past 10 years',
        'Building software/technology (agencies and consultancies are excluded)',
        'Subject to individual evaluation by Google Cloud team',
      ],
    },
    officialUrl: 'https://cloud.google.com/startup',
    verifiedDate: '2026-11-08',
    status: 'verified',
    novaRole: {
      es: 'Integramos modelos de IA y bases de datos Supabase / Cloud en tu aplicación para maximizar la eficiencia y validar tu arquitectura.',
      en: 'We integrate production AI models and resilient cloud backends into your product to maximize architectural eligibility.',
    },
  },

  // ─── 11. GOOGLE BUSINESS PROFILE ─────────────────────────────────────────────
  {
    id: 'google-business-profile',
    platform: 'Google Business Profile',
    category: 'tools',
    country: 'ALL',
    title: {
      es: 'Ficha oficial verificada en Google Maps y Búsqueda',
      en: 'Verified Profile on Google Search & Maps',
    },
    valueFormatted: {
      es: '100% Gratuito de por vida',
      en: '100% Free permanent visibility',
    },
    spendRequirement: {
      es: '0 € (Herramienta pública gratuita de Google)',
      en: '$0 (Official free business tool provided by Google)',
    },
    description: {
      es: 'Aparece en el paquete local de Google y en Google Maps cuando los clientes buscan tus productos o servicios en tu ciudad.',
      en: 'Appear on Google local pack results and Maps when local buyers search for your products and services in your area.',
    },
    eligibility: {
      es: ['Negocios que atienden a clientes en persona o en un área de servicio definida'],
      en: ['Businesses serving customers in person or within a defined local service territory'],
    },
    officialUrl: 'https://www.google.com/business/',
    verifiedDate: '2026-11-08',
    status: 'verified',
    novaRole: {
      es: 'Verificamos la ficha, redactamos descripciones optimizadas para SEO local, cargamos fotografías profesionales y configuramos botones de cita / web.',
      en: 'We complete official business verification, write local-SEO descriptions, upload high-converting media, and configure booking links.',
    },
  },

  // ─── 12. GOOGLE MERCHANT CENTER (FREE LISTINGS) ──────────────────────────────
  {
    id: 'google-merchant-free',
    platform: 'Google Merchant Center',
    category: 'ecommerce',
    country: 'ALL',
    title: {
      es: 'Fichas gratuitas de productos en la pestaña Google Shopping',
      en: 'Free Product Listings on Google Shopping Tab',
    },
    valueFormatted: {
      es: 'Tráfico orgánico gratuito para tiendas',
      en: 'Free organic e-commerce traffic',
    },
    spendRequirement: {
      es: '0 € (Función nativa gratuita de Google)',
      en: '$0 (Built-in free feature by Google)',
    },
    description: {
      es: 'Tus productos aparecen de forma gratuita en la pestaña "Shopping" de Google sin pagar por clic, compitiendo directamente con grandes tiendas.',
      en: 'Showcase your physical products for free on the Google Shopping tab with zero pay-per-click charges, expanding your retail reach.',
    },
    eligibility: {
      es: [
        'Tienda online con carrito de compra y pasarela de pago segura',
        'Cumplir con las políticas de devolución y términos de Google',
        'Feed estructurado de productos (XML / API)',
      ],
      en: [
        'Functional online store with secure checkout and clear refund policy',
        'Compliance with Google Merchant Shopping guidelines',
        'Structured product catalog data feed (XML / API)',
      ],
    },
    officialUrl: 'https://merchants.google.com/',
    verifiedDate: '2026-11-08',
    status: 'verified',
    novaRole: {
      es: 'Desarrollamos tu tienda online con sincronización automática de catálogo para que todos tus productos aparezcan gratis en Google.',
      en: 'We engineer your e-commerce store with automated feed synchronization so every product populates Google Shopping automatically.',
    },
  },

  // ─── 13. MICROSOFT CLARITY ───────────────────────────────────────────────────
  {
    id: 'microsoft-clarity',
    platform: 'Microsoft Clarity',
    category: 'tools',
    country: 'ALL',
    title: {
      es: 'Mapas de calor y grabaciones de pantalla sin límite',
      en: 'Unlimited Session Recordings & Heatmaps',
    },
    valueFormatted: {
      es: '100% Gratuito y sin límites de tráfico',
      en: '100% Free with zero traffic limits',
    },
    spendRequirement: {
      es: '0 € (Herramienta gratuita de Microsoft)',
      en: '$0 (Free enterprise-grade tool by Microsoft)',
    },
    description: {
      es: 'Observa exactamente qué hacen los visitantes en tu web: dónde hacen clic, hasta dónde leen y dónde se frustran para optimizar las ventas.',
      en: 'See exactly how visitors interact with your website: heatmap clicks, scroll depth, and session replays with zero data caps.',
    },
    eligibility: {
      es: ['Cualquier página web o aplicación web con consentimiento de cookies activo'],
      en: ['Any website or web application compliant with privacy notice requirements'],
    },
    officialUrl: 'https://clarity.microsoft.com/',
    verifiedDate: '2026-11-08',
    status: 'verified',
    novaRole: {
      es: 'Lo integramos en todas las webs que desarrollamos con banner de cookies RGPD/CCPA y analizamos los datos para mejorar la tasa de conversión.',
      en: 'We integrate Clarity into every build with compliant cookie consents and analyze user recordings to continually increase conversions.',
    },
  },

  // ─── 14. HUBSPOT CRM FREE ────────────────────────────────────────────────────
  {
    id: 'hubspot-crm-free',
    platform: 'HubSpot',
    category: 'tools',
    country: 'ALL',
    title: {
      es: 'CRM completo y embudos de ventas para pymes',
      en: 'Free Client Management & Sales Pipeline CRM',
    },
    valueFormatted: {
      es: 'Plan gratuito sin límite de tiempo',
      en: 'Free plan with no expiration',
    },
    spendRequirement: {
      es: '0 € (Plan Starter Free oficial)',
      en: '$0 (Official free foundation tier)',
    },
    description: {
      es: 'Gestiona contactos, propuestas, etapas de venta y comunicaciones en un solo lugar sin pagar suscripciones mensuales costosas.',
      en: 'Manage leads, active deals, follow-up tasks, and customer interactions in a unified dashboard without recurring subscription fees.',
    },
    eligibility: {
      es: ['Disponible para cualquier empresa o profesional'],
      en: ['Available to any business or independent professional'],
    },
    officialUrl: 'https://www.hubspot.com/products/crm',
    verifiedDate: '2026-11-08',
    status: 'verified',
    novaRole: {
      es: 'Conectamos los formularios de tu nueva web directamente a tu CRM para que ningún cliente potencial se pierda.',
      en: 'We connect your website forms and automated lead funnels directly into your CRM so no prospect slips through the cracks.',
    },
  },
];
