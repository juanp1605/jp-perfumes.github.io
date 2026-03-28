// ============================================================
//  JP PERFUMES — backendperfumes.js
// ============================================================

const WA_NUMERO = "573136055622";

const PRECIOS = {
  normal: { '30ml': 20000, '60ml': 25000, '100ml': 30000 },
  nicho:  { '30ml': 25000, '60ml': 30000, '100ml': 35000 }
};

const CATALOGO = {
  femenina: [
    '212','212 SEXY','212 VIP','212 VIP ROSE','212 VIP ROSE RED','212 VIP WILD PARTY',
    '273 RODEO DRIVE','360','AMOR AMOR','ANGEL','BFF','BONBON','BRIGHT CRYSTAL','BURBERRY',
    'CAN CAN','CAN CAN BURLESQUE','CAROLINA HERRERA','CH','CH CENTRAL PARK','CHANEL #5',
    'CHANCE BY CHANEL','CHERRY IN THE AIR','CIELO','CLOUD','COCO CHANEL',
    'DAZZLE','DIAMANTES BLANCOS','FAMME','FANTASY','GAIA YAMBAL','GOOD GIRL',
    'HEIRESS','ISSEY MIYAKE','J ADORE','JEAN PAUL GAULTIER','LA VIE EST BELLE',
    'LADY MILLION','LIGHT BLUE','LOLITA LEMPICKA','MAD ABOUT YOU','MEOW','MOON SPARKIE',
    'NEXT GIRLFRIEND','OCEAN LOUNGE','OLYMPEA','OMNIA AMETHYSTE','OMNIA CORAL',
    'OMNIA CRISTAL','OMNIA PINK SAPPHIRE','OSADIA YAMBAL','PARIS HILTON','PASSPORT PARIS',
    'RALPH LAUREN','RIDE OR DIE','ROCK!','S BY SHAKIRA','SCANDAL','SELENA GOMEZ',
    'SOFIA VERGARA','SORBETTO ROSSO','TAJ SUNSET','THANK NEXT YOU','TOMMY',
    'TOUCH OF PINK','YES I AM'
  ],
  masculina: [
    '1 MILLION','1 MILLION INTENSE','1 MILLON LUCKY','212','212 AQUA','212 HEROES',
    '212 VIP','212 VIP BLACK','212 VIP BLACK RED','212 VIP WILD PARTY','212 VIP WINS',
    '360','360 RED','ACQUA DE GIO','ADRENALINE','ALLURE SPORT','ANGEL','ANIMALE',
    'ARSENAL','BAD BOY','BAD DIESEL','BALDESARINI AMBRE','BE A LEGEND',
    'BLACK XS','BLACK XS L\'EXCES','BLEU DE CHANEL','BLUE SEDUCTION','BLV BULGARI',
    'BOSS','BOSS ORANGE','BOSS THE SCENT','BOSS UNLIMITED','CH','CH AFRICA',
    'CH CENTRAL PARK','CLINIQUE HAPPY','DIESEL','DOLCE & GABBANA','DUCATI SPORT',
    'EAU DE FRAICHE','EMBLEM','EROS','EROS FLAME','ETERNITY','EXPLORER',
    'FACONNABLE','FAHRENHEIT','FUEL FOR LIFE','GIVENCHY BLUE','HEROD',
    'HUGO BOSS','HUGO BOSS ENERGISE','HUGO BOSS REVERSED','HUGO BOSS URBAN','HUGO RED',
    'INSURRECTION','INVICTUS','INVICTUS INTENSE','INVICTUS ONYX','INVICTUS VICTORY',
    'ISSEY MIYAKE','JEAN PUL GAULTIER (LE MALE)','K DOLCE GABANA',
    'L.12.12 BLANC','L.12.12 ENERGIZED','L.12.12 NOIR','L\'EAU D\'ISSEY SHADE OF LAGOON',
    'LACOSTE RED','LAPIDUS','LEGACY (CR)','LEGEND','LEGENDARY HARLEY DAVIDSON',
    'LIGHT BLUE','LOEWE 7','MERCEDES BENZ CLUB','NAUTICA VOYAGE','PARIS HILTON',
    'PHANTOM','POLO BLUE','POLO RED','POLO SPORT','PURE XS','SAUVAGE',
    'SILVER MOUNTAIN WATER','SOLO THE LOWEN','SPIRIT OF THE BRAVE','STAR WEALKER',
    'SWISS ARMY','TEMPTATION','TOMMY','ULTRA MALE','ZLATAN'
  ],
  nichos: {
    masculino: [
      'CHEZ BOND 9',"L'AVENTURE","L'IMMENSITE",'STRONGER WITH YOU LEATHER','TOY BOY'
    ],
    femenino: [
      'CRAZY IN LOVE','IL ROSSO',"LOVE DON'T BE SHY",'ROSE ALBA','ROSES MUSK','TOY 2','YARA'
    ],
    unisex: [
      'AHLI VEGA','AMBER OUD GOLD EDITION','ARABIANS TONKA','ATOMIC ROSE',
      'BACCARAT ROUGE 540',"BAL D'AFRIQUE",'BERGAMOTE 22','CALIFORNIA DREAM',
      'CEDRAT BOISE','CLUB THE NUIT','FAKHAR AL OUD','FRUITS OFO THE MUSK',
      'GOLDE OUD','HARAMAIN AMBER OUD','IL EGO','IL EROTIQUE','IL FEMME','IL ORGASME',
      'ILMIN MEXICO','INTENSE CAFE','ITALICA2021','KALAN','KHAMRAH','KHALIS OUDI',
      'LATAFFA AMATYSTA','LATAFFA ASAD','LATAFFA BADE OUD HONORY',
      'LATAFFA OUD FOR GLORY','LATAFFA SUBLIME','MANCERA INSTANT CRUSH',
      'MUSK AL RAHEEQ','NEROLI PORTOFINO','OMBRE NOMADE','OUD LAI MALEKI',
      'OUD MOOD','RAGHBA','REHAB','ROSE NIGTH','SANTAL 33','SHEIK AL SHUYUKH',
      'SONG OF OUD','STARRY NIGHTS','TABACCO VANILLE','TELEA','TOY 2 BUBBLE GUM',
      'TOY 2 PEARL','TUSCAN LEATHER'
    ]
  }
};

