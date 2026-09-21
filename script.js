const movies=[
{id:1,title:"A Última Aventura",genre:"Aventura",age:"12",duration:"2h 08min",icon:"🏔️",sessions:["14:00","17:00","20:00"]},
{id:2,title:"Noite no Espaço",genre:"Ficção",age:"10",duration:"1h 52min",icon:"🚀",sessions:["15:30","18:30","21:30"]},
{id:3,title:"O Mistério da Casa",genre:"Suspense",age:"14",duration:"1h 45min",icon:"🏚️",sessions:["16:00","19:00","22:00"]},
{id:4,title:"Amigos de Quatro Patas",genre:"Família",age:"Livre",duration:"1h 38min",icon:"🐶",sessions:["13:30","16:30","19:30"]}
];
const moviesEl=document.querySelector("#movies"), filter=document.querySelector("#filterGenre"), modal=document.querySelector("#modal"), content=document.querySelector("#modalContent");
[...new Set(movies.map(m=>m.genre))].forEach(g=>filter.insertAdjacentHTML("beforeend",`<option>${g}</option>`));
function renderMovies(){
 const f=filter.value;
 moviesEl.innerHTML=movies.filter(m=>f==="todos"||m.genre===f).map(m=>`
 <article class="movie"><div class="poster">${m.icon}</div><div class="movie-body">
 <h3>${m.title}</h3><div class="meta">${m.genre} · ${m.age} · ${m.duration}</div>
 <button onclick="openMovie(${m.id})">Comprar ingresso</button></div></article>`).join("");
}
filter.onchange=renderMovies; renderMovies();
document.querySelector("#closeModal").onclick=()=>modal.classList.add("hidden");
modal.onclick=e=>{if(e.target===modal)modal.classList.add("hidden")};

let selectedMovie, selectedSession, selectedSeats=[];
function openMovie(id){
 selectedMovie=movies.find(m=>m.id===id); selectedSession=null; selectedSeats=[];
 content.innerHTML=`<span class="eyebrow">INGRESSO</span><h2>${selectedMovie.title}</h2>
 <p class="meta">${selectedMovie.genre} · classificação ${selectedMovie.age} · ${selectedMovie.duration}</p>
 <h3>1. Escolha a sessão</h3><div class="session-list">${selectedMovie.sessions.map(s=>`<button class="session" onclick="chooseSession('${s}',this)">${s}</button>`).join("")}</div>
 <div id="seatArea"><p class="empty">Selecione um horário para visualizar os assentos.</p></div>`;
 modal.classList.remove("hidden");
}
function chooseSession(s,el){
 selectedSession=s; selectedSeats=[]; document.querySelectorAll(".session").forEach(x=>x.classList.remove("active")); el.classList.add("active");
 const taken=[3,7,14,21,28,34,45];
 document.querySelector("#seatArea").innerHTML=`<h3>2. Escolha seus assentos</h3><div class="screen"></div><div class="seats">${Array.from({length:48},(_,i)=>`<button class="seat ${taken.includes(i+1)?"taken":""}" ${taken.includes(i+1)?"disabled":""} onclick="toggleSeat(${i+1},this)">${i+1}</button>`).join("")}</div><div class="summary"><span><b id="seatCount">0</b> assento(s) · <b id="total">R$ 0,00</b></span><button class="checkout" onclick="checkout()">Continuar</button></div>`;
}
function toggleSeat(n,el){if(el.classList.contains("taken"))return;if(selectedSeats.includes(n)){selectedSeats=selectedSeats.filter(x=>x!==n);el.classList.remove("selected")}else{selectedSeats.push(n);el.classList.add("selected")}document.querySelector("#seatCount").textContent=selectedSeats.length;document.querySelector("#total").textContent=money(selectedSeats.length*28)}
function money(v){return v.toLocaleString("pt-BR",{style:"currency",currency:"BRL"})}
function checkout(){
 if(!selectedSession||!selectedSeats.length){alert("Escolha pelo menos um assento.");return}
 const code="CF-"+Math.random().toString(36).slice(2,8).toUpperCase();
 const ticket={code,movie:selectedMovie.title,session:selectedSession,seats:[...selectedSeats],total:selectedSeats.length*28,date:new Date().toLocaleString("pt-BR")};
 const orders=JSON.parse(localStorage.getItem("cineFacilOrders")||"[]"); orders.unshift(ticket); localStorage.setItem("cineFacilOrders",JSON.stringify(orders));
 content.innerHTML=`<div class="ticket"><span class="eyebrow">INGRESSO CONFIRMADO</span><h2>🎟️ ${ticket.movie}</h2><p><b>Sessão:</b> ${ticket.session}</p><p><b>Assentos:</b> ${ticket.seats.join(", ")}</p><p><b>Total:</b> ${money(ticket.total)}</p><div class="code">${ticket.code}</div><p class="meta">Apresente este código na entrada. Demonstração sem pagamento real.</p></div>`;
}
document.querySelector("#ordersBtn").onclick=()=>{
 const orders=JSON.parse(localStorage.getItem("cineFacilOrders")||"[]");
 content.innerHTML=`<span class="eyebrow">HISTÓRICO</span><h2>Meus ingressos</h2>`+
 (orders.length?orders.map(o=>`<div class="ticket" style="margin:12px 0"><b>${o.movie}</b><br>Sessão: ${o.session} · Assentos: ${o.seats.join(", ")}<br>Total: ${money(o.total)}<div class="code">${o.code}</div></div>`).join(""):"<p class='empty'>Nenhum ingresso salvo neste navegador.</p>");
 modal.classList.remove("hidden");
};