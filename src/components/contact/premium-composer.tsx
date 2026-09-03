"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "motion/react";
import { Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type FormData = z.infer<typeof formSchema>;

const SUGGESTIONS = [
    "Internship",
    "Freelance Project",
    "Collaboration",
    "Startup Idea",
    "Hackathon",
    "Speaking Invitation",
    "General Question"
];

export function PremiumComposer() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            subject: "",
            message: ""
        }
    });

    const currentSubject = watch("subject");
    const currentMessage = watch("message");

    const onSubmit = async (data: FormData) => {
        setIsSubmitting(true);
        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            
            if (response.ok) {
                setIsSuccess(true);
                toast.success("Message sent successfully!");
                setTimeout(() => setIsSuccess(false), 5000);
            } else {
                toast.error("Failed to send message. Please try again.");
            }
        } catch (error) {
            toast.error("An error occurred. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 w-full max-w-xl mx-auto lg:mx-0 relative">
            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-muted-foreground">Your Name</label>
                <div className="relative">
                    <input
                        {...register("name")}
                        disabled={isSubmitting || isSuccess}
                        className={`w-full px-4 py-3 rounded-xl border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${errors.name ? "border-red-500" : "border-border"}`}
                        placeholder="John Doe"
                    />
                    {errors.name && (
                        <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="absolute right-3 top-3 text-red-500">
                            <AlertCircle className="w-5 h-5" />
                        </motion.div>
                    )}
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-muted-foreground">Email Address</label>
                <div className="relative">
                    <input
                        {...register("email")}
                        disabled={isSubmitting || isSuccess}
                        className={`w-full px-4 py-3 rounded-xl border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${errors.email ? "border-red-500" : "border-border"}`}
                        placeholder="john@example.com"
                    />
                    {errors.email && (
                        <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="absolute right-3 top-3 text-red-500">
                            <AlertCircle className="w-5 h-5" />
                        </motion.div>
                    )}
                </div>
            </div>

            <div className="flex flex-col gap-3">
                <label className="text-sm font-medium text-muted-foreground">Subject</label>
                
                {/* Smart Subject Suggestions */}
                <div className="flex flex-wrap gap-2 mb-1">
                    {SUGGESTIONS.map((suggestion) => (
                        <button
                            key={suggestion}
                            type="button"
                            disabled={isSubmitting || isSuccess}
                            onClick={() => setValue("subject", suggestion, { shouldValidate: true })}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${currentSubject === suggestion ? "bg-primary text-primary-foreground border-primary" : "bg-muted text-muted-foreground border-border hover:border-primary/50"}`}
                        >
                            {suggestion}
                        </button>
                    ))}
                </div>

                <div className="relative">
                    <input
                        {...register("subject")}
                        disabled={isSubmitting || isSuccess}
                        className={`w-full px-4 py-3 rounded-xl border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${errors.subject ? "border-red-500" : "border-border"}`}
                        placeholder="What is this regarding?"
                    />
                    {errors.subject && (
                        <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="absolute right-3 top-3 text-red-500">
                            <AlertCircle className="w-5 h-5" />
                        </motion.div>
                    )}
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-muted-foreground flex justify-between">
                    Message
                    <span className="text-xs opacity-50">{currentMessage.length} chars</span>
                </label>
                <div className="relative">
                    <textarea
                        {...register("message")}
                        disabled={isSubmitting || isSuccess}
                        rows={6}
                        className={`w-full px-4 py-3 rounded-xl border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none ${errors.message ? "border-red-500" : "border-border"}`}
                        placeholder="Tell me about your project, timeline, and expectations..."
                    />
                    {errors.message && (
                        <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="absolute right-3 top-3 text-red-500">
                            <AlertCircle className="w-5 h-5" />
                        </motion.div>
                    )}
                </div>
            </div>

            <button
                type="submit"
                disabled={isSubmitting || isSuccess}
                className={`group relative flex items-center justify-center w-full sm:w-auto sm:self-end px-8 py-4 rounded-xl font-medium transition-all duration-300 overflow-hidden ${isSuccess ? "bg-green-500 text-white" : "bg-primary text-primary-foreground hover:bg-primary/90"}`}
            >
                <AnimatePresence mode="wait">
                    {isSubmitting ? (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex items-center gap-2"
                        >
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Sending...
                        </motion.div>
                    ) : isSuccess ? (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex items-center gap-2"
                        >
                            <CheckCircle2 className="w-5 h-5" />
                            Message Sent Successfully
                        </motion.div>
                    ) : (
                        <motion.div
                            key="idle"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex items-center gap-2"
                        >
                            Send Message
                            <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </button>
        </form>
    );
}
