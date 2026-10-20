
import {createClient} from 'https://esm.sh/@supabase/supabase-js@2';
const host='https://znxsenypronpjvrnmkhx.supabase.co',key='sb_publishable_odpc2KUNRNobB44ha1yXiA_tXVWVcMF',db=createClient(host,key),s={user:null,admin:false,page:'home',clients:[],visits:[],incidents:[],types:[],comments:[],profiles:[],search:'',district:'',municipality:'',parish:'',billing:'all',opened:'all',registered:'all',visited:'all',quick:'',shown:30,mapSearch:'',mapDistrict:'',mapMunicipality:'',mapParish:'',mapBilling:'all',mapOpened:'all',mapRegistered:'all',mapVisited:'all',mapLocation:'all',mapShown:40,mapLocated:[],routeIds:[],routeOrigin:''},E=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])),euro=v=>Number(v||0).toLocaleString('pt-PT',{style:'currency',currency:'EUR'});
const el=id=>document.getElementById(id),val=id=>el(id)?.value||'';
function flash(t){el('toast').textContent=t;el('toast').classList.remove('hide');setTimeout(()=>el('toast').classList.add('hide'),4500)}
function pop(body){el('popup').innerHTML='<div class="modal"><div class="row between"><b>CSI Campo</b><button class="btn" data-act="close">Fechar ✕</button></div><hr style="border:0;border-top:1px solid #eee">'+body+'</div>';el('popup').classList.remove('hide')}
function close(){el('popup').classList.add('hide')}
function loadTheme(){try{return localStorage.getItem('csi-campo-theme')==='dark'?'dark':'light'}catch{return 'light'}}
let currentTheme=loadTheme();
function applyTheme(){document.documentElement.setAttribute('data-theme',currentTheme);document.documentElement.style.colorScheme=currentTheme==='dark'?'dark':'light';const meta=document.querySelector('meta[name="theme-color"]');if(meta)meta.content=currentTheme==='dark'?'#111827':'#16223a'}
function toggleTheme(){currentTheme=currentTheme==='dark'?'light':'dark';try{localStorage.setItem('csi-campo-theme',currentTheme)}catch{}applyTheme();render()}
applyTheme();
const CSI_CURRENT_BUILD=String(window.__CSI_BUILD||'github-pages');
let csiNextBuild=null,csiCheckInProgress=false;
function csiShowUpdate(next){if(!next||next===CSI_CURRENT_BUILD)return;csiNextBuild=next;const button=el('csi-update');if(button){button.classList.remove('hide');button.textContent='↻ Nova versão disponível — Atualizar app'}const version=el('csi-build');if(version)version.textContent='Nova versão disponível'}
async function csiCheckForUpdate(manual=false){
 if(csiCheckInProgress)return;csiCheckInProgress=true;
 try{
  if(CSI_CURRENT_BUILD!=='github-pages'){
   const endpoint=new URL(location.href);endpoint.searchParams.set('csi_version','1');endpoint.searchParams.set('_',String(Date.now()));
   const response=await fetch(endpoint.toString(),{cache:'no-store',headers:{Accept:'application/json'}});
   if(!response.ok)throw Error('Não foi possível consultar a versão');
   const data=await response.json();if(!data.build)throw Error('Resposta de versão inválida');
   if(data.build!==CSI_CURRENT_BUILD)csiShowUpdate(data.build);
   else if(manual)flash('A aplicação já está atualizada (v'+String(CSI_CURRENT_BUILD).slice(0,7)+').');
  }else{
   if('serviceWorker' in navigator){const registration=await navigator.serviceWorker.getRegistration('./');if(registration){await registration.update();if(registration.waiting)csiShowUpdate('pwa');}}
   if(manual&&!csiNextBuild)flash('Verificação concluída. Sem atualização pendente.');
  }
 }catch(e){if(manual)flash('Não foi possível verificar atualizações: '+e.message)}finally{csiCheckInProgress=false}
}
async function csiApplyUpdate(){
 const button=el('csi-update');if(button){button.disabled=true;button.textContent='A atualizar...'}
 try{
  if('serviceWorker' in navigator){const reg=await navigator.serviceWorker.getRegistration('./');if(reg){await reg.update();if(reg.waiting)reg.waiting.postMessage({type:'SKIP_WAITING'});}}
  if('caches' in window){const names=await caches.keys();await Promise.all(names.filter(n=>n.startsWith('csi-campo-')).map(n=>caches.delete(n)))}
 }catch(e){console.warn('Atualização parcial da cache',e)}
 const next=new URL(location.href);next.searchParams.delete('csi_version');next.searchParams.set('v',csiNextBuild||String(Date.now()));location.replace(next.toString());
}
function csiWatchVersions(){
 csiCheckForUpdate();
 window.addEventListener('focus',()=>csiCheckForUpdate());
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)csiCheckForUpdate()});
 setInterval(()=>csiCheckForUpdate(),300000);
 if('serviceWorker' in navigator)navigator.serviceWorker.addEventListener('controllerchange',()=>csiShowUpdate('pwa'));
}
function menu(){return '<header><div class="row"><span class="logo">CSI</span><b>Pesquisa de Campo <small class="muted">· 2026</small></b></div><div class="row"><small id="csi-build" class="muted">v'+E(CSI_CURRENT_BUILD.slice(0,7))+'</small><button class="btn csi-update-btn hide" id="csi-update" data-act="csiupdate">↻ Nova versão disponível — Atualizar app</button><button class="btn" data-act="csicheck" title="Verificar atualização">↻ Verificar</button><small class="muted">'+E(s.user.email)+'</small><button class="btn theme-toggle" data-act="theme" aria-label="'+(currentTheme==='dark'?'Ativar modo dia':'Ativar modo noite')+'" title="'+(currentTheme==='dark'?'Modo dia':'Modo noite')+'">'+(currentTheme==='dark'?'☀️':'🌙')+'</button><button class="btn" data-act="password" aria-label="Definições">⚙</button><button class="btn" data-act="logout">Sair</button></div></header>'}
function login(){return '<div class="wrap auth"><div class="row"><span class="logo">CSI</span><h2>Pesquisa de Campo</h2></div><div class="card"><h1>Entrar</h1><p class="muted">Consulta rápida para comerciais.</p><form id="login"><label>Email</label><input class="field" type="email" name="email" required><label>Palavra-passe</label><input class="field" type="password" name="password" minlength="8" required><button class="btn primary" style="width:100%">Entrar</button></form><p><button class="btn" data-act="forgot">Recuperar acesso</button></p></div></div>'}
const noVisit=c=>!s.visits.some(v=>v.customer_id===c.id),zero=c=>Number(c.annual_billing||0)===0,lowBilling=c=>Number(c.annual_billing||0)>=1&&Number(c.annual_billing||0)<=5000;
const officialDistricts=['Aveiro','Beja','Braga','Bragança','Castelo Branco','Coimbra','Évora','Faro','Guarda','Leiria','Lisboa','Portalegre','Porto','Santarém','Setúbal','Viana do Castelo','Vila Real','Viseu'];
const localGroups=['Madeira','Açores'];
function districtGroup(c){let d=String(c.district||'').trim();return officialDistricts.includes(d)||localGroups.includes(d)?d:'other'}
function districtMatches(c,d){return !d||districtGroup(c)===d}
function sameDayInPortugal(date){return new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Lisbon',year:'numeric',month:'2-digit',day:'2-digit'}).format(date)}
function currentVisits(period){let now=new Date(),today=sameDayInPortugal(now),year=Number(today.slice(0,4)),month=Number(today.slice(5,7)),day=Number(today.slice(8,10));let monday=new Date(Date.UTC(year,month-1,day));monday.setUTCDate(monday.getUTCDate()-((monday.getUTCDay()+6)%7));let mondayLabel=monday.toISOString().slice(0,10);let begin=period==='week'?mondayLabel:today.slice(0,7)+'-01';return s.visits.filter(v=>v.user_id===s.user.id&&sameDayInPortugal(new Date(v.visited_at))>=begin&&sameDayInPortugal(new Date(v.visited_at))<=today).sort((a,b)=>new Date(b.visited_at)-new Date(a.visited_at))}
function exportMyVisits(period){let records=currentVisits(period),rows=[['Data e hora','Cliente','NIF','Distrito','Concelho','Freguesia','Visitado por','Comentário']];for(let v of records){let c=s.clients.find(x=>x.id===v.customer_id);rows.push([new Date(v.visited_at).toLocaleString('pt-PT',{timeZone:'Europe/Lisbon'}),c?.name||'(cliente não encontrado)',c?.nif||'',c?.district||'',c?.municipality||'',c?.parish||'',peopleName(v.user_id,v.visitor_name),v.comment||''])}download('CSI_Minhas_Visitas_'+(period==='week'?'Semana':'Mes')+'_Atual.csv',csv(rows));flash(records.length+' visitas exportadas')}

function home(){return '<h1>O teu dia, mais simples.</h1><p class="muted">Tudo o que precisas para trabalhar no terreno.</p><div class="grid tiles indicators"><button class="tile" data-act="quick" data-type="zero"><small>Faturação 0 €</small><b class="orange">'+s.clients.filter(zero).length+'</b><small>Ver clientes →</small></button><button class="tile" data-act="quick" data-type="lowbill"><small>Faturação 1 € a 5.000 €</small><b style="color:#3661cd">'+s.clients.filter(lowBilling).length+'</b><small>Ver clientes →</small></button><button class="tile" data-act="quick" data-type="highbill"><small>Faturação de 5.001 € ao máximo</small><b style="color:#7c5ce0">'+s.clients.filter(c=>Number(c.annual_billing||0)>5000).length+'</b><small>Ver clientes →</small></button><button class="tile" data-act="quick" data-type="unvisited"><small>Não visitados</small><b style="color:#4065d9">'+s.clients.filter(noVisit).length+'</b><small>Ver clientes →</small></button><button class="tile" data-act="quick" data-type="visited"><small>Clientes visitados</small><b class="green">'+s.clients.filter(c=>!noVisit(c)).length+'</b><small>Ver clientes →</small></button><button class="tile" data-act="quick" data-type="closed"><small>Clientes por abrir</small><b class="green">'+s.clients.filter(c=>!c.opened).length+'</b><small>Ver clientes →</small></button></div><section class="card visit-export"><div class="row between"><div><h2>As minhas visitas</h2><p class="muted">Exportação individual: apenas as visitas registadas por ti.</p></div><div class="row"><button class="btn" data-act="visitscsv" data-period="week">↓ Semana atual ('+currentVisits('week').length+')</button><button class="btn" data-act="visitscsv" data-period="month">↓ Mês atual ('+currentVisits('month').length+')</button></div></div></section><h2>Áreas de trabalho</h2><div class="grid navtiles"><button class="tile" data-act="page" data-page="clients">🏢 <b>Clientes CSI</b><small class="muted">Pesquisa, contactos e visitas</small></button><button class="tile" data-act="page" data-page="map">🗺️ <b>Mapa de Clientes</b><small class="muted">Localizar empresas e preparar visitas</small></button><button class="tile" data-act="page" data-page="incidents">🛠️ <b>Incidências</b><small class="muted">Transporte, RMA e apoio técnico</small></button><button class="tile" data-act="page" data-page="stats">📊 <b>Gráficos</b><small class="muted">Indicadores e exportação</small></button>'+(s.admin?'<button class="tile" data-act="page" data-page="admin">🔐 <b>Administração</b><small class="muted">Utilizadores, upload e download</small></button>':'')+'</div>'}
function select(id,items,current){return '<select class="field" id="'+id+'">'+items.map(([v,t])=>'<option value="'+E(v)+'" '+(v===current?'selected':'')+'>'+E(t)+'</option>').join('')+'</select>'}
function filtered(){let q=s.search.toLowerCase();return s.clients.filter(c=>(!q||[c.name,c.nif,c.postal_code,c.municipality,c.phone].some(x=>String(x||'').toLowerCase().includes(q)))&&districtMatches(c,s.district)&&(!s.municipality||c.municipality===s.municipality)&&(!s.parish||c.parish===s.parish)&&(s.opened==='all'||(s.opened==='yes'?c.opened:!c.opened))&&(s.registered==='all'||(s.registered==='yes'?!!c.registration_number:!c.registration_number))&&(s.visited==='all'||(s.visited==='yes'?!noVisit(c):noVisit(c)))&&(s.quick===''||(s.quick==='zero'&&zero(c))||(s.quick==='unvisited'&&noVisit(c))||(s.quick==='closed'&&!c.opened)||(s.quick==='visited'&&!noVisit(c))||(s.quick==='lowbill'&&lowBilling(c))||(s.quick==='highbill'&&Number(c.annual_billing||0)>5000))&&(s.billing==='all'||(s.billing==='zero'?zero(c):s.billing==='low'?c.annual_billing>0&&c.annual_billing<=5000:s.billing==='mid'?c.annual_billing>5000&&c.annual_billing<=25000:c.annual_billing>25000)))}
function cust(c){
const tel=String(c.phone||'').replace(/[^0-9+]/g,'');
const visits=s.visits.filter(v=>v.customer_id===c.id);
const comments=s.comments.filter(v=>v.customer_id===c.id);
return '<article class="card"><div class="row between"><h3>'+E(c.name)+'</h3><span class="pill '+(c.opened?'green':'orange')+'">'+(c.opened?'Aberto':'Por abrir')+'</span></div>'
+'<p class="row"><span class="pill">'+(c.registration_number?'Reg. '+E(c.registration_number):'Sem registo prévio')+'</span><span class="pill">'+E(c.postal_code||'Sem CP')+'</span><span class="pill">'+E(c.district||'Distrito n/d')+'</span><span class="pill">'+E(c.municipality||'')+'</span><span class="pill">'+(visits.length?'Visitado '+visits.length+'×':'Por visitar')+'</span></p>'
+'<div class="client-billing"><b>'+euro(c.annual_billing)+'</b><span class="commercial-tag">Comercial interno: <strong>'+E(c.commercial_internal||'Não atribuído')+'</strong></span></div><small class="muted">Faturação anterior: '+euro(c.prior_billing)+'</small>'
+'<div class="actions"><button type="button" class="btn" data-act="call" data-id="'+c.id+'">☎ Ligar</button><a class="btn" href="'+(c.email?'mailto:'+E(c.email):'#')+'">✉ Email</a><button type="button" class="btn" data-act="address" data-id="'+c.id+'">⌖ Morada</button><a class="btn" target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query='+encodeURIComponent([c.address,c.postal_code,c.municipality].filter(Boolean).join(', '))+'">⌖ Mapa</a><button class="btn green" data-act="visit" data-id="'+c.id+'">✓ Visita</button><button class="btn" data-act="comment" data-id="'+c.id+'">✎ Comentário</button><button class="btn" data-act="history" data-id="'+c.id+'">◷ Histórico ('+(visits.length+comments.length)+')</button><button class="btn" data-act="edit" data-id="'+c.id+'">✎ Editar cliente</button></div></article>';
}
function clients(){let d=[...new Set(s.clients.map(districtGroup).filter(x=>x!=='other'))].sort((a,b)=>a.localeCompare(b,'pt')),m=[...new Set(s.clients.filter(c=>districtMatches(c,s.district)).map(c=>c.municipality).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'pt')),f=[...new Set(s.clients.filter(c=>districtMatches(c,s.district)&&(!s.municipality||c.municipality===s.municipality)).map(c=>c.parish).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'pt')),a=filtered();return '<button class="btn" data-act="page" data-page="home">← Menu</button><h1>Clientes CSI</h1><p class="muted" id="count">'+a.length+' resultados</p><div class="card"><input class="field" id="search" placeholder="🔎 Nome, NIF, código postal..." value="'+E(s.search)+'"><div class="filters"><div><label>Distrito</label>'+select('district',[['','Todos os distritos e regiões'],...d.map(v=>[v,localGroups.includes(v)?v+' (Região Autónoma)':v]),['other','Outros / por validar']],s.district)+'</div><div><label>Concelho</label>'+select('municipality',[['','Todos'],...m.map(v=>[v,v])],s.municipality)+'</div><div><label>Freguesia</label>'+select('parish',[['','Todas'],...f.map(v=>[v,v])],s.parish)+'</div><div><label>Faturação</label>'+select('billing',[['all','Todas'],['zero','0 €'],['low','1–5.000 €'],['mid','5.001–25.000 €'],['high','Mais de 25.000 €']],s.billing)+'</div><div><label>Registo prévio</label>'+select('registered',[['all','Todos'],['yes','Com registo'],['no','Sem registo']],s.registered)+'</div><div><label>Estado</label>'+select('opened',[['all','Todos'],['yes','Aberto'],['no','Por abrir']],s.opened)+'</div><div><label>Visita</label>'+select('visited',[['all','Todos'],['yes','Visitado'],['no','Por visitar']],s.visited)+'</div></div><button class="btn" data-act="clear">Limpar filtros</button></div><div class="list" id="list">'+(a.length?a.slice(0,s.shown).map(cust).join(''):'<div class="card">Nenhum resultado.</div>')+'</div>'+(a.length>s.shown?'<button class="btn" data-act="more">Carregar mais</button>':'')}
function incidents(){
return '<div class="row between"><div><button class="btn" data-act="page" data-page="home">← Menu</button><h1>Registo de incidências</h1></div><button class="btn primary" data-act="newincident">+ Nova incidência</button></div>'
+'<div class="list">'+(s.incidents.length?s.incidents.map(i=>{
let c=s.clients.find(x=>x.id===i.customer_id),author=s.profiles.find(p=>p.user_id===i.created_by);
return '<article class="card"><div class="row between"><b>'+E(i.title)+'</b><span class="pill">'+E(s.types.find(t=>t.id===i.category_id)?.name||'Outro')+'</span></div><p class="muted">'+E(c?.name||'Cliente não identificado')+' · '+new Date(i.created_at).toLocaleString('pt-PT')+' · '+E(author?.full_name||'Utilizador')+'</p><p>'+E(i.description||'')+'</p></article>'
}).join(''):'<div class="card">Sem incidências registadas.</div>')+'</div>';
}
function stats(){
let counts=s.types.map(t=>({...t,count:s.incidents.filter(i=>i.category_id===t.id).length})).sort((a,b)=>b.count-a.count);
return '<button class="btn" data-act="page" data-page="home">← Menu</button><h1>Gráfico de incidências</h1><p class="muted">Número de registos por tipo, sem estados de resolução.</p>'
+'<div class="card"><div class="row between"><h2>'+s.incidents.length+' incidências registadas</h2><button class="btn primary" data-act="incsv">↓ Descarregar CSV</button></div>'
+counts.map(t=>'<div class="barline"><span>'+E(t.name)+'</span><div class="chart"><i style="width:'+(t.count/Math.max(1,s.incidents.length)*100)+'%"></i></div><b>'+t.count+'</b></div>').join('')+'</div>';
}
function admin(){return '<button class="btn" data-act="page" data-page="home">← Menu</button><h1>Administração</h1><div class="grid navtiles"><button class="tile" data-act="import">📤<b>Upload / Atualizar</b><small>Pré-visualização, cópia e reversão</small></button><button class="tile" data-act="backups">🗂️<b>Histórico de importações</b><small>Cópias de segurança e reversão</small></button><button class="tile" data-act="export">📥<b>Download da lista</b><small>Exportar clientes para CSV</small></button><button class="tile" data-act="editscsv">📝<b>Clientes editados</b><small>Descarregar histórico de alterações</small></button><button class="tile" data-act="users">👥<b>Utilizadores</b><small>Criar contas e alterar passwords</small></button></div><p class="note">Clientes ausentes no novo Excel não serão eliminados. Células vazias não substituem dados existentes.</p>'}

/* Mapa: a localização só é pedida ao serviço externo após ação do utilizador. */
let mapInstance=null,mapMarkers=new Map(),mapLibraryPromise=null,mapBusy=false,mapLastQuery=0;
function mapMatches(){const q=s.mapSearch.trim().toLocaleLowerCase('pt');return s.clients.filter(c=>
districtMatches(c,s.mapDistrict)
&&(!s.mapMunicipality||c.municipality===s.mapMunicipality)
&&(!s.mapParish||c.parish===s.mapParish)
&&(s.mapLocation==='all'||(s.mapLocation==='located'?s.mapLocated.some(p=>p.id===c.id):!s.mapLocated.some(p=>p.id===c.id)))
&&(s.mapOpened==='all'||(s.mapOpened==='yes'?!!c.opened:!c.opened))
&&(s.mapRegistered==='all'||(s.mapRegistered==='yes'?!!c.registration_number:!c.registration_number))
&&(s.mapVisited==='all'||(s.mapVisited==='yes'?!noVisit(c):noVisit(c)))
&&(s.mapBilling==='all'||(s.mapBilling==='zero'?zero(c):s.mapBilling==='low'?lowBilling(c):s.mapBilling==='high'?Number(c.annual_billing||0)>5000:s.mapBilling==='mid'?Number(c.annual_billing||0)>5000&&Number(c.annual_billing||0)<=25000:Number(c.annual_billing||0)>25000))
&&(!q||[c.name,c.nif,c.postal_code,c.address,c.parish,c.municipality,c.district,c.phone,c.commercial_internal].some(x=>String(x||'').toLocaleLowerCase('pt').includes(q))));}
function mapDependentOptions(){
 const municipalities=[...new Set(s.clients.filter(c=>districtMatches(c,s.mapDistrict)).map(c=>c.municipality).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'pt'));
 const parishes=[...new Set(s.clients.filter(c=>districtMatches(c,s.mapDistrict)&&(!s.mapMunicipality||c.municipality===s.mapMunicipality)).map(c=>c.parish).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'pt'));
 return {municipalities,parishes};
}
function updateMapFilterUi(){
 const {municipalities,parishes}=mapDependentOptions();
 const municipality=el('mapmunicipality'),parish=el('mapparish');
 if(municipality)municipality.innerHTML=[['','Todos os concelhos'],...municipalities.map(v=>[v,v])].map(([value,label])=>'<option value="'+E(value)+'" '+(value===s.mapMunicipality?'selected':'')+'>'+E(label)+'</option>').join('');
 if(parish)parish.innerHTML=[['','Todas as freguesias'],...parishes.map(v=>[v,v])].map(([value,label])=>'<option value="'+E(value)+'" '+(value===s.mapParish?'selected':'')+'>'+E(label)+'</option>').join('');
 s.mapShown=40;const results=el('mapresults');if(results)results.innerHTML=mapResults();
}

function routeAddress(c){return [c.address,c.postal_code,c.municipality,c.district].map(x=>String(x||'').trim()).filter(Boolean).join(', ')}
function routeStops(){return s.routeIds.map(id=>s.clients.find(c=>c.id===id)).filter(Boolean)}
function routePanel(){
 const stops=routeStops();
 return '<section class="card route-panel"><div class="row between"><div><h2>Rota de visitas</h2><p class="muted">'+stops.length+' de 8 clientes selecionados · ordem editável</p></div><button class="btn" data-act="routeclear" '+(!stops.length?'disabled':'')+'>Limpar rota</button></div>'
 +'<label>Ponto de partida (opcional)</label><input class="field" id="routeorigin" value="'+E(s.routeOrigin)+'" placeholder="Ex.: Escritório, Lisboa ou morada de partida">'
 +(stops.length?'<ol class="route-stops">'+stops.map((c,i)=>'<li><div><b>'+E(c.name)+'</b><small>'+E(routeAddress(c)||'Morada em falta — editar cliente')+'</small></div><div class="route-stop-actions"><button class="btn" data-act="routewazestop" data-id="'+c.id+'" title="Navegar no Waze até esta paragem">Waze</button><button class="btn" title="Subir paragem" aria-label="Subir paragem" data-act="routeup" data-id="'+c.id+'" '+(i===0?'disabled':'')+'>↑</button><button class="btn" title="Descer paragem" aria-label="Descer paragem" data-act="routedown" data-id="'+c.id+'" '+(i===stops.length-1?'disabled':'')+'>↓</button><button class="btn" title="Retirar da rota" aria-label="Retirar da rota" data-act="routeremove" data-id="'+c.id+'">×</button></div></li>').join('')+'</ol>':'<p class="muted">Adiciona clientes através da lista. Podes organizar a sequência antes de sair para as visitas.</p>')
 +'<div class="row route-buttons"><button class="btn primary" data-act="routeopen" '+(!stops.length?'disabled':'')+'>↗ Google Maps · Rota completa</button><button class="btn" data-act="routewaze" '+(!stops.length?'disabled':'')+'>↗ Waze · '+(stops.length===1?'Ir ao cliente':'Primeira paragem')+'</button><button class="btn" data-act="routecsv" '+(!stops.length?'disabled':'')+'>↓ Exportar roteiro</button></div><p class="muted route-warning">Google Maps abre a rota com todas as paragens. Waze abre uma paragem de cada vez; não suporta esta rota com várias paragens num único link. Confirma as moradas antes de viajar.</p></section>';
}
function refreshRoute(){if(s.page!=='map')return;let panel=el('routepanel');if(panel)panel.innerHTML=routePanel();let listing=el('mapresults');if(listing)listing.innerHTML=mapResults()}
function mapResults(){
 const rows=mapMatches(),chosen=rows.slice(0,s.mapShown),found=s.mapLocated.filter(x=>rows.some(c=>c.id===x.id)).length;
 return '<div class="map-result-count"><b>'+rows.length+'</b> clientes encontrados · <b>'+found+'</b> localizados nesta sessão · <b>'+Math.max(0,rows.length-found)+'</b> por localizar. A mostrar '+chosen.length+'.</div>'
 +chosen.map(c=>{const located=s.mapLocated.some(x=>x.id===c.id);return '<div class="map-client"><div><b>'+E(c.name)+'</b><small>'+E([c.address,c.postal_code,c.municipality,c.parish].filter(Boolean).join(' · '))+'</small><small class="'+(located?'map-located':'map-unlocated')+'">'+(located?'● Localizado nesta sessão':'○ Por localizar')+'</small></div><div class="map-client-buttons"><button class="btn" data-act="maplocate" data-id="'+c.id+'">'+(located?'⌖ Ver ponto':'⌖ Localizar')+'</button><button class="btn '+(s.routeIds.includes(c.id)?'route-added':'')+'" data-act="'+(s.routeIds.includes(c.id)?'routeremove':'routeadd')+'" data-id="'+c.id+'">'+(s.routeIds.includes(c.id)?'✓ Na rota':'+ Rota')+'</button></div></div>'}).join('')
 +(rows.length>s.mapShown?'<button class="btn map-load-more" data-act="mapmore">Carregar mais clientes ('+(rows.length-s.mapShown)+' restantes)</button>':'');
}
function mapPage(){
 const d=[...new Set(s.clients.map(districtGroup).filter(x=>x!=='other'))].sort((a,b)=>a.localeCompare(b,'pt'));
 const {municipalities,parishes}=mapDependentOptions();
 return '<button class="btn" data-act="page" data-page="home">← Menu</button><div class="row between"><div><h1>Mapa de Clientes</h1><p class="muted">Filtra os clientes, seleciona as paragens e abre o percurso no Google Maps.</p></div><span class="pill">Localização aproximada por morada</span></div>'
 +'<div class="map-filters card">'
 +'<div><label>Pesquisar empresa, NIF ou localidade</label><input class="field" id="mapsearch" value="'+E(s.mapSearch)+'" placeholder="Pesquisar empresa..."></div>'
 +'<div><label>Distrito / região</label>'+select('mapdistrict',[['','Todos os distritos'],...d.map(x=>[x,x]),['other','Outros / por validar']],s.mapDistrict)+'</div>'
 +'<div><label>Concelho</label>'+select('mapmunicipality',[['','Todos os concelhos'],...municipalities.map(x=>[x,x])],s.mapMunicipality)+'</div>'
 +'<div><label>Freguesia</label>'+select('mapparish',[['','Todas as freguesias'],...parishes.map(x=>[x,x])],s.mapParish)+'</div>'
 +'<div><label>Faturação anual</label>'+select('mapbilling',[['all','Todas'],['zero','0 €'],['low','1 € a 5.000 €'],['high','Superior a 5.000 €'],['mid','5.001 € a 25.000 €'],['veryhigh','Superior a 25.000 €']],s.mapBilling)+'</div>'
 +'<div><label>Registo prévio</label>'+select('mapregistered',[['all','Todos'],['yes','Com registo'],['no','Sem registo']],s.mapRegistered)+'</div>'
 +'<div><label>Estado</label>'+select('mapopened',[['all','Todos'],['yes','Aberto'],['no','Por abrir']],s.mapOpened)+'</div>'
 +'<div><label>Visita</label>'+select('mapvisited',[['all','Todos'],['yes','Visitado'],['no','Não visitado']],s.mapVisited)+'</div>'
 +'<div><label>Localização no mapa</label>'+select('maplocation',[['all','Todos os clientes'],['located','Localizados nesta sessão'],['missing','Por localizar']],s.mapLocation)+'</div>'
 +'<div class="map-filter-actions"><button class="btn" data-act="mapreset">Limpar filtros</button></div></div>'
 +'<div id="routepanel">'+routePanel()+'</div><div class="map-layout"><div class="card map-surface"><div id="csi-map" aria-label="Mapa interativo de clientes"></div><p class="muted map-attribution">Mapa © OpenStreetMap. Pontos obtidos por geocodificação; confirma a morada antes de viajar.</p></div><div class="card map-list"><div class="row between"><h2>Clientes</h2><button class="btn" data-act="mapclear">Limpar pontos</button></div><div id="mapresults">'+mapResults()+'</div></div></div>';
}

function changeRoute(id,action){const c=s.clients.find(x=>x.id===id);if(!c)return;if(action==='add'){if(s.routeIds.includes(id))return;if(s.routeIds.length>=8){flash('Máximo de 8 clientes por roteiro.');return}if(!routeAddress(c)){flash('Preenche primeiro a morada do cliente.');return}s.routeIds.push(id)}else if(action==='remove'){s.routeIds=s.routeIds.filter(x=>x!==id)}else{let index=s.routeIds.indexOf(id),target=index+(action==='up'?-1:1);if(index<0||target<0||target>=s.routeIds.length)return;[s.routeIds[index],s.routeIds[target]]=[s.routeIds[target],s.routeIds[index]]}refreshRoute()}
function openRoute(){
 const stops=routeStops();if(!stops.length){flash('Seleciona pelo menos um cliente para a rota');return}
 if(stops.some(c=>!routeAddress(c))){flash('Existem clientes sem morada. Corrige a ficha antes de abrir a rota.');return}
 const places=stops.map(routeAddress),starting=s.routeOrigin.trim();
 const args=new URLSearchParams({api:'1',destination:places[places.length-1],travelmode:'driving'});
 if(starting)args.set('origin',starting);
 if(places.length>1){const intermediate=places.slice(0,-1);args.set('waypoints',intermediate.join('|'))}
 const url='https://www.google.com/maps/dir/?'+args.toString();
 const opened=window.open(url,'_blank','noopener,noreferrer');if(!opened)window.location.assign(url)
}

function openWazeForCustomer(id){const c=s.clients.find(x=>x.id===id);if(!c){flash('Cliente não encontrado');return}const address=routeAddress(c);if(!address){flash('Cliente sem morada');return}const url='https://waze.com/ul?'+new URLSearchParams({q:address,navigate:'yes'});const win=window.open(url,'_blank','noopener,noreferrer');if(!win)window.location.assign(url)}
function openWazeNextStop(){const c=routeStops()[0];if(!c){flash('Seleciona um cliente');return}openWazeForCustomer(c.id)}
function routeCsv(){let data=[['Ordem','Cliente','NIF','Morada','Código postal','Concelho','Distrito','Comercial interno']];for(const [i,c] of routeStops().entries())data.push([i+1,c.name,c.nif,c.address,c.postal_code,c.municipality,c.district,c.commercial_internal]);download('CSI_Rota_Visitas.csv',csv(data))}
function ensureLeaflet(){if(window.L)return Promise.resolve(window.L);if(mapLibraryPromise)return mapLibraryPromise;mapLibraryPromise=new Promise((resolve,reject)=>{if(!document.querySelector('link[data-leaflet]')){let css=document.createElement('link');css.rel='stylesheet';css.href='https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';css.dataset.leaflet='';document.head.appendChild(css)}let script=document.createElement('script');script.src='https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';script.onload=()=>resolve(window.L);script.onerror=()=>reject(new Error('Não foi possível carregar o mapa. Confirma a ligação à Internet.'));document.head.appendChild(script)}).catch(e=>{mapLibraryPromise=null;throw e});return mapLibraryPromise}
async function initCustomerMap(){if(!el('csi-map'))return;try{const L=await ensureLeaflet();if(!el('csi-map')||s.page!=='map'||mapInstance)return;mapInstance=L.map('csi-map',{scrollWheelZoom:false}).setView([39.55,-8.00],7);L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'© OpenStreetMap contributors'}).addTo(mapInstance);for(const located of s.mapLocated){const c=s.clients.find(x=>x.id===located.id);if(!c)continue;const marker=L.marker([located.lat,located.lon]).addTo(mapInstance).bindPopup('<b>'+E(c.name)+'</b><br>'+E(c.address||c.postal_code||''));mapMarkers.set(c.id,marker)}}catch(e){const node=el('csi-map');if(node)node.textContent=e.message}}
function geocodingQueries(c){
 // Não repetir o código postal nem distrito quando já estão dentro do campo morada.
 const raw=String(c.address||'').replace(/\r/g,' ').replace(/\n/g,', ');
 const cp=String(c.postal_code||'').match(/\b\d{4}-\d{3}\b/)?.[0]||raw.match(/\b\d{4}-\d{3}\b/)?.[0]||'';
 let street=raw.split(/\b\d{4}-\d{3}\b/)[0].replace(/,?\s*(Portugal)\s*$/i,'').trim().replace(/[,;\s]+$/,'');
 const parts=street.split(/\s*,\s*/).filter(Boolean);
 const tail=String(c.municipality||'').trim().toLocaleLowerCase('pt');
 if(tail&&parts.length>1&&parts[parts.length-1].toLocaleLowerCase('pt')===tail)parts.pop();
 street=parts.join(', ');
 const district=String(c.district||'').trim(),city=String(c.municipality||'').trim();
 const queries=[];
 if(street&&cp)queries.push([street,cp,city,'Portugal'].filter(Boolean).join(', '));
 if(street&&city)queries.push([street,city,district,'Portugal'].filter(Boolean).join(', '));
 if(!street&&cp)queries.push([cp,city,'Portugal'].filter(Boolean).join(', '));
 return [...new Set(queries)].slice(0,2);
}
async function locateCustomerOnMap(id){
 const c=s.clients.find(x=>x.id===id);if(!c)return;
 if(mapBusy){flash('Aguarda pela localização anterior');return}
 if(!mapInstance){flash('O mapa ainda está a carregar');return}
 const previous=s.mapLocated.find(x=>x.id===id);
 if(previous){mapInstance.setView([previous.lat,previous.lon],16);mapMarkers.get(id)?.openPopup();return}
 const queries=geocodingQueries(c);
 if(!queries.length){flash('Falta a rua ou o código postal. Confirma a morada do cliente.');return}
 if(s.mapLocated.length>=25){flash('Máximo de 25 pontos nesta sessão. Limpa os pontos para continuar.');return}
 mapBusy=true;
 try{
  let found=null;
  for(const query of queries){
   const wait=Math.max(0,1200-(Date.now()-mapLastQuery));if(wait)await new Promise(r=>setTimeout(r,wait));
   mapLastQuery=Date.now();
   const api='https://nominatim.openstreetmap.org/search?'+new URLSearchParams({q:query,format:'json',limit:'1',countrycodes:'pt'});
   const response=await fetch(api,{headers:{Accept:'application/json'}});
   if(!response.ok)throw Error('O serviço de localização não respondeu ('+response.status+')');
   const matches=await response.json();
   if(matches.length){found=matches[0];break}
  }
  if(!found){flash('Morada não localizada. Confirma a rua e o código postal na ficha.');return}
  const lat=Number(found.lat),lon=Number(found.lon);
  if(!Number.isFinite(lat)||!Number.isFinite(lon))throw Error('Coordenadas inválidas');
  // Uma correspondência apenas ao CP pode apontar ao centro da localidade: não a declarar como localização exata.
  s.mapLocated.push({id,lat,lon});
  if(s.page==='map'&&mapInstance){
   const marker=window.L.marker([lat,lon]).addTo(mapInstance).bindPopup('<b>'+E(c.name)+'</b><br>'+E(c.address||c.postal_code||'')+'<br><small>Posição aproximada; confirmar antes de visitar</small>');
   mapMarkers.set(c.id,marker);mapInstance.setView([lat,lon],16);marker.openPopup();
   const list=el('mapresults');if(list)list.innerHTML=mapResults();
  }
 }catch(e){flash('Falha ao localizar: '+e.message)}
 finally{mapBusy=false}
}
function clearMap(){s.mapLocated=[];if(mapInstance){for(const marker of mapMarkers.values())marker.remove()}mapMarkers.clear();const list=el('mapresults');if(list)list.innerHTML=mapResults();flash('Pontos retirados do mapa')}

