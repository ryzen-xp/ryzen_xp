"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import BlurFade from "@/components/magicui/blur-fade";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight, Send } from "lucide-react";

// ── Network layout ──────────────────────────────────────────────────────────
const VW = 700;
const VH = 380;

const LAYERS = [
  {
    id: "input", x: 70,
    nodes: [
      { id: "i0", y: 90  },
      { id: "i1", y: 165 },
      { id: "i2", y: 240 },
      { id: "i3", y: 310 },
    ],
  },
  {
    id: "agents", x: 230,
    nodes: [
      { id: "builder",    y: 105, label: "Builder",  agentId: "builder"    },
      { id: "researcher", y: 200, label: "Research", agentId: "researcher" },
      { id: "career",     y: 295, label: "Career",   agentId: "career"     },
    ],
  },
  {
    id: "hidden", x: 420,
    nodes: [
      { id: "h0", y: 70  },
      { id: "h1", y: 148 },
      { id: "h2", y: 220 },
      { id: "h3", y: 292 },
      { id: "h4", y: 345 },
    ],
  },
  {
    id: "output", x: 600,
    nodes: [
      { id: "o0", y: 160, label: "Output" },
      { id: "o1", y: 240 },
    ],
  },
];

function bez(x1: number, y1: number, x2: number, y2: number) {
  const cx = (x1 + x2) / 2;
  return `M${x1},${y1} C${cx},${y1} ${cx},${y2} ${x2},${y2}`;
}

const EDGES: { id: string; path: string }[] = [];
for (let li = 0; li < LAYERS.length - 1; li++) {
  LAYERS[li].nodes.forEach(a =>
    LAYERS[li + 1].nodes.forEach(b =>
      EDGES.push({ id: `${a.id}-${b.id}`, path: bez(LAYERS[li].x, a.y, LAYERS[li + 1].x, b.y) })
    )
  );
}

const SIGNALS = EDGES.map((e, i) => ({
  edgeId: e.id,
  path: e.path,
  dur: 2.6 + (i % 8) * 0.3,
  begin: (i * 0.38) % 3.8,
}));

// ── Q&A Data ────────────────────────────────────────────────────────────────
const AGENTS: Record<string, { label: string; qa: { q: string; a: string }[] }> = {
  builder: {
    label: "Builder",
    qa: [
      { q: "What projects have you built?", a: "4 projects — Trustless-OSS (GitHub bounty platform that auto-releases USDC via Trustless Work escrow), Alien Protocol (RWA-backed lending on Stellar/Soroban), NFXP (ERC-721 NFT marketplace with IPFS), Charity Chain (transparent NGO crowdfunding in Solidity). Most are live or in active development." },
      { q: "What's your tech stack?", a: "Cairo, Rust, and Solidity for smart contracts / TypeScript, Node.js, Axum, and Express for backends / Next.js and React on the frontend / PostgreSQL, Redis, Docker, Foundry, and Stellar SDK. Comfortable across contracts and production backends." },
      { q: "Any live demos?", a: "www.trustless-oss.xyz → Trustless-OSS / www.alien-protocol.xyz → Alien Protocol. NFXP and Charity Chain are on GitHub." },
      { q: "What are you building now?", a: "Alien Protocol (RWA-backed lending on Stellar with Chainlink oracles) and ongoing work on Trustless-OSS (USDC bounty escrow on pull-request merge). Open-source contract work across Starknet and Stellar in parallel." },
    ],
  },
  researcher: {
    label: "Research",
    qa: [
      { q: "What research have you published?", a: "13 logs live at /research — ZFS forensics, AES-CBC padding oracle, ECDSA nonce bias, Verilog FIFO debugging, orbital mechanics simulation, network C2 forensics, acoustic localisation, VM bytecode exploitation and more. All hands-on benchmark tasks." },
      { q: "What topics do you cover?", a: "AI agent evaluation, systems security (crypto attacks, reverse engineering), compiler theory, network forensics, hardware debugging in Verilog, orbital mechanics, and autonomous software systems." },
      { q: "What's T-Bench / Harbor?", a: "A terminal-bench framework for evaluating AI agents on real software engineering tasks — debugging, security audits, data pipelines, systems analysis. Completed 13 tasks, each documented with full findings." },
      { q: "What's the Agent Systems Handbook?", a: "A book on modern AI agent architectures — memory, planning, evaluation, tool use, multi-agent coordination. Research-driven, not theoretical. Deep in progress." },
    ],
  },
  career: {
    label: "Career",
    qa: [
      { q: "Where have you worked?", a: "Open source blockchain contributor (Aug 2024–present) / Starknet Fellowship at OnlyDust (Aug–Sept 2025) / Blockchain Developer Intern at Altibbe Health, Hyderabad (May–June 2025). 20+ months contributing across Starknet, Stellar, and EVM." },
      { q: "What's your strongest skill?", a: "Smart contracts + backend integrations — Cairo, Rust, Solidity, gas optimization, and production APIs. Comfortable shipping DeFi, NFT, RWA, and cross-chain systems." },
      { q: "Are you open to opportunities?", a: "Always open to the right thing. Remote preferred, interesting problems only. Reach me at ryzen4540@gmail.com or linkedin.com/in/ryzen-xp." },
      { q: "What's your biggest win?", a: "Most Innovative Idea Award at Boundless x Trustless Work Hackathon for Trustless OSS, plus a 30% gas reduction on production Solidity contracts at Altibbe." },
    ],
  },
};

