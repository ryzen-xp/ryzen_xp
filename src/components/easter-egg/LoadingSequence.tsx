import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { CheckCircle2, Loader2 } from "lucide-react";

const steps = [
    "Checking permissions...",
    "Verifying ownership...",
    "Talking to Git...",
    "Consulting future recruiters..."
];

export function LoadingSequence() {
    const [currentStep, setCurrentStep] = useState(0);
    const [isDone, setIsDone] = useState(false);

    useEffect(() => {
        let step = 0;
        const interval = setInterval(() => {
            step++;
            if (step >= steps.length) {
                clearInterval(interval);
                setIsDone(true);
            } else {
                setCurrentStep(step);
            }
        }, 800); // Progress every 800ms

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center py-8 min-h-[200px]">
            {!isDone ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center gap-4 text-muted-foreground"
                >
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    <p className="text-sm font-medium">{steps[currentStep]}</p>
                </motion.div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center gap-4 text-center"
                >
                    <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                    <div>
                        <h3 className="text-lg font-semibold text-foreground">Access Granted.</h3>
                        <p className="text-sm text-muted-foreground mt-1">...</p>
                        <motion.p 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1 }}
                            className="text-sm font-medium mt-4 text-foreground"
                        >
                            Just kidding 😄<br />Nothing gets deleted.
                        </motion.p>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
