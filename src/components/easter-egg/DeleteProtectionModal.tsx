import { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { useDeleteProtection } from "@/hooks/useDeleteProtection";
import { PasswordInput } from "./PasswordInput";
import { LoadingSequence } from "./LoadingSequence";

interface DeleteProtectionModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function DeleteProtectionModal({ isOpen, onClose }: DeleteProtectionModalProps) {
    const { 
        state, 
        password, 
        setPassword, 
        errorMsg, 
        shake, 
        currentExcuse,
        handleConvinceMe,
        validatePassword,
        openModal
    } = useDeleteProtection();

    // Reset state when modal opens
    useEffect(() => {
        if (isOpen) {
            openModal();
        }
    }, [isOpen, openModal]);

    // Handle escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
                    onClick={onClose}
                    aria-hidden="true"
                />

                {/* Modal Content */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="relative w-full max-w-[440px] bg-background border border-border shadow-2xl rounded-[24px] overflow-hidden flex flex-col"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="modal-title"
                >
                    {/* Close Button */}
                    <button 
                        onClick={onClose}
                        className="absolute right-4 top-4 p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors z-10"
                        aria-label="Close modal"
                    >
                        <X className="w-4 h-4" />
                    </button>

                    <div className="p-6 sm:p-8">
                        {state === 'PROMPT' && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <div className="space-y-4">
                                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-2">
                                        <span className="text-2xl">🤖</span>
                                    </div>
                                    
                                    <div>
                                        <h2 id="modal-title" className="text-xl font-bold tracking-tight text-foreground">
                                            🫰 Hold on there, Thanos.
                                        </h2>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            Half my projects aren&apos;t disappearing today.
                                        </p>
                                    </div>

                                    <div className="text-sm text-foreground/80 space-y-3 leading-relaxed py-2">
                                        <p>I noticed you&apos;re trying to delete one of my projects.</p>
                                        <p>After reviewing your request... I&apos;ve decided that&apos;s a terrible idea.</p>
                                        <div className="bg-muted/50 p-4 rounded-xl space-y-2 border border-border/50">
                                            <p className="font-medium text-xs uppercase text-muted-foreground tracking-wider mb-3">AI Decision Matrix</p>
                                            <ul className="space-y-2 text-xs">
                                                <li className="flex items-start gap-2">
                                                    <span className="text-primary mt-0.5">•</span>
                                                    <span>It took months to build.</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span className="text-primary mt-0.5">•</span>
                                                    <span>Git would be disappointed.</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span className="text-primary mt-0.5">•</span>
                                                    <span>Future recruiters deserve to see it.</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>

                                    <PasswordInput 
                                        value={password}
                                        onChange={setPassword}
                                        onSubmit={validatePassword}
                                        errorMsg={errorMsg}
                                        shake={shake}
                                    />
                                </div>

                                <div className="mt-8 flex justify-end">
                                    <button
                                        onClick={onClose}
                                        className="px-6 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-colors"
                                    >
                                        Never Mind
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {(state === 'LOADING' || state === 'SUCCESS') && (
                            <LoadingSequence />
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