// ── Intent engine ────────────────────────────────────────────────────────────
const P = {
  name: "Sandeep Chauhan",
  role: "blockchain developer specializing in backend and smart contract development across Starknet, Stellar, and EVM",
  email: "ryzen4540@gmail.com",
  linkedin: "linkedin.com/in/ryzen-xp",
  github: "github.com/ryzen-xp",
  projects: ["Trustless-OSS", "Alien Protocol", "NFXP NFT Marketplace", "Charity Chain"],
  activeBuilds: ["Alien Protocol", "Trustless-OSS"],
  liveUrls: ["www.trustless-oss.xyz → Trustless-OSS", "www.alien-protocol.xyz → Alien Protocol"],
  currentRoles: ["Open Source Blockchain Contributor (Aug 2024–present)", "Starknet Fellowship at OnlyDust (Aug–Sept 2025)"],
  openSource: ["Starknet", "Stellar", "EVM"],
  stack: ["TypeScript", "Solidity", "Rust", "Cairo", "Node.js", "Next.js", "PostgreSQL", "Docker"],
  researchCount: 13,
  researchUrl: "/research",
  bookTitle: "The Agent Systems Handbook",
  researchTopics: ["AI agent evaluation", "systems security", "cryptography", "network forensics", "hardware debugging", "orbital mechanics", "compiler theory", "reverse engineering"],
  wins: [
    "Most Innovative Idea Award at Boundless x Trustless Work Hackathon for Trustless OSS",
    "30% gas cost reduction on production Solidity contracts at Altibbe",
    "20+ months of open-source contributions across Starknet, Stellar, and EVM",
  ],
  school: "Chhatrapati Shahu Ji Maharaj University (CSJMU) — BTech CSE (2021–2025)",
};

function rnd<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }
function rndN<T>(arr: T[], n: number): T[] { return [...arr].sort(() => Math.random() - 0.5).slice(0, n); }

interface Intent {
  id: string;
  agentId: "builder" | "researcher" | "career";
  tokens: string[];
  phrases: string[];
  weight: number;
  templates: (() => string)[];
}