// ============================================================
//  ESTADO
// ============================================================
let seleccionados = { femenina: new Set(), masculina: new Set(), nichos: new Set() };
let tabActual = 'femenina';
let subtabActual = 'masc-nicho';
let pendienteTamanos = [];
let tamanosPendientes = {};
let tipoLinea = 'normal';
let carrito = [];

// ============================================================
//  RENDER CATÁLOGO
// ============================================================
function renderCatalogo() {
  renderGrid('grid-femenina',     CATALOGO.femenina,        'femenina',  'normal');
  renderGrid('grid-masculina',    CATALOGO.masculina,       'masculina', 'normal');
  renderGrid('grid-masc-nicho',   CATALOGO.nichos.masculino,'nichos',    'nicho');
  renderGrid('grid-fem-nicho',    CATALOGO.nichos.femenino, 'nichos',    'nicho');
  renderGrid('grid-unisex-nicho', CATALOGO.nichos.unisex,   'nichos',    'nicho');

  // Delegación de eventos — evita problemas con apóstrofes en onclick
  document.querySelectorAll('.catalogo-grid').forEach(grid => {
    grid.addEventListener('click', function(e) {
      const item = e.target.closest('.cat-item');
      if (!item) return;
      toggleSeleccion(item.dataset.nombre, item.dataset.linea, item);
    });
  });
}

