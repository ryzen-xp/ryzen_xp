import { useState, useCallback } from "react";
import { funnyExcuses } from "@/utils/funnyExcuses";
import { wrongPasswordMessages, specialPasswords } from "@/utils/passwordResponses";
import { unlockAchievement } from "@/utils/achievements";

export type ModalState = 'IDLE' | 'PROMPT' | 'LOADING' | 'SUCCESS';

export function useDeleteProtection() {
    const [state, setState] = useState<ModalState>('IDLE');
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [shake, setShake] = useState(false);
    
    // Convince Me button state
    const [excuseIndex, setExcuseIndex] = useState(0);

    const openModal = useCallback(() => {
        setState('PROMPT');
        setPassword("");
        setErrorMsg(null);
    }, []);

    const closeModal = useCallback(() => {
        setState('IDLE');
    }, []);

    const handleConvinceMe = useCallback(() => {
        setExcuseIndex((prev) => (prev + 1) % funnyExcuses.length);
    }, []);

    const currentExcuse = funnyExcuses[excuseIndex];

    const validatePassword = useCallback((e?: React.FormEvent) => {
        if (e) e.preventDefault();
        
        const normalized = password.toLowerCase().trim();

        if (normalized === "raj123") {
            setErrorMsg(null);
            setState('LOADING');
            
            // Simulate the fake loading sequence
            setTimeout(() => {
                setState('SUCCESS');
                unlockAchievement();
                
                // Auto close after showing success
                setTimeout(() => {
                    closeModal();
                }, 3000);
            }, 4000); // 4 seconds of fake loading
            return;
        }

        // Trigger shake
        setShake(true);
        setTimeout(() => setShake(false), 500);

        // Check for special easter egg passwords
        if (specialPasswords[normalized]) {
            setErrorMsg(specialPasswords[normalized]);
        } else {
            // Random wrong password message
            const randomMsg = wrongPasswordMessages[Math.floor(Math.random() * wrongPasswordMessages.length)];
            setErrorMsg(randomMsg);
        }
    }, [password, closeModal]);

    return {
        state,
        password,
        setPassword,
        errorMsg,
        shake,
        currentExcuse,
        openModal,
        closeModal,
        handleConvinceMe,
        validatePassword
    };
}