const INTENTS: Intent[] = [
  {
    id: "greeting", agentId: "builder",
    tokens: ["hi", "hey", "hello", "sup", "yo", "hii", "name", "who"],
    phrases: ["who are you", "who r u", "who ru", "introduce", "about you", "about sandeep", "tell me about yourself", "tell me about you", "your name", "ur name", "what's your", "whats your"],
    weight: 1,
    templates: [
      () => `I'm ${P.name} — a ${P.role}. Currently ${P.currentRoles[0]} and building ${rndN(P.projects, 2).join(" + ")} in parallel. Ask me anything.`,
      () => `${P.name} here. Blockchain developer specialising in smart contracts and backend systems. ${P.projects.length} projects, ${P.researchCount} research logs, open-source work across ${P.openSource.join(", ")}.`,
      () => `Blockchain developer shipping contracts and production backends. Right now I'm ${P.currentRoles[0]}. Building on ${P.openSource.join(" and ")}, shipped ${P.projects.length} projects.`,
    ],
  },
  {
    id: "projects", agentId: "builder",
    tokens: ["project", "built", "build", "make", "create", "ship", "shipped", "portfolio"],
    phrases: ["what have you built", "show me your work", "your projects", "what did you make"],
    weight: 1,
    templates: [
      () => `${P.projects.length} projects — ${rndN(P.projects, 3).join(", ")}, and more. Highlights: Trustless-OSS (GitHub bounty platform with USDC escrow), Alien Protocol (RWA lending on Stellar), NFXP (ERC-721 marketplace). Most are live or in active development.`,
      () => `Recent builds: Trustless-OSS → automated USDC bounty release on PR merge / Alien Protocol → RWA-backed lending on Soroban / NFXP → ERC-721 mint and marketplace / Charity Chain → NGO crowdfunding in Solidity. Stack varies per project.`,
      () => `I've shipped ${P.projects.length} projects across contracts and backends. Strongest: Trustless-OSS (Soroban + Axum + Next.js), Alien Protocol (RWA lending), NFXP (Solidity + Foundry). Active on ${rndN(P.activeBuilds, 2).join(" + ")} right now.`,
    ],
  },
  {
    id: "stack", agentId: "builder",
    tokens: ["stack", "tech", "technolog", "language", "framework", "tool", "use"],
    phrases: ["what do you use", "what language", "your tools", "your tech stack"],
    weight: 1,
    templates: [
      () => `Primary: ${P.stack.slice(0, 4).join(", ")}. Also: ${P.stack.slice(4).join(", ")}. Comfortable across smart contracts, backends, and frontend dapps.`,
      () => `Contracts: Cairo, Rust, Solidity. Backend: TypeScript, Node.js, Axum, Express. Frontend: Next.js + React. Data: PostgreSQL, Redis, IPFS. Tooling: Foundry, Snforge, Docker, Stellar SDK.`,
      () => `Depends on the chain. EVM → Solidity + Foundry. Starknet → Cairo + Snforge. Stellar → Rust + Soroban. Backends → TypeScript or Axum. I pick what ships without accumulating debt.`,
    ],
  },
  {
    id: "demos", agentId: "builder",
    tokens: ["demo", "live", "deploy", "url", "link", "visit", "see", "view", "website"],
    phrases: ["can i see", "where can i see", "show me a demo", "live demo"],
    weight: 1,
    templates: [
      () => `Live: ${P.liveUrls.join(" / ")}. ${rnd(P.activeBuilds)} is still moving fast.`,
      () => `Live now: ${P.liveUrls.join(" — ")}. NFXP and Charity Chain are on GitHub if you want the source.`,
    ],
  },
  {
    id: "current", agentId: "builder",
    tokens: ["now", "current", "working", "rn", "today", "lately", "recent", "latest"],
    phrases: ["what are you working on", "what are you building", "what's new", "what's next"],
    weight: 1,
    templates: [
      () => `Right now: ${P.activeBuilds.join(", ")}. Running those on top of ongoing Starknet and Stellar open-source work.`,
      () => `Active: ${rndN(P.activeBuilds, 2).join(" + ")}. Also contributing contracts and protocol tooling across ${P.openSource.join(", ")}. Busy.`,
    ],
  },
  {
    id: "research", agentId: "researcher",
    tokens: ["research", "publish", "log", "paper", "write", "wrote"],
    phrases: ["what research", "research logs", "published work", "your papers", "what have you published"],
    weight: 1,
    templates: [
      () => `${P.researchCount} research logs live at ${P.researchUrl} — ZFS forensics, AES-CBC padding oracle, ECDSA nonce bias, Verilog FIFO debugging, orbital mechanics simulation, network C2 forensics, acoustic localisation, VM bytecode exploitation, and more. All hands-on benchmark tasks.`,
      () => `Published ${P.researchCount} research logs covering ${rndN(P.researchTopics, 4).join(", ")}. Find them at ${P.researchUrl}. Deep technical write-ups from real benchmark environments.`,
      () => `${P.researchCount} hands-on logs across ${P.researchTopics.length} domains. From cracking ECDSA keys to recovering ZFS pools to debugging async FIFOs in Verilog. All at ${P.researchUrl}.`,
    ],
  },
  {
    id: "topics", agentId: "researcher",
    tokens: ["topic", "subject", "cover", "area", "field", "domain", "about"],
    phrases: ["what do you research", "research areas", "what topics do you cover"],
    weight: 1,
    templates: [
      () => `AI agent evaluation, systems security (crypto attacks, reverse engineering), compiler theory, network forensics, hardware debugging in Verilog, orbital mechanics, autonomous software systems. ${P.researchCount} hands-on logs.`,
      () => `Research spans: ${rndN(P.researchTopics, 5).join(" / ")} / and more. All practical — real benchmark tasks, not theory.`,
    ],
  },
  {
    id: "tbench", agentId: "researcher",
    tokens: ["tbench", "harbor", "benchmark", "terminal", "evaluation", "eval"],
    phrases: ["t-bench", "what is harbor", "terminal bench", "agent evaluation"],
    weight: 2,
    templates: [
      () => `T-Bench / Harbor is a framework for evaluating AI agents on real engineering tasks — debugging, security audits, data pipelines, systems analysis. I've completed ${P.researchCount} tasks, each documented with full findings at ${P.researchUrl}.`,
      () => `Terminal benchmark framework — AI agents get real engineering problems (debug a Verilog FIFO, recover a ZFS pool, crack ECDSA keys) and get evaluated on correctness. I've done ${P.researchCount} tasks and documented every one.`,
    ],
  },
  {
    id: "book", agentId: "researcher",
    tokens: ["book", "handbook", "writing", "author", "guide", "publish"],
    phrases: ["agent systems handbook", "what are you writing", "your book", "the handbook"],
    weight: 2,
    templates: [
      () => `${P.bookTitle} — a research-driven guide covering modern AI agent architectures: memory, planning, evaluation, tool use, multi-agent coordination. Deep in progress. Grounded in real evaluation work, not tutorial-level fluff.`,
      () => `I'm authoring ${P.bookTitle}. Covers how production AI agents actually work — memory systems, planning loops, tool use, evaluation frameworks, autonomous software systems. Research-backed.`,
    ],
  },
  {
    id: "work", agentId: "career",
    tokens: ["work", "job", "intern", "company", "experience", "employ", "role", "position", "career"],
    phrases: ["where have you worked", "work history", "your experience", "work experience"],
    weight: 1,
    templates: [
      () => `Timeline: Open source blockchain contributor (Aug 2024–present) / Starknet Fellowship at OnlyDust (Aug–Sept 2025) / Blockchain Developer Intern at Altibbe Health, Hyderabad (May–June 2025).`,
      () => `Roles: ${P.currentRoles[0]}, plus ${rnd(["Starknet Fellowship at OnlyDust", "Blockchain intern at Altibbe Health", "open source work on " + P.openSource.join(" and ")])}. Mix of fellowship, internship, and open source.`,
    ],
  },
  {
    id: "skills", agentId: "career",
    tokens: ["skill", "strong", "best", "expert", "speciali", "capabilit", "good"],
    phrases: ["what are you good at", "your strengths", "strongest skill", "best at"],
    weight: 1,
    templates: [
      () => `Smart contracts + backend integrations. Cairo, Rust, Solidity, gas optimization, and production APIs. Can ship DeFi, NFT, RWA, and cross-chain systems.`,
      () => `Strongest in: contract design, gas optimization, protocol backends, open-source contribution workflows. Comfortable across ${rndN(P.stack, 4).join(", ")}. Ship fast, maintain quality.`,
      () => `Contracts first, but backend capable. Best at writing contracts that stay cheap and APIs that don't break. ${rnd(P.stack)} is probably my favourite right now.`,
    ],
  },
  {
    id: "availability", agentId: "career",
    tokens: ["open", "hire", "available", "opportunit", "remote", "freelance", "contract", "looking"],
    phrases: ["are you available", "open to work", "can i hire you", "are you looking"],
    weight: 1,
    templates: [
      () => `Always open to the right thing. Remote preferred. Interesting problems only — smart contracts, DeFi, RWA, developer tooling. Reach me at ${P.email} or ${P.linkedin}.`,
      () => `Open to remote contract or full-time roles in blockchain, backend, or protocol work. Not chasing just any job — reach out: ${P.email}.`,
    ],
  },
  {
    id: "achievements", agentId: "career",
    tokens: ["achiev", "win", "proud", "award", "accomplishment", "bounty", "milestone", "notable"],
    phrases: ["biggest win", "what are you proud of", "notable achievement", "best accomplishment"],
    weight: 1,
    templates: [
      () => `Biggest wins: ${P.wins.join(" / ")}.`,
      () => `${rnd(P.wins)} hit hardest. Also: ${rnd(P.wins)} and ${P.researchCount} research logs published on T-Bench.`,
    ],
  },
  {
    id: "education", agentId: "career",
    tokens: ["school", "study", "college", "universit", "degree", "education", "student", "learn"],
    phrases: ["where did you study", "your education", "your degree", "where did you go to school"],
    weight: 1,
    templates: [
      () => `${P.school}. Most of what I know came from building real things, not coursework. The portfolio is the proof.`,
      () => `BTech in Computer Science from CSJMU, Kanpur (2021–2025). Learning by shipping — side projects and open source have taught me more than any lecture.`,
    ],
  },
  {
    id: "contact", agentId: "career",
    tokens: ["contact", "reach", "email", "message", "connect", "dm", "chat", "talk"],
    phrases: ["how do i reach you", "can i contact you", "get in touch", "how to contact"],
    weight: 1,
    templates: [
      () => `Best way: ${P.email}. Also on LinkedIn at ${P.linkedin} and GitHub at ${P.github}.`,
      () => `Email me at ${P.email} or connect on LinkedIn (${P.linkedin}). GitHub is ${P.github} if you want to see the code directly.`,
    ],
  },
  {
    id: "location", agentId: "career",
    tokens: ["locat", "where", "based", "countr", "cit", "timezone", "india"],
    phrases: ["where are you based", "where do you live", "where are you from"],
    weight: 1,
    templates: [
      () => `Based in Kanpur, India. Work fully remote. Available across most timezones for async collaboration.`,
      () => `Kanpur, India — fully remote. Time zone flexible for async work. Most of my roles and contributions have been distributed teams.`,
    ],
  },
];

