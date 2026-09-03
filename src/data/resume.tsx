import { Icons } from "@/components/icons";
import { HomeIcon, FlaskConical, Settings, FileText, Bot } from "lucide-react";
import { ReactLight } from "@/components/ui/svgs/reactLight";
import { NextjsIconDark } from "@/components/ui/svgs/nextjsIconDark";
import { Typescript } from "@/components/ui/svgs/typescript";
import { Javascript } from "@/components/ui/svgs/javascript";
import { Nodejs } from "@/components/ui/svgs/nodejs";
import { Postgresql } from "@/components/ui/svgs/postgresql";
import { Docker } from "@/components/ui/svgs/docker";

export const DATA = {
  name: "Sandeep Chauhan",
  initials: "SC",
  url: "https://sandeepchauhan.vercel.app",
  location: "Kanpur, India",
  locationLink: "https://www.google.com/maps/place/Kanpur",
  description:
    "Blockchain Developer specializing in backend and smart contract development across Starknet, Stellar, and EVM ecosystems using Cairo, Rust, and Solidity.",
  summary:
    "Blockchain Developer and Computer Science graduate from Chhatrapati Shahu Ji Maharaj University (CSJMU), Kanpur, specializing in backend and smart contract development across Starknet, Stellar, and EVM ecosystems using Cairo, Rust, and Solidity. Proven track record with 20+ months of open-source contributions, a 30% gas cost reduction in production smart contracts, and an award-winning hackathon build. Experienced in building DeFi protocols, NFT platforms, RWA tokenization, RWA lending, CCTP, upgradeable contracts, cross-chain systems, and production-grade backend systems.",
  avatarUrl: "/me.png",
  spotifyPlaylistUrl: "https://open.spotify.com/playlist/77SfoFRDHeoiRXeOxWYMBZ",
  skills: [
    { name: "React", icon: ReactLight },
    { name: "Next.js", icon: NextjsIconDark },
    { name: "Typescript", icon: Typescript },
    { name: "JavaScript", icon: Javascript },
    { name: "Node.js", icon: Nodejs },
    { name: "Solidity", logoUrl: "/skills/solidity.png" },
    { name: "Rust", logoUrl: "/skills/rust.png" },
    { name: "Cairo", logoUrl: "/skills/cairo.png" },
    { name: "C++", icon: Icons.terminal },
    { name: "PostgreSQL", icon: Postgresql },
    { name: "Docker", icon: Docker },
    { name: "Stellar", icon: Icons.terminal },
    { name: "Web3", icon: Icons.globe },
    { name: "Foundry", logoUrl: "/skills/foundry.png" },
  ],
  blockchains: [
    {
      name: "Stellar",
      logoUrl: "/chains/stellar.png",
      href: "https://stellar.org",
      focus: "Primary",
      description:
        "Where I spend most of my time — Soroban smart contracts, USDC escrow, RWA lending, and production backends with Rust, Axum, and TypeScript.",
    },
    {
      name: "Starknet",
      logoUrl: "/chains/starknet.png",
      href: "https://www.starknet.io",
      focus: "Primary",
      description:
        "Cairo contracts, ERC-20/721 implementations, Snforge testing, and gas-efficient storage design through open source and the OnlyDust fellowship.",
    },
    {
      name: "Ethereum",
      logoUrl: "/chains/ethereum.png",
      href: "https://ethereum.org",
      focus: "Active",
      description:
        "Solidity development with Foundry and Hardhat — NFT marketplaces, crowdfunding contracts, gas optimization, and upgradeable patterns.",
    },
    {
      name: "Base",
      logoUrl: "/chains/base.png",
      href: "https://base.org",
      focus: "Active",
      description:
        "EVM L2 work for lower-cost deployments and integrations alongside Ethereum tooling and Solidity contracts.",
    },
    {
      name: "Polygon",
      logoUrl: "/chains/polygon.png",
      href: "https://polygon.technology",
      focus: "Active",
      description:
        "EVM sidechain deployments for NFT and DeFi experiments with Solidity, Web3.js, and OpenZeppelin.",
    },
  ],
  navbar: [
    { href: "/", icon: HomeIcon, label: "Home" },
    { href: "/research", icon: FlaskConical, label: "Research" },
    { href: "/agents", icon: Bot, label: "Ask AI" },
    { href: "/cv", icon: FileText, label: "Resume" },
    { href: "/spotify", icon: Icons.spotify, label: "Spotify" },
    { href: "/blockchains", icon: Icons.globe, label: "Blockchains" },
    { href: "/github", icon: Icons.github, label: "GitHub" },
    { href: "/settings", icon: Settings, label: "Settings" },
  ],
  contact: {
    email: "ryzen4540@gmail.com",
    tel: "+91-9918774492",
    social: {
      GitHub: {
        name: "GitHub",
        url: "https://github.com/ryzen-xp",
        icon: Icons.github,
        navbar: false,
      },
      LinkedIn: {
        name: "LinkedIn",
        url: "https://www.linkedin.com/in/ryzen-xp/",
        icon: Icons.linkedin,
        navbar: true,
      },
      LeetCode: {
        name: "LeetCode",
        url: "https://leetcode.com/u/ryzen_xp",
        icon: Icons.leetcode,
        navbar: false,
      },
      Discord: {
        name: "Discord",
        url: "https://discordapp.com/users/1368817799052525614",
        icon: Icons.discord,
        navbar: false,
      },
      Youtube: {
        name: "Youtube",
        url: "#",
        icon: Icons.youtube,
        navbar: false,
      },
      email: {
        name: "Send Email",
        url: "/contact",
        icon: Icons.email,
        navbar: true,
      },
    },
  },

  work: [
    {
      company: "Open Source",
      href: "https://github.com/ryzen-xp",
      badges: ["Open Source"],
      location: "Remote",
      title: "Blockchain Contributor",
      logoUrl: "/stellar.png",
      start: "Aug 2024",
      end: "Present",
      description:
        "Developing and testing smart contracts for Starknet and Stellar ecosystem projects using Cairo and Rust. Built backend integrations for open-source protocol tooling using TypeScript, Axum, Node, and Nest.",
    },
    {
      company: "OnlyDust",
      href: "https://app.onlydust.com",
      badges: ["Fellowship"],
      location: "Remote",
      title: "Starknet Fellowship",
      logoUrl: "/onlydust.png",
      start: "Aug 2025",
      end: "Sept 2025",
      description:
        "Implemented and tested ERC-20 and ERC-721 smart contracts on Starknet using Cairo, Starknet.js, and Snforge. Optimized contract gas usage through efficient storage design and execution-pattern refinement, as part of Starknet ecosystem projects sponsored by OnlyDust.",
    },
    {
      company: "Altibbe Health Private Limited",
      href: "https://www.altibbe.com",
      badges: ["Internship"],
      location: "Hyderabad, India",
      title: "Blockchain Developer Intern",
      logoUrl: "/altibbe.png",
      start: "May 2025",
      end: "June 2025",
      description:
        "Reduced gas costs on production Solidity smart contracts by 30% through storage optimization and contract refactor. Integrated smart contracts with backend systems and built supporting APIs for contract interaction.",
    }
  ],
  education: [
    {
      school: "Chhatrapati Shahu Ji Maharaj University (CSJMU)",
      href: "https://csjmu.ac.in/",
      degree: "Bachelor of Technology — Computer Science and Engineering",
      logoUrl: "/csjmu.png",
      start: "2021",
      end: "2025",
    }
  ],
  projects: [
    {
      title: "Trustless-OSS",
      href: "https://github.com/Trustless-OSS/Trustless-OSS",
      dates: "2026 - Present",
      active: true,
      description:
        "GitHub-integrated bounty platform that auto-releases USDC rewards via Trustless Work escrow on pull-request merge. Implemented GitHub webhook handling, issue-label parsing, and a bot command system for bounty management using Soroban, Rust, Next.js, Axum, Postgres, Redis, BullMQ, and TypeScript.",
      technologies: [
        "Next.js",
        "TypeScript",
        "Rust",
        "Soroban",
        "Axum",
        "PostgreSQL"
      ],
      links: [
        {
          type: "Source",
          href: "https://github.com/Trustless-OSS/Trustless-OSS",
          icon: <Icons.github className="size-3" />,
        },
        {
          type: "Demo",
          href: "https://www.trustless-oss.xyz",
          icon: <Icons.globe className="size-3" />,
        },
      ],
      image: "/projects/trustless-oss.png",
      video: "",
    },
    {
      title: "Alien Protocol",
      href: "https://github.com/Alien-Protocol",
      dates: "2026 - Present",
      active: true,
      description:
        "Building an RWA-backed lending protocol on Stellar using Soroban smart contracts, with collateralized borrowing and oracle-based asset pricing via Chainlink.",
      technologies: [
        "Stellar",
        "Soroban",
        "Rust",
        "Chainlink"
      ],
      links: [
        {
          type: "Source",
          href: "https://github.com/Alien-Protocol",
          icon: <Icons.github className="size-3" />,
        },
        {
          type: "Demo",
          href: "https://www.alien-protocol.xyz",
          icon: <Icons.globe className="size-3" />,
        },
      ],
      image: "/projects/alien-protocol.png",
      video: "",
    },
    {
      title: "NFXP NFT Marketplace",
      href: "https://github.com/ryzen-xp/NFXP",
      dates: "2025",
      active: true,
      description:
        "React web application enabling users to mint ERC-721 tokens, list them for sale, and buy or sell NFTs. Implemented IPFS storage for NFT images and metadata using Solidity, OpenZeppelin, Web3.js, and Foundry.",
      technologies: [
        "React",
        "Solidity",
        "Foundry",
        "IPFS",
        "Web3.js"
      ],
      links: [
        {
          type: "Source",
          href: "https://github.com/ryzen-xp/NFXP",
          icon: <Icons.github className="size-3" />,
        },
        {
          type: "Demo",
          href: "https://nfxp-one.vercel.app/",
          icon: <Icons.globe className="size-3" />,
        },
      ],
      image: "/projects/nfxp.png",
      video: "",
    },
    {
      title: "Charity Chain",
      href: "https://github.com/ryzen-xp/NGO-Crowd-Funding",
      dates: "2025",
      active: true,
      description:
        "Blockchain-based transparent crowdfunding platform for NGOs using Solidity and Hardhat. Implemented smart contracts to manage donations, fund approvals, and withdrawals.",
      technologies: ["Solidity", "Hardhat", "JavaScript"],
      links: [
        {
          type: "Source",
          href: "https://github.com/ryzen-xp/NGO-Crowd-Funding",
          icon: <Icons.github className="size-3" />,
        },
      ],
      image: "/projects/charity-chain.png",
      video: "",
    }
  ],
  hackathons: [
    {
      title: "Boundless x Trustless Work Hackathon",
      dates: "May 2026",
      location: "Remote",
      description: "Won Most Innovative Idea Award for Trustless OSS, an automated USDC bounty-release platform for open-source contributors, built with Stellar, Rust, TypeScript, and Trustless Work escrow APIs.",
      image: "/boundless.png",
      links: [],
    }
  ] as { title: string; dates: string; location: string; description: string; image: string; links: readonly { title: string; icon: React.ReactNode; href: string }[]; }[],
  certifications: [
    {
      title: "Udemy Course Certificate",
      issuer: "Udemy",
      date: "",
      credentialId: "UC-e5fa5377-7674-499b-9546-7be6548f82e4",
      credentialUrl: "https://www.udemy.com/certificate/UC-e5fa5377-7674-499b-9546-7be6548f82e4/",
      logoUrl: "/udemy.png",
    },
  ] as { title: string; issuer: string; date: string; credentialId: string; credentialUrl: string; logoUrl?: string; }[],
  achievements: [
    {
      title: "Most Innovative Idea Award",
      issuer: "Boundless x Trustless Work Hackathon",
      date: "May 2026",
      type: "Award",
      description: "Recognized for Trustless OSS, an automated USDC bounty-release platform for open-source contributors.",
    },
  ],
} as const;
