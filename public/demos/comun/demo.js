// Demos de NOVA: reserva online, avisos (WhatsApp y tiendas de apps), filtro de inmuebles y asistente de chat simulado.
// Sin servidor y sin IA: el chat reconoce palabras clave y lleva una reserva paso a paso. Nada sale del navegador.
// Cada página trae su configuración en <script type="application/json" id="demo-config"> (la escribe demos/generar.mjs).
(function () {
  'use strict';

  var nodoConfig = document.getElementById('demo-config');
  if (!nodoConfig) return;
  var config = JSON.parse(nodoConfig.textContent);

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

  var DIAS = esIngles
    ? ['Sundays', 'Mondays', 'Tuesdays', 'Wednesdays', 'Thursdays', 'Fridays', 'Saturdays']
    : ['domingos', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábados'];
  var NOVA_FORM = esIngles
    ? 'https://novasolutionsmkt.com/?openBriefing=true'
    : 'https://solutionsnova.es/?openBriefing=true';

  function $(selector, raiz) { return (raiz || document).querySelector(selector); }
  function $$(selector, raiz) { return Array.prototype.slice.call((raiz || document).querySelectorAll(selector)); }

  function normalizar(texto) {
    return ' ' + String(texto).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9ñ]+/g, ' ').trim() + ' ';
  }

  function fechaISO(fecha) {
    return fecha.getFullYear() + '-' + String(fecha.getMonth() + 1).padStart(2, '0') + '-' + String(fecha.getDate()).padStart(2, '0');
  }
  function aMinutos(hora) { var p = hora.split(':'); return Number(p[0]) * 60 + Number(p[1]); }
  function aHora(minutos) { return String(Math.floor(minutos / 60)).padStart(2, '0') + ':' + String(minutos % 60).padStart(2, '0'); }

  function huecosDelDia(fecha) {
    var tramos = config.horario[String(fecha.getDay())] || [];
    var paso = config.minutosPorCita || 30;
    var huecos = [];
    tramos.forEach(function (tramo) {
      var fin = aMinutos(tramo[1]) || 24 * 60; // «00:00» al final es medianoche
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
    campoFecha.min = fechaISO(manana);
    campoFecha.max = fechaISO(limite);

    var rellenarHoras = function () {
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
    campoFecha.addEventListener('change', rellenarHoras);
    rellenarHoras();

    formulario.addEventListener('submit', function (evento) {
      evento.preventDefault();
      resultado.className = 'resultado';
      var cerrado = avisoFecha.textContent !== '';
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

  // Botones que eligen el motivo de la reserva desde otra sección (por ejemplo, «Pedir visita» de un inmueble)
  $$('[data-elegir]').forEach(function (boton) {
    boton.addEventListener('click', function () {
      var selector = formulario && $('select[name="motivo"]', formulario);
      if (selector) selector.value = boton.getAttribute('data-elegir');
    });
  });

  // ---------- Avisos: WhatsApp y tiendas de apps (en la demo explican qué harían) ----------
  var dialogo = $('#dialogo-aviso');
  $$('[data-aviso]').forEach(function (boton) {
    boton.addEventListener('click', function (evento) {
      var aviso = config.avisos[boton.getAttribute('data-aviso')];
      if (!dialogo || !aviso || typeof dialogo.showModal !== 'function') return;
      evento.preventDefault();
      $('[data-aviso-titulo]', dialogo).textContent = aviso.titulo;
      $('[data-aviso-texto]', dialogo).textContent = aviso.texto;
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
  if (!chat || !abrirChat) return;

  var negocio = config.negocio;
  var CONTACTO = esIngles
    ? 'Looking for an AI assistant that genuinely engages your clients and closes more bookings? Connect with NOVA Marketing Solutions to build yours.'
    : '¿Quieres un asistente que converse de verdad con tus clientes y te ayude a cerrar ventas? Contacta con NOVA y lo preparamos para tu negocio.';

  // Respuestas comunes a todos los negocios; las propias de cada nicho (config.chat.intenciones) van antes.
  // «debil»: solo responde si no hay otra respuesta mejor (saludos, gracias…).
  var COMUNES_ES = [
    { claves: ['reserv', 'cita', 'pedir hora', 'coger hora', 'apuntar', 'apuntarme', 'quiero ir', 'hueco', 'disponibilidad'].concat(config.chat.clavesReserva || []), accion: 'reservar' },
    { claves: ['anular', 'cancelar la', 'cancelar mi', 'cambiar la cita', 'cambiar mi', 'mover la', 'no puedo ir', 'no voy a poder'], texto: 'Puedes cambiarla o anularla desde el enlace del correo de confirmación o escribiéndonos por WhatsApp. Así el hueco le sirve a otra persona.' },
    { claves: ['horario', ' hora ', 'a que hora', 'abris', 'abierto', 'abre', 'cerrais', 'cierra', 'sabado', 'domingo', 'festivo', 'agosto', 'vacaciones'], texto: 'Nuestro horario es: ' + config.horarioTexto + '. Los festivos, avisamos en la web y en la app.' },
    { claves: ['donde', 'direccion', 'ubicacion', 'ubicados', 'llegar', 'como voy', 'mapa', 'barrio', 'calle'], texto: 'Estamos en ' + config.zona + ', Valladolid. En la web real aquí verías la dirección exacta y el mapa; como ' + config.articulo + ' es ficticia, no hay dirección.' },
    { claves: ['aparcar', 'aparcamiento', 'parking', 'autobus', 'bus ', 'transporte'], texto: 'En la web real te diríamos dónde aparcar y qué autobuses te dejan cerca. En esta demo no hay dirección real.' },
    { claves: ['precio', 'cuesta', 'cuanto', 'tarifa', 'presupuesto', ' caro', 'barato', 'coste'], texto: config.chat.precio || 'Te damos el presupuesto por escrito antes de empezar, sin compromiso, para que decidas con calma.' },
    { claves: ['pagar', ' pago', 'tarjeta', 'bizum', 'efectivo', 'financ', 'plazos', 'factura'], texto: 'Puedes pagar con tarjeta, Bizum o efectivo, y te damos factura. Si necesitas pagar a plazos, pregúntanos.' },
    { claves: ['telefono', 'llamar', 'whatsapp', 'contactar', 'contacto', 'correo', 'email', 'hablar con alguien', 'persona real'], texto: 'Lo más rápido es escribirnos por WhatsApp con el botón verde de la web y te contesta el equipo. En esta demo no hay número, porque el negocio es ficticio.' },
    { claves: [' app ', 'aplicacion', 'descargar', 'android', 'iphone', 'play store', 'google play', 'app store'], texto: '¡Sí! Tenemos app para Android y iPhone: reservas, avisos y todo lo tuyo en el móvil. Es un ejemplo de la app que NOVA puede crear para tu negocio, en Google Play y App Store.' },
    { claves: ['accesib', 'silla de ruedas', 'movilidad reducida', 'carrito', 'carro de bebe', 'ascensor'], texto: 'Sí, el local es accesible para sillas de ruedas y carritos.' },
    { claves: ['ingles', 'english', 'idioma', 'frances', 'portugues'], texto: 'Te atendemos en español y en inglés.' },
    { claves: ['trabajo', 'empleo', 'curriculum', ' cv ', 'trabajar con vosotros'], texto: 'Gracias por pensar en nosotros. Envíanos tu currículum por WhatsApp o por correo y lo tendremos en cuenta.' },
    { claves: ['robot', ' ia ', 'inteligencia artificial', 'eres real', 'eres humano', 'eres una persona', 'quien eres', 'chatgpt', ' bot ', 'que eres', 'como funcionas'], texto: 'Soy la versión de prueba del asistente, con respuestas básicas, para que veas cómo funciona. ' + CONTACTO, enlace: true },
    { claves: ['nova', 'quiero una web', 'quiero un chat', 'quiero una app', 'quien ha hecho', 'quien hizo', 'para mi negocio', 'algo asi', 'cuanto cuesta esta web'], texto: 'Esta web la ha preparado NOVA Marketing Solutions como ejemplo. Si quieres algo así para tu negocio (web, app, reservas o un asistente con IA que converse con tus clientes), cuéntanoslo en el formulario «Cuéntanos tu proyecto» o habla con Sara en solutionsnova.es.', enlace: true },
    { claves: ['hola', 'buenas', 'buenos dias', 'hey', 'saludos'], texto: '¡Hola! ¿En qué te ayudo? Puedo contarte el horario, cómo reservar o qué hacemos. También puedo hacerte la reserva aquí mismo.', debil: true },
    { claves: ['gracias', 'genial', 'perfecto', 'estupendo', 'vale'], texto: '¡A ti! Si necesitas algo más, aquí estoy.', debil: true },
    { claves: ['adios', 'hasta luego', 'chao', 'nos vemos'], texto: '¡Hasta pronto! Que tengas un buen día.', debil: true }
  ];

  var COMUNES_EN = [
    { claves: ['book', 'booking', 'reserve', 'reservation', 'appointment', 'slot', 'spots', 'schedule'].concat(config.chat.clavesReserva || []), accion: 'reservar' },
    { claves: ['cancel', 'reschedule', 'change booking', 'move appointment', 'cant make it'], texto: 'You can easily reschedule or cancel through your confirmation link or by messaging us on WhatsApp.' },
    { claves: ['hours', 'time', 'when', 'open', 'close', 'saturday', 'sunday', 'holiday'], texto: 'Our operational hours are: ' + (config.horarioTextoEn || config.horarioTexto) + '. Special holiday notices are published on the website and app.' },
    { claves: ['where', 'address', 'location', 'directions', 'map', 'street', 'located'], texto: 'We are located in ' + (config.zona || 'the central district') + '. On a production client site, you would see the exact GPS location and interactive map.' },
    { claves: ['parking', 'bus', 'transit', 'drive', 'car'], texto: 'On a live client website, directions, parking options, and public transit stops are clearly indicated.' },
    { claves: ['price', 'pricing', 'cost', 'how much', 'fee', 'rate', 'membership'], texto: config.chat.precioEn || config.chat.precio || 'We provide clear, upfront pricing and written estimates before you start, with zero hidden fees.' },
    { claves: ['pay', 'payment', 'card', 'cash', 'financing', 'invoice', 'credit card'], texto: 'We accept credit/debit cards, digital payments, and cash with immediate itemized receipts.' },
    { claves: ['phone', 'call', 'whatsapp', 'contact', 'email', 'talk to human', 'real person'], texto: 'The fastest way to reach our live team is via WhatsApp or the direct contact button on the website.' },
    { claves: ['app', 'application', 'download', 'android', 'iphone', 'play store', 'app store'], texto: 'Yes! We offer a companion mobile app on Google Play and Apple App Store for bookings, notifications, and membership access.' },
    { claves: ['accessible', 'wheelchair', 'stroller', 'elevator'], texto: 'Yes, our premises are fully accessible for wheelchairs and strollers.' },
    { claves: ['spanish', 'language', 'english'], texto: 'We provide full customer assistance in both English and Spanish.' },
    { claves: ['job', 'career', 'resume', 'cv', 'hiring', 'work with you'], texto: 'Thank you for your interest! Send your resume to our email or contact form and our team will review it.' },
    { claves: ['bot', 'ai', 'artificial intelligence', 'are you human', 'who are you', 'chatgpt'], texto: 'I am the automated preview assistant, demonstrating instant customer response capabilities. ' + CONTACTO, enlace: true },
    { claves: ['nova', 'want a website', 'want an app', 'pricing for website', 'who made this'], texto: 'This showcase was built by NOVA Marketing Solutions. To get custom software, mobile apps, booking engines, or AI assistants for your business, tap "Tell us about your project" or chat with Sara on novasolutionsmkt.com.', enlace: true },
    { claves: ['hello', 'hi', 'hey', 'good morning', 'greetings'], texto: 'Hello! How can I help you today? I can answer questions about hours, services, or guide you through a booking right here.', debil: true },
    { claves: ['thank', 'thanks', 'perfect', 'great', 'awesome'], texto: 'You\'re welcome! Let me know if you need anything else.', debil: true },
    { claves: ['bye', 'goodbye', 'see you', 'cya'], texto: 'Goodbye! Have a wonderful day.', debil: true }
  ];

  var INTENCIONES = (config.chat.intenciones || []).concat(esIngles ? COMUNES_EN : COMUNES_ES);

  var registro = $('[data-chat-registro]', chat);
  var entrada = $('[data-chat-entrada]', chat);
  var sinMovimiento = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var iniciado = false;
  var fallos = 0;
  var flujo = null; // reserva en curso dentro del chat: { paso, motivo, fecha, hora }

  function burbuja(texto, quien, enlace) {
    var p = document.createElement('p');
    p.className = 'chat__msg chat__msg--' + quien;
    var etiqueta = document.createElement('span');
    etiqueta.className = 'solo-lectores';
    etiqueta.textContent = quien === 'bot' ? 'Asistente: ' : 'Tú: ';
    p.append(etiqueta, document.createTextNode(texto));
    if (enlace) {
      var a = document.createElement('a');
      a.href = NOVA_FORM;
      a.textContent = 'Cuéntanos tu proyecto';
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

  // Una clave con espacio delante o detrás solo vale como palabra entera (« hora » no casa con «ahora»)
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

  // --- Reserva paso a paso ---
  function empezarReserva() {
    flujo = { paso: 'motivo' };
    var promptTexto = esIngles
      ? "Let's book your spot! Type 'cancel' anytime to exit. " + (config.chat.preguntaMotivoEn || 'What service would you like to book?')
      : '¡Vamos con tu reserva! Escribe «cancelar» si quieres dejarlo. ' + (config.chat.preguntaMotivo || '¿Para qué es?');
    bot(promptTexto, config.motivos.map(function (m) { return { texto: m, valor: m }; }));
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
        ? 'That specific question is not included in this static preview. The full custom AI assistant that NOVA deploys for your business engages in natural dialogue and closes sales.' +
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

  config.chat.sugerencias.forEach(function (texto) {
    var boton = document.createElement('button');
    boton.type = 'button';
    boton.className = 'chat__sugerencia';
    boton.textContent = texto;
    boton.addEventListener('click', function () { preguntar(texto); });
    $('[data-chat-sugerencias]', chat).append(boton);
  });

  function abrir() {
    chat.hidden = false;
    abrirChat.setAttribute('aria-expanded', 'true');
    if (!iniciado) {
      iniciado = true;
      var saludo = esIngles
        ? (config.chat.saludoEn || 'Hello! How can I help you today?')
        : config.chat.saludo;
      var avisoIntro = esIngles
        ? 'This is an interactive preview assistant. Feel free to ask common questions or request a booking.'
        : 'Esta es una versión de prueba, con respuestas básicas. Pregúntame lo típico o pídeme una reserva.';
      burbuja(saludo, 'bot');
      burbuja(avisoIntro, 'bot');
    }
    entrada.focus();
  }
  function cerrar() {
    chat.hidden = true;
    abrirChat.setAttribute('aria-expanded', 'false');
    abrirChat.focus();
  }

  abrirChat.addEventListener('click', function () { chat.hidden ? abrir() : cerrar(); });
  $$('[data-abrir-chat]').forEach(function (b) { b.addEventListener('click', abrir); });
  $('[data-chat-cerrar]', chat).addEventListener('click', cerrar);
  chat.addEventListener('keydown', function (evento) { if (evento.key === 'Escape') cerrar(); });
  $('[data-chat-form]', chat).addEventListener('submit', function (evento) {
    evento.preventDefault();
    preguntar(entrada.value);
    entrada.value = '';
  });

  // ---------- Aviso «Imagen creada con IA»: solo si la foto de fondo existe ----------
  var portada = $('[data-fondo]');
  var credito = $('[data-credito-ia]');
  if (portada && credito) {
    var foto = new Image();
    foto.onload = function () { credito.hidden = false; };
    foto.src = portada.getAttribute('data-fondo');
  }

  // ---------- Vídeos de los proyectos: se cargan solo al pulsar «ver» ----------
  $$('[data-video]').forEach(function (boton) {
    boton.addEventListener('click', function () {
      var video = boton.previousElementSibling;
      video.controls = true;
      boton.hidden = true;
      video.play();
      video.focus();
    });
  });

  // ---------- Traducción automática del DOM cuando se visualiza en inglés ----------
  if (esIngles && typeof document !== 'undefined') {
    var mapaTraduccion = {
      'Saltar al contenido': 'Skip to content',
      'Demostración de NOVA · negocio ficticio': 'NOVA Demonstration · Fictional Showcase',
      'Demostración de NOVA · negocios ficticios': 'NOVA Demonstration · Fictional Showcases',
      'El estudio no existe.': 'This showcase studio is fictional.',
      'Ninguno de estos negocios existe.': 'All businesses on this page are fictional showcases.',
      'Quiero una web así': 'I want a website like this',
      'Cuéntanos tu proyecto': 'Tell us about your project',
      'Clases y servicios': 'Classes & Services',
      'Servicios': 'Services',
      'Reservar': 'Book Online',
      'App': 'Mobile App',
      'Horario': 'Hours',
      'Preguntas': 'FAQ',
      'Preguntas frecuentes': 'Frequently Asked Questions',
      'Estudio de entrenamiento · La Rubia': 'Boutique Training Studio · Premium Fitness',
      'Entrena en Valladolid y reserva tu plaza desde el móvil': 'Elevate Your Training: Book Classes Straight From Your Phone',
      'Fuerza, entrenamiento funcional, yoga y pilates en grupos reducidos. Reserva tu clase, apúntate a la lista de espera y lleva tu cuota en la app.': 'Strength, functional conditioning, yoga, and pilates in small groups. Book classes, join automated waitlists, and manage your membership from the mobile app.',
      'Reserva tu clase de prueba': 'Book Your Free Trial Class',
      'Reserva tu cita': 'Book Your Appointment',
      'Grupos reducidos': 'Small groups',
      'Lista de espera automática': 'Automated waitlist',
      'Primera clase de prueba': 'First trial class included',
      'También en app: Google Play y App Store': 'Mobile App Preview: Google Play & App Store',
      'Diseño de ejemplo': 'Showcase Preview',
      'Clases de hoy': "Today's Schedule",
      'Buscar': 'Search',
      'Plazas libres': 'Open Spots',
      'Completa': 'Full',
      'Confirmada': 'Confirmed',
      'Hola, Dani': 'Hello, Alex',
      'Tu próxima clase': 'Next Class',
      'Funcional': 'Functional',
      'Mi cuota': 'My Membership',
      'Quedan 2 plazas en Yoga del martes': '2 spots left in Tuesday Yoga',
      'Imagen de ambiente creada con IA. Negocio y pantallas de ejemplo.': 'AI-generated background image. Sample business and showcase screens.',
      'Fuerza': 'Strength',
      'Técnica y progresión en grupos pequeños.': 'Form, technique, and progressive overload in focused small groups.',
      'Clases intensas para ganar forma física.': 'High-intensity athletic conditioning to build real endurance.',
      'Yoga': 'Yoga',
      'Movilidad, respiración y calma.': 'Mobility, breath control, and core alignment.',
      'Pilates': 'Pilates',
      'Core, postura y prevención de lesiones.': 'Core stabilization, posture control, and injury prevention.',
      'Entrenamiento personal': 'Personal Training',
      'Sesiones uno a uno con un plan para ti.': 'Tailored 1-on-1 sessions with an individual progression plan.',
      'App del socio': 'Member App',
      'Horarios, reservas, cuota y avisos en tu móvil.': 'Schedules, bookings, membership fees, and push alerts.',
      'Grupos reducidos y entrenadores que te corrigen y te siguen.': 'Small group workouts guided by coaches who track your progress.',
      'Elige el día y la hora': 'Pick Date & Time',
      'Día': 'Date',
      'Hora': 'Time',
      'Tu nombre': 'Full Name',
      'Teléfono': 'Phone Number',
      'Reservar plaza': 'Confirm Booking',
      'Enviar reserva': 'Submit Booking',
      '¿Tienes dudas antes de venir?': 'Questions before joining?',
      '¿Hay matrícula?': 'Is there an initiation fee?',
      'No, no cobramos matrícula ni exigimos permanencia.': 'No enrollment fees or mandatory contracts. Cancel anytime.',
      '¿Cómo funciona la lista de espera?': 'How does the automated waitlist work?',
      'Si una clase se llena, te apuntas en un clic. Cuando alguien cancela, la app te avisa y te guarda la plaza.': 'If a session fills up, tap to join the waitlist. When a slot opens, the app alerts you immediately.',
      '¿Qué necesito para la primera clase?': 'What should I bring for my first session?',
      'Ropa de deporte cómoda, zapatillas de entrenamiento limpias y una botella de agua. La toalla la ponemos nosotros.': 'Comfortable workout wear, clean gym sneakers, and a water bottle. Fresh towels are provided.',
      '¿Dónde aparcar?': 'Where can I park?',
      'Demos por sector': 'Industry Showcases',
      'Una web de ejemplo por cada sector': 'A sample showcase for every industry',
      'Ver todas las demos': 'See all showcases'
    };

    var traducir = function () {
      function walk(nodo) {
        if (nodo.nodeType === 3) {
          var t = nodo.nodeValue.trim();
          if (mapaTraduccion[t]) {
            nodo.nodeValue = nodo.nodeValue.replace(t, mapaTraduccion[t]);
          }
        } else if (nodo.nodeType === 1) {
          if (nodo.tagName === 'SCRIPT' || nodo.tagName === 'STYLE') return;
          var ph = nodo.getAttribute('placeholder');
          if (ph && mapaTraduccion[ph]) nodo.setAttribute('placeholder', mapaTraduccion[ph]);
          var al = nodo.getAttribute('aria-label');
          if (al && mapaTraduccion[al]) nodo.setAttribute('aria-label', mapaTraduccion[al]);
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

  // Para las pruebas automáticas: qué respondería el asistente a una frase (sin tocar la conversación)
  window.demoNova = { intencion: function (texto) { var i = buscarIntencion(texto); return i ? (i.accion || i.texto) : null; }, NOVA_FORM: NOVA_FORM };
})();
