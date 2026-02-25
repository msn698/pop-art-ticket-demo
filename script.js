const WHATSAPP_PHONE = '971500000000';
const REDIRECT_URL = 'https://msaeed.tech';

const tickets = [
  { id:'general', name:'General Pass', price:79, perks:'Entry + expo access' },
  { id:'premium', name:'Premium Pass', price:149, perks:'Priority lane + gift bag' },
  { id:'vip', name:'VIP Pass', price:299, perks:'VIP lounge + collector print' },
];

const qty = { general:0, premium:0, vip:0 };
const cardsEl = document.getElementById('ticketCards');
const summaryEl = document.getElementById('summary');
const totalEl = document.getElementById('total');

const modalEl = document.getElementById('redirectModal');
const goNowBtn = document.getElementById('goNow');
const cancelRedirectBtn = document.getElementById('cancelRedirect');
const contactForm = document.getElementById('contactForm');
let redirectTimer = null;

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
        <button data-dec="${t.id}" aria-label="Decrease ${t.name}">-</button>
        <strong>${qty[t.id]}</strong>
        <button data-inc="${t.id}" aria-label="Increase ${t.name}">+</button>
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

function openRedirectModal(){
  modalEl.hidden = false;
  if (redirectTimer) clearTimeout(redirectTimer);
  redirectTimer = setTimeout(() => {
    window.open(REDIRECT_URL, '_blank', 'noopener,noreferrer');
    closeRedirectModal();
  }, 1700);
}

function closeRedirectModal(){
  modalEl.hidden = true;
  if (redirectTimer) {
    clearTimeout(redirectTimer);
    redirectTimer = null;
  }
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

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  openRedirectModal();
});

goNowBtn.addEventListener('click', () => {
  window.open(REDIRECT_URL, '_blank', 'noopener,noreferrer');
  closeRedirectModal();
});

cancelRedirectBtn.addEventListener('click', closeRedirectModal);

modalEl.addEventListener('click', (e) => {
  if (e.target === modalEl) closeRedirectModal();
});

animateCounter('visitors', 12000);
animateCounter('days', 14, 900);
animateCounter('spots', 180, 900);
renderCards();
renderSummary();