function renderGrid(gridId, lista, linea, tipo) {
  const grid = document.getElementById(gridId);
  if (!grid) return;
  grid.innerHTML = lista.map(nombre => {
    const safe = nombre.replace(/"/g, '&quot;');
    return `<div class="cat-item" data-nombre="${safe}" data-linea="${linea}" data-tipo="${tipo}">
      <div class="cat-check">✓</div>
      <span class="cat-nombre">${nombre}</span>
    </div>`;
  }).join('');
}

// ============================================================
//  SELECCIÓN
// ============================================================
function toggleSeleccion(nombre, linea, el) {
  const set = seleccionados[linea];
  if (set.has(nombre)) {
    set.delete(nombre);
    el.classList.remove('seleccionado');
  } else {
    set.add(nombre);
    el.classList.add('seleccionado');
  }
  actualizarBarra(linea);
}

function actualizarBarra(linea) {
  const n = seleccionados[linea].size;
  const bar   = document.getElementById('bar-' + linea);
  const count = document.getElementById('count-' + linea);
  count.textContent = n === 0 ? '0 fragancias seleccionadas'
    : n === 1 ? '1 fragancia seleccionada'
    : n + ' fragancias seleccionadas';
  if (n > 0) bar.classList.add('activa');
  else bar.classList.remove('activa');
}

// ============================================================
//  TABS
// ============================================================
function cambiarTab(tab) {
  tabActual = tab;
  document.querySelectorAll('.tab-btn').forEach((b, i) => {
    b.classList.toggle('active', ['femenina','masculina','nichos'][i] === tab);
  });
  document.querySelectorAll('.catalogo-section').forEach(s => s.classList.remove('active'));
  document.getElementById('cat-' + tab).classList.add('active');
  document.getElementById('buscador').value = '';
}

function cambiarSubtab(sub, btn) {
  subtabActual = sub;
  document.querySelectorAll('.subtab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.subtab-content').forEach(c => c.classList.remove('active'));
  document.getElementById('grid-' + sub).classList.add('active');
}

// ============================================================
//  BUSCADOR
// ============================================================
function filtrarCatalogo() {
  const q = document.getElementById('buscador').value.toLowerCase().trim();
  const grids = {
    femenina:  ['grid-femenina'],
    masculina: ['grid-masculina'],
    nichos:    ['grid-masc-nicho','grid-fem-nicho','grid-unisex-nicho']
  };
  (grids[tabActual] || []).forEach(id => {
    const grid = document.getElementById(id);
    if (!grid) return;
    grid.querySelectorAll('.cat-item').forEach(item => {
      const nombre = item.querySelector('.cat-nombre').textContent.toLowerCase();
      item.style.display = (!q || nombre.includes(q)) ? '' : 'none';
    });
  });
}

// ============================================================
//  MODAL TAMAÑO MÚLTIPLE
// ============================================================
function pedirSeleccion(linea) {
  const set = seleccionados[linea];
  if (set.size === 0) return;
  tipoLinea = linea === 'nichos' ? 'nicho' : 'normal';
  pendienteTamanos = Array.from(set);
  tamanosPendientes = {};

  const precios = PRECIOS[tipoLinea];
  const lista = document.getElementById('multiTamanoLista');

  lista.innerHTML = pendienteTamanos.map(nombre => `
    <div class="multi-item">
      <div class="multi-nombre">${nombre}</div>
      <div class="tamano-btns">
        ${Object.entries(precios).map(([ml, precio]) => `
          <button class="tamano-btn" data-nombre="${nombre.replace(/"/g,'&quot;')}" data-ml="${ml}" onclick="elegirTamano(this)">
            ${ml}
            <span class="tamano-precio">${formatPeso(precio)}</span>
          </button>
        `).join('')}
      </div>
    </div>
  `).join('');

  document.getElementById('modalMultiTamano').classList.add('visible');
}

function elegirTamano(btn) {
  const nombre = btn.dataset.nombre;
  const ml = btn.dataset.ml;
  btn.closest('.tamano-btns').querySelectorAll('.tamano-btn').forEach(b => b.classList.remove('activo'));
  btn.classList.add('activo');
  tamanosPendientes[nombre] = ml;
}

function cerrarMultiTamano() {
  document.getElementById('modalMultiTamano').classList.remove('visible');
}

function confirmarMultiTamano() {
  const precios = PRECIOS[tipoLinea];
  let sinTamano = [];

  pendienteTamanos.forEach(nombre => {
    const ml = tamanosPendientes[nombre];
    if (!ml) { sinTamano.push(nombre); return; }
    const precio = precios[ml];
    const key = nombre + '_' + ml;
    const existente = carrito.find(i => i.key === key);
    if (existente) existente.qty++;
    else carrito.push({ key, nombre, talla: ml, precio, qty: 1 });
  });

  if (sinTamano.length > 0) {
    mostrarToast('Falta tamaño: ' + sinTamano.slice(0,2).join(', ') + (sinTamano.length > 2 ? '...' : ''));
    return;
  }

  const linea = tipoLinea === 'nicho' ? 'nichos' : tabActual;
  seleccionados[linea].clear();
  document.querySelectorAll('.cat-item.seleccionado').forEach(el => el.classList.remove('seleccionado'));
  actualizarBarra(linea);

  cerrarMultiTamano();
  actualizarCarrito();
  mostrarToast(pendienteTamanos.length + ' fragancia(s) agregada(s) ✓');
  toggleCarrito();
}

// ============================================================
//  CARRITO
// ============================================================
function actualizarCarrito() {
  const totalItems = carrito.reduce((s, i) => s + i.qty, 0);
  const totalPesos = carrito.reduce((s, i) => s + i.precio * i.qty, 0);

  document.getElementById('cartBadge').textContent = totalItems;

  const container = document.getElementById('cartItems');
  const footer    = document.getElementById('cartFooter');
  const totalEl   = document.getElementById('cartTotal');

  if (carrito.length === 0) {
    container.innerHTML = '<p class="cart-empty">Tu carrito está vacío</p>';
    footer.style.display = 'none';
    return;
  }

  footer.style.display = 'block';
  totalEl.textContent = formatPeso(totalPesos);

  container.innerHTML = carrito.map(item => `
    <div class="cart-item">
      <div class="cart-item-info">
        <div class="cart-item-name">${item.nombre}</div>
        <div class="cart-item-talla">${item.talla}</div>
      </div>
      <div class="cart-item-qty">
        <button class="qty-btn" onclick="cambiarCantidad('${item.key}',-1)">−</button>
        <span class="qty-num">${item.qty}</span>
        <button class="qty-btn" onclick="cambiarCantidad('${item.key}',1)">+</button>
      </div>
      <div class="cart-item-precio">${formatPeso(item.precio * item.qty)}</div>
    </div>
  `).join('');
}