function tokenize(s: string): string[] {
  return s.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(Boolean);
}

function scoreIntent(lower: string, toks: string[], intent: Intent): number {
  let s = 0;
  for (const phrase of intent.phrases) {
    if (lower.includes(phrase)) s += 6 * intent.weight;
  }
  for (const iToken of intent.tokens) {
    if (toks.some(t => t.includes(iToken) || (iToken.includes(t) && t.length >= 3))) {
      s += 2 * intent.weight;
    }
  }
  return s;
}

function matchQuestion(input: string): { agentId: string; item: { q: string; a: string } } {
  const lower = input.toLowerCase().trim();
  const toks = tokenize(lower);
  let best: Intent | null = null;
  let bestScore = 0;
  for (const intent of INTENTS) {
    const s = scoreIntent(lower, toks, intent);
    if (s > bestScore) { bestScore = s; best = intent; }
  }
  if (best && bestScore >= 2) {
    return { agentId: best.agentId, item: { q: input, a: rnd(best.templates)() } };
  }
  const fallbacks = [
    `That's outside what I've covered here. Try asking about my ${rnd(["projects", "research", "tech stack", "work history", "current builds"])} — or reach me directly at ${P.email}.`,
    `Good question — not in my dataset here. Hit me at ${P.email} and I'll answer properly. Or ask about my projects, research, or career.`,
    `Haven't covered that specifically. Ask me about ${rnd(["my tech stack", "research logs", "open source work", "current projects", "career timeline"])} — or contact me at ${P.email}.`,
  ];
  return { agentId: "career", item: { q: input, a: rnd(fallbacks) } };
}

