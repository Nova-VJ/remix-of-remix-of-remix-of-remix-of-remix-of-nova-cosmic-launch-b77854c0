// Demos de NOVA: reserva online, avisos (WhatsApp y tiendas de apps), filtro de inmuebles y asistente de chat simulado.
// Sin servidor y sin IA: el chat reconoce palabras clave y lleva una reserva paso a paso. Nada sale del navegador.
// Cada página trae su configuración en <script type="application/json" id="demo-config"> (la escribe demos/generar.mjs).
(function () {
  'use strict';

  var esIngles = (function () {
    if (typeof window === 'undefined') return false;
    var params = new URLSearchParams(window.location.search || '');
    var lang = params.get('lang') || params.get('locale');
    if (lang === 'en') return true;
    if (lang === 'es') return false;
    var host = (window.location.hostname || '').toLowerCase();
    if (host.indexOf('novasolutionsmkt.com') !== -1 || host.indexOf('77851234') !== -1) return true;
    if (document.referrer && (document.referrer.indexOf('novasolutionsmkt.com') !== -1 || document.referrer.indexOf('77851234') !== -1)) return true;
    return false;
  })();

  if (esIngles && typeof document !== 'undefined') {
    document.documentElement.lang = 'en';
  }

  var DEMO_CONFIGS_EN = {
  "abogados": {
    "motivos": [
      "Family Law & Divorce",
      "Employment Dispute & Severance",
      "Estate Planning & Probate",
      "Property, Lease & Civil Law",
      "Financial Recovery & Damages"
    ],
    "chat": {
      "saludo": "Hello! I am the Lindero Law Firm assistant. I can help you schedule an initial consultation or determine if our team handles your legal matter.",
      "preguntaMotivo": "What legal matter would you like to discuss?",
      "sugerencias": [
        "Initial legal consultation",
        "Divorce & family law",
        "Severance & employment claim",
        "Probate & inheritance",
        "Fee structure"
      ],
      "precio": "We provide itemized written fee estimates before accepting any retainer, ensuring 100% transparency."
    }
  },
  "administracion-fincas": {
    "motivos": [
      "Switch Property Manager for our Building",
      "HOA Management Proposal for New Development",
      "Residential Rental Property Management",
      "Current Resident Inquiry"
    ],
    "chat": {
      "saludo": "Hello! I am the Portalbo Property Management assistant. I can help with building issues, dues, annual meetings, or switching administrators.",
      "preguntaMotivo": "What would you like to inquire about?",
      "sugerencias": [
        "Switch building administrator",
        "Report a building repair",
        "View HOA dues",
        "Annual meeting documents",
        "Request a quote"
      ],
      "precio": "We provide transparent, flat-rate monthly HOA management packages with no hidden markups."
    }
  },
  "asesoria": {
    "motivos": [
      "Register as Self-Employed",
      "Annual Tax Return",
      "Business Tax Strategy",
      "Payroll & Contracts",
      "Company Incorporation"
    ],
    "chat": {
      "saludo": "Hello, I am the Balanzal Advisory assistant. I can help with business registration, taxes, payroll, or scheduling a meeting.",
      "preguntaMotivo": "What would you like to discuss in your appointment?",
      "sugerencias": [
        "Starting a business",
        "Annual tax returns",
        "Quarterly tax deadlines",
        "Sending invoices",
        "Book a consultation"
      ],
      "precio": "We work with transparent monthly retainers tailored to your transaction volume. Written quotes provided upfront."
    }
  },
  "clinica-dental": {
    "motivos": [
      "General Checkup & Cleaning",
      "Clear Aligners Consultation",
      "Dental Implants Evaluation",
      "Acute Pain / Dental Emergency",
      "Teeth Whitening",
      "Pediatric Dentistry"
    ],
    "chat": {
      "saludo": "Hello! I am the Arcoluz Dental Clinic assistant. I can help you with appointments, clear aligners, implants, or emergency hours.",
      "preguntaMotivo": "What treatment or consultation do you need?",
      "sugerencias": [
        "Book checkup & cleaning",
        "Clear aligners info",
        "Dental implant consultation",
        "Dental emergency care",
        "Clinic hours"
      ],
      "precio": "We provide detailed written treatment plans before any procedure, with zero surprise fees."
    }
  },
  "clinica-medica": {
    "motivos": [
      "Primary Care Medical Visit",
      "Physical Therapy Session",
      "Nutrition Assessment",
      "Psychology Consultation",
      "Podiatry & Gait Analysis"
    ],
    "chat": {
      "saludo": "Hello! I am the Alcorza Medical Center assistant. I can assist with specialist bookings, session packages, or scheduling.",
      "preguntaMotivo": "Which specialty would you like to book?",
      "sugerencias": [
        "Book physical therapy",
        "Primary care visit",
        "Nutrition consultation",
        "Session bundles",
        "Clinic location & hours"
      ],
      "precio": "Transparent per-session rates and multi-session package discounts available upfront."
    }
  },
  "gimnasio": {
    "motivos": [
      "Free Trial Class",
      "Strength Training",
      "Functional Conditioning",
      "Yoga or Pilates",
      "1-on-1 Personal Trainer"
    ],
    "chat": {
      "saludo": "Hello! I am Fuerzaluna's assistant. I can help with class schedules, trial sessions, memberships, or bookings.",
      "preguntaMotivo": "Which class or program would you like to book?",
      "sugerencias": [
        "Book a free trial class",
        "Weekly class schedule",
        "Membership plans & pricing",
        "How waitlists work",
        "Location & facilities"
      ],
      "precio": "Monthly recurring memberships with unlimited classes and no lock-in contracts."
    }
  },
  "hotel": {
    "motivos": [
      "Standard Queen Room",
      "Deluxe King Room",
      "Master Suite with Terrace"
    ],
    "chat": {
      "saludo": "Hello! I am the Hotel Siete Celosías concierge. I can assist with room availability, mobile check-in, breakfast, or local dining recommendations.",
      "preguntaMotivo": "What type of room or inquiry do you have?",
      "sugerencias": [
        "Check room availability",
        "Breakfast menu & dietary options",
        "Parking & directions",
        "Wine tours & visits",
        "Direct booking perks"
      ],
      "precio": "Best rates guaranteed when booking direct, including complimentary breakfast and late check-out priority."
    }
  },
  "inmobiliaria": {
    "motivos": [
      "Schedule a Tour for a Home for Sale",
      "Schedule a Rental Viewing",
      "I Want to Sell My Property",
      "Mortgage & Financing Consultation"
    ],
    "chat": {
      "saludo": "Hello! I am the Casaterna Real Estate assistant. I can help you schedule a property tour, value your home, or find matching listings.",
      "preguntaMotivo": "How can we help your real estate search?",
      "sugerencias": [
        "Schedule a home tour",
        "Free home valuation",
        "Rental listings",
        "Mortgage calculation",
        "New property alerts"
      ],
      "precio": "Transparent commission structures with professional staging, 3D walkthroughs, and legal representation included."
    }
  },
  "jardineria": {
    "motivos": [
      "Recurring Garden Maintenance",
      "New Garden Design & Installation",
      "Smart Irrigation Setup & Repair",
      "Tree & Hedge Pruning",
      "Lot Clearing & Brush Abatement",
      "Lawn Turf or Synthetic Grass"
    ],
    "chat": {
      "saludo": "Hello! I am the Verdelino Landscaping assistant. I can help with pruning, irrigation, lawn care, or scheduling maintenance visits.",
      "preguntaMotivo": "What landscaping service does your property need?",
      "sugerencias": [
        "Garden maintenance quote",
        "Smart irrigation setup",
        "Lawn care & aeration",
        "Tree & hedge pruning",
        "Lot clearing"
      ],
      "precio": "Custom estimates based on property dimensions. Regular monthly grounds packages available."
    }
  },
  "limpieza": {
    "motivos": [
      "Office or Commercial Cleaning",
      "HOA Common Area Cleaning",
      "Deep Cleaning / Post-Construction",
      "Window Cleaning",
      "Recurring Home Cleaning"
    ],
    "chat": {
      "saludo": "Hello! I am the Brillalba Cleaning assistant. I can help with quotes for offices, residential homes, HOA buildings, or post-construction cleans.",
      "preguntaMotivo": "What type of cleaning service do you need?",
      "sugerencias": [
        "Office cleaning quote",
        "Post-construction deep clean",
        "HOA community maintenance",
        "Window washing",
        "Eco-friendly supplies"
      ],
      "precio": "Tailored quotes based on square footage and visit frequency. All supplies and insurance included."
    }
  },
  "medicina-estetica": {
    "motivos": [
      "Initial Facial Medical Assessment",
      "Neuromodulators & Dynamic Lines",
      "Hyaluronic Acid (Lips or Volume)",
      "Laser Resurfacing & Sun Spots",
      "Body Contouring & Skin Firming"
    ],
    "chat": {
      "saludo": "Hello! I am the Velaria Aesthetic Medicine assistant. I can assist with treatment recommendations, pre-procedure consultations, or appointment bookings.",
      "preguntaMotivo": "What treatment or area would you like to improve?",
      "sugerencias": [
        "Initial medical assessment",
        "Lip filler consultation",
        "Neuromodulator info",
        "Laser skin treatments",
        "Financing & packages"
      ],
      "precio": "Personalized medical quotes provided after comprehensive facial diagnosis. Zero pressure, 100% natural results."
    }
  },
  "oficios-hogar": {
    "motivos": [
      "Plumbing Leak or Drain Clog",
      "Electrical Failure or Breaker Issue",
      "Boiler, Heating or Hot Water Repair",
      "AC Installation or Cooling Repair",
      "Roofing Leak or Gutter Problem",
      "New Fixture Installation"
    ],
    "chat": {
      "saludo": "Hello! I am the Remache Home Services assistant. I can dispatch a technician for plumbing, electrical, AC, boiler, or roof repairs.",
      "preguntaMotivo": "What type of repair or installation do you need?",
      "sugerencias": [
        "Plumbing emergency",
        "Electrical breaker issue",
        "Boiler repair",
        "AC installation",
        "Schedule arrival window"
      ],
      "precio": "Clear written estimates provided on-site before any wrench is turned. Zero surprise fees."
    }
  },
  "peluqueria": {
    "motivos": [
      "Haircut & Styling",
      "Color, Balayage or Highlights",
      "Hydration or Keratin Treatment",
      "Event Styling & Updo",
      "Manicure or Pedicure",
      "Brows or Lash Lift"
    ],
    "chat": {
      "saludo": "Hello! I am the Tijera Añil Hair Salon assistant. I can help with service prices, stylist availability, or instant booking.",
      "preguntaMotivo": "What salon service would you like to book?",
      "sugerencias": [
        "Book haircut & blowout",
        "Balayage & color prices",
        "Event updo styling",
        "Keratin treatment info",
        "Loyalty card perks"
      ],
      "precio": "Transparent menu pricing with premium hair products and complimentary consultation."
    }
  },
  "reformas": {
    "motivos": [
      "Full Home Renovation",
      "Kitchen Remodel",
      "Bathroom Remodel",
      "Windows or Flooring Replacement",
      "Commercial Space Buildout"
    ],
    "chat": {
      "saludo": "Hello! I am the Tejavana Renovations assistant. I can help with ballpark costs, scheduling a measurement visit, or project milestones.",
      "preguntaMotivo": "What type of renovation are you planning?",
      "sugerencias": [
        "Kitchen remodel estimate",
        "Bathroom remodel quote",
        "Full apartment renovation",
        "Guaranteed timelines",
        "Schedule an in-home visit"
      ],
      "precio": "Detailed itemized estimates with fixed contract pricing and written completion warranties."
    }
  },
  "restaurante": {
    "motivos": [
      "Table for 2 Guests",
      "Table for 3 to 4 Guests",
      "Table for 5 to 6 Guests",
      "Large Group (7+ Guests)"
    ],
    "chat": {
      "saludo": "Hello! I am the Lumbreral Tavern assistant. I can assist with table bookings, allergen questions, today's market menu, or takeout orders.",
      "preguntaMotivo": "How many guests will be dining with us?",
      "sugerencias": [
        "Reserve a table for lunch/dinner",
        "Today's market menu",
        "View food & wine menu",
        "Gluten-free & allergen options",
        "Direct takeout ordering"
      ],
      "precio": "Fair market pricing with zero third-party platform markups on direct orders and reservations."
    }
  },
  "taller": {
    "motivos": [
      "Oil Change & Scheduled Maintenance",
      "Brakes (Pads or Rotors)",
      "Tire Replacement & Balancing",
      "State Safety & Emissions Inspection",
      "Check Engine Light / Diagnostics",
      "A/C Recharge & Climate Control"
    ],
    "chat": {
      "saludo": "Hello! I am the Pistonar Auto Repair assistant. I can help with service quotes, appointment slots, or vehicle status.",
      "preguntaMotivo": "What auto service does your vehicle require?",
      "sugerencias": [
        "Schedule oil & filter service",
        "Brake inspection & price",
        "Tire quote",
        "Engine diagnostic check",
        "Pre-inspection checkup"
      ],
      "precio": "Itemized written estimates sent digitally before work begins. Honest, reliable mechanic service."
    }
  },
  "veterinaria": {
    "motivos": [
      "General Wellness Exam",
      "Vaccination or Deworming",
      "Pet Grooming & Bath",
      "Microchip or Travel Passport",
      "Health Concern / Urgent Visit"
    ],
    "chat": {
      "saludo": "Woof & hello! I am the Rabocorto Veterinary assistant. I can help with appointments, vaccine reminders, pet grooming, or hours.",
      "preguntaMotivo": "What care does your pet need today?",
      "sugerencias": [
        "Book wellness exam",
        "Vaccine schedule & reminders",
        "Dog & cat grooming appointment",
        "Microchip & travel passport",
        "Clinic hours"
      ],
      "precio": "Transparent veterinary care pricing with detailed estimates provided prior to any procedure."
    }
  }
};
  var MAPA_TRADUCCION = {
  "Saltar al contenido": "Skip to content",
  "Demostración de NOVA · negocio ficticio": "NOVA Demonstration · Fictional Showcase",
  "Demostración de NOVA · negocios ficticios": "NOVA Demonstration · Fictional Showcases",
  "Ninguno de estos negocios existe.": "All businesses on this page are fictional showcases.",
  "Quiero una web así": "I want a website like this",
  "Cuéntanos tu proyecto": "Tell us about your project",
  "Demos por sector": "Showcases by Industry",
  "Una web de ejemplo por cada sector": "A sample showcase for every industry",
  "Ver todas las demos": "See all showcases",
  "Una web de ejemplo por cada sector para enseñar lo que NOVA puede hacer por un negocio: reserva online, WhatsApp, asistente de chat, app en Google Play y App Store, y buena posición en Google. Los negocios son inventados.": "A live sample showcase for every sector demonstrating what NOVA builds for local businesses: online bookings, WhatsApp CRM, AI chat concierge, Google Play & App Store companion apps, and high Google rankings. All businesses are fictional previews.",
  "¿Quieres algo así para tu negocio?": "Looking for a custom platform for your business?",
  "o habla con Sara, la asistente de": "or chat with Sara on",
  "solutionsnova.es": "novasolutionsmkt.com",
  "Servicios": "Services",
  "Reservar": "Book Online",
  "App": "Mobile App",
  "Horario": "Hours",
  "Preguntas": "FAQ",
  "Preguntas frecuentes": "Frequently Asked Questions",
  "WhatsApp": "WhatsApp",
  "Buscar": "Search",
  "Confirmada": "Confirmed",
  "En curso": "In Progress",
  "Pendiente": "Pending",
  "Hecho": "Done",
  "Listo": "Ready",
  "Cerrado": "Closed",
  "Plazas libres": "Open Spots",
  "Completa": "Full",
  "Diseño de ejemplo": "Showcase Preview",
  "También en app: Google Play y App Store": "Mobile App Preview: Google Play & App Store",
  "Tu app en Google Play y App Store": "Your Branded App on Google Play & App Store",
  "Tus clientes te llevan en el móvil: reservan, reciben avisos y vuelven con un toque.": "Keep your clients engaged on mobile: one-tap bookings, push alerts, and direct reorders.",
  "Disponible en": "Available on",
  "Google Play": "Google Play",
  "Descárgala en": "Download on",
  "App Store": "App Store",
  "Ejemplo de la app que NOVA puede crear para tu negocio, con tu marca, publicada en Google Play y App Store.": "Sample companion mobile app that NOVA creates and deploys to Apple App Store and Google Play under your brand.",
  "Horario y cómo llegar": "Hours & Directions",
  "Dónde estamos": "Location",
  "En la web real, aquí va el mapa de Google con la dirección exacta del negocio.": "On a production client site, your verified Google Map and exact physical address are integrated here.",
  "Imagen de ambiente creada con IA. Negocio y pantallas de ejemplo.": "AI-generated ambient backdrop. Business entity and UI screens are demonstration samples.",
  "Elige el día y la hora": "Pick Date & Time",
  "Elige día y hora": "Select Date & Time",
  "Elige día": "Select Date",
  "Elige una opción": "Select an option",
  "Día": "Date",
  "Hora": "Time",
  "Horas libres": "Open Time Slots",
  "Tu nombre": "Full Name",
  "Nombre y apellidos": "Full Name",
  "Teléfono": "Phone Number",
  "Móvil": "Mobile Phone",
  "Correo electrónico": "Email Address",
  "Reservar plaza": "Confirm Booking",
  "Enviar reserva": "Confirm Booking",
  "Pagar con tarjeta": "Pay with Card",
  "Efectivo en el local": "Pay on Arrival",
  "En esta demostración el formulario funciona, pero no envía ningún dato. También puedes reservar desde el asistente del chat.": "This interactive booking module operates in local preview mode: zero customer data is stored. You can also book directly inside the AI chat.",
  "Avisos y recordatorios al momento": "Instant Confirmations & Push Reminders",
  "Lunes a viernes": "Monday to Friday",
  "Sábados": "Saturdays",
  "Domingos": "Sundays",
  "JUE": "THU",
  "VIE": "FRI",
  "MIÉ": "WED",
  "MAR": "TUE",
  "LUN": "MON",
  "¿Te ayudo?": "Chat with us",
  "Versión de prueba": "Interactive Preview",
  "Escribe tu pregunta": "Type your question...",
  "Enviar": "Send",
  "Versión de prueba. ¿Quieres un asistente que converse de verdad con tus clientes y te ayude a cerrar ventas?": "Interactive preview. Want an AI concierge that genuinely converses with your customers and closes bookings 24/7?",
  "Contáctanos": "Contact us",
  "Entendido": "Got it",
  "Probar el chat": "Test Chat Assistant",
  "Esto lo ha preparado NOVA": "Crafted by NOVA Marketing Solutions",
  "¿Te imaginas tu negocio así?": "Envision Your Business Running Like This",
  "Una web como esta": "A High-Converting Website",
  "Rápida en el móvil, accesible y preparada para salir en Google cuando te buscan en tu zona.": "Blazing-fast on mobile devices, accessible, and engineered to rank #1 on Google in your local market.",
  "Ver precios": "View Plans & Pricing",
  "Ver la app de ejemplo": "View Sample Mobile App",
  "Un asistente que conversa y vende": "An AI Assistant That Converses & Sells",
  "El chat de esta página es una versión de prueba. El tuyo lo preparamos con IA y los datos de tu negocio: conversa con tus clientes a cualquier hora y te ayuda a cerrar ventas.": "The chat on this page is a static demonstration. We build your production assistant powered by AI trained on your actual products, services, and policies: engaging customers 24/7.",
  "Un sistema que crece contigo": "A Scalable Operating System",
  "Ver software real": "Explore Custom Software",
  "Así quedaría con nuestros planes": "Choose Your Growth Package",
  "Web profesional": "Professional Website",
  "desde 400 €": "from $450",
  "Una web como esta, rápida en el móvil": "A tailored, ultra-fast website built to turn traffic into clients",
  "Reservas online y botón de WhatsApp": "Online booking engine and direct messaging integrations",
  "Preparada para salir en Google en tu zona": "Turnkey local SEO configured to dominate nearby searches",
  "Quiero este plan": "Get Started with This Plan",
  "Asistente virtual": "AI Virtual Assistant",
  "desde 100 €": "from $110",
  "pago único": "one-time investment",
  "Atiende a tus clientes a cualquier hora": "24/7 instant automated client support and consultation",
  "Responde con la información de tu negocio": "Trained specifically on your pricing, hours, and catalog",
  "Puede tomar reservas desde el chat": "Books appointments and collects leads directly in chat",
  "App propia en Google Play y App Store": "Branded Mobile App (iOS & Android)",
  "desde 1.700 €": "from $1,850",
  "Tu marca en Google Play y App Store": "Your company icon and name live on Apple App Store & Google Play",
  "Reservas, avisos y recordatorios en el móvil de tus clientes": "Automated push alerts, booking confirmations, and loyalty retention",
  "El más completo": "Best Value",
  "Paquete Plus": "Plus Growth Bundle",
  "1.900 €": "$2,100",
  "Tu propia app y tu web": "Complete mobile app together with a high-converting website",
  "Branding y contenido para redes durante 1 mes": "Brand identity overhaul plus 1 full month of managed social media assets",
  "Estrategia de marketing": "Full digital marketing growth roadmap",
  "1 mes de campañas en Google gratis": "1 free month of certified Google Ads campaign management",
  "Código NOVA20: 20 % de descuento en cualquier servicio (no válido con los paquetes).": "Promo code NOVA20: 20% off any individual service (not combinable with all-in-one bundles).",
  "Estrategia de marketing digital gratis al contratar 2 o más servicios.": "Complimentary growth marketing strategy when bundling 2 or more services.",
  "Software real que ya hemos construido": "Real-World Software We Have Built",
  "Plataforma SaaS · Tiempo real": "Real-Time SaaS Platform",
  "ValetOS: el sistema operativo de un valet parking": "ValetOS: The Operating System for Valet Parking",
  "Coches, llaves, equipo, clientes y dinero en una sola plataforma. Cinco vistas conectadas que se actualizan al instante: supervisión, app del equipo en el móvil, portal del cliente por QR, finanzas y un asistente de IA que responde por texto o voz.": "Vehicles, keys, staff, customers, and financials in one unified platform. Five real-time synchronized views: dispatch console, staff mobile app, QR client tracker, financial ledger, and a bilingual voice/text AI assistant.",
  "Web app + móvil": "Web App + Mobile",
  "Tiempo real": "Real-Time Sync",
  "Asistente con IA": "AI Concierge",
  "Roles y permisos": "Roles & Permissions",
  "Pagos y propinas": "Payments & Tips",
  "Web + portal de clientes · Toronto (Canadá)": "Web & Customer Portal · Toronto, Canada",
  "The Fresh Pooch: peluquería canina a domicilio, automatizada de punta a punta": "The Fresh Pooch: Mobile Pet Grooming, Fully Automated End-to-End",
  "Presupuesto exacto en menos de 90 segundos, reserva online, portal del cliente con historial, app para el profesional en ruta, panel del dueño con ingresos y un concierge con IA bilingüe que vende 24/7.": "Accurate pricing quote in under 90 seconds, online booking, customer portal with grooming history, on-the-road groomer app, owner revenue analytics, and a 24/7 bilingual sales AI.",
  "Presupuesto instantáneo": "Instant Quote",
  "Reservas": "Bookings",
  "Portal del cliente": "Client Portal",
  "Panel del dueño": "Owner Dashboard",
  "IA bilingüe": "Bilingual AI",
  "Software de gestión · Comercio minorista": "Retail ERP & Point of Sale",
  "NovaSystem: tienda, stock y contabilidad en un solo sitio": "NovaSystem: Storefront, Stock Control & Accounting in One Place",
  "Caja (TPV) con lector de código de barras, inventario con alertas de stock mínimo, clientes, proveedores, facturación con IVA español, gastos, informes y contabilidad con asientos del PGC. Preparado para sincronizarse con la tienda online.": "Barcode POS, low-stock automated alerts, customer CRM, vendor management, invoicing, expense tracking, and real-time financial reporting synced with online inventory.",
  "TPV": "Point of Sale (POS)",
  "Inventario en tiempo real": "Real-Time Inventory",
  "Facturación e IVA": "Tax & Invoicing",
  "Contabilidad PGC": "Accounting & Ledger",
  "Informes": "Medical Reports",
  "Vídeos de los sistemas reales; algunas pantallas usan datos de prueba. Más en": "Live demonstration videos; select screens display test data. Learn more at",
  "¿Te preparamos algo así?": "Ready for Software Built for Your Business?",
  "Escríbenos en «Cuéntanos tu proyecto» o habla con Sara, la asistente virtual de solutionsnova.es.": "Get in touch through \"Tell us about your project\" or chat with Sara on novasolutionsmkt.com.",
  "Esta página es una": "This page is an",
  "demostración creada por NOVA Marketing Solutions": "interactive demonstration built by NOVA Marketing Solutions",
  ". El negocio, sus textos, precios y datos son ficticios. ¿Quieres una web así?": ". The business identity, copy, and numbers are demonstration samples. Want a platform like this for your business?",
  "o habla con Sara en": "or chat with Sara on",
  "El despacho no existe.": "This law firm is a fictional showcase.",
  "Abogados · Valladolid": "Attorneys & Legal Counselors",
  "Despacho de abogados · Centro de Valladolid": "Law Practice · Downtown Location",
  "Abogados en Valladolid que te explican tu caso con claridad": "Attorneys Who Explain Your Legal Options With Absolute Clarity",
  "Familia, laboral, herencias y civil. Reserva tu primera consulta, adelanta tu caso en un formulario guiado y sigue tu asunto desde tu área privada.": "Family, employment, estate planning, and civil law. Book your initial consultation, submit case details via our guided form, and track your matter in your private client portal.",
  "Reserva tu primera consulta": "Schedule Your Initial Consultation",
  "Primera consulta online": "Online Initial Consultation",
  "Área privada del cliente": "Private Client Portal",
  "Honorarios por escrito": "Written Upfront Fees",
  "Agenda de hoy": "Today's Stylist Schedule",
  "Primera consulta · familia": "Initial Consultation · Family Law",
  "Demanda laboral · revisión": "Labor Law Filing · Document Review",
  "Herencia · firma notaría": "Estate Probate · Signing Appointment",
  "Juicio verbal · sala 3": "Civil Hearing · Courtroom 3",
  "Consulta civil · vivienda": "Civil Housing Consultation",
  "Hola, Carlos": "Hello, Charles",
  "Tu expediente": "Your Legal Matter",
  "Herencia familiar": "Estate Settlement",
  "Borrador de partición listo": "Partition draft ready for review",
  "Subir documento": "Upload Document",
  "Mensajes": "Secure Messages",
  "Citas": "Appointments",
  "Sube la documentación desde el móvil con una foto": "Upload paperwork securely from your phone with a simple photo",
  "Familia": "Family Law",
  "Divorcios, custodias, pensiones y acuerdos prematrimoniales.": "Divorces, child custody, alimony, and prenuptial agreements.",
  "Laboral": "Payroll & HR",
  "Despidos, reclamaciones de cantidad y acoso laboral.": "Wrongful termination, wage claims, and workplace disputes.",
  "Herencias": "Estate & Probate",
  "Testamentos, particiones y liquidación de impuestos.": "Wills, probate administration, and inheritance tax settlement.",
  "Civil y vivienda": "Civil & Real Estate",
  "Contratos, alquileres, desahucios y comunidades.": "Contracts, leasing disputes, evictions, and property issues.",
  "Reclamaciones": "Claims & Damages",
  "Accidentes de tráfico, negligencias e impagos.": "Traffic accidents, professional liability, and debt recovery.",
  "Área privada": "Client Portal",
  "Sigue el estado de tu caso y sube documentos.": "Track your active case status and exchange secure documents.",
  "¿La primera consulta tiene coste?": "What is the fee for the initial consultation?",
  "Te informamos del coste antes de reservar. Si después llevamos tu caso, se descuenta de los honorarios.": "We state the consultation fee transparently before booking. If you retain us, the amount is credited toward your case.",
  "¿Cobráis a porcentaje en reclamaciones?": "Do you work on a contingency fee basis for claims?",
  "En algunos casos trabajamos con una cuota fija mínima y un porcentaje del resultado.": "In eligible personal injury and compensation claims, we work on a contingency fee structure.",
  "¿Puedo hacer la consulta por videollamada?": "Can I attend the consultation via video call?",
  "Sí, puedes elegir entre consulta presencial en el despacho o por videollamada.": "Yes, you can select either an in-person meeting at our office or a secure video consultation.",
  "Derecho de familia o divorcio": "Family Law & Divorce",
  "Despido o tema laboral": "Employment Dispute & Severance",
  "Herencia o testamento": "Estate Planning & Probate",
  "Alquiler, vivienda o civil": "Property, Lease & Civil Law",
  "Reclamación de cantidad": "Financial Recovery & Damages",
  "La administración no existe.": "This property management firm is a fictional showcase.",
  "Administración de fincas": "HOA & Property Management",
  "Administración de fincas · Valladolid": "Property & HOA Management",
  "Administración de fincas en Valladolid, con todo a la vista desde el móvil": "HOA & Property Management: Total Financial Transparency on Your Phone",
  "Comunidades de vecinos y alquileres. Cada vecino y propietario tiene su acceso: recibos, actas, documentos e incidencias con seguimiento.": "Condominium communities and rental properties. Every resident and property owner enjoys dedicated digital access: dues, meeting minutes, building repairs, and transparent accounts.",
  "Pide una cita con el administrador": "Schedule a Property Manager Consultation",
  "Portal de vecinos": "Resident Portal",
  "Incidencias con seguimiento": "Repair Ticket Tracker",
  "Recibos y actas online": "Online Dues & Meeting Minutes",
  "Avisos de hoy": "Today's Service Calls",
  "Luz del portal · comunidad 14": "Lobby lighting repair · Building 14",
  "Revisión ascensor · bloque B": "Elevator inspection · Block B",
  "Acta junta ordinaria": "Annual HOA meeting minutes",
  "Presupuesto tejado · votación": "Roof repair estimate · Voting",
  "Hola, Roberto": "Hello, Robert",
  "Tu comunidad": "Your Community",
  "Calle Mayor 12": "Oakwood Tower 12",
  "Recibo de noviembre": "November HOA Dues",
  "Avería notificada: portero automático": "Reported issue: Intercom repair",
  "Ver recibos": "View Dues",
  "Avisar de avería": "Report Issue",
  "Votaciones": "HOA Voting",
  "Comunidades de vecinos": "HOA Communities",
  "Gestión integral contable, legal y técnica para edificios.": "Full financial, administrative, and maintenance management for residential buildings.",
  "Gestión de alquileres": "Rental Asset Management",
  "Cobro de rentas, control de fianzas y contratos.": "Rent collection, tenant vetting, lease renewals, and security deposit management.",
  "Incidencias": "Maintenance & Repairs",
  "Avisa de averías con fotos y sigue la reparación.": "Submit repair requests with photos and follow contractor resolution in real time.",
  "Recibos y cobros": "Billing & Accounts",
  "Emisión de recibos y control de morosidad.": "Digital payment processing, transparent bank reconciliation, and delinquency mitigation.",
  "Documentos": "Documents",
  "Actas, estatutos, pólizas de seguro e informes.": "Instant cloud access to HOA bylaws, insurance policies, meeting minutes, and financial audits.",
  "Juntas": "HOA Meetings & Voting",
  "Convocatorias claras y votaciones presenciales u online.": "Well-organized annual meetings with in-person or verified digital proxy voting.",
  "¿Cómo cambiamos de administrador?": "How do we switch property management firms?",
  "Nosotros nos encargamos de todo el traspaso de documentación y cuentas con la administración anterior.": "We manage the entire document handover and account transition seamlessly from your prior management company.",
  "¿Podemos votar acuerdos desde el móvil?": "Can residents vote on HOA decisions from mobile?",
  "Sí, para las decisiones que la ley permite podéis votar directamente desde el portal de vecinos.": "Yes, eligible non-vital community decisions and vendor approvals can be voted on directly in the resident portal.",
  "Cambiar de administrador en mi comunidad": "Switch Property Manager for our Building",
  "Presupuesto para una comunidad nueva": "HOA Management Proposal for New Development",
  "Gestión de alquileres de particulares": "Residential Rental Property Management",
  "Consulta de un propietario actual": "Current Resident Inquiry",
  "La asesoría no existe.": "This accounting firm is a fictional showcase.",
  "Asesoría fiscal, laboral y contable": "Accounting, Tax & Payroll Advisory",
  "Asesoría · Huerta del Rey, Valladolid": "Accounting & Tax Advisory · Business Services",
  "Tu asesoría en Valladolid: impuestos al día sin perseguir papeles": "Your Accounting Firm: Taxes on Time Without Chasing Paperwork",
  "Autónomos y pymes. Sube tus facturas desde el móvil, recibe avisos antes de cada plazo y ten todos tus documentos ordenados por trimestre.": "Self-employed & SMEs: Snap invoices from your phone, get deadline reminders, and keep all quarterly documents perfectly organized.",
  "Pide cita con tu asesor": "Schedule Your Advisory Meeting",
  "Facturas desde el móvil": "Invoices From Your Phone",
  "Avisos de plazos": "Deadline Reminders",
  "Todo ordenado por trimestre": "Quarterly Document Filing",
  "Tareas de hoy": "Today's Work Orders",
  "Alta de autónomo": "Business Registration",
  "IVA trimestral · 12 clientes": "Quarterly Sales Tax · 12 Clients",
  "Renta · revisión": "Tax Return · Review",
  "Nóminas de octubre": "October Payroll",
  "Crear una empresa": "Company Incorporation",
  "Hola, Nuria": "Hello, Sarah",
  "Próximo plazo": "Upcoming Deadline",
  "IVA del trimestre": "Quarterly Sales Tax",
  "Te faltan 2 facturas de gastos": "You have 2 expense receipts missing",
  "Subir ticket": "Upload Receipt",
  "Plazos": "Deadlines",
  "Haz una foto del ticket y nosotros lo contabilizamos": "Snap a photo of the receipt and our team handles the bookkeeping",
  "Fiscal": "Tax Filing",
  "IVA, IRPF, sociedades y declaración de la renta.": "Sales tax, income tax, corporate filings, and annual returns.",
  "Contabilidad": "Accounting & Bookkeeping",
  "Libros, cuentas anuales y cierres.": "Ledgers, annual balance sheets, and tax-ready closings.",
  "Nóminas, contratos, altas y seguros sociales.": "Payroll processing, contracts, onboarding, and social contributions.",
  "Te damos de alta y te explicamos tus obligaciones.": "We handle your legal business setup and explain every tax duty.",
  "Crear empresa": "Company Incorporation",
  "Constitución de sociedades paso a paso.": "Step-by-step LLC/corporate registration and legal structuring.",
  "Sube facturas y tickets con una foto.": "Upload receipts and track your financials in one secure portal.",
  "¿Cómo os envío las facturas?": "How do I send you invoices and receipts?",
  "Con una foto desde la app o el portal.": "Simply take a photo from the mobile app or upload files to your client portal.",
  "¿Me avisáis de los plazos?": "Do you send deadline alerts?",
  "Sí, antes de cada plazo te llega un aviso con lo que falta.": "Yes, prior to each tax deadline you receive automated reminders detailing any pending documents.",
  "¿Hacéis la renta a particulares?": "Do you prepare individual tax returns?",
  "Sí.": "Yes, we handle personal income tax returns with maximum legal deductions.",
  "¿Puedo cambiarme de asesoría a mitad de año?": "Can I switch advisory firms mid-year?",
  "Sí, nos encargamos de pedir la documentación a la anterior.": "Yes, we coordinate the transfer of all accounting records directly from your previous advisor.",
  "Hacerme autónomo": "Register as Self-Employed",
  "Declaración de la renta": "Annual Tax Return",
  "Impuestos de mi negocio": "Business Tax Strategy",
  "Nóminas y contratos": "Payroll & Contracts",
  "La clínica no existe.": "This veterinary clinic is a fictional showcase.",
  "Clínica dental · Valladolid": "Dental Clinic & Oral Health",
  "Dentista en Parquesol · Valladolid": "Dental Clinic · Trusted Care",
  "Tu dentista de confianza en Valladolid, con cita en dos minutos": "Your Trusted Dental Clinic: Easy Online Appointments in Under 2 Minutes",
  "Revisiones, ortodoncia invisible, implantes y odontopediatría. Elige día y hora desde el móvil y recibe la confirmación al momento.": "General cleanings, clear aligners, dental implants, and pediatric care. Choose your specialist and time slot from your phone with instant confirmation.",
  "Pide tu cita online": "Book Your Dental Visit Online",
  "Presupuesto por escrito": "Upfront Written Quotes",
  "Horario de tarde": "Evening Hours Available",
  "Odontopediatría": "Pediatric Dentistry",
  "Revisión y limpieza": "Checkup & Cleaning",
  "Ortodoncia invisible · revisión": "Clear Aligners · Checkup",
  "Implante · colocación": "Dental Implant Placement",
  "Empaste · pieza 16": "Cavity Filling",
  "Urgencia dental": "Dental Emergency",
  "Hola, Marina": "Hello, Rachel",
  "Tu próxima cita": "Next Appointment",
  "Limpieza dental anual": "Annual Dental Cleaning",
  "Doctora Vega": "Dr. Sarah Miller",
  "Pedir cita": "Book Visit",
  "Historial": "Dental History",
  "Tratamientos": "Hair Treatments",
  "Diagnóstico completo con radiografía digital.": "Comprehensive oral evaluation with low-radiation digital imaging.",
  "Ortodoncia invisible": "Clear Aligners Consultation",
  "Alineadores transparentes cómodos y discretos.": "Discreet, removable clear aligners customized to your smile.",
  "Implantes": "Dental Implants",
  "Cirugía guiada por ordenador con materiales biocompatibles.": "Computer-guided dental implants with biocompatible titanium restorations.",
  "Blanqueamiento": "Teeth Whitening",
  "Resultados visibles y seguros en pocas sesiones.": "Safe, in-office and take-home professional whitening systems.",
  "Cuidado dental sin miedo para los más pequeños.": "Gentle, stress-free dental care designed especially for children.",
  "Urgencias": "Emergency Care",
  "Atención prioritaria para dolor, roturas o golpes.": "Same-day priority attention for acute pain, broken teeth, or oral trauma.",
  "¿La primera revisión incluye radiografía?": "Does the first checkup include digital X-rays?",
  "Sí, incluye exploración visual y radiografía digital para un diagnóstico completo.": "Yes, it includes full clinical inspection and digital imaging for a complete diagnosis.",
  "¿Financiáis los tratamientos?": "Do you offer flexible treatment financing?",
  "Sí, ofrecemos financiación sin intereses en tratamientos de ortodoncia e implantes.": "Yes, we provide 0% interest monthly payment options for orthodontic and implant procedures.",
  "Revisión o limpieza": "General Checkup & Cleaning",
  "Implantes dentales": "Dental Implants Evaluation",
  "Dolor o urgencia": "Acute Pain / Dental Emergency",
  "Blanqueamiento dental": "Teeth Whitening",
  "Cita para niños": "Pediatric Dentistry",
  "Medicina y fisioterapia": "Medical & Physical Therapy Center",
  "Clínica médica · Covaresa, Valladolid": "Multi-Specialty Medical Clinic",
  "Medicina y fisioterapia en Valladolid, con cita en el profesional que elijas": "Medical & Physical Therapy Care: Direct Booking with Your Specialist",
  "Medicina general, fisioterapia, nutrición y psicología en un mismo centro. Reserva por especialidad, recibe recordatorios y consulta tus informes desde el móvil.": "General medicine, physical therapy, clinical nutrition, and psychology in one unified center. Book by practitioner, receive SMS alerts, and access lab reports on mobile.",
  "Reserva tu cita": "Book Your Appointment",
  "Cita por profesional": "Book by Specialist",
  "Recordatorios": "SMS & Mobile Reminders",
  "Informes en el móvil": "Digital Health Records",
  "Medicina general": "Primary Care Medicine",
  "Fisioterapia · lumbar": "Physical Therapy · Lumbar",
  "Nutrición · seguimiento": "Nutrition · Follow-up",
  "Psicología · sesión": "Psychology · Therapy Session",
  "Podología · quiropodia": "Podiatry · Foot Care",
  "Hola, Javier": "Hello, James",
  "Próxima consulta": "Next Appointment",
  "Fisioterapia deportiva": "Sports Physical Therapy",
  "Doctor García": "Dr. David Davis",
  "Mis citas": "My Appointments",
  "Bonos": "Session Packages",
  "Atención médica preventiva y seguimiento de salud.": "Preventive medicine, routine diagnostics, and chronic care tracking.",
  "Fisioterapia": "Physical Therapy",
  "Rehabilitación muscular, lesiones deportivas y dolor.": "Targeted musculoskeletal rehab, sports injury recovery, and pain relief.",
  "Nutrición": "Pet Nutrition",
  "Planes nutricionales adaptados a tu estilo de vida.": "Evidence-based dietary planning personalized to your health goals.",
  "Psicología": "Psychology & Therapy",
  "Acompañamiento psicológico para adultos y adolescentes.": "Confidential behavioral therapy and mental wellness support.",
  "Podología": "Podiatry & Foot Care",
  "Estudio de la pisada y cuidado integral del pie.": "Gait analysis, custom orthotics, and clinical foot care.",
  "Bonos de sesiones": "Session Packages",
  "Packs de fisioterapia con descuento y sin caducidad.": "Discounted multi-session therapy packages with no expiration date.",
  "¿Puedo elegir al fisioterapeuta?": "Can I choose my physical therapist?",
  "Sí, en la reserva online puedes seleccionar directamente al profesional que prefieras.": "Yes, our online booking engine lets you pick your preferred practitioner directly.",
  "¿Cuánto dura una sesión de fisioterapia?": "How long is a physical therapy session?",
  "Nuestras sesiones son individuales de 50 minutos con terapia manual.": "All sessions are one-on-one for 50 minutes of focused manual and active therapy.",
  "Consulta de medicina general": "Primary Care Medical Visit",
  "Sesión de fisioterapia": "Physical Therapy Session",
  "Consulta de nutrición": "Nutrition Assessment",
  "Consulta de psicología": "Psychology Consultation",
  "Podología y pisada": "Podiatry & Gait Analysis",
  "El estudio no existe.": "This fitness studio is a fictional showcase.",
  "Gimnasio y entrenamiento": "Boutique Fitness & Performance",
  "Estudio de entrenamiento · La Rubia": "Boutique Training Studio · Premium Fitness",
  "Entrena en Valladolid y reserva tu plaza desde el móvil": "Elevate Your Training: Book Classes Straight From Your Phone",
  "Fuerza, entrenamiento funcional, yoga y pilates en grupos reducidos. Reserva tu clase, apúntate a la lista de espera y lleva tu cuota en la app.": "Strength, functional conditioning, yoga, and pilates in small groups. Book classes, join automated waitlists, and manage your membership from the mobile app.",
  "Reserva tu clase de prueba": "Book Your Free Trial Class",
  "Grupos reducidos": "Small Groups",
  "Lista de espera automática": "Automated Waitlist",
  "Primera clase de prueba": "First Trial Class Included",
  "Clases de hoy": "Today's Schedule",
  "Funcional": "Functional Fitness",
  "Fuerza": "Strength Training",
  "Yoga": "Yoga",
  "Pilates": "Pilates",
  "Hola, Dani": "Hello, Alex",
  "Tu próxima clase": "Next Class",
  "Mi cuota": "My Membership",
  "Quedan 2 plazas en Yoga del martes": "2 spots left in Tuesday Yoga",
  "Técnica y progresión en grupos pequeños.": "Form, technique, and progressive overload in focused small groups.",
  "Clases intensas para ganar forma física.": "High-intensity athletic conditioning to build real endurance.",
  "Movilidad, respiración y calma.": "Mobility, breath control, and core alignment.",
  "Core, postura y prevención de lesiones.": "Core stabilization, posture control, and injury prevention.",
  "Entrenamiento personal": "Personal Training",
  "Sesiones uno a uno con un plan para ti.": "Tailored 1-on-1 sessions with an individual progression plan.",
  "App del socio": "Member App",
  "Horarios, reservas, cuota y avisos en tu móvil.": "Schedules, bookings, membership fees, and push alerts.",
  "¿Hay matrícula?": "Is there an initiation fee?",
  "No, no cobramos matrícula ni exigimos permanencia.": "No enrollment fees or mandatory contracts. Cancel anytime.",
  "¿Cómo funciona la lista de espera?": "How does the automated waitlist work?",
  "Si una clase se llena, te apuntas en un clic. Cuando alguien cancela, la app te avisa y te guarda la plaza.": "If a session fills up, tap to join the waitlist. When a slot opens, the app alerts you immediately.",
  "Clase de prueba gratuita": "Free Trial Class",
  "Entrenamiento de fuerza": "Strength Training",
  "Entrenamiento funcional": "Functional Conditioning",
  "Yoga o pilates": "Yoga or Pilates",
  "Entrenador personal": "1-on-1 Personal Trainer",
  "El hotel no existe.": "This hotel is a fictional showcase.",
  "Hotel boutique · Valladolid": "Boutique Hotel & Hospitality",
  "Hotel boutique · Centro histórico": "Historic Downtown Boutique Hotel",
  "Un hotel tranquilo en el centro de Valladolid, con reserva directa": "A Boutique Haven in Downtown: Best Direct Booking Guaranteed",
  "Reserva en nuestra web, haz el check-in online antes de llegar y escríbenos durante tu estancia. Todo desde el móvil.": "Reserve on our official site, complete mobile check-in before arrival, and message our concierge during your stay. Seamless luxury on your phone.",
  "Reserva tu habitación": "Book Your Room",
  "Check-in online": "Digital Check-in",
  "Desayuno incluido": "Artisan Breakfast Included",
  "Cancelación gratuita": "Flexible Cancellation",
  "Habitaciones": "Boutique Rooms",
  "Suite Celosía": "Celosia Master Suite",
  "Doble Superior": "Deluxe King Room",
  "Doble Estándar": "Standard Queen Room",
  "Hola, Elena": "Hello, Elena",
  "Tu estancia": "Your Stay",
  "Habitación 204": "Room 204",
  "Llave digital": "Digital Room Key",
  "Pedir al servicio": "Room Service",
  "Guía de la ciudad": "City Guide",
  "Diseño acogedor, cama de máxima comodidad y silencio.": "Acoustically insulated rooms with premium mattresses and bespoke design.",
  "Desayuno": "Local Breakfast",
  "Productos de la tierra, pan recién hecho y zumo natural.": "Locally sourced artisan cheeses, freshly baked breads, and specialty coffee.",
  "Ahorra esperas y recibe la llave digital en tu móvil.": "Skip reception lines and receive your digital room access directly on mobile.",
  "Mensajes con recepción": "Digital Concierge",
  "Pídenos una almohada extra o una reserva por WhatsApp.": "Instant concierge messaging for pillows, transfers, or dining reservations.",
  "Rutas del vino": "Wine Experiences",
  "Te organizamos visitas a bodegas de Ribera y Rueda.": "Curated sommelier tours to Ribera del Duero and Rueda vineyards.",
  "Aparcamiento": "Private Parking",
  "Plazas concertadas en garaje vigilado junto al hotel.": "Secured private parking adjacent to hotel grounds with EV charging.",
  "¿A qué hora es el check-in y el check-out?": "What are the check-in and check-out times?",
  "El check-in es a partir de las 14:00 y el check-out hasta las 12:00. Puedes hacer check-in online antes.": "Check-in begins at 2:00 PM and check-out is at 12:00 PM. Mobile check-in is available beforehand.",
  "¿Tenéis cancelación gratuita?": "Do you offer free cancellation?",
  "Sí, hasta 24 horas antes de la llegada en tarifas directas de nuestra web.": "Yes, up to 24 hours prior to arrival on all direct website bookings.",
  "Habitación Doble Estándar": "Standard Queen Room",
  "Habitación Doble Superior": "Deluxe King Room",
  "Suite con terraza": "Master Suite with Terrace",
  "La inmobiliaria no existe.": "This real estate agency is a fictional showcase.",
  "Inmobiliaria": "Real Estate Agency",
  "Compra · Alquiler · Venta": "Buy · Rent · Sell",
  "Encuentra tu casa en Valladolid y visítala cuando te venga bien": "Find Your Ideal Home: Schedule Private Tours on Your Own Schedule",
  "Pisos, casas y locales en Valladolid y su alfoz. Reserva la visita online en un minuto y recibe un aviso cuando entre un inmueble como el que buscas.": "Apartments, single-family homes, and prime commercial spaces. Schedule private tours online and receive instant alerts when matching listings hit the market.",
  "Encuentra tu vivienda": "Browse Featured Listings",
  "Filtro por zona y precio": "Filter by Area & Price",
  "Aviso de nuevas viviendas": "New Listing Alerts",
  "Visita guiada sin compromiso": "No-Obligation Tours",
  "Inmuebles": "Available Properties",
  "Piso en Parquesol · 3 hab": "3-Bed Apartment · Parquesol",
  "Ático centro · terraza": "Downtown Penthouse · Terrace",
  "Chalet adosado · jardín": "Townhouse · Private Garden",
  "Búsqueda activa": "Saved Search",
  "3 hab · con garaje": "3 Beds · With Garage",
  "Nuevo inmueble disponible": "New Matching Listing Alert",
  "Pedir visita": "Schedule Tour",
  "Favoritos": "Saved Homes",
  "Compra": "Home Buying",
  "Acompañamiento integral desde la búsqueda hasta la notaría.": "Full buyer representation from custom search through final notary closing.",
  "Alquiler": "Rental Services",
  "Viviendas verificadas con contratos transparentes.": "Verified rental properties with vetted leases and zero junk fees.",
  "Venta": "Property Selling",
  "Valoración profesional y reportaje fotográfico de calidad.": "Comparative market analysis, professional photography, and targeted buyer marketing.",
  "Avisos": "Listing Alerts",
  "Recibe un WhatsApp antes de que el inmueble se publique.": "Get instant WhatsApp notifications before prime properties hit public portals.",
  "Hipoteca": "Mortgage Advisory",
  "Te ayudamos a comparar ofertas hipotecarias sin compromiso.": "Independent mortgage comparison to secure the lowest rates.",
  "Locales": "Commercial Spaces",
  "Locales comerciales y oficinas en las mejores zonas.": "Commercial retail, medical, and office spaces in high-footfall locations.",
  "¿Cobráis por visitar los inmuebles?": "Is there any fee for property viewings?",
  "No, las visitas son completamente gratuitas y sin ningún compromiso.": "No, all property viewings are completely free of charge with zero obligation.",
  "¿Hacéis valoración de mi piso gratis?": "Do you provide free property valuations?",
  "Sí, realizamos una valoración de mercado presencial sin coste si estás pensando en vender.": "Yes, we provide an in-person, data-driven market valuation at no cost if you plan to sell.",
  "Visitar un piso o casa en venta": "Schedule a Tour for a Home for Sale",
  "Visitar un piso de alquiler": "Schedule a Rental Viewing",
  "Quiero vender mi propiedad": "I Want to Sell My Property",
  "Consulta de hipoteca o financiación": "Mortgage & Financing Consultation",
  "La empresa de jardinería no existe.": "This landscaping company is a fictional showcase.",
  "Jardinería y paisajismo": "Landscaping & Garden Design",
  "Jardinería · Valladolid y alfoz": "Residential & Commercial Landscaping",
  "Jardinería en Valladolid: tu jardín cuidado todo el año": "Premier Landscaping: Pristine, Lush Gardens All Year Round",
  "Diseño, riego automático y mantenimiento. Envía fotos de tu jardín, recibe el presupuesto y deja que las visitas periódicas se programen solas.": "Landscape design, smart irrigation, and scheduled lawn care. Send photos of your grounds, get an upfront quote, and enjoy automated recurring maintenance.",
  "Pide presupuesto para tu jardín": "Request a Landscaping Quote",
  "Diseño personalizado": "Custom Landscape Design",
  "Riego eficiente": "Smart Water Conservation",
  "Visitas periódicas": "Scheduled Maintenance",
  "Poda de setos · La Vega": "Hedge Trimming · West Suburb",
  "Instalación de riego": "Smart Drip Irrigation Setup",
  "Césped natural · siembra": "Turf Aeration & Seeding",
  "Mantenimiento piscina": "Poolside Landscape Care",
  "Hola, Beatriz": "Hello, Beatrice",
  "Tu servicio": "Your Service",
  "Mantenimiento quincenal": "Bi-weekly Grounds Care",
  "Próxima visita: Jueves": "Next Visit: Thursday",
  "Ver tareas": "Completed Tasks",
  "Pedir poda": "Request Pruning",
  "Diseño de jardines": "Landscape Architecture",
  "Proyectos a medida que combinan vegetación y bajo consumo de agua.": "Custom aesthetic plans balancing native vegetation with low water usage.",
  "Poda": "Tree & Hedge Pruning",
  "Poda en altura, setos, árboles frutales y ornamentales.": "Professional tree trimming, hedge sculpting, and seasonal branch pruning.",
  "Riego automático": "Smart Irrigation",
  "Instalación de riego por goteo y aspersión con programador.": "Drip line and sprinkler system installation with weather-smart controllers.",
  "Césped": "Lawn & Turf Care",
  "Siembra, escarificado, abono y césped artificial de alta gama.": "Turf installation, aeration, organic fertilization, and luxury synthetic turf.",
  "Mantenimiento": "Recurring Grounds Care",
  "Visitas semanales o quincenales para que no te preocupes de nada.": "Weekly or bi-weekly maintenance visits covering weeding, mowing, and edging.",
  "Limpieza de parcelas": "Lot Clearing & Firebreaks",
  "Desbroce y retirada de restos vegetales según normativa.": "Brush clearing, weed abatement, and organic green waste hauling.",
  "¿El presupuesto tiene compromiso?": "Is the landscaping estimate non-binding?",
  "No, te damos presupuesto por escrito tras ver fotos o visitar la finca, sin ningún compromiso.": "No, we provide a written itemized estimate after seeing photos or visiting your site, with zero obligation.",
  "¿Incluye la retirada de restos?": "Does your service include organic waste removal?",
  "Sí, siempre recogemos y retiramos todos los restos de poda y siega a punto limpio.": "Yes, our crew always collects, mulches, and hauls away all prunings and green clippings.",
  "Mantenimiento periódico de jardín": "Recurring Garden Maintenance",
  "Diseño o reforma de jardín": "New Garden Design & Installation",
  "Instalación o reparación de riego": "Smart Irrigation Setup & Repair",
  "Poda de árboles o setos": "Tree & Hedge Pruning",
  "Desbroce o limpieza de parcela": "Lot Clearing & Brush Abatement",
  "Césped natural o artificial": "Lawn Turf or Synthetic Grass",
  "La empresa de limpieza no existe.": "This cleaning company is a fictional showcase.",
  "Limpieza y mantenimiento": "Commercial & Residential Cleaning",
  "Limpieza · Valladolid": "Professional Cleaning Services",
  "Limpieza en Valladolid: elige el servicio, el día y la frecuencia": "Professional Cleaning Services: Pick Your Frequency, Day & Time",
  "Hogares, oficinas, comunidades y fin de obra. Reserva desde el móvil, programa limpiezas periódicas y recibe el parte de lo hecho.": "Homes, corporate offices, HOA common areas, and post-construction. Book directly from your phone, schedule recurring visits, and receive digital checklists upon completion.",
  "Pide presupuesto de limpieza": "Request a Cleaning Estimate",
  "Presupuesto sin compromiso": "No-Obligation Estimate",
  "Productos incluidos": "Eco Supplies Included",
  "Mismo equipo asignado": "Consistent Dedicated Crew",
  "Servicios de hoy": "Today's Cleaning Dispatches",
  "Oficina · 250 m²": "Corporate Office · 2,500 sq ft",
  "Comunidad · portales": "HOA Residential Towers",
  "Limpieza fin de obra": "Post-Construction Deep Clean",
  "Hogar semanal": "Weekly Home Cleaning",
  "Hola, Marta": "Hello, Martha",
  "Limpieza de oficina": "Office Maintenance",
  "Completado a las 11:30": "Completed at 11:30 AM",
  "Ver checklist": "View Checklist",
  "Pedir extra": "Request Add-on",
  "Hogares": "Residential Cleaning",
  "Limpieza a fondo periódica o puntual con el mismo personal.": "Recurring or deep residential cleaning performed by trusted, vetted staff.",
  "Oficinas y locales": "Offices & Commercial",
  "Mantenimiento fuera de horario laboral para no interrumpir.": "After-hours commercial cleaning that keeps your workplace pristine.",
  "Comunidades": "HOA Communities",
  "Portales, escaleras, cristales y garajes limpios a diario.": "Stairwells, lobbies, elevators, windows, and common areas kept spotless.",
  "Fin de obra": "Post-Construction",
  "Eliminación de polvo fino, restos de pintura y desinfección.": "Thorough removal of silica dust, paint splatters, and residue after remodeling.",
  "Cristales": "Window Cleaning",
  "Limpieza profesional de ventanas, escaparates y galerías.": "Streak-free cleaning for storefronts, residential picture windows, and glass partitions.",
  "Parte de trabajo": "Digital Completion Log",
  "Recibe un aviso y la lista de tareas completadas tras cada visita.": "Receive timestamped notifications and signed task checklists after each clean.",
  "¿Lleváis vosotros los productos y maquinaria?": "Do you supply all equipment and cleaning products?",
  "Sí, incluimos todos los productos de limpieza profesionales ecológicos y maquinaria homologada.": "Yes, our team brings all professional eco-certified supplies and commercial HEPA equipment.",
  "¿El personal está asegurado y contratado?": "Is all cleaning staff insured and background-checked?",
  "Todo nuestro personal está en plantilla con seguro de responsabilidad civil y alta en la Seguridad Social.": "All staff members are directly employed, insured with comprehensive liability coverage, and thoroughly vetted.",
  "Limpieza de oficina o local": "Office or Commercial Cleaning",
  "Limpieza de comunidad de vecinos": "HOA Common Area Cleaning",
  "Limpieza a fondo o fin de obra": "Deep Cleaning / Post-Construction",
  "Limpieza de cristales": "Window Cleaning",
  "Limpieza de hogar periódica": "Recurring Home Cleaning",
  "Medicina estética": "Aesthetic Medicine & Medical Spa",
  "Medicina estética · Centro de Valladolid": "Medical Aesthetics · Expert Physician Care",
  "Medicina estética en Valladolid, con valoración médica y a tu ritmo": "Aesthetic Medicine & Skin Health: Natural Results Guided by Physicians",
  "Tratamientos faciales y corporales con una valoración médica previa. Reserva tu tratamiento, controla tus sesiones y recibe un aviso cuando toque volver.": "Facial and body treatments backed by comprehensive medical consultations. Book treatments, track session timelines, and receive touch-up reminders.",
  "Pide tu cita médica": "Schedule Your Medical Consultation",
  "Valoración médica previa": "Pre-Treatment Medical Assessment",
  "Plan personalizado": "Tailored Aesthetic Plan",
  "Control de sesiones": "Session Tracking",
  "Neuromoduladores faciales": "Facial Neuromodulators",
  "Ácido hialurónico · labios": "Hyaluronic Dermal Fillers · Lips",
  "Láser rejuvenecimiento": "Laser Skin Resurfacing",
  "Peeling médico": "Medical Chemical Peel",
  "Hola, Carmen": "Hello, Carmen",
  "Tu plan estético": "Your Aesthetic Plan",
  "Fase 2 de 3": "Phase 2 of 3",
  "Revisión en 15 días": "Review in 15 days",
  "Mis tratamientos": "My Treatments",
  "Pedir valoración": "Book Assessment",
  "Valoración médica": "Physician Assessment",
  "Diagnóstico facial completo y plan armónico personalizado.": "Full facial anatomy mapping and balanced, personalized treatment design.",
  "Medicina facial": "Facial Injectables",
  "Neuromoduladores y rellenos con ácido hialurónico.": "Expert neuromodulators and natural hyaluronic acid dermal fillers.",
  "Calidad de la piel": "Skin Rejuvenation",
  "Peelings médicos, bioestimuladores y mesoterapia con vitaminas.": "Medical-grade peels, collagen biostimulators, and vitamin mesotherapy.",
  "Láser": "Advanced Laser Systems",
  "Tratamiento de manchas, rojeces, cicatrices y textura.": "Targeted laser therapies for pigmentation, redness, scars, and texture.",
  "Corporal": "Body Contouring",
  "Remodelación no invasiva, celulitis y flacidez.": "Non-invasive body sculpting, skin tightening, and localized contouring.",
  "Bonos y packs": "Treatment Bundles",
  "Planes combinados para maximizar resultados con seguimiento.": "Coordinated treatment packages engineered for long-lasting aesthetic harmony.",
  "¿La valoración médica tiene compromiso?": "Does the medical consultation obligate me to a procedure?",
  "No, la valoración sirve para conocer tu caso, resolver dudas y darte un presupuesto sin compromiso.": "No, the initial consultation is to understand your goals, answer questions, and provide a no-obligation plan.",
  "¿Quién realiza los tratamientos médicos?": "Who performs the clinical procedures?",
  "Todos los tratamientos inyectables y médicos los realiza exclusivamente personal médico colegiado.": "All injectable and medical treatments are administered exclusively by board-certified physicians.",
  "Primera valoración médica facial": "Initial Facial Medical Assessment",
  "Neuromoduladores o arrugas de expresión": "Neuromodulators & Dynamic Lines",
  "Ácido hialurónico (labios o volumen)": "Hyaluronic Acid (Lips or Volume)",
  "Láser o manchas en la piel": "Laser Resurfacing & Sun Spots",
  "Tratamiento corporal": "Body Contouring & Skin Firming",
  "La empresa de servicios del hogar no existe.": "This home services company is a fictional showcase.",
  "Servicios del hogar": "Plumbing, Electrical & HVAC",
  "Servicios del hogar · Valladolid": "Licensed Home Trades & Repairs",
  "Fontanero, electricista y clima en Valladolid, con cita y aviso de llegada": "Licensed Plumber, Electrician & HVAC: Live Arrival Alerts on Your Phone",
  "Averías, instalaciones y mantenimiento. Pide cita desde el móvil con una foto del problema y recibe un aviso cuando el técnico va de camino.": "Emergency repairs, certified installations, and heating/AC maintenance. Request service with a photo of the issue and track your technician en route.",
  "Pide un técnico": "Request a Licensed Technician",
  "Cita con foto del problema": "Book with Photo of Issue",
  "Aviso de llegada": "Technician Arrival Alert",
  "Presupuesto antes de empezar": "Written Quote Before Starting",
  "Fuga en la cocina · fontanería": "Kitchen Pipe Leak · Plumbing",
  "Cuadro eléctrico · salto diferencial": "Electrical Panel · Circuit Breaker",
  "Caldera gas · revisión anual": "Boiler · Annual Safety Inspection",
  "Aire acondicionado · instalación": "Mini-Split AC Installation",
  "Hola, Fernando": "Hello, Frank",
  "Tu aviso": "Your Service Call",
  "Técnico en camino": "Technician En Route",
  "Llegada estimada: 10:45": "Estimated Arrival: 10:45 AM",
  "Llamar al técnico": "Call Tech",
  "Ver presupuesto": "View Quote",
  "Fontanería": "Plumbing",
  "Fugas, atascos, grifería, termos y cambio de sanitarios.": "Pipe leaks, drain snaking, faucets, water heaters, and fixture installation.",
  "Electricidad": "Electrical Services",
  "Cuadros eléctricos, boletines, enchufes e iluminación LED.": "Service panels, wiring upgrades, circuit breakers, and lighting.",
  "Aire acondicionado": "A/C Service & Recharge",
  "Instalación de splits, recargas de gas y mantenimiento.": "Ductless mini-split installation, refrigerant recharges, and maintenance.",
  "Calderas": "Boilers & Heating",
  "Reparación, cambio y revisión oficial de gas y gasoil.": "High-efficiency boiler repair, replacements, and safety certifications.",
  "Tejados": "Roofing & Gutters",
  "Reparación de goteras, canalones y aislamiento de cubiertas.": "Emergency leak repair, seamless gutters, and roof insulation.",
  "Mantenimientos": "Preventive Plans",
  "Contratos de revisión preventiva para hogares y negocios.": "Annual preventative maintenance contracts for homes and businesses.",
  "¿Cobráis desplazamiento si no acepto el presupuesto?": "Is there a diagnostic dispatch fee?",
  "Te informamos del coste de la visita diagnóstica antes de enviar al técnico. Si apruebas el trabajo, no se cobra el desplazamiento.": "We inform you of the diagnostic visit fee before dispatching. If you approve the repair, the fee is credited.",
  "¿Dáis garantía por escrito?": "Do you provide a written warranty?",
  "Sí, todos nuestros trabajos cuentan con garantía legal por escrito y factura oficial.": "Yes, all repairs and installations include a written warranty and official receipt.",
  "Avería de fontanería o fuga": "Plumbing Leak or Drain Clog",
  "Avería eléctrica o cuadro": "Electrical Failure or Breaker Issue",
  "Caldera, calefacción o agua caliente": "Boiler, Heating or Hot Water Repair",
  "Aire acondicionado o climatización": "AC Installation or Cooling Repair",
  "Gotera, tejado o canalón": "Roofing Leak or Gutter Problem",
  "Instalación o reforma puntual": "New Fixture Installation",
  "La peluquería no existe.": "This salon is a fictional showcase.",
  "Peluquería y estética": "Hair Salon & Esthetics",
  "Peluquería · Delicias, Valladolid": "Boutique Hair Salon & Studio",
  "Tu peluquería en Valladolid, con reserva online a cualquier hora": "Boutique Hair Salon: Book Your Appointment 24/7 in Seconds",
  "Corte, color, peinados y estética. Elige servicio y profesional desde el móvil, recibe un recordatorio y acumula visitas en tu tarjeta digital.": "Haircuts, balayage, styling, and beauty treatments. Select your stylist and time from your phone, get SMS reminders, and earn rewards on your digital card.",
  "Reserva 24 horas": "24/7 Online Booking",
  "Recordatorio de la cita": "Automated SMS Reminder",
  "Tarjeta de fidelidad en el móvil": "Digital Loyalty Card",
  "Corte · Ana": "Haircut & Blowout · Stylist Ana",
  "Balayage y matiz": "Balayage & Gloss",
  "Peinado fiesta": "Event Updo & Styling",
  "Manicura semipermanente": "Gel Manicure",
  "Hola, Lucía": "Hello, Lucy",
  "Tu cita": "Your Appointment",
  "Viernes 17:30 · Con Sara": "Friday 5:30 PM · With Sara",
  "Llevas 4 de 5 sellos": "4 of 5 reward stamps earned",
  "Ver servicios": "Salon Menu",
  "Tarjeta": "Loyalty Card",
  "Corte": "Haircut & Style",
  "Asesoramiento de imagen, lavado con masaje y acabado.": "Visual consultation, soothing scalp massage, precision cut, and blowout.",
  "Color y mechas": "Color & Highlights",
  "Balayage, babylights, cobertura de canas y tintes sin amoniaco.": "Custom balayage, babylights, full gray coverage, and ammonia-free glazes.",
  "Peinados": "Event Styling",
  "Recogidos, ondas y peinados para bodas y eventos especiales.": "Updos, Hollywood waves, and bespoke styling for weddings and galas.",
  "Hidratación profunda, keratina y reconstrucción capilar.": "Deep moisture therapies, keratin smoothing, and bond-building repair.",
  "Manicura y pedicura": "Nails & Esthetics",
  "Esmaltado semipermanente y cuidado integral de uñas.": "Long-lasting gel polish, nail extensions, and restorative pedicures.",
  "Cejas y pestañas": "Brows & Lashes",
  "Diseño con pinza, lifting de pestañas y tinte.": "Brow shaping, lash lifting, and semi-permanent tinting.",
  "¿Puedo elegir qué estilista me atiende?": "Can I choose my specific stylist?",
  "Sí, en la reserva online puedes seleccionar directamente a tu profesional favorito.": "Yes, our online booking engine lets you choose your favorite stylist directly.",
  "¿Cómo funciona la tarjeta de fidelidad?": "How does the mobile loyalty card work?",
  "Se añade al wallet de tu móvil con un toque y tras cada visita sumas un sello para descuentos.": "It adds directly to Apple Wallet or Google Wallet; earn a digital stamp each visit for rewards.",
  "Corte y peinado": "Haircut & Styling",
  "Coloración, balayage o mechas": "Color, Balayage or Highlights",
  "Tratamiento hidratante o keratina": "Hydration or Keratin Treatment",
  "Peinado para fiesta o evento": "Event Styling & Updo",
  "Manicura o pedicura": "Manicure or Pedicure",
  "Cejas o pestañas": "Brows or Lash Lift",
  "La empresa no existe.": "This remodeling firm is a fictional showcase.",
  "Reformas integrales": "Home Remodeling & Renovation",
  "Reformas · Valladolid y alfoz": "Turnkey Home Renovations",
  "Reformas en Valladolid con presupuesto claro y la obra siempre a la vista": "Home Remodeling With Upfront Pricing & Real-Time Photo Tracking",
  "Cocinas, baños y reformas integrales. Pide presupuesto con fotos desde el móvil y sigue tu obra por fases, con fotos y avisos, sin tener que llamar.": "Kitchens, bathrooms, and complete renovations. Submit photos from your phone for an itemized quote, and follow each project phase with live progress updates.",
  "Pide una visita para tu presupuesto": "Schedule an In-Home Estimate",
  "Presupuesto con fotos": "Photo-Based Estimates",
  "Seguimiento de obra": "Client Portal & Photos",
  "Plazos por escrito": "Guaranteed Timelines",
  "Obras en curso": "Active Renovation Projects",
  "Baño · fase 3 de 5": "Master Bathroom · Phase 3 of 5",
  "Cocina · alicatado": "Kitchen Remodel · Tile Installation",
  "Reforma piso 90 m²": "Full Condo Renovation · 950 sq ft",
  "Cambio ventanas": "Energy-Efficient Window Upgrade",
  "Hola, Sergio": "Hello, Scott",
  "Tu reforma": "Your Project",
  "Reforma de cocina": "Kitchen Remodel",
  "Fontanería completada": "Plumbing milestone completed",
  "Fotos de hoy": "Today's Photos",
  "Reforma integral": "Full Home Renovation",
  "Redistribución, electricidad, fontanería, suelos y acabados.": "Complete architectural redesign, electrical, plumbing, floors, and finishes.",
  "Cocinas": "Kitchen Remodeling",
  "Muebles a medida, encimeras, electrodomésticos e iluminación.": "Custom cabinetry, quartz countertops, appliances, and smart task lighting.",
  "Baños": "Bathroom Renovation",
  "Cambio de bañera por ducha, alicatados y grifería empotrada.": "Tub-to-shower conversions, luxury porcelain tile, and concealed fixtures.",
  "Ventanas y aislamiento": "Windows & Insulation",
  "Ventanas de PVC con rotura térmica y aislamiento acústico.": "Thermal-break European windows, sliding doors, and acoustic wall insulation.",
  "Pintura y suelos": "Flooring & Painting",
  "Tarima flotante, microcemento, alisado de paredes y pintura.": "Hardwood, microcement, drywall smoothing, and premium zero-VOC painting.",
  "Acceso al portal con fotos diarias del avance de tu reforma.": "Private client portal with daily timestamped milestone photos.",
  "¿El presupuesto está cerrado y sin sorpresas?": "Is the estimate fixed with no hidden fees?",
  "Sí, detallamos cada partida por escrito y los precios no varían salvo que tú pidas cambios.": "Yes, every line item is priced in writing and remains fixed unless you request scope adjustments.",
  "¿Garantizáis la fecha de finalización?": "Do you guarantee the completion deadline in writing?",
  "Sí, fijamos la fecha de entrega por contrato con penalización por cada día de retraso.": "Yes, our contract commits to a binding delivery date with credit penalties for delays.",
  "Reforma integral de vivienda": "Full Home Renovation",
  "Reforma de baño": "Bathroom Remodel",
  "Cambio de ventanas o suelos": "Windows or Flooring Replacement",
  "Reforma de local comercial": "Commercial Space Buildout",
  "La taberna no existe.": "This tavern is a fictional showcase.",
  "Taberna · Cocina de brasa": "Wood-Fired Grill & Tavern",
  "Taberna · Centro de Valladolid": "Artisan Grill & Tapas",
  "Brasa, tapas y vino de la tierra en el centro de Valladolid": "Wood-Fired Grill, Signature Tapas & Regional Wines",
  "Reserva tu mesa en un minuto, consulta la carta con alérgenos y pide para recoger con tu propio sistema, sin comisiones de plataformas.": "Reserve your table in under 60 seconds, explore our interactive allergen-filtered menu, and place direct takeout orders with zero third-party markups.",
  "Reserva tu mesa": "Reserve a Table",
  "Reserva de mesa online": "Instant Table Reservation",
  "Carta con alérgenos": "Allergen-Filtered Menu",
  "Pedidos para recoger": "Direct Takeout Ordering",
  "Reservas de hoy": "Today's Table Bookings",
  "Comida · 2 personas": "Lunch · Table for 2",
  "Cena · 4 personas": "Dinner · Table for 4",
  "Cumpleaños · 8 personas": "Celebration · Table for 8",
  "Terraza · 2 personas": "Patio · Table for 2",
  "Hola, Marcos": "Hello, Marcus",
  "Tu mesa": "Your Reservation",
  "Viernes 21:30 · 2 comensales": "Friday 9:30 PM · 2 Guests",
  "Mesa en comedor interior": "Main Dining Room",
  "Ver carta": "Food Menu",
  "Pedir para llevar": "Order Takeout",
  "Carnes a la brasa": "Wood-Fired Meats",
  "Cortes seleccionados madurados al punto sobre leña de encina.": "Prime dry-aged beef cuts grilled to perfection over oak firewood.",
  "Tapas y raciones": "Signature Tapas",
  "Recetas tradicionales elaboradas al momento con producto local.": "Fresh seasonal tapas prepared to order using local farm produce.",
  "Vinos de la tierra": "Regional Wine Cellar",
  "Selección de denominaciones de origen Ribera, Rueda y Cigales.": "Curated wine list featuring Ribera del Duero, Rueda, and boutique vintages.",
  "Menú del día": "Market Lunch Menu",
  "Tres primeros, tres segundos, pan, bebida y postre casero.": "Chef-driven 3-course weekday market lunch with homemade dessert.",
  "Para recoger": "Direct Takeout",
  "Haz tu pedido online y recógelo caliente a la hora indicada.": "Order online directly and pick up fresh and piping hot without commission markups.",
  "Grupos y celebraciones": "Group Events",
  "Menús cerrados a medida para comidas de empresa o amigos.": "Tailored multi-course set menus for private gatherings and corporate dinners.",
  "¿Tenéis opciones sin gluten o para alérgicos?": "Do you offer gluten-free and allergen-safe options?",
  "Sí, nuestra carta online indica todos los alérgenos y contamos con protocolos de cocina específicos.": "Yes, our interactive menu filters every major allergen, prepared with strict cross-contamination protocols.",
  "¿Puedo reservar para grupos grandes?": "Can I book for large parties or private events?",
  "Sí, a partir de 8 personas te preparamos un menú especial previa reserva.": "Yes, for groups of 8 or more we provide personalized group dining menus upon reservation.",
  "Mesa para 2 comensales": "Table for 2 Guests",
  "Mesa para 3 o 4 comensales": "Table for 3 to 4 Guests",
  "Mesa para 5 o 6 comensales": "Table for 5 to 6 Guests",
  "Grupo de más de 6 comensales": "Large Group (7+ Guests)",
  "El taller no existe.": "This repair shop is a fictional showcase.",
  "Taller mecánico": "Auto Repair & Diagnostics",
  "Taller mecánico · Valladolid": "Certified Automotive Service",
  "Taller mecánico en Valladolid con cita previa y aviso cuando tu coche está listo": "Auto Repair & Diagnostics: Book Service & Get Real-Time Car Ready Alerts",
  "Revisiones, frenos, neumáticos y pre-ITV. Reserva desde el móvil, aprueba el presupuesto sin pasar por el taller y recibe un WhatsApp cuando el coche esté terminado.": "Factory scheduled maintenance, brakes, tires, and state inspections. Book online, approve digital estimates from your phone, and receive an instant SMS when your car is ready.",
  "Pide cita en el taller": "Schedule Auto Service",
  "Cita previa online": "Online Service Booking",
  "Presupuesto desde el móvil": "Digital Quote Approval",
  "Aviso de coche listo": "Car Ready Alert",
  "Coches en el taller": "Vehicles in Service Bay",
  "Revisión y aceite · Seat León": "Oil & Filter Service · VW Golf",
  "Pastillas de freno · Audi A3": "Brake Pad Replacement · Audi A3",
  "Cambio neumáticos · BMW": "Tire Mount & Balance · BMW 3-Series",
  "Diagnosis motor · Ford Focus": "Engine Diagnostics · Ford Focus",
  "Hola, David": "Hello, David",
  "Tu vehículo": "Your Vehicle",
  "Mercedes Clase A": "Mercedes A-Class",
  "Revisión completada": "Inspection Completed",
  "Coche listo para recoger": "Car ready for pickup",
  "Ver factura": "View Invoice",
  "Revisión y aceite": "Oil Change & Inspection",
  "Mantenimiento según fabricante manteniendo la garantía oficial.": "Factory-compliant maintenance using OEM filters, preserving manufacturer warranty.",
  "Frenos": "Brake Service",
  "Pastillas, discos, zapatas y líquido de frenos certificado.": "Pads, rotors, calipers, and fluid flushes with computerized safety testing.",
  "Neumáticos": "Tires & Alignment",
  "Montaje, equilibrado y alineación de primeras marcas.": "Mounting, laser wheel alignment, and puncture repair for top tire brands.",
  "Pre-ITV": "Safety & Emissions Inspection",
  "Revisión completa de 40 puntos para pasar la inspección a la primera.": "Comprehensive 40-point safety check to pass state inspection on the first try.",
  "Recarga de gas R134a y R1234yf con higienización de conductos.": "Refrigerant recharge, leak detection, and antimicrobial cabin sanitization.",
  "Diagnosis": "Computer Diagnostics",
  "Máquina de diagnosis multimarca para localizar fallos electrónicos.": "OEM-level computer scanning to pinpoint electronic and sensor faults.",
  "¿Mantenéis la garantía del fabricante si hago la revisión con vosotros?": "Does servicing here maintain my factory warranty?",
  "Sí, por normativa europea puedes pasar la revisión oficial en nuestro taller conservando la garantía de la marca.": "Yes, under European and standard regulations, manufacturer warranties remain fully intact with our certified service.",
  "¿Me avisáis si encontráis algo más antes de reparar?": "Do you call me before doing additional repairs?",
  "Siempre. Te enviamos foto y presupuesto al móvil para que lo apruebes antes de tocar nada.": "Always. We send photos and an itemized quote to your phone for approval before touching anything.",
  "Revisión oficial y cambio de aceite": "Oil Change & Scheduled Maintenance",
  "Frenos (pastillas o discos)": "Brakes (Pads or Rotors)",
  "Cambio de neumáticos": "Tire Replacement & Balancing",
  "Revisión pre-ITV": "State Safety & Emissions Inspection",
  "Luz de fallo o diagnosis de motor": "Check Engine Light / Diagnostics",
  "Aire acondicionado o carga de gas": "A/C Recharge & Climate Control",
  "Clínica veterinaria": "Veterinary Clinic & Animal Care",
  "Veterinaria · La Victoria, Valladolid": "Compassionate Veterinary Care",
  "Tu clínica veterinaria en Valladolid, para perros, gatos y compañía": "Veterinary Care & Wellness: Easy Online Appointments for Your Pets",
  "Consultas, vacunas, cirugía y peluquería. Pide cita desde el móvil en un minuto y lleva la cartilla de tu mascota en la app, con aviso cuando toca vacunar.": "Checkups, vaccinations, surgery, and grooming. Book online in 60 seconds, and access your pet's digital medical record with automated preventive reminders.",
  "Pide cita en un minuto": "Book a Vet Visit in 1 Minute",
  "Cita online": "Instant Online Booking",
  "Cartilla digital": "Digital Pet Health Passport",
  "Aviso de vacunas": "Vaccine & Preventive Reminders",
  "Consultas de hoy": "Today's Patient Schedule",
  "Luna · vacuna": "Bella · Rabies Booster",
  "Toby · revisión dental": "Max · Dental Checkup",
  "Simba · ecografía": "Oliver · Ultrasound",
  "Kira · peluquería": "Coco · Full Grooming & Bath",
  "Hola, Paula": "Hello, Paula",
  "Tu mascota": "Your Pet",
  "Luna · Golden Retriever": "Bella · Golden Retriever",
  "Próxima vacuna: 15 dic": "Next Vaccine: Dec 15",
  "Ver cartilla": "View Health Card",
  "Consulta general": "Wellness & General Care",
  "Revisiones completas para prevenir y detectar problemas a tiempo.": "Comprehensive physical exams to prevent and catch health issues early.",
  "Vacunas y desparasitación": "Vaccines & Parasite Control",
  "Plan preventivo adaptado al estilo de vida de tu mascota.": "Preventative vaccination schedule and flea/tick protocols personalized to your pet.",
  "Cirugía": "Surgical Services",
  "Quirófano equipado con monitorización anestésica constante.": "Modern surgical suite with continuous multiparameter anesthetic monitoring.",
  "Peluquería": "Pet Grooming & Spa",
  "Baño, corte de raza, deslanado e higiene de oídos y uñas.": "Coat brushing, breed-specific trimming, deshedding baths, and gentle nail care.",
  "Microchip y pasaporte": "Microchipping & Travel Passports",
  "Identificación obligatoria y documentación para viajar.": "ISO microchip registration and official pet passports for domestic/international travel.",
  "Asesoramiento para cachorros, animales sénior o dietas clínicas.": "Targeted nutritional counseling for growing puppies, senior pets, and dietary allergies.",
  "¿Atendéis urgencias veterinarias?": "Do you offer emergency veterinary care?",
  "Sí, durante nuestro horario de apertura atendemos urgencias con prioridad.": "Yes, during operating hours emergency cases receive immediate medical triage.",
  "¿Puedo consultar las vacunas de mi mascota desde el móvil?": "Can I check my pet's vaccination history on mobile?",
  "Sí, la app incluye la cartilla digital con el historial de vacunas y avisos automáticos.": "Yes, the companion app stores your pet's digital records with automatic immunization reminders.",
  "Consulta general o revisión": "General Wellness Exam",
  "Vacuna o desparasitación": "Vaccination or Deworming",
  "Peluquería o baño canino/felino": "Pet Grooming & Bath",
  "Microchip o pasaporte de viaje": "Microchip or Travel Passport",
  "Problema de salud o urgencia": "Health Concern / Urgent Visit"
};

  // Detect current demo slug from pathname
  var rutaActual = (typeof window !== 'undefined' && window.location.pathname) ? window.location.pathname : '';
  var slugActual = '';
  var partes = rutaActual.split('/').filter(Boolean);
  if (partes.length && partes[partes.length - 1] === 'index.html') partes.pop();
  if (partes.length) slugActual = partes[partes.length - 1];

  var nodoConfig = document.getElementById('demo-config');
  var config = nodoConfig ? JSON.parse(nodoConfig.textContent) : {
    negocio: 'NOVA Showcases',
    horario: {},
    motivos: [],
    avisos: {},
    chat: { sugerencias: [] }
  };

  // Override config if English
  if (esIngles && slugActual && DEMO_CONFIGS_EN[slugActual]) {
    var enCfg = DEMO_CONFIGS_EN[slugActual];
    if (enCfg.motivos && enCfg.motivos.length) config.motivos = enCfg.motivos;
    if (enCfg.chat) {
      if (!config.chat) config.chat = {};
      if (enCfg.chat.saludo) config.chat.saludo = enCfg.chat.saludo;
      if (enCfg.chat.preguntaMotivo) config.chat.preguntaMotivo = enCfg.chat.preguntaMotivo;
      if (enCfg.chat.sugerencias) config.chat.sugerencias = enCfg.chat.sugerencias;
      if (enCfg.chat.precio) config.chat.precio = enCfg.chat.precio;
      config.chat.clavesReserva = ['book', 'booking', 'reserve', 'schedule', 'appointment'];
    }
  }

  var DIAS = esIngles
    ? ['Sundays', 'Mondays', 'Tuesdays', 'Wednesdays', 'Thursdays', 'Fridays', 'Saturdays']
    : ['domingos', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábados'];
  var NOVA_FORM = esIngles
    ? 'https://novasolutionsmkt.com/?openBriefing=true'
    : 'https://solutionsnova.es/?openBriefing=true';

  function $(selector, raiz) { return (raiz || document).querySelector(selector); }
  function $$(selector, raiz) { return Array.prototype.slice.call((raiz || document).querySelectorAll(selector)); }

  function normalizar(texto) {
    return ' ' + String(texto).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9ñ]+/g, ' ').trim() + ' ';
  }

  function fechaISO(fecha) {
    return fecha.getFullYear() + '-' + String(fecha.getMonth() + 1).padStart(2, '0') + '-' + String(fecha.getDate()).padStart(2, '0');
  }
  function aMinutos(hora) { var p = hora.split(':'); return Number(p[0]) * 60 + Number(p[1]); }
  function aHora(minutos) { return String(Math.floor(minutos / 60)).padStart(2, '0') + ':' + String(minutos % 60).padStart(2, '0'); }

  function huecosDelDia(fecha) {
    var tramos = (config.horario && config.horario[String(fecha.getDay())]) || [];
    var paso = config.minutosPorCita || 30;
    var huecos = [];
    tramos.forEach(function (tramo) {
      var fin = aMinutos(tramo[1]) || 24 * 60;
      for (var m = aMinutos(tramo[0]); m + paso <= fin; m += paso) huecos.push(aHora(m));
    });
    return huecos;
  }

  function proximosDiasAbiertos(cuantos) {
    var dias = [];
    var fecha = new Date();
    fecha.setHours(12, 0, 0, 0);
    for (var i = 0; i < 60 && dias.length < cuantos; i++) {
      fecha.setDate(fecha.getDate() + 1);
      if (huecosDelDia(fecha).length) dias.push(new Date(fecha));
    }
    return dias;
  }

  function fechaLarga(fecha) {
    return fecha.toLocaleDateString(esIngles ? 'en-US' : 'es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
  }
  function fechaCorta(fecha) {
    return fecha.toLocaleDateString(esIngles ? 'en-US' : 'es-ES', { weekday: 'short', day: 'numeric', month: 'short' });
  }

  function resumenCita(motivo, fecha, hora, nombre) {
    if (esIngles) {
      return (config.textoReservaEn || 'Booking confirmed') + (motivo ? ': ' + motivo : '') + ', on ' + fechaLarga(fecha) +
        (hora ? ' at ' + hora : '') + (nombre ? ', for ' + nombre : '') + '.';
    }
    return (config.textoReserva || 'Cita reservada') + (motivo ? ': ' + motivo : '') + ', el ' + fechaLarga(fecha) +
      (hora ? ' a las ' + hora : '') + (nombre ? ', a nombre de ' + nombre : '') + '.';
  }

  // ---------- Reserva desde el formulario ----------
  var formulario = $('form[data-reserva]');
  if (formulario) {
    var campoFecha = $('input[name="fecha"]', formulario);
    var campoHora = $('select[name="hora"]', formulario);
    var avisoFecha = $('[data-aviso-fecha]', formulario);
    var resultado = $('[data-resultado]', formulario);

    var manana = new Date(); manana.setDate(manana.getDate() + 1);
    var limite = new Date(); limite.setDate(limite.getDate() + 60);
    if (campoFecha) {
      campoFecha.min = fechaISO(manana);
      campoFecha.max = fechaISO(limite);
    }

    var rellenarHoras = function () {
      if (!avisoFecha || !campoFecha) return;
      avisoFecha.textContent = '';
      var fecha = campoFecha.value ? new Date(campoFecha.value + 'T12:00:00') : null;
      var huecos = fecha ? huecosDelDia(fecha) : [];
      if (fecha && !huecos.length) {
        avisoFecha.textContent = esIngles
          ? 'Closed on ' + DIAS[fecha.getDay()] + '. Please choose another day.'
          : 'Los ' + DIAS[fecha.getDay()] + ' está cerrado. Elige otro día.';
      }
      if (!campoHora) return;
      campoHora.innerHTML = '';
      if (!huecos.length) {
        campoHora.append(new Option(esIngles ? (fecha ? 'Closed that day' : 'Choose a date first') : (fecha ? 'Cerrado ese día' : 'Elige antes el día'), ''));
        campoHora.disabled = true;
        return;
      }
      campoHora.disabled = false;
      campoHora.append(new Option(esIngles ? 'Choose a time slot' : 'Elige una hora', ''));
      huecos.forEach(function (hora) { campoHora.append(new Option(hora, hora)); });
    };
    if (campoFecha) campoFecha.addEventListener('change', rellenarHoras);
    rellenarHoras();

    formulario.addEventListener('submit', function (evento) {
      evento.preventDefault();
      resultado.className = 'resultado';
      var cerrado = avisoFecha && avisoFecha.textContent !== '';
      if (!formulario.checkValidity() || cerrado || (campoHora && campoHora.disabled)) {
        formulario.reportValidity();
        resultado.textContent = cerrado
          ? avisoFecha.textContent
          : (esIngles ? 'Please fill in all marked fields to complete your booking.' : 'Revisa los campos marcados para poder reservar.');
        resultado.classList.add('resultado--error');
        return;
      }
      var datos = new FormData(formulario);
      var extras = $$('[data-resumen]', formulario).map(function (campo) {
        var valor = datos.get(campo.name);
        return valor ? campo.getAttribute('data-resumen').replace('{v}', valor) : '';
      }).filter(Boolean);
      resultado.textContent = (esIngles ? 'All set, ' : '¡Hecho, ') + String(datos.get('nombre')).trim().split(' ')[0] + '! ' +
        resumenCita(datos.get('motivo'), new Date(datos.get('fecha') + 'T12:00:00'), datos.get('hora'), '') +
        (extras.length ? ' (' + extras.join(', ') + ')' : '') +
        (esIngles
          ? ' In a live website you would now receive confirmation via email or SMS. This is an interactive showcase: no data was stored.'
          : ' En la web real recibirías ahora la confirmación por correo. Esto es una demostración: no se ha enviado ningún dato.');
      resultado.classList.add('resultado--ok');
      formulario.reset();
      rellenarHoras();
      resultado.focus();
    });
  }

  // Botones que eligen el motivo de la reserva desde otra sección
  $$('[data-elegir]').forEach(function (boton) {
    boton.addEventListener('click', function () {
      var selector = formulario && $('select[name="motivo"]', formulario);
      if (selector) selector.value = boton.getAttribute('data-elegir');
    });
  });

  // ---------- Avisos: WhatsApp y tiendas de apps ----------
  var dialogo = $('#dialogo-aviso');
  $$('[data-aviso]').forEach(function (boton) {
    boton.addEventListener('click', function (evento) {
      var tipo = boton.getAttribute('data-aviso');
      var aviso = config.avisos && config.avisos[tipo];
      if (!dialogo || typeof dialogo.showModal !== 'function') return;
      evento.preventDefault();
      if (esIngles) {
        if (tipo === 'whatsapp') {
          $('[data-aviso-titulo]', dialogo).textContent = 'How the WhatsApp Button Works';
          $('[data-aviso-texto]', dialogo).textContent = 'On a live production site, this button opens WhatsApp with your verified business number and a pre-filled client inquiry message. In this showcase, no real phone number is attached.';
        } else {
          $('[data-aviso-titulo]', dialogo).textContent = 'Your App on Google Play and App Store';
          $('[data-aviso-texto]', dialogo).textContent = 'On a live client app, these buttons link to your published applications on Apple App Store (iOS) and Google Play (Android). NOVA designs, builds, and deploys your custom branded mobile app to both stores.';
        }
      } else if (aviso) {
        $('[data-aviso-titulo]', dialogo).textContent = aviso.titulo;
        $('[data-aviso-texto]', dialogo).textContent = aviso.texto;
      }
      dialogo.showModal();
    });
  });
  if (dialogo) $('[data-cerrar]', dialogo).addEventListener('click', function () { dialogo.close(); });

  // ---------- Filtro de inmuebles ----------
  var filtros = $$('[data-filtro]');
  filtros.forEach(function (boton) {
    boton.addEventListener('click', function () {
      var tipo = boton.getAttribute('data-filtro');
      filtros.forEach(function (b) { b.setAttribute('aria-pressed', String(b === boton)); });
      $$('[data-tipo]').forEach(function (ficha) { ficha.hidden = tipo !== 'todos' && ficha.getAttribute('data-tipo') !== tipo; });
    });
  });

  // ---------- Asistente de chat simulado ----------
  var chat = $('#chat');
  var abrirChat = $('#chat-abrir');
  if (chat && abrirChat) {
    var CONTACTO = esIngles
      ? 'Looking for an AI assistant that genuinely engages your clients and closes more bookings? Connect with NOVA Marketing Solutions to build yours.'
      : '¿Quieres un asistente que converse de verdad con tus clientes y te ayude a cerrar ventas? Contacta con NOVA y lo preparamos para tu negocio.';

    var COMUNES_ES = [
      { claves: ['reserv', 'cita', 'pedir hora', 'coger hora', 'apuntar', 'apuntarme', 'quiero ir', 'hueco', 'disponibilidad'].concat(config.chat.clavesReserva || []), accion: 'reservar' },
      { claves: ['anular', 'cancelar la', 'cancelar mi', 'cambiar la cita', 'cambiar mi', 'mover la', 'no puedo ir', 'no voy a poder'], texto: 'Puedes cambiarla o anularla desde el enlace del correo de confirmación o escribiéndonos por WhatsApp. Así el hueco le sirve a otra persona.' },
      { claves: ['horario', ' hora ', 'a que hora', 'abris', 'abierto', 'abre', 'cerrais', 'cierra', 'sabado', 'domingo', 'festivo', 'agosto', 'vacaciones'], texto: 'Nuestro horario es: ' + (config.horarioTexto || 'lunes a viernes') + '. Los festivos, avisamos en la web y en la app.' },
      { claves: ['donde', 'direccion', 'ubicacion', 'ubicados', 'llegar', 'como voy', 'mapa', 'barrio', 'calle'], texto: 'Estamos en ' + (config.zona || 'el centro') + '. En la web real aquí verías la dirección exacta y el mapa.' },
      { claves: ['aparcar', 'aparcamiento', 'parking', 'autobus', 'bus ', 'transporte'], texto: 'En la web real te diríamos dónde aparcar y qué autobuses te dejan cerca.' },
      { claves: ['precio', 'cuesta', 'cuanto', 'tarifa', 'presupuesto', ' caro', 'barato', 'coste'], texto: config.chat.precio || 'Te damos el presupuesto por escrito antes de empezar, sin compromiso.' },
      { claves: ['pagar', ' pago', 'tarjeta', 'bizum', 'efectivo', 'financ', 'plazos', 'factura'], texto: 'Puedes pagar con tarjeta, Bizum o efectivo, y te damos factura.' },
      { claves: ['telefono', 'llamar', 'whatsapp', 'contactar', 'contacto', 'correo', 'email', 'hablar con alguien', 'persona real'], texto: 'Lo más rápido es escribirnos por WhatsApp con el botón verde de la web.' },
      { claves: [' app ', 'aplicacion', 'descargar', 'android', 'iphone', 'play store', 'google play', 'app store'], texto: '¡Sí! Tenemos app para Android y iPhone: reservas, avisos y todo en el móvil.' },
      { claves: ['accesib', 'silla de ruedas', 'movilidad reducida'], texto: 'Sí, el local es accesible para sillas de ruedas y carritos.' },
      { claves: ['ingles', 'english', 'idioma'], texto: 'Te atendemos en español y en inglés.' },
      { claves: ['robot', ' ia ', 'inteligencia artificial', 'eres real', 'eres humano', 'quien eres', 'chatgpt', ' bot '], texto: 'Soy la versión de prueba del asistente. ' + CONTACTO, enlace: true },
      { claves: ['nova', 'quiero una web', 'quiero un chat', 'quiero una app', 'quien ha hecho'], texto: 'Esta web la ha preparado NOVA Marketing Solutions como ejemplo. Habla con nosotros en solutionsnova.es.', enlace: true },
      { claves: ['hola', 'buenas', 'buenos dias', 'hey'], texto: '¡Hola! ¿En qué te ayudo? Puedo contarte el horario, cómo reservar o qué hacemos.', debil: true },
      { claves: ['gracias', 'genial', 'perfecto', 'vale'], texto: '¡A ti! Si necesitas algo más, aquí estoy.', debil: true },
      { claves: ['adios', 'hasta luego', 'chao'], texto: '¡Hasta pronto! Que tengas un buen día.', debil: true }
    ];

    var COMUNES_EN = [
      { claves: ['book', 'booking', 'reserve', 'reservation', 'appointment', 'slot', 'spots', 'schedule'].concat(config.chat.clavesReserva || []), accion: 'reservar' },
      { claves: ['cancel', 'reschedule', 'change booking', 'move appointment', 'cant make it'], texto: 'You can easily reschedule or cancel through your confirmation link or by messaging us on WhatsApp.' },
      { claves: ['hours', 'time', 'when', 'open', 'close', 'saturday', 'sunday', 'holiday'], texto: 'Our operational hours are: ' + (config.horarioTextoEn || config.horarioTexto || 'Monday through Friday') + '. Special holiday notices are published on the website and app.' },
      { claves: ['where', 'address', 'location', 'directions', 'map', 'street', 'located'], texto: 'We are located in ' + (config.zona || 'the central district') + '. On a production client site, you would see the exact GPS location and interactive map.' },
      { claves: ['parking', 'bus', 'transit', 'drive', 'car'], texto: 'On a live client website, directions, parking options, and public transit stops are clearly indicated.' },
      { claves: ['price', 'pricing', 'cost', 'how much', 'fee', 'rate', 'membership'], texto: config.chat.precio || 'We provide clear, upfront pricing and written estimates before you start, with zero hidden fees.' },
      { claves: ['pay', 'payment', 'card', 'cash', 'financing', 'invoice', 'credit card'], texto: 'We accept credit/debit cards, digital payments, and cash with immediate itemized receipts.' },
      { claves: ['phone', 'call', 'whatsapp', 'contact', 'email', 'talk to human', 'real person'], texto: 'The fastest way to reach our live team is via WhatsApp or the direct contact button on the website.' },
      { claves: ['app', 'application', 'download', 'android', 'iphone', 'play store', 'app store'], texto: 'Yes! We offer a companion mobile app on Google Play and Apple App Store for bookings, notifications, and membership access.' },
      { claves: ['accessible', 'wheelchair', 'stroller', 'elevator'], texto: 'Yes, our premises are fully accessible for wheelchairs and strollers.' },
      { claves: ['spanish', 'language', 'english'], texto: 'We provide full customer assistance in both English and Spanish.' },
      { claves: ['bot', 'ai', 'artificial intelligence', 'are you human', 'who are you', 'chatgpt'], texto: 'I am the automated preview assistant, demonstrating instant customer response capabilities. ' + CONTACTO, enlace: true },
      { claves: ['nova', 'want a website', 'want an app', 'pricing for website', 'who made this'], texto: 'This showcase was built by NOVA Marketing Solutions. To get custom software, mobile apps, booking engines, or AI assistants for your business, tap "Tell us about your project" or chat with Sara on novasolutionsmkt.com.', enlace: true },
      { claves: ['hello', 'hi', 'hey', 'good morning', 'greetings'], texto: 'Hello! How can I help you today? I can answer questions about hours, services, or guide you through a booking right here.', debil: true },
      { claves: ['thank', 'thanks', 'perfect', 'great', 'awesome'], texto: 'You\'re welcome! Let me know if you need anything else.', debil: true },
      { claves: ['bye', 'goodbye', 'see you', 'cya'], texto: 'Goodbye! Have a wonderful day.', debil: true }
    ];

    var INTENCIONES = (esIngles ? [] : (config.chat.intenciones || [])).concat(esIngles ? COMUNES_EN : COMUNES_ES);

    var registro = $('[data-chat-registro]', chat);
    var entrada = $('[data-chat-entrada]', chat);
    var sinMovimiento = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var iniciado = false;
    var fallos = 0;
    var flujo = null;

    function burbuja(texto, quien, enlace) {
      var p = document.createElement('p');
      p.className = 'chat__msg chat__msg--' + quien;
      var etiqueta = document.createElement('span');
      etiqueta.className = 'solo-lectores';
      etiqueta.textContent = quien === 'bot' ? (esIngles ? 'Assistant: ' : 'Asistente: ') : (esIngles ? 'You: ' : 'Tú: ');
      p.append(etiqueta, document.createTextNode(texto));
      if (enlace) {
        var a = document.createElement('a');
        a.href = NOVA_FORM;
        a.textContent = esIngles ? 'Tell us about your project' : 'Cuéntanos tu proyecto';
        p.append(document.createTextNode('\n'), a);
      }
      registro.append(p);
      registro.scrollTop = registro.scrollHeight;
      return p;
    }

    function opciones(lista) {
      var caja = document.createElement('div');
      caja.className = 'chat__opciones';
      lista.forEach(function (opcion) {
        var boton = document.createElement('button');
        boton.type = 'button';
        boton.className = 'chat__sugerencia';
        boton.textContent = opcion.texto;
        boton.addEventListener('click', function () {
          if (caja.dataset.usada) return;
          caja.dataset.usada = '1';
          preguntar(opcion.texto, opcion.valor);
        });
        caja.append(boton);
      });
      registro.append(caja);
      registro.scrollTop = registro.scrollHeight;
    }

    function bot(texto, lista, enlace) {
      setTimeout(function () {
        burbuja(texto, 'bot', enlace);
        if (lista && lista.length) opciones(lista);
      }, sinMovimiento ? 0 : 400);
    }

    function patron(clave) {
      return (clave.charAt(0) === ' ' ? ' ' : '') + normalizar(clave).trim() + (clave.slice(-1) === ' ' ? ' ' : '');
    }

    function buscarIntencion(pregunta) {
      var limpia = normalizar(pregunta);
      var mejor = null;
      var mejorPuntos = 0;
      INTENCIONES.forEach(function (intencion) {
        var puntos = intencion.claves.filter(function (clave) { return limpia.indexOf(patron(clave)) !== -1; }).length;
        if (intencion.debil && puntos) puntos -= 0.5;
        if (puntos > mejorPuntos) { mejor = intencion; mejorPuntos = puntos; }
      });
      return mejor;
    }

    function empezarReserva() {
      flujo = { paso: 'motivo' };
      var promptTexto = esIngles
        ? "Let's book your appointment! Type 'cancel' anytime to exit. " + (config.chat.preguntaMotivo || 'What service would you like to book?')
        : '¡Vamos con tu reserva! Escribe «cancelar» si quieres dejarlo. ' + (config.chat.preguntaMotivo || '¿Para qué es?');
      bot(promptTexto, (config.motivos || []).map(function (m) { return { texto: m, valor: m }; }));
    }

    function pedirDia() {
      flujo.paso = 'dia';
      flujo.dias = proximosDiasAbiertos(6);
      var promptDia = esIngles
        ? (config.conHora ? 'Which day works best for you? Here are upcoming available dates:' : 'What date do you arrive?')
        : (config.conHora ? '¿Qué día te viene bien? Estos son los próximos días con huecos libres:' : '¿Qué día llegas?');
      bot(promptDia, flujo.dias.map(function (d, i) { return { texto: fechaCorta(d), valor: String(i) }; }));
    }

    function pedirHora() {
      flujo.paso = 'hora';
      var huecos = huecosDelDia(flujo.fecha);
      var salto = Math.max(1, Math.ceil(huecos.length / 10));
      var lista = huecos.filter(function (h, i) { return i % salto === 0; });
      var promptHora = esIngles
        ? 'What time works best? Here are open time slots:'
        : '¿A qué hora? Te enseño algunas de las libres:';
      bot(promptHora, lista.map(function (h) { return { texto: h, valor: h }; }));
    }

    function pasoDeReserva(texto, valor) {
      var limpia = normalizar(texto);
      if (/ (cancelar|salir|dejalo|olvidalo|nada|cancel|exit|quit|stop) /.test(limpia)) {
        flujo = null;
        bot(esIngles ? 'No problem at all! Let me know if I can help you with anything else.' : 'Sin problema, lo dejamos. ¿Te ayudo con otra cosa?');
        return;
      }
      if (flujo.paso === 'motivo') {
        var motivo = valor || config.motivos.find(function (m) { return limpia.indexOf(normalizar(m).trim()) !== -1 || normalizar(m).indexOf(limpia.trim()) !== -1; });
        if (!motivo) {
          bot(esIngles ? 'Please select one of the following options:' : 'No lo he entendido. Elige una de estas opciones:',
            config.motivos.map(function (m) { return { texto: m, valor: m }; }));
          return;
        }
        flujo.motivo = motivo;
        pedirDia();
      } else if (flujo.paso === 'dia') {
        var indice = valor != null ? Number(valor) : flujo.dias.findIndex(function (d) { return limpia.indexOf(normalizar(fechaCorta(d)).trim()) !== -1 || limpia.indexOf(' ' + d.getDate() + ' ') !== -1; });
        if (!(indice >= 0)) {
          bot(esIngles ? 'Please select one of these dates:' : 'Elige uno de estos días, por favor:',
            flujo.dias.map(function (d, i) { return { texto: fechaCorta(d), valor: String(i) }; }));
          return;
        }
        flujo.fecha = flujo.dias[indice];
        if (config.conHora) {
          pedirHora();
        } else {
          flujo.paso = 'nombre';
          bot(esIngles ? 'Under what name should I place the booking?' : '¿A nombre de quién hago la reserva?');
        }
      } else if (flujo.paso === 'hora') {
        var huecos = huecosDelDia(flujo.fecha);
        var hora = valor || huecos.find(function (h) { return limpia.indexOf(' ' + h.replace(':', ' ') + ' ') !== -1 || limpia.indexOf(' ' + Number(h.split(':')[0]) + ' ') !== -1; });
        if (!hora) { pedirHora(); return; }
        flujo.hora = hora;
        flujo.paso = 'nombre';
        bot(esIngles ? 'Under what name should I place the booking?' : '¿A nombre de quién la pongo?');
      } else if (flujo.paso === 'nombre') {
        var nombre = texto.trim().slice(0, 40);
        var confirmacion = esIngles
          ? 'All set! ' + resumenCita(flujo.motivo, flujo.fecha, flujo.hora, nombre) +
            '\nIn a live website, you would now receive confirmation via email or SMS. This is an interactive showcase.'
          : '¡Listo! ' + resumenCita(flujo.motivo, flujo.fecha, flujo.hora, nombre) +
            '\nEn la web real te llegaría ahora la confirmación por correo o WhatsApp. Esto es una demostración: no se ha guardado ni enviado nada.';
        bot(confirmacion);
        flujo = null;
      }
    }

    function preguntar(texto, valor) {
      if (!String(texto).trim()) return;
      burbuja(texto, 'yo');
      if (flujo) { pasoDeReserva(texto, valor); return; }
      var intencion = buscarIntencion(texto);
      if (!intencion) {
        fallos += 1;
        var err = esIngles
          ? 'That question is not programmed into this static preview. The full custom AI assistant that NOVA builds for your business engages in natural dialogue, answers questions from your catalog, and closes sales.' +
            (fallos > 1 ? '\nMeanwhile, you can reach out via WhatsApp.' : '\nTry one of the suggested prompts below.')
          : 'Esa pregunta no está en esta versión de prueba. El asistente que NOVA prepara para tu negocio mantiene una conversación de verdad y te ayuda a vender.' +
            (fallos > 1 ? '\nMientras, puedes escribirnos por WhatsApp.' : '\nPrueba con alguna de las preguntas de abajo.');
        bot(err, null, true);
        return;
      }
      fallos = 0;
      if (intencion.accion === 'reservar') { empezarReserva(); return; }
      bot(intencion.texto, null, intencion.enlace);
    }

    (config.chat.sugerencias || []).forEach(function (texto) {
      var boton = document.createElement('button');
      boton.type = 'button';
      boton.className = 'chat__sugerencia';
      boton.textContent = texto;
      boton.addEventListener('click', function () { preguntar(texto); });
      var caja = $('[data-chat-sugerencias]', chat);
      if (caja) caja.append(boton);
    });

    function abrir() {
      chat.hidden = false;
      abrirChat.setAttribute('aria-expanded', 'true');
      if (!iniciado) {
        iniciado = true;
        var saludo = config.chat.saludo || (esIngles ? 'Hello! How can I help you today?' : '¡Hola! ¿En qué te ayudo?');
        var avisoIntro = esIngles
          ? 'This is an interactive preview assistant. Feel free to ask common questions or request a booking.'
          : 'Esta es una versión de prueba, con respuestas básicas. Pregúntame lo típico o pídeme una reserva.';
        burbuja(saludo, 'bot');
        burbuja(avisoIntro, 'bot');
      }
      if (entrada) entrada.focus();
    }
    function cerrar() {
      chat.hidden = true;
      abrirChat.setAttribute('aria-expanded', 'false');
      abrirChat.focus();
    }

    abrirChat.addEventListener('click', function () { chat.hidden ? abrir() : cerrar(); });
    $$('[data-abrir-chat]').forEach(function (b) { b.addEventListener('click', abrir); });
    var btnCerrar = $('[data-chat-cerrar]', chat);
    if (btnCerrar) btnCerrar.addEventListener('click', cerrar);
    chat.addEventListener('keydown', function (evento) { if (evento.key === 'Escape') cerrar(); });
    var formChat = $('[data-chat-form]', chat);
    if (formChat) {
      formChat.addEventListener('submit', function (evento) {
        evento.preventDefault();
        preguntar(entrada.value);
        entrada.value = '';
      });
    }
  }

  // ---------- Aviso «Imagen creada con IA» ----------
  var portada = $('[data-fondo]');
  var credito = $('[data-credito-ia]');
  if (portada && credito) {
    var foto = new Image();
    foto.onload = function () { credito.hidden = false; };
    foto.src = portada.getAttribute('data-fondo');
  }

  // ---------- Vídeos de los proyectos ----------
  $$('[data-video]').forEach(function (boton) {
    boton.addEventListener('click', function () {
      var video = boton.previousElementSibling;
      if (video) {
        video.controls = true;
        boton.hidden = true;
        video.play();
        video.focus();
      }
    });
  });

  // ---------- Traducción automática del DOM cuando se visualiza en inglés ----------
  if (esIngles && typeof document !== 'undefined') {
    var traducir = function () {
      function walk(nodo) {
        if (nodo.nodeType === 3) {
          var t = nodo.nodeValue.trim();
          if (t && MAPA_TRADUCCION[t]) {
            nodo.nodeValue = nodo.nodeValue.replace(t, MAPA_TRADUCCION[t]);
          }
        } else if (nodo.nodeType === 1) {
          if (nodo.tagName === 'SCRIPT' || nodo.tagName === 'STYLE') return;
          var ph = nodo.getAttribute('placeholder');
          if (ph && MAPA_TRADUCCION[ph]) nodo.setAttribute('placeholder', MAPA_TRADUCCION[ph]);
          var al = nodo.getAttribute('aria-label');
          if (al && MAPA_TRADUCCION[al]) nodo.setAttribute('aria-label', MAPA_TRADUCCION[al]);
          if (nodo.tagName === 'A' && nodo.href && nodo.href.indexOf('solutionsnova.es') !== -1) {
            nodo.href = nodo.href.replace('solutionsnova.es', 'novasolutionsmkt.com');
          }
          for (var i = 0; i < nodo.childNodes.length; i++) {
            walk(nodo.childNodes[i]);
          }
        }
      }
      if (document.body) walk(document.body);
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', traducir);
    } else {
      traducir();
    }
  }

  window.demoNova = {
    NOVA_FORM: NOVA_FORM
  };
})();
