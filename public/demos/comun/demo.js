// Demos de NOVA: reserva online, avisos (WhatsApp y tiendas de apps), filtro de inmuebles y asistente de chat simulado.
// Sin servidor y sin IA: el chat reconoce palabras clave y lleva una reserva paso a paso. Nada sale del navegador.
// Cada página trae su configuración en <script type="application/json" id="demo-config"> (la escribe demos/generar.mjs).
(function () {
  'use strict';

  var nodoConfig = document.getElementById('demo-config');
  if (!nodoConfig) return;
  var config = JSON.parse(nodoConfig.textContent);

  var DIAS = ['domingos', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábados'];
  var NOVA_FORM = 'https://solutionsnova.es/?openBriefing=true';

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

  function fechaLarga(fecha) { return fecha.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }); }
  function fechaCorta(fecha) { return fecha.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' }); }

  function resumenCita(motivo, fecha, hora, nombre) {
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
      if (fecha && !huecos.length) avisoFecha.textContent = 'Los ' + DIAS[fecha.getDay()] + ' está cerrado. Elige otro día.';
      if (!campoHora) return;
      campoHora.innerHTML = '';
      if (!huecos.length) {
        campoHora.append(new Option(fecha ? 'Cerrado ese día' : 'Elige antes el día', ''));
        campoHora.disabled = true;
        return;
      }
      campoHora.disabled = false;
      campoHora.append(new Option('Elige una hora', ''));
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
        resultado.textContent = cerrado ? avisoFecha.textContent : 'Revisa los campos marcados para poder reservar.';
        resultado.classList.add('resultado--error');
        return;
      }
      var datos = new FormData(formulario);
      var extras = $$('[data-resumen]', formulario).map(function (campo) {
        var valor = datos.get(campo.name);
        return valor ? campo.getAttribute('data-resumen').replace('{v}', valor) : '';
      }).filter(Boolean);
      resultado.textContent = '¡Hecho, ' + String(datos.get('nombre')).trim().split(' ')[0] + '! ' +
        resumenCita(datos.get('motivo'), new Date(datos.get('fecha') + 'T12:00:00'), datos.get('hora'), '') +
        (extras.length ? ' (' + extras.join(', ') + ')' : '') +
        ' En la web real recibirías ahora la confirmación por correo. Esto es una demostración: no se ha enviado ningún dato.';
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
  var CONTACTO = '¿Quieres un asistente que converse de verdad con tus clientes y te ayude a cerrar ventas? Contacta con NOVA y lo preparamos para tu negocio.';

  // Respuestas comunes a todos los negocios; las propias de cada nicho (config.chat.intenciones) van antes.
  // «debil»: solo responde si no hay otra respuesta mejor (saludos, gracias…).
  var COMUNES = [
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
  var INTENCIONES = (config.chat.intenciones || []).concat(COMUNES);

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
    bot('¡Vamos con tu reserva! Escribe «cancelar» si quieres dejarlo. ' + (config.chat.preguntaMotivo || '¿Para qué es?'),
      config.motivos.map(function (m) { return { texto: m, valor: m }; }));
  }

  function pedirDia() {
    flujo.paso = 'dia';
    flujo.dias = proximosDiasAbiertos(6);
    bot(config.conHora ? '¿Qué día te viene bien? Estos son los próximos días con huecos libres:' : '¿Qué día llegas?',
      flujo.dias.map(function (d, i) { return { texto: fechaCorta(d), valor: String(i) }; }));
  }

  function pedirHora() {
    flujo.paso = 'hora';
    var huecos = huecosDelDia(flujo.fecha);
    var salto = Math.max(1, Math.ceil(huecos.length / 10));
    var lista = huecos.filter(function (h, i) { return i % salto === 0; });
    bot('¿A qué hora? Te enseño algunas de las libres:', lista.map(function (h) { return { texto: h, valor: h }; }));
  }

  function pasoDeReserva(texto, valor) {
    var limpia = normalizar(texto);
    if (/ (cancelar|salir|dejalo|olvidalo|nada) /.test(limpia)) {
      flujo = null;
      bot('Sin problema, lo dejamos. ¿Te ayudo con otra cosa?');
      return;
    }
    if (flujo.paso === 'motivo') {
      var motivo = valor || config.motivos.find(function (m) { return limpia.indexOf(normalizar(m).trim()) !== -1 || normalizar(m).indexOf(limpia.trim()) !== -1; });
      if (!motivo) { bot('No lo he entendido. Elige una de estas opciones:', config.motivos.map(function (m) { return { texto: m, valor: m }; })); return; }
      flujo.motivo = motivo;
      pedirDia();
    } else if (flujo.paso === 'dia') {
      var indice = valor != null ? Number(valor) : flujo.dias.findIndex(function (d) { return limpia.indexOf(normalizar(fechaCorta(d)).trim()) !== -1 || limpia.indexOf(' ' + d.getDate() + ' ') !== -1; });
      if (!(indice >= 0)) { bot('Elige uno de estos días, por favor:', flujo.dias.map(function (d, i) { return { texto: fechaCorta(d), valor: String(i) }; })); return; }
      flujo.fecha = flujo.dias[indice];
      if (config.conHora) pedirHora(); else { flujo.paso = 'nombre'; bot('¿A nombre de quién hago la reserva?'); }
    } else if (flujo.paso === 'hora') {
      var huecos = huecosDelDia(flujo.fecha);
      var hora = valor || huecos.find(function (h) { return limpia.indexOf(' ' + h.replace(':', ' ') + ' ') !== -1 || limpia.indexOf(' ' + Number(h.split(':')[0]) + ' ') !== -1; });
      if (!hora) { pedirHora(); return; }
      flujo.hora = hora;
      flujo.paso = 'nombre';
      bot('¿A nombre de quién la pongo?');
    } else if (flujo.paso === 'nombre') {
      var nombre = texto.trim().slice(0, 40);
      bot('¡Listo! ' + resumenCita(flujo.motivo, flujo.fecha, flujo.hora, nombre) +
        '\nEn la web real te llegaría ahora la confirmación por correo o WhatsApp. Esto es una demostración: no se ha guardado ni enviado nada.');
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
      bot('Esa pregunta no está en esta versión de prueba. El asistente que NOVA prepara para tu negocio mantiene una conversación de verdad y te ayuda a vender.' +
        (fallos > 1 ? '\nMientras, puedes escribirnos por WhatsApp.' : '\nPrueba con alguna de las preguntas de abajo.'), null, true);
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
      burbuja(config.chat.saludo, 'bot');
      burbuja('Esta es una versión de prueba, con respuestas básicas. Pregúntame lo típico o pídeme una reserva.', 'bot');
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

  // Para las pruebas automáticas: qué respondería el asistente a una frase (sin tocar la conversación)
  window.demoNova = { intencion: function (texto) { var i = buscarIntencion(texto); return i ? (i.accion || i.texto) : null; }, NOVA_FORM: NOVA_FORM };
})();
