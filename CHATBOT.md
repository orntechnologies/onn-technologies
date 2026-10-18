# ONN public website assistant (development only)

The public site is a static HTML/CSS/JavaScript website. The assistant is a **guided, keyword-based FAQ** (not an LLM). It uses only published ONN website service categories. It does not contact ONN AI or any local/private models, tools or infrastructure.

## Local preview
From the repository root run `python -m http.server 8000` and open `http://localhost:8000`. Or run `npx serve .` and use the address displayed. No dependency install or API key is needed.

## Manual QA before release
- Desktop/mobile: open and close the floating assistant; verify no overlap with existing navigation/contact layout.
- Keyboard: use Tab/Enter and Escape; labels and status announcements should remain readable.
- Conversation: ask about SharePoint, Power Apps, Power Automate, EDRMS, HR, AI, and unknown services.
- Lead generation: ensure required fields and mandatory consent; test optional phone and invalid email.
- Submission: use an approved test enquiry to confirm FormSubmit is activated and emails actually reach info@onntechnologies.co.za. Verify network failures show a safe retry message. Do not submit real customer data during development.
- Confirm no ONN AI server, private data or privileged endpoints are requested by browser dev tools.
- Review FormSubmit data-processing/privacy notice and anti-spam controls before deployment.

## Current website positioning
The homepage presents five service categories: Custom Software Development (including a prominent Website Development offer), AI & Intelligent Automation, Business Management Solutions (including HR Solutions), Microsoft Solutions, and IT Consulting & Digital Transformation. ONN-owned products are listed separately and labelled in development; they are not presented as available for purchase.

## Files
- `index.html`: links the chatbot assets; existing contact form and its submission handler preserved; homepage sections updated to the approved positioning.
- `chatbot.css`: isolated responsive chat layout with ONN colours.
- `chatbot.js`: FAQ, topic suggestions, consultation form, validation, consent and existing FormSubmit provider integration.

## Automated checks
Run node --check chatbot.js and node --test tests/website-regression.test.cjs from the repository root.

## Security and deployment caveats
The chatbot is not a secure server-side lead-processing service. Consent is checked in the browser; a malicious client could bypass it. FormSubmit is a third-party processor already used by the website. Email delivery, rate limits, CAPTCHA, abuse controls and privacy/legal adequacy require verification before public launch. No new AI API or infrastructure is provisioned.

## Branding assets
The homepage uses a cache-busted ONN favicon set: favicon.ico, 16×16 and 32×32 PNGs, plus a 180×180 Apple touch icon. Regenerate them with python scripts/generate-favicons.py; the script uses only Python's standard library and matches the existing navy/blue/orange rounded O mark.
