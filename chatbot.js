/* Public FAQ assistant: no model keys, ONN AI endpoints, private knowledge or computer controls. */
(() => {
  'use strict';
  const MAIL = 'info@onntechnologies.co.za';
  const endpoint = 'https://formsubmit.co/ajax/' + MAIL;
  const topics = [
    {keys:['sharepoint','intranet','microsoft 365','document collaboration'],title:'SharePoint & Microsoft 365',answer:'ONN Technologies builds SharePoint and Microsoft 365 solutions for collaboration, governed documents, and digital business processes.'},
    {keys:['power apps','powerapps','application','app development'],title:'Power Apps',answer:'We develop custom business applications using Power Apps and related Microsoft Power Platform services, shaped around your requirements.'},
    {keys:['power automate','automation','workflow','approval'],title:'Power Automate',answer:'We help organisations automate repetitive tasks, notifications, approvals and connected business workflows using Power Automate.'},
    {keys:['edrms','records','file plan','document management','retention'],title:'EDRMS',answer:'Our electronic document and records management solutions support classification, file plans, metadata, scanning, retention and audit trails. Implementation scope depends on your needs.'},
    {keys:['hr','human resources','leave','employee','recruitment','onboarding'],title:'HR solutions',answer:'ONN Technologies offers HR-focused solutions for recruitment, onboarding, leave, employee records, performance and approval workflows.'},
    {keys:['ai','artificial intelligence','chatbot'],title:'AI solutions',answer:'ONN Technologies explores practical AI-enabled business solutions and intelligent workflow improvements. A consultation helps us assess feasibility, governance and scope.'},
    {keys:['power bi','dashboard','reporting','analytics'],title:'Power BI',answer:'ONN works with Microsoft Power BI to help organisations turn business data into meaningful dashboards and reporting.'},
    {keys:['price','pricing','cost','quote','consultation','demo','meeting'],title:'Consultation',answer:'Pricing and timelines depend on your requirements. Choose “Request consultation” below to share your needs; ONN Technologies can follow up.'}
  ];
  const launch = document.createElement('button');
  launch.type='button';launch.className='onn-chat-launch';launch.id='onnChatLaunch';
  launch.textContent='Chat with ONN';launch.setAttribute('aria-label','Open ONN website assistant');launch.setAttribute('aria-expanded','false');launch.setAttribute('aria-controls','onnChatPanel');
  const panel = document.createElement('section');
  panel.id='onnChatPanel';panel.className='onn-chat-panel';panel.dataset.open='false';panel.setAttribute('aria-label','ONN website assistant');
  panel.innerHTML = `<div class="onn-chat-header"><div><strong>ONN Website Assistant</strong><small>Company FAQs · no private ONN AI access</small></div><button type="button" class="onn-chat-close" aria-label="Close chat">×</button></div>
  <div class="onn-chat-log" id="onnChatLog" role="log" aria-live="polite" aria-relevant="additions text"></div>
  <div class="onn-chat-choices" id="onnChatChoices"></div>
  <form class="onn-chat-entry" id="onnChatEntry"><input aria-label="Your question" maxlength="500" id="onnChatQuestion" placeholder="Ask about our services…" required><button type="submit">Send</button></form>
  <form class="onn-chat-lead" id="onnChatLead">
    <strong>Request a consultation</strong><p>Only provide information you are comfortable sharing. Your enquiry will be forwarded to ONN Technologies using the website's existing third-party form provider.</p>
    <input type="text" name="_honey" tabindex="-1" autocomplete="off" aria-hidden="true" style="display:none">
    <input type="hidden" name="_subject" value="ONN Technologies chatbot consultation request"><input type="hidden" name="_template" value="table">
    <label for="onnLeadName">Full name *</label><input id="onnLeadName" name="name" maxlength="120" required autocomplete="name">
    <label for="onnLeadCompany">Company *</label><input id="onnLeadCompany" name="company" maxlength="150" required>
    <label for="onnLeadEmail">Email *</label><input id="onnLeadEmail" name="email" type="email" maxlength="254" autocomplete="email" required>
    <label for="onnLeadPhone">Phone (optional)</label><input id="onnLeadPhone" name="phone" type="tel" maxlength="35" autocomplete="tel">
    <label for="onnLeadNeeds">Business requirements *</label><textarea id="onnLeadNeeds" name="requirements" maxlength="3000" required></textarea>
    <label class="onn-consent"><input id="onnLeadConsent" name="privacy_consent" type="checkbox" value="I agree to be contacted regarding this enquiry" required><span>I consent to ONN Technologies processing these details to respond to my enquiry. *</span></label>
    <button class="onn-lead-submit" type="submit">Send consultation request</button><button id="onnLeadCancel" type="button" class="onn-chat-choices-button">Back to chat</button>
    <p id="onnLeadFeedback" class="onn-chat-feedback" role="status" aria-live="polite"></p>
  </form>`;
  document.body.append(launch,panel);
  const $=id=>document.getElementById(id);
  const log=$('onnChatLog'), choices=$('onnChatChoices'), entry=$('onnChatEntry'), lead=$('onnChatLead');
  function message(content,from='assistant'){const p=document.createElement('p');p.className='onn-chat-msg';p.dataset.from=from;p.textContent=content;log.appendChild(p);log.scrollTop=log.scrollHeight;}
  function choice(label,fn){const b=document.createElement('button');b.type='button';b.textContent=label;b.addEventListener('click',fn);choices.append(b);}
  function home(){choices.replaceChildren();['SharePoint','Power Apps','Power Automate','EDRMS','HR solutions','AI solutions'].forEach(label=>choice(label,()=>reply(label)));choice('Request consultation',openLead);}
  function reply(query){const q=query.trim().toLowerCase();if(!q)return;message(query,'visitor');const match=topics.find(t=>t.keys.some(k=>q.includes(k)));message(match?match.answer+' Would you like to discuss a solution?':'I can answer common questions about ONN Technologies services. For a specific proposal, choose “Request consultation” and tell us about your needs.');home();}
  function setOpen(open){panel.dataset.open=String(open);launch.setAttribute('aria-expanded',String(open));launch.textContent=open?'Close chat':'Chat with ONN';if(open){$('onnChatQuestion').focus();}else{launch.focus();}}
  function openLead(){lead.dataset.open='true';entry.hidden=true;choices.hidden=true;$('onnLeadFeedback').textContent='';$('onnLeadName').focus();}
  function closeLead(){lead.dataset.open='false';entry.hidden=false;choices.hidden=false;$('onnChatQuestion').focus();}
  launch.addEventListener('click',()=>setOpen(panel.dataset.open!=='true'));
  panel.querySelector('.onn-chat-close').addEventListener('click',()=>setOpen(false));
  panel.addEventListener('keydown',e=>{if(e.key==='Escape')setOpen(false);});
  $('onnLeadCancel').addEventListener('click',closeLead);
  entry.addEventListener('submit',e=>{e.preventDefault();reply($('onnChatQuestion').value);entry.reset();});
  lead.addEventListener('submit',async e=>{
    e.preventDefault();if(!lead.reportValidity()||!$('onnLeadConsent').checked)return;
    const button=lead.querySelector('[type="submit"]'),feedback=$('onnLeadFeedback');
    button.disabled=true;button.textContent='Sending…';feedback.textContent='';feedback.setAttribute('role','status');
    try{
      const payload=Object.fromEntries(new FormData(lead).entries());
      const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(payload)});
      if(!response.ok)throw Error('HTTP '+response.status);
      const result=await response.json();
      if(result.success===false||result.success==='false')throw Error('Form service rejected');
      lead.reset();feedback.textContent='Your request was submitted successfully. ONN Technologies will follow up.';message('Your consultation request was submitted. Thank you!');if(typeof window.gtag==='function')window.gtag('event','generate_lead',{event_category:'chatbot',method:'FormSubmit'});
    }catch(err){feedback.setAttribute('role','alert');feedback.textContent='Unable to send the request. Please retry or email '+MAIL+' directly.';}
    finally{button.disabled=false;button.textContent='Send consultation request';}
  });
  message('Hi! Welcome to ONN Technologies. I can help you explore our services and request a consultation. I am a guided website assistant, not a live AI agent.');
  home();
})();