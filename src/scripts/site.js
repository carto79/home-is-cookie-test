const menu=document.querySelector('#mobile-menu');
const openMenu=document.querySelector('#menu-open');
if(menu instanceof HTMLDialogElement && openMenu){
 openMenu.addEventListener('click',()=>{menu.showModal();openMenu.setAttribute('aria-expanded','true');});
 document.querySelector('#menu-close')?.addEventListener('click',()=>menu.close());
 menu.addEventListener('close',()=>{openMenu.setAttribute('aria-expanded','false');openMenu.focus();});
}
const estimator=document.querySelector('#box-estimator');
if(estimator instanceof HTMLFormElement){
 const tier=document.querySelector('#box-tier'),count=document.querySelector('#box-count'),total=document.querySelector('#estimate-total'),error=document.querySelector('#estimate-error');
 const update=()=>{const n=Number(count.value);const valid=Number.isInteger(n)&&n>=10&&n<=100000;error.textContent=valid?'':'Enter a whole number of at least 10 boxes.';count.setAttribute('aria-invalid',String(!valid));total.textContent=valid?new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(n*Number(tier.selectedOptions[0].dataset.price)):'—';return valid;};
 count.addEventListener('input',update);tier.addEventListener('change',update);
 estimator.addEventListener('submit',e=>{e.preventDefault();if(update())location.href='/order/?'+new URLSearchParams({type:'corporate',box:tier.value,quantity:count.value});else count.focus();});
}
const summary=document.querySelector('#order-summary');
if(summary instanceof HTMLTextAreaElement){
 const params=new URLSearchParams(location.search),type=params.get('type')==='everyday'?'tray':params.get('type')||'general';
 const names={corporate:'Corporate cookie gifts',logo:'Logo & photo cookies',sandwich:'Sandwich cookies',tray:'Three-Dozen Tray',stuffed:'Stuffed cookies',cake:'Cookie cake',general:'Cookie order'};
 const name=names[type]||names.general;
 document.querySelector('#summary-title').textContent=name;
 document.querySelectorAll('[data-order-type]').forEach(a=>a.setAttribute('aria-current',String(a.dataset.orderType===type)));
 let lines=[`I'd like to request: ${name}.`];
 const qty=Number(params.get('quantity'));const box=params.get('box');const prices={Sampler:10,Classic:13,Party:16};
 if(type==='corporate' && prices[box]){const n=Number.isInteger(qty)&&qty>=10&&qty<=100000?qty:10;lines.push(`${n} ${box} boxes × $${prices[box]} = $${n*prices[box]} merchandise estimate.`,`Each box: 1 stuffed cookie + ${box==='Sampler'?4:box==='Classic'?6:8} mini cookies.`);}
 else if(type==='corporate')lines.push('Corporate boxes have a 10-box minimum. Please help confirm a box style.');
 if(type==='logo'){const n=Number.isInteger(qty)&&qty>=12&&qty<=100000?qty:12;lines.push(`${n} printed cookies × $5 = $${n*5} merchandise estimate. Printing and artwork setup included.`);}
 if(type==='stuffed'){const n=Number.isInteger(qty)&&qty>=6&&qty<=100000?qty:6;lines.push(`${n} stuffed cookies × $5 = $${n*5} merchandise estimate. Please confirm flavors.`);}
 if(type==='sandwich'){const n=Number.isInteger(qty)&&qty>=6&&qty<=100000?qty:6;lines.push(`${n} sandwich cookies × $5 = $${n*5} merchandise estimate. Six-cookie minimum.`,`Flavors: Chocolate Chip with Vanilla Creme; Chocolate Chip with Nutella Spread; Peanut Butter with Peanut Butter Creme. Please confirm my flavor choices.`);}
 if(type==='tray')lines.push('36-cookie sharing tray: $50 merchandise. Please confirm preferred flavors.');
 if(params.get('area')==='Sun City Center')lines.push('Requested delivery area: Sun City Center, FL 33573. Please confirm address eligibility and date.');
 if(type==='corporate'||type==='logo')lines.push('For corporate orders, I understand at least two weeks’ notice is required.');
 lines.push('Please confirm availability, the final total including any applicable tax and delivery, and pickup or delivery arrangements before payment.');
 summary.value=lines.join('\n\n');
 document.querySelector('#copy-summary').addEventListener('click',async()=>{const status=document.querySelector('#copy-status');try{await navigator.clipboard.writeText(summary.value);status.textContent='Copied. Paste these details into your Jotform request.';}catch{summary.focus();summary.select();status.textContent='Select and copy the highlighted details, then paste them into Jotform.';}});
}
const galleryButtons=[...document.querySelectorAll('.gallery-open')];
let currentPhoto=0,activePhotos=galleryButtons;
const lightbox=document.querySelector('#lightbox');
if(lightbox instanceof HTMLDialogElement){
 const show=(button)=>{currentPhoto=activePhotos.indexOf(button);document.querySelector('#lightbox-image').src=button.dataset.src;document.querySelector('#lightbox-image').alt=button.dataset.alt;document.querySelector('#lightbox-caption').textContent=button.dataset.caption;};
 galleryButtons.forEach(button=>button.addEventListener('click',()=>{show(button);lightbox.showModal();}));
 document.querySelector('#lightbox-close').addEventListener('click',()=>lightbox.close());
 const move=delta=>{currentPhoto=(currentPhoto+delta+activePhotos.length)%activePhotos.length;show(activePhotos[currentPhoto]);};
 document.querySelector('#lightbox-prev').addEventListener('click',()=>move(-1));document.querySelector('#lightbox-next').addEventListener('click',()=>move(1));
 lightbox.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'){e.preventDefault();move(-1);}if(e.key==='ArrowRight'){e.preventDefault();move(1);}});
 lightbox.addEventListener('close',()=>activePhotos[currentPhoto]?.focus());
 document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));document.querySelectorAll('[data-category]').forEach(fig=>fig.hidden=button.dataset.filter!=='All'&&fig.dataset.category!==button.dataset.filter);activePhotos=galleryButtons.filter(b=>!b.closest('figure').hidden);document.querySelector('#gallery-status').textContent=`Showing ${activePhotos.length} photograph${activePhotos.length===1?'':'s'}`;}));
}
// Intent events only. No payment, lead, or subscription success is inferred from a click.
document.querySelector('#jotform-link')?.addEventListener('click',()=>{window.dispatchEvent(new CustomEvent('cookie:order-intent',{detail:{event:'order_click'}}));});

