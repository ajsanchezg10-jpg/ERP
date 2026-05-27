*{box-sizing:border-box;margin:0;padding:0}
:root{
  --navy:#0A1628;--navy2:#0F2040;--navy3:#162035;
  --teal:#00C9A7;--teal2:#00A88A;--teal3:rgba(0,201,167,0.12);
  --amber:#F5A623;--amber2:rgba(245,166,35,0.15);
  --red:#E74C3C;--red2:rgba(231,76,60,0.12);
  --blue:#2E86DE;--blue2:rgba(46,134,222,0.12);
  --purple:#9B59B6;--purple2:rgba(155,89,182,0.12);
  --green:#27AE60;--green2:rgba(39,174,96,0.12);
  --orange:#E67E22;--orange2:rgba(230,126,34,0.12);
  --text:#EDF2F7;--text2:#A0AEC0;--text3:#718096;
  --card:rgba(255,255,255,0.04);--card2:rgba(255,255,255,0.07);--card-border:rgba(255,255,255,0.08);
  --font:'DM Sans',sans-serif;--mono:'DM Mono',monospace;
  --r:12px;--r2:8px;
}
body{font-family:var(--font);background:var(--navy);color:var(--text);min-height:100vh;overflow-x:hidden}

/* LOGIN */
.login-wrap{display:flex;align-items:center;justify-content:center;min-height:100vh;padding:24px;background:radial-gradient(ellipse at 30% 50%,rgba(0,201,167,0.08),transparent 60%),radial-gradient(ellipse at 70% 50%,rgba(46,134,222,0.08),transparent 60%)}
.login-box{background:var(--navy2);border:1px solid var(--card-border);border-radius:16px;padding:40px;width:100%;max-width:380px;box-shadow:0 24px 64px rgba(0,0,0,0.4)}
.login-logo{display:flex;align-items:center;gap:12px;margin-bottom:8px;justify-content:center}
.login-icon{width:48px;height:48px;background:linear-gradient(135deg,var(--teal),var(--blue));border-radius:14px;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:22px;color:var(--navy);font-family:Georgia,serif}
.login-title{font-size:22px;font-weight:600;color:var(--text);font-family:Georgia,serif}
.login-sub{font-size:12px;color:var(--text3);text-align:center;margin-bottom:28px;margin-top:4px}
.login-err{background:var(--red2);border:1px solid rgba(231,76,60,.3);border-radius:var(--r2);padding:10px 14px;font-size:12px;color:var(--red);margin-bottom:16px;display:none}

/* LAYOUT */
.app-wrap{display:none}
.sidebar{width:240px;background:var(--navy2);border-right:1px solid var(--card-border);display:flex;flex-direction:column;position:fixed;top:0;left:0;height:100vh;z-index:100;transition:transform .3s;overflow-y:auto}
.main{margin-left:240px;flex:1;min-height:100vh;display:flex;flex-direction:column}
.topbar{height:56px;background:var(--navy2);border-bottom:1px solid var(--card-border);display:flex;align-items:center;padding:0 20px;gap:12px;position:sticky;top:0;z-index:50}
.content{padding:20px;flex:1}

