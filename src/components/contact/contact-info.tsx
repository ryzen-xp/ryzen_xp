"use client";

import { motion } from "motion/react";
import { Mail, MapPin, Clock, CheckCircle2, Copy } from "lucide-react";
import { toast } from "sonner";
import { DATA } from "@/data/resume";

export function ContactInfo() {
    const handleCopyEmail = () => {
        navigator.clipboard.writeText(DATA.contact.email);
        toast.success("Email copied successfully");
    };

    return (
        <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-8">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="flex items-start gap-4"
                >
                    <div className="p-3 bg-muted rounded-xl text-primary">
                        <Mail className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Email</span>
                        <div className="flex items-center gap-3">
                            <span className="text-lg font-medium">{DATA.contact.email}</span>
                            <button 
                                onClick={handleCopyEmail}
                                className="p-1.5 hover:bg-muted rounded-md transition-colors text-muted-foreground hover:text-foreground"
                                aria-label="Copy Email"
                            >
                                <Copy className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="flex items-start gap-4"
                >
                    <div className="p-3 bg-muted rounded-xl text-primary">
                        <MapPin className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Location</span>
                        <span className="text-lg font-medium">{DATA.location}</span>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="flex items-start gap-4"
                >
                    <div className="p-3 bg-muted rounded-xl text-primary">
                        <Clock className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Response Time</span>
                        <span className="text-lg font-medium">Usually within 24 hours</span>
                    </div>
                </motion.div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="flex flex-col gap-4 p-6 bg-muted/50 rounded-2xl border border-border"
            >
                <div className="flex items-center gap-2 mb-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    <span className="font-semibold tracking-tight">Currently Available For</span>
                </div>
                
                <ul className="flex flex-col gap-3">
                    {[
                        "Internships",
                        "Hackathons",
                        "Open Source",
                        "Freelance",
                        "Startup Collaborations"
                    ].map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-muted-foreground font-medium">
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                            {item}
                        </li>
                    ))}
                </ul>
            </motion.div>
        </div>
    );
}
