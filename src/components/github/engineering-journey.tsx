"use client";

import { motion } from "motion/react";
import { CheckCircle2, GitCommit, Rocket, Database, Lock, Cpu, Globe } from "lucide-react";

const journeySteps = [
    {
        title: "Cairo and Starknet",
        description: "Started writing and testing ERC-20 and ERC-721 contracts on Starknet with Cairo, Starknet.js, and Snforge.",
        icon: <Rocket className="w-5 h-5 text-blue-500" />,
        date: "Phase 1"
    },
    {
        title: "Gas Optimization at Altibbe",
        description: "Cut production Solidity contract gas costs by 30% through storage layout and refactor work, then wired contracts into backend APIs.",
        icon: <Lock className="w-5 h-5 text-green-500" />,
        date: "Phase 2"
    },
    {
        title: "OnlyDust Fellowship",
        description: "Shipped Starknet ecosystem contracts with tighter storage design and execution patterns under OnlyDust sponsorship.",
        icon: <Database className="w-5 h-5 text-purple-500" />,
        date: "Phase 3"
    },
    {
        title: "Trustless OSS",
        description: "Built a GitHub-integrated USDC bounty platform on Stellar with Soroban escrow, webhooks, and a TypeScript/Axum backend.",
        icon: <Cpu className="w-5 h-5 text-amber-500" />,
        date: "Phase 4"
    },
    {
        title: "Hackathon Award",
        description: "Won Most Innovative Idea at Boundless x Trustless Work for the Trustless OSS bounty-release flow.",
        icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
        date: "Phase 5"
    },
    {
        title: "Open Source Contributions",
        description: "20+ months contributing smart contracts and protocol tooling across Starknet, Stellar, and EVM ecosystems.",
        icon: <Globe className="w-5 h-5 text-indigo-500" />,
        date: "Ongoing"
    },
    {
        title: "Alien Protocol",
        description: "Building RWA-backed lending on Stellar with Soroban contracts and Chainlink oracle pricing.",
        icon: <GitCommit className="w-5 h-5 text-pink-500" />,
        date: "Present"
    }
];

export function EngineeringJourney() {
    return (
        <section id="timeline" className="flex flex-col gap-12 py-12">
            <div className="flex flex-col gap-4 text-center items-center">
                <h2 className="text-3xl font-bold tracking-tight">Engineering Journey</h2>
                <p className="text-muted-foreground max-w-xl">
                    Every repository represents a learning milestone. Here is the story of my core development focus over time.
                </p>
            </div>

            <div className="relative max-w-3xl mx-auto w-full">
                {/* Vertical Line */}
                <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-border -translate-x-1/2" />

                <div className="flex flex-col gap-12 relative z-10">
                    {journeySteps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className={`flex flex-col md:flex-row items-start md:items-center gap-6 ${index % 2 === 0 ? "md:flex-row-reverse" : ""}`}
                        >
                            {/* Content Side */}
                            <div className={`flex-1 flex flex-col gap-2 w-full pl-12 md:pl-0 ${index % 2 === 0 ? "md:text-left" : "md:text-right"}`}>
                                <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">{step.date}</span>
                                <h3 className="text-lg font-semibold">{step.title}</h3>
                                <p className="text-sm text-muted-foreground">{step.description}</p>
                            </div>

                            {/* Node */}
                            <div className="absolute left-4 md:relative md:left-auto flex items-center justify-center w-8 h-8 rounded-full bg-background border border-border shadow-sm -translate-x-1/2 md:translate-x-0 z-10">
                                {step.icon}
                            </div>

                            {/* Empty Space for alignment */}
                            <div className="hidden md:block flex-1" />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
