const WHATSAPP_PHONE = '971500000000';

const tickets = [
  { id:'general', name:'General Pass', price:79, perks:'Entry + expo access' },
  { id:'premium', name:'Premium Pass', price:149, perks:'Priority lane + gift bag' },
  { id:'vip', name:'VIP Pass', price:299, perks:'VIP lounge + collector print' },
];

const qty = { general:0, premium:0, vip:0 };
const cardsEl = document.getElementById('ticketCards');
const summaryEl = document.getElementById('summary');
const totalEl = document.getElementById('total');

function animateCounter(id, to, ms=1100){
  const el = document.getElementById(id);
  const from = 0;
  const start = performance.now();
  function frame(now){
    const p = Math.min((now-start)/ms,1);
    const val = Math.floor(from + (to-from)*p);
    el.textContent = val.toLocaleString();
    if(p<1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

function renderCards(){
  cardsEl.innerHTML = tickets.map(t => `
    <article class="card">
      <h3>${t.name}</h3>
      <div class="price">AED ${t.price}</div>
      <p class="meta">${t.perks}</p>
      <div class="qty">
        <button data-dec="${t.id}">-</button>
        <strong>${qty[t.id]}</strong>
        <button data-inc="${t.id}">+</button>
      </div>
    </article>
  `).join('');
}

function renderSummary(){
  const lines=[]; let total=0;
  tickets.forEach(t=>{
    if(qty[t.id]>0){
      const lineTotal=qty[t.id]*t.price;
      lines.push(`• ${t.name} x${qty[t.id]} = AED ${lineTotal}`);
      total += lineTotal;
    }
  });
  summaryEl.textContent = lines.length ? lines.join('\n') : 'No tickets selected.';
  totalEl.textContent = `AED ${total}`;
}

cardsEl.addEventListener('click', (e)=>{
  const inc = e.target.getAttribute('data-inc');
  const dec = e.target.getAttribute('data-dec');
  if(inc){ qty[inc] += 1; }
  if(dec){ qty[dec] = Math.max(qty[dec]-1,0); }
  renderCards();
  renderSummary();
});

document.getElementById('waCheckout').addEventListener('click', ()=>{
  const chosen = tickets.filter(t=>qty[t.id]>0);
  if(!chosen.length) return alert('Please select at least one ticket.');

  const lines = chosen.map(t=>`- ${t.name} x${qty[t.id]} (AED ${qty[t.id]*t.price})`);
  const total = chosen.reduce((s,t)=> s + qty[t.id]*t.price, 0);
  const msg = ['Hi, I want to book these tickets:', ...lines, `Total: AED ${total}`, 'Please confirm payment options.'].join('\n');
  window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
});

animateCounter('visitors', 12000);
animateCounter('days', 14, 900);
animateCounter('spots', 180, 900);
renderCards();
renderSummary();