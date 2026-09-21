const DEFAULT_MOVIES=[
{id:1,title:"A Última Aventura",genre:"Aventura",age:"12",duration:"2h 08min",icon:"🏔️",color:"#7d251f",price:28,sessions:["14:00","17:00","20:00"]},
{id:2,title:"Noite no Espaço",genre:"Ficção",age:"10",duration:"1h 52min",icon:"🚀",color:"#253a73",price:28,sessions:["15:30","18:30","21:30"]},
{id:3,title:"O Mistério da Casa",genre:"Suspense",age:"14",duration:"1h 45min",icon:"🏚️",color:"#38412e",price:30,sessions:["16:00","19:00","22:00"]},
{id:4,title:"Amigos de Quatro Patas",genre:"Família",age:"Livre",duration:"1h 38min",icon:"🐶",color:"#78552b",price:24,sessions:["13:30","16:30","19:30"]}
];
const KEY="cineFacilV2";
const state=load();
function load(){let x=JSON.parse(localStorage.getItem(KEY)||"null");if(!x)x={movies:DEFAULT_MOVIES,orders:[]};return x}
function save(){localStorage.setItem(KEY,JSON.stringify(state))}
const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);
const money=n=>n.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
function toast(t){let e=$("#toast");e.textContent=t;e.classList.add("show");setTimeout(()=>e.classList.remove("show"),2500)}
function openModal(html){$("#modalContent").innerHTML=html;$("#modal").classList.remove("hidden")}
$("#modalClose").onclick=()=>$("#modal").classList.add("hidden");
$("#modal").onclick=e=>{if(e.target.id==="modal")e.currentTarget.classList.add("hidden")};

function renderFilters(){let genres=[...new Set(state.movies.map(x=>x.genre))];$("#genre").innerHTML='<option value="all">Todos os gêneros</option>'+genres.map(g=>`<option>${g}</option>`).join("")}
function renderMovies(){
 const q=$("#search").value.toLowerCase(),g=$("#genre").value;
 let list=state.movies.filter(m=>(g==="all"||m.genre===g)&&m.title.toLowerCase().includes(q));
 $("#movies").innerHTML=list.map(m=>`<article class="movie">
 <div class="poster" style="--c:${m.color}"><span class="poster-icon">${m.icon}</span><span class="age">${m.age}</span></div>
 <div class="movie-body"><h3 class="movie-title">${m.title}</h3><div class="meta">${m.genre} · ${m.duration} · ${money(m.price)}</div>
 <div class="times">${m.sessions.map(s=>`<button class="time" onclick="booking(${m.id},'${s}')">${s}</button>`).join("")}</div>
 <button class="movie-buy" onclick="booking(${m.id},'${m.sessions[0]}')">Escolher assento</button></div></article>`).join("")||'<div class="empty">Nenhum filme encontrado.</div>';
}
$("#search").oninput=renderMovies;$("#genre").onchange=renderMovies;

let current={movie:null,session:null,seats:[]};
function booking(id,session){
 current={movie:state.movies.find(m=>m.id===id),session,seats:[]};
 const taken=[3,7,14,21,28,34,41,45];
 openModal(`<span class="eyebrow">RESERVA</span><h2>${current.movie.title}</h2><p class="meta">${current.movie.genre} · ${current.movie.duration} · ${session}</p>
 <h3>1. Escolha a sessão</h3><div class="session-grid">${current.movie.sessions.map(s=>`<button class="session-btn ${s===session?"active":""}" onclick="changeSession('${s}')">${s}</button>`).join("")}</div>
 <h3>2. Escolha seus assentos</h3><div class="screen"></div><div class="seats">${Array.from({length:48},(_,i)=>{let n=i+1;return `<button class="seat ${taken.includes(n)?"taken":""}" ${taken.includes(n)?"disabled":""} onclick="toggleSeat(${n},this)">${n}</button>`}).join("")}</div>
 <div class="checkout-bar"><div><b id="seatCount">0</b> assento(s) · <b id="total">${money(0)}</b></div><button class="checkout" onclick="customerForm()">Continuar →</button></div>`);
}
function changeSession(s){current.session=s;booking(current.movie.id,s)}
function toggleSeat(n,el){if(current.seats.includes(n)){current.seats=current.seats.filter(x=>x!==n);el.classList.remove("selected")}else{if(current.seats.length>=8)return toast("Limite de 8 assentos por compra.");current.seats.push(n);el.classList.add("selected")}$("#seatCount").textContent=current.seats.length;$("#total").textContent=money(current.seats.length*current.movie.price)}
function customerForm(){
 if(!current.seats.length)return toast("Selecione pelo menos um assento.");
 openModal(`<span class="eyebrow">FINALIZAÇÃO</span><h2>Dados do cliente</h2><p class="meta">${current.movie.title} · ${current.session} · ${current.seats.length} ingresso(s)</p>
 <div class="form-grid"><label class="full">Nome completo<input id="custName" placeholder="Seu nome"></label><label>E-mail<input id="custEmail" type="email" placeholder="voce@email.com"></label><label>Telefone<input id="custPhone" placeholder="(00) 00000-0000"></label></div>
 <div class="checkout-bar"><div>Total <b>${money(current.seats.length*current.movie.price)}</b></div><button class="checkout" onclick="finishOrder()">Confirmar reserva</button></div>`);
}
function finishOrder(){
 let name=$("#custName").value.trim(),email=$("#custEmail").value.trim();
 if(!name||!email)return toast("Preencha nome e e-mail.");
 let code="CF-"+Math.random().toString(36).slice(2,8).toUpperCase();
 let order={id:Date.now(),code,name,email,movie:current.movie.title,movieId:current.movie.id,session:current.session,seats:[...current.seats],total:current.seats.length*current.movie.price,date:new Date().toLocaleString("pt-BR"),status:"Reservado"};
 state.orders.unshift(order);save();
 openModal(`<div class="success"><div class="big">🎟️</div><span class="eyebrow">RESERVA CONFIRMADA</span><h2>Seu ingresso está pronto!</h2><div class="ticket"><p><b>${order.movie}</b></p><p>Sessão: ${order.session}<br>Assentos: ${order.seats.join(", ")}<br>Cliente: ${order.name}<br>Total: ${money(order.total)}</p><div class="ticket-code">${order.code}</div><p class="meta">Apresente o código na entrada. Nesta V2 o pagamento ainda é demonstrativo.</p></div><br><button class="checkout" onclick="window.print()">Imprimir ingresso</button></div>`);
 toast("Ingresso gerado com sucesso.");
}
$("#myTickets").onclick=()=>{
 let rows=state.orders.map(o=>`<div class="ticket" style="margin:10px 0"><b>${o.movie}</b><br><span class="meta">${o.date} · ${o.session} · Assentos ${o.seats.join(", ")} · ${money(o.total)}</span><div class="ticket-code">${o.code}</div></div>`).join("");
 openModal(`<span class="eyebrow">ÁREA DO CLIENTE</span><h2>Meus ingressos</h2>${rows||'<p class="meta">Nenhum ingresso encontrado neste navegador.</p>'}`);
};

