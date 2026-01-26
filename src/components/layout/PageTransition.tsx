import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

// Cuberto style: Smooth reveal, often swipe or fade
const variants = {
    initial: {
        opacity: 0,
        y: 100
    },
    enter: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 1.0,
            ease: [0.25, 1, 0.5, 1], // Quart ease out
        }
    },
    exit: {
        opacity: 0,
        y: -50,
        transition: {
            duration: 0.5,
            ease: [0.25, 1, 0.5, 1],
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
        >
            {children}
        </motion.div>
    );
}