/* SIDEBAR */
.logo{padding:18px 16px 14px;border-bottom:1px solid var(--card-border)}
.logo-mark{display:flex;align-items:center;gap:10px}
.logo-icon{width:34px;height:34px;background:linear-gradient(135deg,var(--teal),var(--blue));border-radius:9px;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:15px;color:var(--navy);font-family:Georgia,serif}
.logo-text{font-size:13px;font-weight:600;color:var(--text)}
.logo-sub{font-size:10px;color:var(--text2);font-family:var(--mono)}
.sync-dot{width:6px;height:6px;border-radius:50%;background:var(--teal);display:inline-block;margin-right:4px;animation:pulse 2s infinite}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
.nav{padding:8px 8px;flex:1}
.nav-section{font-size:9px;font-weight:600;color:var(--text3);letter-spacing:1.2px;text-transform:uppercase;padding:8px 12px 3px}
.nav-item{display:flex;align-items:center;gap:9px;padding:7px 12px;border-radius:var(--r2);cursor:pointer;transition:.15s;margin-bottom:1px;font-size:12.5px;color:var(--text2)}
.nav-item:hover{background:var(--card);color:var(--text)}
.nav-item.active{background:var(--teal3);color:var(--teal);font-weight:500}
.nav-item svg{width:14px;height:14px;flex-shrink:0;opacity:.7}
.nav-item.active svg{opacity:1}
.nav-badge{margin-left:auto;background:var(--teal);color:var(--navy);font-size:9px;font-weight:700;padding:1px 6px;border-radius:10px;font-family:var(--mono)}
.nav-badge.red{background:var(--red);color:#fff}
.nav-badge.amber{background:var(--amber);color:var(--navy)}
.sidebar-footer{padding:10px 8px;border-top:1px solid var(--card-border)}
.user-info{display:flex;align-items:center;gap:10px;padding:8px 12px}
.avatar{width:28px;height:28px;background:linear-gradient(135deg,var(--teal),var(--blue));border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:var(--navy)}
.user-name{font-size:12px;font-weight:500;color:var(--text)}
.user-role{font-size:10px;color:var(--text3)}

/* TOPBAR */
.topbar-title{font-size:15px;font-weight:500;color:var(--text);flex:1}
.topbar-actions{display:flex;gap:6px;align-items:center}
.topbar-date{font-size:11px;color:var(--text3);font-family:var(--mono)}
.menu-btn{display:none;background:none;border:none;color:var(--text2);cursor:pointer;padding:4px}

/* BUTTONS */
.btn{display:inline-flex;align-items:center;gap:6px;padding:7px 13px;border-radius:var(--r2);border:none;cursor:pointer;font-size:12px;font-weight:500;font-family:var(--font);transition:.15s;white-space:nowrap}
.btn-primary{background:var(--teal);color:var(--navy)}.btn-primary:hover{background:var(--teal2)}
.btn-ghost{background:var(--card);color:var(--text2);border:1px solid var(--card-border)}.btn-ghost:hover{color:var(--text)}
.btn-danger{background:var(--red2);color:var(--red);border:1px solid rgba(231,76,60,.2)}
.btn-success{background:var(--green2);color:var(--green);border:1px solid rgba(39,174,96,.2)}
.btn-amber{background:var(--amber2);color:var(--amber);border:1px solid rgba(245,166,35,.2)}
.btn-blue{background:var(--blue2);color:var(--blue);border:1px solid rgba(46,134,222,.2)}
.btn-sm{padding:4px 9px;font-size:11px}
.btn-xs{padding:2px 7px;font-size:10px}

/* GRID */
.grid{display:grid;gap:14px}
.grid-5{grid-template-columns:repeat(5,1fr)}
.grid-4{grid-template-columns:repeat(4,1fr)}
.grid-3{grid-template-columns:repeat(3,1fr)}
.grid-2{grid-template-columns:repeat(2,1fr)}

/* CARDS */
.card{background:var(--card);border:1px solid var(--card-border);border-radius:var(--r);padding:18px}
.card-sm{padding:14px}
.card-highlight{background:var(--card2);border:1px solid rgba(0,201,167,0.2)}

/* KPI */
.kpi{display:flex;flex-direction:column;gap:5px}
.kpi-label{font-size:10px;font-weight:600;color:var(--text3);text-transform:uppercase;letter-spacing:.8px}
.kpi-value{font-size:22px;font-weight:600;font-family:var(--mono);letter-spacing:-1px}
.kpi-value.teal{color:var(--teal)}.kpi-value.amber{color:var(--amber)}.kpi-value.red{color:var(--red)}.kpi-value.blue{color:var(--blue)}.kpi-value.green{color:var(--green)}.kpi-value.orange{color:var(--orange)}.kpi-value.purple{color:var(--purple)}
.kpi-delta{font-size:11px;color:var(--text3)}.delta-up{color:var(--teal)}.delta-dn{color:var(--red)}
.kpi-icon{width:32px;height:32px;border-radius:var(--r2);display:flex;align-items:center;justify-content:center;margin-bottom:2px}
.kpi-icon.teal{background:var(--teal3)}.kpi-icon.amber{background:var(--amber2)}.kpi-icon.red{background:var(--red2)}.kpi-icon.blue{background:var(--blue2)}.kpi-icon.green{background:var(--green2)}.kpi-icon.orange{background:var(--orange2)}.kpi-icon.purple{background:var(--purple2)}

/* TABLES */
.tbl-wrap{overflow-x:auto}
table{width:100%;border-collapse:collapse;font-size:12px}
thead th{text-align:left;padding:7px 10px;font-size:10px;font-weight:600;color:var(--text3);text-transform:uppercase;letter-spacing:.7px;border-bottom:1px solid var(--card-border)}
tbody td{padding:9px 10px;border-bottom:1px solid rgba(255,255,255,.03);color:var(--text2);vertical-align:middle}
tbody tr:hover td{background:rgba(255,255,255,.02);color:var(--text)}
tbody tr:last-child td{border-bottom:none}

/* BADGES */
.badge{display:inline-flex;align-items:center;padding:2px 8px;border-radius:20px;font-size:10px;font-weight:600;font-family:var(--mono)}
.badge-green{background:var(--green2);color:var(--green)}
.badge-red{background:var(--red2);color:var(--red)}
.badge-amber{background:var(--amber2);color:var(--amber)}
.badge-blue{background:var(--blue2);color:var(--blue)}
.badge-gray{background:rgba(255,255,255,.06);color:var(--text3)}
.badge-purple{background:var(--purple2);color:var(--purple)}
.badge-teal{background:var(--teal3);color:var(--teal)}
.badge-orange{background:var(--orange2);color:var(--orange)}

/* SECTION */
.section-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;gap:10px;flex-wrap:wrap}
.section-title{font-size:14px;font-weight:600;color:var(--text)}
.section-sub{font-size:11px;color:var(--text3);margin-top:1px}

