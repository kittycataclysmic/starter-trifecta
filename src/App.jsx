import { useState } from "react";

const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=DM+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --deep: #0F0D0B;
    --ink: #1A1714;
    --fog: #EDE9E3;
    --ash: #D9D4CE;
    --steel: #6B7280;
    --text-on-dark: #E8E4DF;
    --text-muted: #A09C96;
    --rule: rgba(237,233,227,0.12);
  }

  body {
    background: var(--deep);
    -webkit-font-smoothing: antialiased;
  }

  .app {
    font-family: 'Libre Baskerville', Georgia, serif;
    background: var(--deep);
    color: var(--text-on-dark);
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  body::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 0;
    opacity: 0.6;
  }

  .hdr {
    border-bottom: 1px solid var(--rule);
    padding: 18px 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: sticky;
    top: 0;
    background: rgba(15,13,11,0.92);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    z-index: 200;
  }

  .hdr-left { display: flex; align-items: center; gap: 20px; }

  .back-btn {
    background: none;
    border: none;
    font-family: 'DM Mono', monospace;
    font-size: 9px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--steel);
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 0;
    transition: color 0.2s;
  }
  .back-btn:hover { color: var(--fog); }

  .brand {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--fog);
  }

  .tag {
    font-family: 'DM Mono', monospace;
    font-size: 9px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--steel);
  }

  .prog { height: 2px; background: var(--rule); }
  .prog-fill { height: 100%; background: var(--fog); transition: width 0.5s ease; }

  .mm-main { flex: 1; display: flex; flex-direction: column; position: relative; z-index: 1; }

  .ftr {
    background: var(--ink);
    border-top: 1px solid var(--rule);
    padding: 16px 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    z-index: 1;
  }
  .ftr-l { font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: 2.5px; text-transform: uppercase; color: var(--fog); }
  .ftr-r { font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: 2.5px; text-transform: uppercase; color: var(--steel); }

  .btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    background: var(--fog);
    color: var(--deep);
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    padding: 16px 32px;
    border: none;
    cursor: pointer;
    transition: background 0.2s;
  }
  .btn-primary:hover { background: var(--ash); }
  .btn-primary:disabled { opacity: 0.3; cursor: default; }

  .btn-outline {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    background: transparent;
    color: var(--fog);
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    padding: 15px 31px;
    border: 1px solid rgba(237,233,227,0.25);
    cursor: pointer;
    transition: all 0.2s;
  }
  .btn-outline:hover { background: var(--fog); color: var(--deep); border-color: var(--fog); }

  .mm-input {
    border: 1px solid rgba(237,233,227,0.2);
    padding: 14px 18px;
    font-family: 'Libre Baskerville', serif;
    font-size: 14px;
    color: var(--fog);
    background: rgba(237,233,227,0.04);
    outline: none;
    width: 100%;
    transition: border-color 0.2s;
  }
  .mm-input::placeholder { color: var(--steel); }
  .mm-input:focus { border-color: rgba(237,233,227,0.4); }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .fade-up { animation: fadeUp 0.4s ease forwards; }

  @media (max-width: 640px) {
    .hdr { padding: 12px 20px; }
    .ftr { padding: 14px 20px; }
  }
