"use client";

import { motion } from "motion/react";
import { Code, Users, Briefcase, Globe } from "lucide-react";

const CARDS = [
    {
        title: "Need a Website?",
        description: "Let's discuss your project.",
        icon: <Code className="w-5 h-5 text-blue-500" />
    },
    {
        title: "Looking for an Intern?",
        description: "I'm always excited to learn and contribute.",
        icon: <Users className="w-5 h-5 text-emerald-500" />
    },
    {
        title: "Building a Startup?",
        description: "Let's build something amazing together.",
        icon: <Briefcase className="w-5 h-5 text-amber-500" />
    },
    {
        title: "Open Source Collaboration?",
        description: "I'm happy to contribute.",
        icon: <Globe className="w-5 h-5 text-purple-500" />
    }
];

export function QuickContactCards() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-24">
            {CARDS.map((card, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    whileHover={{ y: -5 }}
                    className="flex flex-col gap-3 p-6 rounded-2xl border border-border bg-card hover:shadow-lg transition-all duration-300 cursor-pointer group"
                >
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center group-hover:scale-110 transition-transform">
                        {card.icon}
                    </div>
                    <h3 className="font-semibold">{card.title}</h3>
                    <p className="text-sm text-muted-foreground">{card.description}</p>
                </motion.div>
            ))}
        </div>
    );
}