/* FORM MODAL */
.form-overlay{position:fixed;inset:0;background:rgba(0,0,0,.75);z-index:200;display:flex;align-items:center;justify-content:center;padding:16px;opacity:0;pointer-events:none;transition:.2s}
.form-overlay.open{opacity:1;pointer-events:all}
.form-box{background:var(--navy2);border:1px solid var(--card-border);border-radius:var(--r);padding:22px;width:100%;max-width:500px;transform:translateY(14px);transition:.2s;max-height:92vh;overflow-y:auto}
.form-overlay.open .form-box{transform:translateY(0)}
.form-title{font-size:15px;font-weight:600;margin-bottom:18px;color:var(--text);display:flex;align-items:center;gap:8px}
.form-grid{display:grid;gap:12px}
.form-group{display:flex;flex-direction:column;gap:5px}
.form-group label{font-size:11px;font-weight:600;color:var(--text2)}
.form-group input,.form-group select,.form-group textarea{background:var(--navy);border:1px solid var(--card-border);border-radius:var(--r2);padding:8px 11px;color:var(--text);font-size:12px;font-family:var(--font);transition:.15s;outline:none;width:100%}
.form-group input:focus,.form-group select:focus,.form-group textarea:focus{border-color:var(--teal);box-shadow:0 0 0 3px var(--teal3)}
.form-group select option{background:var(--navy2)}
.form-row{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.form-row-3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px}
.form-actions{display:flex;gap:8px;justify-content:flex-end;margin-top:6px}
.form-divider{border:none;border-top:1px solid var(--card-border);margin:4px 0}

/* PROGRESS */
.progress-bar{height:3px;background:rgba(255,255,255,.07);border-radius:2px;overflow:hidden;margin-top:6px}
.progress-fill{height:100%;border-radius:2px;transition:width .6s}
.progress-bar-lg{height:8px;background:rgba(255,255,255,.07);border-radius:4px;overflow:hidden}
.progress-fill-lg{height:100%;border-radius:4px;transition:width .6s}

/* SEMAFORO */
.semaforo{width:10px;height:10px;border-radius:50%;display:inline-block;flex-shrink:0}
.sem-green{background:var(--green)}
.sem-amber{background:var(--amber)}
.sem-red{background:var(--red)}

/* TABS */
.tabs{display:flex;gap:3px;background:rgba(255,255,255,.04);border-radius:var(--r2);padding:3px;width:fit-content}
.tab{padding:5px 12px;border-radius:6px;font-size:12px;font-weight:500;cursor:pointer;color:var(--text3);transition:.15s;border:none;background:none;font-family:var(--font)}
.tab.active{background:rgba(255,255,255,.08);color:var(--text)}

/* SEARCH */
.search-box{background:var(--navy);border:1px solid var(--card-border);border-radius:var(--r2);padding:7px 11px;color:var(--text);font-size:12px;font-family:var(--font);outline:none;width:200px;transition:.15s}
.search-box:focus{border-color:var(--teal)}