function cambiarCantidad(key, delta) {
  const item = carrito.find(i => i.key === key);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) carrito = carrito.filter(i => i.key !== key);
  actualizarCarrito();
}

function toggleCarrito() {
  document.getElementById('cartPanel').classList.toggle('open');
  document.getElementById('cartOverlay').classList.toggle('visible');
}

// ============================================================
//  CHECKOUT
// ============================================================
function abrirCheckout() {
  if (carrito.length === 0) return;
  document.getElementById('cartPanel').classList.remove('open');
  document.getElementById('cartOverlay').classList.remove('visible');

  const total = carrito.reduce((s, i) => s + i.precio * i.qty, 0);
  const items = carrito.map(i =>
    `<div class="resumen-item"><span>${i.nombre} ${i.talla} ×${i.qty}</span><span>${formatPeso(i.precio * i.qty)}</span></div>`
  ).join('');

  document.getElementById('modalResumen').innerHTML =
    items + `<div class="resumen-total"><span>Total</span><span>${formatPeso(total)}</span></div>`;
  document.getElementById('modalOverlay').classList.add('visible');
}

function cerrarCheckout() {
  document.getElementById('modalOverlay').classList.remove('visible');
}

document.getElementById('modalOverlay').addEventListener('click', function(e) {
  if (e.target === this) cerrarCheckout();
});

document.getElementById('modalMultiTamano').addEventListener('click', function(e) {
  if (e.target === this) cerrarMultiTamano();
});

// ============================================================
//  WHATSAPP
// ============================================================
function enviarPedido() {
  const nombre    = document.getElementById('fNombre').value.trim();
  const telefono  = document.getElementById('fTelefono').value.trim();
  const direccion = document.getElementById('fDireccion').value.trim();
  const nota      = document.getElementById('fNota').value.trim();

  if (!nombre)    { resaltarCampo('fNombre',   'Ingresa tu nombre');    return; }
  if (!telefono)  { resaltarCampo('fTelefono', 'Ingresa tu teléfono'); return; }
  if (!direccion) { resaltarCampo('fDireccion','Ingresa tu dirección'); return; }

  const total  = carrito.reduce((s, i) => s + i.precio * i.qty, 0);
  const lineas = carrito.map(i =>
    '   • ' + i.nombre + ' ' + i.talla + ' ×' + i.qty + ' = ' + formatPeso(i.precio * i.qty)
  ).join('\n');
  const fecha = new Date().toLocaleString('es-CO', { dateStyle:'short', timeStyle:'short' });

  const mensaje =
'🛍️ *NUEVO PEDIDO — JP Perfumes*\n' +
'━━━━━━━━━━━━━━━━━━━━\n\n' +
'📦 *Productos:*\n' + lineas + '\n\n' +
'💰 *Total: ' + formatPeso(total) + '*\n\n' +
'━━━━━━━━━━━━━━━━━━━━\n' +
'👤 *Datos del cliente*\n' +
'• Nombre: ' + nombre + '\n' +
'• Teléfono: ' + telefono + '\n' +
'• Dirección: ' + direccion +
(nota ? '\n• Nota: ' + nota : '') + '\n\n' +
'🕐 Fecha: ' + fecha;

  window.open('https://wa.me/' + WA_NUMERO + '?text=' + encodeURIComponent(mensaje), '_blank');

  cerrarCheckout();
  carrito = [];
  actualizarCarrito();
  ['fNombre','fTelefono','fDireccion','fNota'].forEach(id => document.getElementById(id).value = '');
  mostrarToast('¡Pedido enviado por WhatsApp! ✓');
}

// ============================================================
//  HELPERS
// ============================================================
function formatPeso(n) {
  return '$' + n.toLocaleString('es-CO');
}

function resaltarCampo(id, msg) {
  const el = document.getElementById(id);
  el.style.borderColor = '#c0392b';
  el.placeholder = msg;
  el.focus();
  setTimeout(() => { el.style.borderColor = ''; el.placeholder = ''; }, 2000);
}

function mostrarToast(msg) {
  let t = document.querySelector('.toast');
  if (!t) { t = document.createElement('div'); t.className = 'toast'; document.body.appendChild(t); }
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2800);
}

// ============================================================
//  INIT
// ============================================================
renderCatalogo();
actualizarCarrito();
