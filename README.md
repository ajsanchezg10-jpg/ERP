<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>ERP Constructora</title>
<link rel="manifest" href="manifest.json">
<meta name="theme-color" content="#00C9A7">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="ERP">
<link rel="apple-touch-icon" href="icon-192.png">
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet">
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
<link rel="stylesheet" href="css/styles.css">
</head>
<body>

<!-- LOGIN -->
<div class="login-wrap" id="login-wrap">
  <div class="login-box">
    <div class="login-logo">
      <div class="login-icon">C</div>
      <div class="login-title">Constructora ERP</div>
    </div>
    <div class="login-sub">Sistema de gestión integral · v3.0</div>
    <div class="login-err" id="login-err">Usuario o contraseña incorrectos</div>
    <div class="form-grid">
      <div class="form-group"><label>Usuario</label><input id="l-user" placeholder="admin" onkeydown="if(event.key==='Enter')doLogin()"></div>
      <div class="form-group"><label>Contraseña</label><input id="l-pass" type="password" placeholder="••••••••" onkeydown="if(event.key==='Enter')doLogin()"></div>
      <button class="btn btn-primary" style="width:100%;justify-content:center;padding:11px;font-size:13px" onclick="doLogin()">Ingresar →</button>
    </div>
  </div>
</div>