// Accessible reviews carousel: manual arrows/swipe, optional timed movement, no clones.
const reviewTrack=document.querySelector('#review-track');
const reviewPause=document.querySelector('#reviews-pause');
if(reviewTrack && reviewPause){
 const reduce=window.matchMedia('(prefers-reduced-motion: reduce)');
 let paused=reduce.matches,hovered=false,focused=false;
 const cards=[...reviewTrack.querySelectorAll('.review-card')];
 const setLabel=()=>{reviewPause.textContent=paused?'Play carousel':'Pause carousel';reviewPause.setAttribute('aria-pressed',String(paused));};
 setLabel();
 reviewPause.addEventListener('click',()=>{paused=!paused;setLabel();});
 reviewTrack.addEventListener('mouseenter',()=>hovered=true);
 reviewTrack.addEventListener('mouseleave',()=>hovered=false);
 reviewTrack.closest('section').addEventListener('focusin',()=>focused=true);
 reviewTrack.closest('section').addEventListener('focusout',e=>{focused=reviewTrack.closest('section').contains(e.relatedTarget);});
 reviewTrack.addEventListener('touchstart',()=>{paused=true;setLabel();},{passive:true});
 const move=delta=>{const step=cards[1].offsetLeft-cards[0].offsetLeft;const max=reviewTrack.scrollWidth-reviewTrack.clientWidth;let target=reviewTrack.scrollLeft+delta*step;if(delta>0&&reviewTrack.scrollLeft>=max-3)target=0;if(delta<0&&reviewTrack.scrollLeft<=3)target=max;reviewTrack.scrollTo({left:Math.max(0,Math.min(max,target)),behavior:reduce.matches?'instant':'smooth'});};
 document.querySelector('#reviews-prev').addEventListener('click',()=>{paused=true;setLabel();move(-1);});
 document.querySelector('#reviews-next').addEventListener('click',()=>{paused=true;setLabel();move(1);});
 reviewTrack.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();paused=true;setLabel();move(e.key==='ArrowRight'?1:-1);}});
 reduce.addEventListener('change',()=>{if(reduce.matches){paused=true;setLabel();}});
 setInterval(()=>{if(!paused&&!hovered&&!focused&&!reduce.matches&&!document.hidden)move(1);},6500);
}
