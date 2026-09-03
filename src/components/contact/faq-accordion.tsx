"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus } from "lucide-react";

const FAQS = [
    {
        question: "How quickly do you reply?",
        answer: "I aim to respond to all inquiries within 24 hours. For urgent matters, feel free to reach out via LinkedIn or Twitter."
    },
    {
        question: "Do you accept freelance work?",
        answer: "Yes! I occasionally take on freelance projects that align with my skills and interests, particularly in web development and AI integrations."
    },
    {
        question: "Are you open to internships?",
        answer: "Absolutely. I am actively looking for software engineering internships where I can learn from experienced teams and contribute to impactful products."
    },
    {
        question: "Can I collaborate with you?",
        answer: "I love collaborating with other developers! Whether it's an open-source project or a fun weekend hackathon idea, let's chat."
    }
];

export function FAQAccordion() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <div className="flex flex-col gap-8 max-w-3xl mx-auto w-full mt-24">
            <div className="flex flex-col gap-2 text-center">
                <h2 className="text-2xl font-bold tracking-tight">Frequently Asked Questions</h2>
                <p className="text-muted-foreground">Some common questions I get asked.</p>
            </div>

            <div className="flex flex-col gap-4">
                {FAQS.map((faq, i) => {
                    const isOpen = openIndex === i;
                    return (
                        <div 
                            key={i} 
                            className="flex flex-col border border-border rounded-2xl overflow-hidden bg-card transition-colors hover:border-primary/50"
                        >
                            <button
                                onClick={() => setOpenIndex(isOpen ? null : i)}
                                className="flex items-center justify-between p-6 text-left focus:outline-none"
                            >
                                <span className="font-medium text-foreground">{faq.question}</span>
                                <motion.div
                                    animate={{ rotate: isOpen ? 45 : 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="p-1 rounded-full bg-muted text-muted-foreground"
                                >
                                    <Plus className="w-4 h-4" />
                                </motion.div>
                            </button>
                            <AnimatePresence>
                                {isOpen && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                    >
                                        <div className="px-6 pb-6 text-muted-foreground text-sm leading-relaxed">
                                            {faq.answer}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