// ── Typewriter ──────────────────────────────────────────────────────────────
function useTypewriter(text: string, active: boolean, speed = 14) {
  const [out, setOut] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    setOut(""); setDone(false);
    if (!text || !active) return;
    let i = 0;
    const id = setInterval(() => {
      i++; setOut(text.slice(0, i));
      if (i >= text.length) { clearInterval(id); setDone(true); }
    }, speed);
    return () => clearInterval(id);
  }, [text, active]);
  return { out, done };
}

// ── Network SVG ─────────────────────────────────────────────────────────────
type Phase = "idle" | "activating" | "processing" | "retreating" | "answer";

function NetworkSVG({ activeAgentId, phase }: { activeAgentId: string | null; phase: Phase }) {
  const surging = phase === "activating" || phase === "processing";
  const nodeMap = useMemo(() => {
    const m: Record<string, { x: number; y: number; label?: string; agentId?: string }> = {};
    LAYERS.forEach(l => l.nodes.forEach(n => m[n.id] = { x: l.x, y: n.y, ...(n as any) }));
    return m;
  }, []);

  return (
    <svg viewBox={`0 0 ${VW} ${VH}`} className="w-full text-foreground" style={{ height: "clamp(220px, 44vw, 380px)" }}>
      <defs>
        <filter id="ng" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="8" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="sg" x="-300%" y="-300%" width="700%" height="700%">
          <feGaussianBlur stdDeviation="1.5" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        {/* dot grid */}
        <pattern id="dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
          <circle cx="12" cy="12" r="0.7" fill="currentColor" fillOpacity={surging ? 0.12 : 0.055} />
        </pattern>
        {SIGNALS.map(s => (
          <path key={`def-${s.edgeId}`} id={`ep-${s.edgeId}`} d={s.path} fill="none" />
        ))}
      </defs>

      {/* dot grid background */}
      <rect width={VW} height={VH} fill="url(#dots)" style={{ transition: "opacity 0.4s" }} />

      {/* Layer labels */}
      {[{ x: 70, t: "INPUT" }, { x: 230, t: "AGENTS" }, { x: 420, t: "HIDDEN" }, { x: 600, t: "OUTPUT" }].map(l => (
        <text key={l.t} x={l.x} y={24} textAnchor="middle" fontSize="7.5" fill="currentColor"
          fillOpacity={surging ? 0.4 : 0.18} fontFamily="system-ui" fontWeight="700" letterSpacing="2.5"
          style={{ transition: "fill-opacity 0.4s" }}>
          {l.t}
        </text>
      ))}

      {/* Edges */}
      {EDGES.map(e => (
        <path key={e.id} d={e.path} fill="none" stroke="currentColor"
          strokeWidth={surging ? "0.7" : "0.4"}
          strokeOpacity={surging ? 0.22 : 0.08}
          style={{ transition: "stroke-opacity 0.5s, stroke-width 0.5s" }}
        />
      ))}

      {/* Signals */}
      {SIGNALS.map(s => (
        <circle key={s.edgeId}
          r={surging ? "1.6" : "0.85"}
          fill="currentColor"
          opacity={surging ? 0.8 : 0.22}
          filter="url(#sg)"
          style={{ transition: "opacity 0.4s" }}
        >
          <animateMotion
            dur={`${surging ? s.dur * 0.38 : s.dur}s`}
            repeatCount="indefinite"
            begin={`${s.begin}s`}
          >
            <mpath href={`#ep-${s.edgeId}`} />
          </animateMotion>
        </circle>
      ))}

      {/* Nodes */}
      {LAYERS.map(layer =>
        layer.nodes.map(n => {
          const nd = n as any;
          const isAgent = !!nd.agentId;
          const isActive = nd.agentId === activeAgentId;
          const r = isAgent ? 15 : 9;
          return (
            <g key={n.id}>
              {isActive && surging && (
                <>
                  <circle cx={layer.x} cy={n.y} r={r + 10} fill="currentColor" fillOpacity={0.04}
                    stroke="currentColor" strokeOpacity={0.15} strokeWidth="0.6">
                    <animate attributeName="r" values={`${r+8};${r+18};${r+8}`} dur="1s" repeatCount="indefinite" />
                    <animate attributeName="stroke-opacity" values="0.15;0.03;0.15" dur="1s" repeatCount="indefinite" />
                  </circle>
                  <circle cx={layer.x} cy={n.y} r={r + 4} fill="none" stroke="currentColor" strokeOpacity={0.3} strokeWidth="0.7">
                    <animate attributeName="r" values={`${r+3};${r+8};${r+3}`} dur="0.75s" repeatCount="indefinite" />
                  </circle>
                </>
              )}
              <rect
                x={layer.x - r} y={n.y - r} width={r * 2} height={r * 2}
                rx={isAgent ? 5 : 3}
                fill="currentColor"
                fillOpacity={
                  isActive && surging ? 0.95 :
                  isActive ? 0.75 :
                  isAgent ? (surging ? 0.6 : 0.42) :
                  surging ? 0.35 : 0.2
                }
                filter={isAgent ? "url(#ng)" : undefined}
                style={{ transition: "fill-opacity 0.4s" }}
              />
              {nd.label && (
                <text x={layer.x} y={n.y + r + 12} textAnchor="middle"
                  fontSize={isAgent ? "9.5" : "7"} fill="currentColor"
                  fillOpacity={isActive ? (surging ? 1 : 0.85) : 0.38}
                  fontFamily="system-ui" fontWeight={isActive ? "700" : "400"}
                  style={{ transition: "fill-opacity 0.4s" }}>
                  {nd.label}
                </text>
              )}
            </g>
          );
        })
      )}
    </svg>
  );
}

