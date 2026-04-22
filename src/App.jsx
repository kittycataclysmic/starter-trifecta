import { useState } from "react";

const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=DM+Mono:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  :root {
    --deep: #0F0D0B; --ink: #1A1714; --fog: #EDE9E3; --ash: #D9D4CE;
    --steel: #6B7280; --text-on-dark: #E8E4DF; --text-muted: #A09C96;
    --rule: rgba(237,233,227,0.12);
  }
  body { background: var(--deep); font-family: 'Libre Baskerville', Georgia, serif; color: var(--text-on-dark); -webkit-font-smoothing: antialiased; }
  body::before { content: ''; position: fixed; inset: 0; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E"); pointer-events: none; z-index: 0; opacity: 0.6; }
  .app { min-height: 100vh; display: flex; flex-direction: column; }

  /* NAV */
  .st-nav { position: fixed; top: 0; left: 0; right: 0; z-index: 200; padding: 20px 48px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--rule); background: rgba(15,13,11,0.88); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); }
  .st-nav-left { display: flex; align-items: center; gap: 20px; }
  .st-wordmark { font-family: 'Bebas Neue', sans-serif; font-size: 22px; letter-spacing: 0.08em; color: var(--fog); text-decoration: none; }
  .st-wordmark span { color: var(--steel); font-size: 13px; font-family: 'DM Mono', monospace; letter-spacing: 0.15em; margin-left: 10px; vertical-align: middle; }
  .st-back-btn { background: none; border: none; font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--steel); cursor: pointer; display: flex; align-items: center; gap: 8px; padding: 0; transition: color 0.2s; }
  .st-back-btn:hover { color: var(--fog); }

  /* PROGRESS */
  .st-progress { height: 2px; background: var(--rule); position: relative; z-index: 1; }
  .st-progress-fill { height: 100%; background: var(--fog); transition: width 0.5s ease; }

  /* MAIN + FOOTER */
  .st-main { flex: 1; position: relative; z-index: 1; padding-top: 63px; }
  .st-footer { border-top: 1px solid var(--rule); padding: 20px 48px; display: flex; justify-content: space-between; align-items: center; position: relative; z-index: 1; background: var(--ink); }
  .st-footer-l { font-family: 'Bebas Neue', sans-serif; font-size: 16px; letter-spacing: 0.08em; color: var(--fog); }
  .st-footer-r { font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--steel); }

  /* HERO STRIP */
  .st-hero { position: relative; overflow: hidden; padding: 80px 48px 64px; border-bottom: 1px solid var(--rule); }
  .st-hero-grid { position: absolute; inset: 0; background-image: linear-gradient(var(--rule) 1px, transparent 1px), linear-gradient(90deg, var(--rule) 1px, transparent 1px); background-size: 80px 80px; opacity: 0.5; }
  .st-hero-ghost { position: absolute; top: 50%; right: -1vw; transform: translateY(-50%); font-family: 'Bebas Neue', sans-serif; font-size: clamp(120px, 18vw, 240px); color: rgba(237,233,227,0.03); line-height: 1; pointer-events: none; user-select: none; }
  .st-hero-content { position: relative; z-index: 1; max-width: 800px; }

  /* SECTION TAG */
  .st-tag { font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase; color: var(--steel); margin-bottom: 16px; display: flex; align-items: center; gap: 12px; }
  .st-tag::before { content: ''; display: inline-block; width: 24px; height: 1px; background: var(--steel); }

  /* TYPOGRAPHY */
  .st-display { font-family: 'Bebas Neue', sans-serif; line-height: 0.92; letter-spacing: 0.01em; color: var(--fog); }
  .st-body { font-size: 17px; line-height: 1.85; color: var(--text-muted); }
  .st-italic { font-style: italic; border-left: 2px solid var(--steel); padding-left: 24px; }
  .st-rule { height: 1px; background: var(--rule); margin: 40px 0; }
  .st-content { max-width: 760px; margin: 0 auto; padding: 64px 48px 96px; }

  /* STAT ROW */
  .st-stat-row { display: flex; gap: 48px; padding: 32px 0; border-bottom: 1px solid var(--rule); margin-bottom: 44px; }
  .st-stat-num { font-family: 'Bebas Neue', sans-serif; font-size: 44px; color: var(--fog); line-height: 1; display: block; }
  .st-stat-label { font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--steel); display: block; margin-top: 4px; }

  /* TOOL CARDS */
  .st-card-grid { display: flex; flex-direction: column; gap: 2px; }
  .st-tool-card { display: grid; grid-template-columns: 80px 1fr 32px; align-items: center; gap: 32px; padding: 32px 40px; border: 1px solid var(--rule); background: rgba(237,233,227,0.02); cursor: pointer; text-align: left; width: 100%; transition: all 0.2s; }
  .st-tool-card:hover { background: rgba(237,233,227,0.05); border-color: rgba(237,233,227,0.22); }
  .st-tool-card.featured { background: var(--fog); border-color: var(--fog); }
  .st-tool-card.featured:hover { background: var(--ash); }
  .st-tool-num { font-family: 'Bebas Neue', sans-serif; font-size: 56px; line-height: 1; letter-spacing: 0.02em; color: var(--fog); }
  .st-tool-card.featured .st-tool-num { color: var(--deep); }
  .st-tool-type { font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--steel); display: block; margin-bottom: 6px; }
  .st-tool-card.featured .st-tool-type { color: #888; }
  .st-tool-title { font-family: 'Bebas Neue', sans-serif; font-size: 28px; letter-spacing: 0.03em; color: var(--fog); display: block; margin-bottom: 8px; }
  .st-tool-card.featured .st-tool-title { color: var(--deep); }
  .st-tool-desc { font-family: 'Libre Baskerville', serif; font-size: 14px; line-height: 1.65; color: var(--text-muted); }
  .st-tool-card.featured .st-tool-desc { color: #555; }
  .st-tool-arrow { font-size: 20px; color: var(--fog); }
  .st-tool-card.featured .st-tool-arrow { color: var(--deep); }

  /* QUIZ OPTIONS */
  .st-options { display: flex; flex-direction: column; gap: 8px; margin-bottom: 44px; }
  .st-option { display: flex; align-items: flex-start; gap: 16px; padding: 20px 24px; border: 1px solid var(--rule); background: rgba(237,233,227,0.02); cursor: pointer; text-align: left; width: 100%; transition: all 0.15s; }
  .st-option:hover { border-color: rgba(237,233,227,0.25); background: rgba(237,233,227,0.04); }
  .st-option.selected { border-color: var(--fog); background: var(--fog); }
  .st-option-marker { flex-shrink: 0; width: 26px; height: 26px; border-radius: 50%; border: 1px solid rgba(237,233,227,0.25); display: flex; align-items: center; justify-content: center; font-family: 'DM Mono', monospace; font-size: 10px; color: var(--steel); margin-top: 1px; transition: all 0.15s; }
  .st-option.selected .st-option-marker { border-color: var(--deep); background: var(--deep); color: var(--fog); }
  .st-option-text { font-family: 'Libre Baskerville', serif; font-size: 14px; line-height: 1.7; color: var(--text-muted); }
  .st-option.selected .st-option-text { color: var(--ink); }

  /* SCORE GRID */
  .st-score-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2px; margin-bottom: 48px; }
  .st-score-cell { padding: 20px 18px; background: rgba(237,233,227,0.03); }
  .st-score-cell.dominant { background: var(--fog); }
  .st-score-label { font-family: 'DM Mono', monospace; font-size: 8px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--steel); display: block; margin-bottom: 8px; }
  .st-score-cell.dominant .st-score-label { color: #888; }
  .st-score-num { font-family: 'Bebas Neue', sans-serif; font-size: 44px; color: var(--fog); line-height: 1; display: block; margin-bottom: 10px; }
  .st-score-cell.dominant .st-score-num { color: var(--ink); }
  .st-score-bar-track { height: 2px; background: var(--rule); margin-bottom: 10px; }
  .st-score-cell.dominant .st-score-bar-track { background: rgba(26,23,20,0.15); }
  .st-score-bar-fill { height: 100%; background: var(--fog); }
  .st-score-cell.dominant .st-score-bar-fill { background: var(--ink); }
  .st-score-name { font-family: 'DM Mono', monospace; font-size: 8px; letter-spacing: 0.15em; text-transform: uppercase; color: var(--text-muted); }
  .st-score-cell.dominant .st-score-name { color: var(--ink); }

  /* RESULT BLOCKS */
  .st-result-block { margin-bottom: 36px; padding-bottom: 36px; border-bottom: 1px solid var(--rule); }
  .st-callout { background: var(--fog); padding: 32px 36px; margin-bottom: 32px; }
  .st-callout .st-tag { color: #888; }
  .st-callout .st-tag::before { background: #888; }
  .st-callout p { font-size: 14px; line-height: 1.85; color: var(--ink); }

  /* BLUEPRINT */
  .st-tabs { display: flex; gap: 2px; margin-bottom: 48px; flex-wrap: wrap; }
  .st-tab { font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: 0.2em; text-transform: uppercase; padding: 12px 20px; border: 1px solid var(--rule); background: transparent; color: var(--text-muted); cursor: pointer; transition: all 0.15s; }
  .st-tab:hover { border-color: rgba(237,233,227,0.25); color: var(--fog); }
  .st-tab.active { background: var(--fog); color: var(--ink); border-color: var(--fog); }
  .st-prompt-box { background: rgba(237,233,227,0.03); border: 1px solid var(--rule); padding: 28px 32px; margin-top: 20px; margin-bottom: 8px; }
  .st-prompt-label { font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--steel); display: block; margin-bottom: 16px; }
  .st-prompt-text { font-family: 'DM Mono', monospace; font-size: 11px; line-height: 1.9; color: var(--text-muted); white-space: pre-wrap; }
  .st-highlight { background: var(--fog); padding: 20px 24px; margin-top: 24px; }
  .st-highlight p { font-family: 'Libre Baskerville', serif; font-size: 13px; font-style: italic; line-height: 1.75; color: var(--ink); }

  /* BUILDER */
  .st-progress-bar { background: rgba(237,233,227,0.04); border: 1px solid var(--rule); padding: 20px 28px; margin-bottom: 40px; display: flex; align-items: center; gap: 24px; }
  .st-progress-inner { flex: 1; }
  .st-progress-meta { display: flex; justify-content: space-between; margin-bottom: 10px; }
  .st-progress-meta span { font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--steel); }
  .st-progress-meta span:last-child { color: var(--fog); }
  .st-progress-track { height: 2px; background: var(--rule); }
  .st-progress-filled { height: 100%; background: var(--fog); transition: width 0.4s ease; }
  .st-progress-pct { font-family: 'Bebas Neue', sans-serif; font-size: 44px; color: var(--fog); line-height: 1; }
  .st-comp-tabs { display: grid; grid-template-columns: repeat(4, 1fr); gap: 2px; margin-bottom: 44px; }
  .st-comp-tab { padding: 18px 14px; border: 1px solid var(--rule); background: rgba(237,233,227,0.02); cursor: pointer; text-align: left; transition: all 0.15s; }
  .st-comp-tab:hover { background: rgba(237,233,227,0.05); }
  .st-comp-tab.active { background: var(--fog); border-color: var(--fog); }
  .st-comp-num { font-family: 'Bebas Neue', sans-serif; font-size: 32px; color: var(--fog); line-height: 1; display: block; margin-bottom: 6px; }
  .st-comp-tab.active .st-comp-num { color: var(--ink); }
  .st-comp-done { font-family: 'DM Mono', monospace; font-size: 8px; letter-spacing: 0.15em; text-transform: uppercase; color: var(--steel); display: block; margin-bottom: 8px; }
  .st-comp-track { height: 2px; background: var(--rule); }
  .st-comp-tab.active .st-comp-track { background: rgba(26,23,20,0.15); }
  .st-comp-fill { height: 100%; background: var(--fog); transition: width 0.3s; }
  .st-comp-tab.active .st-comp-fill { background: var(--ink); }
  .st-steps { display: flex; flex-direction: column; gap: 8px; margin-bottom: 40px; }
  .st-step { display: flex; align-items: flex-start; gap: 16px; padding: 20px 24px; border: 1px solid var(--rule); background: rgba(237,233,227,0.02); cursor: pointer; text-align: left; width: 100%; transition: all 0.2s; }
  .st-step:hover { background: rgba(237,233,227,0.05); }
  .st-step.done { border-color: var(--fog); background: var(--fog); }
  .st-step-marker { flex-shrink: 0; width: 24px; height: 24px; border: 1px solid rgba(237,233,227,0.2); display: flex; align-items: center; justify-content: center; font-family: 'DM Mono', monospace; font-size: 10px; color: var(--steel); margin-top: 2px; transition: all 0.2s; }
  .st-step.done .st-step-marker { border-color: var(--ink); background: var(--ink); color: var(--fog); }
  .st-step-text { font-family: 'Libre Baskerville', serif; font-size: 14px; line-height: 1.75; color: var(--text-muted); }
  .st-step.done .st-step-text { color: #666; text-decoration: line-through; }
  .st-complete { background: var(--fog); padding: 32px 36px; margin-bottom: 32px; }
  .st-complete .st-tag { color: #888; }
  .st-complete .st-tag::before { background: #888; }
  .st-complete p { font-size: 14px; line-height: 1.85; color: var(--ink); margin-bottom: 12px; }
  .st-complete p.muted { color: #666; margin-bottom: 20px; }

  /* INPUTS */
  .st-input { border: 1px solid rgba(237,233,227,0.15); padding: 14px 18px; width: 100%; font-family: 'Libre Baskerville', serif; font-size: 14px; color: var(--fog); background: rgba(237,233,227,0.04); outline: none; transition: border-color 0.2s; margin-bottom: 12px; }
  .st-input::placeholder { color: var(--steel); }
  .st-input:focus { border-color: rgba(237,233,227,0.35); }

  /* BUTTONS */
  .st-btn { display: inline-flex; align-items: center; gap: 10px; font-family: 'DM Mono', monospace; font-size: 10px; font-weight: 500; letter-spacing: 0.2em; text-transform: uppercase; padding: 16px 32px; border: none; cursor: pointer; transition: all 0.2s; }
  .st-btn-primary { background: var(--fog); color: var(--deep); }
  .st-btn-primary:hover { background: var(--ash); }
  .st-btn-primary:disabled { opacity: 0.3; cursor: default; }
  .st-btn-ghost { background: transparent; color: var(--fog); border: 1px solid rgba(237,233,227,0.2); }
  .st-btn-ghost:hover { background: var(--fog); color: var(--deep); border-color: var(--fog); }
  .st-btn-row { display: flex; gap: 12px; flex-wrap: wrap; margin-top: 40px; }

  /* ANIMATIONS */
  @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
  .fade-up { animation: fadeUp 0.4s ease forwards; }

  /* RESPONSIVE */
  @media (max-width: 640px) {
    .st-nav { padding: 16px 20px; }
    .st-wordmark span { display: none; }
    .st-hero { padding: 60px 24px 48px; }
    .st-content { padding: 48px 24px 72px; }
    .st-tool-card { grid-template-columns: 56px 1fr 24px; gap: 16px; padding: 24px 20px; }
    .st-comp-tabs { grid-template-columns: repeat(2, 1fr); }
    .st-stat-row { gap: 28px; }
    .st-footer { padding: 16px 20px; }
  }
`;

// ─── DATA ─────────────────────────────────────────────────────────────────────
const QUESTIONS = [
  { id: 1, section: "Your Application", question: "When you write an application or proposal to a potential client, what does the first paragraph usually say?", options: [{ text: "I describe myself — my background, experience, and what I can do", scores: { E: 2, N: 0, W: 0 } }, { text: "I mention what I noticed about their business and how I can help specifically", scores: { E: 0, N: 0, W: 0 } }, { text: "I copy a template I found online and change the name", scores: { E: 2, N: 0, W: 1 } }, { text: "I haven't sent many — I'm not sure what to write", scores: { E: 1, N: 1, W: 0 } }] },
  { id: 2, section: "Your Application", question: "When a client posts that they need a VA, what do you focus on in your reply?", options: [{ text: "Listing my skills and what I'm capable of doing", scores: { E: 2, N: 0, W: 0 } }, { text: "Addressing their specific problem and how I would solve it", scores: { E: 0, N: 0, W: 0 } }, { text: "Keeping it short — just my rates and availability", scores: { E: 1, N: 0, W: 1 } }, { text: "I'm not sure — I just write whatever feels natural", scores: { E: 2, N: 0, W: 0 } }] },
  { id: 3, section: "Your Application", question: "How do you end a job application or outreach message?", options: [{ text: "With something like 'I look forward to hearing from you'", scores: { E: 1, N: 0, W: 0 } }, { text: "With a specific next step — a call, a question, a small offer", scores: { E: 0, N: 0, W: 0 } }, { text: "With my rates and a request for them to message me back", scores: { E: 0, N: 0, W: 1 } }, { text: "I don't have a consistent ending", scores: { E: 1, N: 1, W: 0 } }] },
  { id: 4, section: "Your Portfolio", question: "What do you include when a client asks to see your work or portfolio?", options: [{ text: "Sample projects I created myself to show what I can do", scores: { E: 0, N: 0, W: 0 } }, { text: "I say I'm new and offer to do a test task for free", scores: { E: 0, N: 2, W: 0 } }, { text: "I leave it blank or skip the portfolio section", scores: { E: 0, N: 2, W: 0 } }, { text: "I share skills or certificates but no actual work samples", scores: { E: 0, N: 1, W: 0 } }] },
  { id: 5, section: "Your Portfolio", question: "If a client asked you right now to prove you can do the job — what would you show them?", options: [{ text: "3 or more work samples relevant to what they need", scores: { E: 0, N: 0, W: 0 } }, { text: "1 or 2 things — but they're generic, not specific to their industry", scores: { E: 0, N: 1, W: 0 } }, { text: "Certificates or course completions but no actual output", scores: { E: 0, N: 2, W: 0 } }, { text: "Nothing concrete — I'd have to make something on the spot", scores: { E: 0, N: 2, W: 0 } }] },
  { id: 6, section: "Your Portfolio", question: "Have you ever created sample work specifically to show potential clients what you can do?", options: [{ text: "Yes — I have multiple samples for the services I offer", scores: { E: 0, N: 0, W: 0 } }, { text: "I have one or two things but haven't done this intentionally", scores: { E: 0, N: 1, W: 0 } }, { text: "No — I didn't know that was something I should do", scores: { E: 0, N: 2, W: 0 } }, { text: "No — I was waiting until I had a real client first", scores: { E: 0, N: 2, W: 0 } }] },
  { id: 7, section: "Where You Apply", question: "Where do you currently look for VA clients or job postings?", options: [{ text: "Facebook VA groups and job boards like OnlineJobs or Upwork", scores: { E: 0, N: 0, W: 2 } }, { text: "A mix — job boards plus direct outreach to business owners", scores: { E: 0, N: 0, W: 1 } }, { text: "Referrals from people I know or communities I'm part of", scores: { E: 0, N: 0, W: 0 } }, { text: "I'm not sure where to look — I apply wherever I see a post", scores: { E: 0, N: 0, W: 2 } }] },
  { id: 8, section: "Where You Apply", question: "When you apply on a platform or group, how many other people do you think are applying for the same post?", options: [{ text: "Probably a few — I try to find less competitive opportunities", scores: { E: 0, N: 0, W: 0 } }, { text: "Maybe 10 to 30 others", scores: { E: 0, N: 0, W: 1 } }, { text: "Probably 50 or more — the posts usually get a lot of comments", scores: { E: 0, N: 0, W: 2 } }, { text: "I don't know — I just apply and hope for the best", scores: { E: 0, N: 0, W: 2 } }] },
  { id: 9, section: "Where You Apply", question: "Have you ever reached out directly to a business owner who wasn't actively hiring?", options: [{ text: "Yes — this is part of how I look for clients", scores: { E: 0, N: 0, W: 0 } }, { text: "I've thought about it but wasn't sure how to do it", scores: { E: 0, N: 0, W: 1 } }, { text: "No — it felt too forward or like I'd be bothering them", scores: { E: 0, N: 0, W: 2 } }, { text: "No — I only apply when there's a job post", scores: { E: 0, N: 0, W: 2 } }] },
  { id: 10, section: "Your Follow-Up", question: "After you send an application and hear nothing back, what do you do?", options: [{ text: "Follow up once after 2–3 days with a short, polite message", scores: { E: 0, N: 0, W: 0 } }, { text: "Wait and hope they reply", scores: { E: 1, N: 0, W: 1 } }, { text: "Move on immediately and apply somewhere else", scores: { E: 0, N: 0, W: 1 } }, { text: "I feel too shy to follow up — I don't want to seem desperate", scores: { E: 1, N: 0, W: 1 } }] },
];

const RESULTS = {
  E: { code: "THE EMPTY PITCH", tagline: "You're applying. You're trying. But your message sounds like everyone else's — and clients can't see why they should pick you.", diagnosis: "Right now, your application talks about you — your background, your skills, your willingness to work hard. But the client isn't thinking about you. They're thinking about their problem. The moment you make your pitch about them instead of you, you stop being one of 50 applicants and start being the only one who actually understood what they needed.", costs: "Clients read your message, feel no specific connection to it, and move on. Your application isn't being rejected — it's being forgotten. There's a difference. Rejected means they saw you and said no. Forgotten means they never really saw you at all.", fix: "Rewrite your application so the first three sentences are entirely about them — what you noticed about their business, what problem you think they're trying to solve, and one specific way you can help. Your name and background come after.", next: "The First Client Blueprint walks you through exactly how to write this kind of pitch — with an AI prompt that customizes it for every client in under 10 minutes." },
  N: { code: "THE NO-PROOF TRAP", tagline: "You have the skills. You have the drive. But you have nothing to show — and clients need to see before they trust.", diagnosis: "When a client is choosing between applicants they've never met, they look for evidence. Past work. Samples. Proof that you've done something similar. The trap is believing you need a client to build a portfolio. You don't. You need a portfolio to get a client.", costs: "When you leave the portfolio section blank or say 'I'm new but I'm a fast learner,' you're asking the client to take a risk on you with nothing to justify it. Clients don't take risks on strangers. They take risks on people who've already shown them something worth betting on.", fix: "This week, create three sample work pieces for the services you want to offer. Pick a real business you admire and do the work as if they hired you. These become your portfolio. They're real work, even if they weren't paid for.", next: "The First Client Blueprint includes a step-by-step method for building a portfolio from scratch using AI — including the exact types of samples that make hiring clients say yes." },
  W: { code: "THE WRONG ROOM", tagline: "You're not being ignored because you're unqualified. You're standing in the most crowded room in the building.", diagnosis: "Facebook VA groups, Upwork, and generic job boards are where thousands of VAs compete for the same small number of postings. As a beginner, you are at a structural disadvantage here. This is not a reflection of your ability. It's a math problem — when 80 people apply for one job, 79 get ignored regardless of quality.", costs: "You keep applying, keep getting silence, and start to believe the problem is you. It isn't. The problem is the room. You're playing a volume game in a space designed for experienced VAs — and the longer you stay there, the more your confidence erodes while your results stay the same.", fix: "Stop competing in crowded rooms and start showing up where there's almost no competition — direct outreach to small business owners, warm communities where trust is already built, and one focused niche where your beginner status is an advantage.", next: "The First Client Blueprint shows you exactly which rooms beginner VAs actually win in — and gives you the outreach script that gets responses even with zero experience." },
};

const KILLER_NAMES = { E: "Empty Pitch", N: "No-Proof Trap", W: "Wrong Room" };
const MARKERS = ["A", "B", "C", "D"];

const BLUEPRINT_SECTIONS = [
  { number: "SHIFT 01", title: "From Biography to Solution", subtitle: "Stop talking about yourself. Start solving their problem.", body: "Every day, a hiring client opens 40 applications that all start the same way: 'Hi, my name is [Name] and I am a VA with skills in X, Y, and Z.' They stop reading after line two — not because those VAs are bad, but because nothing in that opening made the client feel understood. The VAs who get replies open with the client's problem, not their own resume.", action: "The Solution-First Pitch Formula", action_desc: "Every strong application follows this sequence: (1) One sentence showing you understand their situation. (2) One sentence naming the specific problem you'll solve. (3) One sentence explaining why you're the right person. (4) One clear next step. Four sentences. No autobiography. No skills list.", ai_prompt: `Use this prompt in ChatGPT or Claude before every application:\n\n"I am a VA applying for this job post: [paste the job post]. Help me write a 4-sentence application that: (1) opens by showing I understand this client's situation, (2) names the specific problem they're trying to solve, (3) explains why I'm the right person to help, and (4) ends with a clear next step that invites a reply. Do not start with my name or a list of my skills. Keep the whole thing under 100 words."`, highlight: "Applications that open with the client's problem — not the applicant's background — receive 4× more replies, even from beginner VAs with no experience listed." },
  { number: "SHIFT 02", title: "From No Portfolio to Proof", subtitle: "You don't need clients to have a portfolio. You need a portfolio to get clients.", body: "The most common mistake beginners make is waiting — waiting for a client to give them something to put in their portfolio. But clients won't hire you without a portfolio. A portfolio built from self-initiated sample projects is completely legitimate. Hiring clients look at the quality of the work, not whether it was paid for.", action: "The Sample Project Method", action_desc: "Pick a real business you admire. Pretend they hired you and do the work. If you offer email management, write sample inbox replies for their type of business. If you offer social media, create five posts in their voice. Use the AI prompt below to create professional-grade samples even if you're just starting out.", ai_prompt: `Use this prompt for each service you want to offer:\n\n"I am building a VA portfolio and I want to create a sample project for [name your service]. The pretend client is a [type of business]. Create a realistic, professional sample of this work that I can include in my portfolio to show potential clients what I can do. Make it high quality — something that would genuinely impress a hiring client in this industry."\n\nRepeat for 3 different service types. Save outputs as PDF. That is your portfolio.`, highlight: "A portfolio of 3 self-initiated samples is more convincing than a blank section with 'willing to do a test task.' One shows capability. The other asks clients to take a risk." },
  { number: "SHIFT 03", title: "From Wrong Room to Right Room", subtitle: "Stop competing with 80 people for one job. Show up where there's almost no competition.", body: "VA job boards and Facebook groups are designed for experienced VAs who can outcompete beginners on price, reviews, and speed. There are three rooms where beginners actually win — rooms where showing up early, being specific, and being genuinely helpful matters more than having 5 years of experience.", action: "The Three Winning Rooms for Beginners", action_desc: "Room 1: Warm Communities — join Facebook groups or Discord servers built around a specific business type. Contribute first. Room 2: Direct Outreach — find 5 small business owners whose business clearly needs support. Send a personalized message using the AI prompt below. Room 3: Niche Specialisation — pick one business type and become the VA who knows that industry best.", ai_prompt: `Use this prompt to write your direct outreach message:\n\n"I am a VA who specializes in helping [type of business]. I want to send a short, non-salesy outreach message to a [type of business owner] I found on [platform]. Their business is [describe what you observed]. Write me a genuine, helpful 3-sentence message that: (1) mentions one specific thing I noticed about their business, (2) offers one concrete observation or tip, and (3) ends with a soft invitation to chat — not a pitch. Make it feel like a human wrote it."`, highlight: "Direct outreach to 5 targeted business owners per day produces more first clients than sending 50 applications to job boards every week. Specificity beats volume every time." },
];

const LAUNCH_COMPONENTS = [
  { number: "01", title: "Your Solution-First Pitch", desc: "A ready-to-send application template that puts the client's problem first — so your message stands out from every other VA who just listed their skills.", steps: [{ id: "p1", text: "Decide on one type of client you want to serve first — be specific. (Example: online coaches, e-commerce store owners, real estate agents)" }, { id: "p2", text: "Write one sentence describing the most common problem that type of client has." }, { id: "p3", text: "Write one sentence explaining what you do to solve that problem." }, { id: "p4", text: "Write your closing line — a soft, specific next step that invites a reply." }, { id: "p5", text: "Put the four sentences together. Read it out loud. If it sounds like a real human wrote it — save it as your base pitch template." }], output: "Your Base Pitch Template — a 4-sentence application you can personalize for any client in under 5 minutes." },
  { number: "02", title: "Your First Portfolio Piece", desc: "A real, professional work sample that shows potential clients exactly what you can do — built from scratch, no clients needed.", steps: [{ id: "q1", text: "Choose one service you want to offer and one type of business you want to serve." }, { id: "q2", text: "Pick a real business that fits — find one on Instagram or Google. You are not contacting them. They are your pretend client." }, { id: "q3", text: "Use the AI prompt from Shift 02 of the Blueprint to create a full, professional sample of your service for this business." }, { id: "q4", text: "Paste the output into Canva, Google Docs, or Notion. Add a cover page: 'Sample Project — [Service] for [Type of Business].'" }, { id: "q5", text: "Save it as a PDF. Repeat two more times for different service types or niches. You now have a 3-piece portfolio." }], output: "Your First Portfolio Piece and the method to build two more — professional samples that prove your capability before your first paid client." },
  { number: "03", title: "Your Beginner-Ready Profile", desc: "A compelling profile that works on any platform — honest about your experience but confident about your capability.", steps: [{ id: "r1", text: "Write your headline: 'VA helping [type of client] with [specific problem] so they can [specific outcome].' Not 'Virtual Assistant available for hire.'" }, { id: "r2", text: "Write your about section — 3 sentences only. Who you help and what problem you solve. How you help them. What makes working with you feel different." }, { id: "r3", text: "Remove the words 'newbie', 'beginner', 'no experience', or 'willing to learn' from every version of your profile." }, { id: "r4", text: "Add your portfolio: link or attach your 3 samples. Label them clearly: 'Sample — [Service Type] for [Industry].'" }, { id: "r5", text: "Set your rate. Do not start at ₱0 or say 'negotiable.' Pick a number that feels uncomfortable but fair." }], output: "Your Beginner-Ready Profile — a confident, specific, and honest profile that positions you as a capable professional." },
  { number: "04", title: "Your 5-a-Day Application Tracker", desc: "A daily outreach system that makes landing your first client a process — not a hope.", steps: [{ id: "t1", text: "Create a tracker — Google Sheet or Notion table — with columns: Date Sent / Client or Post / Platform / Pitch Angle / Follow-Up Date / Status" }, { id: "t2", text: "Commit to 5 applications or outreach messages per day, 5 days a week. This is your non-negotiable daily action." }, { id: "t3", text: "For every application sent, set a follow-up date 3 days later. If no reply: 'Hi [Name], just following up on my message. Happy to send a sample of my work if that would help.'" }, { id: "t4", text: "After 2 weeks, review your tracker. Which pitch angles got replies? Which platforms produced responses? Double down on what's working." }, { id: "t5", text: "Set a weekly 20-minute calendar block every Sunday to review your tracker and plan the coming week's targets." }], output: "Your 5-a-Day Application Tracker — a consistent, measurable outreach system that turns landing your first client from a hope into a process." },
];

// ─────────────────────────────────────────────────────────────────────────────
function Hub({ onSelect }) {
  const tools = [
    { id: "m1", num: "01", type: "Diagnostic Quiz · 5 min", title: "Application Killer Audit", desc: "Find out exactly why your applications are being ignored — and get your personalized fix. 10 honest questions. One clear answer." },
    { id: "m2", num: "02", type: "Guide · 20 min read", title: "The First Client Blueprint", desc: "Three specific shifts that turn an invisible applicant into a VA that clients actually reply to — with AI prompts for each shift." },
    { id: "m3", num: "03", type: "Interactive Builder · 45–60 min", title: "VA Launch Kit Builder", desc: "Build your pitch, portfolio, profile, and outreach tracker in one sitting. Leave with everything you need to send your first applications today." },
  ];
  return (
    <>
      <div className="st-hero fade-up">
        <div className="st-hero-grid" />
        <div className="st-hero-ghost">ST</div>
        <div className="st-hero-content">
          <div className="st-tag">Stage 01 — Starter Trifecta · Beginners &amp; Career Shifters</div>
          <h1 className="st-display" style={{ fontSize: "clamp(64px, 9vw, 120px)", marginBottom: 28 }}>
            YOUR STARTER<br /><span style={{ WebkitTextStroke: "1.5px #EDE9E3", color: "transparent" }}>TRIFECTA</span>
          </h1>
          <p className="st-body" style={{ maxWidth: 560 }}>You've been applying. You've been trying. The silence is not a reflection of your worth — it's a signal that something in your approach needs to change. These three tools find what that is and fix it.</p>
        </div>
      </div>
      <div className="st-content">
        <div className="st-stat-row">
          {[["3", "Free tools"], ["10", "Questions"], ["0", "Cost"]].map(([n, l]) => (
            <div key={l}><span className="st-stat-num">{n}</span><span className="st-stat-label">{l}</span></div>
          ))}
        </div>
        <div className="st-card-grid">
          {tools.map((t, i) => (
            <button key={t.id} onClick={() => onSelect(t.id)} className={`st-tool-card${i === 0 ? " featured" : ""}`}>
              <span className="st-tool-num">{t.num}</span>
              <div><span className="st-tool-type">{t.type}</span><span className="st-tool-title">{t.title}</span><span className="st-tool-desc">{t.desc}</span></div>
              <span className="st-tool-arrow">→</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
function Tool1({ onBack }) {
  const [stage, setStage]         = useState("intro");
  const [qIndex, setQIndex]       = useState(0);
  const [answers, setAnswers]     = useState({});
  const [selected, setSelected]   = useState(null);
  const [email, setEmail]         = useState("");
  const [firstName, setFirstName] = useState("");
  const [result, setResult]       = useState(null);
  const [scores, setScores]       = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const progress = stage === "intro" ? 0 : stage === "quiz" ? Math.round((qIndex / QUESTIONS.length) * 100) : stage === "gate" ? 95 : 100;
  const currentQ = QUESTIONS[qIndex];

  const nextQuestion = () => {
    const updated = { ...answers, [currentQ.id]: selected };
    setAnswers(updated);
    setSelected(null);
    if (qIndex < QUESTIONS.length - 1) {
      setQIndex(qIndex + 1);
    } else {
      const totals = { E: 0, N: 0, W: 0 };
      Object.values(updated).forEach(opt => { totals.E += opt.scores.E; totals.N += opt.scores.N; totals.W += opt.scores.W; });
      setScores(totals);
      setResult(Object.entries(totals).sort((a, b) => b[1] - a[1])[0][0]);
      setStage("gate");
    }
  };

  const submitEmail = async () => {
    if (!email || !firstName) return;
    setSubmitting(true);
    try {
      await fetch("https://api.convertkit.com/v3/forms/9140190/subscribe", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ api_key: "eC5dt0WcDmbUQmw8RVYytA", first_name: firstName, email, tags: [result === "E" ? "Empty Pitch" : result === "N" ? "No-Proof Trap" : "Wrong Room"] }),
      });
    } catch (e) { console.error(e); }
    setSubmitting(false);
    setStage("result");
  };

  const maxScore = scores ? Math.max(...Object.values(scores)) || 1 : 1;

  return (
    <>
      <div className="st-progress"><div className="st-progress-fill" style={{ width: `${progress}%` }} /></div>
      {stage === "intro" && (
        <div className="fade-up">
          <div className="st-hero"><div className="st-hero-grid" /><div className="st-hero-ghost">AKA</div>
            <div className="st-hero-content">
              <div className="st-tag">Tool 01 · Diagnostic Quiz · 5 min</div>
              <h2 className="st-display" style={{ fontSize: "clamp(56px, 8vw, 108px)", marginBottom: 28 }}>APPLICATION<br /><span style={{ WebkitTextStroke: "1.5px #EDE9E3", color: "transparent" }}>KILLER</span><br />AUDIT</h2>
              <p className="st-body st-italic" style={{ maxWidth: 520 }}>You've been applying. The replies aren't coming — and you're starting to wonder if something is wrong with you. Nothing is wrong with you. Something is wrong with your approach.</p>
            </div>
          </div>
          <div className="st-content">
            <div className="st-stat-row">{[["10", "Questions"], ["5", "Minutes"], ["1", "Real answer"]].map(([n, l]) => (<div key={l}><span className="st-stat-num">{n}</span><span className="st-stat-label">{l}</span></div>))}</div>
            <button className="st-btn st-btn-primary" onClick={() => setStage("quiz")}>Find out why →</button>
          </div>
        </div>
      )}
      {stage === "quiz" && currentQ && (
        <div className="st-content fade-up" key={qIndex}>
          <div className="st-tag">{currentQ.section}</div>
          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: "0.2em", color: "rgba(237,233,227,0.2)", marginBottom: 28 }}>Question {qIndex + 1} of {QUESTIONS.length}</p>
          <h3 style={{ fontFamily: "'Libre Baskerville', serif", fontSize: "clamp(18px, 2.8vw, 26px)", fontWeight: 700, lineHeight: 1.4, color: "var(--fog)", marginBottom: 36 }}>{currentQ.question}</h3>
          <div className="st-options">
            {currentQ.options.map((opt, i) => (
              <button key={i} onClick={() => setSelected(opt)} className={`st-option${selected === opt ? " selected" : ""}`}>
                <div className="st-option-marker">{selected === opt ? "✓" : MARKERS[i]}</div>
                <span className="st-option-text">{opt.text}</span>
              </button>
            ))}
          </div>
          <button className="st-btn st-btn-primary" onClick={nextQuestion} disabled={!selected} style={{ opacity: selected ? 1 : 0, pointerEvents: selected ? "all" : "none", transition: "opacity 0.2s" }}>
            {qIndex < QUESTIONS.length - 1 ? "Next question →" : "See my result →"}
          </button>
        </div>
      )}
      {stage === "gate" && (
        <div className="st-content fade-up">
          <div className="st-tag">Audit Complete</div>
          <h2 className="st-display" style={{ fontSize: "clamp(48px, 7vw, 88px)", marginBottom: 24 }}>WE FOUND<br />YOUR BLOCK.</h2>
          <p className="st-body" style={{ maxWidth: 480, marginBottom: 36 }}>Enter your name and email to get your personalized result — exactly why your applications are being ignored and the one thing that fixes it.</p>
          <div style={{ maxWidth: 440 }}>
            <input className="st-input" type="text" placeholder="Your first name" value={firstName} onChange={e => setFirstName(e.target.value)} />
            <input className="st-input" type="email" placeholder="Your email address" value={email} onChange={e => setEmail(e.target.value)} />
            <button className="st-btn st-btn-primary" onClick={submitEmail} disabled={!email || !firstName || submitting}>{submitting ? "One moment..." : "Show me what's blocking me →"}</button>
          </div>
          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: "0.1em", color: "rgba(237,233,227,0.2)", marginTop: 16 }}>No spam. Just your result and your next step.</p>
        </div>
      )}
      {stage === "result" && result && scores && (
        <div className="st-content fade-up">
          <div className="st-tag">{firstName ? `${firstName}'s` : "Your"} Diagnosis</div>
          <h2 className="st-display" style={{ fontSize: "clamp(40px, 6vw, 72px)", marginBottom: 20 }}>{RESULTS[result].code}</h2>
          <p className="st-body st-italic" style={{ maxWidth: 560, marginBottom: 40 }}>{RESULTS[result].tagline}</p>
          <div className="st-rule" />
          <div className="st-score-grid">
            {Object.entries(scores).map(([key, val]) => (
              <div key={key} className={`st-score-cell${result === key ? " dominant" : ""}`}>
                <span className="st-score-label">{result === key ? "Your main block" : "Also a factor"}</span>
                <span className="st-score-num">{val}</span>
                <div className="st-score-bar-track"><div className="st-score-bar-fill" style={{ width: `${(val / maxScore) * 100}%` }} /></div>
                <span className="st-score-name">{KILLER_NAMES[key]}</span>
              </div>
            ))}
          </div>
          {[["What This Actually Means", RESULTS[result].diagnosis], ["What It's Costing You", RESULTS[result].costs], ["Your One Fix", RESULTS[result].fix]].map(([label, text]) => (
            <div key={label} className="st-result-block"><div className="st-tag">{label}</div><p className="st-body">{text}</p></div>
          ))}
          <div className="st-callout"><div className="st-tag">Your Next Step</div><p>{RESULTS[result].next}</p></div>
          <button className="st-btn st-btn-ghost" onClick={onBack}>← Back to all tools</button>
        </div>
      )}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
function Tool2({ onBack }) {
  const [active, setActive]       = useState(0);
  const [showPrompt, setShowPrompt] = useState(null);
  const sec = BLUEPRINT_SECTIONS[active];
  return (
    <>
      <div className="st-hero fade-up"><div className="st-hero-grid" /><div className="st-hero-ghost">FCB</div>
        <div className="st-hero-content">
          <div className="st-tag">Tool 02 · Guide · 20 min read</div>
          <h2 className="st-display" style={{ fontSize: "clamp(56px, 8vw, 108px)", marginBottom: 28 }}>THE FIRST<br /><span style={{ WebkitTextStroke: "1.5px #EDE9E3", color: "transparent" }}>CLIENT</span><br />BLUEPRINT</h2>
          <p className="st-body st-italic" style={{ maxWidth: 540 }}>Three specific shifts that turn an invisible applicant into the VA that clients actually reply to. Each comes with an AI prompt you can use today — even with zero experience.</p>
        </div>
      </div>
      <div className="st-content fade-up">
        <div className="st-tabs">{BLUEPRINT_SECTIONS.map((s, i) => (<button key={i} onClick={() => { setActive(i); setShowPrompt(null); }} className={`st-tab${active === i ? " active" : ""}`}>{s.number}</button>))}</div>
        <div key={active} className="fade-up">
          <div className="st-tag">{sec.number}</div>
          <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(32px, 4vw, 52px)", color: "var(--fog)", letterSpacing: "0.02em", marginBottom: 8 }}>{sec.title}</h3>
          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--steel)", marginBottom: 28 }}>{sec.subtitle}</p>
          <p className="st-body" style={{ marginBottom: 36, paddingBottom: 36, borderBottom: "1px solid var(--rule)" }}>{sec.body}</p>
          <div className="st-tag">The Action</div>
          <h4 style={{ fontFamily: "'Libre Baskerville', serif", fontSize: 18, fontWeight: 700, color: "var(--fog)", marginBottom: 14 }}>{sec.action}</h4>
          <p className="st-body" style={{ marginBottom: 28 }}>{sec.action_desc}</p>
          <button className="st-btn st-btn-ghost" onClick={() => setShowPrompt(showPrompt === active ? null : active)}>{showPrompt === active ? "Hide AI prompt ↑" : "View AI prompt →"}</button>
          {showPrompt === active && (<div className="st-prompt-box fade-up"><span className="st-prompt-label">Copy this prompt into ChatGPT or Claude</span><p className="st-prompt-text">{sec.ai_prompt}</p></div>)}
          <div className="st-highlight"><p>— {sec.highlight}</p></div>
          <div className="st-btn-row">
            {active > 0 && <button className="st-btn st-btn-ghost" onClick={() => { setActive(active - 1); setShowPrompt(null); }}>← Previous shift</button>}
            {active < BLUEPRINT_SECTIONS.length - 1 ? <button className="st-btn st-btn-primary" onClick={() => { setActive(active + 1); setShowPrompt(null); }}>Next shift →</button> : <button className="st-btn st-btn-ghost" onClick={onBack}>← Back to all tools</button>}
          </div>
        </div>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
function Tool3({ onBack }) {
  const [checked, setChecked] = useState({});
  const [active, setActive]   = useState(0);
  const toggle    = id => setChecked(prev => ({ ...prev, [id]: !prev[id] }));
  const getPct    = comp => Math.round((comp.steps.filter(s => checked[s.id]).length / comp.steps.length) * 100);
  const totalSteps = LAUNCH_COMPONENTS.reduce((a, c) => a + c.steps.length, 0);
  const totalDone  = LAUNCH_COMPONENTS.reduce((a, c) => a + c.steps.filter(s => checked[s.id]).length, 0);
  const overallPct = Math.round((totalDone / totalSteps) * 100);
  const comp = LAUNCH_COMPONENTS[active];
  return (
    <>
      <div className="st-hero fade-up"><div className="st-hero-grid" /><div className="st-hero-ghost">VLK</div>
        <div className="st-hero-content">
          <div className="st-tag">Tool 03 · Interactive Builder · 45–60 min</div>
          <h2 className="st-display" style={{ fontSize: "clamp(56px, 8vw, 108px)", marginBottom: 28 }}>VA LAUNCH<br /><span style={{ WebkitTextStroke: "1.5px #EDE9E3", color: "transparent" }}>KIT BUILDER</span></h2>
          <p className="st-body st-italic" style={{ maxWidth: 520 }}>Build everything you need to land your first client — in one sitting. Check off each step as you complete it. Your launch kit builds as you go.</p>
        </div>
      </div>
      <div className="st-content fade-up">
        <div className="st-progress-bar">
          <div className="st-progress-inner">
            <div className="st-progress-meta"><span>Overall Progress</span><span>{totalDone}/{totalSteps} steps</span></div>
            <div className="st-progress-track"><div className="st-progress-filled" style={{ width: `${overallPct}%` }} /></div>
          </div>
          <span className="st-progress-pct">{overallPct}%</span>
        </div>
        <div className="st-comp-tabs">
          {LAUNCH_COMPONENTS.map((c, i) => {
            const pct = getPct(c);
            return (
              <button key={i} onClick={() => setActive(i)} className={`st-comp-tab${active === i ? " active" : ""}`}>
                <span className="st-comp-num">{c.number}</span>
                <span className="st-comp-done">{pct}% done</span>
                <div className="st-comp-track"><div className="st-comp-fill" style={{ width: `${pct}%` }} /></div>
              </button>
            );
          })}
        </div>
        <div key={active} className="fade-up">
          <div className="st-tag">Component {comp.number}</div>
          <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(28px, 3.5vw, 44px)", color: "var(--fog)", letterSpacing: "0.02em", marginBottom: 16 }}>{comp.title}</h3>
          <p className="st-body" style={{ marginBottom: 40, paddingBottom: 40, borderBottom: "1px solid var(--rule)" }}>{comp.desc}</p>
          <div className="st-tag">Build Steps</div>
          <div className="st-steps">
            {comp.steps.map((step, i) => (
              <button key={step.id} onClick={() => toggle(step.id)} className={`st-step${checked[step.id] ? " done" : ""}`}>
                <div className="st-step-marker">{checked[step.id] ? "✓" : i + 1}</div>
                <span className="st-step-text">{step.text}</span>
              </button>
            ))}
          </div>
          {getPct(comp) === 100 && (
            <div className="st-complete fade-up"><div className="st-tag">Component Complete ✓</div><p>{comp.output}</p></div>
          )}
          <div className="st-btn-row">
            {active > 0 && <button className="st-btn st-btn-ghost" onClick={() => setActive(active - 1)}>← Previous</button>}
            {active < LAUNCH_COMPONENTS.length - 1
              ? <button className="st-btn st-btn-primary" onClick={() => setActive(active + 1)}>Next component →</button>
              : overallPct === 100
                ? (<div className="st-complete fade-up" style={{ width: "100%" }}><div className="st-tag">Launch Kit Complete</div><p>Your VA Launch Kit is built. You have a pitch, a portfolio, a profile, and a daily outreach system. You are ready. Send your first five applications today. Systems Over Hustle™.</p><p className="muted">Once you land your first client — come back for the Lean Trifecta. That's where you learn how to keep them.</p><button className="st-btn st-btn-ghost" onClick={onBack} style={{ borderColor: "rgba(26,23,20,0.25)", color: "var(--ink)" }}>← Back to all tools</button></div>)
                : <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.15em", color: "var(--steel)", paddingTop: 16 }}>Complete all steps to finish your launch kit.</p>
            }
          </div>
        </div>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState("hub");
  return (
    <div className="app">
      <style>{GLOBAL_CSS}</style>
      <header className="st-nav">
        <div className="st-nav-left">
          {view !== "hub" && <button className="st-back-btn" onClick={() => setView("hub")}>← All tools</button>}
          <a href="https://marginmomentum.co" className="st-wordmark">Margin &amp; Momentum™ <span>Starter Trifecta</span></a>
        </div>
      </header>
      <main className="st-main">
        {view === "hub" && <Hub onSelect={id => setView(id)} />}
        {view === "m1"  && <Tool1 onBack={() => setView("hub")} />}
        {view === "m2"  && <Tool2 onBack={() => setView("hub")} />}
        {view === "m3"  && <Tool3 onBack={() => setView("hub")} />}
      </main>
      <footer className="st-footer">
        <span className="st-footer-l">Margin &amp; Momentum™</span>
        <span className="st-footer-r">Systems Over Hustle™</span>
      </footer>
    </div>
  );
}
