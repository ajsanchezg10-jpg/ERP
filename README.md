(function() {
  var config = {
    apiKey: "AIzaSyBhUDrgwIW4L7YqePidRdBnVLDzn3aHNX0",
    authDomain: "erp-constructora.firebaseapp.com",
    projectId: "erp-constructora",
    storageBucket: "erp-constructora.firebasestorage.app",
    messagingSenderId: "917410598919",
    appId: "1:917410598919:web:a7d4b790644564438bdaa2"
  };
  if (!firebase.apps.length) {
    firebase.initializeApp(config);
  }
  window.db = firebase.firestore();
})();

var db;
document.addEventListener("DOMContentLoaded", function(){ db = window.db; });

// ── USERS ──────────────────────────────────────────
const USERS = {
  admin:{ pass:'constructora2026', name:'Administrador', initials:'AD' },
  dueno:{ pass:'dueno2026', name:'Dueño', initials:'DU' }
};
function doLogin(){
  const u=document.getElementById('l-user').value.trim().toLowerCase();
  const p=document.getElementById('l-pass').value;
  const err=document.getElementById('login-err');
  if(USERS[u]&&USERS[u].pass===p){
    err.style.display='none';
    sessionStorage.setItem('erp-user',u);
    document.getElementById('av-name').textContent=USERS[u].name;
    document.getElementById('av-initials').textContent=USERS[u].initials;
    document.getElementById('login-wrap').style.display='none';
    document.getElementById('app-wrap').style.display='block';
    initApp();
  } else { err.style.display='block'; }
};
function doLogout(){
  sessionStorage.removeItem('erp-user');
  document.getElementById('login-wrap').style.display='flex';
  document.getElementById('app-wrap').style.display='none';
};

// ── STATE ──────────────────────────────────────────
let S={ productos:[], movimientos:[], transacciones:[], facturas:[], proveedores:[], proyectos:[], clientes:[], oc:[], personal:[], filtCat:'todos' };

// ── FIREBASE ──────────────────────────────────────────
function initApp(){
  db = window.db;
  ['productos','movimientos','transacciones','facturas','proveedores','proyectos','clientes','oc','personal'].forEach(col=>{
    db.collection(col).onSnapshot(snap=>{
      S[col]=snap.docs.map(d=>({id:d.id,...d.data()}));
      if(['movimientos','transacciones','oc'].includes(col)) S[col].sort((a,b)=>(b.ts||0)-(a.ts||0));
      renderAll();
    });
  });
}
async function dbAdd(col,data){ return db.collection(col).add({...data,ts:Date.now()}); }
async function dbDel(col,id){ return db.collection(col).doc(id).delete(); }
async function dbUp(col,id,data){ return db.collection(col).doc(id).update(data); }

