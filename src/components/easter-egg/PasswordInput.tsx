import { motion } from "motion/react";
import { Lock } from "lucide-react";

interface PasswordInputProps {
    value: string;
    onChange: (val: string) => void;
    onSubmit: () => void;
    errorMsg: string | null;
    shake: boolean;
}

export function PasswordInput({ value, onChange, onSubmit, errorMsg, shake }: PasswordInputProps) {
    return (
        <div className="w-full mt-6">
            <form onSubmit={onSubmit} className="relative">
                <motion.div
                    animate={shake ? { x: [-10, 10, -10, 10, -5, 5, 0] } : {}}
                    transition={{ duration: 0.4 }}
                    className="relative"
                >
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <input
                        type="password"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder="Enter Master Password"
                        className={`block w-full pl-10 pr-3 py-2.5 border rounded-xl text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                            errorMsg 
                                ? "border-red-500/50 bg-red-500/5 focus:border-red-500" 
                                : "border-border bg-muted/50 focus:border-primary"
                        }`}
                    />
                </motion.div>
            </form>
            
            <div className="min-h-[24px] mt-2">
                {errorMsg && (
                    <motion.p 
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs text-red-500 font-medium whitespace-pre-line"
                    >
                        {errorMsg}
                    </motion.p>
                )}
            </div>
        </div>
    );
}
