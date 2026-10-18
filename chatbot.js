/* Public FAQ assistant: no model keys, ONN AI endpoints, private knowledge or computer controls. */
(() => {
  'use strict';
  const MAIL = 'info@onntechnologies.co.za';
  const endpoint = 'https://formsubmit.co/ajax/' + MAIL;
  const topics = [
    {keys:['website development','web development','website','e-commerce','ecommerce','web application','mobile application','mobile app'],title:'Website & application development',answer:'ONN Technologies designs and develops business websites, e-commerce websites, web applications and mobile applications. We can also connect systems and modernise existing software. Tell us what you need the website or application to do and we can suggest a suitable starting point.'},
    {keys:['custom software development','custom software','software development','system integration','software modernisation'],title:'Custom Software Development',answer:'We develop custom business applications, connect systems and modernise software around your organisation’s requirements. A discovery conversation helps identify the right scope and technology.'},
    {keys:['onn ai studio','onn hr solutions','onn document management solutions','onn products','your products','software products'],title:'ONN Products',answer:'ONN AI Studio, ONN HR Solutions and ONN Document Management Solutions are ONN Technologies product initiatives in development. They are not currently commercially available. We can share updates when their release status is confirmed.'},
    {keys:['power automate','automate','automation','workflow automation','workflow','business process automation','approval workflow','approvals'],title:'Business Process Automation',answer:'We can automate repetitive business processes, notifications, approvals and connected workflows. Power Automate is one option within our wider software and automation services.'},
    {keys:['business management solutions','hr management systems','hr management','human resources','recruitment','onboarding','leave management','employee records','hr solutions'],title:'Business Management & HR Solutions',answer:'ONN Technologies can develop HR management workflows for recruitment, onboarding, leave, employee records, performance and approvals. We can also scope document, contract, governance, risk, compliance, rental and property management solutions.'},
    {keys:['edrms','records management','file plan','document management','retention','contract management','governance risk','compliance','rental management','property management'],title:'Business Management Solutions',answer:'We design business management solutions for electronic documents and records, contracts, governance, risk and compliance, and rental or property workflows. The best fit depends on your records, approval and reporting needs.'},
    {keys:['sharepoint','intranet','microsoft 365','document collaboration','power apps','powerapps','power automate','power bi','dataverse','spfx'],title:'Microsoft Solutions',answer:'Microsoft is one of ONN Technologies’ areas of expertise. We work with SharePoint Online, Microsoft 365, Power Apps, Power Automate, Power BI, Dataverse and SPFx to deliver connected business solutions.'},
    {keys:['ai & intelligent automation','ai & automation','ai chatbot','ai chatbots','chatbot','chatbots','business assistant','business assistants','ai','intelligent automation','ai knowledge','knowledge system','knowledge systems','artificial intelligence','ai solutions'],title:'AI & Intelligent Automation',answer:'ONN Technologies works on practical AI chatbots, business assistants, intelligent process automation and knowledge systems. ONN AI Studio is in development and is not commercially available. A consultation can help assess a suitable business use case.'},
    {keys:['it consulting','digital transformation','technology assessment','process improvement','workflow transformation','systems modernisation'],title:'IT Consulting & Digital Transformation',answer:'We help organisations assess technology, improve business processes and plan digital workflow or systems modernisation. We can start with your current challenge and identify practical next steps.'},
    {keys:['power bi','dashboard','reporting','analytics'],title:'Power BI',answer:'ONN works with Microsoft Power BI to help organisations turn business data into meaningful dashboards and reporting.'},
    {keys:['price','pricing','cost','quote','consultation','demo','meeting'],title:'Consultation',answer:'Pricing and timelines depend on your requirements. Choose “Request consultation” below to share your needs; ONN Technologies can follow up.'},
    {keys:['what services','services offered','what do you do','what does onn do','business solutions','services'],title:'ONN Technologies services',answer:'ONN Technologies is an independent software development, AI and digital transformation company. Our services cover custom software and website development, AI and intelligent automation, business management systems, Microsoft solutions, and IT consulting. Tell me about your business challenge and I can suggest a relevant area.'}
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
  function home(){choices.replaceChildren();['Website development','AI & automation','HR & business systems','Microsoft solutions','IT consulting','Power Automate','EDRMS'].forEach(label=>choice(label,()=>reply(label)));choice('Request consultation',openLead);}
  function matchesKeyword(query,keyword){const escaped=keyword.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');return new RegExp('(^|[^a-z0-9])'+escaped+'($|[^a-z0-9])','i').test(query);}
  function reply(query){const q=query.trim().toLowerCase();if(!q)return;message(query,'visitor');const match=topics.flatMap(t=>t.keys.filter(k=>matchesKeyword(q,k)).map(keyword=>({topic:t,keyword}))).sort((a,b)=>b.keyword.length-a.keyword.length)[0]?.topic;message(match?match.answer+' Would you like to discuss a solution?':'I can answer common questions about ONN Technologies services. For a specific proposal, choose “Request consultation” and tell us about your needs.');home();}
  function setOpen(open){panel.dataset.open=String(open);launch.setAttribute('aria-expanded',String(open));launch.setAttribute('aria-label',open?'Close ONN website assistant':'Open ONN website assistant');launch.textContent=open?'Close chat':'Chat with ONN';launch.hidden=open;if(open){$('onnChatQuestion').focus();}else{launch.focus();}}
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