$("#adminOpen").onclick=admin;
function admin(){
 openModal(`<span class="eyebrow">ADMINISTRAÇÃO</span><h2>Painel Cine Fácil</h2><p class="meta">Demonstração local. Os dados ficam neste navegador.</p>
 <div class="admin-tabs"><button class="tab active" onclick="adminDashboard()">Vendas</button><button class="tab" onclick="adminMovies()">Filmes</button></div><div id="adminArea"></div>`);
 adminDashboard();
}
function adminDashboard(){
 let total=state.orders.reduce((s,o)=>s+o.total,0);
 $("#adminArea").innerHTML=`<div class="benefits" style="padding:0;grid-template-columns:repeat(3,1fr)"><div class="benefit"><span>🎟️</span><h3>${state.orders.length}</h3><p>Ingressos</p></div><div class="benefit"><span>💰</span><h3>${money(total)}</h3><p>Reservas</p></div><div class="benefit"><span>🎬</span><h3>${state.movies.length}</h3><p>Filmes</p></div></div>
 <table class="admin-table"><tr><th>Código</th><th>Filme</th><th>Sessão</th><th>Cliente</th><th>Total</th></tr>${state.orders.map(o=>`<tr><td>${o.code}</td><td>${o.movie}</td><td>${o.session}</td><td>${o.name}</td><td>${money(o.total)}</td></tr>`).join("")||'<tr><td colspan="5">Sem vendas.</td></tr>'}</table>`;
}
function adminMovies(){
 $("#adminArea").innerHTML=`<h3>Cadastrar filme</h3><div class="form-grid"><label>Título<input id="mTitle"></label><label>Gênero<input id="mGenre"></label><label>Classificação<input id="mAge" value="Livre"></label><label>Duração<input id="mDuration" value="1h 40min"></label><label>Preço<input id="mPrice" type="number" value="28"></label><label>Ícone<input id="mIcon" value="🎬"></label><label class="full">Sessões (separadas por vírgula)<input id="mSessions" value="14:00, 17:00, 20:00"></label></div><br><button class="checkout" onclick="addMovie()">Adicionar filme</button><h3 style="margin-top:30px">Filmes cadastrados</h3><table class="admin-table"><tr><th>Filme</th><th>Gênero</th><th>Preço</th><th>Ação</th></tr>${state.movies.map(m=>`<tr><td>${m.icon} ${m.title}</td><td>${m.genre}</td><td>${money(m.price)}</td><td><button class="tab" onclick="deleteMovie(${m.id})">Excluir</button></td></tr>`).join("")}</table>`;
}
function addMovie(){
 let title=$("#mTitle").value.trim(),genre=$("#mGenre").value.trim();
 if(!title||!genre)return toast("Informe título e gênero.");
 state.movies.push({id:Date.now(),title,genre,age:$("#mAge").value,duration:$("#mDuration").value,price:Number($("#mPrice").value)||28,icon:$("#mIcon").value||"🎬",color:"#263247",sessions:$("#mSessions").value.split(",").map(x=>x.trim()).filter(Boolean)});
 save();renderFilters();renderMovies();adminMovies();toast("Filme cadastrado.");
}
function deleteMovie(id){if(state.movies.length<=1)return toast("Mantenha pelo menos um filme.");state.movies=state.movies.filter(m=>m.id!==id);save();renderFilters();renderMovies();adminMovies();toast("Filme excluído.")}
renderFilters();renderMovies();