`;

// ─── QUIZ DATA ───────────────────────────────────────────────────────────────
const QUESTIONS = [
  { id: 1, section: "YOUR APPLICATION", question: "When you write an application or proposal to a potential client, what does the first paragraph usually say?", options: [{ text: "I describe myself — my background, experience, and what I can do", scores: { E: 2, N: 0, W: 0 } }, { text: "I mention what I noticed about their business and how I can help specifically", scores: { E: 0, N: 0, W: 0 } }, { text: "I copy a template I found online and change the name", scores: { E: 2, N: 0, W: 1 } }, { text: "I haven't sent many — I'm not sure what to write", scores: { E: 1, N: 1, W: 0 } }] },
  { id: 2, section: "YOUR APPLICATION", question: "When a client posts that they need a VA, what do you focus on in your reply?", options: [{ text: "Listing my skills and what I'm capable of doing", scores: { E: 2, N: 0, W: 0 } }, { text: "Addressing their specific problem and how I would solve it", scores: { E: 0, N: 0, W: 0 } }, { text: "Keeping it short — just my rates and availability", scores: { E: 1, N: 0, W: 1 } }, { text: "I'm not sure — I just write whatever feels natural", scores: { E: 2, N: 0, W: 0 } }] },
  { id: 3, section: "YOUR APPLICATION", question: "How do you end a job application or outreach message?", options: [{ text: "With something like 'I look forward to hearing from you'", scores: { E: 1, N: 0, W: 0 } }, { text: "With a specific next step — a call, a question, a small offer", scores: { E: 0, N: 0, W: 0 } }, { text: "With my rates and a request for them to message me back", scores: { E: 0, N: 0, W: 1 } }, { text: "I don't have a consistent ending", scores: { E: 1, N: 1, W: 0 } }] },
  { id: 4, section: "YOUR PORTFOLIO", question: "What do you include when a client asks to see your work or portfolio?", options: [{ text: "Sample projects I created myself to show what I can do", scores: { E: 0, N: 0, W: 0 } }, { text: "I say I'm new and offer to do a test task for free", scores: { E: 0, N: 2, W: 0 } }, { text: "I leave it blank or skip the portfolio section", scores: { E: 0, N: 2, W: 0 } }, { text: "I share skills or certificates but no actual work samples", scores: { E: 0, N: 1, W: 0 } }] },
  { id: 5, section: "YOUR PORTFOLIO", question: "If a client asked you right now to prove you can do the job — what would you show them?", options: [{ text: "3 or more work samples relevant to what they need", scores: { E: 0, N: 0, W: 0 } }, { text: "1 or 2 things — but they're generic, not specific to their industry", scores: { E: 0, N: 1, W: 0 } }, { text: "Certificates or course completions but no actual output", scores: { E: 0, N: 2, W: 0 } }, { text: "Nothing concrete — I'd have to make something on the spot", scores: { E: 0, N: 2, W: 0 } }] },
  { id: 6, section: "YOUR PORTFOLIO", question: "Have you ever created sample work specifically to show potential clients what you can do?", options: [{ text: "Yes — I have multiple samples for the services I offer", scores: { E: 0, N: 0, W: 0 } }, { text: "I have one or two things but haven't done this intentionally", scores: { E: 0, N: 1, W: 0 } }, { text: "No — I didn't know that was something I should do", scores: { E: 0, N: 2, W: 0 } }, { text: "No — I was waiting until I had a real client first", scores: { E: 0, N: 2, W: 0 } }] },
  { id: 7, section: "WHERE YOU APPLY", question: "Where do you currently look for VA clients or job postings?", options: [{ text: "Facebook VA groups and job boards like OnlineJobs or Upwork", scores: { E: 0, N: 0, W: 2 } }, { text: "A mix — job boards plus direct outreach to business owners", scores: { E: 0, N: 0, W: 1 } }, { text: "Referrals from people I know or communities I'm part of", scores: { E: 0, N: 0, W: 0 } }, { text: "I'm not sure where to look — I apply wherever I see a post", scores: { E: 0, N: 0, W: 2 } }] },
  { id: 8, section: "WHERE YOU APPLY", question: "When you apply on a platform or group, how many other people do you think are applying for the same post?", options: [{ text: "Probably a few — I try to find less competitive opportunities", scores: { E: 0, N: 0, W: 0 } }, { text: "Maybe 10 to 30 others", scores: { E: 0, N: 0, W: 1 } }, { text: "Probably 50 or more — the posts usually get a lot of comments", scores: { E: 0, N: 0, W: 2 } }, { text: "I don't know — I just apply and hope for the best", scores: { E: 0, N: 0, W: 2 } }] },
  { id: 9, section: "WHERE YOU APPLY", question: "Have you ever reached out directly to a business owner who wasn't actively hiring?", options: [{ text: "Yes — this is part of how I look for clients", scores: { E: 0, N: 0, W: 0 } }, { text: "I've thought about it but wasn't sure how to do it", scores: { E: 0, N: 0, W: 1 } }, { text: "No — it felt too forward or like I'd be bothering them", scores: { E: 0, N: 0, W: 2 } }, { text: "No — I only apply when there's a job post", scores: { E: 0, N: 0, W: 2 } }] },
  { id: 10, section: "YOUR FOLLOW-UP", question: "After you send an application and hear nothing back, what do you do?", options: [{ text: "Follow up once after 2–3 days with a short, polite message", scores: { E: 0, N: 0, W: 0 } }, { text: "Wait and hope they reply", scores: { E: 1, N: 0, W: 1 } }, { text: "Move on immediately and apply somewhere else", scores: { E: 0, N: 0, W: 1 } }, { text: "I feel too shy to follow up — I don't want to seem desperate", scores: { E: 1, N: 0, W: 1 } }] },
];

const RESULTS = {
  E: {
    code: "THE EMPTY PITCH",
    tagline: "You're applying. You're trying. But your message sounds like everyone else's — and clients can't see why they should pick you.",
    diagnosis: "Right now, your application talks about you — your background, your skills, your willingness to work hard. But the client isn't thinking about you. They're thinking about their problem. The moment you make your pitch about them instead of you, you stop being one of 50 applicants and start being the only one who actually understood what they needed.",
    costs: "Clients read your message, feel no specific connection to it, and move on. Your application isn't being rejected — it's being forgotten. There's a difference. Rejected means they saw you and said no. Forgotten means they never really saw you at all.",
    fix: "Rewrite your application so the first three sentences are entirely about them — what you noticed about their business, what problem you think they're trying to solve, and one specific way you can help. Your name and background come after. This one change will make your message stand out from every other application in the pile.",
    next: "The First Client Blueprint walks you through exactly how to write this kind of pitch — with an AI prompt that customizes it for every client in under 10 minutes.",
  },
  N: {
    code: "THE NO-PROOF TRAP",
    tagline: "You have the skills. You have the drive. But you have nothing to show — and clients need to see before they trust.",
    diagnosis: "When a client is choosing between applicants they've never met, they look for evidence. Past work. Samples. Proof that you've done something similar. Right now you don't have that — not because you're incapable, but because you haven't worked with clients yet. The trap is believing you need a client to build a portfolio. You don't. You need a portfolio to get a client.",
    costs: "When you leave the portfolio section blank or say 'I'm new but I'm a fast learner,' you're asking the client to take a risk on you with nothing to justify it. Clients don't take risks on strangers. They take risks on people who've already shown them something worth betting on.",
    fix: "This week, create three sample work pieces for the services you want to offer. Pick a real business you admire and do the work as if they hired you. These become your portfolio. They're real work, even if they weren't paid for.",
    next: "The First Client Blueprint includes a step-by-step method for building a portfolio from scratch using AI — including the exact types of samples that make hiring clients say yes.",
  },
  W: {
    code: "THE WRONG ROOM",
    tagline: "You're not being ignored because you're unqualified. You're standing in the most crowded room in the building.",
    diagnosis: "Facebook VA groups, Upwork, and generic job boards are where thousands of VAs compete for the same small number of postings. As a beginner, you are at a structural disadvantage here. You have less experience than established VAs and no reviews to compete on. This is not a reflection of your ability. It's a math problem — when 80 people apply for one job, 79 get ignored regardless of quality.",
    costs: "You keep applying, keep getting silence, and start to believe the problem is you. It isn't. The problem is the room. You're playing a volume game in a space designed for experienced VAs — and the longer you stay there, the more your confidence erodes while your results stay the same.",
    fix: "Stop competing in crowded rooms and start showing up where there's almost no competition — direct outreach to small business owners, warm communities where trust is already built, and one focused niche where your beginner status is an advantage, not a liability.",
    next: "The First Client Blueprint shows you exactly which rooms beginner VAs actually win in — and gives you the outreach script that gets responses even with zero experience.",
  },
};

const BLUEPRINT_SECTIONS = [
  {
    number: "SHIFT 01", title: "From Biography to Solution", subtitle: "Stop talking about yourself. Start solving their problem.",
    body: "Every day, a hiring client opens 40 applications that all start the same way: 'Hi, my name is [Name] and I am a VA with skills in X, Y, and Z.' They stop reading after line two — not because those VAs are bad, but because nothing in that opening made the client feel understood. The VAs who get replies open with the client's problem, not their own resume.",
    action: "The Solution-First Pitch Formula",
    action_desc: "Every strong application follows this sequence: (1) One sentence showing you understand their situation. (2) One sentence naming the specific problem you'll solve. (3) One sentence explaining why you're the right person. (4) One clear next step. Four sentences. No autobiography. No skills list.",
    ai_prompt: `Use this prompt in ChatGPT or Claude before every application:\n\n"I am a VA applying for this job post: [paste the job post]. Help me write a 4-sentence application that: (1) opens by showing I understand this client's situation, (2) names the specific problem they're trying to solve, (3) explains why I'm the right person to help, and (4) ends with a clear next step that invites a reply. Do not start with my name or a list of my skills. Keep the whole thing under 100 words."`,
    highlight: "Applications that open with the client's problem — not the applicant's background — receive 4× more replies, even from beginner VAs with no experience listed.",
  },
  {
    number: "SHIFT 02", title: "From No Portfolio to Proof", subtitle: "You don't need clients to have a portfolio. You need a portfolio to get clients.",
    body: "The most common mistake beginners make is waiting — waiting for a client to give them something to put in their portfolio. But clients won't hire you without a portfolio. A portfolio built from self-initiated sample projects is completely legitimate. Hiring clients look at the quality of the work, not whether it was paid for.",
    action: "The Sample Project Method",
    action_desc: "Pick a real business you admire. Pretend they hired you and do the work. If you offer email management, write sample inbox replies for their type of business. If you offer social media, create five posts in their voice. Use the AI prompt below to create professional-grade samples even if you're just starting out.",
    ai_prompt: `Use this prompt for each service you want to offer:\n\n"I am building a VA portfolio and I want to create a sample project for [name your service]. The pretend client is a [type of business]. Create a realistic, professional sample of this work that I can include in my portfolio to show potential clients what I can do. Make it high quality — something that would genuinely impress a hiring client in this industry."\n\nRepeat for 3 different service types. Save outputs as PDF. That is your portfolio.`,
    highlight: "A portfolio of 3 self-initiated samples is more convincing than a blank section with 'willing to do a test task.' One shows capability. The other asks clients to take a risk.",
  },
  {
    number: "SHIFT 03", title: "From Wrong Room to Right Room", subtitle: "Stop competing with 80 people for one job. Show up where there's almost no competition.",
    body: "VA job boards and Facebook groups are designed for experienced VAs who can outcompete beginners on price, reviews, and speed. There are three rooms where beginners actually win — rooms where showing up early, being specific, and being genuinely helpful matters more than having 5 years of experience.",
    action: "The Three Winning Rooms for Beginners",
    action_desc: "Room 1: Warm Communities — join Facebook groups or Discord servers built around a specific business type. Contribute first. When someone mentions feeling overwhelmed, that's your moment. Room 2: Direct Outreach — find 5 small business owners whose business clearly needs support. Send a personalized message using the AI prompt below. Room 3: Niche Specialisation — pick one business type and become the VA who knows that industry best.",
    ai_prompt: `Use this prompt to write your direct outreach message:\n\n"I am a VA who specializes in helping [type of business]. I want to send a short, non-salesy outreach message to a [type of business owner] I found on [platform]. Their business is [describe what you observed]. Write me a genuine, helpful 3-sentence message that: (1) mentions one specific thing I noticed about their business, (2) offers one concrete observation or tip, and (3) ends with a soft invitation to chat — not a pitch. Make it feel like a human wrote it."`,
    highlight: "Direct outreach to 5 targeted business owners per day produces more first clients than sending 50 applications to job boards every week. Specificity beats volume every time.",
  },
];

const LAUNCH_COMPONENTS = [
  {
    number: "01", title: "Your Solution-First Pitch",
    desc: "A ready-to-send application template that puts the client's problem first — so your message stands out from every other VA who just listed their skills.",
    steps: [
      { id: "p1", text: "Decide on one type of client you want to serve first — be specific. (Example: online coaches, e-commerce store owners, real estate agents)" },
      { id: "p2", text: "Write one sentence describing the most common problem that type of client has." },
      { id: "p3", text: "Write one sentence explaining what you do to solve that problem." },
      { id: "p4", text: "Write your closing line — a soft, specific next step that invites a reply." },
      { id: "p5", text: "Put the four sentences together. Read it out loud. If it sounds like a real human wrote it — save it as your base pitch template." },
    ],
    output: "Your Base Pitch Template — a 4-sentence application you can personalize for any client in under 5 minutes using the AI prompt from Shift 01.",
  },
  {
    number: "02", title: "Your First Portfolio Piece",
    desc: "A real, professional work sample that shows potential clients exactly what you can do — built from scratch, no clients needed.",
    steps: [
      { id: "q1", text: "Choose one service you want to offer and one type of business you want to serve." },
      { id: "q2", text: "Pick a real business that fits — find one on Instagram or Google. You are not contacting them. They are your pretend client." },
      { id: "q3", text: "Use the AI prompt from Shift 02 of the Blueprint to create a full, professional sample of your service for this business." },
      { id: "q4", text: "Paste the output into Canva, Google Docs, or Notion. Add a cover page: 'Sample Project — [Service] for [Type of Business].'" },
      { id: "q5", text: "Save it as a PDF. Repeat two more times for different service types or niches. You now have a 3-piece portfolio." },
    ],
    output: "Your First Portfolio Piece and the method to build two more — professional samples that prove your capability before your first paid client.",
  },
  {
    number: "03", title: "Your Beginner-Ready Profile",
    desc: "A compelling profile that works on any platform — honest about your experience but confident about your capability.",
    steps: [
      { id: "r1", text: "Write your headline: 'VA helping [type of client] with [specific problem] so they can [specific outcome].' Not 'Virtual Assistant available for hire.'" },
      { id: "r2", text: "Write your about section — 3 sentences only. Who you help and what problem you solve. How you help them. What makes working with you feel different." },
      { id: "r3", text: "Remove the words 'newbie', 'beginner', 'no experience', or 'willing to learn' from every version of your profile. Describe what you can do and what you've built — including your portfolio samples." },
      { id: "r4", text: "Add your portfolio: link or attach your 3 samples. Label them clearly: 'Sample — [Service Type] for [Industry].'" },
      { id: "r5", text: "Set your rate. Do not start at ₱0 or say 'negotiable.' Pick a number that feels uncomfortable but fair — that discomfort means it's in the right range." },
    ],
    output: "Your Beginner-Ready Profile — a confident, specific, and honest profile that positions you as a capable professional, not someone asking for a chance.",
  },
  {
    number: "04", title: "Your 5-a-Day Application Tracker",
    desc: "A daily outreach system that makes landing your first client a process — not a hope.",
    steps: [
      { id: "t1", text: "Create a tracker — Google Sheet or Notion table — with columns: Date Sent / Client or Post / Platform / Pitch Angle / Follow-Up Date / Status" },
      { id: "t2", text: "Commit to 5 applications or outreach messages per day, 5 days a week. Write this number somewhere visible. This is your non-negotiable daily action." },
      { id: "t3", text: "For every application sent, set a follow-up date 3 days later. If no reply: 'Hi [Name], just following up on my message. Happy to send a sample of my work if that would help.'" },
      { id: "t4", text: "After 2 weeks, review your tracker. Which pitch angles got replies? Which platforms produced responses? Double down on what's working." },
      { id: "t5", text: "Set a weekly 20-minute calendar block every Sunday to review your tracker and plan the coming week's targets." },
    ],
    output: "Your 5-a-Day Application Tracker — a consistent, measurable outreach system that turns landing your first client from a hope into a process.",
  },
];

const MARKERS = ["A", "B", "C", "D"];
const KILLER_NAMES = { E: "Empty Pitch", N: "No-Proof Trap", W: "Wrong Room" };

// ─── SHARED STYLE TOKENS ─────────────────────────────────────────────────────
const C = {
  label:    { fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: 3, textTransform: "uppercase", color: "#6B7280", display: "block", marginBottom: 20 },
  heading:  { fontFamily: "'Bebas Neue', sans-serif", lineHeight: 0.92, color: "#EDE9E3", letterSpacing: 1, marginBottom: 28 },
  rule:     { width: 40, height: 2, background: "rgba(237,233,227,0.2)", marginBottom: 28 },
  body:     { fontSize: 15, lineHeight: 1.85, color: "#A09C96", marginBottom: 36 },
  divider:  { height: 1, background: "rgba(237,233,227,0.08)", marginBottom: 32 },
};

// ─────────────────────────────────────────────────────────────────────────────
// HUB
// ─────────────────────────────────────────────────────────────────────────────
function Hub({ onSelect }) {
  const tools = [
    { id: "m1", num: "01", type: "Diagnostic Quiz · 5 min", title: "Application Killer Audit", desc: "Find out exactly why your applications are being ignored — and get your personalized fix. 10 honest questions. One clear answer." },
    { id: "m2", num: "02", type: "Guide · 20 min read",     title: "The First Client Blueprint", desc: "Three specific shifts that turn an invisible applicant into a VA that clients actually reply to — with AI prompts for each shift." },
    { id: "m3", num: "03", type: "Interactive Builder · 45–60 min", title: "VA Launch Kit Builder", desc: "Build your pitch, portfolio, profile, and outreach tracker in one sitting. Leave with everything you need to send your first applications today." },
  ];

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "60px 40px 80px" }} className="fade-up">
      <span style={C.label}>Margin &amp; Momentum™ · Starter Trifecta · For Beginners &amp; Career Shifters</span>
      <h1 style={{ ...C.heading, fontSize: "clamp(52px, 9vw, 88px)" }}>
        YOUR STARTER<br />
        <span style={{ WebkitTextStroke: "1.5px #EDE9E3", color: "transparent" }}>TRIFECTA</span>
      </h1>
      <div style={C.rule} />
      <p style={{ ...C.body, maxWidth: 560 }}>
        You've been applying. You've been trying. The silence is not a reflection of your worth — it's a signal that something in your approach needs to change. These three tools find what that is and fix it.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {tools.map((t, i) => (
          <button
            key={t.id}
            onClick={() => onSelect(t.id)}
            style={{
              display: "grid", gridTemplateColumns: "64px 1fr auto", alignItems: "center", gap: 24,
              padding: "28px 32px",
              border: `1px solid ${i === 0 ? "#EDE9E3" : "rgba(237,233,227,0.12)"}`,
              background: i === 0 ? "#EDE9E3" : "rgba(237,233,227,0.02)",
              cursor: "pointer", textAlign: "left", transition: "all 0.2s",
            }}
            onMouseEnter={e => { if (i !== 0) e.currentTarget.style.background = "rgba(237,233,227,0.06)"; }}
            onMouseLeave={e => { if (i !== 0) e.currentTarget.style.background = "rgba(237,233,227,0.02)"; }}
          >
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 40, color: i === 0 ? "#0F0D0B" : "#EDE9E3", lineHeight: 1 }}>{t.num}</span>
            <div>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, letterSpacing: 2, textTransform: "uppercase", color: i === 0 ? "#6B7280" : "#6B7280", display: "block", marginBottom: 6 }}>{t.type}</span>
              <span style={{ fontFamily: "'Libre Baskerville', serif", fontSize: 16, fontWeight: 700, color: i === 0 ? "#0F0D0B" : "#EDE9E3", display: "block", marginBottom: 6 }}>{t.title}</span>
              <span style={{ fontFamily: "'Libre Baskerville', serif", fontSize: 13, lineHeight: 1.6, color: i === 0 ? "#4A4A4A" : "#A09C96" }}>{t.desc}</span>
            </div>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 18, color: i === 0 ? "#0F0D0B" : "#EDE9E3" }}>→</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TOOL 1
// ─────────────────────────────────────────────────────────────────────────────
function Tool1({ onBack }) {
  const [stage, setStage]           = useState("intro");
  const [qIndex, setQIndex]         = useState(0);
  const [answers, setAnswers]       = useState({});
  const [selected, setSelected]     = useState(null);
  const [email, setEmail]           = useState("");
  const [firstName, setFirstName]   = useState("");
  const [result, setResult]         = useState(null);
  const [scores, setScores]         = useState(null);
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
    <div>
      <div style={{ height: 2, background: "rgba(237,233,227,0.08)" }}>
        <div style={{ height: "100%", background: "#EDE9E3", width: `${progress}%`, transition: "width 0.5s ease" }} />
      </div>
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "56px 40px 80px" }} className="fade-up">

        {stage === "intro" && (
          <>
            <span style={C.label}>Diagnostic Audit · Beginners &amp; Career Shifters</span>
            <h2 style={{ ...C.heading, fontSize: "clamp(44px, 8vw, 76px)" }}>
              APPLICATION<br />
              <span style={{ WebkitTextStroke: "1.5px #EDE9E3", color: "transparent" }}>KILLER</span><br />
              AUDIT
            </h2>
            <div style={C.rule} />
            <p style={C.body}>You've been applying. The replies aren't coming — and you're starting to wonder if something is wrong with you. Nothing is wrong with you. Something is wrong with your approach. This audit finds out exactly what that is.</p>
            <div style={{ display: "flex", gap: 40, marginBottom: 48, paddingBottom: 40, borderBottom: "1px solid rgba(237,233,227,0.08)" }}>
              {[["10", "Questions"], ["5", "Minutes"], ["1", "Real answer"]].map(([n, l]) => (
                <div key={l} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 40, color: "#EDE9E3", lineHeight: 1 }}>{n}</span>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", color: "#6B7280" }}>{l}</span>
                </div>
              ))}
            </div>
            <button className="btn-primary" onClick={() => setStage("quiz")}>Find out why →</button>
          </>
        )}

        {stage === "quiz" && currentQ && (
          <div key={qIndex} className="fade-up">
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: 3, textTransform: "uppercase", color: "#6B7280", display: "block", marginBottom: 8 }}>{currentQ.section}</span>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: 2, color: "rgba(237,233,227,0.2)", display: "block", marginBottom: 28 }}>Question {qIndex + 1} of {QUESTIONS.length}</span>
            <h3 style={{ fontFamily: "'Libre Baskerville', serif", fontSize: "clamp(18px, 3vw, 24px)", fontWeight: 700, lineHeight: 1.4, color: "#EDE9E3", marginBottom: 36 }}>{currentQ.question}</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 44 }}>
              {currentQ.options.map((opt, i) => {
                const sel = selected === opt;
                return (
                  <button key={i} onClick={() => setSelected(opt)} style={{
                    display: "flex", alignItems: "flex-start", gap: 16, padding: "18px 22px",
                    border: `1px solid ${sel ? "#EDE9E3" : "rgba(237,233,227,0.12)"}`,
                    background: sel ? "#EDE9E3" : "rgba(237,233,227,0.02)",
                    cursor: "pointer", textAlign: "left", width: "100%", transition: "all 0.15s",
                  }}>
                    <div style={{
                      flexShrink: 0, width: 24, height: 24, borderRadius: "50%",
                      border: `1.5px solid ${sel ? "#0F0D0B" : "rgba(237,233,227,0.25)"}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontFamily: "'DM Mono', monospace", fontSize: 10,
                      color: sel ? "#EDE9E3" : "rgba(237,233,227,0.3)",
                      background: sel ? "#0F0D0B" : "transparent", marginTop: 1,
                    }}>{sel ? "✓" : MARKERS[i]}</div>
                    <span style={{ fontFamily: "'Libre Baskerville', serif", fontSize: 14, lineHeight: 1.65, color: sel ? "#0F0D0B" : "#A09C96" }}>{opt.text}</span>
                  </button>
                );
              })}
            </div>
            <button className="btn-primary" onClick={nextQuestion} disabled={!selected} style={{ opacity: selected ? 1 : 0, transition: "opacity 0.2s", pointerEvents: selected ? "all" : "none" }}>
              {qIndex < QUESTIONS.length - 1 ? "Next question →" : "See my result →"}
            </button>
          </div>
        )}

        {stage === "gate" && (
          <div className="fade-up">
            <span style={C.label}>Audit Complete · Your Result Is Ready</span>
            <h2 style={{ ...C.heading, fontSize: "clamp(44px, 8vw, 68px)", marginBottom: 24 }}>WE FOUND<br />YOUR BLOCK.</h2>
            <p style={{ ...C.body, maxWidth: 480 }}>Enter your name and email to get your personalized result — exactly why your applications are being ignored and the one thing that fixes it.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 420 }}>
              <input className="mm-input" type="text" placeholder="Your first name" value={firstName} onChange={e => setFirstName(e.target.value)} />
              <input className="mm-input" type="email" placeholder="Your email address" value={email} onChange={e => setEmail(e.target.value)} />
              <button className="btn-primary" onClick={submitEmail} disabled={!email || !firstName || submitting}>{submitting ? "One moment..." : "Show me what's blocking me →"}</button>
            </div>
            <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: 1, color: "rgba(237,233,227,0.2)", marginTop: 16 }}>No spam. Just your result and your next step.</p>
          </div>
        )}

        {stage === "result" && result && scores && (
          <div className="fade-up">
            <div style={{ borderBottom: "1px solid rgba(237,233,227,0.12)", paddingBottom: 32, marginBottom: 40 }}>
              <span style={C.label}>{firstName ? `${firstName}'s` : "Your"} Application Killer Diagnosis</span>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(36px, 7vw, 64px)", lineHeight: 0.92, color: "#EDE9E3", letterSpacing: 1, marginBottom: 20 }}>{RESULTS[result].code}</div>
              <p style={{ fontSize: 15, fontStyle: "italic", lineHeight: 1.7, color: "#A09C96", paddingLeft: 20, borderLeft: "2px solid #6B7280", maxWidth: 520 }}>{RESULTS[result].tagline}</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2, background: "rgba(237,233,227,0.08)", marginBottom: 44 }}>
              {Object.entries(scores).map(([key, val]) => {
                const dom = result === key;
                return (
                  <div key={key} style={{ background: dom ? "#EDE9E3" : "rgba(237,233,227,0.03)", padding: "18px 16px" }}>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, letterSpacing: 2, textTransform: "uppercase", color: dom ? "#6B7280" : "#6B7280", display: "block", marginBottom: 6 }}>{dom ? "Your main block" : "Also a factor"}</span>
                    <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 36, color: dom ? "#0F0D0B" : "#EDE9E3", display: "block", lineHeight: 1, marginBottom: 8 }}>{val}</span>
                    <div style={{ height: 2, background: "rgba(237,233,227,0.12)", marginBottom: 8 }}>
                      <div style={{ height: "100%", background: dom ? "#0F0D0B" : "#EDE9E3", width: `${(val / maxScore) * 100}%` }} />
                    </div>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, letterSpacing: 1.5, textTransform: "uppercase", color: dom ? "#0F0D0B" : "#A09C96", fontWeight: 500 }}>{KILLER_NAMES[key]}</span>
                  </div>
                );
              })}
            </div>

            {[["What This Actually Means", RESULTS[result].diagnosis], ["What It's Costing You", RESULTS[result].costs], ["Your One Fix", RESULTS[result].fix]].map(([label, text]) => (
              <div key={label} style={{ marginBottom: 32, paddingBottom: 32, borderBottom: "1px solid rgba(237,233,227,0.08)" }}>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: 3, textTransform: "uppercase", color: "#6B7280", display: "block", marginBottom: 14 }}>{label}</span>
                <p style={{ fontSize: 14.5, lineHeight: 1.85, color: "#A09C96" }}>{text}</p>
              </div>
            ))}

            <div style={{ background: "#EDE9E3", padding: 32, marginBottom: 32 }}>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: 3, textTransform: "uppercase", color: "#6B7280", display: "block", marginBottom: 14 }}>Your Next Step</span>
              <p style={{ fontSize: 14, lineHeight: 1.8, color: "#1A1714" }}>{RESULTS[result].next}</p>
            </div>
            <button className="btn-outline" onClick={onBack}>← Back to all tools</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TOOL 2