// ── Page ────────────────────────────────────────────────────────────────────
export default function AgentsPage() {
  const [activeAgentId, setActiveAgentId] = useState<string | null>(null);
  const [activeQ, setActiveQ] = useState<{ q: string; a: string } | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [customInput, setCustomInput] = useState("");
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const answerRef = useRef<HTMLDivElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const { out, done } = useTypewriter(activeQ?.a ?? "", phase === "answer");

  const handleCustomSubmit = () => {
    const q = customInput.trim();
    if (!q) return;
    const { agentId, item } = matchQuestion(q);
    setCustomInput("");
    handleQ(agentId, { ...item, q });
  };

  const handleQ = (agentId: string, item: { q: string; a: string }) => {
    if (phase !== "idle" && phase !== "answer") return;
    timers.current.forEach(clearTimeout);
    setActiveAgentId(agentId);
    setActiveQ(null);
    setPhase("activating");
    timers.current = [
      setTimeout(() => setPhase("processing"), 220),
      setTimeout(() => setPhase("retreating"), 900),
      setTimeout(() => {
        setPhase("answer");
        setActiveQ(item);
        setTimeout(() => answerRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 100);
      }, 1300),
    ];
  };

  // Network container transform — zooms forward then retreats
  const networkTransform = (() => {
    if (phase === "activating") return "perspective(900px) scale(1.08) translateZ(0px) rotateX(3deg)";
    if (phase === "processing") return "perspective(900px) scale(1.1) translateZ(0px) rotateX(3deg)";
    return "perspective(900px) scale(1) translateZ(0px) rotateX(0deg)";
  })();

  const networkTransition = (() => {
    if (phase === "activating") return "transform 0.45s cubic-bezier(0.34,1.56,0.64,1)";
    if (phase === "retreating" || phase === "answer") return "transform 0.55s cubic-bezier(0.25,0.46,0.45,0.94)";
    return "transform 0.3s ease";
  })();

  return (
    <div className="min-h-screen pb-32 bg-background">
      <div className="max-w-4xl mx-auto px-6 pt-16 sm:pt-24">

        <BlurFade delay={0.04}>
          <div className="text-center mb-10">
            <p className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground/50 mb-3 font-semibold">Neural Agent Network</p>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">Ask About Me</h1>
            <p className="text-xs text-muted-foreground/50 mt-3 tracking-wide">type anything or explore agent categories below</p>
          </div>
        </BlurFade>

        {/* Network — zooms forward on activation */}
        <BlurFade delay={0.08}>
          <div className="mb-10 overflow-hidden rounded-2xl border border-border/50 bg-muted/20"
            style={{ transformStyle: "preserve-3d" }}>
            <div style={{ transform: networkTransform, transition: networkTransition, transformOrigin: "50% 50%" }}>
              <NetworkSVG activeAgentId={activeAgentId} phase={phase} />
            </div>
          </div>
        </BlurFade>

        {/* Status bar */}
        <div className="flex items-center justify-center gap-2 mb-8 h-5">
          {phase === "activating" && (
            <span className="text-[10px] tracking-widest uppercase text-muted-foreground animate-pulse">
              ◉ initialising network...
            </span>
          )}
          {phase === "processing" && (
            <span className="text-[10px] tracking-widest uppercase text-foreground/70 animate-pulse">
              ◉ agents communicating...
            </span>
          )}
          {phase === "retreating" && (
            <span className="text-[10px] tracking-widest uppercase text-muted-foreground">
              ◎ compiling response...
            </span>
          )}
        </div>

        {/* Questions — collapsible categories */}
        <BlurFade delay={0.12}>
          <div className="flex flex-col gap-2 mb-10">
            {Object.entries(AGENTS).map(([id, agent]) => {
              const isOpen = openCategory === id;
              const busy = phase === "activating" || phase === "processing" || phase === "retreating";
              return (
                <div key={id} className="rounded-xl border border-border overflow-hidden">
                  <button
                    onClick={() => setOpenCategory(isOpen ? null : id)}
                    className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        id === "builder" ? "bg-blue-500" : id === "researcher" ? "bg-violet-500" : "bg-emerald-500"
                      )} />
                      <span className="text-[11px] font-semibold tracking-wide text-foreground/80">{agent.label} Agent</span>
                      <span className="text-[10px] text-muted-foreground/40">{agent.qa.length} questions</span>
                    </div>
                    <ChevronDown className={cn(
                      "size-3.5 text-muted-foreground/40 transition-transform duration-200",
                      isOpen && "rotate-180"
                    )} />
                  </button>
                  {isOpen && (
                    <div className="flex flex-col gap-1 px-3 pb-3">
                      {agent.qa.map(item => {
                        const isSelected = activeAgentId === id && activeQ?.q === item.q;
                        return (
                          <button
                            key={item.q}
                            onClick={() => handleQ(id, item)}
                            disabled={busy}
                            className={cn(
                              "text-left text-[11px] leading-snug px-3 py-2 rounded-lg border transition-all duration-200 flex items-center gap-2 group",
                              isSelected
                                ? "border-foreground/20 bg-foreground/6 text-foreground"
                                : "border-border/60 text-muted-foreground hover:text-foreground hover:border-foreground/15 hover:bg-muted/60 disabled:opacity-40 disabled:cursor-not-allowed"
                            )}
                          >
                            <ChevronRight className={cn(
                              "size-3 shrink-0 transition-transform",
                              isSelected ? "translate-x-0.5 text-foreground" : "text-muted-foreground/30 group-hover:translate-x-0.5"
                            )} />
                            {item.q}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </BlurFade>

        {/* Custom input */}
        <BlurFade delay={0.16}>
          <form
            onSubmit={(e) => { e.preventDefault(); handleCustomSubmit(); }}
            className="flex gap-2 mb-8"
          >
            <input
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="Or type your own question..."
              disabled={phase === "activating" || phase === "processing" || phase === "retreating"}
              className="flex-1 rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-foreground/10 disabled:opacity-40 transition-all"
            />
            <button
              type="submit"
              disabled={!customInput.trim() || phase === "activating" || phase === "processing" || phase === "retreating"}
              className="rounded-xl border border-border bg-foreground text-background px-4 py-2.5 flex items-center gap-1.5 text-sm font-medium hover:opacity-90 disabled:opacity-30 transition-all"
            >
              <Send className="size-3.5" />
              Ask
            </button>
          </form>
        </BlurFade>

        {/* Answer */}
        {phase === "answer" && activeQ && (
          <BlurFade delay={0} key={activeQ.q}>
            <div ref={answerRef} className="rounded-2xl border border-border bg-card px-7 py-6 shadow-sm">
              <p className="text-[9px] uppercase tracking-[0.22em] text-muted-foreground/50 mb-4 font-semibold">
                {AGENTS[activeAgentId!]?.label} · response
              </p>
              <p className="text-sm sm:text-[15px] leading-relaxed text-foreground/80 font-light">
                {out}
                {!done && <span className="inline-block w-[2px] h-[13px] bg-foreground/50 align-middle ml-0.5 animate-pulse" />}
              </p>
            </div>
          </BlurFade>
        )}
      </div>
    </div>
  );
}