// ── NAV ──────────────────────────────────────────
function go(p,el){
  document.querySelectorAll('.page').forEach(x=>x.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(x=>x.classList.remove('active'));
  document.getElementById('page-'+p).classList.add('active');
  if(el)el.classList.add('active');
  const t={dashboard:'Dashboard',proyectos:'Proyectos / Obras',clientes:'Clientes',inventario:'Inventario',movimientos:'Movimientos',oc:'Órdenes de Compra',proveedores:'Proveedores',finanzas:'Finanzas',facturas:'Facturas',personal:'Personal',alertas:'Alertas'};
  document.getElementById('topbar-title').textContent=t[p]||p;
  closeSidebar(); renderAll();
};
function toggleSidebar(){const s=document.getElementById('sidebar');s.classList.toggle('open');document.getElementById('overlay').style.display=s.classList.contains('open')?'block':'none';};
function closeSidebar(){document.getElementById('sidebar').classList.remove('open');document.getElementById('overlay').style.display='none';};

// ── TOAST ──────────────────────────────────────────
function toast(msg,color){const t=document.getElementById('toast');t.textContent=msg;t.style.borderLeftColor=color||'var(--teal)';t.classList.add('show');setTimeout(()=>t.classList.remove('show'),3000);};

// ── HELPERS ──────────────────────────────────────────
function vv(id){const el=document.getElementById(id);return el?el.value.trim():'';}
function vi(id){return parseInt(document.getElementById(id)?.value)||0;}
function vf(id){return parseFloat(document.getElementById(id)?.value)||0;}
function hoy(){return new Date().toLocaleDateString('es-CL');}
function fmt(n){return '$'+Math.round(n).toLocaleString('es-CL');};
function fmtN(n){return Math.round(n).toLocaleString('es-CL');}
function empty(icon,txt){return `<div class="empty"><div class="empty-icon">${icon}</div><div class="empty-text">${txt}</div></div>`;}
function sumTx(tipo){return S.transacciones.filter(t=>t.tipo===tipo).reduce((a,t)=>a+t.monto,0);}
function gastoProyecto(proyNom){return S.transacciones.filter(t=>t.proyecto===proyNom&&t.tipo==='egreso').reduce((a,t)=>a+t.monto,0)+S.oc.filter(o=>o.proyecto===proyNom&&o.estado==='recibida').reduce((a,o)=>a+o.monto,0);}
function semaforo(pct){if(pct>=90)return'sem-red';if(pct>=70)return'sem-amber';return'sem-green';}
function rendColor(pct){if(pct>=90)return'var(--red)';if(pct>=70)return'var(--amber)';return'var(--green)';}
function ocCount(provId){return S.oc.filter(o=>o.proveedorId===provId).length;}

// ── FORMS ──────────────────────────────────────────
function openForm(tipo){
  const box=document.getElementById('form-box');
  const pOpts=S.productos.map(p=>`<option value="${p.id}">${p.nombre} (stock: ${p.stock})</option>`).join('');
  const proyOpts='<option value="">Sin proyecto</option>'+S.proyectos.map(p=>`<option value="${p.id}">${p.nombre}</option>`).join('');
  const provOpts='<option value="">Sin proveedor</option>'+S.proveedores.map(p=>`<option value="${p.id}">${p.empresa}</option>`).join('');
  const perOpts=S.personal.map(p=>`<option value="${p.nombre}">${p.nombre} (${p.cargo})</option>`).join('');
  const cliOpts='<option value="">Sin cliente</option>'+S.clientes.map(c=>`<option value="${c.id}">${c.empresa}</option>`).join('');

  const forms={
    producto:`<div class="form-title">📦 Agregar producto a bodega</div>
    <div class="form-grid">
      <div class="form-group"><label>Nombre *</label><input id="f-nom" placeholder="Ej: Cemento 25kg, Taladro Bosch"></div>
      <div class="form-row">
        <div class="form-group"><label>Categoría *</label>
          <select id="f-cat">
            <option value="material">Material construcción</option>
            <option value="herramienta">Herramienta</option>
            <option value="equipo">Equipo</option>
            <option value="reventa">Para reventa</option>
          </select>
        </div>
        <div class="form-group"><label>Unidad</label>
          <select id="f-uni"><option>unidades</option><option>kg</option><option>m²</option><option>m³</option><option>litros</option><option>metros</option><option>sacos</option><option>toneladas</option><option>planchas</option></select>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>Stock actual</label><input id="f-stk" type="number" min="0" placeholder="0"></div>
        <div class="form-group"><label>Stock mínimo</label><input id="f-min" type="number" min="0" placeholder="5"></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>Precio de compra (CLP)</label><input id="f-pcompra" type="number" min="0" placeholder="0"></div>
        <div class="form-group"><label>Precio de venta (CLP)</label><input id="f-pventa" type="number" min="0" placeholder="0"></div>
      </div>
      <div class="form-group"><label>Proveedor habitual</label><select id="f-prov-p">${provOpts}</select></div>
      <div class="form-actions"><button class="btn btn-ghost" onclick="closeForm()">Cancelar</button><button class="btn btn-primary" onclick="saveProd()">Guardar</button></div>
    </div>`,

    movimiento:`<div class="form-title">🔄 Registrar movimiento de bodega</div>
    <div class="form-grid">
      <div class="form-group"><label>Tipo *</label>
        <select id="f-tmov">
          <option value="entrada">📥 Entrada (llegó a bodega)</option>
          <option value="salida">📤 Salida (usado en obra)</option>
          <option value="venta">💰 Venta de material</option>
        </select>
      </div>
      <div class="form-group"><label>Producto *</label><select id="f-pmov">${pOpts||'<option disabled>Sin productos</option>'}</select></div>
      <div class="form-row">
        <div class="form-group"><label>Cantidad *</label><input id="f-cmov" type="number" min="1" placeholder="0"></div>
        <div class="form-group"><label>Precio unitario (CLP)</label><input id="f-pumov" type="number" min="0" placeholder="Auto"></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>Proyecto</label><select id="f-promov">${proyOpts}</select></div>
        <div class="form-group"><label>Responsable</label><select id="f-rmov"><option value="">—</option>${perOpts}</select></div>
      </div>
      <div class="form-group"><label>Notas</label><input id="f-nmov" placeholder="Proveedor, motivo, observación..."></div>
      <div class="form-actions"><button class="btn btn-ghost" onclick="closeForm()">Cancelar</button><button class="btn btn-primary" onclick="saveMov()">Registrar</button></div>
    </div>`,

    proyecto:`<div class="form-title">🏗 Nueva obra / proyecto</div>
    <div class="form-grid">
      <div class="form-row">
        <div class="form-group"><label>Nombre de la obra *</label><input id="f-pnom" placeholder="Ej: Edificio Las Condes"></div>
        <div class="form-group"><label>Cliente</label><select id="f-pcli">${cliOpts}</select></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>Fecha inicio</label><input id="f-pinicio" type="date"></div>
        <div class="form-group"><label>Fecha término</label><input id="f-pfin" type="date"></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>Presupuesto nominal (CLP) *</label><input id="f-ppres" type="number" min="0" placeholder="0"></div>
        <div class="form-group"><label>Progreso % (0-100)</label><input id="f-ppct" type="number" min="0" max="100" placeholder="0"></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>Jefe de obra</label><select id="f-pjefe"><option value="">—</option>${perOpts}</select></div>
        <div class="form-group"><label>Estado</label>
          <select id="f-pest"><option value="activo">Activo</option><option value="pausado">Pausado</option><option value="terminado">Terminado</option></select>
        </div>
      </div>
      <div class="form-group"><label>Descripción</label><input id="f-pdesc" placeholder="Resumen de la obra..."></div>
      <div class="form-actions"><button class="btn btn-ghost" onclick="closeForm()">Cancelar</button><button class="btn btn-primary" onclick="saveProy()">Crear obra</button></div>
    </div>`,

    cliente:`<div class="form-title">👤 Agregar cliente</div>
    <div class="form-grid">
      <div class="form-group"><label>Empresa / Persona *</label><input id="f-cemp" placeholder="Nombre empresa o persona"></div>
      <div class="form-row">
        <div class="form-group"><label>Contacto</label><input id="f-ccon" placeholder="Nombre contacto"></div>
        <div class="form-group"><label>Teléfono</label><input id="f-ctel" placeholder="+56 9..."></div>
      </div>
      <div class="form-group"><label>Email</label><input id="f-cmail" type="email" placeholder="email@empresa.cl"></div>
      <div class="form-group"><label>RUT</label><input id="f-crut" placeholder="12.345.678-9"></div>
      <div class="form-actions"><button class="btn btn-ghost" onclick="closeForm()">Cancelar</button><button class="btn btn-primary" onclick="saveCliente()">Guardar</button></div>
    </div>`,

    oc:`<div class="form-title">🛒 Nueva Orden de Compra</div>
    <div class="form-grid">
      <div class="form-row">
        <div class="form-group"><label>N° OC *</label><input id="f-ocnum" placeholder="OC-001"></div>
        <div class="form-group"><label>Proveedor *</label><select id="f-ocprov">${provOpts}</select></div>
      </div>
      <div class="form-group"><label>Producto / Descripción *</label><input id="f-ocprod" placeholder="Ej: Cemento 25kg x 50 sacos"></div>
      <div class="form-row">
        <div class="form-group"><label>Cantidad *</label><input id="f-occant" type="number" min="1" placeholder="0"></div>
        <div class="form-group"><label>Precio unitario (CLP) *</label><input id="f-ocpu" type="number" min="0" placeholder="0"></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>Proyecto</label><select id="f-ocproy">${proyOpts}</select></div>
        <div class="form-group"><label>Fecha requerida</label><input id="f-ocfech" type="date"></div>
      </div>
      <div class="form-group"><label>Notas</label><input id="f-ocnotas" placeholder="Especificaciones, condiciones..."></div>
      <div class="form-actions"><button class="btn btn-ghost" onclick="closeForm()">Cancelar</button><button class="btn btn-primary" onclick="saveOC()">Crear OC</button></div>
    </div>`,

    transaccion:`<div class="form-title">💰 Nueva transacción financiera</div>
    <div class="form-grid">
      <div class="form-row">
        <div class="form-group"><label>Tipo *</label>
          <select id="f-ttx"><option value="ingreso">📈 Ingreso</option><option value="egreso">📉 Egreso</option></select>
        </div>
        <div class="form-group"><label>Proyecto</label><select id="f-protx">${proyOpts}</select></div>
      </div>
      <div class="form-group"><label>Descripción *</label><input id="f-dtx" placeholder="Ej: Pago cliente, Compra materiales..."></div>
      <div class="form-group"><label>Monto (CLP) *</label><input id="f-mtx" type="number" min="0" placeholder="0"></div>
      <div class="form-actions"><button class="btn btn-ghost" onclick="closeForm()">Cancelar</button><button class="btn btn-primary" onclick="saveTx()">Guardar</button></div>
    </div>`,

    factura:`<div class="form-title">📄 Registrar factura</div>
    <div class="form-grid">
      <div class="form-row">
        <div class="form-group"><label>N° Factura *</label><input id="f-nfac" placeholder="001"></div>
        <div class="form-group"><label>Tipo</label><select id="f-tfac"><option value="emitida">Emitida (venta)</option><option value="recibida">Recibida (compra)</option></select></div>
      </div>
      <div class="form-group"><label>Cliente / Proveedor *</label><input id="f-cfac" placeholder="Nombre empresa o persona"></div>
      <div class="form-row">
        <div class="form-group"><label>Proyecto</label><select id="f-profac">${proyOpts}</select></div>
        <div class="form-group"><label>Vencimiento</label><input id="f-vfac" type="date"></div>
      </div>
      <div class="form-group"><label>Monto (CLP) *</label><input id="f-mfac" type="number" min="0" placeholder="0"></div>
      <div class="form-group"><label>Estado</label><select id="f-efac"><option value="pendiente">Pendiente</option><option value="pagada">Pagada</option></select></div>
      <div class="form-actions"><button class="btn btn-ghost" onclick="closeForm()">Cancelar</button><button class="btn btn-primary" onclick="saveFac()">Guardar</button></div>
    </div>`,

    proveedor:`<div class="form-title">🤝 Agregar proveedor</div>
    <div class="form-grid">
      <div class="form-group"><label>Empresa *</label><input id="f-pvemp" placeholder="Nombre de la empresa"></div>
      <div class="form-row">
        <div class="form-group"><label>Contacto</label><input id="f-pvcon" placeholder="Nombre contacto"></div>
        <div class="form-group"><label>Teléfono</label><input id="f-pvtel" placeholder="+56 9..."></div>
      </div>
      <div class="form-group"><label>Email</label><input id="f-pvmail" type="email" placeholder="email@empresa.cl"></div>
      <div class="form-row">
        <div class="form-group"><label>Categoría</label>
          <select id="f-pvcat"><option value="materiales">Materiales construcción</option><option value="herramientas">Herramientas/Equipos</option><option value="servicios">Servicios</option><option value="transporte">Transporte</option><option value="subcontrato">Subcontrato</option></select>
        </div>
        <div class="form-group"><label>Calificación (1-5)</label><input id="f-pvrat" type="number" min="1" max="5" placeholder="5"></div>
      </div>
      <div class="form-actions"><button class="btn btn-ghost" onclick="closeForm()">Cancelar</button><button class="btn btn-primary" onclick="saveProv()">Guardar</button></div>
    </div>`,

    persona:`<div class="form-title">👷 Agregar persona al equipo</div>
    <div class="form-grid">
      <div class="form-group"><label>Nombre completo *</label><input id="f-pernomb" placeholder="Nombre y apellido"></div>
      <div class="form-row">
        <div class="form-group"><label>Cargo *</label>
          <select id="f-percargo">
            <option value="Supervisor de obra">Supervisor de obra</option>
            <option value="Jefe de obra">Jefe de obra</option>
            <option value="Subcontratista">Subcontratista</option>
            <option value="Administrativo">Administrativo</option>
          </select>
        </div>
        <div class="form-group"><label>Tipo</label>
          <select id="f-pertipo"><option value="propio">Personal propio</option><option value="subcontrato">Subcontrato</option></select>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>Teléfono</label><input id="f-pertel" placeholder="+56 9..."></div>
        <div class="form-group"><label>Costo mensual (CLP)</label><input id="f-percosto" type="number" min="0" placeholder="0"></div>
      </div>
      <div class="form-group"><label>Proyecto asignado</label><select id="f-perproy">${proyOpts}</select></div>
      <div class="form-actions"><button class="btn btn-ghost" onclick="closeForm()">Cancelar</button><button class="btn btn-primary" onclick="savePersona()">Guardar</button></div>
    </div>`
  };
  box.innerHTML=forms[tipo]||'';
  document.getElementById('form-overlay').classList.add('open');
  setTimeout(()=>{const f=box.querySelector('input,select');if(f)f.focus();},200);
};
function closeForm(){document.getElementById('form-overlay').classList.remove('open');};
function closeFormOut(e){if(e.target.id==='form-overlay')closeForm();};

// ── CRUD ──────────────────────────────────────────
async function saveProd(){
  const nom=vv('f-nom');if(!nom){toast('⚠ Nombre requerido','var(--amber)');return;}
  await dbAdd('productos',{nombre:nom,categoria:vv('f-cat'),unidad:vv('f-uni'),stock:vi('f-stk'),stockMin:vi('f-min')||5,precioCompra:vi('f-pcompra'),precioVenta:vi('f-pventa'),proveedorId:vv('f-prov-p')});
  closeForm();toast('✅ Producto guardado');
};
async function delProd(id){if(!confirm('¿Eliminar producto?'))return;await dbDel('productos',id);toast('🗑 Eliminado','var(--red)');};

async function saveMov(){
  const pid=vv('f-pmov');const tipo=vv('f-tmov');const cant=vi('f-cmov');
  if(!pid||!cant){toast('⚠ Completa los campos','var(--amber)');return;}
  const prod=S.productos.find(p=>p.id===pid);if(!prod)return;
  if((tipo==='salida'||tipo==='venta')&&cant>prod.stock){toast('⚠ Stock insuficiente','var(--red)');return;}
  const pu=vi('f-pumov')||(tipo==='venta'?prod.precioVenta:prod.precioCompra)||0;
  const total=cant*pu;
  const proyNom=S.proyectos.find(p=>p.id===vv('f-promov'))?.nombre||'—';
  await dbUp('productos',pid,{stock:prod.stock+(tipo==='entrada'?cant:-cant)});
  await dbAdd('movimientos',{fecha:hoy(),tipo,productoId:pid,productoNombre:prod.nombre,cantidad:cant,precioUnit:pu,total,proyecto:proyNom,responsable:vv('f-rmov')||'—',notas:vv('f-nmov')||'—'});
  // Si es venta, registrar ingreso automáticamente
  if(tipo==='venta'&&total>0){
    await dbAdd('transacciones',{fecha:hoy(),tipo:'ingreso',descripcion:`Venta ${prod.nombre} x${cant}`,monto:total,proyecto:proyNom});
  }
  var ml=tipo==='venta'?'Venta':tipo==='entrada'?'Entrada':'Salida'; closeForm(); toast('✅ '+ml+' registrada');
};

async function saveProy(){
  const nom=vv('f-pnom');if(!nom){toast('⚠ Nombre requerido','var(--amber)');return;}
  const cliId=vv('f-pcli');
  const cli=S.clientes.find(c=>c.id===cliId);
  await dbAdd('proyectos',{nombre:nom,clienteId:cliId,clienteNombre:cli?.empresa||'—',inicio:vv('f-pinicio'),fin:vv('f-pfin'),presupuesto:vi('f-ppres'),pct:Math.min(100,Math.max(0,vi('f-ppct'))),jefe:vv('f-pjefe'),estado:vv('f-pest'),descripcion:vv('f-pdesc')});
  closeForm();toast('✅ Obra creada');
};
async function delProy(id){if(!confirm('¿Eliminar proyecto?'))return;await dbDel('proyectos',id);toast('🗑 Eliminado','var(--red)');};
async function updatePctProy(id,val){await dbUp('proyectos',id,{pct:Math.min(100,Math.max(0,parseInt(val)||0))});toast('✅ Progreso actualizado');};

async function saveCliente(){
  const emp=vv('f-cemp');if(!emp){toast('⚠ Nombre requerido','var(--amber)');return;}
  await dbAdd('clientes',{empresa:emp,contacto:vv('f-ccon'),telefono:vv('f-ctel'),email:vv('f-cmail'),rut:vv('f-crut')});
  closeForm();toast('✅ Cliente guardado');
};
async function delCliente(id){if(!confirm('¿Eliminar cliente?'))return;await dbDel('clientes',id);toast('🗑 Eliminado','var(--red)');};

async function saveOC(){
  const num=vv('f-ocnum');const prod=vv('f-ocprod');const cant=vi('f-occant');const pu=vi('f-ocpu');
  if(!num||!prod||!cant||!pu){toast('⚠ Completa los campos','var(--amber)');return;}
  const prov=S.proveedores.find(p=>p.id===vv('f-ocprov'));
  const proyNom=S.proyectos.find(p=>p.id===vv('f-ocproy'))?.nombre||'—';
  await dbAdd('oc',{numero:num,fecha:hoy(),proveedorId:vv('f-ocprov'),proveedorNombre:prov?.empresa||'Sin proveedor',producto:prod,cantidad:cant,precioUnit:pu,monto:cant*pu,proyecto:proyNom,fechaReq:vv('f-ocfech'),notas:vv('f-ocnotas'),estado:'pendiente'});
  closeForm();toast('✅ Orden de compra creada');
};
async function aprobarOC(id){await dbUp('oc',id,{estado:'aprobada'});toast('✅ OC aprobada','var(--blue)');};
async function recibirOC(id){
  const oc=S.oc.find(o=>o.id===id);if(!oc)return;
  await dbUp('oc',id,{estado:'recibida'});
  // Registrar egreso automáticamente
  await dbAdd('transacciones',{fecha:hoy(),tipo:'egreso',descripcion:`OC ${oc.numero} - ${oc.producto}`,monto:oc.monto,proyecto:oc.proyecto});
  toast('✅ OC recibida — egreso registrado','var(--green)');
};
async function cancelarOC(id){if(!confirm('¿Cancelar OC?'))return;await dbUp('oc',id,{estado:'cancelada'});toast('OC cancelada','var(--red)');};
async function delOC(id){if(!confirm('¿Eliminar OC?'))return;await dbDel('oc',id);toast('🗑 Eliminado','var(--red)');};

async function saveTx(){
  const desc=vv('f-dtx');const monto=vi('f-mtx');
  if(!desc||!monto){toast('⚠ Completa los campos','var(--amber)');return;}
  const proyNom=S.proyectos.find(p=>p.id===vv('f-protx'))?.nombre||'—';
  await dbAdd('transacciones',{fecha:hoy(),tipo:vv('f-ttx'),descripcion:desc,monto,proyecto:proyNom});
  closeForm();toast('✅ Transacción guardada');
};

async function saveFac(){
  const num=vv('f-nfac');const cli=vv('f-cfac');const monto=vi('f-mfac');
  if(!num||!cli||!monto){toast('⚠ Completa los campos','var(--amber)');return;}
  const proyNom=S.proyectos.find(p=>p.id===vv('f-profac'))?.nombre||'—';
  await dbAdd('facturas',{numero:num,fecha:hoy(),tipo:vv('f-tfac'),cliente:cli,monto,vencimiento:vv('f-vfac'),estado:vv('f-efac'),proyecto:proyNom});
  closeForm();toast('✅ Factura guardada');
};
async function toggleFac(id){
  const f=S.facturas.find(x=>x.id===id);
  if(f)await dbUp('facturas',id,{estado:f.estado==='pendiente'?'pagada':'pendiente'});
};

async function saveProv(){
  const emp=vv('f-pvemp');if(!emp){toast('⚠ Nombre requerido','var(--amber)');return;}
  await dbAdd('proveedores',{empresa:emp,contacto:vv('f-pvcon'),telefono:vv('f-pvtel'),email:vv('f-pvmail'),categoria:vv('f-pvcat'),rating:Math.min(5,Math.max(1,vi('f-pvrat')||5))});
  closeForm();toast('✅ Proveedor guardado');
};
async function delProv(id){if(!confirm('¿Eliminar proveedor?'))return;await dbDel('proveedores',id);toast('🗑 Eliminado','var(--red)');};

async function savePersona(){
  const nom=vv('f-pernomb');if(!nom){toast('⚠ Nombre requerido','var(--amber)');return;}
  const proyNom=S.proyectos.find(p=>p.id===vv('f-perproy'))?.nombre||'—';
  await dbAdd('personal',{nombre:nom,cargo:vv('f-percargo'),tipo:vv('f-pertipo'),telefono:vv('f-pertel'),costoMes:vi('f-percosto'),proyecto:proyNom});
  closeForm();toast('✅ Persona agregada');
};
async function delPersona(id){if(!confirm('¿Eliminar?'))return;await dbDel('personal',id);toast('🗑 Eliminado','var(--red)');};

// ── CHART ──────────────────────────────────────────
function buildChart(id){
  const now=new Date();const months=[];
  for(let i=5;i>=0;i--){const d=new Date(now.getFullYear(),now.getMonth()-i,1);months.push({label:d.toLocaleDateString('es-CL',{month:'short'}),ing:0,eg:0});}
  S.transacciones.forEach((t,idx)=>{const b=Math.min(5,Math.floor(idx/Math.max(1,S.transacciones.length/6)));const m=months[5-b];if(m){if(t.tipo==='ingreso')m.ing+=t.monto;else m.eg+=t.monto;}});
  const maxVal=Math.max(...months.map(m=>Math.max(m.ing,m.eg)),1);
  const el=document.getElementById(id);if(!el)return;
  el.innerHTML=months.map(m=>`<div class="chart-bar-group"><div class="chart-bar-pair"><div class="chart-bar" style="background:var(--green);height:${Math.max(3,Math.round(m.ing/maxVal*60))}px;width:12px" title="${fmt(m.ing)}"></div><div class="chart-bar" style="background:var(--red);height:${Math.max(3,Math.round(m.eg/maxVal*60))}px;width:12px" title="${fmt(m.eg)}"></div></div><div class="chart-label">${m.label}</div></div>`).join('');
}

// ── RENDER DASHBOARD ──────────────────────────────────────────
function renderDash(){
  const ing=sumTx('ingreso'),eg=sumTx('egreso'),util=ing-eg;
  document.getElementById('kpi-ing').textContent=fmt(ing);
  document.getElementById('kpi-eg').textContent=fmt(eg);
  document.getElementById('kpi-util').textContent=fmt(util);
  const margen=ing>0?Math.round(util/ing*100):0;
  document.getElementById('kpi-margen').innerHTML=`<span class="${util>=0?'delta-up':'delta-dn'}">${util>=0?'↑':'↓'} Margen ${margen}%</span>`;
  document.getElementById('kpi-obras').textContent=S.proyectos.filter(p=>p.estado==='activo').length;
  const criticos=S.productos.filter(p=>p.stock<=p.stockMin);
  document.getElementById('kpi-prods').textContent=S.productos.length;
  document.getElementById('kpi-bajo').textContent=criticos.length?`⚠ ${criticos.length} bajo mínimo`:'';
  const alertCount=criticos.length+S.facturas.filter(f=>f.estado==='pendiente').length+S.oc.filter(o=>o.estado==='pendiente').length;
  document.getElementById('dash-alerts-banner').innerHTML=alertCount?`<div class="alert-box">⚠ Tienes ${alertCount} alerta${alertCount>1?'s':''}. <span style="cursor:pointer;text-decoration:underline" onclick="go('alertas',null)">Ver todas →</span></div>`:'';
  // Rendimiento por obra
  const rendEl=document.getElementById('dash-rendimiento');
  const activas=S.proyectos.filter(p=>p.estado==='activo'&&p.presupuesto>0);
  rendEl.innerHTML=activas.length?activas.slice(0,4).map(p=>{
    const gasto=gastoProyecto(p.nombre);
    const pctGasto=Math.min(120,Math.round(gasto/p.presupuesto*100));
    const color=rendColor(pctGasto);
    return`<div style="margin-bottom:12px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
        <div style="display:flex;align-items:center;gap:6px"><span class="semaforo ${semaforo(pctGasto)}"></span><span style="font-size:12px;font-weight:500;color:var(--text)">${p.nombre}</span></div>
        <span style="font-size:11px;font-family:var(--mono);color:${color};font-weight:600">${pctGasto}% usado</span>
      </div>
      <div class="rend-bar"><div class="rend-fill" style="width:${Math.min(100,pctGasto)}%;background:${color}"></div></div>
      <div style="display:flex;justify-content:space-between;margin-top:3px">
        <span style="font-size:10px;color:var(--text3)">Gasto: ${fmt(gasto)}</span>
        <span style="font-size:10px;color:var(--text3)">Presup: ${fmt(p.presupuesto)}</span>
      </div>
    </div>`;
  }).join(''):empty('🏗','Sin obras con presupuesto');
  // OC pendientes
  const ocPend=S.oc.filter(o=>o.estado==='pendiente');
  document.getElementById('dash-oc').innerHTML=ocPend.length?ocPend.slice(0,4).map(o=>`<div class="alert-item"><span style="color:var(--text);font-size:12px">${o.producto}</span><span class="badge badge-amber">${fmt(o.monto)}</span></div>`).join(''):empty('✅','Sin OC pendientes');
  // Stock critico
  document.getElementById('dash-critico').innerHTML=criticos.length?criticos.slice(0,4).map(p=>`<div class="alert-item"><span style="color:var(--text);font-size:12px">${p.nombre}</span><span class="badge badge-red">⚠ ${p.stock} ${p.unidad}</span></div>`).join(''):empty('✅','Sin alertas de stock');
  // Facturas pendientes
  const pends=S.facturas.filter(f=>f.estado==='pendiente');
  document.getElementById('dash-fac-pend').innerHTML=pends.length?pends.slice(0,4).map(f=>`<div class="alert-item"><span style="color:var(--text);font-size:12px">${f.cliente}</span><span class="badge badge-amber">${fmt(f.monto)}</span></div>`).join(''):empty('✅','Sin pendientes');
  buildChart('chart-dash');
  document.getElementById('nb-inv').textContent=S.productos.length;
  document.getElementById('nb-proy').textContent=S.proyectos.filter(p=>p.estado==='activo').length;
  document.getElementById('nb-oc').textContent=S.oc.filter(o=>o.estado==='pendiente').length;
  document.getElementById('nb-alert').textContent=alertCount;
}

// ── RENDER PROYECTOS ──────────────────────────────────────────
function renderProy(){
  const activas=S.proyectos.filter(p=>p.estado==='activo');
  const totalPresup=S.proyectos.reduce((a,p)=>a+(p.presupuesto||0),0);
  const totalGasto=S.proyectos.reduce((a,p)=>a+gastoProyecto(p.nombre),0);
  document.getElementById('proy-activas').textContent=activas.length;
  document.getElementById('proy-presup').textContent=fmt(totalPresup);
  document.getElementById('proy-gasto').textContent=fmt(totalGasto);
  const el=document.getElementById('lista-proyectos');
  if(!S.proyectos.length){el.innerHTML=`<div class="card">${empty('🏗','Crea tu primera obra')}</div>`;return;}
  const eb={activo:'badge-teal',pausado:'badge-amber',terminado:'badge-green'};
  el.innerHTML=S.proyectos.map(p=>{
    const gasto=gastoProyecto(p.nombre);
    const pctGasto=p.presupuesto>0?Math.min(120,Math.round(gasto/p.presupuesto*100)):0;
    const rendimiento=p.presupuesto>0?Math.round((p.presupuesto-gasto)/p.presupuesto*100):0;
    const color=rendColor(pctGasto);
    const movs=S.movimientos.filter(m=>m.proyecto===p.nombre).length;
    return`<div class="project-card card" style="margin-bottom:12px">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:14px;flex-wrap:wrap;gap:8px">
        <div>
          <div style="display:flex;align-items:center;gap:8px">
            <span class="semaforo ${semaforo(pctGasto)}"></span>
            <div class="project-name">${p.nombre}</div>
          </div>
          <div class="project-meta">${p.clienteNombre||'Sin cliente'}${p.jefe?' · Jefe: '+p.jefe:''}${p.inicio?' · '+p.inicio:''}${p.fin?' → '+p.fin:''}</div>
          ${p.descripcion?`<div style="font-size:11px;color:var(--text3);margin-top:3px">${p.descripcion}</div>`:''}
        </div>
        <div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap">
          <span class="badge ${eb[p.estado]}">${p.estado}</span>
          <button class="btn btn-danger btn-xs" onclick="delProy('${p.id}')">✕</button>
        </div>
      </div>
      <div class="grid grid-4" style="margin-bottom:14px">
        <div><div style="font-size:9px;color:var(--text3);margin-bottom:2px;text-transform:uppercase;letter-spacing:.7px">PRESUPUESTO</div><div style="font-family:var(--mono);font-weight:600;color:var(--teal);font-size:13px">${p.presupuesto?fmt(p.presupuesto):'—'}</div></div>
        <div><div style="font-size:9px;color:var(--text3);margin-bottom:2px;text-transform:uppercase;letter-spacing:.7px">GASTO REAL</div><div style="font-family:var(--mono);font-weight:600;color:${color};font-size:13px">${fmt(gasto)}</div></div>
        <div><div style="font-size:9px;color:var(--text3);margin-bottom:2px;text-transform:uppercase;letter-spacing:.7px">RENDIMIENTO</div><div style="font-family:var(--mono);font-weight:600;color:${rendimiento>=0?'var(--green)':'var(--red)'};font-size:13px">${rendimiento>=0?'+':''}${rendimiento}%</div></div>
        <div><div style="font-size:9px;color:var(--text3);margin-bottom:2px;text-transform:uppercase;letter-spacing:.7px">MOVIMIENTOS</div><div style="font-family:var(--mono);font-weight:600;color:var(--blue);font-size:13px">${movs}</div></div>
      </div>
      ${p.presupuesto>0?`
      <div style="margin-bottom:8px">
        <div style="display:flex;justify-content:space-between;margin-bottom:4px">
          <span style="font-size:11px;color:var(--text3)">Gasto sobre presupuesto</span>
          <span style="font-size:11px;font-weight:600;color:${color};font-family:var(--mono)">${pctGasto}%</span>
        </div>
        <div class="rend-bar"><div class="rend-fill" style="width:${Math.min(100,pctGasto)}%;background:${color}"></div></div>
      </div>`:''}
      <div style="margin-bottom:4px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
          <span style="font-size:11px;color:var(--text3)">Avance de obra</span>
          <div style="display:flex;align-items:center;gap:6px">
            <input type="number" min="0" max="100" value="${p.pct}" style="width:50px;background:var(--navy);border:1px solid var(--card-border);border-radius:4px;padding:2px 6px;color:var(--text);font-size:11px;font-family:var(--mono);outline:none" onchange="updatePctProy('${p.id}',this.value)">
            <span style="font-size:11px;color:var(--text3)">%</span>
          </div>
        </div>
        <div class="progress-bar-lg"><div class="progress-fill-lg" style="width:${p.pct}%;background:linear-gradient(90deg,var(--teal),var(--blue))"></div></div>
      </div>
    </div>`;
  }).join('');
}

// ── RENDER CLIENTES ──────────────────────────────────────────
function renderClientes(){
  const tb=document.getElementById('tb-clientes');
  if(!S.clientes.length){tb.innerHTML=`<tr><td colspan="7">${empty('👤','Agrega tu primer cliente')}</td></tr>`;return;}
  tb.innerHTML=S.clientes.map(c=>{
    const proyCount=S.proyectos.filter(p=>p.clienteId===c.id).length;
    const facturado=S.facturas.filter(f=>f.cliente===c.empresa&&f.tipo==='emitida').reduce((a,f)=>a+f.monto,0);
    return`<tr>
      <td><strong style="color:var(--text)">${c.empresa}</strong>${c.rut?`<div style="font-size:10px;color:var(--text3)">${c.rut}</div>`:''}</td>
      <td style="color:var(--text2)">${c.contacto||'—'}</td>
      <td style="font-family:var(--mono);font-size:11px;color:var(--text3)">${c.telefono||'—'}</td>
      <td style="font-size:11px;color:var(--text3)">${c.email||'—'}</td>
      <td><span class="badge badge-blue">${proyCount} obra${proyCount!==1?'s':''}</span></td>
      <td style="font-family:var(--mono);font-weight:600;color:var(--teal)">${facturado>0?fmt(facturado):'—'}</td>
      <td><button class="btn btn-danger btn-xs" onclick="delCliente('${c.id}')">✕</button></td>
    </tr>`;
  }).join('');
}

// ── RENDER INVENTARIO ──────────────────────────────────────────
function renderInv(){
  const search=(document.getElementById('search-inv')?document.getElementById('search-inv').value:'').toLowerCase();
  const prods=S.productos.filter(p=>(S.filtCat==='todos'||p.categoria===S.filtCat)&&p.nombre.toLowerCase().includes(search));
  const cl={material:'badge-blue',herramienta:'badge-amber',equipo:'badge-gray',reventa:'badge-purple'};
  const nl={material:'Material',herramienta:'Herramienta',equipo:'Equipo',reventa:'Reventa'};
  const tb=document.getElementById('tb-inv');
  if(!prods.length){tb.innerHTML=`<tr><td colspan="10">${empty('📦','Sin productos')}</td></tr>`;return;}
  tb.innerHTML=prods.map(p=>{
    const bajo=p.stock<=p.stockMin;
    const pct=Math.min(100,Math.round(p.stock/Math.max(p.stockMin*2,1)*100));
    const margen=p.precioCompra>0&&p.precioVenta>0?Math.round((p.precioVenta-p.precioCompra)/p.precioCompra*100):null;
    return`<tr>
      <td><strong style="color:var(--text)">${p.nombre}</strong></td>
      <td><span class="badge ${cl[p.categoria]||'badge-gray'}">${nl[p.categoria]||p.categoria}</span></td>
      <td><span style="font-family:var(--mono);font-weight:600;color:${bajo?'var(--red)':'var(--teal)'}">${p.stock}</span>
        <div class="progress-bar" style="width:60px"><div class="progress-fill" style="width:${pct}%;background:${bajo?'var(--red)':'var(--teal)'}"></div></div></td>
      <td style="font-family:var(--mono);color:var(--text3)">${p.stockMin}</td>
      <td style="color:var(--text3)">${p.unidad}</td>
      <td style="font-family:var(--mono);color:var(--text3)">${p.precioCompra?fmt(p.precioCompra):'—'}</td>
      <td style="font-family:var(--mono);color:var(--blue)">${p.precioVenta?fmt(p.precioVenta):'—'}</td>
      <td>${margen!==null?`<span class="badge ${margen>=0?'badge-green':'badge-red'}">${margen>=0?'+':''}${margen}%</span>`:'—'}</td>
      <td><span class="badge ${bajo?'badge-red':'badge-green'}">${bajo?'⚠ Bajo':'OK'}</span></td>
      <td><button class="btn btn-danger btn-xs" onclick="delProd('${p.id}')">✕</button></td>
    </tr>`;
  }).join('');
};

// ── RENDER MOVIMIENTOS ──────────────────────────────────────────
function renderMovs(){
  const tb=document.getElementById('tb-movs');
  if(!S.movimientos.length){tb.innerHTML=`<tr><td colspan="9">${empty('🔄','Sin movimientos')}</td></tr>`;return;}
  const typeLabel={entrada:'📥 Entrada',salida:'📤 Salida',venta:'💰 Venta'};
  const typeBadge={entrada:'badge-green',salida:'badge-red',venta:'badge-purple'};
  tb.innerHTML=S.movimientos.slice(0,80).map(m=>`<tr>
    <td style="font-family:var(--mono);color:var(--text3);font-size:11px">${m.fecha}</td>
    <td><span class="badge ${typeBadge[m.tipo]||'badge-gray'}">${typeLabel[m.tipo]||m.tipo}</span></td>
    <td style="color:var(--text)">${m.productoNombre}</td>
    <td style="color:var(--text3);font-size:11px">${m.proyecto}</td>
    <td style="font-family:var(--mono);font-weight:600;color:${m.tipo==='entrada'?'var(--teal)':m.tipo==='venta'?'var(--purple)':'var(--red)'}">${m.tipo==='entrada'?'+':'−'}${m.cantidad}</td>
    <td style="font-family:var(--mono);color:var(--text3)">${m.precioUnit?fmt(m.precioUnit):'—'}</td>
    <td style="font-family:var(--mono);font-weight:600;color:var(--text)">${m.total?fmt(m.total):'—'}</td>
    <td style="color:var(--text3)">${m.responsable}</td>
    <td style="color:var(--text3);font-size:11px">${m.notas}</td>
  </tr>`).join('');
}

// ── RENDER OC ──────────────────────────────────────────
function renderOC(){
  document.getElementById('oc-pend').textContent=S.oc.filter(o=>o.estado==='pendiente').length;
  document.getElementById('oc-apro').textContent=S.oc.filter(o=>o.estado==='aprobada').length;
  document.getElementById('oc-recib').textContent=S.oc.filter(o=>o.estado==='recibida').length;
  document.getElementById('oc-total').textContent=fmt(S.oc.filter(o=>o.estado!=='cancelada').reduce((a,o)=>a+o.monto,0));
  const tb=document.getElementById('tb-oc');
  if(!S.oc.length){tb.innerHTML=`<tr><td colspan="9">${empty('🛒','Sin órdenes de compra')}</td></tr>`;return;}
  const eb={pendiente:'badge-amber',aprobada:'badge-blue',recibida:'badge-green',cancelada:'badge-gray'};
  tb.innerHTML=S.oc.map(o=>`<tr class="oc-${o.estado}">
    <td style="font-family:var(--mono);color:var(--teal);font-weight:600">${o.numero}</td>
    <td style="font-family:var(--mono);color:var(--text3);font-size:11px">${o.fecha}</td>
    <td style="color:var(--text)">${o.proveedorNombre}</td>
    <td style="color:var(--text2)">${o.producto}</td>
    <td style="color:var(--text3);font-size:11px">${o.proyecto}</td>
    <td style="font-family:var(--mono);color:var(--text3)">${fmtN(o.cantidad)}</td>
    <td style="font-family:var(--mono);font-weight:600;color:var(--text)">${fmt(o.monto)}</td>
    <td><span class="badge ${eb[o.estado]||'badge-gray'}">${o.estado}</span></td>
    <td>
      <div style="display:flex;gap:4px;flex-wrap:wrap">
        ${o.estado==='pendiente'?`<button class="btn btn-blue btn-xs" onclick="aprobarOC('${o.id}')">Aprobar</button>`:''}
        ${o.estado==='aprobada'?`<button class="btn btn-success btn-xs" onclick="recibirOC('${o.id}')">Recibida</button>`:''}
        ${o.estado!=='recibida'&&o.estado!=='cancelada'?`<button class="btn btn-danger btn-xs" onclick="cancelarOC('${o.id}')">✕</button>`:''}
        <button class="btn btn-ghost btn-xs" onclick="delOC('${o.id}')">🗑</button>
      </div>
    </td>
  </tr>`).join('');
}

// ── RENDER PROVEEDORES ──────────────────────────────────────────
function renderProv(){
  const tb=document.getElementById('tb-prov');
  if(!S.proveedores.length){tb.innerHTML=`<tr><td colspan="8">${empty('🤝','Sin proveedores')}</td></tr>`;return;}
  const cl={materiales:'badge-blue',herramientas:'badge-amber',servicios:'badge-purple',transporte:'badge-gray',subcontrato:'badge-orange'};
  tb.innerHTML=S.proveedores.map(p=>`<tr>
    <td><strong style="color:var(--text)">${p.empresa}</strong></td>
    <td style="color:var(--text2)">${p.contacto||'—'}</td>
    <td><span class="badge ${cl[p.categoria]||'badge-gray'}">${p.categoria}</span></td>
    <td style="font-family:var(--mono);font-size:11px;color:var(--text3)">${p.telefono||'—'}</td>
    <td style="font-size:11px;color:var(--text3)">${p.email||'—'}</td>
    <td><span class="badge badge-blue">${ocCount(p.id)} OC${ocCount(p.id)!==1?'s':''}</span></td>
    <td><span class="stars">${'★'.repeat(p.rating||5)+'☆'.repeat(5-(p.rating||5))}</span></td>
    <td><button class="btn btn-danger btn-xs" onclick="delProv('${p.id}')">✕</button></td>
  </tr>`).join('');
}

// ── RENDER FINANZAS ──────────────────────────────────────────
function renderFin(){
  const ing=sumTx('ingreso'),eg=sumTx('egreso'),util=ing-eg;
  const total=ing+eg||1;
  document.getElementById('fin-ing').textContent=fmt(ing);
  document.getElementById('fin-eg').textContent=fmt(eg);
  document.getElementById('fin-util').textContent=fmt(util);
  document.getElementById('fin-bar-i').style.width=Math.round(ing/total*100)+'%';
  document.getElementById('fin-bar-e').style.width=Math.round(eg/total*100)+'%';
  const m=ing>0?Math.round(util/ing*100):0;
  document.getElementById('fin-marg').innerHTML=`<span class="${util>=0?'delta-up':'delta-dn'}">${util>=0?'↑':'↓'} Margen ${m}%</span>`;
  const tb=document.getElementById('tb-fin');
  if(!S.transacciones.length){tb.innerHTML=`<tr><td colspan="5">${empty('💰','Sin transacciones')}</td></tr>`;return;}
  tb.innerHTML=S.transacciones.map(t=>`<tr>
    <td style="font-family:var(--mono);color:var(--text3);font-size:11px">${t.fecha}</td>
    <td style="color:var(--text)">${t.descripcion}</td>
    <td style="color:var(--text3);font-size:11px">${t.proyecto}</td>
    <td><span class="badge ${t.tipo==='ingreso'?'badge-green':'badge-red'}">${t.tipo==='ingreso'?'📈':'📉'} ${t.tipo}</span></td>
    <td style="font-family:var(--mono);font-weight:600;color:${t.tipo==='ingreso'?'var(--green)':'var(--red)'}">${t.tipo==='ingreso'?'+':'−'}${fmt(t.monto)}</td>
  </tr>`).join('');
  buildChart('chart-fin');
}

// ── RENDER FACTURAS ──────────────────────────────────────────
function renderFac(){
  document.getElementById('fac-emit').textContent=S.facturas.filter(f=>f.tipo==='emitida').length;
  document.getElementById('fac-pend').textContent=S.facturas.filter(f=>f.estado==='pendiente').length;
  document.getElementById('fac-pag').textContent=S.facturas.filter(f=>f.estado==='pagada').length;
  const tb=document.getElementById('tb-fac');
  if(!S.facturas.length){tb.innerHTML=`<tr><td colspan="8">${empty('📄','Sin facturas')}</td></tr>`;return;}
  tb.innerHTML=S.facturas.map(f=>`<tr>
    <td style="font-family:var(--mono);color:var(--teal)">#${f.numero}</td>
    <td style="font-family:var(--mono);color:var(--text3);font-size:11px">${f.fecha}</td>
    <td style="color:var(--text)">${f.cliente}</td>
    <td style="color:var(--text3);font-size:11px">${f.proyecto||'—'}</td>
    <td><span class="badge ${f.tipo==='emitida'?'badge-blue':'badge-amber'}">${f.tipo}</span></td>
    <td style="font-family:var(--mono);font-weight:600">${fmt(f.monto)}</td>
    <td><span class="badge ${f.estado==='pagada'?'badge-green':'badge-amber'}">${f.estado==='pagada'?'✓ Pagada':'⏳ Pendiente'}</span></td>
    <td><button class="btn btn-ghost btn-xs" onclick="toggleFac('${f.id}')">${f.estado==='pendiente'?'Marcar pagada':'Pendiente'}</button></td>
  </tr>`).join('');
}

// ── RENDER PERSONAL ──────────────────────────────────────────
function renderPersonal(){
  const tb=document.getElementById('tb-personal');
  if(!S.personal.length){tb.innerHTML=`<tr><td colspan="7">${empty('👷','Agrega tu equipo')}</td></tr>`;return;}
  const cl={propio:'badge-teal',subcontrato:'badge-orange'};
  const cargoB={  'Supervisor de obra':'badge-blue','Jefe de obra':'badge-purple','Subcontratista':'badge-amber','Administrativo':'badge-gray'};
  tb.innerHTML=S.personal.map(p=>`<tr>
    <td><strong style="color:var(--text)">${p.nombre}</strong></td>
    <td><span class="badge ${cargoB[p.cargo]||'badge-gray'}">${p.cargo}</span></td>
    <td><span class="badge ${cl[p.tipo]||'badge-gray'}">${p.tipo}</span></td>
    <td style="font-family:var(--mono);font-size:11px;color:var(--text3)">${p.telefono||'—'}</td>
    <td style="color:var(--text3);font-size:11px">${p.proyecto}</td>
    <td style="font-family:var(--mono);color:var(--amber)">${p.costoMes?fmt(p.costoMes):'—'}</td>
    <td><button class="btn btn-danger btn-xs" onclick="delPersona('${p.id}')">✕</button></td>
  </tr>`).join('');
}

// ── RENDER ALERTAS ──────────────────────────────────────────
function renderAlertas(){
  const criticos=S.productos.filter(p=>p.stock<=p.stockMin);
  document.getElementById('alert-stock').innerHTML=criticos.length?criticos.map(p=>`<div class="alert-item"><div><div style="color:var(--text);font-size:13px;font-weight:500">${p.nombre}</div><div style="font-size:11px;color:var(--text3)">Stock: ${p.stock} ${p.unidad} — Mínimo: ${p.stockMin}</div></div><span class="badge badge-red">⚠</span></div>`).join(''):empty('✅','Sin alertas de stock');
  const ocPend=S.oc.filter(o=>o.estado==='pendiente');
  document.getElementById('alert-oc').innerHTML=ocPend.length?ocPend.map(o=>`<div class="alert-item"><div><div style="color:var(--text);font-size:13px;font-weight:500">${o.numero} — ${o.producto}</div><div style="font-size:11px;color:var(--text3)">${o.proveedorNombre} · ${fmt(o.monto)}</div></div><span class="badge badge-amber">Pendiente</span></div>`).join(''):empty('✅','Sin OC pendientes');
  const pends=S.facturas.filter(f=>f.estado==='pendiente');
  document.getElementById('alert-fac').innerHTML=pends.length?pends.map(f=>`<div class="alert-item"><div><div style="color:var(--text);font-size:13px;font-weight:500">${f.cliente}</div><div style="font-size:11px;color:var(--text3)">#${f.numero}${f.vencimiento?' — Vence: '+f.vencimiento:''}</div></div><span class="badge badge-amber">${fmt(f.monto)}</span></div>`).join(''):empty('✅','Sin facturas pendientes');
  const sobrePres=S.proyectos.filter(p=>p.presupuesto>0&&gastoProyecto(p.nombre)>p.presupuesto*0.9);
  document.getElementById('alert-obras').innerHTML=sobrePres.length?sobrePres.map(p=>{const g=gastoProyecto(p.nombre);const pct=Math.round(g/p.presupuesto*100);return`<div class="alert-item"><div><div style="color:var(--text);font-size:13px;font-weight:500">${p.nombre}</div><div style="font-size:11px;color:var(--text3)">Gasto: ${fmt(g)} / Presupuesto: ${fmt(p.presupuesto)}</div></div><span class="badge ${pct>=100?'badge-red':'badge-amber'}">${pct}% usado</span></div>`;}).join(''):empty('✅','Todas las obras dentro del presupuesto');
}

// ── RENDER ALL ──────────────────────────────────────────
function renderAll(){
  renderDash();renderProy();renderClientes();renderInv();renderMovs();
  renderOC();renderProv();renderFin();renderFac();renderPersonal();renderAlertas();
};

function fCat(cat,el){
  S.filtCat=cat;
  document.querySelectorAll('#page-inventario .tab').forEach(t=>t.classList.remove('active'));
  el.classList.add('active');renderInv();
};

// ── EXPORTAR PDF ──────────────────────────────────────────
function exportarPDF(){
  const {jsPDF}=window.jspdf;
  const doc=new jsPDF();
  const ing=sumTx('ingreso'),eg=sumTx('egreso'),util=ing-eg;
  // Header
  doc.setFillColor(10,22,40);doc.rect(0,0,210,38,'F');
  doc.setTextColor(0,201,167);doc.setFontSize(18);doc.setFont('helvetica','bold');
  doc.text('CONSTRUCTORA ERP',14,16);
  doc.setTextColor(160,174,192);doc.setFontSize(10);doc.setFont('helvetica','normal');
  doc.text('Reporte integral — '+new Date().toLocaleDateString('es-CL'),14,26);
  // KPIs
  let y=48;
  doc.setTextColor(30,30,30);doc.setFontSize(12);doc.setFont('helvetica','bold');
  doc.text('Resumen financiero',14,y);y+=8;
  [[`Ingresos`,fmt(ing)],[`Egresos`,fmt(eg)],[`Utilidad neta`,fmt(util)],[`Obras activas`,String(S.proyectos.filter(p=>p.estado==='activo').length)],[`Productos bodega`,String(S.productos.length)],[`OC pendientes`,String(S.oc.filter(o=>o.estado==='pendiente').length)]].forEach(([l,v],i)=>{
    const x=14+(i%2)*98,yy=y+Math.floor(i/2)*14;
    doc.setFillColor(245,248,252);doc.roundedRect(x,yy-5,90,12,2,2,'F');
    doc.setFont('helvetica','normal');doc.setFontSize(9);doc.setTextColor(100,100,100);doc.text(l,x+4,yy+1);
    doc.setFont('helvetica','bold');doc.setFontSize(10);doc.setTextColor(10,22,40);doc.text(v,x+4,yy+7);
  });
  y+=50;
  // Proyectos
  if(S.proyectos.length){
    doc.setFont('helvetica','bold');doc.setFontSize(12);doc.setTextColor(30,30,30);
    doc.text('Proyectos / Obras',14,y);y+=8;
    S.proyectos.slice(0,8).forEach(p=>{
      const gasto=gastoProyecto(p.nombre);
      const pct=p.presupuesto>0?Math.round(gasto/p.presupuesto*100):0;
      doc.setFillColor(pct>=100?255:pct>=70?255:240,pct>=100?235:pct>=70?248:250,pct>=100?235:pct>=70?230:245);
      doc.rect(14,y-4,182,10,'F');
      doc.setFont('helvetica','bold');doc.setFontSize(9);doc.setTextColor(40,40,40);doc.text(p.nombre.slice(0,30),16,y+2);
      doc.setFont('helvetica','normal');doc.setTextColor(80,80,80);
      doc.text(`Presup: ${fmt(p.presupuesto||0)}`,90,y+2);
      doc.text(`Gasto: ${fmt(gasto)}`,140,y+2);
      doc.setFont('helvetica','bold');doc.setTextColor(pct>=100?200:pct>=70?180:50,pct>=100?50:pct>=70?100:150,50);
      doc.text(`${pct}%`,190,y+2);
      y+=12;if(y>270){doc.addPage();y=20;}
    });y+=4;
  }
  // Transacciones
  if(S.transacciones.length){
    if(y>220){doc.addPage();y=20;}
    doc.setFont('helvetica','bold');doc.setFontSize(12);doc.setTextColor(30,30,30);
    doc.text('Últimas transacciones',14,y);y+=8;
    S.transacciones.slice(0,12).forEach(t=>{
      doc.setFillColor(t.tipo==='ingreso'?235:255,t.tipo==='ingreso'?250:238,t.tipo==='ingreso'?245:238);
      doc.rect(14,y-4,182,9,'F');
      doc.setFont('helvetica','normal');doc.setFontSize(9);doc.setTextColor(80,80,80);
      doc.text(t.fecha,16,y+1);doc.text(t.descripcion.slice(0,35),42,y+1);
      doc.setFont('helvetica','bold');doc.setTextColor(t.tipo==='ingreso'?0:200,t.tipo==='ingreso'?140:50,t.tipo==='ingreso'?100:50);
      doc.text((t.tipo==='ingreso'?'+':'-')+fmt(t.monto),165,y+1);
      y+=11;if(y>270){doc.addPage();y=20;}
    });
  }
  doc.save('reporte-erp-'+new Date().toLocaleDateString('es-CL').replace(/\//g,'-')+'.pdf');
  toast('✅ PDF generado');
};

// ── EXPORTAR EXCEL ──────────────────────────────────────────
function exportarExcel(){
  if(!S.productos.length){toast('⚠ Sin productos','var(--amber)');return;}
  const h=['Nombre','Categoría','Stock','Mín.','Unidad','P.Compra','P.Venta','Margen%','Estado'];
  const rows=S.productos.map(p=>{
    const m=p.precioCompra>0&&p.precioVenta>0?Math.round((p.precioVenta-p.precioCompra)/p.precioCompra*100):0;
    return[p.nombre,p.categoria,p.stock,p.stockMin,p.unidad,p.precioCompra||0,p.precioVenta||0,m,p.stock<=p.stockMin?'Stock bajo':'OK'];
  });
  const csv=[h,...rows].map(r=>r.map(c=>`"${c}"`).join(',')).join('\n');
  const blob=new Blob(['\uFEFF'+csv],{type:'text/csv;charset=utf-8'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');a.href=url;
  a.download='inventario-'+new Date().toLocaleDateString('es-CL').replace(/\//g,'-')+'.csv';
  a.click();URL.revokeObjectURL(url);
  toast('✅ Excel descargado');
};

// ── INIT ──────────────────────────────────────────
document.getElementById('topbar-date').textContent=new Date().toLocaleDateString('es-CL',{weekday:'short',day:'numeric',month:'short'});
const savedUser=sessionStorage.getItem('erp-user');
if(savedUser&&USERS[savedUser]){
  document.getElementById('av-name').textContent=USERS[savedUser].name;
  document.getElementById('av-initials').textContent=USERS[savedUser].initials;
  document.getElementById('login-wrap').style.display='none';
  document.getElementById('app-wrap').style.display='block';
  initApp();
}