// ─────────────────────────────────────────────────────────────────────────────
function Tool2({ onBack }) {
  const [active, setActive]         = useState(0);
  const [showPrompt, setShowPrompt] = useState(null);
  const sec = BLUEPRINT_SECTIONS[active];

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "56px 40px 80px" }} className="fade-up">
      <span style={C.label}>Guide · Beginners &amp; Career Shifters</span>
      <h2 style={{ ...C.heading, fontSize: "clamp(44px, 8vw, 76px)" }}>
        THE FIRST<br />
        <span style={{ WebkitTextStroke: "1.5px #EDE9E3", color: "transparent" }}>CLIENT</span><br />
        BLUEPRINT
      </h2>
      <div style={C.rule} />
      <p style={{ ...C.body }}>Three specific shifts that turn an invisible applicant into the VA that clients actually reply to. Each comes with an AI prompt you can use today — even with zero experience and zero clients right now.</p>

      <div style={{ display: "flex", gap: 2, marginBottom: 48, flexWrap: "wrap" }}>
        {BLUEPRINT_SECTIONS.map((s, i) => (
          <button key={i} onClick={() => { setActive(i); setShowPrompt(null); }} style={{
            fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: 2, textTransform: "uppercase",
            padding: "10px 18px",
            border: `1px solid ${active === i ? "#EDE9E3" : "rgba(237,233,227,0.15)"}`,
            cursor: "pointer",
            background: active === i ? "#EDE9E3" : "transparent",
            color: active === i ? "#0F0D0B" : "#A09C96",
            transition: "all 0.15s",
          }}>{s.number}</button>
        ))}
      </div>

      <div key={active} className="fade-up">
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: 3, textTransform: "uppercase", color: "#6B7280", display: "block", marginBottom: 8 }}>{sec.number}</span>
        <h3 style={{ fontFamily: "'Libre Baskerville', serif", fontSize: "clamp(20px, 3.5vw, 28px)", fontWeight: 700, color: "#EDE9E3", marginBottom: 8 }}>{sec.title}</h3>
        <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", color: "#6B7280", marginBottom: 24 }}>{sec.subtitle}</p>
        <p style={{ fontSize: 14.5, lineHeight: 1.85, color: "#A09C96", marginBottom: 32, paddingBottom: 32, borderBottom: "1px solid rgba(237,233,227,0.08)" }}>{sec.body}</p>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: 3, textTransform: "uppercase", color: "#6B7280", display: "block", marginBottom: 10 }}>The Action</span>
        <h4 style={{ fontFamily: "'Libre Baskerville', serif", fontSize: 17, fontWeight: 700, color: "#EDE9E3", marginBottom: 14 }}>{sec.action}</h4>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: "#A09C96", marginBottom: 24 }}>{sec.action_desc}</p>
        <button className="btn-outline" style={{ marginBottom: 4 }} onClick={() => setShowPrompt(showPrompt === active ? null : active)}>
          {showPrompt === active ? "Hide AI prompt ↑" : "View AI prompt →"}
        </button>
        {showPrompt === active && (
          <div style={{ background: "rgba(237,233,227,0.04)", border: "1px solid rgba(237,233,227,0.12)", padding: 24, marginTop: 20, marginBottom: 8 }} className="fade-up">
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, letterSpacing: 2, textTransform: "uppercase", color: "#6B7280", display: "block", marginBottom: 12 }}>Copy this prompt into ChatGPT or Claude</span>
            <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, lineHeight: 1.9, color: "#A09C96", whiteSpace: "pre-wrap" }}>{sec.ai_prompt}</p>
          </div>
        )}
        <div style={{ background: "#EDE9E3", padding: "16px 20px", marginTop: 24 }}>
          <span style={{ fontSize: 16, color: "#1A1714" }}>— </span>
          <span style={{ fontFamily: "'Libre Baskerville', serif", fontSize: 13, fontStyle: "italic", lineHeight: 1.7, color: "#4A4A4A" }}>{sec.highlight}</span>
        </div>
        <div style={{ display: "flex", gap: 12, marginTop: 44, flexWrap: "wrap" }}>
          {active > 0 && <button className="btn-outline" onClick={() => { setActive(active - 1); setShowPrompt(null); }}>← Previous shift</button>}
          {active < BLUEPRINT_SECTIONS.length - 1
            ? <button className="btn-primary" onClick={() => { setActive(active + 1); setShowPrompt(null); }}>Next shift →</button>
            : <button className="btn-outline" onClick={onBack}>← Back to all tools</button>
          }
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TOOL 3
// ─────────────────────────────────────────────────────────────────────────────
function Tool3({ onBack }) {
  const [checked, setChecked] = useState({});
  const [active, setActive]   = useState(0);

  const toggle = (id) => setChecked(prev => ({ ...prev, [id]: !prev[id] }));
  const getPct = (comp) => Math.round((comp.steps.filter(s => checked[s.id]).length / comp.steps.length) * 100);
  const totalSteps = LAUNCH_COMPONENTS.reduce((a, c) => a + c.steps.length, 0);
  const totalDone  = LAUNCH_COMPONENTS.reduce((a, c) => a + c.steps.filter(s => checked[s.id]).length, 0);
  const overallPct = Math.round((totalDone / totalSteps) * 100);
  const comp = LAUNCH_COMPONENTS[active];

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "56px 40px 80px" }} className="fade-up">
      <span style={C.label}>Interactive Builder · Beginners &amp; Career Shifters</span>
      <h2 style={{ ...C.heading, fontSize: "clamp(40px, 7vw, 68px)" }}>
        VA LAUNCH<br />
        <span style={{ WebkitTextStroke: "1.5px #EDE9E3", color: "transparent" }}>KIT BUILDER</span>
      </h2>
      <div style={C.rule} />
      <p style={C.body}>Build everything you need to land your first client — in one sitting. Check off each step as you complete it. Your launch kit builds as you go.</p>

      <div style={{ background: "rgba(237,233,227,0.04)", border: "1px solid rgba(237,233,227,0.08)", padding: "20px 24px", marginBottom: 44, display: "flex", alignItems: "center", gap: 20 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", color: "#6B7280" }}>Overall Progress</span>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: 2, color: "#EDE9E3" }}>{totalDone}/{totalSteps} steps</span>
          </div>
          <div style={{ height: 2, background: "rgba(237,233,227,0.08)" }}>
            <div style={{ height: "100%", background: "#EDE9E3", width: `${overallPct}%`, transition: "width 0.4s ease" }} />
          </div>
        </div>
        <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 40, color: "#EDE9E3", lineHeight: 1 }}>{overallPct}%</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2, marginBottom: 44 }}>
        {LAUNCH_COMPONENTS.map((c, i) => {
          const pct = getPct(c);
          const isActive = active === i;
          return (
            <button key={i} onClick={() => setActive(i)} style={{
              padding: "16px 12px",
              border: `1px solid ${isActive ? "#EDE9E3" : "rgba(237,233,227,0.12)"}`,
              background: isActive ? "#EDE9E3" : "rgba(237,233,227,0.02)",
              cursor: "pointer", textAlign: "left", transition: "all 0.15s",
            }}>
              <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: isActive ? "#0F0D0B" : "#EDE9E3", display: "block", lineHeight: 1, marginBottom: 6 }}>{c.number}</span>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, letterSpacing: 1.5, textTransform: "uppercase", color: "#6B7280", display: "block", marginBottom: 8 }}>{pct}% done</span>
              <div style={{ height: 2, background: "rgba(237,233,227,0.08)" }}>
                <div style={{ height: "100%", background: isActive ? "#0F0D0B" : "#EDE9E3", width: `${pct}%`, transition: "width 0.3s" }} />
              </div>
            </button>
          );
        })}
      </div>

      <div key={active} className="fade-up">
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: 3, textTransform: "uppercase", color: "#6B7280", display: "block", marginBottom: 8 }}>Component {comp.number}</span>
        <h3 style={{ fontFamily: "'Libre Baskerville', serif", fontSize: "clamp(18px, 3vw, 24px)", fontWeight: 700, color: "#EDE9E3", marginBottom: 16 }}>{comp.title}</h3>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: "#A09C96", marginBottom: 36, paddingBottom: 36, borderBottom: "1px solid rgba(237,233,227,0.08)" }}>{comp.desc}</p>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: 3, textTransform: "uppercase", color: "#6B7280", display: "block", marginBottom: 20 }}>Build Steps</span>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 40 }}>
          {comp.steps.map((step, i) => {
            const done = !!checked[step.id];
            return (
              <button key={step.id} onClick={() => toggle(step.id)} style={{
                display: "flex", alignItems: "flex-start", gap: 16, padding: "18px 20px",
                border: `1px solid ${done ? "#EDE9E3" : "rgba(237,233,227,0.1)"}`,
                background: done ? "#EDE9E3" : "rgba(237,233,227,0.02)",
                cursor: "pointer", textAlign: "left", width: "100%", transition: "all 0.2s",
              }}>
                <div style={{
                  flexShrink: 0, width: 22, height: 22,
                  border: `1.5px solid ${done ? "#0F0D0B" : "rgba(237,233,227,0.2)"}`,
                  background: done ? "#0F0D0B" : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "'DM Mono', monospace", fontSize: 10,
                  color: done ? "#EDE9E3" : "rgba(237,233,227,0.3)", marginTop: 2,
                }}>{done ? "✓" : i + 1}</div>
                <span style={{ fontFamily: "'Libre Baskerville', serif", fontSize: 13.5, lineHeight: 1.75, color: done ? "#4A4A4A" : "#A09C96", textDecoration: done ? "line-through" : "none" }}>{step.text}</span>
              </button>
            );
          })}
        </div>
        {getPct(comp) === 100 && (
          <div style={{ background: "#EDE9E3", padding: "24px 28px", marginBottom: 32 }} className="fade-up">
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: 3, textTransform: "uppercase", color: "#6B7280", display: "block", marginBottom: 12 }}>Component Complete ✓</span>
            <p style={{ fontSize: 13.5, lineHeight: 1.8, color: "#1A1714" }}>{comp.output}</p>
          </div>
        )}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {active > 0 && <button className="btn-outline" onClick={() => setActive(active - 1)}>← Previous</button>}
          {active < LAUNCH_COMPONENTS.length - 1
            ? <button className="btn-primary" onClick={() => setActive(active + 1)}>Next component →</button>
            : overallPct === 100
              ? (
                <div style={{ background: "#EDE9E3", padding: "20px 28px", width: "100%" }} className="fade-up">
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: 3, textTransform: "uppercase", color: "#6B7280", display: "block", marginBottom: 10 }}>Launch Kit Complete</span>
                  <p style={{ fontSize: 14, lineHeight: 1.8, color: "#1A1714", marginBottom: 16 }}>Your VA Launch Kit is built. You have a pitch, a portfolio, a profile, and a daily outreach system. You are ready. Send your first five applications today. Systems Over Hustle™.</p>
                  <p style={{ fontSize: 13, lineHeight: 1.8, color: "#6B7280", marginBottom: 20 }}>Once you land your first client — come back for the Lean Trifecta. That's where you learn how to keep them.</p>
                  <button className="btn-outline" onClick={onBack} style={{ borderColor: "rgba(26,23,20,0.3)", color: "#1A1714" }}>← Back to all tools</button>
                </div>
              )
              : <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: 1.5, color: "#6B7280", paddingTop: 16 }}>Complete all steps to finish your launch kit.</p>
          }
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ROOT APP
// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState("hub");

  return (
    <div className="app">
      <style>{GLOBAL_CSS}</style>
      <header className="hdr">
        <div className="hdr-left">
          {view !== "hub" && (
            <button className="back-btn" onClick={() => setView("hub")}>← All tools</button>
          )}
          <a href="https://marginmomentum.co" className="brand" style={{ textDecoration: "none" }}>
            Margin &amp; Momentum™
          </a>
        </div>
        <div className="tag">Systems Over Hustle™</div>
      </header>

      <main className="mm-main">
        {view === "hub" && <Hub onSelect={id => setView(id)} />}
        {view === "m1"  && <Tool1 onBack={() => setView("hub")} />}
        {view === "m2"  && <Tool2 onBack={() => setView("hub")} />}
        {view === "m3"  && <Tool3 onBack={() => setView("hub")} />}
      </main>

      <footer className="ftr">
        <span className="ftr-l">Margin &amp; Momentum™</span>
        <span className="ftr-r">Systems Over Hustle™</span>
      </footer>
    </div>
  );
}