<!-- APP -->
<div class="app-wrap" id="app-wrap">
  <div class="overlay-mob" id="overlay" onclick="closeSidebar()"></div>

  <aside class="sidebar" id="sidebar">
    <div class="logo">
      <div class="logo-mark">
        <div class="logo-icon">C</div>
        <div>
          <div class="logo-text">Constructora ERP</div>
          <div class="logo-sub"><span class="sync-dot"></span>Firebase · v3.0</div>
        </div>
      </div>
    </div>
    <nav class="nav">
      <div class="nav-section">Principal</div>
      <div class="nav-item active" onclick="go('dashboard',this)">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
        Dashboard
      </div>
      <div class="nav-section">Proyectos</div>
      <div class="nav-item" onclick="go('proyectos',this)">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
        Proyectos / Obras
        <span class="nav-badge" id="nb-proy">0</span>
      </div>
      <div class="nav-item" onclick="go('clientes',this)">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        Clientes
      </div>
      <div class="nav-section">Bodega</div>
      <div class="nav-item" onclick="go('inventario',this)">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
        Inventario
        <span class="nav-badge" id="nb-inv">0</span>
      </div>
      <div class="nav-item" onclick="go('movimientos',this)">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>
        Movimientos
      </div>
      <div class="nav-section">Compras</div>
      <div class="nav-item" onclick="go('oc',this)">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
        Órdenes de Compra
        <span class="nav-badge amber" id="nb-oc">0</span>
      </div>
      <div class="nav-item" onclick="go('proveedores',this)">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        Proveedores
      </div>
      <div class="nav-section">Finanzas</div>
      <div class="nav-item" onclick="go('finanzas',this)">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
        Finanzas
      </div>
      <div class="nav-item" onclick="go('facturas',this)">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
        Facturas
      </div>
      <div class="nav-section">Personal</div>
      <div class="nav-item" onclick="go('personal',this)">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        Personal
      </div>
      <div class="nav-section">Sistema</div>
      <div class="nav-item" onclick="go('alertas',this)">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
        Alertas
        <span class="nav-badge red" id="nb-alert">0</span>
      </div>
    </nav>
    <div class="sidebar-footer">
      <div class="user-info">
        <div class="avatar" id="av-initials">AD</div>
        <div><div class="user-name" id="av-name">Administrador</div><div class="user-role">Acceso total</div></div>
      </div>
      <button class="btn btn-ghost btn-sm" style="width:100%;margin-top:6px;justify-content:center" onclick="doLogout()">Cerrar sesión</button>
    </div>
  </aside>

  <div class="main">
    <div class="topbar">
      <button class="menu-btn" onclick="toggleSidebar()">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
      </button>
      <span class="topbar-title" id="topbar-title">Dashboard</span>
      <div class="topbar-actions">
        <span class="topbar-date" id="topbar-date"></span>
        <button class="btn btn-ghost btn-sm" onclick="exportarPDF()">📄 PDF</button>
        <button class="btn btn-ghost btn-sm" onclick="exportarExcel()">📊 Excel</button>
      </div>
    </div>

    <div class="content">

      <!-- ═══════════════════════════════════════════ -->
      <!-- DASHBOARD -->
      <!-- ═══════════════════════════════════════════ -->
      <div class="page active" id="page-dashboard">
        <div id="dash-alerts-banner"></div>
        <div class="grid grid-5" style="margin-bottom:14px">
          <div class="card card-sm kpi">
            <div class="kpi-icon green"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#27AE60" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/></svg></div>
            <div class="kpi-label">Ingresos</div>
            <div class="kpi-value green" id="kpi-ing">$0</div>
          </div>
          <div class="card card-sm kpi">
            <div class="kpi-icon red"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#E74C3C" stroke-width="2"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/></svg></div>
            <div class="kpi-label">Egresos</div>
            <div class="kpi-value red" id="kpi-eg">$0</div>
          </div>
          <div class="card card-sm kpi">
            <div class="kpi-icon amber"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#F5A623" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></div>
            <div class="kpi-label">Utilidad</div>
            <div class="kpi-value amber" id="kpi-util">$0</div>
            <div class="kpi-delta" id="kpi-margen"></div>
          </div>
          <div class="card card-sm kpi">
            <div class="kpi-icon blue"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2E86DE" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg></div>
            <div class="kpi-label">Obras activas</div>
            <div class="kpi-value blue" id="kpi-obras">0</div>
          </div>
          <div class="card card-sm kpi">
            <div class="kpi-icon teal"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#00C9A7" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg></div>
            <div class="kpi-label">Productos</div>
            <div class="kpi-value teal" id="kpi-prods">0</div>
            <div class="kpi-delta"><span id="kpi-bajo" class="delta-dn"></span></div>
          </div>
        </div>

        <div class="grid grid-2" style="margin-bottom:14px">
          <div class="card">
            <div class="section-head"><div><div class="section-title">Flujo de caja</div><div class="section-sub">Ingresos vs egresos</div></div></div>
            <div class="chart-wrap" id="chart-dash"></div>
            <div class="chart-legend">
              <div class="chart-legend-item"><div class="chart-legend-dot" style="background:var(--green)"></div>Ingresos</div>
              <div class="chart-legend-item"><div class="chart-legend-dot" style="background:var(--red)"></div>Egresos</div>
            </div>
          </div>
          <div class="card">
            <div class="section-head"><div><div class="section-title">Rendimiento por obra</div><div class="section-sub">Presupuesto vs gasto real</div></div></div>
            <div id="dash-rendimiento"></div>
          </div>
        </div>

        <div class="grid grid-3">
          <div class="card">
            <div class="section-head"><div><div class="section-title">⚠ Stock crítico</div></div></div>
            <div id="dash-critico"></div>
          </div>
          <div class="card">
            <div class="section-head"><div><div class="section-title">🛒 OC pendientes</div></div></div>
            <div id="dash-oc"></div>
          </div>
          <div class="card">
            <div class="section-head"><div><div class="section-title">📄 Facturas pendientes</div></div></div>
            <div id="dash-fac-pend"></div>
          </div>
        </div>
      </div>

      <!-- ═══════════════════════════════════════════ -->
      <!-- PROYECTOS -->
      <!-- ═══════════════════════════════════════════ -->
      <div class="page" id="page-proyectos">
        <div class="section-head">
          <div><div class="section-title">Proyectos / Obras</div><div class="section-sub">Presupuesto, gasto real y rendimiento</div></div>
          <button class="btn btn-primary" onclick="openForm('proyecto')">+ Nueva obra</button>
        </div>
        <div class="grid grid-3" style="margin-bottom:14px">
          <div class="card kpi"><div class="kpi-label">Obras activas</div><div class="kpi-value blue" id="proy-activas">0</div></div>
          <div class="card kpi"><div class="kpi-label">Presupuesto total</div><div class="kpi-value teal" id="proy-presup">$0</div></div>
          <div class="card kpi"><div class="kpi-label">Gasto real total</div><div class="kpi-value amber" id="proy-gasto">$0</div></div>
        </div>
        <div id="lista-proyectos"></div>
      </div>

      <!-- ═══════════════════════════════════════════ -->
      <!-- CLIENTES -->
      <!-- ═══════════════════════════════════════════ -->
      <div class="page" id="page-clientes">
        <div class="section-head">
          <div><div class="section-title">Clientes</div><div class="section-sub">Ficha y historial por cliente</div></div>
          <button class="btn btn-primary" onclick="openForm('cliente')">+ Agregar cliente</button>
        </div>
        <div class="card">
          <div class="tbl-wrap"><table>
            <thead><tr><th>Empresa / Persona</th><th>Contacto</th><th>Teléfono</th><th>Email</th><th>Proyectos</th><th>Facturado</th><th></th></tr></thead>
            <tbody id="tb-clientes"></tbody>
          </table></div>
        </div>
      </div>

      <!-- ═══════════════════════════════════════════ -->
      <!-- INVENTARIO -->
      <!-- ═══════════════════════════════════════════ -->
      <div class="page" id="page-inventario">
        <div class="section-head">
          <div><div class="section-title">Inventario de bodega</div><div class="section-sub">Materiales, herramientas y equipos — con precio de reventa</div></div>
          <button class="btn btn-primary" onclick="openForm('producto')">+ Agregar producto</button>
        </div>
        <div class="card" style="margin-bottom:12px">
          <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">
            <input class="search-box" id="search-inv" placeholder="🔍 Buscar..." oninput="renderInv()">
            <div class="tabs">
              <button class="tab active" onclick="fCat('todos',this)">Todos</button>
              <button class="tab" onclick="fCat('material',this)">Materiales</button>
              <button class="tab" onclick="fCat('herramienta',this)">Herramientas</button>
              <button class="tab" onclick="fCat('equipo',this)">Equipos</button>
              <button class="tab" onclick="fCat('reventa',this)">Reventa</button>
            </div>
          </div>
        </div>
        <div class="card">
          <div class="tbl-wrap"><table>
            <thead><tr><th>Producto</th><th>Categoría</th><th>Stock</th><th>Mín.</th><th>Unidad</th><th>P. Compra</th><th>P. Venta</th><th>Margen</th><th>Estado</th><th></th></tr></thead>
            <tbody id="tb-inv"></tbody>
          </table></div>
        </div>
      </div>

      <!-- ═══════════════════════════════════════════ -->
      <!-- MOVIMIENTOS -->
      <!-- ═══════════════════════════════════════════ -->
      <div class="page" id="page-movimientos">
        <div class="section-head">
          <div><div class="section-title">Movimientos de bodega</div><div class="section-sub">Entradas, salidas y ventas de materiales</div></div>
          <button class="btn btn-primary" onclick="openForm('movimiento')">+ Registrar movimiento</button>
        </div>
        <div class="card">
          <div class="tbl-wrap"><table>
            <thead><tr><th>Fecha</th><th>Tipo</th><th>Producto</th><th>Proyecto</th><th>Cantidad</th><th>P.Unit</th><th>Total</th><th>Responsable</th><th>Notas</th></tr></thead>
            <tbody id="tb-movs"></tbody>
          </table></div>
        </div>
      </div>

      <!-- ═══════════════════════════════════════════ -->
      <!-- ÓRDENES DE COMPRA -->
      <!-- ═══════════════════════════════════════════ -->
      <div class="page" id="page-oc">
        <div class="section-head">
          <div><div class="section-title">Órdenes de Compra</div><div class="section-sub">Cotización → Aprobación → Recepción</div></div>
          <button class="btn btn-primary" onclick="openForm('oc')">+ Nueva OC</button>
        </div>
        <div class="grid grid-4" style="margin-bottom:14px">
          <div class="card kpi"><div class="kpi-label">Pendientes</div><div class="kpi-value amber" id="oc-pend">0</div></div>
          <div class="card kpi"><div class="kpi-label">Aprobadas</div><div class="kpi-value blue" id="oc-apro">0</div></div>
          <div class="card kpi"><div class="kpi-label">Recibidas</div><div class="kpi-value green" id="oc-recib">0</div></div>
          <div class="card kpi"><div class="kpi-label">Total compras</div><div class="kpi-value teal" id="oc-total">$0</div></div>
        </div>
        <div class="card">
          <div class="tbl-wrap"><table>
            <thead><tr><th>N° OC</th><th>Fecha</th><th>Proveedor</th><th>Producto</th><th>Proyecto</th><th>Cantidad</th><th>Monto</th><th>Estado</th><th>Acciones</th></tr></thead>
            <tbody id="tb-oc"></tbody>
          </table></div>
        </div>
      </div>

      <!-- ═══════════════════════════════════════════ -->
      <!-- PROVEEDORES -->
      <!-- ═══════════════════════════════════════════ -->
      <div class="page" id="page-proveedores">
        <div class="section-head">
          <div><div class="section-title">Proveedores</div><div class="section-sub">Directorio, calificación e historial de precios</div></div>
          <button class="btn btn-primary" onclick="openForm('proveedor')">+ Agregar proveedor</button>
        </div>
        <div class="card">
          <div class="tbl-wrap"><table>
            <thead><tr><th>Empresa</th><th>Contacto</th><th>Categoría</th><th>Teléfono</th><th>Email</th><th>OCs</th><th>Calificación</th><th></th></tr></thead>
            <tbody id="tb-prov"></tbody>
          </table></div>
        </div>
      </div>

      <!-- ═══════════════════════════════════════════ -->
      <!-- FINANZAS -->
      <!-- ═══════════════════════════════════════════ -->
      <div class="page" id="page-finanzas">
        <div class="grid grid-3" style="margin-bottom:14px">
          <div class="card kpi"><div class="kpi-label">Total ingresos</div><div class="kpi-value green" id="fin-ing">$0</div><div class="progress-bar"><div class="progress-fill" id="fin-bar-i" style="background:var(--green)"></div></div></div>
          <div class="card kpi"><div class="kpi-label">Total egresos</div><div class="kpi-value red" id="fin-eg">$0</div><div class="progress-bar"><div class="progress-fill" id="fin-bar-e" style="background:var(--red)"></div></div></div>
          <div class="card kpi"><div class="kpi-label">Utilidad neta</div><div class="kpi-value amber" id="fin-util">$0</div><div class="kpi-delta" id="fin-marg"></div></div>
        </div>
        <div class="card" style="margin-bottom:14px">
          <div class="section-head"><div><div class="section-title">Flujo de caja</div></div></div>
          <div class="chart-wrap" id="chart-fin"></div>
          <div class="chart-legend">
            <div class="chart-legend-item"><div class="chart-legend-dot" style="background:var(--green)"></div>Ingresos</div>
            <div class="chart-legend-item"><div class="chart-legend-dot" style="background:var(--red)"></div>Egresos</div>
          </div>
        </div>
        <div class="card">
          <div class="section-head"><div><div class="section-title">Transacciones</div></div><button class="btn btn-primary" onclick="openForm('transaccion')">+ Nueva</button></div>
          <div class="tbl-wrap"><table>
            <thead><tr><th>Fecha</th><th>Descripción</th><th>Proyecto</th><th>Tipo</th><th>Monto</th></tr></thead>
            <tbody id="tb-fin"></tbody>
          </table></div>
        </div>
      </div>

      <!-- ═══════════════════════════════════════════ -->
      <!-- FACTURAS -->
      <!-- ═══════════════════════════════════════════ -->
      <div class="page" id="page-facturas">
        <div class="section-head">
          <div><div class="section-title">Facturas</div><div class="section-sub">Documentos tributarios emitidos y recibidos</div></div>
          <button class="btn btn-primary" onclick="openForm('factura')">+ Nueva factura</button>
        </div>
        <div class="grid grid-3" style="margin-bottom:14px">
          <div class="card kpi"><div class="kpi-label">Emitidas</div><div class="kpi-value blue" id="fac-emit">0</div></div>
          <div class="card kpi"><div class="kpi-label">Pendientes</div><div class="kpi-value amber" id="fac-pend">0</div></div>
          <div class="card kpi"><div class="kpi-label">Pagadas</div><div class="kpi-value green" id="fac-pag">0</div></div>
        </div>
        <div class="card">
          <div class="tbl-wrap"><table>
            <thead><tr><th>N°</th><th>Fecha</th><th>Cliente/Proveedor</th><th>Proyecto</th><th>Tipo</th><th>Monto</th><th>Estado</th><th></th></tr></thead>
            <tbody id="tb-fac"></tbody>
          </table></div>
        </div>
      </div>

      <!-- ═══════════════════════════════════════════ -->
      <!-- PERSONAL -->
      <!-- ═══════════════════════════════════════════ -->
      <div class="page" id="page-personal">
        <div class="section-head">
          <div><div class="section-title">Personal</div><div class="section-sub">Supervisor, jefes de obra y subcontratistas</div></div>
          <button class="btn btn-primary" onclick="openForm('persona')">+ Agregar persona</button>
        </div>
        <div class="card">
          <div class="tbl-wrap"><table>
            <thead><tr><th>Nombre</th><th>Cargo</th><th>Tipo</th><th>Teléfono</th><th>Proyecto asignado</th><th>Costo/mes</th><th></th></tr></thead>
            <tbody id="tb-personal"></tbody>
          </table></div>
        </div>
      </div>

      <!-- ═══════════════════════════════════════════ -->
      <!-- ALERTAS -->
      <!-- ═══════════════════════════════════════════ -->
      <div class="page" id="page-alertas">
        <div class="section-head"><div><div class="section-title">Centro de alertas</div><div class="section-sub">Stock crítico, OC pendientes y facturas vencidas</div></div></div>
        <div class="grid grid-3">
          <div class="card"><div class="section-head"><div><div class="section-title">📦 Stock bajo mínimo</div></div></div><div id="alert-stock"></div></div>
          <div class="card"><div class="section-head"><div><div class="section-title">🛒 OC sin aprobar</div></div></div><div id="alert-oc"></div></div>
          <div class="card"><div class="section-head"><div><div class="section-title">📄 Facturas pendientes</div></div></div><div id="alert-fac"></div></div>
        </div>
        <div class="card" style="margin-top:14px">
          <div class="section-head"><div><div class="section-title">⚠ Obras sobre presupuesto</div></div></div>
          <div id="alert-obras"></div>
        </div>
      </div>

    </div><!-- /content -->
  </div><!-- /main -->
</div><!-- /app-wrap -->

<div class="form-overlay" id="form-overlay" onclick="closeFormOut(event)">
  <div class="form-box" id="form-box"></div>
</div>
<div class="toast" id="toast"></div>
<!-- Firebase Compat SDK -->




<script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-auth-compat.js"></script>

<script src="js/firebase.js"></script>
<script src="js/auth.js"></script>
<script src="js/app.js"></script>

<script>
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js');
}
</script>
</body>

</html>
