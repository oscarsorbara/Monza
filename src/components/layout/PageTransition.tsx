import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

// Premium, almost imperceptible page transition.
// Small translateY and opacity only — never triggers layout.
const variants = {
    initial: {
        opacity: 0,
        y: 6
    },
    enter: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.32,
            ease: [0.22, 1, 0.36, 1] // ease-out-quart-ish
        }
    },
    exit: {
        opacity: 0,
        transition: {
            duration: 0.16,
            ease: [0.4, 0, 1, 1] // sharper exit so incoming feels snappier
        }
    }
};

export default function PageTransition({ children }: { children: ReactNode }) {
    return (
        <motion.div
            variants={variants as any}
            initial="initial"
            animate="enter"
            exit="exit"
            className="w-full"
            style={{ willChange: 'opacity, transform' }}
        >
            {children}
        </motion.div>
    );
}