function render(){if(mapInstance){mapInstance.remove();mapInstance=null;mapMarkers.clear()}el('app').innerHTML=s.user?menu()+'<main class="wrap">'+(s.page==='home'?home():s.page==='clients'?clients():s.page==='map'?mapPage():s.page==='incidents'?incidents():s.page==='stats'?stats():admin())+'</main>':login();if(s.user&&s.page==='map')queueMicrotask(initCustomerMap)}
async function getAll(table){let out=[];for(let p=0;p<50;p++){let query=db.from(table).select('*');if(table==='customers')query=query.eq('is_active',true);let {data,error}=await query.range(p*1000,p*1000+999);if(error)throw error;out.push(...data);if(data.length<1000)break}return out}
async function refresh(){let [clients,visits,types,incidents,comments,profiles]=await Promise.all(['customers','visits','incident_categories','incidents','customer_comments','profiles'].map(getAll));Object.assign(s,{clients,visits,types,incidents,comments,profiles});render()}
async function init(){let {data:{session}}=await db.auth.getSession();s.user=session?.user||null;if(s.user){let {data}=await db.from('profiles').select('role').eq('user_id',s.user.id).maybeSingle();s.admin=data?.role==='admin';try{await refresh()}catch(e){render();flash(e.message)}}else render()}
function csv(rows){return rows.map(r=>r.map(v=>{let x=String(v??'');if(/^[=+@\-]/.test(x))x="'"+x;return '"'+x.replace(/"/g,'""')+'"'}).join(';')).join('\r\n')}
function download(name,text){let url=URL.createObjectURL(new Blob(['\uFEFF',text],{type:'text/csv;charset=utf-8'})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
async function userApi(body){let {data:{session}}=await db.auth.getSession(),r=await fetch(host+'/functions/v1/csi-admin-users',{method:'POST',headers:{'Content-Type':'application/json',apikey:key,Authorization:'Bearer '+session.access_token},body:JSON.stringify(body)}),j=await r.json();if(!r.ok)throw Error(j.error||'Erro');return j}
const cols={'NIPC':'nif','NIF':'nif','Entidade':'name','C.P.':'postal_code','Distrito':'district','Conselho':'municipality','Concelho':'municipality','Freguesia':'parish','ZONA PAIS':'zone','Contacto 1':'phone','Contacto 1.1':'phone2','EMAIL Registo previo':'email','MAIL VISIOTECH':'email','Comercial interno':'commercial_internal','Nº do Registo Prévio':'registration_number','ABERTO SIM / NÃO':'opened','Faturação anual':'annual_billing','Faturação ano anterior':'prior_billing','Morada completa':'address','Última venda':'last_sale','ESTADO DA ATUALIZAÇÃO':'update_status'};
function toNum(v){let x=String(v||'').replace(/[^\d,.]/g,'');if(x.includes(',')&&x.includes('.'))x=x.lastIndexOf(',')>x.lastIndexOf('.')?x.replace(/\./g,'').replace(',','.'):x.replace(/,/g,'');else x=x.replace(',','.');return Number(x)||0}

const importColumns=['nif','name','postal_code','district','municipality','parish','zone','phone','phone2','email','address','commercial_internal','registration_number','opened','annual_billing','prior_billing','last_sale','update_status'];
function matchClientImport(d){return d.nif?s.clients.find(c=>c.nif===d.nif):s.clients.find(c=>c.extra?.source_key===d.source_key)}
function previewImportFile(rows){
 const map=new Map();let ignored=0,duplicates=0;
 for(let row of rows){
  let d={};for(const [column,key] of Object.entries(cols)){if(row[column]!==undefined&&String(row[column]).trim()!=='')d[key]=String(row[column]).trim()}
  if(!d.name){ignored++;continue}
  const digits=String(d.nif||'').replace(/[^0-9]/g,'');
  const stable=String(row.CSI_CHAVE||'').trim();
  const raw=String(row.CSI_NIF_ORIGINAL||row.NIPC||'').trim();
  let id=/^[0-9]{9}$/.test(digits)?digits:null;
  if(!id&&raw){const m=raw.match(/(?:^|[^0-9])([0-9]{9})(?:$|[^0-9])/);if(m)id=m[1]}
  if(id)d.nif=id;else delete d.nif;
  if(!id){d.source_key=stable||'legacy:'+d.name.toLocaleLowerCase('pt')+'|'+String(d.postal_code||'')+'|'+raw;}
  if(d.opened!==undefined)d.opened=/^(sim|aberto|aberto como mc|1|true|yes)$/i.test(String(d.opened));
  for(const k of ['annual_billing','prior_billing'])if(d[k]!==undefined)d[k]=toNum(d[k]);
  const key=id?'n:'+id:'k:'+d.source_key;
  if(map.has(key))duplicates++;
  map.set(key,{row_key:key,data:d});
 }
 const staged=[...map.values()];
 const found=staged.filter(x=>matchClientImport(x.data));
 const unchanged=found.filter(({data:d})=>importColumns.every(key=>{
   if(d[key]===undefined||d[key]==='')return true;
   let original=matchClientImport(d);
   return key==='opened'?Boolean(original[key])===Boolean(d[key]):key==='annual_billing'||key==='prior_billing'?Number(original[key]||0)===Number(d[key]||0):String(original[key]??'')===String(d[key]);
 })).length;
 const seen=new Set(found.map(x=>matchClientImport(x.data)?.id));
 const removed=s.clients.filter(c=>!seen.has(c.id)).length;
 return {staged,ignored:ignored+duplicates,unchanged,created:staged.length-found.length,updated:found.length-unchanged,removed};
}
async function importExcel(file){
 if(!s.admin)throw Error('Apenas administradores podem importar');
 if(!window.XLSX)throw Error('Biblioteca Excel indisponível');
 const mode=val('importmode')==='replace'?'replace':'merge';
 const w=XLSX.read(await file.arrayBuffer(),{type:'array'});
 const sheet=w.Sheets[w.SheetNames.find(x=>x.includes('BASE PRINCIPAL'))||w.SheetNames[0]];
 const dataRows=XLSX.utils.sheet_to_json(sheet,{defval:'',raw:false});
 const preview=previewImportFile(dataRows);
 if(!preview.staged.length)throw Error('O ficheiro não contém clientes utilizáveis');
 const impacts=mode==='replace'?preview.removed:0;
 const backup=()=>{const payload=JSON.stringify({created_at:new Date().toISOString(),customers:s.clients},null,2);const u=URL.createObjectURL(new Blob([payload],{type:'application/json'}));const anchor=document.createElement('a');anchor.href=u;anchor.download='CSI_Backup_Antes_Importacao_'+new Date().toISOString().slice(0,10)+'.json';anchor.click();setTimeout(()=>URL.revokeObjectURL(u),1500)};
 pop('<h2>Pré-visualização da importação</h2><p class="muted">'+E(file.name)+' · '+(mode==='replace'?'Substituir lista completa':'Atualizar e criar novos')+'</p><div class="import-summary"><div><b>'+preview.created+'</b><small>Novos</small></div><div><b>'+preview.updated+'</b><small>A atualizar</small></div><div><b>'+preview.ignored+'</b><small>Linhas ignoradas / repetidas</small></div><div><b>'+impacts+'</b><small>Retirados da lista ativa</small></div></div><p class="muted">'+preview.unchanged+' existentes sem alterações. A substituição mantém os históricos; os clientes ausentes ficam inativos, não são apagados.</p><div class="note">O servidor cria uma cópia de segurança antes de alterar os clientes. Em caso de falha, a importação não é aplicada parcialmente.</div><p><button type="button" class="btn" id="backupfile">↓ Guardar cópia local</button></p>'+(mode==='replace'?'<label>Para substituir, escreve SUBSTITUIR</label><input class="field" id="importconfirm" autocomplete="off" placeholder="SUBSTITUIR">':'')+'<button type="button" class="btn primary" id="runimport">Confirmar importação</button>');
 el('backupfile').onclick=backup;
 el('runimport').onclick=async()=>{
  const btn=el('runimport');btn.disabled=true;
  let sessionId=null;
  try{
   if(mode==='replace'&&val('importconfirm')!=='SUBSTITUIR')throw Error('Escreve SUBSTITUIR para confirmar');
   const stats={created:preview.created,updated:preview.updated,ignored:preview.ignored,removed:impacts,unchanged:preview.unchanged,file_name:file.name};
   let {data:id,error:startError}=await db.rpc('csi_begin_import',{p_mode:mode,p_count:preview.staged.length,p_stats:stats});
   if(startError)throw startError;sessionId=id;
   for(let i=0;i<preview.staged.length;i+=100){
    const {error}=await db.rpc('csi_stage_import',{p_backup:id,p_rows:preview.staged.slice(i,i+100)});
    if(error)throw error;
    btn.textContent='A preparar '+Math.min(i+100,preview.staged.length)+' / '+preview.staged.length;
   }
   btn.textContent='A aplicar alterações...';
   const {data:result,error:finishError}=await db.rpc('csi_complete_import',{p_backup:id,p_confirmation:mode==='replace'?'SUBSTITUIR':'CONFIRMAR'});
   if(finishError)throw finishError;
   close();await refresh();
   flash('Importação concluída: '+result.created+' novos, '+result.updated+' atualizados, '+result.archived+' inativos');
  }catch(err){btn.disabled=false;btn.textContent='Tentar novamente';flash('Importação não concluída: '+err.message)}
 };
}
async function importBackupsModal(){
 if(!s.admin)return;
 const {data,error}=await db.from('csi_import_backups').select('id,created_at,mode,status,rows_before,rows_in_file,stats').order('created_at',{ascending:false}).limit(15);
 if(error)throw error;
 pop('<h2>Cópias e reversão</h2><p class="muted">Só o administrador pode reverter. A operação é bloqueada se houver edições posteriores que possam perder-se.</p>'+(data.length?data.map(b=>'<div class="activity-entry"><b>'+new Date(b.created_at).toLocaleString('pt-PT')+'</b><p class="muted">'+(b.mode==='replace'?'Substituição completa':'Atualização')+' · '+b.rows_in_file+' registos · '+E(b.status)+'</p>'+(b.status==='completed'?'<button class="btn" data-act="revertimport" data-id="'+b.id+'">Reverter importação</button>':'')+'</div>').join(''):'<p>Nenhuma importação ainda.</p>'));
}

function peopleName(id,recorded){return recorded||s.profiles.find(p=>p.user_id===id)?.full_name||'Utilizador'}
function activityHistory(id){
const customer=s.clients.find(c=>c.id===id);if(!customer)return;
let history=[...s.visits.filter(v=>v.customer_id===id).map(v=>({kind:'Visita',at:v.visited_at,user:peopleName(v.user_id,v.visitor_name),note:v.comment})),
...s.comments.filter(c=>c.customer_id===id).map(c=>({kind:'Comentário',at:c.created_at,user:peopleName(c.user_id,c.author_name),note:c.body}))].sort((a,b)=>new Date(b.at)-new Date(a.at));
pop('<h2>Histórico — '+E(customer.name)+'</h2><p class="muted">'+history.length+' registos de atividade</p>'+(history.length?history.map(h=>'<div class="activity-entry"><div class="row between"><b>'+E(h.kind)+'</b><small>'+new Date(h.at).toLocaleString('pt-PT')+'</small></div><p class="muted">'+E(h.user)+'</p><p>'+E(h.note||'Visita sem comentário')+'</p></div>').join(''):'<p>Ainda não existem visitas nem comentários.</p>'));
}
function newIncidentModal(){
pop('<h2>Nova incidência</h2><form id="newincident"><label>Procurar cliente por nome ou NIF</label><input class="field" id="incidentsearch" placeholder="Escreve o nome ou NIF" autocomplete="off" required><div id="incidentmatches" class="matches"></div><input id="incidentcustomer" name="customer" type="hidden" required><p id="incidentselected" class="muted">Seleciona um cliente da lista.</p><label>Tipo de incidência</label><select class="field" id="incidentcategory" name="category" required>'+s.types.map(t=>'<option value="'+t.id+'">'+E(t.name)+'</option>').join('')+'<option value="__new">+ Criar novo tipo...</option></select><div id="newcategoryarea" class="hide"><label>Nome do novo tipo</label><input class="field" id="newcategoryname" placeholder="Escreve o tipo de incidência"></div><label>Assunto</label><input class="field" name="title" required maxlength="200"><label>Descrição da incidência</label><textarea class="field" name="description" rows="4" required></textarea><button class="btn primary">Guardar registo</button></form>');
}


const editFields=[['name','Empresa / Nome'],['phone','Telefone 1'],['phone2','Telefone 2'],['email','Email'],['address','Morada'],['postal_code','Código postal'],['district','Distrito'],['municipality','Concelho'],['parish','Freguesia'],['registration_number','Registo prévio']];
function editClient(id){
 let c=s.clients.find(x=>x.id===id);if(!c)return;
 let items=editFields.map(([k,label])=>'<label>'+E(label)+'</label>'+(k==='address'?'<textarea class="field" name="'+k+'" rows="3">'+E(c[k]||'')+'</textarea>':'<input class="field" name="'+k+'" value="'+E(c[k]||'')+'" '+(k==='name'?'required':'')+'>')).join('');
 pop('<h2>Editar cliente</h2><p class="muted">NIF: '+E(c.nif||'Sem NIF')+' · Alterações auditadas com data e utilizador</p><form id="editclient"><input type="hidden" name="clientid" value="'+id+'">'+items+'<label>Estado</label><select class="field" name="opened"><option value="true" '+(c.opened?'selected':'')+'>Aberto</option><option value="false" '+(!c.opened?'selected':'')+'>Por abrir</option></select><button class="btn primary">Guardar alterações</button></form>');
}
async function exportEdits(){
 const records=await getAll('customer_edits');
 const rows=[['Data','Empresa','NIF','Utilizador','Campo','Valor anterior','Valor novo']];
 for(const item of records){const c=s.clients.find(x=>x.id===item.customer_id),profile=s.profiles.find(x=>x.user_id===item.user_id),before=item.changed_fields?.before||{},after=item.changed_fields?.after||item.changed_fields||{};
 for(const [field,newValue] of Object.entries(after))rows.push([new Date(item.edited_at).toLocaleString('pt-PT'),c?.name||'',c?.nif||'',profile?.full_name||'Utilizador',field,typeof before[field]==='object'?JSON.stringify(before[field]):before[field]??'',typeof newValue==='object'?JSON.stringify(newValue):newValue??'']);
 }
 download('CSI_Clientes_Editados.csv',csv(rows));
 flash(records.length+' alterações exportadas');
}

document.addEventListener('change',e=>{if(['mapdistrict','mapmunicipality','mapparish','mapbilling','mapregistered','mapopened','mapvisited','maplocation'].includes(e.target.id)){const prop={mapdistrict:'mapDistrict',mapmunicipality:'mapMunicipality',mapparish:'mapParish',mapbilling:'mapBilling',mapregistered:'mapRegistered',mapopened:'mapOpened',mapvisited:'mapVisited',maplocation:'mapLocation'}[e.target.id];s[prop]=e.target.value;if(e.target.id==='mapdistrict'){s.mapMunicipality='';s.mapParish=''}if(e.target.id==='mapmunicipality')s.mapParish='';updateMapFilterUi()}if(['district','municipality','parish','opened','visited','registered','billing'].includes(e.target.id)){s[e.target.id]=e.target.value;if(e.target.id==='district'){s.municipality='';s.parish=''}if(e.target.id==='municipality')s.parish='';s.shown=30;render()}if(e.target.id==='incidentcategory'){el('newcategoryarea').classList.toggle('hide',e.target.value!=='__new')}if(e.target.id==='excel'&&e.target.files[0]){importExcel(e.target.files[0]).catch(e=>flash(e.message))}});
document.addEventListener('input',e=>{if(e.target.id==='routeorigin')s.routeOrigin=e.target.value;if(e.target.id==='mapsearch'){s.mapSearch=e.target.value;s.mapShown=40;const node=el('mapresults');if(node)node.innerHTML=mapResults()}if(e.target.id==='incidentsearch'){el('incidentcustomer').value='';el('incidentselected').textContent='Seleciona um cliente da lista.';let q=e.target.value.trim().toLocaleLowerCase('pt');let list=q.length>=2?s.clients.filter(c=>c.name.toLocaleLowerCase('pt').includes(q)||String(c.nif||'').includes(q)).slice(0,12):[];el('incidentmatches').innerHTML=list.map(c=>'<button type="button" class="match-option" data-act="pickclient" data-id="'+c.id+'">'+E(c.name)+' <small>'+E(c.nif||'Sem NIF')+'</small></button>').join('');}if(e.target.id==='search'){s.search=e.target.value;let a=filtered();el('count').textContent=a.length+' resultados';el('list').innerHTML=a.slice(0,s.shown).map(cust).join('')}});
document.addEventListener('submit',async e=>{e.preventDefault();let f=e.target;try{if(f.id==='login'){let {error}=await db.auth.signInWithPassword({email:f.email.value,password:f.password.value});if(error)throw error;await init()}if(f.id==='password'){let {error}=await db.auth.updateUser({password:f.password.value});if(error)throw error;close();flash('Password alterada')}if(f.id==='editclient'){const original=s.clients.find(c=>c.id===f.clientid.value);if(!original)throw Error('Cliente não encontrado');const changes={};for(const [key] of editFields){const nv=String(f.elements[key].value).trim();if(nv!==String(original[key]??''))changes[key]=nv;}const opened=f.elements.opened.value==='true';if(opened!==!!original.opened)changes.opened=opened;if(!Object.keys(changes).length){close();flash('Sem alterações');return;}const {error}=await db.rpc('csi_edit_customer',{p_id:original.id,p_changes:changes});if(error)throw error;close();await refresh();flash('Cliente atualizado e alteração registada')}
if(f.id==='visitform'){let {error}=await db.from('visits').insert({customer_id:f.customer.value,user_id:s.user.id,comment:f.comment.value.trim()||null});if(error)throw error;close();await refresh();flash('Visita registada com o teu utilizador')}
if(f.id==='commentform'){let {error}=await db.from('customer_comments').insert({customer_id:f.customer.value,user_id:s.user.id,body:f.comment.value.trim()});if(error)throw error;close();await refresh();flash('Comentário guardado')}
if(f.id==='newincident'){let customerId=el('incidentcustomer').value;if(!customerId||!s.clients.some(c=>c.id===customerId))throw Error('Seleciona um cliente válido');let category=f.category.value;
if(category==='__new'){let name=val('newcategoryname').trim();if(!name)throw Error('Indica o nome do novo tipo');let existing=s.types.find(t=>t.name.toLocaleLowerCase('pt')===name.toLocaleLowerCase('pt'));if(existing)category=existing.id;else{let {data,error}=await db.from('incident_categories').insert({name,created_by:s.user.id}).select('id').single();if(error)throw error;category=data.id;}}
let {error}=await db.from('incidents').insert({customer_id:customerId,title:f.title.value.trim(),description:f.description.value.trim(),category_id:category,created_by:s.user.id});if(error)throw error;close();await refresh();flash('Incidência registada')}if(f.id==='newuser'){await userApi({action:'create',email:f.email.value,name:f.fullname.value,password:f.password.value});close();flash('Conta criada')}if(f.id==='resetuser'){await userApi({action:'reset',user_id:f.userid.value,password:f.password.value});close();flash('Password alterada')}}catch(err){flash(err.message)}});
document.addEventListener('click',async e=>{let b=e.target.closest('[data-act]');if(!b)return;let a=b.dataset.act;try{if(a==='csicheck')await csiCheckForUpdate(true);if(a==='csiupdate')await csiApplyUpdate();if(a==='close')close();if(a==='theme')toggleTheme();if(a==='page'){s.page=b.dataset.page;render()}if(a==='quick'){Object.assign(s,{page:'clients',quick:b.dataset.type,search:'',district:'',municipality:'',parish:'',billing:'all',opened:'all',registered:'all',visited:'all'});render()}if(a==='clear'){Object.assign(s,{search:'',quick:'',district:'',municipality:'',parish:'',billing:'all',opened:'all',registered:'all',visited:'all'});render()}if(a==='more'){s.shown+=30;render()}if(a==='routeadd')changeRoute(b.dataset.id,'add');if(a==='routeremove')changeRoute(b.dataset.id,'remove');if(a==='routeup')changeRoute(b.dataset.id,'up');if(a==='routedown')changeRoute(b.dataset.id,'down');if(a==='routeclear'){s.routeIds=[];refreshRoute()}if(a==='routeopen')openRoute();if(a==='routewaze')openWazeNextStop();if(a==='routewazestop')openWazeForCustomer(b.dataset.id);if(a==='routecsv')routeCsv();if(a==='mapreset'){Object.assign(s,{mapSearch:'',mapDistrict:'',mapMunicipality:'',mapParish:'',mapBilling:'all',mapOpened:'all',mapRegistered:'all',mapVisited:'all',mapLocation:'all'});for(const [id,value] of Object.entries({mapsearch:'',mapdistrict:'',mapmunicipality:'',mapparish:'',mapbilling:'all',mapopened:'all',mapregistered:'all',mapvisited:'all',maplocation:'all'})){let n=el(id);if(n)n.value=value}updateMapFilterUi()}if(a==='mapmore'){s.mapShown+=40;const list=el('mapresults');if(list)list.innerHTML=mapResults()}if(a==='maplocate')await locateCustomerOnMap(b.dataset.id);if(a==='mapclear')clearMap();if(a==='visitscsv')exportMyVisits(b.dataset.period==='month'?'month':'week');if(a==='logout'){await db.auth.signOut();s.user=null;render()}if(a==='password')pop('<h2>Alterar password</h2><form id="password"><input class="field" type="password" name="password" minlength="8" required><button class="btn primary">Guardar</button></form>');if(a==='forgot'){pop('<h2>Recuperar palavra-passe</h2><input class="field" type="email" id="resetemail" placeholder="Email"><button class="btn primary" id="sendemail">Enviar</button>');el('sendemail').onclick=async()=>{let {error}=await db.auth.resetPasswordForEmail(val('resetemail'),{redirectTo:location.href.split('#')[0]});flash(error?error.message:'Confirma o email');if(!error)close()}}if(a==='call'){const client=s.clients.find(c=>c.id===b.dataset.id);if(!client)return;let numbers=[client.phone,client.phone2].map(x=>String(x||'').trim()).filter(Boolean);if(numbers.length===0){flash('Este cliente não tem telefone registado');return;}if(numbers.length===1){location.href='tel:'+numbers[0].replace(/[^0-9+]/g,'');return;}pop('<h2>Ligar a '+E(client.name)+'</h2>'+numbers.map(number=>'<p><a class="btn primary" style="display:block;text-align:center;text-decoration:none" href="tel:'+E(number.replace(/[^0-9+]/g,''))+'">☎ '+E(number)+'</a></p>').join(''))}
if(a==='address'){const c=s.clients.find(c=>c.id===b.dataset.id);if(!c)return;const address=[c.address,c.postal_code,c.parish,c.municipality,c.district].filter(Boolean);const lookup=address.join(', ');pop('<h2>Morada do cliente</h2><p class="muted">'+E(c.name)+'</p><div class="address-detail">'+(c.address?'<p>'+E(c.address).replace(/\\n/g,'<br>')+'</p>':'<p class="muted">Morada completa não registada.</p>')+'<p><b>Código postal:</b> '+E(c.postal_code||'Não indicado')+'</p><p><b>Freguesia:</b> '+E(c.parish||'Não indicada')+'</p><p><b>Concelho:</b> '+E(c.municipality||'Não indicado')+'</p><p><b>Distrito:</b> '+E(c.district||'Não indicado')+'</p></div>'+(lookup?'<a class="btn primary" target="_blank" rel="noopener" style="display:block;text-align:center;text-decoration:none;margin-top:12px" href="https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(lookup)+'">Abrir no mapa ↗</a>':'')+(s.user?'<p><button class="btn" data-act="edit" data-id="'+c.id+'">✎ Editar morada</button></p>':''));}
if(a==='edit')editClient(b.dataset.id);
if(a==='editscsv'&&s.admin)await exportEdits();
if(a==='visit'){let c=s.clients.find(c=>c.id===b.dataset.id);if(!c)return;pop('<h2>Registar visita</h2><p class="muted">'+E(c.name)+'</p><form id="visitform"><input type="hidden" name="customer" value="'+c.id+'"><label>Comentário da visita (opcional)</label><textarea class="field" name="comment" rows="4" maxlength="4000" placeholder="Assuntos abordados, próximos passos..."></textarea><button class="btn primary">Guardar visita</button></form>')}
if(a==='comment'){let c=s.clients.find(c=>c.id===b.dataset.id);if(!c)return;pop('<h2>Novo comentário</h2><p class="muted">'+E(c.name)+'</p><form id="commentform"><input type="hidden" name="customer" value="'+c.id+'"><label>Comentário</label><textarea class="field" name="comment" rows="5" maxlength="4000" required placeholder="Escreve aqui o comentário do cliente..."></textarea><button class="btn primary">Guardar comentário</button></form>')}
if(a==='history')activityHistory(b.dataset.id);
if(a==='newincident')newIncidentModal();
if(a==='pickclient'){let c=s.clients.find(c=>c.id===b.dataset.id);if(!c)return;el('incidentcustomer').value=c.id;el('incidentsearch').value=c.name;el('incidentselected').textContent='Cliente selecionado: '+c.name+(c.nif?' · '+c.nif:'');el('incidentmatches').innerHTML=''}
if(a==='incsv')download('CSI_Incidencias.csv',csv([['Tipo','Cliente','NIF','Assunto','Descrição','Data','Registado por'],...s.incidents.map(i=>{let c=s.clients.find(x=>x.id===i.customer_id);return [s.types.find(t=>t.id===i.category_id)?.name,c?.name||'',c?.nif||'',i.title,i.description,i.created_at,peopleName(i.created_by)]})]));if(a==='export'&&s.admin){const labels=[['NIPC','nif'],['Entidade','name'],['ABERTO SIM / NÃO','opened'],['Nº do Registo Prévio','registration_number'],['ZONA PAIS','zone'],['C.P.','postal_code'],['Distrito','district'],['Conselho','municipality'],['Freguesia','parish'],['Contacto 1','phone'],['Contacto 1.1','phone2'],['EMAIL Registo previo','email'],['Morada completa','address'],['Comercial interno','commercial_internal'],['Faturação anual','annual_billing'],['Faturação ano anterior','prior_billing'],['Última venda','last_sale'],['ESTADO DA ATUALIZAÇÃO','update_status']];const rows=[labels.map(x=>x[0]).concat(['CSI_CHAVE','CSI_NIF_ORIGINAL'])];for(const c of s.clients){rows.push(labels.map(([label,key])=>key==='opened'?(c.opened?'SIM':'NÃO'):c[key]??'').concat([c.extra?.source_key||'',c.extra?.source_nif_raw||'']))}download('CSI_Clientes_Completo.csv',csv(rows))}if(a==='import'&&s.admin)pop('<h2>Importação segura de clientes</h2><p>Antes de gravar, o sistema mostra todos os impactos da atualização.</p><label>Modo de importação</label><select class="field" id="importmode"><option value="merge">Atualizar existentes e criar novos</option><option value="replace">Substituir lista ativa completa</option></select><div class="note">Substituir significa retirar da lista ativa clientes ausentes no Excel, não apagar o histórico de visitas, comentários ou incidências.</div><label>Ficheiro Excel</label><input class="field" type="file" id="excel" accept=".xlsx,.xls,.csv"><p><button class="btn" data-act="backups">Ver cópias e reverter</button></p>');if(a==='backups'&&s.admin)await importBackupsModal();if(a==='revertimport'&&s.admin){const id=b.dataset.id;pop('<h2>Reverter importação</h2><p>Esta ação restaura os dados anteriores dos clientes e mantém os registos de visitas e incidências.</p><label>Escreve REVERTER</label><input class="field" id="revertconfirmation" placeholder="REVERTER"><button class="btn primary" id="revertbutton">Confirmar reversão</button>');el('revertbutton').onclick=async()=>{if(val('revertconfirmation')!=='REVERTER'){flash('Escreve REVERTER');return;}el('revertbutton').disabled=true;const {data,error}=await db.rpc('csi_revert_import',{p_backup:id,p_confirmation:'REVERTER'});if(error){flash(error.message);el('revertbutton').disabled=false;return;}close();await refresh();flash('Reversão concluída: '+data.restored+' clientes restaurados')}}if(a==='users'&&s.admin){let u=await userApi({action:'list'});pop('<h2>Utilizadores</h2><form id="newuser"><label>Nome</label><input class="field" name="fullname" required><label>Email</label><input class="field" name="email" type="email" required><label>Password inicial (8+)</label><input class="field" name="password" type="password" minlength="8" required><button class="btn primary">Criar</button></form><hr>'+u.users.map(x=>'<p class="row between"><small>'+E(x.email)+'</small><button class="btn" data-act="reset" data-id="'+x.id+'">Password</button></p>').join(''))}if(a==='reset'&&s.admin)pop('<h2>Alterar password de utilizador</h2><form id="resetuser"><input type="hidden" name="userid" value="'+E(b.dataset.id)+'"><input class="field" type="password" name="password" minlength="8" required><button class="btn primary">Guardar</button></form>')}catch(err){flash(err.message)}});
db.auth.onAuthStateChange((ev,session)=>{if(ev==='PASSWORD_RECOVERY'&&session){s.user=session.user;setTimeout(()=>{render();pop('<h2>Nova password</h2><form id="password"><input class="field" name="password" type="password" minlength="8" required><button class="btn primary">Guardar</button></form>')},300)}});init();csiWatchVersions();