/* PAGES */
.page{display:none}.page.active{display:block}
.overlay-mob{display:none;position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:90}

/* MISC */
.empty{text-align:center;padding:40px 20px;color:var(--text3)}
.empty-icon{font-size:36px;margin-bottom:10px;opacity:.35}
.empty-text{font-size:13px}
.toast{position:fixed;bottom:20px;right:20px;background:var(--navy2);border:1px solid var(--card-border);border-left:3px solid var(--teal);border-radius:var(--r2);padding:11px 15px;font-size:12px;color:var(--text);z-index:300;transform:translateY(70px);opacity:0;transition:.3s;max-width:300px}
.toast.show{transform:translateY(0);opacity:1}
.alert-box{background:rgba(231,76,60,.08);border:1px solid rgba(231,76,60,.2);border-radius:var(--r2);padding:10px 14px;font-size:12px;color:var(--red);margin-bottom:14px}
.info-box{background:var(--blue2);border:1px solid rgba(46,134,222,.2);border-radius:var(--r2);padding:10px 14px;font-size:12px;color:var(--blue);margin-bottom:14px}

/* CHART */
.chart-wrap{display:flex;align-items:flex-end;gap:5px;height:80px;padding-top:8px}
.chart-bar-group{display:flex;flex-direction:column;align-items:center;gap:3px;flex:1}
.chart-bar-pair{display:flex;gap:2px;align-items:flex-end;height:65px}
.chart-bar{min-width:8px;border-radius:3px 3px 0 0;transition:height .5s}
.chart-label{font-size:9px;color:var(--text3);font-family:var(--mono);text-align:center}
.chart-legend{display:flex;gap:14px;margin-top:10px;flex-wrap:wrap}
.chart-legend-item{display:flex;align-items:center;gap:5px;font-size:11px;color:var(--text3)}
.chart-legend-dot{width:8px;height:8px;border-radius:2px}

/* PROJECT CARD */
.project-card{background:var(--card);border:1px solid var(--card-border);border-radius:var(--r2);padding:16px;margin-bottom:10px;transition:.15s}
.project-card:hover{border-color:rgba(0,201,167,0.2)}
.project-name{font-size:14px;font-weight:600;color:var(--text)}
.project-meta{font-size:11px;color:var(--text3);margin-top:2px}

/* PRICE HISTORY */
.price-trend-up{color:var(--red)}
.price-trend-dn{color:var(--green)}

/* ALERT ITEM */
.alert-item{display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid rgba(255,255,255,.04)}
.alert-item:last-child{border-bottom:none}
.stars{color:var(--amber);font-size:11px}

/* RENDIMIENTO */
.rend-bar{height:6px;border-radius:3px;overflow:hidden;background:rgba(255,255,255,.07);margin-top:4px}
.rend-fill{height:100%;border-radius:3px;transition:width .6s}

/* OC STATUS */
.oc-pending{border-left:3px solid var(--amber)}
.oc-approved{border-left:3px solid var(--blue)}
.oc-received{border-left:3px solid var(--green)}
.oc-cancelled{border-left:3px solid var(--red)}

@media(max-width:1100px){.grid-5{grid-template-columns:repeat(3,1fr)}}
@media(max-width:900px){.grid-5{grid-template-columns:repeat(2,1fr)}.grid-4{grid-template-columns:repeat(2,1fr)}.grid-3{grid-template-columns:repeat(2,1fr)}}
@media(max-width:700px){
  .sidebar{transform:translateX(-100%)}.sidebar.open{transform:translateX(0)}
  .main{margin-left:0}.grid-5{grid-template-columns:1fr 1fr}.grid-4{grid-template-columns:1fr 1fr}
  .grid-2{grid-template-columns:1fr}.menu-btn{display:block}.overlay-mob{display:block}
  .search-box{width:100%}.form-row{grid-template-columns:1fr}.form-row-3{grid-template-columns:1fr}
  .topbar-date{display:none}.content{padding:14px}.kpi-value{font-size:18px}
  .topbar-actions .btn-ghost{display:none}
}
@media(max-width:480px){.grid-5{grid-template-columns:1fr 1fr}.grid-4{grid-template-columns:1fr 1fr}.grid-3{grid-template-columns:1fr}}